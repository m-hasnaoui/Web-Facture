<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idVcl'])) {
        $query = "SELECT * FROM vehicle WHERE idVcl = :idVcl";
        $params = array(':idVcl' => $_GET['idVcl']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetch(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT * FROM vehicle";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $regNumber = $_POST['regNumber'];
    $type = $_POST['type'];
    $mileage = $_POST['mileage'];
    $user_cre = $_POST['user_cre'];
    $active = $_POST['active'];


    
    $query = "INSERT INTO vehicle(regNumber, type, active,mileage,user_cre) VALUES (:regNumber, :type, :mileage,:active,:user_cre)";
    $params = array(':regNumber' => $regNumber, ':type' => $type, ':mileage' => $mileage,':active'=>$active,':user_cre' => $user_cre);
    $queryAutoIncrement = "SELECT MAX(idVcl) as idVcl FROM vehicle";
    $result = metodPost($query, $queryAutoIncrement, $params,'Camion');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idVcl = $_GET['idVcl'];
    $regNumber = $_POST['regNumber'];
    $type = $_POST['type'];
    $mileage = $_POST['mileage'];
    

    $query = "UPDATE vehicle SET regNumber = :regNumber, type = :type, mileage = :mileage ,user_upd = :user_upd WHERE idVcl = :idVcl";

    $params = array(':idVcl' => $idVcl, ':regNumber' => $regNumber, ':type' => $type, ':mileage' => $mileage,':user_upd' => $user_upd);
    $result = metodPut($query, $params,'camion');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $idVcl = $_GET['idVcl'];
    $query = "DELETE FROM vehicle WHERE idVcl = :idVcl";
    $params = array(':idVcl' => $idVcl);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");
?>
