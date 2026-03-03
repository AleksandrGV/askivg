<?php
    // config/prod_logging.php
    return [
        'enabled' => true,
        'log_file' => 'production.log',
        'log_level' => 'ERROR',       // Только ошибки и важные предупреждения
        'log_errors' => true,
        'display_errors' => false,    // НИКОГДА не показывать ошибки пользователю
        'max_file_size' => 10485760,  // 10MB
        'log_sql' => false,           // Не логировать SQL
        'log_requests' => false,      // Только ошибки запросов
        'email_errors' => true,       // Отправлять критические ошибки на email
        'email' => 'admin@example.com', // Указать свой email
    ];
?>