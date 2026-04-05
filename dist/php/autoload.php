<?php
/**
 * AUTOLOAD для OSPanel
 * Подключение к MySQL на 127.127.126.32:3306
 */

// Убедимся, что нет вывода буфера
if (ob_get_length()) ob_clean();

// Уровень ошибок (для разработки в OSPanel)
if (isset($_ENV['DEBUG_MODE']) && $_ENV['DEBUG_MODE'] === 'true') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Логирование ошибок
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php_errors.log');

// Загрузка .env файла
function loadEnv($path) {
    if (!file_exists($path)) {
        return false;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // Удаляем кавычки
            if (($value[0] === '"' && $value[strlen($value)-1] === '"') ||
                ($value[0] === "'" && $value[strlen($value)-1] === "'")) {
                $value = substr($value, 1, -1);
            }
            
            $_ENV[$key] = $value;
            putenv("$key=$value");
        }
    }
    return true;
}

// Загружаем .env
loadEnv(__DIR__ . '/../.env');

/**
 * Класс для работы с БД OSPanel
 */
class Database {
    private static $connection = null;
    
    public static function getConnection() {
        if (self::$connection === null) {
            $host = $_ENV['DB_HOST'] ?? '127.127.126.32';
            $port = $_ENV['DB_PORT'] ?? 3306;
            $dbname = $_ENV['DB_NAME'] ?? 'askivg';
            $user = $_ENV['DB_USER'] ?? 'root';
            $pass = $_ENV['DB_PASSWORD'] ?? '';
            
            try {
                $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
                self::$connection = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_TIMEOUT => 5
                ]);
                
                // Тестовый запрос для проверки
                self::$connection->query("SELECT 1");
                
            } catch (PDOException $e) {
                error_log("OSPanel DB Connection Error: " . $e->getMessage());
                throw new Exception("Ошибка подключения к базе данных OSPanel. Проверьте .env файл и настройки MySQL.");
            }
        }
        
        return self::$connection;
    }
    
    /**
     * Создает таблицы если их нет
     */
    public static function createTables() {
        $pdo = self::getConnection();
        
        $sqls = [
            "leads" => "CREATE TABLE IF NOT EXISTS leads (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL,
                phone VARCHAR(50),
                project_description TEXT NOT NULL,
                ip_address VARCHAR(45),
                user_agent TEXT,
                is_suspicious BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_created (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            
            "rate_limits" => "CREATE TABLE IF NOT EXISTS rate_limits (
                id INT AUTO_INCREMENT PRIMARY KEY,
                ip_hash VARCHAR(32) NOT NULL,
                ip_address VARCHAR(45) NOT NULL,
                timestamp INT NOT NULL,
                INDEX idx_ip_hash (ip_hash),
                INDEX idx_timestamp (timestamp)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            
            "comments" => "CREATE TABLE IF NOT EXISTS comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id VARCHAR(50) NOT NULL,
                author_name VARCHAR(100) NOT NULL,
                author_email VARCHAR(150) NOT NULL,
                comment_text TEXT NOT NULL,
                rating INT DEFAULT 0,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_project (project_id),
                INDEX idx_status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
        ];
        
        foreach ($sqls as $table => $sql) {
            try {
                $pdo->exec($sql);
                error_log("Таблица '$table' создана/проверена");
            } catch (Exception $e) {
                error_log("Ошибка создания таблицы '$table': " . $e->getMessage());
            }
        }
    }
}

/**
 * Класс для логирования
 */
class Logger {
    public static function log($message, $data = []) {
        $logFile = __DIR__ . '/../logs/app.log';
        $entry = date('Y-m-d H:i:s') . " | $message | " . json_encode($data, JSON_UNESCAPED_UNICODE) . "\n";
        file_put_contents($logFile, $entry, FILE_APPEND);
    }
    
    public static function logError($error, $context = []) {
        self::log("ERROR: $error", $context);
    }
}
?>