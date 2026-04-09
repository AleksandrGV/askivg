// ========== MODULES/contact-form.js ==========
/**
 * Модуль контактной формы
 * Управляет валидацией, отправкой и состоянием формы
 */

import { 
    initCaptcha, 
    refreshCaptcha
    // validateCaptchaAnswer 
} from './captcha.js';

// Утилиты для работы с формой
class FormUtils {
    /**
     * Показывает сообщение пользователю
     * @param {string} text - Текст сообщения
     * @param {string} type - Тип сообщения (success, error, warning, info)
     * @param {HTMLElement} targetElement - Элемент после которого вставить сообщение
     */
    static showMessage(text, type = 'info', targetElement = null) {
        // Удаляем старое сообщение если есть
        const oldMessage = document.getElementById('formMessage');
        if (oldMessage) {
            oldMessage.remove();
        }
        
        // Создаем новое сообщение
        const messageElem = document.createElement('div');
        messageElem.id = 'formMessage';
        messageElem.className = 'form-message';
        
        // Настройка стилей в зависимости от типа
        const styles = {
            success: {
                background: '#d1fae5',
                color: '#065f46',
                borderColor: '#10b981'
            },
            error: {
                background: '#fee2e2',
                color: '#7f1d1d',
                borderColor: '#ef4444'
            },
            warning: {
                background: '#fef3c7',
                color: '#92400e',
                borderColor: '#f59e0b'
            },
            info: {
                background: '#dbeafe',
                color: '#1e3a8a',
                borderColor: '#3b82f6'
            }
        };
        
        const style = styles[type] || styles.info;
        messageElem.style.cssText = `
            margin: 15px 0;
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 14px;
            border-left: 4px solid ${style.borderColor};
            background: ${style.background};
            color: ${style.color};
            display: block;
        `;
        
        messageElem.textContent = text;
        
        // Вставляем сообщение в нужное место
        if (targetElement) {
            targetElement.parentNode.insertBefore(messageElem, targetElement.nextSibling);
        } else {
            // Ищем форму и вставляем после нее
            const form = document.getElementById('contactForm');
            if (form) {
                form.parentNode.insertBefore(messageElem, form.nextSibling);
            } else {
                document.body.appendChild(messageElem);
            }
        }
        
        // Автоскрытие для успешных сообщений
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                if (messageElem.parentNode) {
                    messageElem.style.opacity = '0';
                    messageElem.style.transition = 'opacity 0.5s';
                    setTimeout(() => messageElem.remove(), 500);
                }
            }, 5000);
        }
        
        return messageElem;
    }
    
    /**
     * Склонение минут для правильного отображения времени
     */
    static getMinutesText(minutes) {
        if (minutes === 1) {
            return 'минуту';
        }
        if (minutes >= 2 && minutes <= 4) {
            return 'минуты';
        }
        return 'минут';
    }
}

// Основной класс контактной формы
export class ContactForm {
    constructor(formId = 'contactForm') {
        this.form = document.getElementById(formId);
        this.captchaData = null;
        this.isSubmitting = false;
        this.rateLimitTimer = null;
        this.rateLimitEndTime = null;
        
        if (this.form) {
            this.initialize();
        }
        
        // 1. Убираем браузерную валидацию, но сохраняем required
        this.setupProgressiveEnhancement();
        
        // 2. Инициализируем капчу
        this.initCaptcha();
    }

    setupProgressiveEnhancement() {
        // Показываем капчу для JS пользователей
        const noscript = this.form.querySelector('noscript');
        const jsCaptcha = this.form.querySelector('.captcha-js');
        
        if (noscript) {
            noscript.style.display = 'none';
        }
        if (jsCaptcha) {
            jsCaptcha.style.display = 'block';
        }
        
        // Добавляем novalidate чтобы отключить браузерную валидацию
        // но сохраняем required для семантики
        this.form.setAttribute('novalidate', 'novalidate');
    }
    
    /**
     * Инициализация формы
     */
    initialize() {
        this.setupFormElements();
        this.setupEventListeners();
        this.initCaptcha();
        this.checkRateLimitOnLoad();
        this.setupRateLimitIndicator();
    }
    
