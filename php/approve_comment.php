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

$comment_id = $_POST['comment_id'] ?? '';
$project_slug = $_POST['project_slug'] ?? '';

if (empty($comment_id)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID комментария не указан']);
    exit;
}

// ИСПРАВЛЕНО: Путь относительно корня проекта
$comments_dir = __DIR__ . '/../data/comments';

// Ищем комментарий во всех файлах
$files = glob($comments_dir . '/project_*.json');
$comment_found = false;

foreach ($files as $file) {
    $data = file_get_contents($file);
    if ($data) {
        $comments = json_decode($data, true) ?? [];
        
        foreach ($comments as &$comment) {
            if ($comment['id'] === $comment_id) {
                $comment['status'] = 'approved';
                $comment_found = true;
                
                // Сохраняем изменения
                if (file_put_contents($file, json_encode($comments, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
                    echo json_encode([
                        'success' => true,
                        'message' => 'Комментарий одобрен'
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode(['success' => false, 'message' => 'Ошибка сохранения']);
                }
                exit;
            }
        }
    }
}

// Если не нашли
if (!$comment_found) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Комментарий не найден']);
}
?>