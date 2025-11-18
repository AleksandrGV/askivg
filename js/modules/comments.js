import { Notification } from './utils.js';

export class CommentSystem {
    constructor() {
        this.notification = new Notification();
    }

    async loadComments(projectId) {
        try {
            const response = await fetch(`php/comments.php?projectId=${projectId}`);
            
            if (!response.ok) {
                throw new Error('Ошибка загрузки комментариев');
            }
            
            const comments = await response.json();
            return Array.isArray(comments) ? comments : [];
        } catch (error) {
            return [];
        }
    }

    async loadRecentComments(limit = 20) {
        try {
            const response = await fetch(`php/get_comments.php?limit=${limit}`);
            if (response.ok) {
                const comments = await response.json();
                this.displayRecentComments(comments);
            }
        } catch (error) {
            // Ошибка обрабатывается молча
        }
    }

    displayRecentComments(comments) {
        const container = document.getElementById('recentCommentsList');
        if (!container) return;

        if (!comments || comments.length === 0) {
            container.innerHTML = '<div class="no-comments">Пока нет отзывов. Будьте первым!</div>';
            return;
        }

        container.innerHTML = comments.map(comment => `
            <div class="recent-comment">
                <div class="recent-comment__header">
                    <strong class="recent-comment__author">${comment.author}</strong>
                    ${comment.position ? `<span class="recent-comment__position">${comment.position}</span>` : ''}
                    <span class="recent-comment__rating">${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}</span>
                    <span class="recent-comment__date">${comment.date}</span>
                </div>
                <p class="recent-comment__text">${comment.text}</p>
                ${comment.project ? `<div class="recent-comment__project">Проект: ${comment.project}</div>` : ''}
            </div>
        `).join('');
    }

    initCommentForm(projectId) {
        const commentForm = document.getElementById(`commentForm-${projectId}`);
        const submitBtn = commentForm?.querySelector('button[type="submit"]');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnLoading = submitBtn?.querySelector('.btn-loading');
        
        if (commentForm && submitBtn) {
            commentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const author = document.getElementById(`commentAuthor-${projectId}`).value.trim();
                const text = document.getElementById(`commentText-${projectId}`).value.trim();
                const rating = document.getElementById(`commentRating-${projectId}`).value;
                
                if (!author || !text) {
                    this.notification.show('Заполните все обязательные поля', 'error');
                    return;
                }
                
                submitBtn.disabled = true;
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline';
                
                try {
                    await this.addComment(projectId, author, text, rating);
                    commentForm.reset();
                } catch (error) {
                    // Ошибка уже обработана в addComment
                } finally {
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline';
                    btnLoading.style.display = 'none';
                }
            });
        }
    }

    async addComment(projectId, author, text, rating, position = '') {
        try {
            const result = await this.submitComment(projectId, author, text, rating, position);
            
            if (result.success) {
                this.notification.show('Отзыв успешно добавлен!', 'success');
                if (projectId === 'testimonial') {
                    this.loadRecentComments(20);
                } else {
                    await this.updateCommentsList(projectId);
                }
                return result.data.comment;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            this.notification.show('Ошибка: ' + error.message, 'error');
            throw error;
        }
    }

    async submitComment(projectId, author, text, rating, position = '') {
        try {
            const formData = new FormData();
            formData.append('projectId', projectId);
            formData.append('author', author);
            formData.append('text', text);
            formData.append('rating', rating);
            formData.append('position', position);

            const response = await fetch('php/save_comment.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Ошибка сервера');
            }
            
            return result;
        } catch (error) {
            throw error;
        }
    }

    async updateCommentsList(projectId) {
        const commentsList = document.getElementById(`commentsList-${projectId}`);
        const projectComments = await this.loadComments(projectId);
        
        if (commentsList) {
            if (projectComments.length === 0) {
                commentsList.innerHTML = '<div class="no-comments">Пока нет комментариев. Будьте первым!</div>';
            } else {
                commentsList.innerHTML = projectComments.map(comment => `
                    <div class="comment-item">
                        <div class="comment-header">
                            <strong>${comment.author}</strong>
                            <span class="comment-date">${comment.date}</span>
                            <span class="comment-rating-stars">${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}</span>
                        </div>
                        <p class="comment-text">${comment.text}</p>
                    </div>
                `).join('');
            }
        }
    }

    initTestimonialForm() {
        const form = document.getElementById('testimonialForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                author: formData.get('name'),
                position: formData.get('position'),
                text: formData.get('text'),
                rating: formData.get('rating'),
                type: 'testimonial'
            };

            try {
                await this.addComment('testimonial', data.author, data.text, data.rating, data.position);
                form.reset();
                this.loadRecentComments();
            } catch (error) {
                // Ошибка уже обработана в addComment
            }
        });
    }
}