document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');

    if (navToggle && nav) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    const v = document.getElementById('heroVideo');
    const btn = document.getElementById('videoPlayBtn');
    
    if (v) {
        v.muted = true;
        v.playsInline = true;

        const p = v.play();
        if (p && typeof p.catch === 'function') {
            p.catch(() => {
                if (btn) {
                    btn.hidden = false;
                    btn.addEventListener('click', async () => {
                        try {
                            await v.play();
                            btn.hidden = true;
                        } catch (e) {
                            console.error("Video play failed:", e);
                        }
                    });
                }
            });
        }
    }

    // Lazy loading animace (Fade-in)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Sledujeme nadpisy a obrázky v galeriích (Fade-in efekt)
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target); // Animovat jen jednou
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.gallery-grid img').forEach(el => {
        fadeObserver.observe(el);
    });

    // Dotykové ovládání pro Lightbox (Swipe)
    let touchStartX = 0;
    let touchEndX = 0;

    function handleGesture() {
        const swipeThreshold = 50; // jak moc musí uživatel přejet prstem (v pixelech)
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Přejetí doleva -> Další fotka (simulace kliknutí na tlačítko)
            const nextBtn = document.querySelector('.lightbox-next');
            if (nextBtn) nextBtn.click();
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Přejetí doprava -> Předchozí fotka (simulace kliknutí na tlačítko)
            const prevBtn = document.querySelector('.lightbox-prev');
            if (prevBtn) prevBtn.click();
        }
    }

    const lbContainer = document.getElementById('lightbox');
    if (lbContainer) {
        lbContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        lbContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleGesture();
        }, {passive: true});
    }
});