
// /**
//  * ========== CAPTCHA SYSTEM ==========
//  * Система математической капчи
//  */

/**
 * Получение MD5 хеша
 */
function getMD5Hash(str) {
    if (typeof window.md5 === 'function') {
        return window.md5(str);
    }
    // Фоллбэк
    let hash = 0;
    if (str.length === 0) return '00000000000000000000000000000000';
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(32, '0');
}

/**
 * Генерирует новую капчу
 */
export function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const answer = num1 + num2;
    const answerStr = answer.toString();
    
    return {
        question: `${num1} + ${num2} = ?`,
        answer: answerStr,
        hash: getMD5Hash(answerStr)
    };
}

/**
 * Обновляет капчу на странице
 */
export function updateCaptchaOnPage(projectId, captchaData = null) {
    if (!captchaData) captchaData = generateCaptcha();
    
    // Для формы контактов (без projectId)
    if (projectId === undefined || projectId === null) {
        const questionElem = document.getElementById('captchaQuestion');
        const hashInput = document.getElementById('captchaHash');
        const answerInput = document.getElementById('captcha');
        
        if (questionElem) questionElem.textContent = captchaData.question;
        if (hashInput) hashInput.value = captchaData.hash;
        if (answerInput) answerInput.value = '';
        return captchaData;
    }
    
    // Для формы проекта (с projectId)
    const questionElem = document.getElementById(`captchaQuestion-${projectId}`);
    const hashInput = document.getElementById(`captchaHash-${projectId}`);
    const answerInput = document.getElementById(`captchaAnswer-${projectId}`);
    
    if (questionElem) questionElem.textContent = captchaData.question;
    if (hashInput) hashInput.value = captchaData.hash;
    if (answerInput) answerInput.value = '';
    
    return captchaData;
}

/**
 * Проверяет ответ капчи
 */
export function validateCaptchaAnswer(userAnswer, expectedHash) {
    if (!userAnswer || !expectedHash) return false;
    return getMD5Hash(userAnswer.trim()) === expectedHash;
}

/**
 * Инициализирует капчу
 */
export function initCaptcha(projectId) {
    const captcha = generateCaptcha();
    updateCaptchaOnPage(projectId, captcha);
    return captcha;
}

/**
 * Обновляет капчу
 */
export function refreshCaptcha(projectId) {
    const newCaptcha = generateCaptcha();
    updateCaptchaOnPage(projectId, newCaptcha);
    return newCaptcha;
}

export default {
    generateCaptcha,
    updateCaptchaOnPage,
    validateCaptchaAnswer,
    initCaptcha,
    refreshCaptcha
};