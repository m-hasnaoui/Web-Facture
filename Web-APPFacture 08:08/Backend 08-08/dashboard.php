<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {


    // if (isset($_GET['deposit'])) {
    //     $query = "SELECT * FROM deposits ";
    //     $result = metodGet($query);

    //     if ($result->rowCount() > 0) {
    //         echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    //     } else {
    //         echo json_encode([]);
    //     }
    // }

    if (isset($_GET['profile'])) {
        $query = "SELECT * FROM profiles ORDER BY profile;";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    // if (isset($_GET['unite'])) {
    //     $query = "SELECT * FROM unites ORDER BY unite;";
    //     $result = metodGet($query);
        
    //     if ($result->rowCount() > 0) {
    //         echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    //     } else {
    //         echo json_encode([]);
    //     }
    // }

//     if (isset($_GET['statut'])) {
//         $query = "SELECT * FROM statut ORDER BY statut;";
//         $result = metodGet($query);
        
//         if ($result->rowCount() > 0) {
//             echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
//         } else {
//             echo json_encode([]);
//         }
//     }

    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    // if(isset($_GET['deposit'])) {
    //     $deposit = $_POST['deposit'];
    //     $query = "INSERT INTO deposits(deposit) VALUES (:deposit)";
    //     $queryOrdered = "SELECT * FROM deposits GROUP BY deposit";
    //     $params = array(':deposit' => $deposit);
    //     $result = metodPost($query, $queryOrdered, $params);
    //     echo json_encode($result);
    // }

    if(isset($_GET['profile'])) {
        $profile = $_POST['profile'];
        $query = "INSERT INTO profiles(profile) VALUES (:profile);";
        $queryOrdered = "SELECT * FROM profiles GROUP BY profile";
        $params = array(':profile' => $profile);
        $result = metodPost($query, $queryOrdered, $params);
        echo json_encode($result);
    }

    // if(isset($_GET['unite'])) {
    //     $unite = $_POST['unite'];
    //     $query = "INSERT INTO unites(unite) VALUES (:unite)";
    //     $queryOrdered = "SELECT * FROM unites GROUP BY unite";
    //     $params = array(':unite' => $unite);
    //     $result = metodPost($query, $queryOrdered, $params);
    //     echo json_encode($result);
    // }

    // if(isset($_GET['statut'])) {
    //     $statut = $_POST['statut'];
    //     $query = "INSERT INTO statut(statut) VALUES (:statut)";
    //     $queryOrdered = "SELECT * FROM statuts GROUP BY statut";
    //     $params = array(':statut' => $statut);
    //     $result = metodPost($query, $queryOrdered, $params);
    //     echo json_encode($result);
    // }
    // header("HTTP/1.1 200 OK");
    // exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    // if(isset($_GET['deposit'])) {
    //     $deposit = $_GET['deposit'];
    //     $query = "DELETE FROM deposits WHERE deposit = :deposit";
    //     $params = array(':deposit' => $deposit);
    //     $result = metodDelete($query, $params);
    //     echo json_encode($result);
    // }

    if(isset($_GET['profile'])) {
        $profile = $_GET['profile'];
        $query = "DELETE FROM profile WHERE profile = :profile; DELETE FROM profiles WHERE profile = :profile;";
        $params = array(':profile' => $profile);
        $result = metodDelete($query, $params);
        echo json_encode($result);
    }

    // if(isset($_GET['unite'])) {
    //     $unite = $_GET['unite'];
    //     $query = "DELETE FROM unites WHERE unite = :unite";
    //     $params = array(':unite' => $unite);
    //     $result = metodDelete($query, $params);
    //     echo json_encode($result);
    // }

    // if(isset($_GET['statut'])) {
    //     $statut = $_GET['statut'];
    //     $query = "DELETE FROM statut WHERE statut = :statut";
    //     $params = array(':statut' => $statut);
    //     $result = metodDelete($query, $params);
    //     echo json_encode($result);
    // }
    header("HTTP/1.1 200 OK");
    exit();
}

// header("HTTP/1.1 400 Bad Request");
?>