    /**
     * Настройка элементов формы
     */
    setupFormElements() {
        // Создаем скрытое поле времени загрузки формы
        this.addHiddenTimeField();
        
        // Настраиваем счетчик символов для поля проекта
        this.setupCharacterCounter();
        
        // Создаем элементы для отображения ошибок если их нет
        this.createErrorElements();
    }
    
    /**
     * Настройка обработчиков событий
     */
    setupEventListeners() {
        // Основной обработчик отправки формы
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Валидация при потере фокуса
        this.setupFieldValidation();
        
        // Обработка чекбокса согласия
        this.setupPrivacyCheckbox();
        
        // Кнопка обновления капчи
        this.setupCaptchaRefreshButton();
    }
    
    /**
     * Инициализация капчи
     */
    initCaptcha() {
        // Генерируем новую капчу через модуль captcha.js
        this.captchaData = initCaptcha();
        
        // Дополнительно убеждаемся, что элементы формы обновлены
        const questionElem = document.getElementById('captchaQuestion');
        const hashInput = document.getElementById('captchaHash');
        const captchaInput = document.getElementById('captcha');
        
        if (questionElem && this.captchaData) {
            questionElem.textContent = this.captchaData.question;
        }
        
        if (hashInput && this.captchaData) {
            hashInput.value = this.captchaData.hash;
        }

        if (captchaInput) {
            captchaInput.value = '';
            captchaInput.classList.remove('valid', 'invalid');
        }

    }
    
    /**
     * Добавляет скрытое поле времени загрузки формы
     */
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
        
