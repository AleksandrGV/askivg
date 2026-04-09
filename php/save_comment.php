<?php
/**
 * Сохранение комментария - версия с project_slug
 */

ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/save_comment.log');

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не разрешен']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) $input = $_POST;
    if (!$input) throw new Exception('Некорректные данные');
    
    // ===== ПОЛУЧАЕМ ДАННЫЕ (только project_slug) =====
    $projectSlug = trim($input['project_slug'] ?? '');
    $author = trim(htmlspecialchars($input['author'] ?? '', ENT_QUOTES, 'UTF-8'));
    $email = trim(filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL));
    $text = trim(htmlspecialchars($input['text'] ?? '', ENT_QUOTES, 'UTF-8'));
    $rating = intval($input['rating'] ?? 5);
    $captchaAnswer = trim($input['captcha_answer'] ?? '');
    $captchaHash = trim($input['captcha_hash'] ?? '');
    
    // ===== ВАЛИДАЦИЯ =====
    $errors = [];
    
    if (empty($projectSlug)) {
        $errors[] = 'Не указан проект';
    }
    
    if (strlen($author) < 2) $errors[] = 'Имя должно содержать минимум 2 символа';
    if (strlen($author) > 50) $errors[] = 'Имя слишком длинное';
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Некорректный email адрес';
    if (strlen($email) > 150) $errors[] = 'Email слишком длинный';
    
    if (strlen($text) < 5) $errors[] = 'Комментарий должен содержать минимум 5 символов';
    if (strlen($text) > 500) $errors[] = 'Комментарий слишком длинный (максимум 500 символов)';
    
    if ($rating < 1 || $rating > 5) $rating = 5;
    
    // Проверка капчи
    if (empty($captchaAnswer)) {
        $errors[] = 'Пожалуйста, введите ответ на капчу';
    } elseif (empty($captchaHash) || strlen($captchaHash) !== 32) {
        $errors[] = 'Ошибка капчи. Обновите страницу';
    } else {
        $expectedHash = md5($captchaAnswer);
        if ($captchaHash !== $expectedHash) {
            error_log("CAPTCHA: answer=$captchaAnswer, received=$captchaHash, expected=$expectedHash");
            $errors[] = '❌ Неправильный ответ на капчу. Попробуйте еще раз';
        }
    }
    
    if (!empty($errors)) {
        // Новая капча для следующей попытки
        $num1 = rand(1, 10);
        $num2 = rand(1, 10);
        $answer = $num1 + $num2;
        $newCaptchaHash = md5((string)$answer);
        
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => implode('. ', $errors),
            'data' => [
                'captcha' => [
                    'question' => "Сколько будет $num1 + $num2?",
                    'hash' => $newCaptchaHash
                ]
            ]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    // Подключение к БД
    $db = getDB();
    
    // Проверка лимита (5 в сутки)
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    
    if (!empty($ip)) {
        $stmt = $db->prepare("SELECT COUNT(*) FROM comments WHERE ip_address = ? AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)");
        $stmt->execute([$ip]);
        if ($stmt->fetchColumn() >= 5) {
            throw new Exception('С одного IP можно отправить не более 5 комментариев в сутки');
        }
    }
    
    $stmt = $db->prepare("SELECT COUNT(*) FROM comments WHERE email = ? AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)");
    $stmt->execute([$email]);
    if ($stmt->fetchColumn() >= 5) {
        throw new Exception('С одного email можно отправить не более 5 комментариев в сутки');
    }
    
    // Сохраняем (только project_slug)
    $avatar = "https://www.gravatar.com/avatar/" . md5(strtolower($email)) . "?d=identicon&s=60";
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    
    $stmt = $db->prepare("
        INSERT INTO comments 
        (project_slug, author, email, text, rating, status, avatar, ip_address, user_agent) 
        VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)
    ");
    
    $stmt->execute([
        $projectSlug,
        $author,
        $email,
        $text,
        $rating,
        $avatar,
        $ip,
        $userAgent
    ]);
    
    $commentId = $db->lastInsertId();
    
    // Новая капча
    $num1 = rand(1, 10);
    $num2 = rand(1, 10);
    $answer = $num1 + $num2;
    $newCaptchaHash = md5((string)$answer);
    
    echo json_encode([
        'success' => true,
        'message' => '✅ Комментарий отправлен на модерацию',
        'needs_moderation' => true,
        'comment_id' => $commentId,
        'data' => [
            'captcha' => [
                'question' => "Сколько будет $num1 + $num2?",
                'hash' => $newCaptchaHash
            ]
        ]
    ], JSON_UNESCAPED_UNICODE);
    
} catch (PDOException $e) {
    error_log("DB Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка базы данных']);
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    
    // Новая капча
    $num1 = rand(1, 10);
    $num2 = rand(1, 10);
    $answer = $num1 + $num2;
    $newCaptchaHash = md5((string)$answer);
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'data' => [
            'captcha' => [
                'question' => "Сколько будет $num1 + $num2?",
                'hash' => $newCaptchaHash
            ]
        ]
    ], JSON_UNESCAPED_UNICODE);
}
?>