<?php
include 'bd/myData.php';
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['Code'])) {
        $query = "SELECT * FROM ACODNUM WHERE Code = :Code";
        $params = array(':Code' => $_GET['Code']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetch(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT * FROM ACODNUM";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $CODNUM = $_POST['CODNUM'];
    $DES = $_POST['DES'];
    $LNG = $_POST['LNG'];
    $NIVDEF = $_POST['NIVDEF'];
    $NIVRAZ = $_POST['NIVRAZ'];
    $POSCTE1 = $_POST['POSCTE1'];
    $POSCTE = $_POST['POSCTE'];
    $POSCTE2 = $_POST['POSCTE2'];
    $POSCTE3 = $_POST['POSCTE3'];
    $POSCTE4 = $_POST['POSCTE4'];
    $POSCTE5 = $_POST['POSCTE5'];
    $POSCTE6 = $_POST['POSCTE6'];
    $POSCTE7 = $_POST['POSCTE7'];
    $POSCTE8 = $_POST['POSCTE8'];
    $POSCTE9 = $_POST['POSCTE9'];
    $Formule = $_POST['Formule'];
    $POSTYP1 = $_POST['POSTYP1'];
    $POSTYP2 = $_POST['POSTYP2'];
    $POSTYP3 = $_POST['POSTYP3'];
    $POSTYP4 = $_POST['POSTYP4'];
    $POSTYP5 = $_POST['POSTYP5'];
    $POSTYP6 = $_POST['POSTYP6'];
    $POSTYP7 = $_POST['POSTYP7'];
    $POSTYP8 = $_POST['POSTYP8'];
    $POSTYP9 = $_POST['POSTYP9'];
    $VAL = $_POST['VAL'];
    // $SEQ = $_POST['SEQ'];
    $TYP = $_POST['TYP'];
    $user_cre = $_POST['user_cre'];
    $ZERO = $_POST['ZERO'];
    
    $query = "INSERT INTO ACODNUM(CODNUM, DES, LNG, NIVDEF, NIVRAZ,POSCTE, POSCTE1, POSCTE2, POSCTE3, POSCTE4, POSCTE5, 
              POSCTE6, POSCTE7, POSCTE8, POSCTE9, Formule, POSTYP1, POSTYP2, POSTYP3, POSTYP4, POSTYP5, 
              POSTYP6, POSTYP7, POSTYP8, POSTYP9, VAL, TYP, user_cre, ZERO) 
              VALUES (:CODNUM, :DES, :LNG, :NIVDEF, :NIVRAZ, :POSCTE,:POSCTE1, :POSCTE2, :POSCTE3, :POSCTE4, :POSCTE5, 
              :POSCTE6, :POSCTE7, :POSCTE8, :POSCTE9, :Formule, :POSTYP1, :POSTYP2, :POSTYP3, :POSTYP4, :POSTYP5, 
              :POSTYP6, :POSTYP7, :POSTYP8, :POSTYP9, :VAL, :TYP, :user_cre, :ZERO)";
    $params = array(':CODNUM' => $CODNUM, ':DES' => $DES, ':LNG' => $LNG, ':NIVDEF' => $NIVDEF, ':NIVRAZ' => $NIVRAZ,
                    ':POSCTE1' => $POSCTE1, ':POSCTE2' => $POSCTE2, ':POSCTE3' => $POSCTE3, ':POSCTE4' => $POSCTE4,
                    ':POSCTE5' => $POSCTE5, ':POSCTE6' => $POSCTE6, ':POSCTE7' => $POSCTE7, ':POSCTE8' => $POSCTE8,
                    ':POSCTE9' => $POSCTE9, ':Formule' => $Formule, ':POSTYP1' => $POSTYP1, ':POSTYP2' => $POSTYP2,
                    ':POSTYP3' => $POSTYP3, ':POSTYP4' => $POSTYP4, ':POSTYP5' => $POSTYP5, ':POSTYP6' => $POSTYP6,
                    ':POSTYP7' => $POSTYP7, ':POSTYP8' => $POSTYP8, ':POSTYP9' => $POSTYP9, ':VAL' => $VAL,
                    ':TYP' => $TYP, ':user_cre' => $user_cre, ':ZERO' => $ZERO ,':POSCTE' => $POSCTE,);
    $queryAutoIncrement = "SELECT MAX(Code) as Code FROM ACODNUM";
    $result = metodPost($query, $queryAutoIncrement, $params, 'ACODNUM');

    $newCODNUM = $result['CODNUM'];


    $PERIODE = null; // Set appropriate default or specific values
    $SITE = null; // Set appropriate default or specific values
    $VALEUR = null; // Set appropriate default or specific values
    $queryAutoIncrementavalnum = "SELECT MAX(Code) as Code FROM avalnum";

    $queryAvalnum = "INSERT INTO avalnum (CODNUM, PERIODE, SITE, VALEUR, user_cre) 
                     VALUES (:CODNUM, :PERIODE, :SITE, :VALEUR, :user_cre)";
    $paramsAvalnum = array(':CODNUM' => $newCODNUM, ':PERIODE' => $PERIODE, ':SITE' => $SITE, ':VALEUR' => $VALEUR, ':user_cre' => $user_cre);
    $resultAvalnum = metodPost($queryAvalnum, $queryAutoIncrementavalnum, $paramsAvalnum, 'avalnum');


    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $Code = $_GET['Code'];
    $CODNUM = $_POST['CODNUM'];
    $DES = $_POST['DES'];
    $LNG = $_POST['LNG'];
    $NIVDEF = $_POST['NIVDEF'];
    $NIVRAZ = $_POST['NIVRAZ'];
    $POSCTE1 = $_POST['POSCTE1'];
    $POSCTE2 = $_POST['POSCTE2'];
    $POSCTE3 = $_POST['POSCTE3'];
    $POSCTE4 = $_POST['POSCTE4'];
    $POSCTE5 = $_POST['POSCTE5'];
    $POSCTE6 = $_POST['POSCTE6'];
    $POSCTE7 = $_POST['POSCTE7'];
    $POSCTE8 = $_POST['POSCTE8'];
    $POSCTE9 = $_POST['POSCTE9'];
    $Formule = $_POST['Formule'];
    $POSTYP1 = $_POST['POSTYP1'];
    $POSTYP2 = $_POST['POSTYP2'];
    $POSTYP3 = $_POST['POSTYP3'];
    $POSTYP4 = $_POST['POSTYP4'];
    $POSTYP5 = $_POST['POSTYP5'];
    $POSTYP6 = $_POST['POSTYP6'];
    $POSTYP7 = $_POST['POSTYP7'];
    $POSTYP8 = $_POST['POSTYP8'];
    $POSTYP9 = $_POST['POSTYP9'];
    $VAL = $_POST['VAL'];
    $TYP = $_POST['TYP'];
    $user_upd = $_POST['user_upd'];
    $ZERO = $_POST['ZERO'];
    
    $query = "UPDATE ACODNUM SET CODNUM = :CODNUM, DES = :DES, LNG = :LNG, NIVDEF = :NIVDEF, NIVRAZ = :NIVRAZ, 
              POSCTE1 = :POSCTE1, POSCTE2 = :POSCTE2, POSCTE3 = :POSCTE3, POSCTE4 = :POSCTE4, POSCTE5 = :POSCTE5, 
              POSCTE6 = :POSCTE6, POSCTE7 = :POSCTE7, POSCTE8 = :POSCTE8, POSCTE9 = :POSCTE9, Formule = :Formule, 
              POSTYP1 = :POSTYP1, POSTYP2 = :POSTYP2, POSTYP3 = :POSTYP3, POSTYP4 = :POSTYP4, POSTYP5 = :POSTYP5, 
              POSTYP6 = :POSTYP6, POSTYP7 = :POSTYP7, POSTYP8 = :POSTYP8, POSTYP9 = :POSTYP9, VAL = :VAL, 
              TYP = :TYP, user_upd = :user_upd, ZERO = :ZERO 
              WHERE Code = :Code";
    $params = array(':Code' => $Code, ':CODNUM' => $CODNUM, ':DES' => $DES, ':LNG' => $LNG, ':NIVDEF' => $NIVDEF,
                    ':NIVRAZ' => $NIVRAZ, ':POSCTE1' => $POSCTE1, ':POSCTE2' => $POSCTE2, ':POSCTE3' => $POSCTE3,
                    ':POSCTE4' => $POSCTE4, ':POSCTE5' => $POSCTE5, ':POSCTE6' => $POSCTE6, ':POSCTE7' => $POSCTE7,
                    ':POSCTE8' => $POSCTE8, ':POSCTE9' => $POSCTE9, ':Formule' => $Formule, ':POSTYP1' => $POSTYP1,
                    ':POSTYP2' => $POSTYP2, ':POSTYP3' => $POSTYP3, ':POSTYP4' => $POSTYP4, ':POSTYP5' => $POSTYP5,
                    ':POSTYP6' => $POSTYP6, ':POSTYP7' => $POSTYP7, ':POSTYP8' => $POSTYP8, ':POSTYP9' => $POSTYP9,
                    ':VAL' => $VAL, ':TYP' => $TYP, ':user_upd' => $user_upd, ':ZERO' => $ZERO);
    $result = metodPut($query, $params, 'ACODNUM');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $Code = $_GET['Code'];

    try {
        // First query
        $query1 = "DELETE av FROM avalnum av JOIN ACODNUM a ON a.CODNUM = av.CODNUM WHERE a.Code = :Code";
        $query2 = "DELETE FROM ACODNUM WHERE Code = :Code";
        $params = array(':Code' => $Code);
        $result1 = metodDelete($query1, $params ,'avalnum');
        $result2 = metodDelete($query2, $params,'ACODNUM');


        // Second query
        


        // Combine the results of both queries
        $result = array('query1' => $result1, 'query2' => $result2);

        echo json_encode($result);
        header("HTTP/1.1 200 OK");
    } catch (Exception $e) {
        echo json_encode(array('error' => $e->getMessage()));
        header("HTTP/1.1 500 Internal Server Error");
    }
    exit();
}



header("HTTP/1.1 400 Bad Request");
?>