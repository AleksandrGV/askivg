<?php
// Убедимся, что config.php загружен
if (!isset($_ENV['DB_HOST'])) {
    require_once __DIR__ . '/config.php';
}

class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        $host = $_ENV['DB_HOST'];
        $dbname = $_ENV['DB_NAME'];
        $username = $_ENV['DB_USER'];
        $password = $_ENV['DB_PASSWORD'] ?? '';
        $charset = $_ENV['DB_CHARSET'];
        
        $dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
        
        try {
            $this->connection = new PDO($dsn, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
            
            error_log("✅ Database connected to: $dbname");
            
        } catch (PDOException $e) {
            $errorMsg = "❌ Database connection failed: " . $e->getMessage();
            error_log($errorMsg);
            
            if ($_ENV['APP_ENV'] === 'development') {
                // В режиме разработки показываем подробную ошибку
                throw new Exception($errorMsg);
            } else {
                throw new Exception("Database connection error");
            }
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function query($sql, $params = []) {
        $stmt = $this->connection->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }
}

// Функция для быстрого доступа
function getDB() {
    return Database::getInstance()->getConnection();
}
?>