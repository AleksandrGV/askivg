<?php

// Отключаем вывод ошибок на продакшене
error_reporting(0);
ini_set('display_errors', 0);

// Включаем логирование ошибок в файл
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php_errors.log');

/**
 * Обработчик AJAX запросов для модерации
 * Файл: php/moderate_handler.php
 * Версия: 2.0 (с поддержкой .env и безопасностью)
 */

// ============================================================================
// НАСТРОЙКА ОКРУЖЕНИЯ И БЕЗОПАСНОСТИ
// ============================================================================

/**
 * Важно: файл должен начинаться строго с <?php
 * Никаких пробелов, пустых строк или символов до этого тега!
 */

/**
 * 1. Загружаем переменные окружения из .env файла
 * Это безопаснее, чем хранение паролей в коде
 */
function loadEnv($filePath) {
    if (!file_exists($filePath)) {
        // Если файла .env нет, создаем шаблон с инструкцией
        $template = "# Файл настроек окружения\n"
                   . "# Создайте безопасные логин и пароль для продакшена\n"
                   . "APP_ENV=development\n"
                   . "MODERATOR_LOGIN=moderator\n"
                   . "MODERATOR_PASSWORD=moderator123\n"
                   . "# Для продакшена:\n"
                   . "# APP_ENV=production\n"
                   . "# MODERATOR_LOGIN=your_secure_login\n"
                   . "# MODERATOR_PASSWORD=your_secure_password_here\n";
        
        file_put_contents($filePath, $template);
        return false; // Файл был создан, нужно перезагрузить
    }
    
    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Пропускаем комментарии
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        // Разбираем строки типа KEY=VALUE
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // Устанавливаем переменную окружения
            putenv("$key=$value");
            
            // Также устанавливаем в $_ENV для удобства
            $_ENV[$key] = $value;
        }
    }
    
    return true;
}

// Загружаем .env файл из корня проекта
$envLoaded = loadEnv(__DIR__ . '/../.env');

// Если файл только что создан, сообщаем об этом
if (!$envLoaded) {
    // В режиме разработки можно показать сообщение
    // В продакшене - просто использовать значения по умолчанию
}

// ============================================================================
// ОПРЕДЕЛЕНИЕ СРЕДЫ ВЫПОЛНЕНИЯ
// ============================================================================

/**
 * 2. Определяем среду выполнения
 * development - локальная разработка (OpenServer)
 * production - рабочий сервер (хостинг)
 */
$environment = getenv('APP_ENV') ?: 'development';

// Для отладки можно проверить, что среда определена правильно
// error_log("Environment: " . $environment);

// ============================================================================
// НАСТРОЙКА ОШИБОК В ЗАВИСИМОСТИ ОТ СРЕДЫ
// ============================================================================

if ($environment === 'development') {
    /**
     * Режим разработки: показываем ошибки для отладки
     * Но только если мы уверены, что никто посторонний не увидит
     */
    // error_reporting(E_ALL);
    // ini_set('display_errors', 1);
    
    // Лучше логировать ошибки в файл даже в разработке
    error_reporting(E_ALL);
    ini_set('display_errors', 0); // Не показывать на экране
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/../logs/php-debug.log');
} else {
    /**
     * Продакшен режим: НИКОГДА не показываем ошибки пользователю
     */
    error_reporting(0);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/../logs/php-errors.log');
}

// ============================================================================
// БЕЗОПАСНЫЕ НАСТРОЙКИ СЕССИИ
// ============================================================================

/**
 * 3. Настраиваем безопасные сессии
 * Это защищает от атак через сессии
 */
ini_set('session.cookie_httponly', 1);       // Запретить доступ к кукам через JavaScript
ini_set('session.cookie_secure', $environment === 'production' ? 1 : 0); // HTTPS только в продакшене
ini_set('session.use_strict_mode', 1);       // Запретить использование неинициализированных ID сессий
ini_set('session.use_only_cookies', 1);      // Использовать только куки для хранения ID сессии
ini_set('session.cookie_samesite', 'Strict'); // Защита от CSRF атак

