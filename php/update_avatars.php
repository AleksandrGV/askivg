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

// Включить вывод ошибок для отладки
// error_reporting(E_ALL);
// ini_set('display_errors', 1);
error_reporting(0); // Отключаем вывод ошибок
ini_set('display_errors', 0);

// Загрузка комментариев
$comments_file = 'comments.json';
$all_comments = [];

if (file_exists($comments_file)) {
    $data = file_get_contents($comments_file);
    if ($data) {
        $all_comments = json_decode($data, true) ?? [];
    }
}

// Обновляем аватарки для старых комментариев
$updated_count = 0;
foreach ($all_comments as &$comment) {
    if (!isset($comment['avatar']) && isset($comment['email'])) {
        $comment['avatar'] = "https://www.gravatar.com/avatar/" . md5(strtolower(trim($comment['email']))) . "?d=identicon&s=60";
        $updated_count++;
    } elseif (!isset($comment['avatar'])) {
        // Для комментариев без email используем дефолтную аватарку
        $comment['avatar'] = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNlMWUxZTEiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOTk5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4K";
        $updated_count++;
    }
}

// Сохраняем обновленные комментарии
if (file_put_contents($comments_file, json_encode($all_comments, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode([
        'success' => true,
        'message' => "Обновлено $updated_count комментариев",
        'updated_count' => $updated_count
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка сохранения'
    ]);
}
?>