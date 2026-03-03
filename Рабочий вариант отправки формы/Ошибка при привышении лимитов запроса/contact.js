/**
 * Контактная форма для сайта
 * Версия с правильным экспортом
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

// import { md5 } from "./utils";

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
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.addHiddenTimeField();
        this.setupCharacterCounter();
        this.setupValidation();
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
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
            // Собираем данные формы - ВАЖНО: используем правильные имена полей для PHP
            const formData = debugFormData({
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                project: document.getElementById('project').value.trim(),
                // phone: document.getElementById('phone')?.value.trim() || '', // Добавьте поле phone если есть
                captcha_answer: document.getElementById('captcha').value.trim(), // ИЗМЕНЕНО: captcha -> captcha_answer
                captcha_hash: document.getElementById('captchaHash').value,
                form_load_time: document.getElementById('formLoadTime').value,
                privacy: document.getElementById('privacy').checked ? '1' : '0'
            });
            
            // Добавляем текущую временную метку для предотвращения кеширования
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
                // Успех
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

                // Сбрасываем форму (кроме капчи и чекбокса)
                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('project').value = '';
                document.getElementById('captcha').value = '';
                    
                // Сбрасываем чекбокс privacy ВРУЧНУЮ
                const privacyCheckbox = document.getElementById('privacy');
                if (privacyCheckbox) {
                    privacyCheckbox.checked = false;
                    // Сбрасываем классы валидации
                    privacyCheckbox.classList.remove('valid', 'invalid');
                }
                
                // Сбрасываем счетчик
                const counter = document.getElementById('projectCounter');
                if (counter) counter.textContent = '0/2000 символов';

                // Сбрасываем классы валидации у полей
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
            } else {
                // Ошибка от сервера
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
            submitBtn.disabled = false;
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