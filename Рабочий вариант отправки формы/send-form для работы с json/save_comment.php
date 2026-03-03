<?php

// Отключаем вывод ошибок на продакшене
error_reporting(0);
ini_set('display_errors', 0);

// Включаем логирование ошибок в файл
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php_errors.log');

// config.php уже включает настройки ошибок
require_once __DIR__ . '/../config/config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(0); // Отключаем вывод ошибок
ini_set('display_errors', 0);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не разрешен']);
    exit;
}

// Получаем данные из формы
$project_id = $_POST['project_id'] ?? '';
$author = trim($_POST['author'] ?? '');
$email = trim($_POST['email'] ?? '');
$text = trim($_POST['text'] ?? '');
$rating = intval($_POST['rating'] ?? 5);
$captcha_answer = trim($_POST['captcha_answer'] ?? '');
$captcha_hash = $_POST['captcha_hash'] ?? '';

// Валидация (оставляем как было)
if (empty($project_id) || empty($author) || empty($email) || empty($text) || empty($captcha_answer)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Все обязательные поля должны быть заполнены']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Введите корректный email адрес']);
    exit;
}

if ($captcha_answer !== $captcha_hash) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Неправильный ответ на математическую задачу']);
    exit;
}

if ($rating < 1 || $rating > 5) {
    $rating = 5;
}

// Опасность: нет защиты от спама
// Добавьте:
$rate_limit_file = __DIR__ . '/../data/rate_limits.json';
$ip = $_SERVER['REMOTE_ADDR'];
$current_time = time();

// Проверка на частые запросы
if (file_exists($rate_limit_file)) {
    $limits = json_decode(file_get_contents($rate_limit_file), true);
    if (isset($limits[$ip]) && ($current_time - $limits[$ip]) < 60) {
        // Запрос чаще чем раз в минуту
        echo json_encode(['success' => false, 'message' => 'Подождите минуту перед следующим комментарием']);
        exit;
    }
}

// Сохраняем время последнего запроса
$limits[$ip] = $current_time;
file_put_contents($rate_limit_file, json_encode($limits));

// Создаем новый комментарий
$comment = [
    'id' => uniqid(),
    'project_id' => $project_id,
    'author' => htmlspecialchars($author),
    'email' => htmlspecialchars($email),
    'avatar' => "https://www.gravatar.com/avatar/" . md5(strtolower(trim($email))) . "?d=identicon&s=60",
    'text' => htmlspecialchars($text),
    'rating' => $rating,
    'date' => date('Y-m-d H:i:s'),  // Формат: 2024-01-15 14:30:00
    'status' => 'pending'
];

// ИСПРАВЛЕНО: Путь относительно корня проекта
$comments_dir = __DIR__ . '/../data/comments';
$comments_file = "{$comments_dir}/project_{$project_id}.json";

// Создаем папку если её нет
if (!file_exists($comments_dir)) {
    mkdir($comments_dir, 0755, true);
}

// Читаем существующие комментарии или создаем пустой массив
$comments = [];
if (file_exists($comments_file)) {
    $existing_data = file_get_contents($comments_file);
    if ($existing_data) {
        $comments = json_decode($existing_data, true) ?? [];
    }
}

// Добавляем новый комментарий в начало массива
array_unshift($comments, $comment);

// Сохраняем
if (file_put_contents($comments_file, json_encode($comments, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode([
        'success' => true, 
        'message' => 'Комментарий успешно добавлен и ожидает модерации!',
        'needs_moderation' => true
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка сохранения комментария']);
}
