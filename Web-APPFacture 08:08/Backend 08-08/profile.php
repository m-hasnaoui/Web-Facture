<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['profile'])) {
        $query = "SELECT p.* FROM profile p WHERE p.profile = :profile;";
        $params = array(':profile' => $_GET['profile']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else if (isset($_GET['idUser'])) {
        if (isset($_GET['page'])) {
            $query = "SELECT p.* FROM profile p JOIN users u ON u.profile = p.profile WHERE u.idUser = :idUser AND p.page = :page;";
            $params = array(':idUser' => $_GET['idUser'], ':page' => $_GET['page']);
            $result = metodGet($query, $params);
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            $query = "SELECT p.* FROM profile p JOIN users u ON u.profile = p.profile WHERE u.idUser = :idUser;";
            $params = array(':idUser' => $_GET['idUser']);
            $result = metodGet($query, $params);
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        }
    } else {
        $query = "SELECT p.* FROM profile GROUP BY p.profile;";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $profile = $_POST['profile'];
    $page = $_POST['page'];
    $visibility = 0; //$_POST['visibility'];
    $op_add = 0; //$_POST['op_add'];
    $op_edit = 0; //$_POST['op_edit'];
    $op_delete = 0; //$_POST['op_delete'];
    $idUser = $_POST['idUser'];
    $user_cre= $_POST['user_cre'];


    // $query = "INSERT INTO `profile` (`profile`, `page`, `visibility`, `op_add`, `op_edit`, `op_delete`) VALUES (':profile', 'Affectation Mission Chauffeur', '0', '0', '0', '0'), (':profile', 'Affectation Véhicule Chauffeur', '0', '0', '0', '0'), (':profile', 'Chauffeur', '0', '0', '0', '0'), (':profile', 'Client', '0', '0', '0', '0'), (':profile', 'Déchargement', '0', '0', '0', '0'), (':profile', 'Gestion', '0', '0', '0', '0'), (':profile', 'Mission', '0', '0', '0', '0'), (':profile', 'Produit', '0', '0', '0', '0'), (':profile', 'Suivi Mission', '0', '0', '0', '0'), (':profile', 'Traject', '0', '0', '0', '0'), (':profile', 'Véhicule', '0', '0', '0', '0');";
    // $params = array(':profile' => $profile);
    $query = "INSERT INTO profile(profile, page, visibility, op_add, op_edit, op_delete,idUser,user_cre) VALUES (:profile, :page, :visibility, :op_add, :op_edit, :op_delete,:idUser,:user_cre)";
    $queryAutoIncrement = "SELECT MAX(idAPU) as profile FROM profile;";
    $params = array(':profile' => $profile, ':page' => $page, ':visibility' => $visibility, ':op_add' => $op_add, ':op_edit' => $op_edit, ':op_delete' => $op_delete,':idUser'=>$idUser,':user_cre'=>$user_cre);
    $result = metodPost($query, $queryAutoIncrement, $params,'profile');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    if (isset($_GET['op'])){
        $idAPU = $_GET['idAPU'];
        $visibility = $_POST['visibility'];
        $op_add = $_POST['op_add'];
        $op_edit = $_POST['op_edit'];
        $op_delete = $_POST['op_delete'];
        $user_upd = $_POST['user_upd'];
        
        $query = "UPDATE profile SET visibility = :visibility, op_add = :op_add, op_edit = :op_edit, op_delete = :op_delete , user_upd = :user_upd  WHERE idAPU = :idAPU";
        $params = array(':idAPU' => $idAPU, ':visibility' => $visibility, ':op_add' => $op_add, ':op_edit' => $op_edit, ':op_delete' => $op_delete,':user_upd' => $user_upd);
        $result = metodPut($query, $params,'profile');
        echo json_encode($result);
    } else {
        $idAPU = $_GET['idAPU'];
        $profile = $_POST['profile'];
        $page = $_POST['page'];
        $visibility = $_POST['visibility'];
        $op_add = $_POST['op_add'];
        $op_edit = $_POST['op_edit'];
        $op_delete = $_POST['op_delete'];
        $user_upd = $_POST['user_upd'];

        
        $query = "UPDATE profile SET profile = :profile, page = :page, visibility = :visibility, op_add = :op_add, op_edit = :op_edit, op_delete = :op_delete,user_upd = :user_upd  WHERE idAPU = :idAPU";
        $params = array(':idAPU' => $idAPU, ':profile' => $profile, ':page' => $page, ':visibility' => $visibility, ':op_add' => $op_add, ':op_edit' => $op_edit, ':op_delete' => $op_delete,':user_upd' => $user_upd);
        $result = metodPut($query, $params,'profile');
        echo json_encode($result);
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $id = $_GET['idAPU'];
    $query = "DELETE FROM profile WHERE idAPU = :id";
    $params = array(':id' => $id);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");

?>
