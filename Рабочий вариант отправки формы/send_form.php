<?php

// config.php уже включает настройки ошибок
require_once __DIR__ . '/../config/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

/**
 * Обработка формы обратной связи
 * Рабочая версия для Open Server
 */

// ДЛЯ ПРОДАКШЕНА:
error_reporting(0);
ini_set('display_errors', 0);

ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php-errors.log');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Получаем и очищаем данные
    $name = htmlspecialchars(trim($_POST["name"] ?? ''), ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars(trim($_POST["email"] ?? ''), ENT_QUOTES, 'UTF-8');
    $project = htmlspecialchars(trim($_POST["project"] ?? ''), ENT_QUOTES, 'UTF-8');
    $privacy = isset($_POST["privacy"]) ? "Да" : "Нет";
    
    // Валидация
    $errors = [];
    
    if (empty($name) || strlen($name) < 2) {
        $errors[] = "Имя должно содержать минимум 2 символа";
    }
    
    if (empty($email)) {
        $errors[] = "Пожалуйста, введите email или телефон";
    }
    
    if (empty($project) || strlen($project) < 10) {
        $errors[] = "Описание проекта должно содержать минимум 10 символов";
    }
    
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => implode(", ", $errors)]);
        exit;
    }
    
    // Подготовка данных
    $formData = [
        'date' => date('d.m.Y H:i'),
        'timestamp' => time(),
        'name' => $name,
        'contact' => $email,
        'project' => $project,
        'privacy' => $privacy,
        'ip' => $_SERVER['REMOTE_ADDR']
    ];
    
    // 1. СОХРАНЕНИЕ В ФАЙЛ
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
    
    // Добавляем новую заявку
    $leads[] = $formData;
    
    // Сохраняем в файл
    $fileSaved = file_put_contents($leadsFile, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    // 2. ОТПРАВКА НА ПОЧТУ (закомментируйте пока для теста)
    $emailSent = false;
    $emailMessage = "Режим тестирования - письмо не отправлено";
    
    /*
    // Раскомментируйте когда будете готовы отправлять письма
    try {
        $to = "your-email@example.com"; // ЗАМЕНИТЕ на ваш email
        $subject = "Новая заявка с сайта A.S.K.I.V.G. - " . date('d.m.Y H:i');
        
        $email_content = "НОВАЯ ЗАЯВКА С САЙТА A.S.K.I.V.G.\n\n";
        $email_content .= "Имя: " . $name . "\n";
        $email_content .= "Контакт: " . $email . "\n";
        $email_content .= "Проект: " . $project . "\n";
        $email_content .= "Время: " . date('d.m.Y H:i') . "\n";
        
        $headers = "From: noreply@askvg.local\r\n";
        $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
        
        $emailSent = mail($to, $subject, $email_content, $headers);
        $emailMessage = $emailSent ? "Письмо отправлено" : "Ошибка отправки письма";
        
    } catch (Exception $e) {
        $emailMessage = "Ошибка: " . $e->getMessage();
    }
    */
    
    // Формируем ответ
    if ($fileSaved) {
        http_response_code(200);
        echo json_encode([
            "success" => true, 
            "message" => "✅ Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.",
            "email_status" => $emailMessage
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
?>