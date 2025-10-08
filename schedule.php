<?php
require_once 'includes/config.php';

// スケジュール情報を取得
$pdo = getDB();
$stmt = $pdo->prepare("SELECT * FROM schedules ORDER BY start_time ASC");
$stmt->execute();
$schedules = $stmt->fetchAll();

// 日付別にグループ化
$grouped_schedules = [];
foreach ($schedules as $schedule) {
    $date = date('Y-m-d', strtotime($schedule['start_time']));
    $grouped_schedules[$date][] = $schedule;
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/common.css">
    <link rel="stylesheet" href="assets/css/schedule.css">
    <title>スケジュール | <?= SITE_NAME ?></title>
    <meta name="description" content="今村宮秋祭りの詳細スケジュールです。各イベントの時間や場所をご確認いただけます。">
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <!-- ページヘッダー -->
    <section class="page-header">
        <div class="content-wrapper">
            <h1 class="page-title">スケジュール</h1>
            <p class="page-subtitle">今村宮秋祭りの詳細なイベントスケジュールをご確認いただけます</p>
        </div>
    </section>

    <!-- スケジュール一覧 -->
    <section class="schedule-section">
        <div class="content-wrapper">
            <?php foreach ($grouped_schedules as $date => $day_schedules): ?>
            <div class="schedule-day">
                <h2 class="date-title">
                    <?= date('Y年n月j日', strtotime($date)) ?>
                    <span class="day-of-week"><?= ['日', '月', '火', '水', '木', '金', '土'][date('w', strtotime($date))] ?>曜日</span>
                </h2>
                
                <div class="timeline">
                    <?php foreach ($day_schedules as $index => $schedule): ?>
                    <div class="timeline-item" data-aos="fade-up" data-aos-delay="<?= $index * 100 ?>" 
                         onclick="showEventDetail(<?= htmlspecialchars(json_encode($schedule), ENT_QUOTES, 'UTF-8') ?>)">
                        <div class="timeline-time">
                            <div class="start-time"><?= date('H:i', strtotime($schedule['start_time'])) ?></div>
                            <?php if ($schedule['end_time']): ?>
                            <div class="end-time">- <?= date('H:i', strtotime($schedule['end_time'])) ?></div>
                            <?php endif; ?>
                        </div>
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <div class="event-card">
                                <h3 class="event-title"><?= h($schedule['title']) ?></h3>
                                <?php if ($schedule['location']): ?>
                                <div class="event-location">
                                    <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <?= h($schedule['location']) ?>
                                </div>
                                <?php endif; ?>
                                <?php if ($schedule['description']): ?>
                                <p class="event-description"><?= h(mb_substr($schedule['description'], 0, 80)) ?><?= mb_strlen($schedule['description']) > 80 ? '...' : '' ?></p>
                                <?php endif; ?>
                                <?php if ($schedule['qr_image']): ?>
                                <div class="event-qr-indicator">
                                    <span class="qr-indicator">📱 参加申込受付中</span>
                                </div>
                                <?php endif; ?>
                                <div class="event-actions">
                                    <button class="event-detail-btn">詳細を見る</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endforeach; ?>

            <?php if (empty($grouped_schedules)): ?>
            <div class="no-schedule">
                <p>現在、公開されているスケジュールはありません。</p>
            </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- 注意事項 -->
    <section class="notice-section">
        <div class="content-wrapper">
            <div class="notice-box">
                <h3 class="notice-title">ご来場の皆様へ</h3>
                <ul class="notice-list">
                    <li>スケジュールは天候等により変更される場合があります</li>
                    <li>駐車場には限りがありますので、公共交通機関をご利用ください</li>
                    <li>ゴミは各自でお持ち帰りください</li>
                    <li>写真撮影の際は、他の参加者のプライバシーにご配慮ください</li>
                    <li>体調がすぐれない方は無理をせず、休憩を取ってください</li>
                </ul>
            </div>
        </div>
    </section>

    <!-- 参加申込みセクション（QRコード付き） -->
    <section id="participation" class="participation-section">
        <div class="content-wrapper">
            <h2 class="section-title">祭りに参加しませんか？</h2>
            <div class="participation-content">
                <div class="participation-text">
                    <p class="participation-description">
                        神輿担ぎ、屋台出店、ボランティアなど、様々な形でご参加いただけます。<br>
                        下記のQRコードからお申し込みください。
                    </p>
                </div>
                <div class="qr-code-section">
                    <div class="qr-code-container">
                        <?php if (!empty($qr_settings['form_url'])): ?>
                            <?php 
                            $qr_data = urlencode($qr_settings['form_url']);
                            $qr_image_url = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl={$qr_data}";
                            ?>
                            <div class="qr-code-placeholder">
                                <img src="<?= h($qr_image_url) ?>" alt="参加申込QRコード" class="qr-code-image">
                            </div>
                            <p class="qr-code-caption">スマートフォンで読み取って<br>参加申込みフォームへ</p>
                            <div class="qr-fallback">
                                <a href="<?= h($qr_settings['form_url']) ?>" target="_blank" class="qr-link-btn">
                                    直接フォームを開く
                                </a>
                            </div>
                        <?php else: ?>
                            <div class="qr-code-placeholder">
                                <div class="qr-placeholder-content">
                                    <div class="qr-placeholder-icon">📋</div>
                                    <p>参加申込み受付中</p>
                                    <small>QRコードは準備中です</small>
                                </div>
                            </div>
                            <p class="qr-code-caption">参加申込みについては<br>お問い合わせください</p>
                        <?php endif; ?>
                    </div>
                    <div class="participation-options">
                        <div class="option-card">
                            <div class="option-icon">⛩️</div>
                            <h4>神輿担ぎ</h4>
                            <p>伝統的な神輿を担いで町内を練り歩きます</p>
                        </div>
                        <div class="option-card">
                            <div class="option-icon">🍢</div>
                            <h4>屋台出店</h4>
                            <p>飲食物や小物の販売でお祭りを盛り上げます</p>
                        </div>
                        <div class="option-card">
                            <div class="option-icon">🤝</div>
                            <h4>ボランティア</h4>
                            <p>受付や案内など運営のお手伝いをします</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- イベント詳細モーダル -->
    <div id="eventDetailModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="modal-title">イベント詳細</h2>
            <button class="modal-close" onclick="closeEventModal()">&times;</button>
        </div>
        <div class="modal-body" id="eventModalBody">
            <!-- ここにJavaScriptで内容が設定されます -->
        </div>
    </div>
</div>

    <?php include 'includes/footer.php'; ?>

    <script src="assets/js/common.js"></script>
    <script src="assets/js/schedule.js"></script>
</body>
</html>
