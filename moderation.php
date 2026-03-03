<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Панель модерации комментариев</title>

    <!-- favicon -->
    <link href="favicon.ico" rel="icon" type="image/x-icon">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Montserrat', Arial, sans-serif;
            color: #333;
            min-height: 100vh;
            background: linear-gradient(135deg, #2c3e50, #34495e);
        }
        
        .container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            min-height: 100vh;
            margin: 0 auto;
            overflow: hidden;
        }
        
        /* Стили для формы входа */
        .login-form {
            max-width: 540px;
            margin: 0 auto;
            padding: 60px 40px;
            border-radius: 15px;
            background-color: white;
            text-align: center;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }

        .login-form .logo {
            font-size: 3rem;
            color: #3498db;
            margin-bottom: 20px;
        }

        .login-form h2 {
            color: #2c3e50;
            margin-bottom: 30px;
            font-size: 1.8rem;
        }

        .form-group {
            margin-bottom: 25px;
            text-align: left;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #2c3e50;
            font-weight: 600;
            font-size: 0.95rem;
        }

        .form-control {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid #e0e6ed;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.3s;
            background: #f8f9fa;
        }

        .form-control:focus {
            outline: none;
            border-color: #3498db;
            background: white;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }

        .btn {
            display: inline-block;
            padding: 14px 28px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            text-align: center;
        }

        .btn-primary {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
        }

        .btn-primary:hover:not(:disabled) {
            background: linear-gradient(135deg, #2980b9, #1f6399);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3);
        }

        .btn-block {
            width: 100%;
        }

        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
        }

        .alert {
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            font-size: 0.95rem;
            border-left: 4px solid;
        }

        .alert-danger {
            background: #fef2f2;
            border-color: #f87171;
            color: #dc2626;
        }

        .alert-info {
            background: #eff6ff;
            border-color: #60a5fa;
            color: #2563eb;
        }

        .attempts-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            color: #6c757d;
            font-size: 0.9rem;
        }

        .lockout-timer {
            background: #fff7ed;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            color: #ea580c;
            font-weight: 600;
            font-size: 1rem;
        }

        /* Стили для панели модерации */
        .moderation-panel {
            background-color: white;
        }

        .header {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            padding: 25px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
        }

        .header h1 {
            font-size: 1.8rem;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .header-actions {
            display: flex;
            gap: 15px;
            align-items: center;
        }

        .btn-logout {
            background: #6c757d;
            color: white;
        }

        .btn-logout:hover {
            background: #5a6268;
        }

        .btn-refresh {
            background: #28a745;
            color: white;
        }

        .btn-refresh:hover {
            background: #218838;
        }

        .stats {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 25px 30px;
            border-radius: 0;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-value {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 0.95rem;
            opacity: 0.9;
        }

        .comments-section {
            padding: 30px;
        }

        .comments-section h2 {
            color: #2c3e50;
            margin-bottom: 25px;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .comments-container {
            min-height: 300px;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #6c757d;
        }

        .empty-state h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: #2c3e50;
        }

        .comment-card {
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            transition: all 0.3s;
        }

        .comment-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .comment-card.pending {
            border-left: 5px solid #f39c12;
            background: linear-gradient(to right, #fffaf0, white);
        }

        .comment-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
            flex-wrap: wrap;
            gap: 15px;
        }

        .comment-author {
            font-weight: 600;
            color: #2c3e50;
            font-size: 1.1rem;
        }

        .comment-meta {
            color: #6c757d;
            font-size: 0.9rem;
            display: flex;
            gap: 15px;
            align-items: center;
            flex-wrap: wrap;
        }

        .badge {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .badge-project {
            background: #e0e7ff;
            color: #3730a3;
        }

        .badge-rating {
            background: #fef3c7;
            color: #92400e;
        }

        .comment-text {
            margin: 20px 0;
            line-height: 1.7;
            color: #374151;
            font-size: 1.05rem;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #3498db;
        }

        .comment-actions {
            display: flex;
            gap: 15px;
            margin-top: 20px;
        }

        .btn-approve {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
        }

        .btn-approve:hover:not(:disabled) {
            background: linear-gradient(135deg, #059669, #047857);
        }

        .btn-reject {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
        }

        .btn-reject:hover:not(:disabled) {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
        }

        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-out, fadeOut 0.3s ease-out 2.7s forwards;
            max-width: 350px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .notification.success {
            background: linear-gradient(135deg, #10b981, #059669);
        }

        .notification.error {
            background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .notification.info {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            display: none;
        }

        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #3498db;
            animation: spin 1s linear infinite;
        }

        .login-info {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.8);
            margin-top: 5px;
        }

        .auto-refresh {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 15px;
        }

        .auto-refresh label {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.9);
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #6c757d;
            transition: .4s;
            border-radius: 24px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: #28a745;
        }

        input:checked + .slider:before {
            transform: translateX(26px);
        }
    </style>
</head>
<body>
    <div class="container" id="app">
        <!-- Весь HTML будет генерироваться JavaScript -->
    </div>

    <script>
        // Конфигурация
        const API_URL = 'php/moderate_handler.php';
        let currentState = 'login'; // login, moderation
        let isAuthenticated = false;
        let autoRefreshInterval = null;
        let autoRefreshEnabled = true;

        // Элементы приложения
        const app = document.getElementById('app');

        // ============================================================================
        // ОСНОВНЫЕ ФУНКЦИИ
        // ============================================================================

        // Показать уведомление
        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span>${message}</span>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        }

        // Проверить авторизацию
        async function checkAuth() {
            try {
                const response = await fetch(`${API_URL}?action=check_auth`, {
                    method: 'GET',
                    credentials: 'include',  // !!! КРИТИЧЕСКИ ВАЖНО !!!
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                const data = await response.json();
                return data.authenticated === true;
            } catch (error) {
                console.error('Ошибка проверки авторизации:', error);
                return false;
            }
        }

        // Войти в систему
        async function login(login, password) {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',  // !!! КРИТИЧЕСКИ ВАЖНО !!!
                    body: JSON.stringify({
                        action: 'login',
                        login: login,
                        password: password
                    }),
                });
                
                const data = await response.json();
                
                if (data.success) {
                    isAuthenticated = true;
                    currentState = 'moderation';
                    render();
                    loadComments();
                    startAutoRefresh();
                    showNotification('✅ Авторизация успешна', 'success');
                } else {
                    showNotification(`❌ ${data.message}`, 'error');
                }
            } catch (error) {
                console.error('Ошибка входа:', error);
                showNotification('❌ Ошибка сети при входе', 'error');
            }
        }

        // Выйти из системы
        async function logout() {
            try {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'logout'
                    })
                });
                
                isAuthenticated = false;
                currentState = 'login';
                stopAutoRefresh();
                render();
                showNotification('✅ Выход выполнен', 'success');
            } catch (error) {
                console.error('Ошибка выхода:', error);
            }
        }

        // Загрузить комментарии
        async function loadComments() {
            try {
                const response = await fetch(`${API_URL}?action=get_comments`, {
                    method: 'GET',
                    credentials: 'include',  // !!! И ЗДЕСЬ ТОЖЕ !!!
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                const data = await response.json();
                
                if (data.success) {
                    renderComments(data.comments);
                    updateStats(data.count);
                } else {
                    if (data.error === 'auth_required') {
                        showNotification('🔒 Требуется повторная авторизация', 'error');
                        logout();
                    } else {
                        showNotification(`❌ ${data.message || 'Ошибка загрузки'}`, 'error');
                    }
                }
            } catch (error) {
                console.error('Ошибка загрузки комментариев:', error);
                showNotification('❌ Ошибка сети при загрузке', 'error');
            }
        }

        // Модерировать комментарий
        async function moderateComment(commentId, status, projectId) {
            if (status === 'rejected' && !confirm('Вы уверены, что хотите отклонить этот комментарий?')) {
                return;
            }
            
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'moderate',
                        comment_id: commentId,
                        status: status,
                        project_id: projectId
                    }),
                    credentials: 'include'
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Удаляем комментарий из списка
                    const commentElement = document.getElementById(`comment-${commentId}`);
                    if (commentElement) {
                        commentElement.style.opacity = '0.5';
                        commentElement.style.transform = 'translateX(20px)';
                        
                        setTimeout(() => {
                            commentElement.remove();
                            updateStatsAfterModeration();
                        }, 300);
                    }
                    
                    showNotification(`✅ ${data.message}`, 'success');
                } else {
                    showNotification(`❌ ${data.message}`, 'error');
                }
            } catch (error) {
                console.error('Ошибка модерации:', error);
                showNotification('❌ Ошибка сети при модерации', 'error');
            }
        }

        // Автообновление
        function startAutoRefresh() {
            if (autoRefreshInterval) clearInterval(autoRefreshInterval);
            autoRefreshInterval = setInterval(() => {
                if (autoRefreshEnabled && document.visibilityState === 'visible') {
                    loadComments();
                }
            }, 30000);
        }

        function stopAutoRefresh() {
            if (autoRefreshInterval) {
                clearInterval(autoRefreshInterval);
                autoRefreshInterval = null;
            }
        }

        function toggleAutoRefresh() {
            autoRefreshEnabled = !autoRefreshEnabled;
            const statusElement = document.getElementById('autoRefreshStatus');
            if (statusElement) {
                statusElement.textContent = autoRefreshEnabled ? 'включено' : 'выключено';
            }
            
            if (autoRefreshEnabled) {
                startAutoRefresh();
                showNotification('🔄 Автообновление включено', 'info');
            } else {
                stopAutoRefresh();
                showNotification('⏸️ Автообновление выключено', 'info');
            }
        }

        // ============================================================================
        // ФУНКЦИИ РЕНДЕРИНГА
        // ============================================================================

        // Рендеринг приложения
        async function render() {
            // Проверяем авторизацию при загрузке
            if (currentState === 'moderation' && !isAuthenticated) {
                const authenticated = await checkAuth();
                if (!authenticated) {
                    currentState = 'login';
                }
            }
            
            if (currentState === 'login') {
                renderLoginForm();
            } else {
                renderModerationPanel();
            }
        }

        // Рендеринг формы входа
        function renderLoginForm() {
            app.innerHTML = `
                <div class="login-form">
                    <div class="logo">🛡️</div>
                    <h2>Панель модерации комментариев</h2>
                    <p style="color: #6c757d; margin-bottom: 30px;">Для доступа к панели требуется авторизация</p>
                    
                    <div id="loginAlert" class="alert" style="display: none;"></div>
                    
                    <form id="loginFormElement">
                        <div class="form-group">
                            <label for="login">Логин модератора</label>
                            <input type="text" 
                                   id="login" 
                                   class="form-control" 
                                   placeholder="Введите логин"
                                   required
                                   autocomplete="username"
                                   value="moderator">
                        </div>
                        
                        <div class="form-group">
                            <label for="password">Пароль модератора</label>
                            <input type="password" 
                                   id="password" 
                                   class="form-control" 
                                   placeholder="Введите пароль"
                                   required
                                   autocomplete="current-password"
                                   value="moderator123">
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-block" id="loginButton">
                            <span id="loginButtonText">🔑 Войти в панель модерации</span>
                        </button>
                    </form>
                </div>
            `;
            
            // Обработчик формы входа
            document.getElementById('loginFormElement').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const loginInput = document.getElementById('login');
                const passwordInput = document.getElementById('password');
                const button = document.getElementById('loginButton');
                
                button.disabled = true;
                button.innerHTML = '<span class="loading-spinner"></span> Вход...';
                
                await login(loginInput.value, passwordInput.value);
                
                button.disabled = false;
                button.innerHTML = '<span id="loginButtonText">🔑 Войти в панель модерации</span>';
            });
        }

        // Рендеринг панели модерации
        function renderModerationPanel() {
            app.innerHTML = `
                <div class="moderation-panel">
                    <div class="header">
                        <div>
                            <h1>🛡️ Панель модерации комментариев</h1>
                            <div class="login-info">
                                Вы вошли как: <strong>moderator</strong> | 
                                Время входа: <span id="loginTime">${new Date().toLocaleTimeString('ru-RU')}</span>
                            </div>
                        </div>
                        <div class="header-actions">
                            <button class="btn btn-refresh" id="refreshBtn">
                                ⟳ Обновить
                            </button>
                            <button class="btn btn-logout" id="logoutBtn">
                                🚪 Выйти
                            </button>
                        </div>
                    </div>
                    
                    <div class="stats">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-value" id="pendingCount">0</div>
                                <div class="stat-label">Ожидают модерации</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value" id="lastUpdateTime">${new Date().toLocaleTimeString('ru-RU')}</div>
                                <div class="stat-label">Последнее обновление</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value" id="onlineStatus">🟢</div>
                                <div class="stat-label">Статус системы</div>
                            </div>
                        </div>
                        <div class="auto-refresh">
                            <label for="autoRefreshToggle">Автообновление:</label>
                            <label class="switch">
                                <input type="checkbox" id="autoRefreshToggle" checked>
                                <span class="slider"></span>
                            </label>
                            <span id="autoRefreshStatus" style="color: white; font-size: 0.9rem;">включено</span>
                        </div>
                    </div>
                    
                    <div class="comments-section">
                        <h2>📝 Комментарии ожидающие модерации</h2>
                        <div class="comments-container" id="commentsContainer">
                            <div class="empty-state">
                                <h3>Загрузка комментариев...</h3>
                                <p>Пожалуйста, подождите.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Обработчики событий
            document.getElementById('refreshBtn').addEventListener('click', loadComments);
            document.getElementById('logoutBtn').addEventListener('click', logout);
            document.getElementById('autoRefreshToggle').addEventListener('change', toggleAutoRefresh);
            
            // Горячие клавиши
            document.addEventListener('keydown', function(e) {
                if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
                    e.preventDefault();
                    loadComments();
                }
                if (e.ctrlKey && e.key === 'a') {
                    e.preventDefault();
                    toggleAutoRefresh();
                }
            });
        }

        // Рендеринг комментариев
        function renderComments(comments) {
            const container = document.getElementById('commentsContainer');
            
            if (!comments || comments.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h3>🎉 Нет комментариев для модерации</h3>
                        <p>Все комментарии проверены и обработаны.</p>
                    </div>
                `;
                return;
            }
            
            let html = '';
            comments.forEach(comment => {
                html += `
                    <div class="comment-card pending" id="comment-${comment.id}">
                        <div class="comment-header">
                            <div class="comment-author">
                                ${escapeHtml(comment.author)}
                                ${comment.email ? `<span style="color: #6c757d; font-size: 0.9rem;">(${escapeHtml(comment.email)})</span>` : ''}
                            </div>
                            <div class="comment-meta">
                                <span>${escapeHtml(comment.date)}</span>
                                <span class="badge badge-project">Проект: ${escapeHtml(comment.project_id)}</span>
                                <span class="badge badge-rating">★ ${comment.rating}/5</span>
                            </div>
                        </div>
                        
                        <div class="comment-text">
                            ${escapeHtml(comment.text).replace(/\n/g, '<br>')}
                        </div>
                        
                        <div class="comment-meta" style="font-size: 0.85rem; color: #868e96;">
                            <span>ID: ${escapeHtml(comment.id)}</span>
                            <span>IP: ${escapeHtml(comment.ip || 'Неизвестно')}</span>
                        </div>
                        
                        <div class="comment-actions">
                            <button class="btn btn-approve" onclick="window.moderateComment('${comment.id}', 'approved', '${comment.project_id}')">
                                ✅ Одобрить
                            </button>
                            <button class="btn btn-reject" onclick="window.moderateComment('${comment.id}', 'rejected', '${comment.project_id}')">
                                ❌ Отклонить
                            </button>
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        }

        // Обновление статистики
        function updateStats(count) {
            const countElement = document.getElementById('pendingCount');
            const timeElement = document.getElementById('lastUpdateTime');
            
            if (countElement) {
                countElement.textContent = count;
            }
            
            if (timeElement) {
                timeElement.textContent = new Date().toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                });
            }
        }

        function updateStatsAfterModeration() {
            const countElement = document.getElementById('pendingCount');
            if (countElement) {
                const currentCount = parseInt(countElement.textContent) || 0;
                const newCount = Math.max(0, currentCount - 1);
                countElement.textContent = newCount;
                
                if (newCount === 0) {
                    document.getElementById('commentsContainer').innerHTML = `
                        <div class="empty-state">
                            <h3>🎉 Нет комментариев для модерации</h3>
                            <p>Все комментарии проверены и обработаны.</p>
                        </div>
                    `;
                }
            }
        }

        // Экранирование HTML
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // ============================================================================
        // ИНИЦИАЛИЗАЦИЯ
        // ============================================================================

        // Экспортируем функции в глобальную область видимости
        window.moderateComment = moderateComment;

        // Запуск приложения
        document.addEventListener('DOMContentLoaded', async function() {
            // Проверяем авторизацию
            const authenticated = await checkAuth();
            if (authenticated) {
                isAuthenticated = true;
                currentState = 'moderation';
                startAutoRefresh();
            }
            
            render();
            
            if (currentState === 'moderation') {
                loadComments();
            }
        });
    </script>
</body>
</html>