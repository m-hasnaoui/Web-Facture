<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

// Handle GET requests
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['Code_art'])) {
        $query = "SELECT a.*,b.description FROM article a  INNER JOIN bsgcod b on a.categorie_code=b.Code WHERE Code_art = :Code_art";
        $params = array(':Code_art' => $_GET['Code_art']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT a.*,b.description FROM article a  INNER JOIN bsgcod b on a.categorie_code=b.Code";
        $result = metodGet($query);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    }
  
    exit();
}

// Handle POST requests
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ($_POST['METHOD'] == 'POST') {
        unset($_POST['METHOD']);
        $designation = $_POST['designation'];
        $categorie_code = $_POST['categorie_code'];
        $tax = $_POST['tax'];
        $gere_en_stock = $_POST['gere_en_stock'];
        $gere_par_lot = $_POST['gere_par_lot'];
        $unite_de_vente = $_POST['unite_de_vente'];
        $unite_d_achat = $_POST['unite_d_achat'];
        $conversion_stock = $_POST['conversion_stock'];
        $conversion_stock_2 = $_POST['conversion_stock_2'];
        $user_cre = $_POST['user_cre'];

        $query = "INSERT INTO article (designation,categorie_code, tax, gere_en_stock, gere_par_lot, unite_de_vente, unite_d_achat, conversion_stock, conversion_stock_2, user_cre) VALUES (:designation,:categorie_code, :tax, :gere_en_stock, :gere_par_lot, :unite_de_vente, :unite_d_achat, :conversion_stock, :conversion_stock_2, :user_cre)";
        $queryAutoIncrement = "SELECT MAX(Code_art) as Code_art FROM article";
        $params = array(
            ':designation' => $designation,
            ':tax' => $tax,
            ':categorie_code' => $categorie_code,
            ':gere_en_stock' => $gere_en_stock,
            ':gere_par_lot' => $gere_par_lot,
            ':unite_de_vente' => $unite_de_vente,
            ':unite_d_achat' => $unite_d_achat,
            ':conversion_stock' => $conversion_stock,
            ':conversion_stock_2' => $conversion_stock_2,
            ':user_cre' => $user_cre
        );
        $result = metodPost($query, $queryAutoIncrement, $params, 'article');
        echo json_encode($result);
        header("HTTP/1.1 200 OK");
        exit();
    }
}

// Handle PUT requests
if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $Code_art = $_GET['Code_art'];
    $designation = $_POST['designation'];
    $tax = $_POST['tax'];
    $gere_en_stock = $_POST['gere_en_stock'];
    $gere_par_lot = $_POST['gere_par_lot'];
    $unite_de_vente = $_POST['unite_de_vente'];
    $unite_d_achat = $_POST['unite_d_achat'];
    $conversion_stock = $_POST['conversion_stock'];
    $conversion_stock_2 = $_POST['conversion_stock_2'];
    $user_upd = $_POST['user_upd'];

    $query = "UPDATE article SET designation = :designation, tax = :tax, gere_en_stock = :gere_en_stock, gere_par_lot = :gere_par_lot, 
              unite_de_vente = :unite_de_vente, unite_d_achat = :unite_d_achat, conversion_stock = :conversion_stock, 
              conversion_stock_2 = :conversion_stock_2, user_upd = :user_upd WHERE Code_art = :Code_art";
    $params = array(
        ':Code_art' => $Code_art,
        ':designation' => $designation,
        ':tax' => $tax,
        ':gere_en_stock' => $gere_en_stock,
        ':gere_par_lot' => $gere_par_lot,
        ':unite_de_vente' => $unite_de_vente,
        ':unite_d_achat' => $unite_d_achat,
        ':conversion_stock' => $conversion_stock,
        ':conversion_stock_2' => $conversion_stock_2,
        ':user_upd' => $user_upd
    );
    $result = metodPut($query, $params, 'article');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}


// Handle DELETE requests
if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $Code_art = $_GET['Code_art'];
    $user_del = $_POST['user_del']; 
    $query = "DELETE FROM article WHERE Code_art = :Code_art";
    $params = array(':Code_art' => $Code_art);
    $result = metodDelete($query, $params, 'article');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}


// Handle invalid request methods
header("HTTP/1.1 400 Bad Request");

?>
