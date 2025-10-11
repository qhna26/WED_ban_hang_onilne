// scroll-animate.js
function cleanupScrollAnimation() {
    document.querySelectorAll('.scroll-animate').forEach(el => {
        el.classList.remove('in-view');
    });
}

function initScrollAnimation() {
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el, index) => {
        el.style.setProperty('--order', index); // Đặt thứ tự cho delay
        const rect = el.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight - 100 && rect.bottom > 100;

        if (isInView) el.classList.add('in-view');

        window.addEventListener('scroll', () => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100 && rect.bottom > 100) {
                el.classList.add('in-view');
            } else {
                el.classList.remove('in-view');
            }
        }, { passive: true });
    });
}