<?php
// パスワードハッシュ生成用スクリプト

$password = 'admin123';
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "パスワード: {$password}\n";
echo "ハッシュ: {$hash}\n";
echo "\nSQLコマンド:\n";
echo "UPDATE admins SET password_hash = '{$hash}' WHERE username = 'admin';\n";
echo "\nまたは、INSERTする場合:\n";
echo "INSERT INTO admins (username, password_hash) VALUES ('admin', '{$hash}');\n";
?>
