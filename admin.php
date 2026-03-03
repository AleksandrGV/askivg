<?php
/**
 * Админ-панель для просмотра заявок
 * Версия 6.0 - Полностью рабочая версия
 */

require_once __DIR__ . '/php/autoload.php';
require_once __DIR__ . '/config/admin_config.php';

// НАЧАЛО СЕССИИ И БЕЗОПАСНЫЕ ЗАГОЛОВКИ
session_start();

// Убедимся, что нет вывода перед заголовками
if (ob_get_length()) ob_clean();

// Безопасные заголовки
header("X-Frame-Options: DENY");
header("X-Content-Type-Options: nosniff");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");

// Инициализация конфигурации
$adminConfig = AdminConfig::getInstance();

// Проверка доступа по IP
if (!$adminConfig->checkIPAccess()) {
    header('HTTP/1.0 403 Forbidden');
    die('Access denied: Your IP is not allowed.');
}

// Настройки безопасности из конфига
$max_attempts = $adminConfig->get('max_attempts');
$lockout_time = $adminConfig->get('lockout_time');
$session_timeout = $adminConfig->get('session_timeout');

// Инициализация сессии безопасности
if (!isset($_SESSION['security'])) {
    $_SESSION['security'] = [
        'login_attempts' => 0,
        'lockout_time' => 0,
        'csrf_token' => bin2hex(random_bytes(32)),
        'last_activity' => time()
    ];
}

// Проверка таймаута сессии
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $session_timeout)) {
    session_destroy();
    header('Location: admin.php');
    exit;
}
$_SESSION['last_activity'] = time();

// Генерация нового CSRF токена для каждой формы
if (!isset($_SESSION['security']['csrf_token'])) {
    $_SESSION['security']['csrf_token'] = bin2hex(random_bytes(32));
}

// ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ЗАЯВОК ИЗ БАЗЫ ДАННЫХ
function getLeadsFromDB($limit = 100) {
    try {
        $pdo = Database::getConnection();
        
        // Получаем заявки из БД
        $stmt = $pdo->prepare("
            SELECT 
                id,
                name,
                email,
                phone,
                project_description as project,
                ip_address as ip,
                user_agent,
                is_suspicious,
                created_at,
                UNIX_TIMESTAMP(created_at) as timestamp
            FROM leads 
            ORDER BY created_at DESC 
            LIMIT ?
        ");
        
        $stmt->execute([$limit]);
        $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Форматируем дату для отображения
        foreach ($leads as &$lead) {
            $lead['date'] = date('d.m.Y H:i', strtotime($lead['created_at']));
        }
        
        return $leads;
        
    } catch (Exception $e) {
        // Логируем ошибку
        error_log("Ошибка получения заявок из БД: " . $e->getMessage());
        return [];
    }
}

// ФУНКЦИЯ ДЛЯ ФОРМИРОВАНИЯ HTML ЗАЯВОК
function generateLeadsHTML($leads) {
    $html = '';
    
    if (empty($leads)) {
        $html .= '<div class="lead-card"><p>Заявок пока нет</p></div>';
    } else {
        foreach ($leads as $lead) {
            $html .= '<div class="lead-card">';
            $html .= '<h3>#' . $lead['id'] . ' - ' . htmlspecialchars($lead['name'], ENT_QUOTES, 'UTF-8') . '</h3>';
            $html .= '<div class="lead-meta">';
            $html .= '<span>📧 ' . htmlspecialchars($lead['email']) . '</span>';
            $html .= '<span>📞 ' . htmlspecialchars($lead['phone'] ?: 'Нет телефона') . '</span>';
            $html .= '<span>🕒 ' . htmlspecialchars($lead['date']) . '</span>';
            $html .= '<span>🌐 IP: ' . htmlspecialchars($lead['ip']) . '</span>';
            if (!empty($lead['is_suspicious'])) {
                $html .= '<span style="color: #e53e3e; font-weight: bold;">⚠ Подозрительная</span>';
            }
            $html .= '</div>';
            $html .= '<div class="lead-project">';
            $html .= '<strong>Описание проекта:</strong>';
            $html .= '<p>' . nl2br(htmlspecialchars($lead['project'] ?: 'Нет описания')) . '</p>';
            $html .= '</div>';
            $html .= '</div>';
        }
    }
    
    return $html;
}

// ФУНКЦИЯ ДЛЯ РАСЧЕТА СТАТИСТИКИ
function calculateStats($leads) {
    $total = count($leads);
    $todayCount = 0;
    $weekCount = 0;
    
    $currentDate = date('Y-m-d');
    $weekAgo = date('Y-m-d', strtotime('-7 days'));
    
    foreach ($leads as $lead) {
        $leadDate = date('Y-m-d', strtotime($lead['created_at']));
        if ($leadDate === $currentDate) {
            $todayCount++;
        }
        if ($leadDate >= $weekAgo) {
            $weekCount++;
        }
    }
    
    return [
        'total' => $total,
        'today' => $todayCount,
        'week' => $weekCount
    ];
}

// ============================================================================
// ОБРАБОТКА AJAX ЗАПРОСА ДЛЯ ОБНОВЛЕНИЯ ДАННЫХ
// ============================================================================

if (isset($_GET['action']) && $_GET['action'] === 'refresh') {
    // Очищаем буфер вывода
    while (ob_get_level()) ob_end_clean();
    
    // Устанавливаем JSON заголовок
    header('Content-Type: application/json; charset=utf-8');
    
    // Проверяем авторизацию для AJAX запроса
    if (!($_SESSION['authenticated'] ?? false)) {
        echo json_encode([
            'success' => false,
            'error' => 'Требуется авторизация',
            'redirect' => 'admin.php'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    try {
        // Получаем заявки из БД
        $leads = getLeadsFromDB(100);
        
        // Рассчитываем статистику
        $stats = calculateStats($leads);
        
        // Генерируем HTML
        $html = generateLeadsHTML($leads);
        
        // Возвращаем JSON ответ
        echo json_encode([
            'success' => true,
            'stats' => $stats,
            'html' => $html,
            'timestamp' => date('H:i:s')
        ], JSON_UNESCAPED_UNICODE);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Ошибка получения данных: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
    
    exit; // ВАЖНО: завершаем выполнение для AJAX запроса
}

// ============================================================================
// ОБРАБОТКА ВЫХОДА
// ============================================================================

if ($_GET['logout'] ?? '' === '1') {
    // Логируем выход
    Logger::log('Admin logout', [
        'user' => $_SESSION['user'] ?? 'unknown',
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ]);
    
    session_destroy();
    header('Location: admin.php?msg=logged_out');
    exit;
}

// ============================================================================
// ОБРАБОТКА ВХОДА
// ============================================================================

if (isset($_POST['login']) && isset($_POST['password'])) {
    // Задержка для предотвращения брутфорса
    usleep(500000);
    
    // Проверка CSRF токена
    if (!isset($_POST['csrf_token']) || !hash_equals(
        $_SESSION['security']['csrf_token'], 
        $_POST['csrf_token']
    )) {
        $error = "Ошибка безопасности. Обновите страницу.";
        $_SESSION['security']['login_attempts']++;
    } else {
        // Проверяем блокировку
        if (time() < $_SESSION['security']['lockout_time']) {
            $remaining_time = ceil(($_SESSION['security']['lockout_time'] - time()) / 60);
            $error = "Слишком много попыток входа. Попробуйте через {$remaining_time} минут.";
        } else {
            // Сбрасываем блокировку если время истекло
            if ($_SESSION['security']['login_attempts'] >= $max_attempts && 
                time() >= $_SESSION['security']['lockout_time']) {
                $_SESSION['security']['login_attempts'] = 0;
                $_SESSION['security']['lockout_time'] = 0;
            }
            
            // Валидация и санитизация
            $login = trim(htmlspecialchars($_POST['login'], ENT_QUOTES, 'UTF-8'));
            $password = $_POST['password'];
            
            // Проверяем логин и пароль
            if ($login === $adminConfig->get('admin_login') && 
                $adminConfig->verifyPassword($password)) {
                
                // Успешный вход
                $_SESSION['authenticated'] = true;
                $_SESSION['user'] = $login;
                $_SESSION['login_time'] = time();
                $_SESSION['login_ip'] = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
                
                // Сбрасываем счетчик попыток
                $_SESSION['security']['login_attempts'] = 0;
                $_SESSION['security']['lockout_time'] = 0;
                
                // Генерируем новый CSRF токен
                $_SESSION['security']['csrf_token'] = bin2hex(random_bytes(32));
                
                // Логируем успешный вход
                Logger::log('Admin login successful', [
                    'user' => $login,
                    'ip' => $_SESSION['login_ip'],
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
                ]);
                
                header('Location: admin.php');
                exit;
            } else {
                // Неудачная попытка
                $_SESSION['security']['login_attempts']++;
                
                // Логируем неудачную попытку
                Logger::log('Admin login failed', [
                    'attempt' => $_SESSION['security']['login_attempts'],
                    'login' => $login,
                    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
                ]);
                
                if ($_SESSION['security']['login_attempts'] >= $max_attempts) {
                    $_SESSION['security']['lockout_time'] = time() + $lockout_time;
                    $remaining_time = ceil($lockout_time / 60);
                    $error = "Превышено количество попыток входа. Аккаунт заблокирован на {$remaining_time} минут.";
                    
                    // Логируем блокировку
                    Logger::log('Admin account locked', [
                        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
                        'lockout_time' => $remaining_time . ' minutes'
                    ]);
                } else {
                    $remaining_attempts = $max_attempts - $_SESSION['security']['login_attempts'];
                    $error = "Неверный логин или пароль. Осталось попыток: {$remaining_attempts}";
                }
            }
        }
    }
}

// ============================================================================
// ПРОВЕРКА АВТОРИЗАЦИИ И ПОКАЗ ФОРМЫ ВХОДА
// ============================================================================

if (!($_SESSION['authenticated'] ?? false)) {
    // Форма входа
    ?>
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <!-- <meta name="viewport" content="width=device-width, initial-scale=1.0"> -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>Вход в админ-панель - A.S.K.I.V.G.</title>
        <link href="favicon.ico" rel="icon" type="image/x-icon">
        <style>
            :root {
                --primary: #3182ce;
                --primary-dark: #2c5282;
                --danger: #e53e3e;
                --success: #38a169;
                --gray: #718096;
                --light-gray: #e2e8f0;
            }
            
            * {
                box-sizing: border-box;
            }
            
            body { 
                font-family: 'Montserrat', 'Segoe UI', sans-serif; 
                background: linear-gradient(135deg, #1a202c, #2d3748);
                color: white;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
                padding: 20px;
            }
            
            .login-container {
                width: 100%;
                max-width: 400px;
            }
            
            .login-form {
                background: rgba(255, 255, 255, 0.1);
                padding: 2rem;
                border-radius: 12px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .login-header {
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .login-header h2 {
                margin: 0 0 0.5rem 0;
                font-size: 1.5rem;
                color: white;
            }
            
            .login-header p {
                margin: 0;
                color: var(--light-gray);
                font-size: 0.9rem;
            }
            
            .form-group {
                margin-bottom: 1.5rem;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--light-gray);
                font-size: 0.9rem;
                font-weight: 500;
            }
            
            .form-control {
                width: 100%;
                padding: 12px 16px;
                font-size: 1rem;
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.05);
                color: white;
                transition: all 0.3s;
            }
            
            .form-control:focus {
                outline: none;
                border-color: var(--primary);
                background: rgba(255, 255, 255, 0.1);
            }
            
            .form-control:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .btn {
                width: 100%;
                padding: 14px 20px;
                font-size: 1rem;
                font-weight: 600;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s;
                text-align: center;
            }
            
            .btn-primary {
                background: var(--primary);
                color: white;
            }
            
            .btn-primary:hover:not(:disabled) {
                background: var(--primary-dark);
                transform: translateY(-2px);
            }
            
            .btn-primary:disabled {
                background: var(--gray);
                cursor: not-allowed;
                transform: none !important;
            }
            
            .alert {
                padding: 12px 16px;
                border-radius: 8px;
                margin-bottom: 1.5rem;
                font-size: 0.9rem;
                border-left: 4px solid;
            }
            
            .alert-danger {
                background: rgba(229, 62, 62, 0.1);
                border-color: var(--danger);
                color: #feb2b2;
            }
            
            .alert-warning {
                background: rgba(237, 137, 54, 0.1);
                border-color: #ed8936;
                color: #feebc8;
            }
            
            .login-info {
                margin-top: 1.5rem;
                padding: 12px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                font-size: 0.85rem;
                color: var(--light-gray);
                text-align: center;
            }
            
            #lockoutTimer {
                font-weight: bold;
                color: #fbb6ce;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .login-form {
                animation: fadeIn 0.5s ease-out;
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <div class="login-form">
                <div class="login-header">
                    <h2>🔐 Админ-панель</h2>
                    <p>A.S.K.I.V.G. - Панель управления заявками</p>
                </div>
                
                <?php if (isset($error)): ?>
                    <div class="alert alert-danger">
                        <?= htmlspecialchars($error) ?>
                    </div>
                <?php endif; ?>
                
                <?php if ($_SESSION['security']['login_attempts'] > 0): ?>
                    <div class="alert alert-warning">
                        Использовано попыток: <strong><?= $_SESSION['security']['login_attempts'] ?></strong> 
                        из <?= $max_attempts ?>
                    </div>
                <?php endif; ?>
                
                <form method="post" id="loginForm" autocomplete="on">
                    <input type="hidden" name="csrf_token" 
                           value="<?= htmlspecialchars($_SESSION['security']['csrf_token']) ?>">
                    
                    <div class="form-group">
                        <label for="login">Логин</label>
                        <input type="text" 
                               id="login" 
                               name="login" 
                               class="form-control" 
                               placeholder="Введите логин"
                               required 
                               autofocus
                               autocomplete="username"
                               <?= (time() < $_SESSION['security']['lockout_time']) ? 'disabled' : '' ?>
                               value="<?= htmlspecialchars($_POST['login'] ?? '') ?>">
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Пароль</label>
                        <input type="password" 
                               id="password" 
                               name="password" 
                               class="form-control" 
                               placeholder="Введите пароль"
                               required
                               autocomplete="current-password"
                               <?= (time() < $_SESSION['security']['lockout_time']) ? 'disabled' : '' ?>>
                    </div>
                    
                    <button type="submit" 
                            class="btn btn-primary"
                            <?= (time() < $_SESSION['security']['lockout_time']) ? 'disabled' : '' ?>>
                        Войти в панель
                    </button>
                </form>
                
                <?php if (time() < $_SESSION['security']['lockout_time']): ?>
                    <div class="login-info">
                        Аккаунт временно заблокирован<br>
                        До разблокировки: <span id="lockoutTimer"></span>
                    </div>
                    
                    <script>
                        function updateLockoutTimer() {
                            const lockoutEnd = <?= $_SESSION['security']['lockout_time'] ?> * 1000;
                            const now = Date.now();
                            const remaining = Math.max(0, lockoutEnd - now);
                            
                            if (remaining <= 0) {
                                location.reload();
                            } else {
                                const minutes = Math.floor(remaining / 60000);
                                const seconds = Math.floor((remaining % 60000) / 1000);
                                document.getElementById('lockoutTimer').textContent = 
                                    `${minutes}:${seconds.toString().padStart(2, '0')}`;
                            }
                        }
                        
                        setInterval(updateLockoutTimer, 1000);
                        updateLockoutTimer();
                    </script>
                <?php endif; ?>
            </div>
        </div>
        
        <script>
            document.getElementById('loginForm').addEventListener('submit', function(e) {
                const loginField = document.getElementById('login');
                const passwordField = document.getElementById('password');
                
                loginField.value = loginField.value.trim();
                passwordField.value = passwordField.value.trim();
            });
        </script>
    </body>
    </html>
    <?php
    exit;
}

// ============================================================================
// ОСНОВНАЯ АДМИН-ПАНЕЛЬ (для аутентифицированных пользователей)
// ============================================================================

// Получаем заявки для первоначального отображения
$leads = getLeadsFromDB(100);
$stats = calculateStats($leads);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Заявки - A.S.K.I.V.G. Admin</title>
    <link href="favicon.ico" rel="icon" type="image/x-icon">
    <style>
            
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body { 
            font-family: 'Montserrat', sans-serif; 
            margin: 0;
            padding: 20px;
            background: #f7fafc;
            color: #2d3748;
            min-height: 100vh;
            opacity: 1;
            visibility: visible;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e2e8f0;
            flex-wrap: wrap;
            gap: 15px;
        }
        
        .header-left h1 {
            margin-bottom: 10px;
            color: #2d3748;
        }
        
        .login-info {
            font-size: 0.9rem;
            color: #718096;
            background: #edf2f7;
            padding: 8px 12px;
            border-radius: 6px;
            display: inline-block;
        }
        
        .stats {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .stats > div {
            font-size: 1rem;
            color: #4a5568;
        }
        
        .stats strong {
            color: #2d3748;
        }
        
        .stats-refresh {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .last-updated {
            font-size: 0.85rem;
            color: #a0aec0;
        }
        
        .btn {
            background: #3182ce;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .btn:hover {
            background: #2c5282;
            transform: translateY(-1px);
        }
        
        .btn-logout {
            background: #e53e3e;
        }
        
        .btn-logout:hover {
            background: #c53030;
        }
        
        .btn-refresh {
            background: #38a169;
        }
        
        .btn-refresh:hover {
            background: #2f855a;
        }
        
        .btn-refresh.loading {
            opacity: 0.7;
            cursor: wait;
        }
        
        .lead-card {
            background: white;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-left: 4px solid #3182ce;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .lead-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .lead-card h3 {
            margin-bottom: 1rem;
            color: #2d3748;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 0.5rem;
        }
        
        .lead-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            color: #718096;
            flex-wrap: wrap;
        }
        
        .lead-meta span {
            background: #f7fafc;
            padding: 4px 8px;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
        }
        
        .lead-project {
            background: #f7fafc;
            padding: 1rem;
            border-radius: 6px;
            margin-top: 1rem;
            border: 1px solid #e2e8f0;
        }
        
        .lead-project strong {
            display: block;
            margin-bottom: 0.5rem;
            color: #4a5568;
        }
        
        .lead-project p {
            line-height: 1.5;
            color: #4a5568;
        }
        
        #refreshIcon {
            transition: transform 0.3s;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    </style>
</head>
<body>
    <body data-browser="<?= htmlspecialchars($_SERVER['HTTP_USER_AGENT'] ?? 'unknown') ?>">
    <div class="header">
        <div class="header-left">
            <h1>📋 Заявки с сайта A.S.K.I.V.G.</h1>
            <div class="login-info">
                Вы вошли как: <strong><?= htmlspecialchars($_SESSION['user']) ?></strong> | 
                Время входа: <?= date('H:i:s', $_SESSION['login_time']) ?> |
                IP: <?= htmlspecialchars($_SESSION['login_ip']) ?>
            </div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
            <button class="btn btn-refresh" id="refreshBtn">
                <span id="refreshIcon">⟳</span>
                <span>Обновить</span>
                <span class="last-updated" id="lastUpdated">только что</span>
            </button>
            <a href="?logout=1" class="btn btn-logout">Выйти</a>
        </div>
    </div>
    
    <div class="stats">
        <div>
            <strong>Всего заявок:</strong> <span id="totalCount"><?= $stats['total'] ?></span> |
            <strong>Сегодня:</strong> <span id="todayCount"><?= $stats['today'] ?></span> |
            <strong>За неделю:</strong> <span id="weekCount"><?= $stats['week'] ?></span>
        </div>
        <div class="stats-refresh">
            <div class="last-updated">
                <span>Последнее обновление: <span id="lastUpdateTime"><?= date('H:i:s') ?></span></span>
            </div>
        </div>
    </div>
    
    <div id="leads-container">
        <?= generateLeadsHTML($leads) ?>
    </div>
    <script>        
        // Функция для обновления данных
        let isRefreshing = false;
        const refreshBtn = document.getElementById('refreshBtn');
        const refreshIcon = document.getElementById('refreshIcon');
        const lastUpdated = document.getElementById('lastUpdated');
        const lastUpdateTime = document.getElementById('lastUpdateTime');
        const leadsContainer = document.getElementById('leads-container');
        
        function refreshData() {
            if (isRefreshing) return;
            
            isRefreshing = true;
            refreshBtn.classList.add('loading');
            
            // Анимация вращения иконки
            let rotation = 0;
            const spinInterval = setInterval(() => {
                rotation += 30;
                if (refreshIcon) {
                    refreshIcon.style.transform = `rotate(${rotation}deg)`;
                }
            }, 50);
            
            // AJAX запрос
            fetch('admin.php?action=refresh')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        // Обновляем статистику
                        document.getElementById('totalCount').textContent = data.stats.total;
                        document.getElementById('todayCount').textContent = data.stats.today;
                        document.getElementById('weekCount').textContent = data.stats.week;
                        
                        // Обновляем список заявок
                        leadsContainer.innerHTML = data.html;
                        
                        // Обновляем время
                        const now = new Date();
                        const timeString = now.toLocaleTimeString('ru-RU', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            second: '2-digit'
                        });
                        lastUpdated.textContent = 'только что';
                        lastUpdateTime.textContent = timeString;
                        
                        // Уведомление
                        showNotification('✅ Данные обновлены');
                        
                        // Проверяем новые заявки
                        checkForNewLeads(data.stats.total);
                    } else {
                        showNotification('❌ Ошибка: ' + (data.error || 'Неизвестная ошибка'), 'error');
                    }
                })
                .catch(error => {
                    console.error('Ошибка обновления:', error);
                    showNotification('❌ Ошибка соединения', 'error');
                })
                .finally(() => {
                    clearInterval(spinInterval);
                    if (refreshIcon) {
                        refreshIcon.style.transform = 'rotate(0deg)';
                    }
                    refreshBtn.classList.remove('loading');
                    isRefreshing = false;
                    
                    // Обновляем время в заголовке
                    setTimeout(() => {
                        const timeString = new Date().toLocaleTimeString('ru-RU', { 
                            hour: '2-digit', 
                            minute: '2-digit'
                        });
                        lastUpdated.textContent = timeString;
                    }, 2000);
                });
        }
        
        function showNotification(message, type = 'success') {
            // Удаляем старые уведомления
            document.querySelectorAll('.notification').forEach(n => n.remove());
            
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            notification.style.cssText = `
                position: absolute;
                top: 60px;
                right: 20px;
                background: ${type === 'success' ? '#38a169' : '#e53e3e'};
                color: white;
                padding: 16px 20px;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-weight: 600;
                animation: slideIn 0.3s, fadeOut 0.3s 2.7s;
                max-width: 300px;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        }
        
        let lastLeadCount = <?= $stats['total'] ?>;
        
        function checkForNewLeads(currentCount) {
            if (currentCount > lastLeadCount) {
                showNotification(`📩 Новая заявка! Всего: ${currentCount}`, 'success');
            }
            lastLeadCount = currentCount;
        }
        
        // Инициализация при загрузке DOM
        document.addEventListener('DOMContentLoaded', function() {
            // console.log('DOMContentLoaded');
            
            // Восстанавливаем видимость
            document.body.style.opacity = '1';
            document.body.style.visibility = 'visible';
            
            // Инициализируем страницу
            // initializePage();
            
            // Вешаем обработчик на кнопку обновления
            if (refreshBtn) {
                refreshBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (!this.classList.contains('loading')) {
                        refreshData();
                    }
                });
            }
            
            // Горячие клавиши
            document.addEventListener('keydown', function(e) {
                if ((e.ctrlKey && e.key === 'r') || e.key === 'F5') {
                    e.preventDefault();
                    refreshData();
                }
            });
            
            // Автообновление каждые 30 секунд
            let autoRefreshInterval = setInterval(refreshData, 30000);
            
            // Останавливаем автообновление при активности
            let userActivityTimeout;
            
            function resetAutoRefresh() {
                clearInterval(autoRefreshInterval);
                clearTimeout(userActivityTimeout);
                
                userActivityTimeout = setTimeout(() => {
                    autoRefreshInterval = setInterval(refreshData, 30000);
                }, 10000);
            }
            
            document.addEventListener('mousemove', resetAutoRefresh);
            document.addEventListener('keypress', resetAutoRefresh);
            document.addEventListener('click', resetAutoRefresh);
            
            // Инициализация
            resetAutoRefresh();
            
            // Первое обновление через 5 секунд
            setTimeout(refreshData, 5000);
        });
        
        // // Дополнительная инициализация при полной загрузке
        // window.addEventListener('load', function() {
        //     console.log('window.load');
            
        //     // Дополнительная активация для Chrome
        //     if (isChrome || isChromium || isEdgeChromium) {
        //         setTimeout(activateChrome, 200);
        //         setTimeout(activateChrome, 1000);
        //     }
        // });
    </script>
</body>
</html>