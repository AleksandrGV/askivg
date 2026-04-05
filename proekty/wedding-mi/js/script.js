// ============================================
// 1. ТАЙМЕР ОБРАТНОГО ОТСЧЕТА
// ============================================

const targetDate = new Date('2023-11-01T12:00:00');

function updateCountdown() {
    const now = new Date();
    const remainingTime = targetDate - now;

    if (remainingTime <= 0) {
        document.getElementById('days').innerText = '00';
        document.getElementById('hours').innerText = '00';
        document.getElementById('minutes').innerText = '00';
        document.getElementById('seconds').innerText = '00';
        return;
    }

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================
// 2. ПЛАВНАЯ АНИМАЦИЯ ПОЯВЛЕНИЯ БЛОКОВ
// ============================================

function checkVisibility() {
    const fadeElements = document.querySelectorAll('.fade-scroll');
    
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener('load', checkVisibility);
window.addEventListener('scroll', checkVisibility);
window.addEventListener('resize', checkVisibility);
setTimeout(checkVisibility, 100);

// ============================================
// 3. ОТПРАВКА В GOOGLE SHEETS (ИСПРАВЛЕННАЯ)
// ============================================

// ⚠️ ВАЖНО: Замените на URL вашего веб-приложения Google Apps Script
// Пример: 'https://script.google.com/macros/s/AKfycbxxxxx/exec'
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbytAdoOfhcLTj9lfcNkEbNVfRU0cfFW1EeNxkLitNW3-6yRQ3gYEKmF8QacP2zUO3iW/exec';

// Функция для получения выбранного значения radio
function getSelectedRadioValue(name) {
    const radio = document.querySelector(`input[name="${name}"]:checked`);
    return radio ? radio.value : '';
}

// Функция для отображения сообщения
function showMessage(message, isSuccess) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${isSuccess ? 'success' : 'error'}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Функция для отправки данных через Google Apps Script
// Используем iframe + form POST для обхода CORS при локальной разработке
function submitToGoogleSheets(formData) {
    return new Promise((resolve, reject) => {
        // Создаем скрытую форму для отправки
        const iframe = document.createElement('iframe');
        iframe.name = 'hiddenSubmitFrame';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = GOOGLE_SCRIPT_URL;
        form.target = 'hiddenSubmitFrame';
        form.style.display = 'none';
        
        // Добавляем все данные в форму
        Object.keys(formData).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = formData[key];
            form.appendChild(input);
        });
        
        document.body.appendChild(form);
        
        // Обработчик завершения отправки
        iframe.onload = function() {
            setTimeout(() => {
                document.body.removeChild(form);
                document.body.removeChild(iframe);
                resolve(true);
            }, 500);
        };
        
        // Обработчик ошибки
        setTimeout(() => {
            if (document.body.contains(form)) {
                document.body.removeChild(form);
                document.body.removeChild(iframe);
                reject(new Error('Timeout'));
            }
        }, 10000);
        
        form.submit();
    });
}

// Обработчик отправки формы
document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Получаем значения
    const name = document.getElementById('feedback-name').value.trim();
    const phone = document.getElementById('feedback-tel').value.trim();
    const presence = getSelectedRadioValue('presence');
    const drink = getSelectedRadioValue('drink');
    const salad = getSelectedRadioValue('salad');
    const hot = getSelectedRadioValue('hot');
    
    // Валидация
    if (!name) {
        showMessage('Пожалуйста, введите ваше имя и фамилию', false);
        return;
    }
    if (!phone) {
        showMessage('Пожалуйста, введите номер телефона', false);
        return;
    }
    if (!presence) {
        showMessage('Пожалуйста, подтвердите свое присутствие', false);
        return;
    }
    if (!drink) {
        showMessage('Пожалуйста, выберите напиток', false);
        return;
    }
    if (!salad) {
        showMessage('Пожалуйста, выберите салат', false);
        return;
    }
    if (!hot) {
        showMessage('Пожалуйста, выберите горячее блюдо', false);
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    
    const formData = {
        timestamp: new Date().toLocaleString('ru-RU'),
        name: name,
        phone: phone,
        presence: presence,
        drink: drink,
        salad: salad,
        hot: hot
    };
    
    try {
        await submitToGoogleSheets(formData);
        showMessage('Спасибо! Ваши ответы успешно отправлены. Мы ждем вас на свадьбе! 🎉', true);
        document.getElementById('feedbackForm').reset();
    } catch (error) {
        console.error('Ошибка:', error);
        showMessage('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.', false);
    }
    
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить';
});

// Маска для телефона
const phoneInput = document.getElementById('feedback-tel');
phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^\d+]/g, '');
    if (!value.startsWith('+')) {
        if (value.startsWith('8')) {
            value = '+7' + value.slice(1);
        } else if (value.startsWith('7') && !value.startsWith('+')) {
            value = '+' + value;
        } else if (value.length > 0 && !value.startsWith('+')) {
            value = '+' + value;
        }
    }
    e.target.value = value;
});