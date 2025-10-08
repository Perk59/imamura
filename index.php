<?php
require_once 'includes/config.php';

// スケジュール情報を取得（トップページ用）
$pdo = getDB();
$stmt = $pdo->prepare("SELECT * FROM schedules WHERE DATE(start_time) = '2025-10-15' ORDER BY start_time LIMIT 5");
$stmt->execute();
$schedules = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/common.css">
    <link rel="stylesheet" href="assets/css/index.css">
    <title><?= SITE_NAME ?></title>
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <!-- ヒーロースライドショー -->
    <div class="slideshow-container">
        <div class="slides">
            <div class="slide" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), linear-gradient(45deg, #E48F45, #B54B1E);"></div>
            <div class="slide" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), linear-gradient(45deg, #9E2A2B, #540B0E);"></div>
            <div class="slide" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), linear-gradient(45deg, #F3B562, #F06D3B);"></div>
        </div>
        <div class="catchcopy-container">
            <h2 class="catchcopy-main">今村宮で過ごす、秋の祭典</h2>
            <p class="catchcopy-sub">心躍る秋の夜長、新しい思い出を刻もう</p>
        </div>
    </div>

    <!-- 開催日時セクション -->
    <section class="date-section">
        <div class="content-wrapper">
            <h2 class="section-title">開催日時</h2>
            <div class="date-container">
                <div class="date-box">
                    <div class="date-content">
                        <span class="year">2025年</span>
                        <span class="month-day">10月15日</span>
                        <span class="time">10:00 - 21:00</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- スケジュールハイライト -->
    <section class="schedule-highlight">
    <div class="content-wrapper">
        <h2 class="section-title">本日のスケジュール</h2>
        <div class="schedule-grid">
            <?php foreach ($schedules as $schedule): ?>
            <div class="schedule-card" onclick="showEventDetail(<?= htmlspecialchars(json_encode($schedule), ENT_QUOTES, 'UTF-8') ?>)">
                <div class="schedule-time">
                    <?= date('H:i', strtotime($schedule['start_time'])) ?>
                    <?php if ($schedule['end_time']): ?>
                    - <?= date('H:i', strtotime($schedule['end_time'])) ?>
                    <?php endif; ?>
                </div>
                <h3 class="schedule-title"><?= h($schedule['title']) ?></h3>
                <p class="schedule-location"><?= h($schedule['location']) ?></p>
                <p class="schedule-description">
                    <?= h(mb_substr($schedule['description'], 0, 60)) ?>
                    <?= mb_strlen($schedule['description']) > 60 ? '...' : '' ?>
                </p>
                <div class="schedule-actions">
                    <button class="schedule-detail-btn">詳細を見る</button>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <div class="schedule-link-container">
            <a href="schedule.php" class="schedule-link-btn">全スケジュールを見る</a>
        </div>
    </div>
</section>


    <!-- 体験コンテンツセクション -->
    <section class="experience-section">
        <div class="content-wrapper">
            <h2 class="section-title">祭りの楽しみ方</h2>
            <div class="experience-grid">
                <!-- 屋台 -->
                <div class="experience-card">
                    <div class="experience-image">
                        <img src="assets/images/yatai.jpg" alt="祭りの屋台" loading="lazy">
                    </div>
                    <div class="experience-content">
                        <h3 class="experience-title">祭りの屋台</h3>
                        <p class="experience-target">対象：どなたでも</p>
                        <p class="experience-description">
                            地域の名店が集まる屋台村。たこ焼きや焼きそば、りんご飴など、
                            懐かしい味から新しい味まで、様々な屋台グルメをお楽しみいただけます。
                        </p>
                    </div>
                </div>

                <!-- 相撲 -->
                <div class="experience-card">
                    <div class="experience-image">
                        <img src="assets/images/sumo.jpg" alt="子ども相撲大会" loading="lazy">
                    </div>
                    <div class="experience-content">
                        <h3 class="experience-title">子ども相撲大会</h3>
                        <p class="experience-target">対象：小学生</p>
                        <p class="experience-description">
                            伝統ある子ども相撲大会。土俵での真剣勝負を通じて、
                            日本の伝統文化に触れ、心技体を育みます。
                        </p>
                    </div>
                </div>

                <!-- だんじり -->
                <div class="experience-card">
                    <div class="experience-image">
                        <img src="assets/images/danjiri.jpg" alt="だんじり曳行" loading="lazy">
                    </div>
                    <div class="experience-content">
                        <h3 class="experience-title">だんじり曳行</h3>
                        <p class="experience-target">対象：中学生以上</p>
                        <p class="experience-description">
                            町内を勇壮に練り歩くだんじり。威勢の良い掛け声と
                            太鼓の音が街中に響き渡ります。曳き手として参加も可能です。
                        </p>
                    </div>
                </div>

                <!-- ビンゴ大会 -->
                <div class="experience-card">
                    <div class="experience-image">
                        <img src="assets/images/bingo.jpg" alt="大抽選会" loading="lazy">
                    </div>
                    <div class="experience-content">
                        <h3 class="experience-title">大抽選会</h3>
                        <p class="experience-target">対象：どなたでも</p>
                        <p class="experience-description">
                            豪華賞品が当たる大抽選会。地域の特産品から家電まで、
                            様々な賞品をご用意。祭りのフィナーレを飾る人気イベントです。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 参加セクション -->
    <!-- 参加セクション -->
    <section class="join-section">
        <div class="content-wrapper">
            <h2 class="section-title">祭りに参加しませんか？</h2>
            <div class="join-content">
                <p class="join-description">
                    今村宮秋祭りでは、様々な形でご参加いただけます。<br>
                    各イベントの詳細とお申込み方法は、スケジュールページからご確認ください。
                </p>
                <div class="participation-steps">
                    <div class="step-item">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>スケジュール確認</h4>
                            <p>参加したいイベントを選んでください</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>詳細を確認</h4>
                            <p>イベントをクリックして詳細情報とQRコードを確認</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>申込み完了</h4>
                            <p>QRコードから簡単にお申込みいただけます</p>
                        </div>
                    </div>
                </div>
                <div class="join-buttons">
                    <a href="schedule.php" class="join-button primary">スケジュールを見る</a>
                    <a href="schedule.php#participation" class="join-button secondary">参加方法を確認</a>
                </div>
            </div>
        </div>
    </section>

    <?php include 'includes/footer.php'; ?>

    <script src="assets/js/common.js"></script>
    <script src="assets/js/index.js"></script>
</body>
</html>
