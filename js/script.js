/* ==============================================
   Reset Scroll on Reload (Index ONLY)
   ============================================== */
(function () {
    const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
    if (isIndex) {
        let isReload = false;
        if (window.performance) {
            if (window.performance.navigation && window.performance.navigation.type === 1) {
                isReload = true;
            }
            if (window.performance.getEntriesByType) {
                const navExp = window.performance.getEntriesByType("navigation");
                if (navExp.length > 0 && navExp[0].type === "reload") {
                    isReload = true;
                }
            }
        }

        if (isReload) {
            window.history.replaceState(null, '', window.location.pathname);
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }
            window.scrollTo(0, 0);
            setTimeout(() => window.scrollTo(0, 0), 20);
        }
    }
})();

document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================
       Theme Toggle Logic (Light / Dark mode)
       ============================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        // Optionale: check user OS preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    /* ==============================================
       Topbar Scroll Effect
       ============================================== */
    const topbar = document.querySelector('.topbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            topbar.classList.add('scrolled');
        } else {
            topbar.classList.remove('scrolled');
        }
    });

    /* ==============================================
       Mobile menu toggle
       ============================================== */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const icon = mobileMenuBtn.querySelector('i');

    function toggleMenu() {
        mobileNavOverlay.classList.toggle('active');
        if (mobileNavOverlay.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu open
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Close mobile menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavOverlay.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    /* ==============================================
       Scroll Animation (Intersection Observer)
       ============================================== */
    const fadeElements = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    fadeElements.forEach(el => {
        appearOnScroll.observe(el);
    });

    /* ==============================================
       Lightbox Gallery Logic
       ============================================== */
    const galleryImages = document.querySelectorAll('.gallery-item img');
    if (galleryImages.length > 0) {
        // Build Lightbox DOM element
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <span class="lightbox-close" title="Chiudi"><i class="fa-solid fa-xmark"></i></span>
            <button class="lightbox-prev" aria-label="Precedente"><i class="fa-solid fa-chevron-left"></i></button>
            <img class="lightbox-img" src="" alt="Anteprima ingrandita">
            <button class="lightbox-next" aria-label="Successiva"><i class="fa-solid fa-chevron-right"></i></button>
        `;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        let currentIndex = 0;
        const imagesSrc = Array.from(galleryImages).map(img => img.src);

        const openLightbox = (index) => {
            currentIndex = index;
            lightboxImg.src = imagesSrc[currentIndex];
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        const showPrev = (e) => {
            if (e) e.stopPropagation();
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : imagesSrc.length - 1;
            lightboxImg.src = imagesSrc[currentIndex];
        };

        const showNext = (e) => {
            if (e) e.stopPropagation();
            currentIndex = (currentIndex < imagesSrc.length - 1) ? currentIndex + 1 : 0;
            lightboxImg.src = imagesSrc[currentIndex];
        };

        galleryImages.forEach((img, index) => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    }

});
