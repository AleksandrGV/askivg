$(document).ready(function() {
    // Показать/скрыть форму
    $('#contactToggle').click(function() {
        $('#contactFormSection').slideToggle();
    });
    
    // ДЕМО-КОММЕНТАРИИ ДЛЯ ПРИМЕРА
    const demoComments = [
        {
            id: 1,
            name: 'Анна Смирнова',
            email: 'anna@example.com',
            comment: 'Очень вкусный мёд! Заказывала липовый, просто потрясающий аромат. Быстрая доставка, буду заказывать еще! Очень вкусный мёд! Заказывала липовый, просто потрясающий аромат. Быстрая доставка, буду заказывать еще!',
            created_at: '2024-03-20 14:30:00'
        },
        {
            id: 2,
            name: 'Михаил Петров',
            email: 'mikhail@example.com',
            comment: 'Отличный магазин! Мёд натуральный, без добавок. Взял гречишный - очень доволен. Рекомендую!',
            created_at: '2024-03-18 11:20:00'
        },
        {
            id: 3,
            name: 'Елена Козлова',
            email: 'elena@example.com',
            comment: 'Покупаю здесь не первый раз. Качество всегда отличное, цены приятные. Особенно нравится горный мёд.',
            created_at: '2024-03-15 09:45:00'
        },
        {
            id: 4,
            name: 'Дмитрий Иванов',
            email: 'dmitry@example.com',
            comment: 'Заказывал мёд с прополисом. Очень помог при простуде. Спасибо!',
            created_at: '2024-03-10 16:15:00'
        },
        {
            id: 5,
            name: 'Ольга Сидорова',
            email: 'olga@example.com',
            comment: 'Прекрасный мёд! Дети едят с удовольствием. Упаковка надежная, ничего не пролилось.',
            created_at: '2024-03-05 12:00:00'
        }
    ];
    
    // Загрузить комментарии при загрузке страницы
    loadComments();
    
    // Обработка отправки формы
    $('#commentForm').submit(function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = {
                name: $('#nameField').val(),
                email: $('#emailField').val(),
                comment: $('#commentField').val()
            };
            
            console.log('Отправка данных:', formData);
            
            $.ajax({
                url: 'php/add_comment.php',
                type: 'POST',
                data: formData,
                dataType: 'json',
                success: function(response) {
                    console.log('Ответ сервера:', response);
                    
                    if (response.success) {
                        $('#commentForm')[0].reset();
                        $('#commentForm').removeClass('was-validated');
                        showAlert('Комментарий успешно добавлен!', 'success');
                        loadComments(); // Обновить список
                    } else {
                        // Если сервер недоступен, добавляем комментарий локально
                        addLocalComment(formData);
                        showAlert('Комментарий добавлен локально (демо-режим)', 'info');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Ошибка AJAX:', status, error);
                    // При ошибке добавляем комментарий локально
                    addLocalComment(formData);
                    showAlert('Демо-режим: комментарий добавлен локально', 'warning');
                }
            });
        }
    });
    
    // Функция для добавления локального комментария (демо-режим)
    function addLocalComment(formData) {
        const newComment = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            comment: formData.comment,
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
        
        // Добавляем в начало массива
        demoComments.unshift(newComment);
        
        // Отображаем обновленный список
        displayComments(demoComments);
        
        // Очищаем форму
        $('#commentForm')[0].reset();
        $('#commentForm').removeClass('was-validated');
    }
    
    // Функция валидации формы
    function validateForm() {
        const form = $('#commentForm')[0];
        
        if (!form.checkValidity()) {
            $('#commentForm').addClass('was-validated');
            return false;
        }
        
        return true;
    }
    
    // Функция загрузки комментариев
    function loadComments() {
        $.ajax({
            url: 'php/get_comments.php',
            type: 'GET',
            dataType: 'json',
            timeout: 5000, // Таймаут 5 секунд
            success: function(response) {
                console.log('Загрузка комментариев:', response);
                
                if (response.success && response.comments && response.comments.length > 0) {
                    displayComments(response.comments);
                    if (response.demo_mode) {
                        showAlert('Режим демо-показа. Добавленные комментарии не сохранятся.', 'info');
                    }
                } else {
                    // Если сервер не вернул комментарии, показываем демо
                    displayComments(demoComments);
                    showAlert('Демо-режим: показаны примеры комментариев', 'info');
                }
            },
            error: function(xhr, status, error) {
                console.error('Ошибка загрузки комментариев:', status, error);
                // При ошибке показываем демо-комментарии
                displayComments(demoComments);
                showAlert('Демо-режим: показаны примеры комментариев', 'info');
            }
        });
    }
    
    // Функция отображения комментариев
    function displayComments(comments) {
        const commentContent = $('#commentContent');
        commentContent.empty();
        
        if (!comments || comments.length === 0) {
            commentContent.html(`
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        Пока нет комментариев. Будьте первым!
                    </div>
                </div>
            `);
            return;
        }
        
        comments.forEach(function(comment, index) {
            const cardClass = index % 2 === 0 ? 'comment-even' : 'comment-odd';
            
            const commentHTML = `
                <div class="card">
                    <div class="comment-card ${cardClass} fade-in d-flex flex-column h-100">
                        <div class="comment-header">
                            <h5><i class="bi bi-person-circle"></i> ${escapeHtml(comment.name)}</h5>
                        </div>
                        <div class="comment-body">
                            <a href="mailto:${escapeHtml(comment.email)}" class="comment-email"><i class="bi bi-envelope"></i> ${escapeHtml(comment.email)}</a>
                            <p><i class="bi bi-chat-dots"></i> ${escapeHtml(comment.comment)}</p>
                        </div>
                        <div class="comment-footer mt-auto">
                            <small class="text-muted">
                                <i class="bi bi-calendar"></i> ${formatDate(comment.created_at)}
                            </small>
                        </div>
                    </div>
                </div>
            `;
            
            commentContent.append(commentHTML);
        });
    }
    
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function formatDate(dateString) {
        if (!dateString) return 'Дата не указана';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
    }
    
    function showAlert(message, type) {
        const alertHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="bi bi-info-circle"></i> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        $('#contactFormSection').prepend(alertHTML);
        
        setTimeout(function() {
            $('.alert').alert('close');
        }, 5000);
    }

    // // Подбор одинаковой высоты карточек
    // window.onload = window.onresize = function() {
    //     let cards = document.querySelectorAll('.comment-card');
    //     let maxHeight = 0;

    //     console.log(cards);

    //     // Сначала сбрасываем высоту
    //     cards.forEach(card => card.style.height = 'auto');

    //     // Находим максимум
    //     cards.forEach(card => {
    //         if (card.offsetHeight > maxHeight) maxHeight = card.offsetHeight;
    //     });

    //     // Устанавливаем всем
    //     cards.forEach(card => card.style.height = maxHeight + 'px');
    // };
});