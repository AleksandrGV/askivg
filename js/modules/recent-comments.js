// ============================================
// ФАЙЛ 5: js/modules/recent-comments.js
// ============================================
/**
 * Слайдер последних комментариев
 */

import { PROJECT_DATA } from './project-data.js';
import { parseDate, simpleMD5 } from './utils.js';

let recentCommentsSwiper = null;

/**
 * Загружает последние комментарии
 */
export async function loadRecentComments(limit = 6) {
    try {
        const sliderWrapper = document.getElementById('recentCommentsSlider');
        if (!sliderWrapper) {
            return;
        }
        
        sliderWrapper.innerHTML = `
            <div class="swiper-slide recent-comments__loading">
                <div class="loading-spinner"></div>
                <p>Загрузка отзывов...</p>
            </div>
        `;
        
        const response = await fetch(`php/comments.php?recent=${limit}`);
        if (!response.ok) {
            throw new Error('Ошибка загрузки');
        }
        
        const comments = await response.json();
        if (!Array.isArray(comments)) {
            throw new Error('Некорректный формат');
        }
        
        displayRecentComments(comments);
    } catch (error) {
        console.error('Ошибка:', error);
        showRecentCommentsError();
    }
}

/**
 * Отображает комментарии в слайдере
 */
export function displayRecentComments(comments) {
    const sliderWrapper = document.getElementById('recentCommentsSlider');
    if (!sliderWrapper) {
        return;
    }
    
    if (!comments || comments.length === 0) {
        sliderWrapper.innerHTML = `
            <div class="swiper-slide recent-comments__empty">
                <p>Пока нет комментариев</p>
            </div>
        `;
        return;
    }
    
    sliderWrapper.innerHTML = comments.map(comment => {
        const projectId = comment.project_id;
        const projectTitle = PROJECT_DATA[projectId]?.title || 'Проект';
        
        // Аватар
        let avatarUrl = comment.avatar;
        if (!avatarUrl && comment.email) {
            const hash = window.md5 ? window.md5(comment.email.toLowerCase()) : simpleMD5(comment.email.toLowerCase());
            avatarUrl = `https://www.gravatar.com/avatar/${hash}?d=identicon&s=64`;
        }
        
        // Дата
        const date = parseDate(comment.created_at);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
        
        // Рейтинг
        const rating = parseInt(comment.rating) || 5;
        
        return `
        <div class="swiper-slide recent-comments__slide" 
             onclick="window.openProjectModal(${projectId})" 
             style="cursor: pointer;">
            <div class="recent-comment__header">
                <div>
                    <div class="recent-comment__project">${projectTitle}</div>
                    <div class="recent-comment__author">
                        <img src="${avatarUrl}" class="recent-comment__avatar" 
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiLi4u'">
                        <span>${comment.author}</span>
                    </div>
                </div>
                <div class="recent-comment__date">${formattedDate}</div>
            </div>
            <div class="recent-comment__text">${comment.text.substring(0, 180)}...</div>
            <div class="recent-comment__rating">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</div>
        </div>
        `;
    }).join('');
    
    setTimeout(() => initRecentCommentsSlider(), 100);
}

/**
 * Показывает ошибку
 */
export function showRecentCommentsError() {
    const sliderWrapper = document.getElementById('recentCommentsSlider');
    if (sliderWrapper) {
        sliderWrapper.innerHTML = `
            <div class="swiper-slide recent-comments__error">
                <p>Не удалось загрузить комментарии</p>
            </div>
        `;
    }
}

/**
 * Инициализирует слайдер
 */
export function initRecentCommentsSlider() {
    const sliderElement = document.querySelector('.recent-comments__slider');
    if (!sliderElement || typeof Swiper === 'undefined') {
        return;
    }
    
    if (recentCommentsSwiper) {
        recentCommentsSwiper.destroy();
    }
    
    const slidesCount = sliderElement.querySelectorAll('.swiper-slide').length;
    
    recentCommentsSwiper = new Swiper(sliderElement, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: slidesCount >= 6,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.recent-comments__pagination', clickable: true },
        navigation: {
            nextEl: '.recent-comments__nav--next',
            prevEl: '.recent-comments__nav--prev'
        },
        breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });
}

// Единый экспорт по умолчанию
export default {
    loadRecentComments,
    displayRecentComments,
    showRecentCommentsError,
    initRecentCommentsSlider
};