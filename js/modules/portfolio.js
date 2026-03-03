// /**
//  * ========== PORTFOLIO ==========
//  * Портфолио и фильтры для сайта A.S.K.I.V.G.
//  */

import { GLOBALS } from './constants.js';

/**
 * Инициализация фильтров портфолио
 * ЭТУ ФУНКЦИЮ ВЫЗЫВАЕТ main.js
 */
export function initPortfolio() {
    
    const filterButtons = document.querySelectorAll('.portfolio__filter');
    const portfolioItems = document.querySelectorAll('.portfolio__item');
    
    if (filterButtons.length === 0) {
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Обновление активной кнопки
            filterButtons.forEach(btn => btn.classList.remove('portfolio__filter--active'));
            button.classList.add('portfolio__filter--active');
            
            // Фильтрация элементов
            filterPortfolioItems(filter, portfolioItems);
            GLOBALS.currentFilter = filter;
        });
    });
    
    // Активируем первый фильтр по умолчанию
    if (filterButtons.length > 0 && !document.querySelector('.portfolio__filter--active')) {
        filterButtons[0].classList.add('portfolio__filter--active');
    }
}

/**
 * Фильтрация элементов портфолио
 */
export function filterPortfolioItems(filter, items) {
    items.forEach(item => {
        const shouldShow = filter === '*' || item.classList.contains(filter.substring(1));
        
        if (shouldShow) {
            item.style.display = 'block';
            setTimeout(() => {
                item.classList.remove('hidden');
            }, 10);
        } else {
            item.classList.add('hidden');
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
    
    // Обновление AOS анимаций
    setTimeout(() => {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 350);
}

// Для обратной совместимости
export function initPortfolioFilters() {
    return initPortfolio();
}

// Единый экспорт по умолчанию
export default {
    initPortfolio,
    initPortfolioFilters,
    filterPortfolioItems
};