<?php
/**
 * Загрузка комментариев для проекта
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$projectId = $_GET['projectId'] ?? '';

if (empty($projectId)) {
    echo json_encode([]);
    exit;
}

$commentsFile = __DIR__ . '/data/comments/' . $projectId . '.json';

if (file_exists($commentsFile)) {
    $comments = file_get_contents($commentsFile);
    if ($comments) {
        echo $comments;
    } else {
        echo json_encode([]);
    }
} else {
    echo json_encode([]);
}
?>