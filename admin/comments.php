<?php
// Включаем отладку
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Логирование
$logFile = __DIR__ . '/../logs/comments_debug.log';

function log_debug($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

log_debug("=== START comments.php ===");
log_debug("GET params: " . json_encode($_GET));

// Настройки заголовков
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

try {
    // Загружаем конфигурацию
    $configPath = __DIR__ . '/../config/config.php';
    if (!file_exists($configPath)) {
        throw new Exception("Config file not found: $configPath");
    }
    require_once $configPath;
    log_debug("Config loaded");
    
    // Загружаем database.php
    $dbPath = __DIR__ . '/../config/database.php';
    if (!file_exists($dbPath)) {
        throw new Exception("Database config not found: $dbPath");
    }
    require_once $dbPath;
    log_debug("Database config loaded");
    
    // Получаем соединение с БД
    $db = getDB();
    log_debug("Database connected");
    
    // Проверяем, существует ли таблица comments
    $tableExists = false;
    try {
        $stmt = $db->query("SHOW TABLES LIKE 'comments'");
        $tableExists = $stmt->rowCount() > 0;
        log_debug("Table exists check: " . ($tableExists ? 'YES' : 'NO'));
    } catch (Exception $e) {
        log_debug("Table check error: " . $e->getMessage());
    }
    
    if (!$tableExists) {
        // Таблица не существует - возвращаем пустой массив
        log_debug("Table 'comments' doesn't exist, returning empty array");
        echo json_encode([]);
        exit;
    }
    
    // Обработка запроса на последние комментарии
    if (isset($_GET['recent'])) {
        $limit = intval($_GET['recent']);
        if ($limit <= 0 || $limit > 20) {
            $limit = 6;
        }
        
        log_debug("Fetching recent comments, limit: $limit");
        
        $sql = "SELECT * FROM comments WHERE status = 'approved' ORDER BY created_at DESC LIMIT ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$limit]);
        $comments = $stmt->fetchAll();
        
        log_debug("Found " . count($comments) . " comments");
        
        // Форматируем данные для фронтенда
        foreach ($comments as &$comment) {
            // Форматируем дату
            $comment['date'] = date('d.m.Y H:i', strtotime($comment['created_at']));
            
            // Добавляем аватар на основе email
            if (!empty($comment['email'])) {
                $comment['avatar'] = "https://www.gravatar.com/avatar/" . 
                    md5(strtolower(trim($comment['email']))) . 
                    "?d=identicon&s=60";
            } else {
                $comment['avatar'] = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNlMWUxZTEiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOTk5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4K";
            }
        }
        
        echo json_encode($comments, JSON_UNESCAPED_UNICODE);
        log_debug("Response sent with " . count($comments) . " comments");
        exit;
    }
    
    // Обработка запроса комментариев проекта
    if (isset($_GET['projectId'])) {
        $projectId = intval($_GET['projectId']);
        log_debug("Fetching comments for project ID: $projectId");
        
        if ($projectId <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid project ID']);
            exit;
        }
        
        $sql = "SELECT * FROM comments WHERE project_id = ? AND status = 'approved' ORDER BY created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute([$projectId]);
        $comments = $stmt->fetchAll();
        
        log_debug("Found " . count($comments) . " comments for project $projectId");
        
        // Форматируем данные
        foreach ($comments as &$comment) {
            $comment['date'] = date('d.m.Y H:i', strtotime($comment['created_at']));
            
            if (!empty($comment['email'])) {
                $comment['avatar'] = "https://www.gravatar.com/avatar/" . 
                    md5(strtolower(trim($comment['email']))) . 
                    "?d=identicon&s=60";
            }
        }
        
        echo json_encode($comments, JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    // Если параметры не указаны
    http_response_code(400);
    echo json_encode(['error' => 'Missing parameters']);
    
} catch (PDOException $e) {
    log_debug("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error',
        'debug' => $_ENV['APP_ENV'] === 'development' ? $e->getMessage() : null
    ]);
} catch (Exception $e) {
    log_debug("General error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Server error',
        'debug' => $_ENV['APP_ENV'] === 'development' ? $e->getMessage() : null
    ]);
}

log_debug("=== END comments.php ===");
?>