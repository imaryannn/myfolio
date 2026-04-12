(function () {
    'use strict';
    let lenis = null;
    function initSmoothScroll() {
        if (window.innerWidth > 1024 && typeof Lenis !== 'undefined') {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
                infinite: false,
            });
            function raf(time) {
                if (lenis) {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                }
            }
            requestAnimationFrame(raf);
            console.log('✅ Lenis Smooth Scroll Enabled');
            let terminalActive = false;
            document.addEventListener('mouseenter', (e) => {
                if (e.target.closest('.hero-right .terminal-body')) {
                    terminalActive = true;
                    if (lenis) lenis.stop();
                }
            }, true);
            document.addEventListener('mouseleave', (e) => {
                if (e.target.closest('.hero-right .terminal-body')) {
                    terminalActive = false;
                    if (lenis) lenis.start();
                }
            }, true);
        } else if (typeof Lenis === 'undefined') {
            console.warn('⚠️ Lenis library not loaded');
        }
    }
    initSmoothScroll();
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 1024 && !lenis) {
                initSmoothScroll();
            } else if (window.innerWidth <= 1024 && lenis) {
                lenis.destroy();
                lenis = null;
            }
        }, 250);
    });
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
    const navToggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const navLinks = document.querySelectorAll('.nav-link');
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
        mobileNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                navToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
    }
    function initAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            document.querySelectorAll('[data-reveal]').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }
        gsap.registerPlugin(ScrollTrigger);
        if (lenis) {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                if (lenis) {
                    lenis.raf(time * 1000);
                }
            });
            gsap.ticker.lagSmoothing(0);
        }
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
        const isDesktop = window.innerWidth > 1024;
        if (isDesktop) {
            gsap.to('.global-grid', {
                backgroundPosition: '0px 400px',
                ease: 'none',
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 3
                }
            });
            gsap.to('.hero-right', {
                yPercent: -35,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 2
                }
            });
            gsap.to('.hero-left', {
                yPercent: -15,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });
        }
        gsap.utils.toArray('.section-heading').forEach(el => {
            gsap.to(el, {
                yPercent: isDesktop ? -25 : -5,
                ease: 'none',
                scrollTrigger: {
                    trigger: el.closest('section'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: isDesktop ? 2 : 0.5
                }
            });
        });
        gsap.utils.toArray('.section-label').forEach(el => {
            gsap.to(el, {
                yPercent: isDesktop ? -40 : -8,
                ease: 'none',
                scrollTrigger: {
                    trigger: el.closest('section'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: isDesktop ? 1.5 : 0.5
                }
            });
        });
        const cube = document.querySelector('.wireframe-cube');
        if (cube) {
            gsap.to(cube, {
                rotationY: isDesktop ? 720 : 180,
                rotationZ: isDesktop ? 180 : 45,
                yPercent: isDesktop ? -50 : -10,
                scale: isDesktop ? 1.1 : 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.about',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: isDesktop ? 2 : 0.5
                }
            });
        }
        gsap.utils.toArray('.skill-group').forEach((el, i) => {
            gsap.to(el, {
                yPercent: isDesktop ? -15 - i * 5 : -5,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.skills',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: isDesktop ? 1.5 : 0.5
                }
            });
        });
        gsap.to('.contact-box', {
            yPercent: isDesktop ? -20 : -5,
            scale: isDesktop ? 1.02 : 1,
            ease: 'none',
            scrollTrigger: {
                trigger: '.contact',
                start: 'top bottom',
                end: 'bottom top',
                scrub: isDesktop ? 1.5 : 0.5
            }
        });
        gsap.utils.toArray('.bar::after').forEach(bar => {
        });
        const skillGroups = gsap.utils.toArray('.skill-group');
        skillGroups.forEach(group => {
            ScrollTrigger.create({
                trigger: group,
                start: 'top 85%',
                onEnter: () => group.classList.add('animate-bars')
            });
        });
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
    window.addEventListener('load', () => {
        setTimeout(initAnimations, 100);
    });
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
async function loadDynamicContent() {
    try {
        const projectsRes = await fetch(`${API_BASE_URL}/api/projects`);
        const projectsData = await projectsRes.json();
        if (projectsData.success && projectsData.projects) {
            const projectList = document.querySelector('.project-list');
            projectList.innerHTML = projectsData.projects.map((p, i) => `
                <article class="project-row">
                    <div class="project-content">
                        <span class="project-category">${p.category}</span>
                        <h3 class="project-name">${p.name}</h3>
                        <p class="project-snippet">${p.description}</p>
                        <div class="project-tech">
                            ${p.tech.map(t => `<span>${t}</span>`).join('')}
                        </div>
                        <a href="${p.url}" target="_blank" class="btn btn-outline">Access Module</a>
                    </div>
                    <div class="project-media">
                        <div class="terminal-wire">
                            <div class="terminal-header"><span class="dot"></span><span class="dot"></span><span class="dot"></span> ${p.name.toUpperCase().replace(/ /g, '_')}.SYS</div>
                            <div class="terminal-body">
                                <span class="term-line">> loading ${p.name}...</span>
                                <span class="term-line">> initializing modules...</span>
                                <span class="term-line" style="color:var(--accent-cyan);">> system ready</span>
                                <div class="term-loader"></div>
                            </div>
                        </div>
                    </div>
                </article>
            `).join('');
        }
        const skillsRes = await fetch(`${API_BASE_URL}/api/skills`);
        const skillsData = await skillsRes.json();
        if (skillsData.success && skillsData.skills) {
            const skillsWrapper = document.querySelector('.skills-wrapper');
            skillsWrapper.innerHTML = skillsData.skills.map((s, i) => `
                <div class="skill-group animate-bars">
                    <h3 class="skill-title">${s.category}</h3>
                    <ul class="skill-list">
                        ${s.items.map(item => `
                            <li><span>${item.name}</span> <div class="bar-bg"><div class="bar-fill" style="width: ${item.level}%;"></div></div></li>
                        `).join('')}
                    </ul>
                </div>
            `).join('');
        }
        const profileRes = await fetch(`${API_BASE_URL}/api/profile`);
        const profileData = await profileRes.json();
        if (profileData.success && profileData.profile) {
            const p = profileData.profile;
            if (p.hero) {
                const heroTitle = document.querySelector('.hero-title');
                const heroSubtitle = document.querySelector('.hero-subtitle');
                const heroDesc = document.querySelector('.hero-desc');
                if (heroTitle) heroTitle.textContent = p.hero.title || 'ARYAN';
                if (heroSubtitle) heroSubtitle.textContent = '// ' + (p.hero.subtitle || 'Full Stack Developer');
                if (heroDesc) heroDesc.textContent = p.hero.description || '';
            }
            if (p.about) {
                const aboutText = document.querySelector('.about-text');
                if (aboutText) {
                    aboutText.innerHTML = `<p>${p.about.text}</p><a href="#contact" class="btn-link mt-8">Connect Securely -></a>`;
                }
            }
            if (p.contact) {
                const footerLinks = document.querySelector('.footer-links');
                if (footerLinks) {
                    footerLinks.innerHTML = `
                        <a href="${p.contact.github}" target="_blank">[ Github ]</a>
                        <a href="${p.contact.linkedin}" target="_blank">[ LinkedIn ]</a>
                    `;
                }
            }
        }
        const statusRes = await fetch(`${API_BASE_URL}/api/status`);
        const statusData = await statusRes.json();
        if (statusData.success) {
            const statusElement = document.querySelector('.footer-inner > div:last-child');
            if (statusElement) {
                const isOnline = statusData.online !== false;
                statusElement.textContent = isOnline ? 'STATUS: ONLINE' : 'STATUS: OFFLINE';
                statusElement.style.color = isOnline ? '#27c93f' : 'var(--accent-red)';
            }
        }
    } catch (error) {
        console.error('Error loading dynamic content:', error);
    }
}
if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
    loadDynamicContent();
}