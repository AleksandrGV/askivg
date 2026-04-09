// /**
//  * ========== UTILITY FUNCTIONS ==========
//  * Вспомогательные функции для сайта A.S.K.I.V.G.
//  */

// Throttle функция для оптимизации событий
export function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Простая реализация MD5 для фоллбэка
 */
export function simpleMD5(str) {
    let hash = 0;
    if (str.length === 0) {
        return '00000000000000000000000000000000';
    }
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(32, '0');
}

/**
 * Парсит дату из разных форматов
 */
export function parseDate(dateString) {
    if (!dateString) {
        return new Date();
    }
    let date = new Date(dateString);
    if (isNaN(date.getTime())) {
        const match = dateString.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})/);
        if (match) {
            date = new Date(`${match[3]}-${match[2]}-${match[1]}T${match[4]}:${match[5]}:00`);
        }
    }
    return isNaN(date.getTime()) ? new Date() : date;
}

/**
 * Показывает уведомление пользователю
 * @param {string} message - Текст сообщения
 * @param {string} type - Тип (success, error, warning, info)
 */
export function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 350px;
    `;
    
    // Добавляем анимацию
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Удаляем через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

/**
 * Дебаунс функция
 */
export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Единый экспорт по умолчанию
export default {
    simpleMD5,
    parseDate,
    showNotification,
    debounce,
    throttle
};