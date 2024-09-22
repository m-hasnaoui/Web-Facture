<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $query = "SELECT * FROM roles GROUP BY role";
    $result = metodGet($query);
    echo json_encode($result->fetchAll());

    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $role = $_POST['role'];
    $query = "INSERT INTO roles(role) VALUES (:role)";
    $queryOrdered = "SELECT * FROM roles GROUP BY role";
    $params = array(':role' => $role);
    $result = metodPost($query, $queryOrdered, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $role = $_POST['role'];
    $query = "UPDATE roles SET role = :role WHERE role = :role";
    $params = array(':role' => $role);
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $role = $_POST['role'];
    $query = "DELETE FROM roles WHERE role = :role";
    $params = array(':role' => $role);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");

?>
