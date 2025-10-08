<?php
require_once '../includes/config.php';
requireLogin();

// 統計情報を取得
$pdo = getDB();

// スケジュール数
$stmt = $pdo->prepare("SELECT COUNT(*) as count FROM schedules");
$stmt->execute();
$schedule_count = $stmt->fetch()['count'];

// 最近のスケジュール更新
$stmt = $pdo->prepare("
    SELECT title, created_at 
    FROM schedules 
    ORDER BY created_at DESC 
    LIMIT 5
");
$stmt->execute();
$recent_schedules = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/common.css">
    <link rel="stylesheet" href="../assets/css/admin.css">
    <title>管理ダッシュボード | <?= SITE_NAME ?></title>
</head>
<body class="admin-body">
    <?php include 'includes/admin_header.php'; ?>

    <div class="admin-container">
        <div class="dashboard">
            <div class="dashboard-header">
                <h1 class="dashboard-title">管理ダッシュボード</h1>
                <p class="dashboard-subtitle">こんにちは、<?= h($_SESSION['admin_username']) ?>さん</p>
            </div>

            <!-- 統計カード -->
            <div class="stats-grid">
                <div class="stats-card">
                    <div class="stats-icon">📅</div>
                    <div class="stats-content">
                        <div class="stats-number"><?= $schedule_count ?></div>
                        <div class="stats-label">イベント数</div>
                    </div>
                </div>

                <div class="stats-card">
                    <div class="stats-icon">🎌</div>
                    <div class="stats-content">
                        <div class="stats-number">2025</div>
                        <div class="stats-label">開催年度</div>
                    </div>
                </div>

                <div class="stats-card">
                    <div class="stats-icon">📱</div>
                    <div class="stats-content">
                        <div class="stats-number">QR</div>
                        <div class="stats-label">申込システム</div>
                    </div>
                </div>
            </div>

            <!-- 管理メニュー -->
            <div class="admin-menu">
                <h2 class="section-title">管理メニュー</h2>
                <div class="menu-grid">
                    <a href="schedules.php" class="menu-card">
                        <div class="menu-icon">📅</div>
                        <h3 class="menu-title">スケジュール管理</h3>
                        <p class="menu-description">イベントスケジュールの追加・編集・削除<br>QRコード設定も含む</p>
                    </a>

                    <a href="../schedule.php" target="_blank" class="menu-card">
                        <div class="menu-icon">👀</div>
                        <h3 class="menu-title">サイト確認</h3>
                        <p class="menu-description">公開サイトの表示確認<br>新しいタブで開きます</p>
                    </a>
                </div>
            </div>

            <!-- 最近の活動 -->
            <div class="recent-activity">
                <h2 class="section-title">最近のスケジュール更新</h2>
                <?php if (!empty($recent_schedules)): ?>
                <div class="activity-list">
                    <?php foreach ($recent_schedules as $schedule): ?>
                    <div class="activity-item">
                        <div class="activity-content">
                            <div class="activity-title"><?= h($schedule['title']) ?></div>
                        </div>
                        <div class="activity-time">
                            <?= date('m/d H:i', strtotime($schedule['created_at'])) ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <div class="view-all">
                    <a href="schedules.php" class="view-all-link">スケジュール管理へ →</a>
                </div>
                <?php else: ?>
                <div class="no-activity">
                    <p>スケジュールはまだ登録されていません。</p>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <script src="../assets/js/common.js"></script>
    <script src="../assets/js/admin.js"></script>
</body>
</html><div class="activity-list">
                    <?php foreach ($recent_participants as $participant): ?>
                    <div class="activity-item">
                        <div class="activity-content">
                            <div class="activity-title"><?= h($participant['name']) ?>さん</div>
                            <div class="activity-meta">
                                <span class="category"><?= getCategoryName($participant['category']) ?></span>
                                <span class="status status-<?= $participant['status'] ?>">
                                    <?= getStatusName($participant['status']) ?>
                                </span>
                            </div>
                        </div>
                        <div class="activity-time">
                            <?= date('m/d H:i', strtotime($participant['created_at'])) ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <div class="view-all">
                    <a href="participants.php" class="view-all-link">すべての参加者を見る →</a>
                </div>
                <?php else: ?>
                <div class="no-activity">
                    <p>参加申込みはまだありません。</p>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <script src="../assets/js/common.js"></script>
    <script src="../assets/js/admin.js"></script>
</body>
</html>
