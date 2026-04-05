<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/config.php';

try {
    $db = getDB();
    
    // Создаем таблицу comments
    $sql = "CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        author VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        text TEXT NOT NULL,
        rating TINYINT DEFAULT 5,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        INDEX idx_project_id (project_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at),
        INDEX idx_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $db->exec($sql);
    
    echo "Таблица comments успешно создана\n";
    
    // Переносим данные из JSON файлов в базу данных
    $comments_dir = __DIR__ . '/../data/comments';
    if (file_exists($comments_dir)) {
        $files = glob($comments_dir . '/project_*.json');
        $imported = 0;
        
        foreach ($files as $file) {
            preg_match('/project_(\d+)\.json$/', basename($file), $matches);
            $project_id = $matches[1] ?? null;
            
            if ($project_id) {
                $data = file_get_contents($file);
                if ($data) {
                    $comments = json_decode($data, true) ?? [];
                    
                    foreach ($comments as $comment) {
                        // Проверяем, существует ли уже комментарий
                        $stmt = $db->prepare("SELECT id FROM comments WHERE author = ? AND email = ? AND text = ? AND project_id = ?");
                        $stmt->execute([
                            $comment['author'] ?? '',
                            $comment['email'] ?? '',
                            $comment['text'] ?? '',
                            $project_id
                        ]);
                        
                        if (!$stmt->fetch()) {
                            // Вставляем новый комментарий
                            $stmt = $db->prepare("INSERT INTO comments (project_id, author, email, text, rating, status, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                            $stmt->execute([
                                $project_id,
                                $comment['author'] ?? '',
                                $comment['email'] ?? '',
                                $comment['text'] ?? '',
                                $comment['rating'] ?? 5,
                                $comment['status'] ?? 'approved',
                                $comment['avatar'] ?? null,
                                $comment['created_at'] ?? date('Y-m-d H:i:s')
                            ]);
                            $imported++;
                        }
                    }
                }
            }
        }
        
        echo "Импортировано $imported комментариев из JSON файлов\n";
    }
    
    echo "Миграция успешно выполнена!\n";
    
} catch (PDOException $e) {
    echo "Ошибка при выполнении миграции: " . $e->getMessage() . "\n";
}
?>