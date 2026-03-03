<?php
/**
 * Конфигурация админ-панели с повышенной безопасностью
 */

// Базовый путь к файлам конфигурации
define('CONFIG_DIR', __DIR__);
define('ENV_FILE', CONFIG_DIR . '/../../.env');

// Тип окружения
define('ENVIRONMENT', ($_SERVER['HTTP_HOST'] ?? '') === 'localhost' ? 'development' : 'production');

class AdminConfig {
    private static $instance = null;
    private $config = [];
    
    private function __construct() {
        $this->loadConfig();
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function loadConfig() {
        // Пробуем загрузить из .env файла
        if (file_exists(ENV_FILE)) {
            $this->loadEnvFile(ENV_FILE);
        }
        
        // Загружаем значения или используем значения по умолчанию
        $this->config = [
            'admin_login' => $_ENV['ADMIN_LOGIN'] ?? $this->getDefaultLogin(),
            'admin_password' => $_ENV['ADMIN_PASSWORD'] ?? $this->getDefaultPassword(),
            'allowed_ips' => $this->getAllowedIPs(),
            'session_timeout' => 3600, // 1 час
            'max_attempts' => 5,
            'lockout_time' => 300 // 5 минут
        ];
        
        // В продакшене требуем настройку пароля
        if (ENVIRONMENT === 'production' && empty($_ENV['ADMIN_PASSWORD'])) {
            $this->logSecurityWarning('ADMIN_PASSWORD not set in production!');
        }
    }
    
    private function loadEnvFile($path) {
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
            }
        }
    }
    
    private function getDefaultLogin() {
        // Для разработки
        if (ENVIRONMENT === 'development') {
            return 'dev_admin';
        }
        return 'admin';
    }
    
    private function getDefaultPassword() {
        // Для разработки - простой пароль
        if (ENVIRONMENT === 'development') {
            return 'dev123';
        }
        // Для продакшена - генерируем случайный, если не задан
        return $this->generateSecurePassword();
    }
    
    private function generateSecurePassword() {
        return bin2hex(random_bytes(16));
    }
    
    private function getAllowedIPs() {
        $ips = [];
        
        // В разработке разрешаем все IP
        if (ENVIRONMENT === 'development') {
            return ['127.0.0.1', '::1', 'localhost'];
        }
        
        // В продакшене можно задать разрешенные IP
        if (isset($_ENV['ADMIN_ALLOWED_IPS'])) {
            $ips = array_map('trim', explode(',', $_ENV['ADMIN_ALLOWED_IPS']));
        }
        
        return $ips;
    }
    
    private function logSecurityWarning($message) {
        $logFile = CONFIG_DIR . '/../../logs/security.log';
        $entry = date('Y-m-d H:i:s') . " | WARNING | " . $message . "\n";
        file_put_contents($logFile, $entry, FILE_APPEND);
    }
    
    public function get($key) {
        return $this->config[$key] ?? null;
    }
    
    public function verifyPassword($inputPassword) {
        $storedPassword = $this->config['admin_password'];
        
        // Если пароль в .env файле, сравниваем напрямую
        if (isset($_ENV['ADMIN_PASSWORD'])) {
            return hash_equals($storedPassword, $inputPassword);
        }
        
        // Иначе используем хеширование для дефолтного пароля
        return password_verify($inputPassword, password_hash($storedPassword, PASSWORD_DEFAULT));
    }
    
    public function checkIPAccess() {
        $allowedIPs = $this->config['allowed_ips'];
        $clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        
        // В разработке разрешаем все
        if (ENVIRONMENT === 'development') {
            return true;
        }
        
        // В продакшене проверяем IP
        if (empty($allowedIPs)) {
            return true; // Если IP не заданы, разрешаем все
        }
        
        return in_array($clientIP, $allowedIPs);
    }
}