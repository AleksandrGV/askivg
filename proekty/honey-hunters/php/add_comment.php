<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Исправлен путь к config.php
require_once __DIR__ . '/config.php';

$response = ['success' => false, 'message' => ''];

// Проверка, что запрос POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Недопустимый метод запроса';
    echo json_encode($response);
    exit;
}

// Получение и валидация данных
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$comment = trim($_POST['comment'] ?? '');

// Проверка обязательных полей
if (empty($name) || empty($email) || empty($comment)) {
    $response['message'] = 'Все поля обязательны для заполнения';
    echo json_encode($response);
    exit;
}

// Валидация email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['message'] = 'Некорректный email адрес';
    echo json_encode($response);
    exit;
}

try {
    $conn = getDBConnection();
    
    // Проверка на ошибку подключения
    if (is_array($conn) && isset($conn['error'])) {
        $response['message'] = $conn['error'];
        echo json_encode($response);
        exit;
    }
    
    // Подготовленный запрос для безопасности от SQL-инъекций
    $stmt = $conn->prepare("INSERT INTO comments (name, email, comment) VALUES (?, ?, ?)");
    
    if (!$stmt) {
        $response['message'] = 'Ошибка подготовки запроса: ' . $conn->error;
        echo json_encode($response);
        exit;
    }
    
    $stmt->bind_param("sss", $name, $email, $comment);
    
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Комментарий успешно добавлен';
    } else {
        $response['message'] = 'Ошибка при добавлении комментария: ' . $stmt->error;
    }
    
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    $response['message'] = 'Исключение: ' . $e->getMessage();
}

echo json_encode($response);
?>