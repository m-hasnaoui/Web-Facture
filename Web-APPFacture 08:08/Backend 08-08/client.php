<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['Code'])) {
        $query = "SELECT ,c.Code,c.code_client,c.categorie_code,c.Raison_sociale,c.adresse,c.ville,c.famille,b.description,c.devise,c.adresse,c.contact,c.tell,c.email,c.user_cre,c.user_upd FROM client c INNER JOIN bsgcod b on c.categorie_code=b.Code Code = :Code";
        $params = array(':Code' => $_GET['Code']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT c.Code,c.code_client,c.categorie_code,c.Raison_sociale,c.adresse,c.ville,c.famille,b.description,c.devise,c.adresse,c.contact,c.tell,c.email,c.user_cre,c.user_upd FROM client c INNER JOIN bsgcod b on c.categorie_code=b.Code;";
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
    $categorie_code = $_POST['categorie_code'];
    $devise = $_POST['devise'];
    $active = $_POST['active'];
    $contact = $_POST['contact'];
    $tell = $_POST['tell'];
    $email = $_POST['email'];
    $user_cre = $_POST['user_cre'];
    $date_gen = $_POST['date_gen'];
    

    try {
        $code_client = generate_code_client($categorie_code, $date_gen); // Or any other date
        // $code_client = generate_code_client($categorie_code);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
        header("HTTP/1.1 500 Internal Server Error");
        exit();
    }

    $query = "INSERT INTO client(code_client, Raison_sociale, adresse, ville, famille, categorie_code, devise, active, contact, tell, email, user_cre) 
              VALUES (:code_client, :Raison_sociale, :adresse, :ville, :famille, :categorie_code, :devise, :active, :contact, :tell, :email, :user_cre)";
    $queryAutoIncrement = "SELECT MAX(Code) as Code FROM client";
    $params = array(
        ':code_client' => $code_client,
        ':Raison_sociale' => $Raison_sociale, 
        ':adresse' => $adresse, 
        ':ville' => $ville, 
        ':famille' => $famille, 
        ':categorie_code' => $categorie_code, 
        ':devise' => $devise, 
        ':active' => $active, 
        ':contact' => $contact, 
        ':tell' => $tell, 
        ':email' => $email, 
        ':user_cre' => $user_cre
        // ':date_gen' => $date_gen
    );
    $result = metodPost($query, $queryAutoIncrement, $params,'client');
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
    $categorie_code = $_POST['categorie_code'];
    $devise = $_POST['devise'];
    $active = $_POST['active'];
    $contact = $_POST['contact'];
    $tell = $_POST['tell'];
    $email = $_POST['email'];
    $user_upd = $_POST['user_upd'];
    
    $query = "UPDATE client SET 
              Raison_sociale = :Raison_sociale, 
              adresse = :adresse, 
              ville = :ville, 
              famille = :famille, 
              categorie_code = :categorie_code, 
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
        ':categorie_code' => $categorie_code, 
        ':devise' => $devise, 
        ':active' => $active, 
        ':contact' => $contact, 
        ':tell' => $tell, 
        ':email' => $email, 
        ':user_upd' => $user_upd
    );
    $result = metodPut($query, $params,'client');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $Code = $_GET['Code'];
    $user_del = $_POST['user_del'];
    $query = "DELETE FROM client WHERE Code = :Code";
    $params = array(':Code' => $Code);
    $result = metodDelete($query, $params,'client');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");

?>