<?php
// send_form.php - Версия с защитой от спама

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Для отладки
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ========== КОНФИГУРАЦИЯ ЗАЩИТЫ ==========
define('MIN_TIME_BETWEEN_REQUESTS', 60); // 60 секунд между заявками
define('MAX_REQUESTS_PER_HOUR', 5);      // Максимум 5 заявок в час
define('MAX_REQUESTS_PER_DAY', 20);      // Максимум 20 заявок в день
define('BLOCK_DURATION', 3600);          // Блокировка на 1 час при превышении лимита

// Функция для получения IP клиента
function getClientIP() {
    $ip = $_SERVER['REMOTE_ADDR'];
    
    // Проверяем прокси
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    
    return $ip;
}

// Функция для проверки частоты запросов
function checkRequestFrequency($ip) {
    $rateLimitDir = __DIR__ . '/../data/rate_limit';
    if (!file_exists($rateLimitDir)) {
        mkdir($rateLimitDir, 0755, true);
    }
    
    $ipHash = md5($ip);
    $rateFile = $rateLimitDir . '/' . $ipHash . '.json';
    $now = time();
    
    // Загружаем историю запросов
    $history = [];
    if (file_exists($rateFile)) {
        $history = json_decode(file_get_contents($rateFile), true) ?: [];
    }
    
    // Очищаем старые записи (старше 24 часов)
    $history = array_filter($history, function($timestamp) use ($now) {
        return ($now - $timestamp) < 86400; // 24 часа
    });
    
    // 1. Проверяем минимальное время между запросами
    if (!empty($history)) {
        $lastRequest = max($history);
        $timeSinceLast = $now - $lastRequest;
        
        if ($timeSinceLast < MIN_TIME_BETWEEN_REQUESTS) {
            return [
                'allowed' => false,
                'message' => 'Пожалуйста, подождите ' . (MIN_TIME_BETWEEN_REQUESTS - $timeSinceLast) . ' секунд перед следующей заявкой',
                'wait_time' => MIN_TIME_BETWEEN_REQUESTS - $timeSinceLast
            ];
        }
    }
    
    // 2. Проверяем лимит в час
    $requestsLastHour = array_filter($history, function($timestamp) use ($now) {
        return ($now - $timestamp) < 3600; // 1 час
    });
    
    if (count($requestsLastHour) >= MAX_REQUESTS_PER_HOUR) {
        return [
            'allowed' => false,
            'message' => 'Превышен лимит заявок. Пожалуйста, попробуйте через час',
            'blocked' => true
        ];
    }
    
    // 3. Проверяем лимит в сутки
    if (count($history) >= MAX_REQUESTS_PER_DAY) {
        return [
            'allowed' => false,
            'message' => 'Превышен суточный лимит заявок',
            'blocked' => true
        ];
    }
    
    // Добавляем текущий запрос в историю
    $history[] = $now;
    
    // Сохраняем обновленную историю
    file_put_contents($rateFile, json_encode(array_values($history)));
    
    return ['allowed' => true];
}

