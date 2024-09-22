<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['Code'])) {
        $query = "SELECT * FROM bsgcod WHERE Code = :Code";
        $params = array(':Code' => $_GET['Code']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetch(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT * FROM bsgcod";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $tier = $_POST['tier'];
    $type = $_POST['type'];
    $description = $_POST['description'];
    $CODNUM = $_POST['CODNUM'];
    $user_cre = $_POST['user_cre'];

    $query = "INSERT INTO bsgcod(tier, type, description, CODNUM, user_cre) VALUES (:tier, :type, :description, :CODNUM, :user_cre)";
    $params = array(':tier' => $tier, ':type' => $type, ':description' => $description, ':CODNUM' => $CODNUM, ':user_cre' => $user_cre);
    $queryAutoIncrement = "SELECT MAX(Code) as Code FROM bsgcod";
    $result = metodPost($query, $queryAutoIncrement, $params, 'Category');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $Code = $_GET['Code'];
    $tier = $_POST['tier'];
    $type = $_POST['type'];
    $description = $_POST['description'];
    $CODNUM = $_POST['CODNUM'];
    $user_upd = $_POST['user_upd'];

    $query = "UPDATE bsgcod SET tier = :tier, type = :type, description = :description, CODNUM = :CODNUM, user_upd = :user_upd WHERE Code = :Code";
    $params = array(':Code' => $Code, ':tier' => $tier, ':type' => $type, ':description' => $description, ':CODNUM' => $CODNUM, ':user_upd' => $user_upd);
    $result = metodPut($query, $params, 'Category');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $Code = $_GET['Code'];
    $query = "DELETE FROM bsgcod WHERE Code = :Code";
    $params = array(':Code' => $Code);
    $result = metodDelete($query, $params,'Category');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");
?>