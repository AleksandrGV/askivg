<?php
/**
 * Обработка формы обратной связи
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Функция для отправки JSON ответа
function sendResponse($success, $message, $data = []) {
    http_response_code($success ? 200 : 400);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Метод не разрешен');
}

// Получаем данные
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Если не получилось распарсить JSON, пробуем получить из POST
if (!$data) {
    $data = $_POST;
}

// Проверяем обязательные поля
$required = ['name', 'email', 'project'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        sendResponse(false, "Поле '$field' обязательно для заполнения");
    }
}

// Валидация данных
$name = trim(htmlspecialchars($data['name']));
$email = trim(htmlspecialchars($data['email']));
$project = trim(htmlspecialchars($data['project']));

if (strlen($name) < 2) {
    sendResponse(false, 'Имя должно содержать минимум 2 символа');
}

if (strlen($project) < 10) {
    sendResponse(false, 'Описание проекта должно содержать минимум 10 символов');
}

// Подготовка данных
$formData = [
    'id' => uniqid(),
    'date' => date('Y-m-d H:i:s'),
    'timestamp' => time(),
    'name' => $name,
    'email' => $email,
    'project' => $project,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
];

// Сохранение в файл
try {
    $dataDir = __DIR__ . '/data';
    if (!file_exists($dataDir)) {
        mkdir($dataDir, 0755, true);
    }
    
    $leadsFile = $dataDir . '/leads.json';
    $leads = [];
    
    if (file_exists($leadsFile)) {
        $existingData = file_get_contents($leadsFile);
        if ($existingData) {
            $leads = json_decode($existingData, true) ?: [];
        }
    }
    
    $leads[] = $formData;
    file_put_contents($leadsFile, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
} catch (Exception $e) {
    // Логируем ошибку, но продолжаем
    error_log("Ошибка сохранения заявки: " . $e->getMessage());
}

// УСПЕШНЫЙ ОТВЕТ (без попытки отправки email)
sendResponse(true, '✔️ Спасибо! Ваша заявка получена. Мы свяжемся с вами в ближайшее время.', [
    'lead_id' => $formData['id']
]);
?>