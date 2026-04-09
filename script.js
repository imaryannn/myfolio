/* ========================================
   ARYAN — Minimalist Portfolio | JS Elements
   ======================================== */

(function () {
    'use strict';

    // ============================
    // PRELOADER
    // ============================
    const preloader = document.getElementById('preloader');

    // Block scroll during preload
    document.body.style.overflow = 'hidden';

    window.addEventListener('load', () => {
        // Minimal timeout for aesthetic load line
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            // Delay entrance slightly after preloader hides
            setTimeout(initAnimations, 300);
        }, 1500); 
    });

    // ============================
    // SCROLL PROGRESS SCROLL LINE
    // ============================
    const scrollProgress = document.getElementById('scroll-progress');
    
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const rootHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = rootHeight > 0 ? (scrollTop / rootHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ============================
    // NAVIGATION & MOBILE MENU
    // ============================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ============================
    // GSAP & SCROLL ANIMATIONS
    // ============================
    function initAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            initFallbackReveal();
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // --- Hero Entrance Sequence ---
        const tl = gsap.timeline();
        
        tl.to('.hero-title', { 
            y: '0%', 
            opacity: 1, 
            duration: 1.4, 
            ease: 'power3.out' 
        })
        .to('.hero-subtitle', { 
            y: '0%', 
            opacity: 1, 
            duration: 1.2, 
            ease: 'power3.out' 
        }, '-=1.2')
        .from('.reveal-fade', { 
            y: 20, 
            opacity: 0, 
            duration: 1.2, 
            ease: 'power2.out',
            stagger: 0.2
        }, '-=0.8')
        .from('.scroll-indicator', {
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        }, '-=0.5');

        // --- Hero Subtle Parallax Shapes ---
        gsap.utils.toArray('.shape').forEach(shape => {
            const depth = parseFloat(shape.getAttribute('data-parallax')) || 0.1;
            
            gsap.to(shape, {
                y: () => window.innerHeight * depth,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        // --- Standard Section Reveals ---
        const revealElements = gsap.utils.toArray('[data-reveal]');
        
        revealElements.forEach(el => {
            gsap.to(el, {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // --- Abstract Shape Rotation/Scale Parallax ---
        if(document.querySelector('.abstract-shape')) {
            gsap.to('.abstract-shape', {
                rotation: 45,
                scale: 1.1,
                scrollTrigger: {
                    trigger: '.about',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });
        }
    }

    // Fallback if GSAP fails to load
    function initFallbackReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Manually trigger hero elements
        document.querySelectorAll('.hero-title, .hero-subtitle').forEach(el => {
            el.style.opacity = 1;
            el.style.transform = 'translateY(0)';
        });
        
        document.querySelectorAll('[data-reveal]').forEach(el => {
            observer.observe(el);
        });
    }

    // ============================
    // SMOOTH INTERNAL LINKING
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const navHeight = navbar.offsetHeight;
                const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================
    // CONTACT FORM INTERACTION
    // ============================
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.textContent = 'Sending...';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';
            
            // Simulate network request
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
                
                const status = form.querySelector('.form-status');
                status.classList.add('active');
                form.reset();
                
                setTimeout(() => {
                    status.classList.remove('active');
                }, 4000);
            }, 1500);
        });
    }

})();
