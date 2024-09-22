<?php
include 'bd/myData.php';
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $baseQuery = "SELECT 
    f.Code,
    f.BPSNUM,  
    f.ACCCOD,    
    f.BPAADD,   
    f.BPAINV,   
    f.BPAPAY,   
    f.BPRPAY,   
    f.BPSGRU,   
    f.BPSINV,   
    f.BPSNAM,   
    f.BPSREM,   
    f.BPSRSK,   
    f.BPSSHO,   
    f.CNTNAM,  
    f.EECICT,  
    f.IDTSGL,  
    f.MDL,     
    f.OSTAUZAMT,
    f.ENAFLG,
    f.MNAUTO,   
    f.PAYBAN,        
    f.UPDDAT,  
    f.user_cre, 
    f.user_upd, 
    f.CREDAT,   
    a.description AS ABCCLS,
    bt.description AS BPSTYP,
    bn.Raison_sociale AS BPTNUM,
    b.description AS BSGCOD,
    c.description AS CHGTYP,
    cur.description AS CUR,
    o.description AS OSTCTL,
    p.description AS PAYLOKFLG,
    t1.description AS TSSCOD1,
    t2.description AS TSSCOD2,
    t3.description AS TSSCOD3,
    v.description AS VACBPR,
    pte.description AS PTE,
    b.description
    
