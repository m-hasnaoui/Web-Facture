<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'bd/myData.php';

// Log all incoming requests
error_log("Received " . $_SERVER['REQUEST_METHOD'] . " request to changePassword.php");

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = file_get_contents("php://input");
    error_log("Received data: " . $input);
    
    $data = json_decode($input, true);
    error_log("Decoded data: " . print_r($data, true));

    $idUser = $data['idUser'] ?? '';
    $newPassword = $data['newPassword'] ?? '';

    if (!$idUser || !$newPassword) {
        $error = 'User ID and new password are required';
        if (!$idUser) $error .= ' (missing idUser)';
        if (!$newPassword) $error .= ' (missing newPassword)';
        error_log($error);
        echo json_encode(array('error' => $error));
        http_response_code(400);
        exit();
    }

    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

    $query = "UPDATE users SET password = :password, first_login = FALSE WHERE idUser = :idUser";
    $params = array(':password' => $hashedPassword, ':idUser' => $idUser);

    try {
        $result = metodPut($query, $params, 'users');
        if ($result) {
            error_log("Password change successful for user ID: " . $idUser);
            echo json_encode(array('success' => true));
            http_response_code(200);
        } else {
            error_log("Password change failed for user ID: " . $idUser);
            echo json_encode(array('error' => 'Failed to update password'));
            http_response_code(500);
        }
    } catch (Exception $e) {
        error_log("Database error: " . $e->getMessage());
        echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
        http_response_code(500);
    }
    exit();
}

// Handle other request methods or return a 405 Method Not Allowed if needed
error_log("Unsupported method: " . $_SERVER['REQUEST_METHOD']);
http_response_code(405);
echo json_encode(array('error' => 'Method Not Allowed'));
exit();
?>