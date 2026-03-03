/**
 * ========== NAVIGATION ==========
 * Навигация и скролл для сайта A.S.K.I.V.G.
 */

import { throttle } from './utils.js';

// Флаг для предотвращения двойной инициализации
let isInitialized = false;

/**
 * Инициализация навигации
 */
export function initNavigation() {

    // Если уже инициализировано - выходим
    if (isInitialized) {
        return;
    }

    // Удаляем класс no-js при работающем JavaScript
    document.documentElement.classList.remove('no-js');
    // Добавляем класс js для стилей (опционально)
    document.documentElement.classList.add('js-enabled');

    const navToggle = document.getElementById('navToggle');
    const navList = document.querySelector('.nav__list');
    const navLinks = document.querySelectorAll('.nav__link');
    const nav = document.querySelector('.nav');
    
    // Мобильное меню
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navList.classList.toggle('active');
        });
    }

    // Устанавливаем флаг инициализации
    isInitialized = true;
    
    // Закрытие мобильного меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navList?.classList.remove('active');
        });
    });
    
    // Изменение навигации при скролле
    window.addEventListener('scroll', throttle(() => {
        updateNavOnScroll(nav);
    }, 100));
    
    // Активная ссылка при скролле
    updateActiveNavLink();
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
}

function updateNavOnScroll(nav) {
    if (!nav) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = 'none';
    }
}

export function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    let current = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

export default {
    initNavigation,
    updateActiveNavLink
};