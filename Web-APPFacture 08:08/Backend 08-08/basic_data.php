<?php
include 'bd/myData.php';
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $tables = ['ABCCLS', 'BPSTYP','PTE', 'CHGTYP', 'CUR', 'OSTCTL', 'PAYLOKFLG', 'TSSCOD1', 'TSSCOD2', 'TSSCOD3', 'VACBPR'];
    foreach ($tables as $table) {
        if (isset($_GET[strtolower($table)])) {
            $query = "SELECT Code,description FROM $table";
            $result = metodGet($query);
            if ($result->rowCount() > 0) {
                echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
            } else {
                echo json_encode([]);
            }
            header("HTTP/1.1 200 OK");
            exit();
        }
    }
}

if ($_POST['METHOD'] == 'POST') {
    $tables = ['ABCCLS', 'BPSTYP', 'PTE', 'CHGTYP', 'CUR', 'OSTCTL', 'PAYLOKFLG', 'TSSCOD1', 'TSSCOD2', 'TSSCOD3', 'VACBPR'];

    foreach ($tables as $table) {
        if(isset($_GET[strtolower($table)])) {  
            $description = $_POST['description'];
            $user_cre=$_POST['user_cre'];
            $query = "INSERT INTO $table(description,user_cre) VALUES (:description,:user_cre);";
            $queryOrdered = "SELECT * FROM $table ORDER BY Code";
            $params = array(':description' => $description ,':user_cre'=>$user_cre);
            $result = metodPost($query, $queryOrdered, $params,$table);
            echo json_encode($result);
            exit();
        }
    }
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $tables = ['ABCCLS', 'BPSTYP',  'PTE', 'CHGTYP', 'CUR', 'OSTCTL', 'PAYLOKFLG', 'TSSCOD1', 'TSSCOD2', 'TSSCOD3', 'VACBPR'];
    foreach ($tables as $table) {
        if(isset($_GET[strtolower($table)])) {
            $Code = $_GET['Code'];
            $user_del=$_POST['user_del'];
            $query = "DELETE FROM $table WHERE Code = :Code;";
            $params = array(':Code' => $Code);
            $result = metodDelete($query, $params,$table);
            echo json_encode($result);
            
            header("HTTP/1.1 200 OK");
            exit();
        }
    }
}

header("HTTP/1.1 400 Bad Request");
?>