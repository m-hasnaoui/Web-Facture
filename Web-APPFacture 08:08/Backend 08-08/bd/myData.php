<?php
$pdo=null;
$host="";
$user="";
$pass="";
$bd="";

function connect()
{
    global $pdo, $host, $user, $pass, $bd;
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$bd", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        die("Error!: Cannot connect to database $bd<br/>Error!: " . $e->getMessage() . "<br/>");
    }
}

function disconnect()
{
    global $pdo;
    $pdo = null;
}

function metodGet($query, $params = array())
{
    try {
        connect();
        global $pdo;
        $statement = $pdo->prepare($query);
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->execute($params);
        return $statement;
    } catch (Exception $e) {
        die("Error: " . $e->getMessage());
    }
}

function metodPost($query, $queryAutoIncrement, $params, $tablename)
{
    try {
        connect();
        global $pdo;
        $statement = $pdo->prepare($query);
        $statement->execute($params);

        $idAutoIncrement = metodGet($queryAutoIncrement)->fetch(PDO::FETCH_ASSOC);
        $result = array_merge($idAutoIncrement, $_POST);

        $user_cre = $_POST['user_cre'];
        logMovement($user_cre, 'INSERT', $tablename);

        $statement->closeCursor();
        disconnect();
        return $result;
    } catch (Exception $e) {
        die("Error POST: " . $e->getMessage());
    }
}

function metodPut($query, $params, $tablename)
{
    try {
        connect();
        global $pdo;
        $statement = $pdo->prepare($query);
        $success = $statement->execute($params);

        $user_upd = $_POST['user_upd'] ?? 'system';
        logMovement($user_upd, 'UPDATE', $tablename);

        $statement->closeCursor();
        disconnect();

        return $success;
    } catch (Exception $e) {
        die("Error: " . $e->getMessage());
    }
}

function metodDelete($query, $params, $tablename)
{
    try {
        connect();
        global $pdo;
        $statement = $pdo->prepare($query);
        $statement->execute($params);

        $user_del = $_POST['user_del'] ?? 'system';
        logMovement($user_del, 'DELETE', $tablename);

        $statement->closeCursor();
        disconnect();
        return true;
    } catch (Exception $e) {
        die("Error: " . $e->getMessage());
    }
}

function logMovement($user, $type, $tablename)
{
    try {
        connect();
        global $pdo;
        $query = "INSERT INTO mouvement_historique (user, type, credat, iptdate, tablename) 
                  VALUES (:user, :type, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, :tablename)";
        $params = array(
            ':user' => $user,
            ':type' => $type,
            ':tablename' => $tablename
        );
        $statement = $pdo->prepare($query);
        $statement->execute($params);
        $statement->closeCursor();
        disconnect();
    } catch (Exception $e) {
        die("Error: " . $e->getMessage());
    }
}