// Начинаем сессию с безопасным именем
session_name('moderation_secure_session');
session_start();

// ============================================================================
// ПРОВЕРКА HTTPS ДЛЯ ПРОДАКШЕНА
// ============================================================================

/**
 * 4. В продакшене требуем HTTPS соединение
 * Это критически важно для безопасности передачи данных
 */
if ($environment === 'production') {
    /**
     * Проверяем несколько способов определения HTTPS
     * Некоторые хостинги используют прокси, поэтому проверяем разные варианты
     */
    $isHttps = false;
    
    // Стандартный способ
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        $isHttps = true;
    }
    
    // Альтернативные способы (для некоторых хостингов)
    if (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
        $isHttps = true;
    }
    
    if (!empty($_SERVER['HTTP_X_FORWARDED_SSL']) && $_SERVER['HTTP_X_FORWARDED_SSL'] === 'on') {
        $isHttps = true;
    }
    
    // Если не HTTPS - блокируем с понятным сообщением
    if (!$isHttps) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Для доступа к панели модерации требуется безопасное HTTPS соединение.',
            'error_code' => 'https_required'
        ]);
        exit;
    }
}

// ============================================================================
// КОНФИГУРАЦИЯ ДОСТУПА И БЕЗОПАСНОСТИ
// ============================================================================

/**
 * 5. Настройки доступа из переменных окружения
 * Никогда не храните пароли в коде!
 */
$correct_login = getenv('MODERATOR_LOGIN') ?: 'moderator';
$correct_password = getenv('MODERATOR_PASSWORD') ?: 'moderator123';

/**
 * 6. Настройки защиты от брутфорса
 * Блокировка после нескольких неудачных попыток
 * 
 * ВАЖНО: время блокировки должно быть разумным:
 * - 300 секунд (5 минут) - достаточно для защиты
 * - 3000 секунд (50 минут) - слишком долго, пользователь уйдет
 */
$max_attempts = 5;        // Максимум попыток входа
$lockout_time = 3000;      // Блокировка на 50 минут если нужно изменить поменяй значение

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ СЕССИОННЫХ ПЕРЕМЕННЫХ
// ============================================================================

/**
 * 7. Инициализируем счетчики попыток входа
 * Храним в сессии для каждого пользователя отдельно
 */
if (!isset($_SESSION['moderator_login_attempts'])) {
    $_SESSION['moderator_login_attempts'] = 0;
}
if (!isset($_SESSION['moderator_lockout_time'])) {
    $_SESSION['moderator_lockout_time'] = 0;
}
if (!isset($_SESSION['moderator_last_attempt_ip'])) {
    $_SESSION['moderator_last_attempt_ip'] = $_SERVER['REMOTE_ADDR'];
}

/**
 * 8. Защита от смены IP во время блокировки
 * Если IP изменился, сбрасываем счетчик
 */
if ($_SESSION['moderator_last_attempt_ip'] !== $_SERVER['REMOTE_ADDR']) {
    $_SESSION['moderator_login_attempts'] = 0;
    $_SESSION['moderator_lockout_time'] = 0;
    $_SESSION['moderator_last_attempt_ip'] = $_SERVER['REMOTE_ADDR'];
}

// ============================================================================
// УСТАНОВКА ЗАГОЛОВКОВ ДЛЯ CORS И JSON
// ============================================================================

/**
 * 9. Устанавливаем заголовки ДО любого вывода
 * Это важно для корректной работы AJAX запросов
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('X-Content-Type-Options: nosniff'); // Защита от MIME-sniffing
header('X-Frame-Options: DENY');           // Запрет встраивания в iframe

// Для CORS preflight запросов (браузерные проверки)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ============================================================================
// ФУНКЦИЯ ЛОГИРОВАНИЯ
// ============================================================================

/**
 * 10. Улучшенная функция логирования
 * Теперь логирует с учетом среды выполнения
 */
