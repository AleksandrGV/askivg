<?php
/**
 * Обработчик формы обратной связи для OSPanel
 * Версия 3.0 - Финальная
 */

// Подключаем autoload
require_once __DIR__ . '/autoload.php';

// Устанавливаем заголовки
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Функция для JSON ответа
function jsonResponse($success, $message, $data = [], $code = 200) {
    http_response_code($code);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Основная обработка
try {
    // Проверяем метод
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(false, 'Метод не разрешен. Используйте POST.', [], 405);
    }
    
    // Получаем данные
    $name = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars(trim($_POST['email'] ?? ''), ENT_QUOTES, 'UTF-8');
    $project = htmlspecialchars(trim($_POST['project'] ?? ''), ENT_QUOTES, 'UTF-8');
    $phone = htmlspecialchars(trim($_POST['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
    $captchaAnswer = trim($_POST['captcha_answer'] ?? '');
    $captchaHash = trim($_POST['captcha_hash'] ?? '');
    $privacy = isset($_POST['privacy']) && $_POST['privacy'] == '1';
    
    // Логируем полученные данные (только для отладки)
    if ($_ENV['DEBUG_MODE'] === 'true') {
        Logger::log('Form submission attempt', [
            'name' => $name,
            'email' => $email,
            'project_length' => strlen($project),
            'captcha_received' => !empty($captchaAnswer),
            'privacy' => $privacy
        ]);
    }
    
    // ВАЛИДАЦИЯ
    $errors = [];
    
    // 1. Имя (2-100 символов)
    if (empty($name)) {
        $errors[] = 'Пожалуйста, введите ваше имя';
    } elseif (strlen($name) < 2) {
        $errors[] = 'Имя должно содержать минимум 2 символа';
    } elseif (strlen($name) > 100) {
        $errors[] = 'Имя не должно превышать 100 символов';
    }
    
    // 2. Email
    if (empty($email)) {
        $errors[] = 'Пожалуйста, введите email';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Введите корректный email адрес';
    } elseif (strlen($email) > 150) {
        $errors[] = 'Email слишком длинный';
    }
    
    // 3. Проект (10-2000 символов)
    if (empty($project)) {
        $errors[] = 'Пожалуйста, опишите ваш проект';
    } elseif (strlen($project) < 10) {
        $errors[] = 'Описание проекта должно содержать минимум 10 символов';
    } elseif (strlen($project) > 2000) {
        $errors[] = 'Описание проекта не должно превышать 2000 символов';
    }
    
    // 4. Телефон (необязательно, но если есть - проверяем)
    if (!empty($phone) && !preg_match('/^[\d\s\-\+\(\)]{7,20}$/', $phone)) {
        $errors[] = 'Введите корректный номер телефона';
    }
    
    // 5. Капча (проверка MD5)
    if (empty($captchaAnswer)) {
        $errors[] = 'Пожалуйста, решите математическую задачу';
    } else {
        $expectedHash = md5($captchaAnswer);
        if ($captchaHash !== $expectedHash) {
            $errors[] = 'Неверный ответ на математическую задачу';
            
            // Логируем ошибку капчи для отладки
            if ($_ENV['DEBUG_MODE'] === 'true') {
                Logger::log('CAPTCHA mismatch', [
                    'received' => $captchaHash,
                    'expected' => $expectedHash,
                    'answer' => $captchaAnswer
                ]);
            }
        }
    }
    
    // 6. Согласие с политикой
    if (!$privacy) {
        $errors[] = 'Необходимо согласие с политикой конфиденциальности';
    }
    
    // Если есть ошибки валидации
    if (!empty($errors)) {
        jsonResponse(false, implode(' ', $errors), ['errors' => $errors], 400);
    }
    
    // ПОДКЛЮЧЕНИЕ К БД И СОХРАНЕНИЕ
    $pdo = Database::getConnection();
    
    // Проверяем rate limiting (простая версия)
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $ipHash = md5($ip);
    $now = time();
    
    // Удаляем старые записи (> 1 час)
    $stmt = $pdo->prepare("DELETE FROM rate_limits WHERE timestamp < ?");
    $stmt->execute([$now - 3600]);
    
    // Проверяем количество запросов за последний час
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM rate_limits WHERE ip_hash = ?");
    $stmt->execute([$ipHash]);
    $requestCount = $stmt->fetchColumn();
    
    // Максимум 5 запросов в час
    if ($requestCount >= 5) {
        jsonResponse(false, 'Превышен лимит запросов. Пожалуйста, попробуйте через час.', [], 429);
    }
    
    // Добавляем текущий запрос
    $stmt = $pdo->prepare("INSERT INTO rate_limits (ip_hash, ip_address, timestamp) VALUES (?, ?, ?)");
    $stmt->execute([$ipHash, $ip, $now]);
    
    // Сохраняем заявку
    $stmt = $pdo->prepare("
        INSERT INTO leads 
        (name, email, phone, project_description, ip_address, user_agent) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $name,
        $email,
        $phone,
        $project,
        $ip,
        $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    ]);
    
    $leadId = $pdo->lastInsertId();
    
    // Генерируем новую капчу для следующей отправки
    $num1 = rand(1, 10);
    $num2 = rand(1, 10);
    $answer = $num1 + $num2;
    $newCaptchaHash = md5((string)$answer);
    
    // УСПЕШНЫЙ ОТВЕТ
    jsonResponse(true, "✅ Спасибо! Ваша заявка #$leadId отправлена. Мы свяжемся с вами в ближайшее время.", [
        'lead_id' => $leadId,
        'captcha' => [
            'question' => "Сколько будет $num1 + $num2?",
            'hash' => $newCaptchaHash
        ]
    ]);
    
} catch (PDOException $e) {
    // Ошибка базы данных
    Logger::logError('Database error in send_form.php', ['error' => $e->getMessage()]);
    jsonResponse(false, 'Ошибка сохранения заявки. Пожалуйста, попробуйте позже.', [], 500);
    
} catch (Exception $e) {
    // Любая другая ошибка
    Logger::logError('General error in send_form.php', ['error' => $e->getMessage()]);
    jsonResponse(false, 'Произошла ошибка: ' . $e->getMessage(), [], 500);
}
?>