<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['Code'])) {
        $query = "SELECT * FROM bptnum WHERE Code = :Code";
        $params = array(':Code' => $_GET['Code']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT * FROM bptnum";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $Raison_sociale = $_POST['Raison_sociale'];
    $adresse = $_POST['adresse'];
    $ville = $_POST['ville'];
    $famille = $_POST['famille'];
    $categorie = $_POST['categorie'];
    $devise = $_POST['devise'];
    $active = $_POST['active'];
    $contact = $_POST['contact'];
    $tell = $_POST['tell'];
    $email = $_POST['email'];
    $user_cre = $_POST['user_cre'];

    $query = "INSERT INTO bptnum(Raison_sociale, adresse, ville, famille, categorie, devise, active, contact, tell, email, user_cre) 
              VALUES (:Raison_sociale, :adresse, :ville, :famille, :categorie, :devise, :active, :contact, :tell, :email, :user_cre)";
    $queryAutoIncrement = "SELECT MAX(Code) as Code FROM bptnum";
    $params = array(
        ':Raison_sociale' => $Raison_sociale, 
        ':adresse' => $adresse, 
        ':ville' => $ville, 
        ':famille' => $famille, 
        ':categorie' => $categorie, 
        ':devise' => $devise, 
        ':active' => $active, 
        ':contact' => $contact, 
        ':tell' => $tell, 
        ':email' => $email, 
        ':user_cre' => $user_cre
    );
    $result = metodPost($query, $queryAutoIncrement, $params, 'bptnum');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $Code = $_GET['Code'];
    $Raison_sociale = $_POST['Raison_sociale'];
    $adresse = $_POST['adresse'];
    $ville = $_POST['ville'];
    $famille = $_POST['famille'];
    $categorie = $_POST['categorie'];
    $devise = $_POST['devise'];
    $active = $_POST['active'];
    $contact = $_POST['contact'];
    $tell = $_POST['tell'];
    $email = $_POST['email'];
    $user_upd = $_POST['user_upd'];
    
    $query = "UPDATE bptnum SET 
              Raison_sociale = :Raison_sociale, 
              adresse = :adresse, 
              ville = :ville, 
              famille = :famille, 
              categorie = :categorie, 
              devise = :devise, 
              active = :active, 
              contact = :contact, 
              tell = :tell, 
              email = :email, 
              user_upd = :user_upd 
              WHERE Code = :Code";
    $params = array(
        ':Code' => $Code,
        ':Raison_sociale' => $Raison_sociale, 
        ':adresse' => $adresse, 
        ':ville' => $ville, 
        ':famille' => $famille, 
        ':categorie' => $categorie, 
        ':devise' => $devise, 
        ':active' => $active, 
        ':contact' => $contact, 
        ':tell' => $tell, 
        ':email' => $email, 
        ':user_upd' => $user_upd
    );
    $result = metodPut($query, $params, 'bptnum');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $Code = $_GET['Code'];
    $user_del = $_POST['user_del'];
    $query = "DELETE FROM bptnum WHERE Code = :Code";
    $params = array(':Code' => $Code);
    $result = metodDelete($query, $params, 'bptnum');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");

?>
