/**
 * ========== SMOOTH SCROLL MODULE ==========
 * Модуль плавной прокрутки для якорей
 */

export function initSmoothScroll() {
    // Инициализация плавного скролла
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
}

export default {
    initSmoothScroll
};