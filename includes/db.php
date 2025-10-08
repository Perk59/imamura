<?php
$config = require __DIR__ . '/config.php';
$dsn = "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4";
try {
$pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
} catch (PDOException $e) {
// 本番では詳細を出さない
echo 'DB接続に失敗しました。';
exit;
}
