<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'bd/myData.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (!$username || !$password) {
        echo json_encode(array('error' => 'Username and password are required'));
        http_response_code(400);
        exit();
    }

    $query = "SELECT * FROM users WHERE username = :username";
    $params = array(':username' => $username);
    try {
        $result = metodGet($query, $params);
        $user = $result->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
        http_response_code(500);
        exit();
    }

    if ($user && password_verify($password, $user['password'])) {
        unset($user['password']); // Never return the password
        echo json_encode($user);
        http_response_code(200);
    } else {
        echo json_encode(array('error' => 'Incorrect username or password!'));
        http_response_code(401);
    }
    exit();
}

?>

