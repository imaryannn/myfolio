/* ========================================
   ARYAN — Frontier Redesign | JS Engine
   ======================================== */

(function () {
    'use strict';

    // ============================
    // NAVIGATION SHRINK
    // ============================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // ============================
    // MOBILE NAV
    // ============================
    const navToggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Clone nav links to mobile menu
    if (mobileNav && navLinks.length > 0) {
        navLinks.forEach(link => {
            const clone = link.cloneNode(true);
            mobileNav.appendChild(clone);
        });
    }
    
    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        mobileNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                navToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
    }

    // ============================
    // GSAP LOGIC
    // ============================
    function initAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            document.querySelectorAll('[data-reveal]').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // Grid texture scales and shifts slowly (Removed since bg is removed)

        // Floating Rock (Removed)
        // Floating Cache (Removed)

        // --- Content Reveals ---
        const reveals = gsap.utils.toArray('[data-reveal]');
        reveals.forEach(el => {
            const direction = el.getAttribute('data-reveal');
            const delay = parseFloat(el.getAttribute('data-delay')) || 0;

            const toVars = {
                opacity: 1, y: 0, x: 0,
                duration: 1, delay,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            };
            if (direction === 'fade-up') el.style.transform = 'translateY(60px)';
            if (direction === 'fade-right') el.style.transform = 'translateX(-60px)';
            if (direction === 'fade-left') el.style.transform = 'translateX(60px)';
            el.style.opacity = '0';
            gsap.to(el, toVars);
        });

        // ================================
        // PARALLAX LAYERS
        // ================================

        // Section headings drift up slower than scroll
        gsap.utils.toArray('.section-heading').forEach(el => {
            gsap.to(el, {
                yPercent: -15,
                ease: 'none',
                scrollTrigger: {
                    trigger: el.closest('section'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });
        });

        // Section labels drift up slightly faster
        gsap.utils.toArray('.section-label').forEach(el => {
            gsap.to(el, {
                yPercent: -25,
                ease: 'none',
                scrollTrigger: {
                    trigger: el.closest('section'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });

        // About wireframe cube spins + drifts
        const cube = document.querySelector('.wireframe-cube');
        if (cube) {
            gsap.to(cube, {
                rotationY: 360,
                rotationZ: 90,
                yPercent: -30,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.about',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });
        }

        // Project rows nudge upward at staggered depths
        gsap.utils.toArray('.project-row').forEach((row, i) => {
            gsap.to(row, {
                yPercent: -8 * (i % 2 === 0 ? 1 : 1.5),
                ease: 'none',
                scrollTrigger: {
                    trigger: row,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });

        // Terminal wires in projects — no parallax (static)

        // Skill groups float upward
        gsap.utils.toArray('.skill-group').forEach((el, i) => {
            gsap.to(el, {
                yPercent: -10 - i * 3,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.skills',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });

        // Contact box drifts up
        gsap.to('.contact-box', {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
                trigger: '.contact',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });

        // --- Skill Bars Animate ---
        gsap.utils.toArray('.bar::after').forEach(bar => {
            // Note: pseudo-elements can't be easily animated directly by JS without CSS var injection or class toggle.
            // Using a class toggle approach.
        });
        
        const skillGroups = gsap.utils.toArray('.skill-group');
        skillGroups.forEach(group => {
            ScrollTrigger.create({
                trigger: group,
                start: 'top 85%',
                onEnter: () => group.classList.add('animate-bars')
            });
        });
        
        // Manually inject style to run animation on entering
        const style = document.createElement('style');
        style.textContent = `
            .skill-group.animate-bars .bar-fill {
                animation: fillBar 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes fillBar {
                from { clip-path: inset(0 100% 0 0); }
                to { clip-path: inset(0 0 0 0); }
            }
            .bar-fill {
                clip-path: inset(0 100% 0 0); /* Start hidden */
            }
        `;
        document.head.appendChild(style);
    }

    // Call on load
    window.addEventListener('load', () => {
        // Wait minor delay for image loads
        setTimeout(initAnimations, 100);
    });

    // ============================
    // HERO TERMINAL — TYPEWRITER
    // ============================
    const heroForm = document.getElementById('hero-terminal-form');
    const heroInput = document.getElementById('hero-term-input');
    const heroBody = document.getElementById('hero-terminal-body');

    const bootLines = [
        { text: 'ARYAN_CORE.EXE [Version 1.0.0]', color: '', delay: 0 },
        { text: '(c) Aryan Corp. All rights reserved.', color: 'var(--text-muted)', delay: 600 },
        { text: '', color: '', delay: 900 },
        { text: '> Booting developer profile...', color: 'var(--accent-cyan)', delay: 1200 },
        { text: '> Name:     Aryan', color: '', delay: 2000 },
        { text: '> Role:     Full Stack Developer', color: '', delay: 2700 },
        { text: '> Skills:   Node · Express · Socket.io · MongoDB', color: '', delay: 3500 },
        { text: '> Frontend: HTML · CSS · JavaScript (ES6+)', color: '', delay: 4300 },
        { text: '> Deployed: ZyroMeet · NodeChat · Prioramail · Syncyt', color: '', delay: 5100 },
        { text: '', color: '', delay: 5900 },
        { text: '> Status:   ONLINE & READY TO BUILD 🚀', color: '#27c93f', delay: 6300 },
        { text: '', color: '', delay: 7000 },
        { text: 'Type "help" to interact...', color: 'var(--text-muted)', delay: 7500 },
    ];

    function typeLine(lineEl, text, speed = 30, cb) {
        let i = 0;
        lineEl.textContent = '';
        const interval = setInterval(() => {
            lineEl.textContent += text[i];
            i++;
            heroBody.scrollTop = heroBody.scrollHeight;
            if (i >= text.length) {
                clearInterval(interval);
                if (cb) cb();
            }
        }, speed);
    }

    function runBoot() {
        let queue = [...bootLines];

        function next() {
            if (!queue.length) {
                // Reveal interactive input
                heroForm.style.display = 'flex';
                heroInput.focus();
                return;
            }
            const line = queue.shift();
            setTimeout(() => {
                const span = document.createElement('span');
                span.className = 'term-line';
                if (line.color) span.style.color = line.color;
                heroForm.before(span);

                if (line.text === '') {
                    span.innerHTML = '&nbsp;';
                    next();
                } else {
                    typeLine(span, line.text, 25, next);
                }
            }, queue.length === bootLines.length - 1 ? line.delay : 0);
        }

        // Sequential with delays between lines
        bootLines.forEach((line, idx) => {
            setTimeout(() => {
                const span = document.createElement('span');
                span.className = 'term-line';
                if (line.color) span.style.color = line.color;
                heroForm.before(span);

                if (line.text === '') {
                    span.innerHTML = '&nbsp;';
                } else {
                    typeLine(span, line.text, 22);
                }
                heroBody.scrollTop = heroBody.scrollHeight;

                if (idx === bootLines.length - 1) {
                    setTimeout(() => {
                        heroForm.style.display = 'flex';
                        heroInput.focus();
                    }, 1500);
                }
            }, line.delay);
        });
    }

    if (heroBody) {
        setTimeout(runBoot, 600);
    }

    if (heroForm) {
        heroBody.addEventListener('click', () => heroInput.focus());

        heroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = heroInput.value.trim().toLowerCase();
            if (!val) return;

            const echo = document.createElement('span');
            echo.className = 'term-line';
            echo.style.color = 'var(--accent-copper)';
            echo.textContent = 'C:\\Users\\Aryan> ' + val;
            heroForm.before(echo);

            const response = document.createElement('span');
            response.className = 'term-line';
            response.style.color = 'var(--accent-cyan)';

            switch(val) {
                case 'help':
                    response.textContent = 'commands: help, about, skills, projects, clear, whoami, sudo';
                    break;
                case 'about':
                case 'whoami':
                    response.textContent = 'Aryan — Full Stack Dev. Builder of real-time systems and clean interfaces.';
                    break;
                case 'skills':
                    response.textContent = 'JS · HTML · CSS · Node · Express · Socket.io · MongoDB · REST · Git';
                    break;
                case 'projects':
                    response.textContent = 'Scrolling to Deployed Assets...';
                    setTimeout(() => document.getElementById('projects').scrollIntoView({behavior: 'smooth'}), 500);
                    break;
                case 'clear':
                    Array.from(heroBody.querySelectorAll('.term-line')).forEach(el => el.remove());
                    heroInput.value = '';
                    return;
                case 'sudo':
                    response.textContent = 'Access denied. Nice try.';
                    response.style.color = 'var(--accent-red)';
                    break;
                default:
                    response.textContent = `'${val}' is not recognized. Type 'help'.`;
                    response.style.color = 'var(--text-muted)';
            }

            heroForm.before(response);
            heroInput.value = '';
            heroBody.scrollTop = heroBody.scrollHeight;
        });
    }

    // ============================
    // FORM SUBMISSION — Web3Forms
    // ============================
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const status = form.querySelector('.form-status');

            btn.innerHTML = 'Transmitting... [████████  ] 80%';
            btn.style.pointerEvents = 'none';

            const data = new FormData(form);

            try {
                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: data
                });
                const json = await res.json();

                if (json.success) {
                    btn.innerHTML = 'Transmit Buffer';
                    btn.style.pointerEvents = 'auto';
                    status.textContent = '✓ Payload delivered. I\'ll be in touch.';
                    status.style.color = '#27c93f';
                    status.classList.add('active');
                    form.reset();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (err) {
                btn.innerHTML = 'Transmit Buffer';
                btn.style.pointerEvents = 'auto';
                status.textContent = '✗ Transmission failed. Try again.';
                status.style.color = 'var(--accent-red)';
                status.classList.add('active');
            }

            setTimeout(() => {
                status.classList.remove('active');
                status.style.color = '';
            }, 4000);
        });
    }

})();
