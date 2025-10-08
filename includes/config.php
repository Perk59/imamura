<?php
// データベース設定
define('DB_HOST', 'localhost');
define('DB_NAME', 'xs163907_ima');
define('DB_USER', 'xs163907_kojima');
define('DB_PASS', 'Keito0805');
define('DB_CHARSET', 'utf8mb4');

// セキュリティ設定
define('CSRF_TOKEN_NAME', 'csrf_token');
define('SESSION_TIMEOUT', 3600); // 1時間

// サイト設定
define('SITE_NAME', '今村宮 秋祭り');
define('SITE_URL', 'http://xs163907.xsrv.jp/Ima');
define('ADMIN_EMAIL', 'admin@example.com');

// データベース接続
function getDB() {
    try {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET,
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        error_log('Database connection failed: ' . $e->getMessage());
        die('データベース接続に失敗しました。');
    }
}

// セッション開始
session_start();

// CSRF トークン生成
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// CSRF トークン検証
function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// XSS対策
function h($str) {
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

// ログイン状態チェック
function isLoggedIn() {
    return isset($_SESSION['admin_id']) && 
           isset($_SESSION['last_activity']) && 
           (time() - $_SESSION['last_activity'] < SESSION_TIMEOUT);
}

// セッション更新
function updateSession() {
    $_SESSION['last_activity'] = time();
}

// リダイレクト
function redirect($url) {
    header('Location: ' . $url);
    exit;
}

// 管理者認証要求
function requireLogin() {
    if (!isLoggedIn()) {
        redirect('login.php');
    }
    updateSession();
}

// エラーログ
function logError($message) {
    error_log(date('Y-m-d H:i:s') . ' - ' . $message . PHP_EOL, 3, 'error.log');
}
?>
