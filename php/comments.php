<?php
/**
 * Получение комментариев - версия с project_slug
 */

ini_set('display_errors', 0);
error_reporting(0);

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $db = getDB();
    
    // Запрос последних комментариев (для слайдера)
    if (isset($_GET['recent'])) {
        $limit = intval($_GET['recent']);
        if ($limit <= 0 || $limit > 20) $limit = 6;
        
        $sql = "SELECT * FROM comments WHERE status = 'approved' ORDER BY created_at DESC LIMIT ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$limit]);
        $comments = $stmt->fetchAll();
        
        $formattedComments = [];
        foreach ($comments as $comment) {
            $formattedComments[] = [
                'id' => (int)$comment['id'],
                'project_slug' => $comment['project_slug'],
                'project_title' => $comment['project_title'],
                'author' => $comment['author'],
                'email' => $comment['email'],
                'text' => $comment['text'],
                'rating' => (int)$comment['rating'],
                'date' => date('d.m.Y H:i', strtotime($comment['created_at'])),
                'avatar' => !empty($comment['email']) 
                    ? "https://www.gravatar.com/avatar/" . md5(strtolower(trim($comment['email']))) . "?d=identicon&s=60"
                    : null
            ];
        }
        
        echo json_encode($formattedComments, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        exit;
    }
    
    // Запрос комментариев по слагу проекта
    if (isset($_GET['projectSlug'])) {
        $projectSlug = trim($_GET['projectSlug']);
        
        if (empty($projectSlug)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid project slug']);
            exit;
        }
        
        $sql = "SELECT * FROM comments WHERE project_slug = ? AND status = 'approved' ORDER BY created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute([$projectSlug]);
        $comments = $stmt->fetchAll();
        
        $formattedComments = [];
        foreach ($comments as $comment) {
            $formattedComments[] = [
                'id' => (int)$comment['id'],
                'project_slug' => $comment['project_slug'],
                'author' => $comment['author'],
                'email' => $comment['email'],
                'text' => $comment['text'],
                'rating' => (int)$comment['rating'],
                'date' => date('d.m.Y H:i', strtotime($comment['created_at'])),
                'avatar' => !empty($comment['email']) 
                    ? "https://www.gravatar.com/avatar/" . md5(strtolower(trim($comment['email']))) . "?d=identicon&s=60"
                    : null
            ];
        }
        
        echo json_encode($formattedComments, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        exit;
    }
    
    // Если параметры не указаны
    http_response_code(400);
    echo json_encode(['error' => 'Missing parameters. Use ?recent=N or ?projectSlug=name']);
    
} catch (PDOException $e) {
    error_log("Database error in comments.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
} catch (Exception $e) {
    error_log("General error in comments.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?>