        // Обновляем время при любом вводе
        this.form.addEventListener('input', () => {
            timeField.value = Math.floor(Date.now() / 1000);
        });
    }
    
    /**
     * Настройка счетчика символов для поля проекта
     */
    setupCharacterCounter() {
        const projectField = document.getElementById('project');
        if (projectField) {
            // Создаем счетчик если его нет
            let counter = document.getElementById('projectCounter');
            if (!counter) {
                counter = document.createElement('div');
                counter.id = 'projectCounter';
                counter.className = 'character-counter';
                counter.style.cssText = 'font-size: 12px; color: #718096; text-align: right; margin-top: 4px;';
                projectField.parentNode.appendChild(counter);
            }
            
            projectField.addEventListener('input', function() {
                const length = this.value.length;
                counter.textContent = `${length}/2000 символов`;
                counter.style.color = length > 2000 ? '#e53e3e' : length > 1800 ? '#ed8936' : '#718096';
                
                // Автоматическое обрезание если превышен лимит
                if (length > 2000) {
                    this.value = this.value.substring(0, 2000);
                }
            });
            
            // Инициализируем начальное значение
            counter.textContent = `${projectField.value.length}/2000 символов`;
        }
    }
    
    /**
     * Создает элементы для отображения ошибок
     */
    createErrorElements() {
        const fields = ['name', 'email', 'project', 'captcha'];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !document.getElementById(fieldId + 'Error')) {
                const errorElem = document.createElement('span');
                errorElem.id = fieldId + 'Error';
                errorElem.className = 'contact__form-error';
                errorElem.style.cssText = 'color: #e53e3e; font-size: 12px; margin-top: 4px; display: none;';
                
                // Вставляем после поля или его контейнера
                field.parentNode.appendChild(errorElem);
            }
        });
    }
    
    /**
     * Настройка валидации полей при потере фокуса
     */
    setupFieldValidation() {
        const fields = ['name', 'email', 'project', 'captcha'];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldId));
                field.addEventListener('input', () => this.clearFieldError(fieldId));
            }
        });
    }
    
    /**
     * Настройка обработки чекбокса согласия
     */
    setupPrivacyCheckbox() {
        const privacyCheckbox = document.getElementById('privacy');
        if (privacyCheckbox) {
            // Создаем элемент для ошибки чекбокса если его нет
            if (!document.getElementById('privacyError')) {
                const privacyError = document.createElement('div');
                privacyError.id = 'privacyError';
                privacyError.className = 'contact__form-error';
                privacyError.style.cssText = 'color: #e53e3e; font-size: 12px; margin-top: 5px; display: none;';
                
                const privacyLabel = document.querySelector('label[for="privacy"]');
                if (privacyLabel && privacyLabel.parentNode) {
                    privacyLabel.parentNode.appendChild(privacyError);
                } else if (privacyCheckbox.parentNode) {
                    privacyCheckbox.parentNode.appendChild(privacyError);
                }
            }
            
            // Валидация при изменении состояния
            privacyCheckbox.addEventListener('change', () => {
                this.validatePrivacyField();
            });
        }
    }
    
    /**
     * Настройка кнопки обновления капчи
     */
    setupCaptchaRefreshButton() {
        const refreshBtn = document.getElementById('refreshCaptcha');
        if (refreshBtn) {
            // Удаляем старый обработчик, если был
            refreshBtn.replaceWith(refreshBtn.cloneNode(true));
            const newRefreshBtn = document.getElementById('refreshCaptcha');
            
            newRefreshBtn.addEventListener('click', () => {
                // Генерируем новую капчу
                this.captchaData = refreshCaptcha();
                
                // Обновляем отображение
                const questionElem = document.getElementById('captchaQuestion');
                const hashInput = document.getElementById('captchaHash');
                
                if (questionElem && this.captchaData) {
                    questionElem.textContent = this.captchaData.question;
                }
                
                if (hashInput && this.captchaData) {
                    hashInput.value = this.captchaData.hash;
                }
                
                // Очищаем поле ввода
                const captchaInput = document.getElementById('captcha');
                if (captchaInput) {
                    captchaInput.value = '';
                    captchaInput.classList.remove('valid', 'invalid');
                }
                
                FormUtils.showMessage('Капча обновлена', 'info');
            });
        }
    }
    
    /**
     * Проверяет блокировку при загрузке страницы
     */
    checkRateLimitOnLoad() {
        const savedEndTime = localStorage.getItem('rateLimitEndTime');
        if (savedEndTime) {
            const endTime = parseInt(savedEndTime);
            const now = Date.now();
            
            if (now < endTime) {
                this.rateLimitEndTime = endTime;
                this.startRateLimitCountdown(endTime - now);
                this.disableForm(true);
            } else {
                localStorage.removeItem('rateLimitEndTime');
            }
        }
    }
    
    /**
     * Настройка индикатора rate limit
     */
    setupRateLimitIndicator() {
        // Создаем контейнер для таймера если его нет
        let timerContainer = document.getElementById('rateLimitTimer');
        if (!timerContainer) {
            timerContainer = document.createElement('div');
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
            
            // Вставляем после формы
            if (this.form.nextSibling) {
                this.form.parentNode.insertBefore(timerContainer, this.form.nextSibling);
            } else {
                this.form.parentNode.appendChild(timerContainer);
            }
        }
    }
    
    /**
     * Очищает ошибку поля
     */
    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElem = document.getElementById(fieldId + 'Error');
        
        if (field) {
            field.classList.remove('invalid');
        }
        
        if (errorElem) {
            errorElem.textContent = '';
            errorElem.style.display = 'none';
        }
    }
    
    /**
     * Валидация отдельного поля
     */
    validateField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) {
            return true;
        }
        
        const errorElem = document.getElementById(fieldId + 'Error');
        if (!errorElem) {
            return true;
        }
        
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch (fieldId) {
        case 'name':
            if (!value) {
                errorMessage = 'Введите ваше имя';
            } else if (value.length < 2) {
                errorMessage = 'Имя должно содержать минимум 2 символа';
            } else if (value.length > 100) {
                errorMessage = 'Имя не должно превышать 100 символов';
            }
            break;
                
        case 'email':
            if (!value) {
                errorMessage = 'Введите email адрес';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errorMessage = 'Введите корректный email адрес';
            } else if (value.length > 150) {
                errorMessage = 'Email слишком длинный';
            }
            break;
                
        case 'project':
            if (!value) {
                errorMessage = 'Опишите ваш проект';
            } else if (value.length < 10) {
                errorMessage = 'Описание проекта должно содержать минимум 10 символов';
            } else if (value.length > 2000) {
                errorMessage = 'Описание проекта не должно превышать 2000 символов';
            }
            break;
                
        case 'captcha':
            if (!value) {
                errorMessage = 'Введите ответ на вопрос';
            } else if (!/^\d+$/.test(value)) {
                errorMessage = 'Ответ должен содержать только цифры';
            }
            break;
        }
        
        if (errorMessage) {
            field.classList.add('invalid');
            field.classList.remove('valid');
            errorElem.textContent = errorMessage;
            errorElem.style.display = 'block';
            isValid = false;
        } else {
            field.classList.remove('invalid');
            field.classList.add('valid');
            errorElem.textContent = '';
            errorElem.style.display = 'none';
        }
        
        return isValid;
    }
    
    /**
     * Валидация чекбокса согласия
     */
    validatePrivacyField() {
        const privacyCheckbox = document.getElementById('privacy');
        const privacyError = document.getElementById('privacyError');
        
        if (!privacyCheckbox) {
            return true;
        }
        
        if (!privacyCheckbox.checked) {
            if (privacyError) {
                privacyError.textContent = 'Необходимо согласие с политикой конфиденциальности';
                privacyError.style.display = 'block';
            }
            return false;
        } else {
            if (privacyError) {
                privacyError.style.display = 'none';
            }
            return true;
        }
    }
    
    /**
     * Валидация всех полей формы в правильном порядке
     */
    validateAllFields() {
        // Проверяем блокировку
        if (this.rateLimitEndTime && Date.now() < this.rateLimitEndTime) {
            const remainingSeconds = Math.ceil((this.rateLimitEndTime - Date.now()) / 1000);
            FormUtils.showMessage(
                `Слишком много запросов. Подождите ${remainingSeconds} секунд.`,
                'error'
            );
            return false;
        }
        
        let allValid = true;
        let firstErrorField = null;
        
        // ВАЛИДАЦИЯ В ПОРЯДКЕ ИЗ HTML:
        // 1. Имя
        if (!this.validateField('name')) {
            allValid = false;
            firstErrorField = 'name';
        }
        
        // 2. Email
        if (!this.validateField('email')) {
            allValid = false;
            if (!firstErrorField) {
                firstErrorField = 'email';
            }
        }
        
        // 3. Проект
        if (!this.validateField('project')) {
            allValid = false;
            if (!firstErrorField) {
                firstErrorField = 'project';
            }
        }
        
        // 4. Чекбокс согласия (после проекта, перед капчей)
        if (!this.validatePrivacyField()) {
            allValid = false;
            if (!firstErrorField) {
                firstErrorField = 'privacy';
            }
        }
        
        // 5. Капча (последняя в форме)
        if (!this.validateField('captcha')) {
            allValid = false;
            if (!firstErrorField) {
                firstErrorField = 'captcha';
            }
        }
        
        // Фокусируемся на первом поле с ошибкой
        if (!allValid && firstErrorField) {
            this.scrollToField(firstErrorField);
        }
        
        return allValid;
    }
    
    /**
     * Скролл к полю с ошибкой
     */
    scrollToField(fieldId) {
        let element;
        
        if (fieldId === 'privacy') {
            element = document.getElementById('privacy');
        } else {
            element = document.getElementById(fieldId);
        }
        
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            setTimeout(() => {
                if (fieldId === 'privacy') {
                    element.focus();
                } else {
                    element.focus();
                }
            }, 500);
        }
    }
    
    /**
     * Отключение/включение формы
     */
    disableForm(disable) {
        const submitBtn = this.form.querySelector('.contact__form-submit');
        const inputs = this.form.querySelectorAll('input:not([type="hidden"]), textarea, button');
        const timerContainer = document.getElementById('rateLimitTimer');
        
        if (submitBtn) {
            submitBtn.disabled = disable;
        }
        
        inputs.forEach(input => {
            if (input !== submitBtn && input.type !== 'hidden') {
                input.disabled = disable;
            }
        });
        
        if (timerContainer) {
            timerContainer.style.display = disable ? 'block' : 'none';
        }
    }
    
    /**
     * Запуск таймера обратного отсчета при блокировке
     */
    startRateLimitCountdown(milliseconds) {
        const timerContainer = document.getElementById('rateLimitTimer');
        if (!timerContainer) {
            return;
        }
        
        let remainingTime = Math.ceil(milliseconds / 1000);
        
        const updateTimer = () => {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            
            if (remainingTime <= 0) {
                clearInterval(this.rateLimitTimer);
                this.disableForm(false);
                FormUtils.showMessage('Теперь вы можете отправить форму снова', 'info');
                localStorage.removeItem('rateLimitEndTime');
                this.rateLimitEndTime = null;
                return;
            }
            
            if (minutes > 0) {
                timerContainer.textContent = `Слишком много запросов. Попробуйте через ${minutes} ${FormUtils.getMinutesText(minutes)} и ${seconds} секунд`;
            } else {
                timerContainer.textContent = `Слишком много запросов. Попробуйте через ${seconds} секунд`;
            }
            
            remainingTime--;
        };
        
        if (this.rateLimitTimer) {
            clearInterval(this.rateLimitTimer);
        }
        
        updateTimer();
        this.rateLimitTimer = setInterval(updateTimer, 1000);
    }

    /**
 * Обработчик отправки формы
 */
    async handleSubmit(e) {
        e.preventDefault();

        // ПРОВЕРКА: загружена ли MD5 библиотека
        if (typeof window.md5 !== 'function') {
            FormUtils.showMessage('Пожалуйста, подождите секунду и попробуйте снова (загружается библиотека)', 'warning');
            // Обновляем капчу через секунду
            setTimeout(() => {
                this.captchaData = refreshCaptcha();
            }, 1000);
            return;
        }

        // ПРОВЕРКА: хеш должен быть 32 символа (MD5)
        const currentHash = document.getElementById('captchaHash').value;
        if (currentHash.length !== 32) {
            console.error('❌ Хеш капчи некорректной длины:', currentHash);
            this.captchaData = refreshCaptcha();
            FormUtils.showMessage('Ошибка капчи. Пожалуйста, обновите страницу.', 'error');
            return;
        }
    
        // Проверяем блокировку
        if (this.rateLimitEndTime && Date.now() < this.rateLimitEndTime) {
            const remainingSeconds = Math.ceil((this.rateLimitEndTime - Date.now()) / 1000);
            FormUtils.showMessage(
                `Пожалуйста, подождите ${remainingSeconds} секунд перед следующей отправкой.`,
                'warning'
            );
            return;
        }
    
        // Проверяем отправку
        if (this.isSubmitting) {
            return;
        }
        
        // Валидация всех полей
        if (!this.validateAllFields()) {
            return;
        }
    
        // Начинаем отправку
        this.isSubmitting = true;
        this.setSubmitButtonState(true);
    
        try {
            // Собираем данные формы
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                project: document.getElementById('project').value.trim(),
                privacy: document.getElementById('privacy').checked ? '1' : '0',
                captcha_answer: document.getElementById('captcha').value.trim(),
                captcha_hash: document.getElementById('captchaHash').value,
                form_load_time: document.getElementById('formLoadTime').value,
                _t: Date.now() // Таймстамп для уникальности запроса
            };
        
            // Отправка на сервер
            const response = await fetch('php/send_form.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: new URLSearchParams(formData)
            });
        
            // Парсим ответ
            const text = await response.text();
            let result;
            
            try {
                result = JSON.parse(text);
            } catch (parseError) {
                console.error('Ошибка парсинга ответа:', parseError);
                throw new Error('Некорректный ответ сервера');
            }
        
            // Обработка ответа
            if (response.ok && result.success) {
                // УСПЕШНАЯ ОТПРАВКА
                FormUtils.showMessage(result.message, 'success');
                
                // Обновляем капчу из ответа сервера (ВАЖНО!)
                if (result.data?.captcha) {
                    this.updateCaptchaFromServer(result.data.captcha);
                } else {
                    // Если сервер не вернул капчу, генерируем новую
                    this.captchaData = refreshCaptcha();
                }
                
                // Сбрасываем форму
                this.resetForm();
                
                // Сбрасываем блокировку если была
                localStorage.removeItem('rateLimitEndTime');
                this.rateLimitEndTime = null;
                
            } else if (response.status === 429) {
                // СЛИШКОМ МНОГО ЗАПРОСОВ
                const retryAfter = result.data?.retry_after || 3600;
                const minutes = Math.ceil(retryAfter / 60);
                const message = `Вы отправили слишком много запросов. Пожалуйста, попробуйте через ${minutes} ${FormUtils.getMinutesText(minutes)}.`;
                
                FormUtils.showMessage(message, 'error');
                
                // Сохраняем блокировку
                const endTime = Date.now() + (retryAfter * 1000);
                this.rateLimitEndTime = endTime;
                localStorage.setItem('rateLimitEndTime', endTime.toString());
                
                // Блокируем форму
                this.disableForm(true);
                this.startRateLimitCountdown(retryAfter * 1000);
                
            } else {
                // ОШИБКА ВАЛИДАЦИИ
                const errorMessage = result.message || `Ошибка ${response.status}`;
                
                // Более дружелюбные сообщения для капчи
                if (errorMessage.includes('математическую задачу') || errorMessage.includes('капч')) {
                    FormUtils.showMessage('❌ Неверный ответ на капчу. Попробуйте еще раз или обновите капчу.', 'error');
                    this.captchaData = refreshCaptcha();
                } else {
                    FormUtils.showMessage('❌ ' + errorMessage, 'error');
                }
            }
            
        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            
            let userMessage = 'Ошибка отправки. Проверьте подключение и попробуйте еще раз.';
            
            if (error.message.includes('Failed to fetch')) {
                userMessage = 'Не удалось подключиться к серверу. Проверьте интернет-соединение.';
            } else if (error.message.includes('Некорректный')) {
                userMessage = 'Ошибка обработки ответа сервера.';
            }
            
            FormUtils.showMessage(userMessage, 'error');
            this.captchaData = refreshCaptcha();
            
        } finally {
            // Восстанавливаем кнопку если не заблокирована
            if (!(this.rateLimitEndTime && Date.now() < this.rateLimitEndTime)) {
                this.setSubmitButtonState(false);
            }
            this.isSubmitting = false;
        }
    }

    
    /**
     * Устанавливает состояние кнопки отправки
     */
    setSubmitButtonState(isLoading) {
        const submitBtn = this.form.querySelector('.contact__form-submit');
        const btnText = submitBtn.querySelector('.contact__form-submit-text');
        const btnLoader = submitBtn.querySelector('.contact__form-submit-loader');
        
        submitBtn.disabled = isLoading;
        
        if (btnText) {
            btnText.style.display = isLoading ? 'none' : 'inline';
        }
        
        if (btnLoader) {
            btnLoader.style.display = isLoading ? 'inline' : 'none';
        }
    }
    
    /**
     * Сброс формы после успешной отправки
     */
    resetForm() {
        // Очищаем поля
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('project').value = '';
        document.getElementById('captcha').value = '';
        
        // Сбрасываем чекбокс
        const privacyCheckbox = document.getElementById('privacy');
        if (privacyCheckbox) {
            privacyCheckbox.checked = false;
            privacyCheckbox.classList.remove('valid', 'invalid');
            
            const privacyError = document.getElementById('privacyError');
            if (privacyError) {
                privacyError.style.display = 'none';
            }
        }
        
        // Сбрасываем счетчик
        const counter = document.getElementById('projectCounter');
        if (counter) {
            counter.textContent = '0/2000 символов';
        }
        
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
                errorElem.style.display = 'none';
            }
        });
        
        // Обновляем время загрузки формы
        const timeField = document.getElementById('formLoadTime');
        if (timeField) {
            timeField.value = Math.floor(Date.now() / 1000);
        }
        
        // Скроллим к началу формы
        setTimeout(() => {
            this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    }

    /**
 * Обновляет капчу из данных, полученных от сервера
 * @param {Object} captchaData - данные капчи с сервера {question, hash}
 */
    updateCaptchaFromServer(captchaData) {
        if (!captchaData) {
            return;
        }
        
        // Обновляем вопрос капчи
        const questionElem = document.getElementById('captchaQuestion');
        if (questionElem) {
            questionElem.textContent = captchaData.question;
        }
        
        // Обновляем хеш
        const hashInput = document.getElementById('captchaHash');
        if (hashInput) {
            hashInput.value = captchaData.hash;
        }
        
        // Очищаем поле ввода
        const captchaInput = document.getElementById('captcha');
        if (captchaInput) {
            captchaInput.value = '';
            captchaInput.classList.remove('valid', 'invalid');
        }
        
        // Сохраняем в объекте
        this.captchaData = captchaData;
    }
}

// Экспорт для использования в других модулях
export default ContactForm;