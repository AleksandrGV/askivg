/**
 * Система комментариев
 */

import { showNotification } from './utils.js';
import { refreshCaptcha } from './captcha.js';

/**
 * Обновляет капчу из данных сервера
 */
function updateCaptchaFromServer(projectId, captchaData) {
    if (!captchaData) return;
    
    const questionElem = document.getElementById(`captchaQuestion-${projectId}`);
    const hashInput = document.getElementById(`captchaHash-${projectId}`);
    const answerInput = document.getElementById(`captchaAnswer-${projectId}`);
    
    if (questionElem) questionElem.textContent = captchaData.question;
    if (hashInput) hashInput.value = captchaData.hash;
    if (answerInput) answerInput.value = '';
}

/**
 * Загрузка комментариев с сервера
 */
export async function loadComments(projectId) {
    try {
        const response = await fetch(`php/comments.php?projectId=${projectId}`);
        if (!response.ok) throw new Error('Ошибка загрузки комментариев');
        
        const comments = await response.json();
        return Array.isArray(comments) ? comments : [];
    } catch (error) {
        console.error('Ошибка загрузки комментариев:', error);
        return [];
    }
}

/**
 * Отправка комментария на сервер
 */
export async function submitComment(projectId, author, email, text, rating, captchaAnswer, captchaHash) {
    const commentData = {
        project_id: projectId,
        author: author.trim(),
        email: email.trim(),
        text: text.trim(),
        rating: rating || 0,
        captcha_answer: captchaAnswer,
        captcha_hash: captchaHash
    };

    const response = await fetch('php/save_comment.php', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(commentData)
    });

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
        const text = await response.text();
        throw new Error('Ошибка сервера');
    }

    const result = await response.json();
    
    if (!response.ok) {
        // Если есть новая капча от сервера - обновляем
        if (result.data?.captcha) {
            updateCaptchaFromServer(projectId, result.data.captcha);
        }
        
        // Показываем сообщение об ошибке
        if (result.message) {
            throw new Error(result.message);
        }
        throw new Error(`Ошибка ${response.status}`);
    }
    
    if (!result.success) {
        throw new Error(result.message || 'Ошибка отправки');
    }
    
    return result;
}

/**
 * Добавление комментария
 */
export async function addComment(projectId, author, email, text, rating, captchaAnswer, captchaHash) {
    try {
        const result = await submitComment(
            projectId, author, email, text, rating, captchaAnswer, captchaHash
        );
        
        // Показываем уведомление об успехе
        const message = result.needs_moderation 
            ? '✅ Комментарий отправлен на модерацию'
            : '✅ Комментарий успешно добавлен';
        
        showNotification(message, 'success');
        
        // Обновляем капчу из ответа сервера
        if (result.data?.captcha) {
            updateCaptchaFromServer(projectId, result.data.captcha);
        } else {
            refreshCaptcha(projectId);
        }
        
        return result.comment;
    } catch (error) {
        // ПОКАЗЫВАЕМ ОШИБКУ ПОЛЬЗОВАТЕЛЮ
        showNotification(error.message, 'error');
        // НЕ логируем в консоль, чтобы не дублировать
        throw error;
    }
}

/**
 * Инициализация формы комментария
 */
export function initCommentForm(projectId) {
    const commentForm = document.getElementById(`commentForm-${projectId}`);
    if (!commentForm) return;
    
    const submitBtn = commentForm.querySelector('button[type="submit"]');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');
    
    commentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const author = document.getElementById(`commentAuthor-${projectId}`)?.value?.trim();
        const email = document.getElementById(`commentEmail-${projectId}`)?.value?.trim();
        const text = document.getElementById(`commentText-${projectId}`)?.value?.trim();
        const rating = document.getElementById(`commentRating-${projectId}`)?.value || 5;
        const captchaAnswer = document.getElementById(`captchaAnswer-${projectId}`)?.value?.trim();
        const captchaHash = document.getElementById(`captchaHash-${projectId}`)?.value;
        
        // Валидация
        if (!author || !email || !text || !captchaAnswer) {
            showNotification('Заполните все обязательные поля', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Введите корректный email', 'error');
            return;
        }
        
        // Показываем загрузку
        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline';
        
        try {
            await addComment(projectId, author, email, text, rating, captchaAnswer, captchaHash);
            
            // Очищаем форму
            commentForm.reset();
            
            // Очищаем поле капчи
            const captchaInput = document.getElementById(`captchaAnswer-${projectId}`);
            if (captchaInput) captchaInput.value = '';
            
            // Сбрасываем рейтинг
            const ratingInput = document.getElementById(`commentRating-${projectId}`);
            if (ratingInput) ratingInput.value = '5';
            
            // Обновляем список комментариев
            await updateCommentsList(projectId);
            
        } catch (error) {
            // Ошибка уже показана в addComment, ничего не делаем
            // Просто даем возможность пользователю попробовать снова
        } finally {
            // Восстанавливаем кнопку
            if (submitBtn) submitBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.style.display = 'none';
        }
    });
}

/**
 * Обновление списка комментариев
 */
export async function updateCommentsList(projectId) {
    const commentsList = document.getElementById(`commentsList-${projectId}`);
    const comments = await loadComments(projectId);
    
    if (commentsList) {
        if (comments.length === 0) {
            commentsList.innerHTML = '<div class="no-comments">Пока нет комментариев. Будьте первым!</div>';
        } else {
            commentsList.innerHTML = generateCommentsHTML(comments);
        }
    }
}

/**
 * Генерация HTML для комментариев
 */
function generateCommentsHTML(comments) {
    return comments.map(comment => {
        const avatarUrl = comment.avatar || 
            `https://www.gravatar.com/avatar/${window.md5?.(comment.email) || ''}?d=identicon&s=60`;
        
        return `
        <div class="comment-item">
            <div class="comment-header">
                <div class="comment-author">
                    <img src="${avatarUrl}" alt="${comment.author}" class="comment-avatar"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNlMWUxZTEiLz4KPHBhdGggZD0iTTI0IDI0YzAtNC40MTggMy41ODItOCA4LThzOCAzLjU4MiA4IDgtMy41ODIgOC04IDgtOC0zLjU4Mi04LTh6TTE2IDQwYzAtNC40MTggMy41ODItOCA4LThzOCAzLjU4MiA4IDhIMzJjMC04LjgzNy03LjE2My0xNi0xNi0xNnMtMTYgNy4xNjMtMTYgMTZ6IiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo='">
                    <div class="comment-author-info">
                        <strong>${comment.author}</strong>
                        <span class="comment-date">${comment.date}</span>
                    </div>
                </div>
                <span class="comment-rating-stars">${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}</span>
            </div>
            <p class="comment-text">${comment.text}</p>
        </div>
        `;
    }).join('');
}

export default {
    loadComments,
    submitComment,
    addComment,
    initCommentForm,
    updateCommentsList
};