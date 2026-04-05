<?php

// Отключаем вывод ошибок на продакшене
error_reporting(0);
ini_set('display_errors', 0);

// Включаем логирование ошибок в файл
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php_errors.log');

// config.php уже включает настройки ошибок
require_once __DIR__ . '/../config/config.php';

// Отключаем все ошибки
error_reporting(0);
ini_set('display_errors', 0);

// Устанавливаем заголовки ДО любого вывода
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// ИСПРАВЛЕННЫЙ ПУТЬ
$comments_dir = dirname(__DIR__) . '/data/comments';

// Если папка не существует - возвращаем пустой массив
if (!file_exists($comments_dir)) {
    echo json_encode([
        'pending_comments' => [],
        'total_pending' => 0
    ]);
    exit;
}

// Получаем все файлы комментариев
$files = glob($comments_dir . '/project_*.json');
$all_pending = [];

foreach ($files as $file) {
    $data = file_get_contents($file);
    if ($data) {
        $comments = json_decode($data, true);
        
        if ($comments && is_array($comments)) {
            foreach ($comments as $comment) {
                if (isset($comment['status']) && $comment['status'] === 'pending') {
                    $all_pending[] = $comment;
                }
            }
        }
    }
}

// Сортируем по дате (новые первыми)
usort($all_pending, function($a, $b) {
    $timeA = isset($a['date']) ? strtotime($a['date']) : 0;
    $timeB = isset($b['date']) ? strtotime($b['date']) : 0;
    return $timeB - $timeA;
});

echo json_encode([
    'pending_comments' => $all_pending,
    'total_pending' => count($all_pending)
], JSON_UNESCAPED_UNICODE);
?>