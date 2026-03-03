/**
 * Контактная форма для сайта
 * Версия с правильным экспортом и обработкой ошибки 429
 */

// Добавьте в начало файла после импортов
function debugFormData(data) {
    console.group('Отправка данных формы');
    for (let [key, value] of Object.entries(data)) {
        console.log(`${key}:`, value);
    }
    console.groupEnd();
    return data;
}

// MD5 функция
function md5(str) {
    if (typeof CryptoJS !== 'undefined') {
        return CryptoJS.MD5(str).toString();
    }
    console.error('CryptoJS не загружен!');
    return '00000000000000000000000000000000';
}

// Вспомогательная функция для правильного склонения минут
function getMinutesText(minutes) {
    if (minutes === 1) return 'минуту';
    if (minutes >= 2 && minutes <= 4) return 'минуты';
    return 'минут';
}

// Капча
class CaptchaManager {
    constructor() {
        this.currentCaptcha = null;
        this.init();
    }
    
    init() {
        this.generateNewCaptcha();
        this.setupRefreshButton();
    }
    
    generateNewCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const answer = num1 + num2;
        
        this.currentCaptcha = {
            question: `Сколько будет ${num1} + ${num2}?`,
            answer: answer.toString(),
            hash: md5(answer.toString())
        };
        
        this.updateDisplay();
        return this.currentCaptcha;
    }
    
    updateDisplay() {
        const questionElem = document.getElementById('captchaQuestion');
        const hashInput = document.getElementById('captchaHash');
        
        if (questionElem) {
            questionElem.textContent = this.currentCaptcha.question;
        }
        
        if (hashInput) {
            hashInput.value = this.currentCaptcha.hash;
        }
        
        // Очищаем поле для ответа
        const answerInput = document.getElementById('captcha');
        if (answerInput) {
            answerInput.value = '';
        }
    }
    
    setupRefreshButton() {
        const refreshBtn = document.getElementById('refreshCaptcha');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.generateNewCaptcha();
                this.showMessage('Капча обновлена', 'info');
            });
        }
    }
    
    getCurrentCaptcha() {
        return this.currentCaptcha;
    }
    
    showMessage(text, type = 'info') {
        const messageElem = document.getElementById('formMessage');
        if (!messageElem) {
            // Создаем элемент если его нет
            const newMsg = document.createElement('div');
            newMsg.id = 'formMessage';
            newMsg.style.cssText = 'margin: 15px 0; padding: 12px; border-radius: 6px;';
            if (this.form) {
                this.form.parentNode.insertBefore(newMsg, this.form.nextSibling);
            } else {
                document.body.appendChild(newMsg);
            }
        }
        
        messageElem.textContent = text;
        messageElem.className = 'form-message ' + type;
        messageElem.style.display = 'block';
        
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                messageElem.style.display = 'none';
            }, 5000);
        }
    }
}

