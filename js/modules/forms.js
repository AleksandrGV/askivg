import { Notification } from './utils.js';

export class Forms {
    constructor() {
        this.notification = new Notification();
    }

    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) {return;}
        
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const projectField = document.getElementById('project');
        
        if (nameField) {
            nameField.addEventListener('blur', () => this.validateField(nameField, 'name'));
            nameField.addEventListener('input', () => this.clearFieldError(nameField, 'nameError'));
        }
        
        if (emailField) {
            emailField.addEventListener('blur', () => this.validateField(emailField, 'email'));
            emailField.addEventListener('input', () => this.clearFieldError(emailField, 'emailError'));
        }
        
        if (projectField) {
            projectField.addEventListener('blur', () => this.validateField(projectField, 'project'));
            projectField.addEventListener('input', () => this.clearFieldError(projectField, 'projectError'));
        }
        
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    validateField(field, type) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch (type) {
        case 'name':
            if (!value) {
                errorMessage = 'Пожалуйста, введите ваше имя';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Имя должно содержать минимум 2 символа';
                isValid = false;
            }
            break;
                
        case 'email':
            if (!value) {
                errorMessage = 'Пожалуйста, введите email или телефон';
                isValid = false;
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const phoneRegex = /^\+?[1-9]\d{6,14}$/;
                    
                if (!emailRegex.test(value) && !phoneRegex.test(value.replace(/[\s\-()]/g, ''))) {
                    errorMessage = 'Введите корректный email или номер телефона';
                    isValid = false;
                }
            }
            break;
                
        case 'project':
            if (!value) {
                errorMessage = 'Пожалуйста, опишите ваш проект';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Описание должно содержать минимум 10 символов';
                isValid = false;
            }
            break;
        }
        
        this.showFieldError(field, errorMessage, isValid);
        return isValid;
    }

    showFieldError(field, errorMessage, isValid) {
        const errorElement = document.getElementById(field.name + 'Error');
        
        if (isValid) {
            field.classList.remove('invalid');
            field.classList.add('valid');
            if (errorElement) {errorElement.textContent = '';}
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');
            if (errorElement) {errorElement.textContent = errorMessage;}
        }
    }

    clearFieldError(field, errorId) {
        field.classList.remove('invalid', 'valid');
        const errorElement = document.getElementById(errorId);
        if (errorElement) {errorElement.textContent = '';}
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = form.querySelector('.contact__form-submit');
        const nameField = form.querySelector('#name');
        const emailField = form.querySelector('#email');
        const projectField = form.querySelector('#project');
        const privacyField = form.querySelector('#privacy');
        
        const isNameValid = this.validateField(nameField, 'name');
        const isEmailValid = this.validateField(emailField, 'email');
        const isProjectValid = this.validateField(projectField, 'project');
        
        let isPrivacyValid = true;
        if (!privacyField.checked) {
            this.notification.show('Пожалуйста, согласитесь с политикой конфиденциальности', 'error');
            isPrivacyValid = false;
        }
        
        if (!isNameValid || !isEmailValid || !isProjectValid || !isPrivacyValid) {
            return;
        }
        
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        try {
            const result = await this.submitFormData({
                name: nameField.value,
                email: emailField.value,
                project: projectField.value
            });
            
            this.notification.show(result.message, 'success');
            form.reset();
            
            [nameField, emailField, projectField].forEach(field => {
                field.classList.remove('valid', 'invalid');
            });
            
        } catch (error) {
            this.notification.show(error.message, 'error');
        } finally {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }

    async submitFormData(data) {
        try {
            const response = await fetch('php/send_form.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseText = await response.text();
            let result;
            
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error('Сервер вернул некорректный ответ');
            }
            
            if (!response.ok) {
                throw new Error(result.message || 'Ошибка сервера');
            }
            
            return result;
            
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Проблема с соединением. Проверьте интернет и попробуйте снова.');
            }
            
            throw error;
        }
    }
}