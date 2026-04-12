<?php
$conn = new mysqli('127.127.126.32', 'root', '', 'honey_hanters');
if ($conn->connect_error) {
    die('Ошибка: ' . $conn->connect_error);
}
echo 'Успешно подключено!';
?>