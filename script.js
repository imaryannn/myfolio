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
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        // If mobile nav overlay existed, toggle it here
    });

    // ============================
    // GSAP LOGIC
    // ============================
    function initAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            document.querySelectorAll('[data-reveal]').forEach(el => {
                el.style.opacity = 1;
                el.style.transform = 'translateY(0)';
            });
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // --- Deep HERO Parallax Parallax ---
        const heroBg = document.querySelector('.hero-bg-container');
        
        // Grid texture scales and shifts slowly (Removed since bg is removed)

        // Floating Rock (Removed)
        // Floating Cache (Removed)

        // --- Content Reveals ---
        const reveals = gsap.utils.toArray('[data-reveal]');
        reveals.forEach(el => {
            const direction = el.getAttribute('data-reveal');
            const delay = parseFloat(el.getAttribute('data-delay')) || 0;
            
            let options = {
                opacity: 1,
                y: 0,
                x: 0,
                duration: 1,
                delay: delay,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            };

            gsap.to(el, options);
        });

        // --- Wireframe Cube Scroll Spin ---
        const cube = document.querySelector('.wireframe-cube');
        if (cube) {
            gsap.to(cube, {
                rotationY: 180,
                rotationZ: 180,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.about',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }
        
        // --- Image Parallax inside Projects ---
        gsap.utils.toArray('.project-media .parallax-img').forEach(img => {
            gsap.to(img, {
                yPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
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
            .skill-group.animate-bars .bar::after {
                animation: fillBar 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes fillBar {
                from { clip-path: inset(0 100% 0 0); }
                to { clip-path: inset(0 0 0 0); }
            }
            .skill-list li span.bar::after {
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
    // FORM SUBMISSION (Terminal aesthetic)
    // ============================
    const form = document.querySelector('.terminal-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const status = form.querySelector('.form-status');
            
            btn.innerHTML = 'Sending... [██████    ] 50%';
            btn.style.pointerEvents = 'none';

            setTimeout(() => {
                btn.innerHTML = 'Transmit Buffer';
                btn.style.pointerEvents = 'auto';
                status.classList.add('active');
                form.reset();
                setTimeout(() => status.classList.remove('active'), 3000);
            }, 1000);
        });
    }

})();
