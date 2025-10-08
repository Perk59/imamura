<?php
require_once '../includes/config.php';

// セッションを完全に破棄
if (isset($_SESSION)) {
    session_unset();
    session_destroy();
}

// セッションクッキーも削除
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

// ログイン画面にリダイレクト
redirect('login.php');
?>
