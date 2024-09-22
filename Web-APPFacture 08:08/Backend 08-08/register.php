<?php
include 'config.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $username = $data['username'];
    $password = password_hash($data['password'], PASSWORD_BCRYPT);
    $role = $data['role'];

    $stmt = $pdo->prepare("INSERT INTO users (username, password, role) VALUES (:username, :password, :role)");
    $stmt->execute(['username' => $username, 'password' => $password, 'role' => $role]);

    echo json_encode(['message' => 'User registered successfully']);
    http_response_code(201);
    exit();
}

http_response_code(400);
echo json_encode(['error' => 'Bad Request']);
?>
