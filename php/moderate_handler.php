<?php
/**
 * Упрощенный обработчик модерации
 */

ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/moderator.log');

// Подключаем БД
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Простая функция логирования
function logMsg($msg) {
    $log = __DIR__ . '/../logs/moderation.log';
    $time = date('Y-m-d H:i:s');
    file_put_contents($log, "[$time] $msg\n", FILE_APPEND);
}

logMsg("=== START ===");

// Запускаем сессию
session_name('moderator_session');
session_start();

logMsg("Session ID: " . session_id());
logMsg("Session data: " . json_encode($_SESSION));

// Получаем действие
$action = $_GET['action'] ?? $_POST['action'] ?? '';
if (!$action) {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';
}

logMsg("Action: $action");

// Данные для входа (из .env или по умолчанию)
$admin_login = 'admin';
$admin_password = 'admin123';

try {
    $db = getDB();
    
    switch ($action) {
        
        case 'check_auth':
            $auth = isset($_SESSION['admin_logged']) && $_SESSION['admin_logged'] === true;
            logMsg("Check auth: " . ($auth ? 'YES' : 'NO'));
            echo json_encode(['success' => true, 'authenticated' => $auth]);
            break;
        
        case 'login':
            $login = $_POST['login'] ?? $input['login'] ?? '';
            $pass = $_POST['password'] ?? $input['password'] ?? '';
            
            logMsg("Login attempt: $login");
            
            if ($login === $admin_login && $pass === $admin_password) {
                $_SESSION['admin_logged'] = true;
                $_SESSION['admin_login'] = $login;
                $_SESSION['login_time'] = time();
                
                logMsg("Login successful");
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Авторизация успешна'
                ]);
            } else {
                logMsg("Login failed");
                echo json_encode([
                    'success' => false,
                    'message' => 'Неверный логин или пароль'
                ]);
            }
            break;
        
        case 'logout':
            logMsg("Logout");
            $_SESSION = [];
            session_destroy();
            echo json_encode(['success' => true, 'message' => 'Выход выполнен']);
            break;
        
        case 'get_comments':
            if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
                logMsg("Unauthorized access attempt");
                http_response_code(401);
                echo json_encode(['success' => false, 'error' => 'auth_required']);
                break;
            }
            
            logMsg("Loading pending comments");
            
            $stmt = $db->query("SELECT * FROM comments WHERE status = 'pending' ORDER BY created_at DESC");
            $comments = $stmt->fetchAll();
            
            $formatted = [];
            foreach ($comments as $c) {
                $formatted[] = [
                    'id' => $c['id'],
                    'project_id' => $c['project_id'],
                    'author' => $c['author'],
                    'email' => $c['email'],
                    'text' => $c['text'],
                    'rating' => (int)$c['rating'],
                    'date' => date('d.m.Y H:i', strtotime($c['created_at'])),
                    'ip' => $c['ip_address'],
                    'avatar' => "https://www.gravatar.com/avatar/" . md5(strtolower($c['email'])) . "?d=identicon&s=60"
                ];
            }
            
            logMsg("Found " . count($formatted) . " comments");
            
            echo json_encode([
                'success' => true,
                'comments' => $formatted,
                'count' => count($formatted)
            ], JSON_UNESCAPED_UNICODE);
            break;
        
        case 'moderate':
            if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
                http_response_code(401);
                echo json_encode(['success' => false, 'error' => 'auth_required']);
                break;
            }
            
            $id = $_POST['comment_id'] ?? $input['comment_id'] ?? '';
            $status = $_POST['status'] ?? $input['status'] ?? '';
            
            if (!$id || !$status) {
                echo json_encode(['success' => false, 'message' => 'Недостаточно данных']);
                break;
            }
            
            logMsg("Moderate $id -> $status");
            
            $stmt = $db->prepare("UPDATE comments SET status = ? WHERE id = ?");
            $result = $stmt->execute([$status, $id]);
            
            echo json_encode([
                'success' => $result,
                'message' => $result ? 'Готово' : 'Ошибка'
            ]);
            break;
        
        default:
            echo json_encode(['success' => false, 'message' => 'Unknown action']);
    }
    
} catch (Exception $e) {
    logMsg("ERROR: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error']);
}

logMsg("=== END ===\n");
?>