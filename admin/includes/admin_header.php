<header class="admin-header">
    <a href="dashboard.php" class="admin-logo"><?= SITE_NAME ?> 管理画面</a>
    
    <nav class="admin-nav">
        <a href="dashboard.php">ダッシュボード</a>
        <a href="schedules.php">スケジュール</a>
    </nav>
    
    <div class="admin-user">
        <span class="admin-username">ようこそ、<?= h($_SESSION['admin_username']) ?>さん</span>
        <a href="logout.php" class="logout-btn">ログアウト</a>
    </div>

    <!-- モバイル用ハンバーガーメニュー -->
    <div class="admin-hamburger">
        <span class="admin-bar"></span>
        <span class="admin-bar"></span>
        <span class="admin-bar"></span>
    </div>
</header>
