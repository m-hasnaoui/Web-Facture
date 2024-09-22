<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['code_sc'])) {
        $query = "SELECT * FROM societe WHERE code_sc = :code_sc";
        $params = array(':code_sc' => $_GET['code_sc']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT * FROM societe";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $raison_sociale = $_POST['raison_sociale'];
    $financie = $_POST['financie'];
    $active = $_POST['active'];
    $site_destockage = $_POST['site_destockage'];
    $user_cre = $_POST['user_cre'];
    $address = $_POST['address'];
    $gestion_depot = $_POST['gestion_depot'];
    $responsable = $_POST['responsable'];
    $telephone = $_POST['telephone'];

    $query = "INSERT INTO societe(raison_sociale, financie, active, site_destockage, user_cre, address, gestion_depot, responsable, telephone) 
              VALUES (:raison_sociale, :financie, :active, :site_destockage, :user_cre, :address, :gestion_depot, :responsable, :telephone)";
    $queryAutoIncrement = "SELECT MAX(code_sc) as code_sc FROM societe";
    $params = array(':raison_sociale' => $raison_sociale, ':financie' => $financie, ':active' => $active, ':site_destockage' => $site_destockage, 
                    ':user_cre' => $user_cre, ':address' => $address, ':gestion_depot' => $gestion_depot, ':responsable' => $responsable, ':telephone' => $telephone);
$result = metodPost($query, $queryAutoIncrement, $params, 'societe');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $code_sc = $_GET['code_sc'];
    $raison_sociale = $_POST['raison_sociale'];
    $financie = $_POST['financie'];
    $active = $_POST['active'];
    $site_destockage = $_POST['site_destockage'];
    $user_upd = $_POST['user_upd'];
    $address = $_POST['address'];
    $gestion_depot = $_POST['gestion_depot'];
    $responsable = $_POST['responsable'];
    $telephone = $_POST['telephone'];

    $query = "UPDATE societe SET raison_sociale = :raison_sociale, financie = :financie, active = :active, site_destockage = :site_destockage, 
              user_upd = :user_upd, address = :address, gestion_depot = :gestion_depot, responsable = :responsable, telephone = :telephone, 
              date_upd = CURRENT_TIMESTAMP WHERE code_sc = :code_sc";
    $params = array(':code_sc' => $code_sc, ':raison_sociale' => $raison_sociale, ':financie' => $financie, ':active' => $active, 
                    ':site_destockage' => $site_destockage, ':user_upd' => $user_upd, ':address' => $address, ':gestion_depot' => $gestion_depot, 
                    ':responsable' => $responsable, ':telephone' => $telephone);
    $result = metodPut($query, $params,'societe');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $code_sc = $_GET['code_sc'];
    $user_del=$_POST['user_del'];
    $query = "DELETE FROM societe WHERE code_sc = :code_sc";
    $params = array(':code_sc' => $code_sc);
    $result = metodDelete($query, $params,'societe');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");

?>