<!-- Создаем админ-панель для просмотра заявок -->
<?php
/**
 * Админ-панель для просмотра заявок
 * Защищено простым паролем
 */

// Простая авторизация
session_start();
$correct_password = 'admin123'; // ЗАМЕНИТЕ на свой пароль

if ($_POST['password'] ?? '' === $correct_password) {
    $_SESSION['authenticated'] = true;
}

if (!($_SESSION['authenticated'] ?? false)) {
    ?>
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Вход в админ-панель - A.S.K.I.V.G.</title>
        <style>
            body { 
                font-family: 'Montserrat', sans-serif; 
                background: linear-gradient(135deg, #1a202c, #2d3748);
                color: white;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
            }
            .login-form {
                background: rgba(255,255,255,0.1);
                padding: 2rem;
                border-radius: 10px;
                backdrop-filter: blur(10px);
                text-align: center;
            }
            input[type="password"] {
                padding: 10px;
                margin: 10px 0;
                border: none;
                border-radius: 5px;
                width: 200px;
            }
            button {
                background: #3182ce;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
            }
        </style>
    </head>
    <body>
        <div class="login-form">
            <h2>Вход в админ-панель</h2>
            <form method="post">
                <input type="password" name="password" placeholder="Пароль" required>
                <br>
                <button type="submit">Войти</button>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Чтение заявок
$leadsFile = __DIR__ . '/data/leads/leads.json';
$leads = [];

if (file_exists($leadsFile)) {
    $leadsData = file_get_contents($leadsFile);
    if ($leadsData) {
        $leads = json_decode($leadsData, true) ?? [];
    }
}

// Сортировка по дате (новые сначала)
usort($leads, function($a, $b) {
    return ($b['timestamp'] ?? 0) - ($a['timestamp'] ?? 0);
});

?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Заявки - A.S.K.I.V.G. Admin</title>
    <style>
        body { 
            font-family: 'Montserrat', sans-serif; 
            margin: 0;
            padding: 20px;
            background: #f7fafc;
            color: #2d3748;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e2e8f0;
        }
        .stats {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .lead-card {
            background: white;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-left: 4px solid #3182ce;
        }
        .lead-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            color: #718096;
        }
        .lead-project {
            background: #f7fafc;
            padding: 1rem;
            border-radius: 6px;
            margin-top: 1rem;
        }
        .btn {
            background: #3182ce;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .btn-logout {
            background: #e53e3e;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Заявки с сайта A.S.K.I.V.G.</h1>
        <a href="?logout=1" class="btn btn-logout">Выйти</a>
    </div>
    
    <div class="stats">
        <strong>Всего заявок:</strong> <?= count($leads) ?> |
        <strong>Сегодня:</strong> <?= count(array_filter($leads, function($lead) {
            return date('Y-m-d', $lead['timestamp'] ?? 0) === date('Y-m-d');
        })) ?>
    </div>
    
    <?php if (empty($leads)): ?>
        <div class="lead-card">
            <p>Заявок пока нет</p>
        </div>
    <?php else: ?>
        <?php foreach ($leads as $lead): ?>
            <div class="lead-card">
                <h3><?= htmlspecialchars($lead['name'] ?? 'Без имени') ?></h3>
                <div class="lead-meta">
                    <span>📧 <?= htmlspecialchars($lead['contact'] ?? 'Нет контакта') ?></span>
                    <span>🕒 <?= htmlspecialchars($lead['date'] ?? 'Неизвестно') ?></span>
                    <span>✅ Согласие: <?= htmlspecialchars($lead['privacy'] ?? 'Нет') ?></span>
                    <span>🌐 IP: <?= htmlspecialchars($lead['ip'] ?? 'Неизвестно') ?></span>
                </div>
                <div class="lead-project">
                    <strong>Описание проекта:</strong>
                    <p><?= nl2br(htmlspecialchars($lead['project'] ?? 'Нет описания')) ?></p>
                </div>
            </div>
        <?php endforeach; ?>
    <?php endif; ?>
    
    <?php
    // Выход из системы
    if ($_GET['logout'] ?? '' === '1') {
        session_destroy();
        header('Location: admin.php');
        exit;
    }
    ?>
</body>
</html>