// ============================================
// ФАЙЛ 6: js/modules/projects.js
// ============================================
/**
 * Модальные окна проектов
 */

import { PROJECT_DATA } from './project-data.js';
import { loadComments, initCommentForm } from './comments.js';
import { initCaptcha } from './captcha.js';
import { initRatingStars } from './rating.js';

// Получаем ссылку на модальное окно
const modal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');

/**
 * Закрывает модальное окно по клавише ESC
 */
function handleEscKey(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeProjectModal();
    }
}

/**
 * Открывает модальное окно проекта
 */
export async function openProjectModal(projectSlug) {
    if (!modal || !modalBody || !PROJECT_DATA[projectSlug]) {
        console.warn('Modal or project data not found:', projectSlug);
        return;
    }
    
    const project = PROJECT_DATA[projectSlug];
    const comments = await loadComments(projectSlug);
    
    modalBody.innerHTML = generateModalHTML(projectSlug, project, comments);
    
    // Инициализация компонентов
    initCaptcha(projectSlug);
    initRatingStars(projectSlug);
    initCommentForm(projectSlug);
    
    // Показываем модальное окно
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // ===== ДОБАВИТЬ: слушатель клавиши ESC =====
    document.addEventListener('keydown', handleEscKey);
    // ==========================================
    
    // Инициализация слайдера
    setTimeout(() => initProjectModalSlider(), 100);
}

/**
 * Закрывает модальное окно
 */
export function closeProjectModal() {
    if (!modal) {
        return;
    }
    

    // ===== ДОБАВИТЬ: удаляем слушатель клавиши ESC =====
    document.removeEventListener('keydown', handleEscKey);
    // ==================================================

    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Очищаем содержимое через небольшую задержку
    setTimeout(() => {
        if (modalBody) {
            modalBody.innerHTML = '';
        }
    }, 200);
}

/**
 * Генерирует HTML модального окна
 */
function generateModalHTML(projectSlug, project, comments) {
    return `
        <div class="project-modal">
            <div class="project-modal__header">
                <h2 class="project-modal__title">${escapeHtml(project.title)}</h2>
                <p class="project-modal__category">${escapeHtml(project.category)}</p>
            </div>
            
            <div class="project-modal__gallery">
                <div class="swiper project-modal__slider">
                    <div class="swiper-wrapper">
                        ${project.images.map(img => `
                            <div class="swiper-slide">
                                <img src="${img}" alt="${escapeHtml(project.title)}" loading="lazy">
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
                    <p>${escapeHtml(project.description)}</p>
                </div>
                
                <div class="project-modal__details">
                    <div class="project-modal__detail">
                        <h4>Технологии</h4>
                        <div class="project-modal__technologies">
                            ${project.technologies.map(tech => `
                                <span class="project-modal__tech-badge">${escapeHtml(tech)}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="project-modal__detail">
                        <h4>Сроки реализации</h4>
                        <p>${escapeHtml(project.duration)}</p>
                    </div>
                    
                    <div class="project-modal__actions">
                        <a href="${project.liveUrl}" target="_blank" rel="noopener" class="btn btn--primary">
                            Посмотреть сайт
                        </a>
                    </div>
                </div>
                
                <div class="project-modal__comments">
                    <h3>Комментарии и отзывы</h3>
                    
                    <div class="comments-form">
                        <h4>Оставить комментарий</h4>
                        <form class="comment-form" id="commentForm-${projectSlug}">
                            <div class="form-group">
                                <label for="commentAuthor-${projectSlug}">Ваше имя *</label>
                                <input type="text" id="commentAuthor-${projectSlug}" class="comment-input" required maxlength="50">
                            </div>
                            <div class="form-group">
                                <label for="commentEmail-${projectSlug}">Email *</label>
                                <input type="email" id="commentEmail-${projectSlug}" class="comment-input" required maxlength="100">
                            </div>
                            <div class="form-group">
                                <label for="commentText-${projectSlug}">Комментарий *</label>
                                <textarea id="commentText-${projectSlug}" class="comment-textarea" rows="4" required maxlength="500"></textarea>
                            </div>
                            <div class="form-group">
                                <p class="form-group__subtitle">Оценка</p>
                                <div class="rating-stars" id="ratingStars-${projectSlug}">
                                    <span class="star" data-value="1">☆</span>
                                    <span class="star" data-value="2">☆</span>
                                    <span class="star" data-value="3">☆</span>
                                    <span class="star" data-value="4">☆</span>
                                    <span class="star" data-value="5">☆</span>
                                </div>
                                <input type="hidden" id="commentRating-${projectSlug}" value="5">
                            </div>
                            
                            <div class="form-group spam-protection">
                                <p class="form-group__subtitle">Защита от спама *</p>
                                <div class="captcha-container">
                                    <div class="captcha-question" id="captchaQuestion-${projectSlug}"></div>
                                    <div class="captcha-wrapper">
                                        <input type="number" id="captchaAnswer-${projectSlug}" 
                                               class="comment-input captcha-answer" 
                                               placeholder="Введите ответ" required>
                                        <input type="hidden" id="captchaHash-${projectSlug}">
                                        <button type="button" class="btn btn--small btn--outline" 
                                                onclick="window.refreshProjectCaptcha('${projectSlug}')">
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
                    
                    <div class="comments-list" id="commentsList-${projectSlug}">
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
    if (!comments || comments.length === 0) {
        return '<div class="no-comments">Пока нет комментариев. Будьте первым!</div>';
    }
    
    return comments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <div class="comment-author">
                    <img src="${comment.avatar || 'https://www.gravatar.com/avatar/?d=identicon&s=60'}" 
                         alt="${escapeHtml(comment.author)}" class="comment-avatar">
                    <div class="comment-author-info">
                        <strong>${escapeHtml(comment.author)}</strong>
                        <span class="comment-date">${comment.date || ''}</span>
                    </div>
                </div>
                <span class="comment-rating-stars">
                    ${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}
                </span>
            </div>
            <p class="comment-text">${escapeHtml(comment.text)}</p>
        </div>
    `).join('');
}

function escapeHtml(str) {
    if (!str) {
        return '';
    }
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

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
        pagination: { el: '.swiper-pagination', clickable: true },
        loop: true,
        autoplay: { delay: 4000, disableOnInteraction: false }
    });
}

// Экспорт для глобального доступа
// window.openProjectModal = openProjectModal;
// window.closeProjectModal = closeProjectModal;
// window.refreshProjectCaptcha = refreshCaptcha;

export default {
    openProjectModal,
    closeProjectModal
};