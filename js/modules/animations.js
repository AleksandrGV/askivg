/**
 * ========== ANIMATIONS MODULE ==========
 * Модуль анимаций для сайта A.S.K.I.V.G.
 * Включает инициализацию AOS и эффекты при скролле
 */

/**
 * Инициализирует AOS (Animate On Scroll) библиотеку
 */
export function initAnimations() {
    // Проверяем, загружена ли библиотека AOS
    if (typeof AOS !== 'undefined') {
        try {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                mirror: false,
                offset: 100,
                delay: 50,
                disable: function() {
                    // Отключаем на мобильных устройствах
                    return window.innerWidth < 768;
                }
            });

        } catch (error) {
            console.error('❌ Ошибка инициализации AOS:', error);
        }
    } else {
        console.warn('⚠️ AOS не загружен, используем простые анимации');
        initFallbackAnimations();
    }
}

/**
 * Простая альтернатива AOS
 */
function initFallbackAnimations() {
    // Добавляем класс fade-in ко всем элементам с data-aos
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.classList.add('fade-in');
        
        // Простой Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(el);
    });
}

/**
 * Обработчик эффектов при скролле
 */
export function handleScrollEffects() {
    // Добавляем класс scrolled к header
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Плавное появление кнопки "Наверх"
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    // Активация параллакс эффектов
    document.querySelectorAll('[data-parallax]').forEach(el => {
        const speed = el.dataset.parallax || 0.5;
        const yPos = -(window.scrollY * speed);
        el.style.transform = `translateY(${yPos}px)`;
    });
}

/**
 * Плавный скролл к якорям
 * @param {string} target - Селектор цели
 */
export function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Добавляет анимацию при наведении
 * @param {HTMLElement} element - DOM элемент
 * @param {string} animation - Класс анимации
 */
export function addHoverAnimation(element, animation = 'hover-scale') {
    if (element) {
        element.addEventListener('mouseenter', () => {
            element.classList.add(animation);
        });
        element.addEventListener('mouseleave', () => {
            element.classList.remove(animation);
        });
    }
}

// Экспорт по умолчанию
export default {
    initAnimations,
    handleScrollEffects,
    smoothScrollTo,
    addHoverAnimation
};