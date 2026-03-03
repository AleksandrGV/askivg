<?php
    // config/dev_logging.php
    return [
        'enabled' => true,
        'log_file' => 'debug.log',  // Или 'dev_debug.log'
        'log_level' => 'INFO',       // Подробное логирование
        'log_errors' => true,
        'display_errors' => true,    // Показывать ошибки на экране
        'max_file_size' => 5242880,  // 5MB для разработки
        'log_sql' => true,           // Логировать SQL запросы
        'log_requests' => true,      // Логировать все запросы
    ];
?>