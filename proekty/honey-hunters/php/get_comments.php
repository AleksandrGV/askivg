<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once __DIR__ . '/config.php';

$response = ['success' => false, 'comments' => []];

try {
    $conn = getDBConnection();
    
    // Проверка на ошибку подключения
    if (is_array($conn) && isset($conn['error'])) {
        // Если нет БД, возвращаем демо-комментарии
        $response['success'] = true;
        $response['comments'] = getDemoComments();
        $response['demo_mode'] = true;
        echo json_encode($response);
        exit;
    }
    
    $sql = "SELECT id, name, email, comment, created_at FROM comments ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        $response['success'] = true;
        
        while ($row = $result->fetch_assoc()) {
            $response['comments'][] = $row;
        }
    } else {
        // Если в БД нет комментариев, показываем демо-комментарии
        $response['success'] = true;
        $response['comments'] = getDemoComments();
        $response['demo_mode'] = true;
    }
    
    $conn->close();
} catch (Exception $e) {
    // При ошибке показываем демо-комментарии
    $response['success'] = true;
    $response['comments'] = getDemoComments();
    $response['demo_mode'] = true;
}

echo json_encode($response);

// Функция для получения демо-комментариев
function getDemoComments() {
    return [
        [
            'id' => 1,
            'name' => 'Анна Смирнова',
            'email' => 'anna@example.com',
            'comment' => 'Очень вкусный мёд! Заказывала липовый, просто потрясающий аромат. Быстрая доставка, буду заказывать еще!',
            'created_at' => date('Y-m-d H:i:s', strtotime('-2 days'))
        ],
        [
            'id' => 2,
            'name' => 'Михаил Петров',
            'email' => 'mikhail@example.com',
            'comment' => 'Отличный магазин! Мёд натуральный, без добавок. Взял гречишный - очень доволен. Рекомендую!',
            'created_at' => date('Y-m-d H:i:s', strtotime('-5 days'))
        ],
        [
            'id' => 3,
            'name' => 'Елена Козлова',
            'email' => 'elena@example.com',
            'comment' => 'Покупаю здесь не первый раз. Качество всегда отличное, цены приятные. Особенно нравится горный мёд.',
            'created_at' => date('Y-m-d H:i:s', strtotime('-1 week'))
        ],
        [
            'id' => 4,
            'name' => 'Дмитрий Иванов',
            'email' => 'dmitry@example.com',
            'comment' => 'Заказывал мёд с прополисом. Очень помог при простуде. Спасибо!',
            'created_at' => date('Y-m-d H:i:s', strtotime('-2 weeks'))
        ],
        [
            'id' => 5,
            'name' => 'Ольга Сидорова',
            'email' => 'olga@example.com',
            'comment' => 'Прекрасный мёд! Дети едят с удовольствием. Упаковка надежная, ничего не пролилось.',
            'created_at' => date('Y-m-d H:i:s', strtotime('-3 weeks'))
        ]
    ];
}
?>