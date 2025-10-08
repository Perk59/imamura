<?php
session_start();


// CSRF トークン
function csrf_token() {
if (empty($_SESSION['csrf_token'])) {
$_SESSION['csrf_token'] = bin2hex(random_bytes(24));
}
return $_SESSION['csrf_token'];
}
function csrf_check($token) {
return hash_equals($_SESSION['csrf_token'] ?? '', $token ?? '');
}


// 管理者認証
function is_admin_logged_in() {
return !empty($_SESSION['admin_id']);
}
function require_admin() {
if (!is_admin_logged_in()) {
header('Location: /admin/login.php');
exit;
}
}


// 入力サニタイズ（簡易）
function h($s) { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }
