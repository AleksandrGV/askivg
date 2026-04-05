// ============================================
// ФАЙЛ 6: js/modules/projects.js
// ============================================
/**
 * Модальные окна проектов
 */

import { PROJECT_DATA } from './project-data.js';
import { loadComments } from './comments.js';
import { initCommentForm } from './comments.js';
import { initCaptcha, refreshCaptcha } from './captcha.js';
// import { initRatingStars, resetRatingStars } from './rating.js';
import { initRatingStars } from './rating.js';

/**
 * Открывает модальное окно проекта
 */
export async function openProjectModal(projectId) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody || !PROJECT_DATA[projectId]) {
        return;
    }
    
    const project = PROJECT_DATA[projectId];
    const comments = await loadComments(projectId);
    
    modalBody.innerHTML = generateModalHTML(projectId, project, comments);
    
    // Инициализация компонентов
    initCaptcha(projectId);
    initRatingStars(projectId);
    initCommentForm(projectId);
    
    // Показываем модальное окно
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Инициализация слайдера
    setTimeout(() => initProjectModalSlider(), 100);
}

/**
 * Закрывает модальное окно
 */
export function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) {
        return;
    }
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

/**
 * Обновляет список комментариев
 */
export async function updateCommentsList(projectId) {
    const commentsList = document.getElementById(`commentsList-${projectId}`);
    const comments = await loadComments(projectId);
    
    if (commentsList) {
        commentsList.innerHTML = generateCommentsHTML(comments);
    }
}

/**
 * Генерирует HTML модального окна
 */
function generateModalHTML(projectId, project, comments) {
    return `
        <div class="project-modal">
            <div class="project-modal__header">
                <h2 class="project-modal__title">${project.title}</h2>
                <p class="project-modal__category">${project.category}</p>
            </div>
            
            <div class="project-modal__gallery">
                <div class="swiper project-modal__slider">
                    <div class="swiper-wrapper">
                        ${project.images.map(img => `
                            <div class="swiper-slide">
                                <img src="${img}" alt="${project.title}" loading="lazy">
                            </div>
                        `).join('')}
                    </div>
                    <div class="swiper-pagination"></div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                </div>
            </div>
            
            <div class="project-modal__content">
                <div class="project-modal__description">
                    <h3>Описание проекта</h3>
                    <p>${project.description}</p>
                </div>
                
                <div class="project-modal__details">
                    <div class="project-modal__detail">
                        <h4>Технологии</h4>
                        <div class="project-modal__technologies">
                            ${project.technologies.map(tech => `
                                <span class="project-modal__tech-badge">${tech}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="project-modal__detail">
                        <h4>Сроки реализации</h4>
                        <p>${project.duration}</p>
                    </div>
                    
                    <div class="project-modal__actions">
                        <a href="${project.liveUrl}" target="_blank" rel="noopener" class="btn btn--primary">
                            Посмотреть сайт
                        </a>
                    </div>
                </div>
                
                <!-- БЛОК КОММЕНТАРИЕВ -->
                <div class="project-modal__comments">
                    <h3>Комментарии и отзывы</h3>
                    
                    <!-- Форма добавления комментария -->
                    <div class="comments-form">
                        <h4>Оставить комментарий</h4>
                        <form class="comment-form" id="commentForm-${projectId}">
                            <div class="form-group">
                                <label for="commentAuthor-${projectId}">Ваше имя *</label>
                                <input type="text" id="commentAuthor-${projectId}" class="comment-input" required maxlength="50">
                            </div>
                            <div class="form-group">
                                <label for="commentEmail-${projectId}">Email *</label>
                                <input type="email" id="commentEmail-${projectId}" class="comment-input" required maxlength="100">
                            </div>
                            <div class="form-group">
                                <label for="commentText-${projectId}">Комментарий *</label>
                                <textarea id="commentText-${projectId}" class="comment-textarea" rows="4" required maxlength="500"></textarea>
                            </div>
                            <div class="form-group">
                                <p class="form-group__subtitle">Оценка</p>
                                <div class="rating-stars" id="ratingStars-${projectId}">
                                    <span class="star" data-value="1">☆</span>
                                    <span class="star" data-value="2">☆</span>
                                    <span class="star" data-value="3">☆</span>
                                    <span class="star" data-value="4">☆</span>
                                    <span class="star" data-value="5">☆</span>
                                </div>
                                <input type="hidden" id="commentRating-${projectId}" value="5">
                            </div>
                            
                            <!-- КАПЧА -->
                            <div class="form-group spam-protection">
                                <p class="form-group__subtitle">Защита от спама *</p>
                                <div class="captcha-container">
                                    <div class="captcha-question" id="captchaQuestion-${projectId}"></div>
                                    <div class="captcha-wrapper">
                                        <input type="number" id="captchaAnswer-${projectId}" 
                                               class="comment-input captcha-answer" 
                                               placeholder="Введите ответ" required>
                                        <input type="hidden" id="captchaHash-${projectId}">
                                        <button type="button" class="btn btn--small btn--outline" 
                                                onclick="window.refreshProjectCaptcha(${projectId})">
                                            Обновить
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <button type="submit" class="btn btn--primary">
                                <span class="btn-text">Добавить комментарий</span>
                                <span class="btn-loading" style="display: none;">Отправка...</span>
                            </button>
                        </form>
                    </div>
                    
                    <!-- Список комментариев -->
                    <div class="comments-list" id="commentsList-${projectId}">
                        ${generateCommentsHTML(comments)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Генерирует HTML комментариев
 */
function generateCommentsHTML(comments) {
    if (comments.length === 0) {
        return '<div class="no-comments">Пока нет комментариев. Будьте первым!</div>';
    }
    
    return comments.map(comment => {
        const avatarUrl = comment.avatar || 
            `https://www.gravatar.com/avatar/${window.md5?.(comment.email) || ''}?d=identicon&s=60`;
        
        return `
        <div class="comment-item">
            <div class="comment-header">
                <div class="comment-author">
                    <img src="${avatarUrl}" alt="${comment.author}" class="comment-avatar"
                         onerror="this.src='data:image/svg+xml;base64,PHN2Zy4uLg=='">
                    <div class="comment-author-info">
                        <strong>${comment.author}</strong>
                        <span class="comment-date">${comment.date}</span>
                    </div>
                </div>
                <span class="comment-rating-stars">
                    ${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}
                </span>
            </div>
            <p class="comment-text">${comment.text}</p>
        </div>
        `;
    }).join('');
}

/**
 * Инициализирует слайдер в модальном окне
 */
function initProjectModalSlider() {
    const modalSlider = document.querySelector('.project-modal__slider');
    if (!modalSlider || typeof Swiper === 'undefined') {
        return;
    }
    
    new Swiper(modalSlider, {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        }
    });
}

// Экспорт для глобального доступа
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.refreshProjectCaptcha = refreshCaptcha;
window.updateCommentsList = updateCommentsList;

// Единый экспорт по умолчанию
export default {
    openProjectModal,
    closeProjectModal,
    updateCommentsList
};