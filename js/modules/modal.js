import { projectData } from './config.js';
import { CommentSystem } from './comments.js';

export class ProjectModal {
    constructor() {
        this.modal = document.getElementById('projectModal');
        this.modalBody = document.getElementById('modalBody');
        this.commentSystem = new CommentSystem();
    }

    async open(projectId) {
        if (!this.modal || !this.modalBody || !projectData[projectId]) {return;}
        
        const project = projectData[projectId];
        // const projectComments = await this.commentSystem.loadComments(projectId);
        
        this.modalBody.innerHTML = this.createModalHTML(project, projectId);
        
        this.commentSystem.initCommentForm(projectId);
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            this.initSlider();
        }, 100);
    }

    createModalHTML(project, projectId) {
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
                </div>
                
                <div class="comments-form">
                    <h4>Оставить комментарий</h4>
                    <form class="comment-form" id="commentForm-${projectId}">
                        <div class="form-group">
                            <label for="commentAuthor-${projectId}">Ваше имя *</label>
                            <input type="text" id="commentAuthor-${projectId}" 
                                class="comment-input" required maxlength="50"
                                placeholder="Как к вам обращаться?">
                        </div>
                        <div class="form-group">
                            <label for="commentText-${projectId}">Комментарий *</label>
                            <textarea id="commentText-${projectId}" 
                                    class="comment-textarea" 
                                    rows="4" required maxlength="500"
                                    placeholder="Ваш отзыв о проекте..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="commentRating-${projectId}">Оценка</label>
                            <select id="commentRating-${projectId}" class="comment-rating">
                                <option value="5">★★★★★ Отлично</option>
                                <option value="4">★★★★☆ Хорошо</option>
                                <option value="3">★★★☆☆ Удовлетворительно</option>
                                <option value="2">★★☆☆☆ Плохо</option>
                                <option value="1">★☆☆☆☆ Очень плохо</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="btn btn--primary">
                            <span class="btn-text">Добавить комментарий</span>
                            <span class="btn-loading" style="display: none;">Отправка...</span>
                        </button>
                    </form>
                </div>
            </div>
        `;
    }

    initSlider() {
        const modalSlider = document.querySelector('.project-modal__slider');
        if (!modalSlider || typeof Swiper === 'undefined') {return;}
        
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

    close() {
        if (!this.modal) {return;}
        
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            if (this.modalBody) {
                this.modalBody.innerHTML = '';
            }
        }, 300);
    }
}