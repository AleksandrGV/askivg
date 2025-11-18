<?php
header('Content-Type: application/json');

$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;

// Загружаем все комментарии
$comments = [];
$commentsDir = __DIR__ . '/../data/comments/';

if (is_dir($commentsDir)) {
    $files = glob($commentsDir . '*.json');
    
    foreach ($files as $file) {
        $fileComments = json_decode(file_get_contents($file), true) ?: [];
        $comments = array_merge($comments, $fileComments);
    }
}

// Сортируем по дате (новые сначала)
usort($comments, function($a, $b) {
    return strtotime($b['date']) - strtotime($a['date']);
});

// Ограничиваем количество
$comments = array_slice($comments, 0, $limit);

echo json_encode($comments, JSON_UNESCAPED_UNICODE);
?>