function logDebug($message) {
    $log_dir = __DIR__ . '/../logs';
    
    // Создаем папку для логов, если её нет
    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    
    $log_file = $log_dir . '/moderation.log';
    
    // Добавляем IP и дополнительную информацию
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    $request_uri = $_SERVER['REQUEST_URI'] ?? 'unknown';
    
    $log_message = sprintf(
        "[%s] [IP: %s] [URI: %s] %s\n",
        date('Y-m-d H:i:s'),
        $ip,
        $request_uri,
        $message
    );
    
    // Ротация логов: если файл больше 10MB, создаем новый
    if (file_exists($log_file) && filesize($log_file) > 10485760) { // 10MB
        $backup_file = $log_file . '.' . date('Y-m-d_His');
        rename($log_file, $backup_file);
    }
    
    file_put_contents($log_file, $log_message, FILE_APPEND);
    
    // В режиме разработки также логируем в отдельный файл
    global $environment;
    if ($environment === 'development') {
        $debug_file = $log_dir . '/debug.log';
        file_put_contents($debug_file, $log_message, FILE_APPEND);
    }
}

// ============================================================================
// ФУНКЦИИ ДЛЯ РАБОТЫ С КОММЕНТАРИЯМИ (без изменений)
// ============================================================================

function getPendingCommentsDirect() {
    $comments_dir = dirname(__DIR__) . '/data/comments';
    $all_pending = [];
    
    logDebug("Ищем комментарии в: " . $comments_dir);
    
    if (!file_exists($comments_dir)) {
        logDebug("Папка не существует: " . $comments_dir);
        return $all_pending;
    }
    
    $files = glob($comments_dir . '/project_*.json');
    logDebug("Найдено файлов: " . count($files));
    
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
    
    logDebug("Найдено pending комментариев: " . count($all_pending));
    return $all_pending;
}

