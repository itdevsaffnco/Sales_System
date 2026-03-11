<?php
$host = '127.0.0.1';
$port = '3306';
$user = 'root';
$pass = '';
$dbName = 'sales_software';
try {
    $pdo = new PDO("mysql:host={$host};port={$port}", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    echo "DB_OK";
} catch (Throwable $e) {
    echo "DB_ERR: " . $e->getMessage();
    exit(1);
}