function generate_code_client($categorie_code, $date = null)
{
    try {
        connect();
        global $pdo;

        $date = $date ? new DateTime($date) : new DateTime();

        $bsgcod_query = "SELECT CODNUM FROM bsgcod WHERE Code = :categorie_code";
        $bsgcod_stmt = $pdo->prepare($bsgcod_query);
        $bsgcod_stmt->execute([':categorie_code' => $categorie_code]);
        $bsgcod_result = $bsgcod_stmt->fetch(PDO::FETCH_ASSOC);

        if (!$bsgcod_result) {
            throw new Exception("Invalid categorie_code");
        }

        $codnum = $bsgcod_result['CODNUM'];

        $acodnum_query = "SELECT a.*, s.description as societe_description
                          FROM ACODNUM a 
                          LEFT JOIN Societes s ON s.Code = 1 
                          WHERE a.CODNUM = :codnum";
        $acodnum_stmt = $pdo->prepare($acodnum_query);
        $acodnum_stmt->execute([':codnum' => $codnum]);
        $acodnum_result = $acodnum_stmt->fetch(PDO::FETCH_ASSOC);

        if (!$acodnum_result) {
            throw new Exception("No matching ACODNUM entry");
        }

        $formule = $acodnum_result['Formule'];
        $val = $acodnum_result['VAL'];
        $typ = $acodnum_result['TYP'];
        $societe_description = $acodnum_result['societe_description'];
        $nivraz = $acodnum_result['NIVRAZ'];

        // Adjust the query based on NIVRAZ
        if ($nivraz === "Mensuel") {
            $avalnum_query = "SELECT Value, PERIODE FROM avalnum 
                              WHERE CODNUM = :codnum 
                              AND YEAR(PERIODE) = :year 
                              AND MONTH(PERIODE) = :month 
                              ORDER BY PERIODE DESC, Code DESC LIMIT 1";
            $params = [
                ':codnum' => $codnum,
                ':year' => $date->format('Y'),
                ':month' => $date->format('m')
            ];
        } elseif ($nivraz === "Annuel") {
            $avalnum_query = "SELECT Value, PERIODE FROM avalnum 
                              WHERE CODNUM = :codnum 
                              AND YEAR(PERIODE) = :year 
                              ORDER BY PERIODE DESC, Code DESC LIMIT 1";
            $params = [
                ':codnum' => $codnum,
                ':year' => $date->format('Y')
            ];
        } else {
            // Default case: fetch the latest entry regardless of date
            $avalnum_query = "SELECT Value, PERIODE FROM avalnum 
                              WHERE CODNUM = :codnum 
                              ORDER BY PERIODE DESC, Code DESC LIMIT 1";
            $params = [':codnum' => $codnum];
        }

        $avalnum_stmt = $pdo->prepare($avalnum_query);
        $avalnum_stmt->execute($params);
        $avalnum_result = $avalnum_stmt->fetch(PDO::FETCH_ASSOC);

        if ($avalnum_result) {
            $last_periode = new DateTime($avalnum_result['PERIODE']);
            $last_value = $avalnum_result['Value'];

            if ($nivraz === "Mensuel") {
                if ($date->format('Y-m') === $last_periode->format('Y-m')) {
                    $val = $last_value + 1;
                } else {
                    $val = 1;
                }
            } elseif ($nivraz === "Annuel") {
                if ($date->format('Y') === $last_periode->format('Y')) {
                    $val = $last_value + 1;
                } else {
                    $val = 1;
                }
            } else {
                // Default behavior (e.g., for daily or other intervals)
                $val = $last_value + 1;
            }
        } else {
            $val = 1;
        }

        $code_client = '';

        if ($typ === "Numerique") {
            if (!is_null($val) && $val !== '' && $val != 0) {
                $code_client = str_pad(min((int)$val, 99999), 6, '0', STR_PAD_LEFT);
            } else {
                throw new Exception("VAL is required when TYP is Numerique");
            }
        } else {
            $components = [];

            $year_length = !is_null($acodnum_result['POSTYP1']) && is_numeric($acodnum_result['POSTYP1']) ? intval($acodnum_result['POSTYP1']) : 4;
            $month_length = !is_null($acodnum_result['POSTYP2']) && is_numeric($acodnum_result['POSTYP2']) ? intval($acodnum_result['POSTYP2']) : 2;
            $day_length = !is_null($acodnum_result['POSTYP3']) && is_numeric($acodnum_result['POSTYP3']) ? intval($acodnum_result['POSTYP3']) : 2;
            $sequence_length = !is_null($acodnum_result['POSTYP5']) && is_numeric($acodnum_result['POSTYP5']) ? intval($acodnum_result['POSTYP5']) : 6;

            for ($i = 0; $i <= 4; $i++) {
                $poscte = $acodnum_result["POSCTE" . ($i ?: '')];

                if (!is_null($poscte)) {
                    switch ($poscte) {
                        case 'Année':
                            $components[$i] = substr($date->format('Y'), -$year_length);
                            break;
                        case 'Mois':
                            $components[$i] = substr($date->format('m'), -$month_length);
                            break;
                        case 'Jour':
                            $components[$i] = substr($date->format('d'), -$day_length);
                            break;
                        case 'Constante':
                            $components[$i] = $formule;
                            break;
                        case 'Société':
                            if (!is_null($societe_description)) {
                                $societe_length = !is_null($acodnum_result['POSTYP4']) && is_numeric($acodnum_result['POSTYP4']) ? intval($acodnum_result['POSTYP4']) : strlen($societe_description);
                                $components[$i] = substr($societe_description, 0, $societe_length);
                            }
                            break;
                        case 'Séquence':
                            $components[$i] = str_pad($val, $sequence_length, '0', STR_PAD_LEFT);
                            break;
                        default:
                            break;
                    }
                }
            }

            $code_client = implode('', $components);
        }

        if (empty($code_client)) {
            throw new Exception("Unable to generate Code_Client: No valid values");
        }

        $lng = strlen($code_client);

        // Update ACODNUM
        $update_query = "UPDATE ACODNUM SET VAL = :new_val, LNG = :lng, LastResetDate = :date WHERE CODNUM = :codnum";
        $update_stmt = $pdo->prepare($update_query);
        $update_stmt->execute([
            ':new_val' => $val,
            ':lng' => $lng,
            ':date' => $date->format('Y-m-d H:i:s'),
            ':codnum' => $codnum
        ]);

        // Update or insert into avalnum
        if ($avalnum_result) {
            update_avalnum($codnum, $societe_description, $val, $date->format('Y-m-d'));
        } else {
            insert_avalnum($codnum, $societe_description, $val, $date->format('Y-m-d'));
        }

        disconnect();
        return $code_client;
    } catch (Exception $e) {
        disconnect();
        error_log("Error generating Code_Client: " . $e->getMessage());
        throw new Exception("Error generating Code_Client. Please check the server logs for more details.");
    }
}

function update_avalnum($codnum, $site, $val, $periode) {
    try {
        global $pdo;
        
        $update_query = "UPDATE avalnum SET Value = :val, date_upd = CURRENT_TIMESTAMP, user_upd = 'system' 
                         WHERE CODNUM = :codnum AND YEAR(PERIODE) = YEAR(:periode) AND SITE = :site";
        $update_stmt = $pdo->prepare($update_query);
        $update_stmt->execute([
            ':val' => $val,
            ':codnum' => $codnum,
            ':periode' => $periode,
            ':site' => $site
        ]);
        
        // If no rows were updated, insert a new record
        if ($update_stmt->rowCount() == 0) {
            insert_avalnum($codnum, $site, $val, $periode);
        }
    } catch (Exception $e) {
        error_log("Error updating avalnum: " . $e->getMessage());
        throw new Exception("Error updating avalnum. Please check the server logs for more details.");
    }
}

function insert_avalnum($codnum, $site, $val, $periode) {
    try {
        global $pdo;
        
        $insert_query = "INSERT INTO avalnum (CODNUM, PERIODE, SITE, Value, user_cre, date_cre) 
                         VALUES (:codnum, :periode, :site, :val, 'system', CURRENT_TIMESTAMP)";
        $insert_stmt = $pdo->prepare($insert_query);
        $insert_stmt->execute([
            ':codnum' => $codnum,
            ':periode' => $periode,
            ':site' => $site,
            ':val' => $val
        ]);
    } catch (Exception $e) {
        error_log("Error inserting into avalnum: " . $e->getMessage());
        throw new Exception("Error inserting into avalnum. Please check the server logs for more details.");
    }
}
?>