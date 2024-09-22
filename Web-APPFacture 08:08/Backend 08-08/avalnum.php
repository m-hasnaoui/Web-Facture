<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

// if ($_SERVER['REQUEST_METHOD'] == 'GET') {
//     if (isset($_GET['CODNUM'])) {
//         $query = "SELECT av.Code,av.CODNUM,av.SITE,a.VAL,av.PERIODE FROM `avalnum` av  JOIN ACODNUM a on av.CODNUM=a.CODNUM WHERE CODNUM = :CODNUM";
//         $params = array(':CODNUM' => $_GET['CODNUM']);
//         $result = metodGet($query, $params);
//         echo json_encode($result->fetch(PDO::FETCH_ASSOC));
//     } else {
//         $query = "SELECT a.CODNUM, CONCAT_WS('/', NULLIF(a.POSCTE, ''), NULLIF(a.POSCTE1, ''), NULLIF(a.POSCTE2, ''), NULLIF(a.POSCTE3, ''), NULLIF(a.POSCTE4, ''), NULLIF(a.POSCTE5, ''), NULLIF(a.POSCTE6, ''), NULLIF(a.POSCTE7, ''), NULLIF(a.POSCTE8, ''), NULLIF(a.POSCTE9, '') ) AS Composant, a.VAL AS Valeur, CASE WHEN av.PERIODE IS NOT NULL THEN DATE_FORMAT(av.PERIODE, '%d/%m/%Y') ELSE 'null' END AS Period FROM ACODNUM a LEFT JOIN AVALNUM av ON a.CODNUM = av.CODNUM;";
//         $result = metodGet($query);
//         echo json_encode($result->fetchAll());
//     }
//     header("HTTP/1.1 200 OK");
//     exit();
// }
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['CODNUM'])) {
        $query = "SELECT * FROM avalnum WHERE CODNUM = :CODNUM";
        $params = array(':CODNUM' => $_GET['CODNUM']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetch(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT * FROM avalnum";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $CODNUM = $_POST['CODNUM'];
    $COMP = $_POST['COMP'];
    $PERIODE = $_POST['PERIODE'];
    $SITE = $_POST['SITE'];
    $VALEUR = $_POST['VALEUR'];
    $user_cre = $_POST['user_cre'];
    
    $query = "INSERT INTO avalnum(CODNUM, COMP, PERIODE, SITE, VALEUR, user_cre, date_cre) VALUES (:CODNUM, :COMP, :PERIODE, :SITE, :VALEUR, :user_cre, NOW())";
    $params = array(':CODNUM' => $CODNUM, ':COMP' => $COMP, ':PERIODE' => $PERIODE, ':SITE' => $SITE, ':VALEUR' => $VALEUR, ':user_cre' => $user_cre);
    $queryAutoIncrement = "SELECT MAX(CODNUM) as CODNUM FROM avalnum";
    $result = metodPost($query, $queryAutoIncrement, $params, 'avalnum');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $CODNUM = $_GET['CODNUM'];
    $COMP = $_POST['COMP'];
    $PERIODE = $_POST['PERIODE'];
    $SITE = $_POST['SITE'];
    $VALEUR = $_POST['VALEUR'];
    $user_upd = $_POST['user_upd'];

    $query = "UPDATE avalnum SET COMP = :COMP, PERIODE = :PERIODE, SITE = :SITE, VALEUR = :VALEUR, user_upd = :user_upd, date_upd = NOW() WHERE CODNUM = :CODNUM";
    $params = array(':CODNUM' => $CODNUM, ':COMP' => $COMP, ':PERIODE' => $PERIODE, ':SITE' => $SITE, ':VALEUR' => $VALEUR, ':user_upd' => $user_upd);
    $result = metodPut($query, $params, 'avalnum');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $CODNUM = $_GET['CODNUM'];
    $query = "DELETE FROM avalnum WHERE CODNUM = :CODNUM";
    $params = array(':CODNUM' => $CODNUM);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");
?>