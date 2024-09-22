<?php
use Firebase\JWT\JWT;

function generate_jwt($payload) {
    $key = 'your_secret_key'; // Use a strong secret key
    $issuedAt = time();
    $expirationTime = $issuedAt + 3600; // jwt valid for 1 hour from the issued time
    $payload['iat'] = $issuedAt;
    $payload['exp'] = $expirationTime;

    return JWT::encode($payload, $key, 'HS256');
}

function verify_jwt($jwt) {
    $key = 'your_secret_key'; // Use the same secret key used in generate_jwt

    try {
        $decoded = JWT::decode($jwt, $key, ['HS256']);
        return (array) $decoded;
    } catch (Exception $e) {
        return null;
    }
}
?>