// Форма
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.captchaManager = new CaptchaManager();
        this.isSubmitting = false;
        this.rateLimitTimer = null; // Таймер для блокировки при 429
        this.rateLimitEndTime = null; // Время окончания блокировки
        
        if (this.form) {
            this.init();
            this.checkRateLimitOnLoad(); // Проверяем блокировку при загрузке
        }
    }
    
    init() {
        this.addHiddenTimeField();
        this.setupCharacterCounter();
        this.setupValidation();
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setupRateLimitIndicator(); // Добавляем индикатор rate limit
    }
    
    // Проверяем блокировку при загрузке страницы
    checkRateLimitOnLoad() {
        const savedEndTime = localStorage.getItem('rateLimitEndTime');
        if (savedEndTime) {
            const endTime = parseInt(savedEndTime);
            const now = Date.now();
            
            if (now < endTime) {
                // Блокировка еще активна
                this.rateLimitEndTime = endTime;
                this.startRateLimitCountdown(endTime - now);
                this.disableForm(true);
            } else {
                // Блокировка истекла
                localStorage.removeItem('rateLimitEndTime');
            }
        }
    }
    
    // Настраиваем индикатор rate limit
    setupRateLimitIndicator() {
        // Создаем элемент для отображения таймера
        const timerContainer = document.createElement('div');
        timerContainer.id = 'rateLimitTimer';
        timerContainer.style.cssText = `
            display: none;
            background: #fed7d7;
            color: #c53030;
            padding: 10px;
            border-radius: 6px;
            margin-top: 15px;
            font-size: 14px;
            text-align: center;
            border: 1px solid #feb2b2;
        `;
        
        // Вставляем после формы или перед ней
        if (this.form.nextSibling) {
            this.form.parentNode.insertBefore(timerContainer, this.form.nextSibling);
        } else {
            this.form.parentNode.appendChild(timerContainer);
        }
    }
    
    // Включает/выключает форму при блокировке
    disableForm(disable) {
        const submitBtn = this.form.querySelector('.contact__form-submit');
        const inputs = this.form.querySelectorAll('input:not([type="hidden"]), textarea, button');
        
        if (submitBtn) {
            submitBtn.disabled = disable;
        }
        
        inputs.forEach(input => {
            if (input !== submitBtn && input.type !== 'hidden') {
                input.disabled = disable;
            }
        });
        
        // Показываем/скрываем индикатор
        const timerContainer = document.getElementById('rateLimitTimer');
        if (timerContainer) {
            timerContainer.style.display = disable ? 'block' : 'none';
        }
    }
    
    // Запускает таймер обратного отсчета
    startRateLimitCountdown(milliseconds) {
        const timerContainer = document.getElementById('rateLimitTimer');
        if (!timerContainer) return;
        
        let remainingTime = Math.ceil(milliseconds / 1000);
        
        const updateTimer = () => {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            
            if (remainingTime <= 0) {
                // Время вышло
                clearInterval(this.rateLimitTimer);
                this.disableForm(false);
                this.captchaManager.showMessage('Теперь вы можете отправить форму снова', 'info');
                localStorage.removeItem('rateLimitEndTime');
                this.rateLimitEndTime = null;
                return;
            }
            
            // Обновляем текст
            if (minutes > 0) {
                timerContainer.textContent = `Слишком много запросов. Попробуйте через ${minutes} ${getMinutesText(minutes)} и ${seconds} секунд`;
            } else {
                timerContainer.textContent = `Слишком много запросов. Попробуйте через ${seconds} секунд`;
            }
            
            remainingTime--;
        };
        
        // Останавливаем предыдущий таймер
        if (this.rateLimitTimer) {
            clearInterval(this.rateLimitTimer);
        }
        
        // Запускаем новый
        updateTimer();
        this.rateLimitTimer = setInterval(updateTimer, 1000);
    }
    
    addHiddenTimeField() {
        let timeField = document.getElementById('formLoadTime');
        if (!timeField) {
            timeField = document.createElement('input');
            timeField.type = 'hidden';
            timeField.name = 'form_load_time';
            timeField.id = 'formLoadTime';
            timeField.value = Math.floor(Date.now() / 1000);
            this.form.appendChild(timeField);
        }
        
        this.form.addEventListener('input', () => {
            timeField.value = Math.floor(Date.now() / 1000);
        });
    }
    
    setupCharacterCounter() {
        const projectField = document.getElementById('project');
        if (projectField) {
            projectField.addEventListener('input', function() {
                const counter = document.getElementById('projectCounter');
                if (!counter) return;
                
                const length = this.value.length;
                counter.textContent = `${length}/2000 символов`;
                counter.style.color = length > 2000 ? '#e53e3e' : 
                                    length > 1800 ? '#ed8936' : '#718096';
                
                if (length > 2000) {
                    this.value = this.value.substring(0, 2000);
                }
            });
        }
    }
    
    setupValidation() {
        // Простая валидация при blur
        const fields = ['name', 'email', 'project', 'captcha'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldId));
            }
        });
    }
    
    validateField(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElem = document.getElementById(fieldId + 'Error');
        if (!field || !errorElem) return true;
        
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch (fieldId) {
            case 'name':
                if (!value) errorMessage = 'Введите имя';
                else if (value.length < 2) errorMessage = 'Минимум 2 символа';
                break;
            case 'email':
                if (!value) errorMessage = 'Введите email';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errorMessage = 'Некорректный email';
                break;
            case 'project':
                if (!value) errorMessage = 'Опишите проект';
                else if (value.length < 10) errorMessage = 'Минимум 10 символов';
                break;
            case 'captcha':
                if (!value) errorMessage = 'Введите ответ';
                else if (!/^\d+$/.test(value)) errorMessage = 'Только цифры';
                break;
        }
        
        if (errorMessage) {
            field.classList.add('invalid');
            field.classList.remove('valid');
            errorElem.textContent = errorMessage;
            isValid = false;
        } else {
            field.classList.remove('invalid');
            field.classList.add('valid');
            errorElem.textContent = '';
        }
        
        return isValid;
    }
    
    validateAllFields() {
        // Проверяем, не активна ли блокировка
        if (this.rateLimitEndTime && Date.now() < this.rateLimitEndTime) {
            const remainingSeconds = Math.ceil((this.rateLimitEndTime - Date.now()) / 1000);
            this.captchaManager.showMessage(
                `Слишком много запросов. Подождите ${remainingSeconds} секунд.`,
                'error'
            );
            return false;
        }
        
        const fields = ['name', 'email', 'project', 'captcha'];
        let allValid = true;
        
        fields.forEach(fieldId => {
            if (!this.validateField(fieldId)) {
                allValid = false;
            }
        });
        
        // Проверка согласия
        const privacyField = document.getElementById('privacy');
        if (privacyField && !privacyField.checked) {
            this.captchaManager.showMessage('Согласитесь с политикой конфиденциальности', 'error');
            allValid = false;
        }
        
        return allValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Проверяем блокировку перед отправкой
        if (this.rateLimitEndTime && Date.now() < this.rateLimitEndTime) {
            const remainingSeconds = Math.ceil((this.rateLimitEndTime - Date.now()) / 1000);
            this.captchaManager.showMessage(
                `Пожалуйста, подождите ${remainingSeconds} секунд перед следующей отправкой.`,
                'warning'
            );
            return;
        }
        
        if (this.isSubmitting) return;
        if (!this.validateAllFields()) return;
        
        this.isSubmitting = true;
        
        const submitBtn = this.form.querySelector('.contact__form-submit');
        const btnText = submitBtn.querySelector('.contact__form-submit-text');
        const btnLoader = submitBtn.querySelector('.contact__form-submit-loader');
        
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        
        try {
            // Собираем данные формы
            const formData = debugFormData({
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                project: document.getElementById('project').value.trim(),
                // phone: document.getElementById('phone')?.value.trim() || '',
                captcha_answer: document.getElementById('captcha').value.trim(),
                captcha_hash: document.getElementById('captchaHash').value,
                form_load_time: document.getElementById('formLoadTime').value,
                privacy: document.getElementById('privacy').checked ? '1' : '0'
            });
            
            // Добавляем текущую временную метку
            formData._t = Date.now();
            
            // Проверяем наличие всех обязательных элементов
            const requiredElements = ['name', 'email', 'project', 'captcha', 'captchaHash', 'formLoadTime', 'privacy'];
            for (const elemId of requiredElements) {
                const elem = document.getElementById(elemId);
                if (!elem) {
                    this.captchaManager.showMessage(`Ошибка: не найден элемент ${elemId}`, 'error');
                    throw new Error(`Missing element: ${elemId}`);
                }
            }
            
            const response = await fetch('php/send_form.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: new URLSearchParams(formData)
            });
            
            let result;
            
            try {
                const text = await response.text();
                result = JSON.parse(text);
            } catch (parseError) {
                console.error('Ошибка парсинга ответа:', parseError);
                console.log('Сырой ответ сервера:', text || 'Нет ответа');
                throw new Error('Некорректный ответ сервера');
            }
            
            if (response.ok && result.success) {
                // Успешная отправка
                this.captchaManager.showMessage(result.message, 'success');
                
                // Обновляем капчу
                if (result.data?.captcha) {
                    this.captchaManager.currentCaptcha = {
                        question: result.data.captcha.question,
                        hash: result.data.captcha.hash
                    };
                    this.captchaManager.updateDisplay();
                } else {
                    this.captchaManager.generateNewCaptcha();
                }

                // Сбрасываем форму
                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('project').value = '';
                document.getElementById('captcha').value = '';
                    
                // Сбрасываем чекбокс privacy
                const privacyCheckbox = document.getElementById('privacy');
                if (privacyCheckbox) {
                    privacyCheckbox.checked = false;
                    privacyCheckbox.classList.remove('valid', 'invalid');
                }
                
                // Сбрасываем счетчик
                const counter = document.getElementById('projectCounter');
                if (counter) counter.textContent = '0/2000 символов';

                // Сбрасываем классы валидации
                const fields = ['name', 'email', 'project', 'captcha'];
                fields.forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    const errorElem = document.getElementById(fieldId + 'Error');
                    if (field) {
                        field.classList.remove('valid', 'invalid');
                    }
                    if (errorElem) {
                        errorElem.textContent = '';
                    }
                });
                
                // Обновляем время загрузки формы
                const timeField = document.getElementById('formLoadTime');
                if (timeField) {
                    timeField.value = Math.floor(Date.now() / 1000);
                }
                
                // Сбрасываем информацию о блокировке
                localStorage.removeItem('rateLimitEndTime');
                this.rateLimitEndTime = null;
                
            } else if (response.status === 429) {
                // Обработка ошибки 429 - Too Many Requests
                let retryAfter = 3600; // По умолчанию 1 час
                let userMessage = 'Вы отправили слишком много запросов. Пожалуйста, попробуйте через час.';
                
                // Пытаемся получить время блокировки из ответа
                if (result.data?.retry_after) {
                    retryAfter = result.data.retry_after;
                }
                
                // Преобразуем секунды в минуты для сообщения
                const minutes = Math.ceil(retryAfter / 60);
                userMessage = `Вы отправили слишком много запросов. Пожалуйста, попробуйте через ${minutes} ${getMinutesText(minutes)}.`;
                
                this.captchaManager.showMessage(userMessage, 'error');
                
                // Сохраняем время окончания блокировки
                const endTime = Date.now() + (retryAfter * 1000);
                this.rateLimitEndTime = endTime;
                localStorage.setItem('rateLimitEndTime', endTime.toString());
                
                // Блокируем форму и запускаем таймер
                this.disableForm(true);
                this.startRateLimitCountdown(retryAfter * 1000);
                
            } else {
                // Другие ошибки от сервера
                const errorMessage = result.message || `Ошибка ${response.status}: ${response.statusText}`;
                this.captchaManager.showMessage(errorMessage, 'error');
                
                // Если ошибка связана с капчей, обновляем ее
                if (errorMessage.includes('математическую задачу') || errorMessage.includes('капч')) {
                    this.captchaManager.generateNewCaptcha();
                }
            }
            
        } catch (error) {
            console.error('Ошибка отправки:', error);
            
            let userMessage = 'Ошибка отправки. Проверьте подключение и попробуйте еще раз.';
            
            if (error.message.includes('Failed to fetch')) {
                userMessage = 'Не удалось подключиться к серверу. Проверьте интернет-соединение.';
            } else if (error.message.includes('Missing element')) {
                userMessage = 'Ошибка формы. Обновите страницу.';
            } else if (error.message.includes('парсинга') || error.message.includes('Некорректный')) {
                userMessage = 'Ошибка обработки ответа сервера.';
            }
            
            this.captchaManager.showMessage(userMessage, 'error');
            this.captchaManager.generateNewCaptcha();
            
        } finally {
            // Восстанавливаем кнопку, если не заблокирована
            if (!(this.rateLimitEndTime && Date.now() < this.rateLimitEndTime)) {
                submitBtn.disabled = false;
            }
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            this.isSubmitting = false;
        }
    }
}

// Экспорт функции инициализации
export function initContactForm() {
    // Проверяем наличие CryptoJS
    if (typeof CryptoJS === 'undefined') {
        console.error('CryptoJS не подключен! Добавьте в head:');
        console.error('<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>');
        
        // Создаем уведомление на сайте
        const alert = document.createElement('div');
        alert.style.cssText = 'background:#f56565;color:white;padding:10px;text-align:center;position:fixed;top:0;left:0;right:0;z-index:10000;';
        alert.innerHTML = 'Ошибка: библиотека CryptoJS не загружена. Форма может не работать.';
        document.body.appendChild(alert);
    }
    
    // Инициализируем форму
    new ContactForm();
}

// Экспорт по умолчанию
export default {
    initContactForm
};