function moderateCommentDirect($commentId, $status, $projectId = '') {
    $comments_dir = dirname(__DIR__) . '/data/comments';
    $found = false;
    
    logDebug("Модерация: commentId=$commentId, status=$status, projectId=$projectId");
    
    if (empty($projectId)) {
        // Ищем по всем файлам
        $files = glob($comments_dir . '/project_*.json');
        foreach ($files as $file) {
            $data = file_get_contents($file);
            if ($data) {
                $comments = json_decode($data, true);
                if ($comments && is_array($comments)) {
                    foreach ($comments as $key => &$comment) {
                        if ($comment['id'] === $commentId) {
                            if ($status === 'approved') {
                                $comment['status'] = 'approved';
                                $found = true;
                                logDebug("Комментарий одобрен в файле: " . basename($file));
                            } else {
                                // Удаляем из массива
                                unset($comments[$key]);
                                $found = true;
                                logDebug("Комментарий удален из файла: " . basename($file));
                            }
                            break;
                        }
                    }
                    
                    if ($found) {
                        $result = file_put_contents($file, json_encode(array_values($comments), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                        logDebug("Файл сохранен: " . ($result ? "Успешно" : "Ошибка"));
                        return ['success' => true, 'message' => 'Комментарий обновлен'];
                    }
                }
            }
        }
    } else {
        // Работаем с конкретным файлом
        $file = $comments_dir . '/project_' . $projectId . '.json';
        
        if (!file_exists($file)) {
            logDebug("Файл не найден: " . $file);
            return ['success' => false, 'message' => 'Файл проекта не найден'];
        }
        
        $data = file_get_contents($file);
        $comments = json_decode($data, true);
        
        if ($comments && is_array($comments)) {
            foreach ($comments as $key => &$comment) {
                if ($comment['id'] === $commentId) {
                    if ($status === 'approved') {
                        $comment['status'] = 'approved';
                        $found = true;
                        logDebug("Комментарий одобрен");
                    } else {
                        unset($comments[$key]);
                        $found = true;
                        logDebug("Комментарий удален");
                    }
                    break;
                }
            }
            
            if ($found) {
                $result = file_put_contents($file, json_encode(array_values($comments), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                logDebug("Файл сохранен: " . ($result ? "Успешно" : "Ошибка"));
                return ['success' => true, 'message' => 'Комментарий обновлен'];
            }
        }
    }
    
    logDebug("Комментарий не найден");
    return ['success' => false, 'message' => 'Комментарий не найден'];
}

// ============================================================================
// ОБРАБОТКА ВХОДЯЩИХ ЗАПРОСОВ
// ============================================================================

// Логируем начало обработки запроса
logDebug("=== Начало обработки запроса ===");
logDebug("Метод запроса: " . $_SERVER['REQUEST_METHOD']);
logDebug("URI запроса: " . ($_SERVER['REQUEST_URI'] ?? 'неизвестно'));
logDebug("IP клиента: " . ($_SERVER['REMOTE_ADDR'] ?? 'неизвестно'));

// Определяем тип содержимого и получаем данные
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$action = '';
$requestData = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // GET запросы
    $action = $_GET['action'] ?? '';
    logDebug("GET параметры: " . json_encode($_GET, JSON_UNESCAPED_UNICODE));
} else {
    // POST/PUT/DELETE запросы
    if (strpos($contentType, 'application/json') !== false) {
        // JSON данные
        $input = file_get_contents('php://input');
        $requestData = json_decode($input, true) ?? [];
        $action = $requestData['action'] ?? '';
        logDebug("Получены JSON данные: " . substr($input, 0, 500)); // Логируем первые 500 символов
    } else {
        // Form data
        $action = $_POST['action'] ?? '';
        $requestData = $_POST;
        logDebug("Получены POST данные: " . json_encode($_POST, JSON_UNESCAPED_UNICODE));
    }
}

logDebug("Определено действие: " . ($action ?: 'не указано'));

// ============================================================================
// ОБРАБОТКА КОНКРЕТНЫХ ДЕЙСТВИЙ
// ============================================================================

switch ($action) {
    case 'get_comments':
        // Проверяем авторизацию
        if (!isset($_SESSION['moderator_authenticated']) || $_SESSION['moderator_authenticated'] !== true) {
            logDebug("Попытка доступа без авторизации к get_comments");
            http_response_code(401); // Unauthorized
            echo json_encode([
                'success' => false,
                'error' => 'auth_required',
                'message' => 'Требуется авторизация'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
        
        $pendingComments = getPendingCommentsDirect();
        
        logDebug("Возвращаем комментариев на модерацию: " . count($pendingComments));
        
        echo json_encode([
            'success' => true,
            'comments' => $pendingComments,
            'count' => count($pendingComments),
            'timestamp' => date('H:i:s'),
            'environment' => $environment // Для отладки, в продакшене можно убрать
        ], JSON_UNESCAPED_UNICODE);
        exit;
        
    case 'check_auth':
        // Простая проверка авторизации
        $authenticated = isset($_SESSION['moderator_authenticated']) && $_SESSION['moderator_authenticated'] === true;
        logDebug("Проверка авторизации: " . ($authenticated ? 'авторизован' : 'не авторизован'));
        
        echo json_encode([
            'authenticated' => $authenticated,
            'environment' => $environment // Для отладки
        ], JSON_UNESCAPED_UNICODE);
        exit;
        
    case 'login':
        $login = $requestData['login'] ?? '';
        $password = $requestData['password'] ?? '';
        
        // Логируем попытку входа (без пароля!)
        logDebug("Попытка входа для логина: " . $login);
        
        // Проверяем блокировку
        $current_time = time();
        if ($current_time < $_SESSION['moderator_lockout_time']) {
            $remaining_time = ceil(($_SESSION['moderator_lockout_time'] - $current_time) / 60);
            logDebug("Аккаунт заблокирован, осталось: " . $remaining_time . " минут");
            
            http_response_code(429); // Too Many Requests
            echo json_encode([
                'success' => false,
                'message' => "Слишком много попыток входа. Попробуйте через {$remaining_time} минут.",
                'remaining_minutes' => $remaining_time
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
        
        // Проверяем логин и пароль
        if ($login === $correct_login && $password === $correct_password) {
            // УСПЕШНЫЙ ВХОД
            
            // Сбрасываем счетчик попыток
            $_SESSION['moderator_authenticated'] = true;
            $_SESSION['moderator_login_time'] = $current_time;
            $_SESSION['moderator_login_attempts'] = 0;
            $_SESSION['moderator_lockout_time'] = 0;
            
            // Регенерируем ID сессии для защиты от fixation атак
            session_regenerate_id(true);
            
            logDebug("Успешный вход для логина: " . $login);
            
            echo json_encode([
                'success' => true,
                'message' => 'Авторизация успешна',
                'login_time' => date('H:i:s')
            ], JSON_UNESCAPED_UNICODE);
        } else {
            // НЕУДАЧНАЯ ПОПЫТКА
            
            $_SESSION['moderator_login_attempts']++;
            logDebug("Неудачная попытка входа. Счетчик: " . $_SESSION['moderator_login_attempts']);
            
            if ($_SESSION['moderator_login_attempts'] >= $max_attempts) {
                // БЛОКИРОВКА АККАУНТА
                $_SESSION['moderator_lockout_time'] = $current_time + $lockout_time;
                $remaining_time = ceil($lockout_time / 60);
                
                logDebug("Аккаунт заблокирован на " . $remaining_time . " минут");
                
                http_response_code(429); // Too Many Requests
                echo json_encode([
                    'success' => false,
                    'message' => "Превышено количество попыток входа. Аккаунт заблокирован на {$remaining_time} минут.",
                    'blocked_until' => date('H:i:s', $_SESSION['moderator_lockout_time'])
                ], JSON_UNESCAPED_UNICODE);
            } else {
                // ПРЕДУПРЕЖДЕНИЕ
                $remaining_attempts = $max_attempts - $_SESSION['moderator_login_attempts'];
                logDebug("Осталось попыток: " . $remaining_attempts);
                
                http_response_code(401); // Unauthorized
                echo json_encode([
                    'success' => false,
                    'message' => "Неверный логин или пароль. Осталось попыток: {$remaining_attempts}",
                    'remaining_attempts' => $remaining_attempts
                ], JSON_UNESCAPED_UNICODE);
            }
        }
        exit;
        
    case 'moderate':
        // Проверяем авторизацию
        if (!isset($_SESSION['moderator_authenticated']) || $_SESSION['moderator_authenticated'] !== true) {
            logDebug("Попытка модерации без авторизации");
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'error' => 'auth_required',
                'message' => 'Требуется авторизация'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
        
        $commentId = $requestData['comment_id'] ?? '';
        $status = $requestData['status'] ?? '';
        $projectId = $requestData['project_id'] ?? '';
        
        if (empty($commentId) || empty($status)) {
            logDebug("Недостаточно данных для модерации");
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'message' => 'Недостаточно данных'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
        
        // Проверяем, что статус корректен
        if (!in_array($status, ['approved', 'rejected'])) {
            logDebug("Некорректный статус модерации: " . $status);
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'message' => 'Некорректный статус'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
        
        $result = moderateCommentDirect($commentId, $status, $projectId);
        logDebug("Результат модерации: " . json_encode($result, JSON_UNESCAPED_UNICODE));
        
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        exit;
        
    case 'logout':
        logDebug("Выход из системы");
        
        // Очищаем все данные сессии
        $_SESSION = [];
        
        // Удаляем куку сессии
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        
        // Уничтожаем сессию
        session_destroy();
        
        echo json_encode([
            'success' => true, 
            'message' => 'Выход выполнен'
        ], JSON_UNESCAPED_UNICODE);
        exit;
        
    default:
        logDebug("Неизвестное действие: " . $action);
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'message' => 'Неизвестное действие: ' . $action,
            'available_actions' => ['get_comments', 'check_auth', 'login', 'moderate', 'logout']
        ], JSON_UNESCAPED_UNICODE);
        exit;
}

// Логируем завершение обработки
logDebug("=== Обработка запроса завершена ===\n");
?>