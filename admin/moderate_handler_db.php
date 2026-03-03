<?php
/**
 * Обработчик AJAX запросов для модерации (версия с БД)
 * Файл: php/moderate_handler_db.php
 * 
 * ВНИМАНИЕ: Этот файл работает с базой данных, а не с JSON файлами!
 * Для использования, переименуйте старый moderate_handler.php в moderate_handler_json.php,
 * а этот файл переименуйте в moderate_handler.php
 */

// Отключаем вывод ошибок на экран для JSON API
ini_set('display_errors', 0);
error_reporting(E_ALL & ~E_WARNING & ~E_NOTICE);

// Загружаем конфигурацию и подключение к БД
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

// Устанавливаем заголовки JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Обработка CORS preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/**
 * Функция логирования для отладки
 */
function logModeration($message) {
    $log_dir = __DIR__ . '/../logs';
    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    
    $log_file = $log_dir . '/moderation_db.log';
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $uri = $_SERVER['REQUEST_URI'] ?? 'unknown';
    
    $log_message = "[$timestamp] [IP: $ip] [URI: $uri] $message\n";
    file_put_contents($log_file, $log_message, FILE_APPEND);
}

logModeration("=== НАЧАЛО ОБРАБОТКИ ЗАПРОСА ===");

// ============================================================================
// НАСТРОЙКИ БЕЗОПАСНОСТИ
// ============================================================================

// Загружаем логин и пароль из .env или используем значения по умолчанию
$correct_login = $_ENV['MODERATOR_LOGIN'] ?? getenv('MODERATOR_LOGIN') ?: 'admin';
$correct_password = $_ENV['MODERATOR_PASSWORD'] ?? getenv('MODERATOR_PASSWORD') ?: 'admin123';

// Настройки защиты от брутфорса
$max_attempts = 5;        // Максимум попыток входа
$lockout_time = 300;      // Блокировка на 5 минут (в секундах)

// ============================================================================
// УПРАВЛЕНИЕ СЕССИЕЙ
// ============================================================================

// Настройки сессии
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_samesite', 'Strict');

session_name('moderator_session');
session_start();

// Инициализация счетчиков попыток
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
}
if (!isset($_SESSION['lockout_until'])) {
    $_SESSION['lockout_until'] = 0;
}

// Проверка блокировки
if ($_SESSION['lockout_until'] > time()) {
    $remaining = ceil(($_SESSION['lockout_until'] - time()) / 60);
    logModeration("Аккаунт заблокирован, осталось: $remaining минут");
}

// ============================================================================
// ПОЛУЧЕНИЕ ВХОДНЫХ ДАННЫХ
// ============================================================================

$action = '';
$requestData = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';
    $requestData = $_GET;
    logModeration("GET параметры: " . json_encode($_GET, JSON_UNESCAPED_UNICODE));
} else {
    // POST запрос - пробуем JSON, затем обычный POST
    $input = file_get_contents('php://input');
    if (!empty($input) && $input[0] === '{') {
        $requestData = json_decode($input, true) ?? [];
        $action = $requestData['action'] ?? '';
        logModeration("JSON данные: " . substr($input, 0, 500));
    } else {
        $requestData = $_POST;
        $action = $_POST['action'] ?? '';
        logModeration("POST данные: " . json_encode($_POST, JSON_UNESCAPED_UNICODE));
    }
}

logModeration("Действие: " . ($action ?: 'не указано'));

// ============================================================================
// ОБРАБОТЧИКИ ДЕЙСТВИЙ
// ============================================================================

