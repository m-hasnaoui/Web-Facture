<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idUser'])) {
        $query = "SELECT * FROM users WHERE idUser = :idUser";
        $params = array(':idUser' => $_GET['idUser']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT * FROM users";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}



if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idUser = $_GET['idUser'];
    // $username = $_POST['username'];
    // $password = password_hash($_POST['password'], PASSWORD_BCRYPT); // Hashing the password
    // $profile = $_POST['profile'];
    // $role = $_POST['role'];
    $first_login = $_POST['first_login'];
    $user_upd = $_POST['user_upd'];

    

    $query = "UPDATE users SET user_upd=:user_upd,  first_login = :first_login WHERE idUser = :idUser";
    $params = array(':idUser' => $idUser, ':user_upd' => $user_upd, ':first_login' => $first_login);
    $result = metodPut($query, $params,'users');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

// if ($_POST['METHOD'] == 'DELETE') {
//     unset($_POST['METHOD']);
//     $id = $_GET['idUser'];
//     $query = "DELETE FROM users WHERE idUser = :id";
//     $params = array(':id' => $id);
//     $result = metodDelete($query, $params,'users');
//     echo json_encode($result);
//     header("HTTP/1.1 200 OK");
//     exit();
// }

header("HTTP/1.1 400 Bad Request");

?>