FROM Fournisseur f
LEFT JOIN ABCCLS a ON f.ABCCLS = a.Code
LEFT JOIN BPSTYP bt ON f.BPSTYP = bt.Code
LEFT JOIN bptnum bn ON f.BPTNUM = bn.Code
LEFT JOIN BSGCOD b ON f.BSGCOD = b.Code
LEFT JOIN CHGTYP c ON f.CHGTYP = c.Code
LEFT JOIN CUR cur ON f.CUR = cur.Code
LEFT JOIN OSTCTL o ON f.OSTCTL = o.Code
LEFT JOIN PAYLOKFLG p ON f.PAYLOKFLG = p.Code
LEFT JOIN TSSCOD1 t1 ON f.TSSCOD1 = t1.Code
LEFT JOIN TSSCOD2 t2 ON f.TSSCOD2 = t2.Code
LEFT JOIN TSSCOD3 t3 ON f.TSSCOD3 = t3.Code
LEFT JOIN VACBPR v ON f.VACBPR = v.Code
LEFT JOIN PTE pte ON f.PTE = pte.Code
";


    if (isset($_GET['Code'])) {
        $query = $baseQuery . " WHERE f.Code = :Code";
        $params = array(':Code' => $_GET['Code']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $result = metodGet($baseQuery);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    // $BPSNUM = $_POST['BPSNUM'];
    $ABCCLS = $_POST['ABCCLS'];
    $ACCCOD = $_POST['ACCCOD'];
    $BPAADD = $_POST['BPAADD'];
    $BPAINV = $_POST['BPAINV'];
    $BPAPAY = $_POST['BPAPAY'];
    $BPRPAY = $_POST['BPRPAY'];
    $BPSGRU = $_POST['BPSGRU'];
    $BPSINV = $_POST['BPSINV'];
    $BPSNAM = $_POST['BPSNAM'];
    $BPSREM = $_POST['BPSREM'];
    $BPSRSK = $_POST['BPSRSK'];
    $BPSSHO = $_POST['BPSSHO'];
    $BPSTYP = $_POST['BPSTYP'];
    $BPTNUM = $_POST['BPTNUM'];
    $BSGCOD = $_POST['BSGCOD'];
    $CHGTYP = $_POST['CHGTYP'];
    $CNTNAM = $_POST['CNTNAM'];
    $CUR = $_POST['CUR'];
    $EECICT = $_POST['EECICT'];
    $ENAFLG = $_POST['ENAFLG'];
    $IDTSGL = $_POST['IDTSGL'];
    $MDL = $_POST['MDL'];
    $OSTAUZAMT = $_POST['OSTAUZAMT'];
    $OSTCTL = $_POST['OSTCTL'];
    $MNAUTO = $_POST['MNAUTO'];
    $PAYBAN = $_POST['PAYBAN'];
    $PAYLOKFLG = $_POST['PAYLOKFLG'];
    $PTE = $_POST['PTE'];
    $TSSCOD1 = $_POST['TSSCOD1'];
    $TSSCOD2 = $_POST['TSSCOD2'];
    $TSSCOD3 = $_POST['TSSCOD3'];
    $VACBPR = $_POST['VACBPR'];
    $user_cre = $_POST['user_cre'];
    
    try {
        $BPSNUM = generate_code_client($BSGCOD);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
        header("HTTP/1.1 500 Internal Server Error");
        exit();
    }


    $query = "INSERT INTO Fournisseur(BPSNUM, ABCCLS,ACCCOD , BPAADD, BPAINV, BPAPAY, BPRPAY, BPSGRU, BPSINV, BPSNAM, BPSREM, BPSRSK, BPSSHO, BPSTYP, BPTNUM, BSGCOD, CHGTYP, CNTNAM,  CUR, EECICT, ENAFLG, IDTSGL, MDL, OSTAUZAMT, OSTCTL, MNAUTO, PAYBAN, PAYLOKFLG, PTE, TSSCOD1, TSSCOD2, TSSCOD3, VACBPR, user_cre) 
              VALUES (:BPSNUM, :ABCCLS, :ACCCOD, :BPAADD, :BPAINV, :BPAPAY, :BPRPAY, :BPSGRU, :BPSINV, :BPSNAM, :BPSREM, :BPSRSK, :BPSSHO, :BPSTYP, :BPTNUM, :BSGCOD, :CHGTYP, :CNTNAM,   :CUR, :EECICT, :ENAFLG, :IDTSGL, :MDL, :OSTAUZAMT, :OSTCTL, :MNAUTO, :PAYBAN, :PAYLOKFLG, :PTE, :TSSCOD1, :TSSCOD2, :TSSCOD3, :VACBPR, :user_cre)";
    
    $params = array(
        ':BPSNUM' => $BPSNUM, ':ABCCLS' => $ABCCLS, ':ACCCOD' => $ACCCOD, ':BPAADD' => $BPAADD, 
        ':BPAINV' => $BPAINV, ':BPAPAY' => $BPAPAY, ':BPRPAY' => $BPRPAY, ':BPSGRU' => $BPSGRU, 
        ':BPSINV' => $BPSINV, ':BPSNAM' => $BPSNAM, ':BPSREM' => $BPSREM, 
        ':BPSRSK' => $BPSRSK, ':BPSSHO' => $BPSSHO, ':BPSTYP' => $BPSTYP, ':BPTNUM' => $BPTNUM,
         ':BSGCOD' => $BSGCOD, ':CHGTYP' => $CHGTYP, ':CNTNAM' => $CNTNAM,  ':CUR' => $CUR,
          ':EECICT' => $EECICT, ':ENAFLG' => $ENAFLG, ':IDTSGL' => $IDTSGL, ':MDL' => $MDL,
           ':OSTAUZAMT' => $OSTAUZAMT, ':OSTCTL' => $OSTCTL, ':MNAUTO' => $MNAUTO,
            ':PAYBAN' => $PAYBAN, ':PAYLOKFLG' => $PAYLOKFLG, ':PTE' => $PTE, 
            ':TSSCOD1' => $TSSCOD1, ':TSSCOD2' => $TSSCOD2, ':TSSCOD3' => $TSSCOD3,
             ':VACBPR' => $VACBPR, ':user_cre' => $user_cre
    );
    $queryAutoIncrement = "SELECT MAX(Code) as Code FROM Fournisseur";

    
    $result = metodPost($query, $queryAutoIncrement, $params, 'Fournisseur');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $Code = $_GET['Code'];
    // $BPSNUM = $_POST['BPSNUM'];
    $ABCCLS = $_POST['ABCCLS'];
    $ACCCOD = $_POST['ACCCOD'];
    $BPAADD = $_POST['BPAADD'];
    $BPAINV = $_POST['BPAINV'];
    $BPAPAY = $_POST['BPAPAY'];
    $BPRPAY = $_POST['BPRPAY'];
    $BPSGRU = $_POST['BPSGRU'];
    $BPSINV = $_POST['BPSINV'];
    $BPSNAM = $_POST['BPSNAM'];
    $BPSREM = $_POST['BPSREM'];
    $BPSRSK = $_POST['BPSRSK'];
    $BPSSHO = $_POST['BPSSHO'];
    $BPSTYP = $_POST['BPSTYP'];
    $BPTNUM = $_POST['BPTNUM'];
    // $BSGCOD = $_POST['BSGCOD'];
    $CHGTYP = $_POST['CHGTYP'];
    $CNTNAM = $_POST['CNTNAM'];
    $CUR = $_POST['CUR'];
    $EECICT = $_POST['EECICT'];
    $ENAFLG = $_POST['ENAFLG'];
    $IDTSGL = $_POST['IDTSGL'];
    $MDL = $_POST['MDL'];
    $OSTAUZAMT = $_POST['OSTAUZAMT'];
    $OSTCTL = $_POST['OSTCTL'];
    $MNAUTO = $_POST['MNAUTO'];
    $PAYBAN = $_POST['PAYBAN'];
    $PAYLOKFLG = $_POST['PAYLOKFLG'];
    $PTE = $_POST['PTE'];
    $TSSCOD1 = $_POST['TSSCOD1'];
    $TSSCOD2 = $_POST['TSSCOD2'];
    $TSSCOD3 = $_POST['TSSCOD3'];
    $VACBPR = $_POST['VACBPR'];
    $user_upd = $_POST['user_upd'];



    $query = "UPDATE Fournisseur SET 
              ABCCLS = :ABCCLS, ACCCOD = :ACCCOD, BPAADD = :BPAADD, BPAINV = :BPAINV, BPAPAY = :BPAPAY, 
              BPRPAY = :BPRPAY, BPSGRU = :BPSGRU, BPSINV = :BPSINV, BPSNAM = :BPSNAM, BPSREM = :BPSREM, 
              BPSRSK = :BPSRSK, BPSSHO = :BPSSHO, BPSTYP = :BPSTYP, BPTNUM = :BPTNUM, 
              CHGTYP = :CHGTYP, CNTNAM = :CNTNAM, CUR = :CUR, EECICT = :EECICT, ENAFLG = :ENAFLG, 
              IDTSGL = :IDTSGL, MDL = :MDL, OSTAUZAMT = :OSTAUZAMT, OSTCTL = :OSTCTL, MNAUTO = :MNAUTO, 
              PAYBAN = :PAYBAN, PAYLOKFLG = :PAYLOKFLG, PTE = :PTE, TSSCOD1 = :TSSCOD1, TSSCOD2 = :TSSCOD2, 
              TSSCOD3 = :TSSCOD3, VACBPR = :VACBPR, 
              UPDDAT = CURRENT_TIMESTAMP,
              user_upd = :user_upd 

              WHERE Code = :Code";
    
    $params = array(
        ':Code' => $Code, ':ABCCLS' => $ABCCLS, ':ACCCOD' => $ACCCOD, ':BPAADD' => $BPAADD, ':BPAINV' => $BPAINV, 
        ':BPAPAY' => $BPAPAY, ':BPRPAY' => $BPRPAY, ':BPSGRU' => $BPSGRU, ':BPSINV' => $BPSINV, ':BPSNAM' => $BPSNAM, 
        ':BPSREM' => $BPSREM, ':BPSRSK' => $BPSRSK, ':BPSSHO' => $BPSSHO, ':BPSTYP' => $BPSTYP, ':BPTNUM' => $BPTNUM, 
       ':CHGTYP' => $CHGTYP, ':CNTNAM' => $CNTNAM, ':CUR' => $CUR, ':EECICT' => $EECICT, 
        ':ENAFLG' => $ENAFLG, ':IDTSGL' => $IDTSGL, ':MDL' => $MDL, ':OSTAUZAMT' => $OSTAUZAMT, ':OSTCTL' => $OSTCTL, 
        ':MNAUTO' => $MNAUTO, ':PAYBAN' => $PAYBAN, ':PAYLOKFLG' => $PAYLOKFLG, ':PTE' => $PTE, ':TSSCOD1' => $TSSCOD1, 
        ':TSSCOD2' => $TSSCOD2, ':TSSCOD3' => $TSSCOD3, ':VACBPR' => $VACBPR,':user_upd' => $user_upd
    );
    
    $result = metodPut($query, $params, 'Fournisseur');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $Code = $_GET['Code'];
    
    $query = "DELETE FROM Fournisseur WHERE Code = :Code";
    $params = array(':Code' => $Code);
    $result = metodDelete($query, $params, 'Fournisseur');
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");
?>