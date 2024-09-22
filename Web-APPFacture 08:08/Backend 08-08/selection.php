<?php
include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
   
    if (isset($_GET['user'])) {
        $query = "SELECT * FROM users;";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['profile'])) {
        $query = "SELECT * FROM profiles;";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['idUser']) && isset($_GET['visibility'])) {
        $query = "SELECT p.page, p.visibility FROM profile p JOIN users u ON p.profile = u.profile WHERE u.idUser = :idUser;";
        $params = array(':idUser' => $_GET['idUser']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    }

    if (isset($_GET['pages']) && isset($_GET['profileV2'])) {
        $query = "SELECT page FROM pages WHERE page NOT IN (SELECT page FROM profile WHERE profile = :profile);";
        $params = array(':profile' => $_GET['profileV2']);
        $result = metodGet($query, $params);
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['description'])) {
        $query = "SELECT c.description,c.Code FROM bsgcod c where tier=:tier;";
        $params = array(':tier' => $_GET['description']);
        $result = metodGet($query, $params);


        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    if (isset($_GET['category_codnum'])) {
        $query = "SELECT CODNUM,Code FROM ACODNUM;";
        $result = metodGet($query);

        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    if (isset($_GET['abccls'])) {
        $query = "SELECT Code,description FROM abccls;";
        $result = metodGet($query);

        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    
    // header("HTTP/1.1 200 OK");
    exit();
}

?>