// Функция для проверки подозрительного поведения
function checkSuspiciousBehavior($data) {
    $suspicious = false;
    $reasons = [];
    
    // 1. Проверка на слишком короткое имя
    if (strlen($data['name']) < 2) {
        $suspicious = true;
        $reasons[] = 'Слишком короткое имя';
    }
    
    // 2. Проверка на слишком длинное имя (боты часто пишут длинные имена)
    if (strlen($data['name']) > 50) {
        $suspicious = true;
        $reasons[] = 'Слишком длинное имя';
    }
    
    // 3. Проверка на повторяющиеся символы
    if (preg_match('/(.)\1{3,}/', $data['name'])) {
        $suspicious = true;
        $reasons[] = 'Подозрительное имя (повторяющиеся символы)';
    }
    
    // 4. Проверка на спам в тексте проекта
    $spamKeywords = ['viagra', 'casino', 'loan', 'http://', 'https://', 'www.', '.ru', '.com'];
    foreach ($spamKeywords as $keyword) {
        if (stripos($data['project'], $keyword) !== false) {
            $suspicious = true;
            $reasons[] = 'Обнаружены спам-ключевые слова';
            break;
        }
    }
    
    // 5. Проверка на слишком быстрый ввод (если есть timestamp отправки)
    if (isset($data['form_load_time'])) {
        $fillTime = time() - $data['form_load_time'];
        if ($fillTime < 3) { // Меньше 3 секунд на заполнение
            $suspicious = true;
            $reasons[] = 'Слишком быстрая отправка формы';
        }
    }
    
    return [
        'suspicious' => $suspicious,
        'reasons' => $reasons
    ];
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Получаем IP клиента
    $clientIP = getClientIP();
    
    // Проверяем частоту запросов
    $rateCheck = checkRequestFrequency($clientIP);
    if (!$rateCheck['allowed']) {
        http_response_code(429); // Too Many Requests
        echo json_encode([
            "success" => false, 
            "message" => $rateCheck['message'],
            "rate_limit" => true
        ]);
        exit;
    }
    
    // Получаем и очищаем данные
    $name = htmlspecialchars(trim($_POST["name"] ?? ''), ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars(trim($_POST["email"] ?? ''), ENT_QUOTES, 'UTF-8');
    $project = htmlspecialchars(trim($_POST["project"] ?? ''), ENT_QUOTES, 'UTF-8');
    $captchaAnswer = trim($_POST["captcha_answer"] ?? '');
    $captchaHash = trim($_POST["captcha_hash"] ?? '');
    $privacy = isset($_POST["privacy"]) ? true : false;
    
    // Проверяем на подозрительное поведение
    $behaviorCheck = checkSuspiciousBehavior([
        'name' => $name,
        'project' => $project,
        'form_load_time' => $_POST['form_load_time'] ?? null
    ]);
    
    // Валидация
    $errors = [];
    
    if (empty($name) || strlen($name) < 2) {
        $errors[] = "Имя должно содержать минимум 2 символа";
    } elseif (strlen($name) > 100) {
        $errors[] = "Имя не должно превышать 100 символов";
    }
    
    if (empty($email)) {
        $errors[] = "Пожалуйста, введите email";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Введите корректный email";
    } elseif (strlen($email) > 150) {
        $errors[] = "Email слишком длинный";
    }
    
    if (empty($project) || strlen($project) < 10) {
        $errors[] = "Описание проекта должно содержать минимум 10 символов";
    } elseif (strlen($project) > 2000) {
        $errors[] = "Описание проекта не должно превышать 2000 символов";
    }
    
    // Проверка CAPTCHA
    if (empty($captchaAnswer)) {
        $errors[] = "Пожалуйста, решите математическую задачу";
    } elseif ((string)$captchaHash !== (string)$captchaAnswer) {
        $errors[] = "Неверный ответ на математическую задачу";
    }
    
    if (!$privacy) {
        $errors[] = "Необходимо согласие с политикой конфиденциальности";
    }
    
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => implode(", ", $errors),
            "errors" => $errors
        ]);
        exit;
    }
    
    // Если подозрительное поведение, логируем но все равно принимаем
    if ($behaviorCheck['suspicious']) {
        $suspiciousLogDir = __DIR__ . '/../data/suspicious';
        if (!file_exists($suspiciousLogDir)) {
            mkdir($suspiciousLogDir, 0755, true);
        }
        
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'ip' => $clientIP,
            'name' => $name,
            'email' => $email,
            'project_preview' => substr($project, 0, 100),
            'reasons' => $behaviorCheck['reasons']
        ];
        
        file_put_contents(
            $suspiciousLogDir . '/suspicious_' . date('Y-m-d') . '.log',
            json_encode($logEntry, JSON_UNESCAPED_UNICODE) . "\n",
            FILE_APPEND
        );
    }
    
    // Подготовка данных
    $formData = [
        'date' => date('d.m.Y H:i'),
        'timestamp' => time(),
        'name' => $name,
        'email' => $email,
        'project' => $project,
        'ip' => $clientIP,
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
        'suspicious' => $behaviorCheck['suspicious']
    ];
    
    // СОХРАНЕНИЕ В ФАЙЛ
    $leadsDir = __DIR__ . '/../data/leads';
    if (!file_exists($leadsDir)) {
        mkdir($leadsDir, 0755, true);
    }
    
    $leadsFile = $leadsDir . '/leads.json';
    $leads = [];
    
    // Загружаем существующие заявки
    if (file_exists($leadsFile)) {
        $existingData = file_get_contents($leadsFile);
        if ($existingData) {
            $leads = json_decode($existingData, true) ?: [];
        }
    }
    
    // Ограничиваем количество хранимых заявок
    if (count($leads) > 1000) {
        $leads = array_slice($leads, -1000);
    }
    
    // Добавляем новую заявку
    $leads[] = $formData;
    
    // Сохраняем в файл
    $fileSaved = file_put_contents($leadsFile, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    // Формируем ответ
    if ($fileSaved) {
        // Генерируем новую CAPTCHA
        $newCaptcha = generateNewCaptcha();
        
        http_response_code(200);
        echo json_encode([
            "success" => true, 
            "message" => "✅ Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.",
            "captcha" => $newCaptcha,
            "rate_info" => [
                'next_allowed' => time() + MIN_TIME_BETWEEN_REQUESTS
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false, 
            "message" => "❌ Произошла ошибка при сохранении заявки."
        ]);
    }
    
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Метод не разрешен"]);
}

// Функция генерации CAPTCHA
function generateNewCaptcha() {
    $operations = ['+', '-', '*'];
    $operation = $operations[array_rand($operations)];
    
    switch($operation) {
        case '+':
            $num1 = rand(1, 10);
            $num2 = rand(1, 10);
            break;
        case '-':
            $num1 = rand(5, 15);
            $num2 = rand(1, 5);
            if ($num1 < $num2) [$num1, $num2] = [$num2, $num1];
            break;
        case '*':
            $num1 = rand(1, 5);
            $num2 = rand(1, 5);
            break;
    }
    
    switch($operation) {
        case '+': $answer = $num1 + $num2; break;
        case '-': $answer = $num1 - $num2; break;
        case '*': $answer = $num1 * $num2; break;
    }
    
    return [
        'question' => "Сколько будет $num1 $operation $num2?",
        'answer' => (string)$answer
    ];
}
?>