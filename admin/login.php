<?php
require_once '../includes/config.php';

$error_message = '';

// 既にログイン済みの場合はダッシュボードへリダイレクト
if (isLoggedIn()) {
    redirect('dashboard.php');
}

// ログイン処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CSRF トークン検証
    if (!isset($_POST['csrf_token']) || !verifyCSRFToken($_POST['csrf_token'])) {
        $error_message = 'セキュリティエラーが発生しました。再度お試しください。';
    } else {
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($username) || empty($password)) {
            $error_message = 'ユーザー名とパスワードを入力してください。';
        } else {
            try {
                $pdo = getDB();
                $stmt = $pdo->prepare("SELECT id, username, password_hash FROM admins WHERE username = ?");
                $stmt->execute([$username]);
                $admin = $stmt->fetch();

                if ($admin && password_verify($password, $admin['password_hash'])) {
                    // ログイン成功
                    $_SESSION['admin_id'] = $admin['id'];
                    $_SESSION['admin_username'] = $admin['username'];
                    $_SESSION['last_activity'] = time();
                    
                    // CSRFトークンを再生成
                    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
                    
                    redirect('dashboard.php');
                } else {
                    $error_message = 'ユーザー名またはパスワードが正しくありません。';
                    // ログイン試行ログ
                    logError('Failed login attempt for username: ' . $username . ' from IP: ' . $_SERVER['REMOTE_ADDR']);
                }
            } catch (PDOException $e) {
                logError('Login error: ' . $e->getMessage());
                $error_message = 'システムエラーが発生しました。';
            }
        }
    }
}

$csrf_token = generateCSRFToken();
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/common.css">
    <link rel="stylesheet" href="../assets/css/admin.css">
    <title>管理者ログイン | <?= SITE_NAME ?></title>
</head>
<body class="admin-body">
    <div class="login-container">
        <div class="login-box">
            <div class="login-header">
                <h1 class="login-title"><?= SITE_NAME ?></h1>
                <p class="login-subtitle">管理者ログイン</p>
            </div>

            <?php if ($error_message): ?>
            <div class="alert alert-error">
                <?= h($error_message) ?>
            </div>
            <?php endif; ?>

            <form class="login-form" method="POST" action="">
                <input type="hidden" name="csrf_token" value="<?= h($csrf_token) ?>">
                
                <div class="form-group">
                    <label for="username" class="form-label">ユーザー名</label>
                    <input type="text" id="username" name="username" class="form-input" 
                           value="<?= h($_POST['username'] ?? '') ?>" required autofocus>
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">パスワード</label>
                    <input type="password" id="password" name="password" class="form-input" required>
                </div>

                <div class="form-actions">
                    <button type="submit" class="login-btn">ログイン</button>
                </div>
            </form>

            <div class="login-footer">
                <a href="../index.php" class="back-link">← サイトトップへ戻る</a>
            </div>
        </div>
    </div>

    <script src="../assets/js/common.js"></script>
</body>
</html>
