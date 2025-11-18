<?php
/**
 * Сохранение комментариев и отзывов
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

function sendCommentResponse($success, $message, $data = []) {
    http_response_code($success ? 200 : 400);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendCommentResponse(false, 'Метод не разрешен');
}

// Получаем данные
$projectId = $_POST['projectId'] ?? '';
$author = trim($_POST['author'] ?? '');
$text = trim($_POST['text'] ?? '');
$rating = (int)($_POST['rating'] ?? 5);
$position = trim($_POST['position'] ?? '');

// Валидация
if (empty($author) || strlen($author) < 2) {
    sendCommentResponse(false, 'Имя должно содержать минимум 2 символа');
}

if (empty($text) || strlen($text) < 10) {
    sendCommentResponse(false, 'Комментарий должен содержать минимум 10 символов');
}

if ($rating < 1 || $rating > 5) {
    sendCommentResponse(false, 'Некорректная оценка');
}

// Проверка на спам
$spamKeywords = ['http://', 'https://', '[url]', 'купить', 'дешево', 'viagra'];
foreach ($spamKeywords as $keyword) {
    if (stripos($text, $keyword) !== false || stripos($author, $keyword) !== false) {
        sendCommentResponse(false, 'Обнаружены запрещенные слова');
    }
}

// Ограничение частоты комментариев
$ip = $_SERVER['REMOTE_ADDR'];
$commentsDir = __DIR__ . '/data/comments/';
if (!file_exists($commentsDir)) {
    mkdir($commentsDir, 0755, true);
}

// Создаем комментарий
$comment = [
    'id' => uniqid(),
    'projectId' => $projectId,
    'author' => htmlspecialchars($author),
    'text' => htmlspecialchars($text),
    'rating' => $rating,
    'position' => htmlspecialchars($position),
    'date' => date('d.m.Y H:i'),
    'timestamp' => time(),
    'ip' => $ip
];

// Сохраняем комментарий
try {
    $filename = $commentsDir . $projectId . '.json';
    $comments = [];
    
    if (file_exists($filename)) {
        $existingComments = file_get_contents($filename);
        if ($existingComments) {
            $comments = json_decode($existingComments, true) ?: [];
        }
    }
    
    $comments[] = $comment;
    file_put_contents($filename, json_encode($comments, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    sendCommentResponse(true, 'Комментарий успешно добавлен', ['comment' => $comment]);
    
} catch (Exception $e) {
    sendCommentResponse(false, 'Ошибка сохранения комментария: ' . $e->getMessage());
}
?>