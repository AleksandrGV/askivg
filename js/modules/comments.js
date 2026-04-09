/**
 * Система комментариев - версия с project_slug
 */

import { showNotification } from './utils.js';
import { refreshCaptcha } from './captcha.js';

function updateCaptchaFromServer(projectSlug, captchaData) {
    if (!captchaData) {
        return;
    }
    
    const questionElem = document.getElementById(`captchaQuestion-${projectSlug}`);
    const hashInput = document.getElementById(`captchaHash-${projectSlug}`);
    const answerInput = document.getElementById(`captchaAnswer-${projectSlug}`);
    
    if (questionElem) {
        questionElem.textContent = captchaData.question;
    }
    if (hashInput) {
        hashInput.value = captchaData.hash;
    }
    if (answerInput) {
        answerInput.value = '';
    }
}

export async function loadComments(projectSlug) {
    try {
        const response = await fetch(`php/comments.php?projectSlug=${encodeURIComponent(projectSlug)}`);
        if (!response.ok) {
            throw new Error('Ошибка загрузки комментариев');
        }
        
        const comments = await response.json();
        return Array.isArray(comments) ? comments : [];
    } catch (error) {
        console.error('Ошибка загрузки комментариев:', error);
        return [];
    }
}

export async function submitComment(projectSlug, author, email, text, rating, captchaAnswer, captchaHash) {
    const commentData = {
        project_slug: projectSlug,
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
        console.error('Non-JSON response:', text);
        throw new Error('Ошибка сервера');
    }

    const result = await response.json();
    
    if (!response.ok) {
        if (result.data?.captcha) {
            updateCaptchaFromServer(projectSlug, result.data.captcha);
        }
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

export async function addComment(projectSlug, author, email, text, rating, captchaAnswer, captchaHash) {
    try {
        const result = await submitComment(
            projectSlug, author, email, text, rating, captchaAnswer, captchaHash
        );
        
        const message = result.needs_moderation 
            ? '✅ Комментарий отправлен на модерацию'
            : '✅ Комментарий успешно добавлен';
        
        showNotification(message, 'success');
        
        if (result.data?.captcha) {
            updateCaptchaFromServer(projectSlug, result.data.captcha);
        } else {
            refreshCaptcha(projectSlug);
        }
        
        return result.comment;
    } catch (error) {
        showNotification(error.message, 'error');
        throw error;
    }
}

export function initCommentForm(projectSlug) {
    const commentForm = document.getElementById(`commentForm-${projectSlug}`);
    if (!commentForm) {
        return;
    }
    
    const submitBtn = commentForm.querySelector('button[type="submit"]');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');
    
    commentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const author = document.getElementById(`commentAuthor-${projectSlug}`)?.value?.trim();
        const email = document.getElementById(`commentEmail-${projectSlug}`)?.value?.trim();
        const text = document.getElementById(`commentText-${projectSlug}`)?.value?.trim();
        const rating = document.getElementById(`commentRating-${projectSlug}`)?.value || 5;
        const captchaAnswer = document.getElementById(`captchaAnswer-${projectSlug}`)?.value?.trim();
        const captchaHash = document.getElementById(`captchaHash-${projectSlug}`)?.value;
        
        if (!author || !email || !text || !captchaAnswer) {
            showNotification('Заполните все обязательные поля', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Введите корректный email', 'error');
            return;
        }
        
        if (submitBtn) {
            submitBtn.disabled = true;
        }
        if (btnText) {
            btnText.style.display = 'none';
        }
        if (btnLoading) {
            btnLoading.style.display = 'inline';
        }
        
        try {
            await addComment(projectSlug, author, email, text, rating, captchaAnswer, captchaHash);
            
            commentForm.reset();
            
            const captchaInput = document.getElementById(`captchaAnswer-${projectSlug}`);
            if (captchaInput) {
                captchaInput.value = '';
            }
            
            const ratingInput = document.getElementById(`commentRating-${projectSlug}`);
            if (ratingInput) {
                ratingInput.value = '5';
            }
            
            await updateCommentsList(projectSlug);
            
        } catch (error) {
            // Ошибка уже показана
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
            }
            if (btnText) {
                btnText.style.display = 'inline';
            }
            if (btnLoading) {
                btnLoading.style.display = 'none';
            }
        }
    });
}

export async function updateCommentsList(projectSlug) {
    const commentsList = document.getElementById(`commentsList-${projectSlug}`);
    const comments = await loadComments(projectSlug);
    
    if (commentsList) {
        if (comments.length === 0) {
            commentsList.innerHTML = '<div class="no-comments">Пока нет комментариев. Будьте первым!</div>';
        } else {
            commentsList.innerHTML = generateCommentsHTML(comments);
        }
    }
}

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
                        <strong>${escapeHtml(comment.author)}</strong>
                        <span class="comment-date">${comment.date}</span>
                    </div>
                </div>
                <span class="comment-rating-stars">${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}</span>
            </div>
            <p class="comment-text">${escapeHtml(comment.text)}</p>
        </div>
        `;
    }).join('');
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

export default {
    loadComments,
    submitComment,
    addComment,
    initCommentForm,
    updateCommentsList
};