<?php
// Загружаем конфигурацию с отключенным выводом ошибок
ini_set('display_errors', 0);
error_reporting(0);

// Загружаем конфигурацию
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

// Устанавливаем заголовки JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обрабатываем предзапросы OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $db = getDB();
    
    // Проверяем запрос на последние комментарии
    if (isset($_GET['recent'])) {
        $limit = intval($_GET['recent']);
        if ($limit <= 0 || $limit > 20) $limit = 6;
        
        // Логируем для отладки
        if ($_ENV['APP_ENV'] === 'development') {
            error_log("Fetching recent comments, limit: $limit");
        }
        
        $sql = "SELECT * FROM comments WHERE status = 'approved' ORDER BY created_at DESC LIMIT ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$limit]);
        $comments = $stmt->fetchAll();
        
        // Форматируем данные
        $formattedComments = [];
        foreach ($comments as $comment) {
            $formattedComment = [
                'id' => (int)$comment['id'],
                'project_id' => (int)$comment['project_id'],
                'author' => $comment['author'],
                'email' => $comment['email'],
                'text' => $comment['text'],
                'rating' => (int)$comment['rating'],
                'status' => $comment['status'],
                'date' => date('d.m.Y H:i', strtotime($comment['created_at'])),
                'created_at' => date('d.m.Y H:i', strtotime($comment['created_at']))
            ];
            
            // Добавляем аватар
            if (!empty($comment['email'])) {
                $formattedComment['avatar'] = "https://www.gravatar.com/avatar/" . 
                    md5(strtolower(trim($comment['email']))) . 
                    "?d=identicon&s=60";
            } else {
                $formattedComment['avatar'] = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNlMWUxZTEiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOTk5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4K";
            }
            
            $formattedComments[] = $formattedComment;
        }
        
        echo json_encode($formattedComments, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        exit;
    }
    
    // Проверяем запрос комментариев проекта
    if (isset($_GET['projectId'])) {
        $projectId = intval($_GET['projectId']);
        
        if ($projectId <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid project ID']);
            exit;
        }
        
        // Логируем для отладки
        if ($_ENV['APP_ENV'] === 'development') {
            error_log("Fetching comments for project ID: $projectId");
        }
        
        $sql = "SELECT * FROM comments WHERE project_id = ? AND status = 'approved' ORDER BY created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute([$projectId]);
        $comments = $stmt->fetchAll();
        
        // Форматируем данные
        $formattedComments = [];
        foreach ($comments as $comment) {
            $formattedComment = [
                'id' => (int)$comment['id'],
                'project_id' => (int)$comment['project_id'],
                'author' => $comment['author'],
                'email' => $comment['email'],
                'text' => $comment['text'],
                'rating' => (int)$comment['rating'],
                'status' => $comment['status'],
                'date' => date('d.m.Y H:i', strtotime($comment['created_at']))
            ];
            
            // Добавляем аватар
            if (!empty($comment['email'])) {
                $formattedComment['avatar'] = "https://www.gravatar.com/avatar/" . 
                    md5(strtolower(trim($comment['email']))) . 
                    "?d=identicon&s=60";
            }
            
            $formattedComments[] = $formattedComment;
        }
        
        echo json_encode($formattedComments, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        exit;
    }
    
    // Если параметры не указаны
    http_response_code(400);
    echo json_encode(['error' => 'Missing parameters. Use ?recent=N or ?projectId=N']);
    
} catch (PDOException $e) {
    // Логируем ошибку
    error_log("Database error in comments.php: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error',
        'message' => $_ENV['APP_ENV'] === 'development' ? $e->getMessage() : 'Internal server error'
    ]);
} catch (Exception $e) {
    // Логируем ошибку
    error_log("General error in comments.php: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'error' => 'Server error',
        'message' => $_ENV['APP_ENV'] === 'development' ? $e->getMessage() : 'Internal server error'
    ]);
}
?>