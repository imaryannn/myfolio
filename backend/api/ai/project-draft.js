module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    const tryParseDraft = (rawText) => {
        if (!rawText) return null;

        const cleanText = rawText
            .trim()
            .replace(/^```(?:json)?/i, '')
            .replace(/```$/i, '')
            .trim();

        const attempts = [cleanText];
        const firstBrace = cleanText.indexOf('{');
        const lastBrace = cleanText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            attempts.push(cleanText.slice(firstBrace, lastBrace + 1));
        }

        for (const candidate of attempts) {
            try {
                return JSON.parse(candidate);
            } catch (_) {
                // keep trying
            }
        }

        return null;
    };

    const systemPrompt = `
You turn a short portfolio project description into strict JSON.
Return only valid JSON with these fields:
name, category, description, techStack, link, terminalOutput, order.

Rules:
- name: short project name
- category: use a concise label like "Protocol: App"
- description: 1-3 sentences, polished but factual
- techStack: array of strings
- link: URL if the user provided one, otherwise empty string
- terminalOutput: array of short terminal-style strings, can be empty
- order: number, default 0
- Do not wrap in markdown.
- Do not add extra keys.
`.trim();

    try {
        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey,
                },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: systemPrompt }],
                    },
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                { text: `Project description:\n${prompt}` },
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.2,
                        responseMimeType: 'application/json',
                        responseJsonSchema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                category: { type: 'string' },
                                description: { type: 'string' },
                                techStack: {
                                    type: 'array',
                                    items: { type: 'string' },
                                },
                                link: { type: 'string' },
                                terminalOutput: {
                                    type: 'array',
                                    items: { type: 'string' },
                                },
                                order: { type: 'number' },
                            },
                            required: ['name', 'category', 'description', 'techStack', 'link', 'terminalOutput', 'order'],
                            additionalProperties: false,
                        },
                    },
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({
                error: data?.error?.message || data?.error?.details?.[0]?.message || `Gemini request failed (${response.status})`,
            });
        }

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            return res.status(500).json({ error: 'Empty Gemini response' });
        }

        const draft = tryParseDraft(text);
        if (!draft || typeof draft !== 'object') {
            return res.status(500).json({ error: 'Gemini returned invalid JSON' });
        }

        res.status(200).json({
            success: true,
            draft: {
                name: draft.name || '',
                category: draft.category || 'Protocol: App',
                description: draft.description || '',
                techStack: Array.isArray(draft.techStack) ? draft.techStack : [],
                link: draft.link || '',
                terminalOutput: Array.isArray(draft.terminalOutput) ? draft.terminalOutput : [],
                order: Number.isFinite(draft.order) ? draft.order : 0,
            },
        });
    } catch (error) {
        console.error('Gemini draft error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