try {
    $db = getDB();
    
    switch ($action) {
        
        // ====================================================================
        // ПРОВЕРКА АВТОРИЗАЦИИ
        // ====================================================================
        case 'check_auth':
            $authenticated = isset($_SESSION['moderator_id']) && $_SESSION['moderator_id'] === session_id();
            logModeration("Проверка авторизации: " . ($authenticated ? 'ДА' : 'НЕТ'));
            
            echo json_encode([
                'success' => true,
                'authenticated' => $authenticated
            ]);
            break;
        
        // ====================================================================
        // ВХОД В СИСТЕМУ
        // ====================================================================
        case 'login':
            $login = $requestData['login'] ?? '';
            $password = $requestData['password'] ?? '';
            
            logModeration("Попытка входа: login='$login'");
            
            // Проверка блокировки
            if ($_SESSION['lockout_until'] > time()) {
                $remaining = $_SESSION['lockout_until'] - time();
                $minutes = ceil($remaining / 60);
                
                echo json_encode([
                    'success' => false,
                    'message' => "Слишком много попыток. Попробуйте через $minutes минут.",
                    'locked' => true,
                    'remaining' => $remaining
                ]);
                break;
            }
            
            // Проверка логина и пароля
            if ($login === $correct_login && $password === $correct_password) {
                // Успешный вход
                $_SESSION['moderator_id'] = session_id();
                $_SESSION['moderator_login'] = $login;
                $_SESSION['login_time'] = time();
                $_SESSION['login_attempts'] = 0;
                $_SESSION['lockout_until'] = 0;
                
                session_regenerate_id(true);
                
                logModeration("Успешный вход: $login");
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Авторизация успешна'
                ]);
            } else {
                // Неудачная попытка
                $_SESSION['login_attempts']++;
                
                if ($_SESSION['login_attempts'] >= $max_attempts) {
                    $_SESSION['lockout_until'] = time() + $lockout_time;
                    logModeration("Аккаунт заблокирован на $lockout_time секунд");
                }
                
                $remaining_attempts = $max_attempts - $_SESSION['login_attempts'];
                
                echo json_encode([
                    'success' => false,
                    'message' => 'Неверный логин или пароль',
                    'remaining_attempts' => $remaining_attempts > 0 ? $remaining_attempts : 0
                ]);
            }
            break;
        
        // ====================================================================
        // ВЫХОД ИЗ СИСТЕМЫ
        // ====================================================================
        case 'logout':
            logModeration("Выход из системы");
            
            $_SESSION = [];
            session_destroy();
            
            echo json_encode([
                'success' => true,
                'message' => 'Выход выполнен'
            ]);
            break;
        
        // ====================================================================
        // ПОЛУЧЕНИЕ КОММЕНТАРИЕВ НА МОДЕРАЦИЮ
        // ====================================================================
        case 'get_comments':
            // Проверка авторизации
            if (!isset($_SESSION['moderator_id']) || $_SESSION['moderator_id'] !== session_id()) {
                logModeration("ОШИБКА: Попытка доступа без авторизации");
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'auth_required',
                    'message' => 'Требуется авторизация'
                ]);
                break;
            }
            
            logModeration("Запрос комментариев на модерацию");
            
            // Получаем комментарии со статусом 'pending'
            $sql = "SELECT * FROM comments WHERE status = 'pending' ORDER BY created_at DESC";
            $stmt = $db->query($sql);
            $comments = $stmt->fetchAll();
            
            logModeration("Найдено комментариев на модерацию: " . count($comments));
            
            // Форматируем комментарии для клиента
            $formattedComments = [];
            foreach ($comments as $comment) {
                $formattedComments[] = [
                    'id' => $comment['id'],
                    'project_id' => $comment['project_id'],
                    'author' => $comment['author'],
                    'email' => $comment['email'],
                    'text' => $comment['text'],
                    'rating' => (int)$comment['rating'],
                    'date' => date('d.m.Y H:i', strtotime($comment['created_at'])),
                    'status' => $comment['status'],
                    'ip_address' => $comment['ip_address'],
                    'avatar' => "https://www.gravatar.com/avatar/" . md5(strtolower(trim($comment['email']))) . "?d=identicon&s=60"
                ];
            }
            
            echo json_encode([
                'success' => true,
                'comments' => $formattedComments,
                'count' => count($formattedComments)
            ], JSON_UNESCAPED_UNICODE);
            break;
        
        // ====================================================================
        // МОДЕРАЦИЯ КОММЕНТАРИЯ (одобрить/отклонить)
        // ====================================================================
        case 'moderate':
            // Проверка авторизации
            if (!isset($_SESSION['moderator_id']) || $_SESSION['moderator_id'] !== session_id()) {
                logModeration("ОШИБКА: Попытка модерации без авторизации");
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'auth_required',
                    'message' => 'Требуется авторизация'
                ]);
                break;
            }
            
            $commentId = $requestData['comment_id'] ?? '';
            $status = $requestData['status'] ?? '';
            
            if (empty($commentId) || empty($status)) {
                logModeration("ОШИБКА: Недостаточно данных для модерации");
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Недостаточно данных'
                ]);
                break;
            }
            
            // Проверяем корректность статуса
            if (!in_array($status, ['approved', 'rejected'])) {
                logModeration("ОШИБКА: Некорректный статус: $status");
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Некорректный статус'
                ]);
                break;
            }
            
            logModeration("Модерация комментария ID: $commentId, статус: $status");
            
            // Обновляем статус комментария
            $sql = "UPDATE comments SET status = ? WHERE id = ?";
            $stmt = $db->prepare($sql);
            $result = $stmt->execute([$status, $commentId]);
            
            if ($result) {
                logModeration("Комментарий $commentId обновлен: статус = $status");
                
                echo json_encode([
                    'success' => true,
                    'message' => $status === 'approved' ? 'Комментарий одобрен' : 'Комментарий отклонен',
                    'comment_id' => $commentId,
                    'status' => $status
                ]);
            } else {
                logModeration("ОШИБКА: Не удалось обновить комментарий $commentId");
                
                echo json_encode([
                    'success' => false,
                    'message' => 'Не удалось обновить комментарий'
                ]);
            }
            break;
        
        // ====================================================================
        // УДАЛЕНИЕ КОММЕНТАРИЯ
        // ====================================================================
        case 'delete':
            // Проверка авторизации
            if (!isset($_SESSION['moderator_id']) || $_SESSION['moderator_id'] !== session_id()) {
                logModeration("ОШИБКА: Попытка удаления без авторизации");
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'auth_required',
                    'message' => 'Требуется авторизация'
                ]);
                break;
            }
            
            $commentId = $requestData['comment_id'] ?? '';
            
            if (empty($commentId)) {
                logModeration("ОШИБКА: Не указан ID комментария");
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Не указан ID комментария'
                ]);
                break;
            }
            
            logModeration("Удаление комментария ID: $commentId");
            
            // Удаляем комментарий
            $sql = "DELETE FROM comments WHERE id = ?";
            $stmt = $db->prepare($sql);
            $result = $stmt->execute([$commentId]);
            
            if ($result) {
                logModeration("Комментарий $commentId удален");
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Комментарий удален',
                    'comment_id' => $commentId
                ]);
            } else {
                logModeration("ОШИБКА: Не удалось удалить комментарий $commentId");
                
                echo json_encode([
                    'success' => false,
                    'message' => 'Не удалось удалить комментарий'
                ]);
            }
            break;
        
        // ====================================================================
        // ДЕЙСТВИЕ ПО УМОЛЧАНИЮ
        // ====================================================================
        default:
            logModeration("ОШИБКА: Неизвестное действие: $action");
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Неизвестное действие',
                'available_actions' => ['check_auth', 'login', 'logout', 'get_comments', 'moderate', 'delete']
            ]);
            break;
    }
    
} catch (PDOException $e) {
    logModeration("ОШИБКА БД: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка базы данных',
        'error' => $_ENV['APP_ENV'] === 'development' ? $e->getMessage() : null
    ]);
} catch (Exception $e) {
    logModeration("ОШИБКА: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Внутренняя ошибка сервера',
        'error' => $_ENV['APP_ENV'] === 'development' ? $e->getMessage() : null
    ]);
}

logModeration("=== КОНЕЦ ОБРАБОТКИ ЗАПРОСА ===\n");
?>