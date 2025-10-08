<?php
require_once '../includes/config.php';
requireLogin();

$error_message = '';
$success_message = '';

$pdo = getDB();

// QRコード画像アップロード処理
function handleQRImageUpload($schedule_id) {
    if (!isset($_FILES['qr_image']) || $_FILES['qr_image']['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    
    $upload_dir = '../assets/images/qr/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    $file = $_FILES['qr_image'];
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!in_array($file['type'], $allowed_types)) {
        throw new Exception('画像ファイル（JPEG, PNG, GIF, WebP）のみアップロード可能です。');
    }
    
    if ($file['size'] > 5 * 1024 * 1024) { // 5MB制限
        throw new Exception('ファイルサイズは5MB以下にしてください。');
    }
    
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'qr_' . $schedule_id . '_' . time() . '.' . $extension;
    $filepath = $upload_dir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        return 'assets/images/qr/' . $filename;
    }
    
    throw new Exception('ファイルのアップロードに失敗しました。');
}

// 削除処理
if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
    if (!isset($_GET['csrf_token']) || !verifyCSRFToken($_GET['csrf_token'])) {
        $error_message = 'セキュリティエラーが発生しました。';
    } else {
        try {
            // QRコード画像も削除
            $stmt = $pdo->prepare("SELECT qr_image FROM schedules WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $schedule = $stmt->fetch();
            
            if ($schedule && $schedule['qr_image'] && file_exists('../' . $schedule['qr_image'])) {
                unlink('../' . $schedule['qr_image']);
            }
            
            $stmt = $pdo->prepare("DELETE FROM schedules WHERE id = ?");
            if ($stmt->execute([$_GET['id']])) {
                $success_message = 'スケジュールを削除しました。';
            } else {
                $error_message = '削除に失敗しました。';
            }
        } catch (PDOException $e) {
            logError('Schedule delete error: ' . $e->getMessage());
            $error_message = 'システムエラーが発生しました。';
        }
    }
}

// 新規追加・編集処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCSRFToken($_POST['csrf_token'])) {
        $error_message = 'セキュリティエラーが発生しました。';
    } else {
        $id = $_POST['id'] ?? null;
        $title = trim($_POST['title']);
        $description = trim($_POST['description']);
        $start_time = $_POST['start_time'];
        $end_time = $_POST['end_time'] ?: null;
        $location = trim($_POST['location']);

        // バリデーション
        if (empty($title)) {
            $error_message = 'イベント名は必須です。';
        } elseif (empty($start_time)) {
            $error_message = '開始日時は必須です。';
        } else {
            try {
                $qr_image = null;
                
                if ($id) {
                    // 更新
                    if (isset($_FILES['qr_image']) && $_FILES['qr_image']['error'] !== UPLOAD_ERR_NO_FILE) {
                        $qr_image = handleQRImageUpload($id);
                        
                        // 古いQRコード画像を削除
                        $stmt = $pdo->prepare("SELECT qr_image FROM schedules WHERE id = ?");
                        $stmt->execute([$id]);
                        $old_schedule = $stmt->fetch();
                        if ($old_schedule && $old_schedule['qr_image'] && file_exists('../' . $old_schedule['qr_image'])) {
                            unlink('../' . $old_schedule['qr_image']);
                        }
                        
                        $stmt = $pdo->prepare("UPDATE schedules SET title = ?, description = ?, start_time = ?, end_time = ?, location = ?, qr_image = ? WHERE id = ?");
                        $result = $stmt->execute([$title, $description, $start_time, $end_time, $location, $qr_image, $id]);
                    } else {
                        $stmt = $pdo->prepare("UPDATE schedules SET title = ?, description = ?, start_time = ?, end_time = ?, location = ? WHERE id = ?");
                        $result = $stmt->execute([$title, $description, $start_time, $end_time, $location, $id]);
                    }
                    $success_message = 'スケジュールを更新しました。';
                } else {
                    // 新規作成
                    $stmt = $pdo->prepare("INSERT INTO schedules (title, description, start_time, end_time, location) VALUES (?, ?, ?, ?, ?)");
                    $result = $stmt->execute([$title, $description, $start_time, $end_time, $location]);
                    
                    if ($result) {
                        $new_id = $pdo->lastInsertId();
                        if (isset($_FILES['qr_image']) && $_FILES['qr_image']['error'] !== UPLOAD_ERR_NO_FILE) {
                            $qr_image = handleQRImageUpload($new_id);
                            $stmt = $pdo->prepare("UPDATE schedules SET qr_image = ? WHERE id = ?");
                            $stmt->execute([$qr_image, $new_id]);
                        }
                    }
                    $success_message = 'スケジュールを追加しました。';
                }
                
                if (!$result) {
                    $error_message = '保存に失敗しました。';
                }
            } catch (Exception $e) {
                $error_message = $e->getMessage();
            } catch (PDOException $e) {
                logError('Schedule save error: ' . $e->getMessage());
                $error_message = 'システムエラーが発生しました。';
            }
        }
    }
}

// 編集データ取得
$edit_data = null;
if (isset($_GET['action']) && $_GET['action'] === 'edit' && isset($_GET['id'])) {
    $stmt = $pdo->prepare("SELECT * FROM schedules WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $edit_data = $stmt->fetch();
}

// スケジュール一覧取得
$stmt = $pdo->prepare("SELECT * FROM schedules ORDER BY start_time ASC");
$stmt->execute();
$schedules = $stmt->fetchAll();

$csrf_token = generateCSRFToken();
?>

// 編集データ取得
$edit_data = null;
if (isset($_GET['action']) && $_GET['action'] === 'edit' && isset($_GET['id'])) {
    $stmt = $pdo->prepare("SELECT * FROM schedules WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $edit_data = $stmt->fetch();
}

// スケジュール一覧取得
$stmt = $pdo->prepare("SELECT * FROM schedules ORDER BY start_time ASC");
$stmt->execute();
$schedules = $stmt->fetchAll();

$csrf_token = generateCSRFToken();
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/common.css">
    <link rel="stylesheet" href="../assets/css/admin.css">
    <title>スケジュール管理 | <?= SITE_NAME ?></title>
</head>
<body class="admin-body">
    <?php include 'includes/admin_header.php'; ?>

    <div class="admin-container">
        <div class="admin-content">
            <div class="page-header">
                <h1 class="page-title">スケジュール管理</h1>
                <a href="dashboard.php" class="back-btn">← ダッシュボードに戻る</a>
            </div>

            <?php if ($error_message): ?>
            <div class="alert alert-error"><?= h($error_message) ?></div>
            <?php endif; ?>

            <?php if ($success_message): ?>
            <div class="alert alert-success"><?= h($success_message) ?></div>
            <?php endif; ?>

                            <!-- スケジュール追加・編集フォーム -->
            <div class="form-section">
                <h2 class="section-title"><?= $edit_data ? 'スケジュール編集' : 'スケジュール追加' ?></h2>
                <form class="admin-form" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="csrf_token" value="<?= h($csrf_token) ?>">
                    <?php if ($edit_data): ?>
                    <input type="hidden" name="id" value="<?= h($edit_data['id']) ?>">
                    <?php endif; ?>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="title" class="form-label">イベント名 <span class="required">必須</span></label>
                            <input type="text" id="title" name="title" class="form-input" 
                                   value="<?= h($edit_data['title'] ?? '') ?>" required>
                        </div>

                        <div class="form-group">
                            <label for="location" class="form-label">場所</label>
                            <input type="text" id="location" name="location" class="form-input" 
                                   value="<?= h($edit_data['location'] ?? '') ?>">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="start_time" class="form-label">開始日時 <span class="required">必須</span></label>
                            <input type="datetime-local" id="start_time" name="start_time" class="form-input" 
                                   value="<?= $edit_data ? date('Y-m-d\TH:i', strtotime($edit_data['start_time'])) : '' ?>" required>
                        </div>

                        <div class="form-group">
                            <label for="end_time" class="form-label">終了日時</label>
                            <input type="datetime-local" id="end_time" name="end_time" class="form-input" 
                                   value="<?= $edit_data && $edit_data['end_time'] ? date('Y-m-d\TH:i', strtotime($edit_data['end_time'])) : '' ?>">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="description" class="form-label">説明</label>
                        <textarea id="description" name="description" class="form-textarea" rows="4"><?= h($edit_data['description'] ?? '') ?></textarea>
                    </div>

                    <div class="form-group">
                        <label for="qr_image" class="form-label">参加申込QRコード画像</label>
                        <div class="file-upload-container">
                            <input type="file" id="qr_image" name="qr_image" class="form-input-file" accept="image/*">
                            <label for="qr_image" class="file-upload-label">
                                <span class="upload-icon">📁</span>
                                <span class="upload-text">画像ファイルを選択</span>
                            </label>
                        </div>
                        <small class="form-help">JPEG、PNG、GIF、WebP形式（最大5MB）</small>
                        
                        <?php if ($edit_data && !empty($edit_data['qr_image'])): ?>
                        <div class="qr-preview-container">
                            <div class="qr-preview">
                                <img src="<?= h('../' . $edit_data['qr_image']) ?>" alt="現在のQRコード" class="qr-image-small">
                                <p class="qr-caption">現在のQRコード</p>
                            </div>
                        </div>
                        <?php endif; ?>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-primary"><?= $edit_data ? '更新' : '追加' ?></button>
                        <?php if ($edit_data): ?>
                        <a href="schedules.php" class="btn-secondary">キャンセル</a>
                        <?php endif; ?>
                    </div>
                </form>
            </div>

            <!-- スケジュール一覧 -->
            <div class="table-section">
                <h2 class="section-title">スケジュール一覧</h2>
                <?php if (!empty($schedules)): ?>
                <!-- モバイル用カード表示 -->
                <div class="mobile-cards">
                    <?php foreach ($schedules as $schedule): ?>
                    <div class="schedule-mobile-card" data-schedule-id="<?= $schedule['id'] ?>">
                        <div class="card-header">
                            <h3 class="card-title"><?= h($schedule['title']) ?></h3>
                            <div class="card-actions">
                                <button class="btn-detail-mobile" onclick="showScheduleDetail(<?= htmlspecialchars(json_encode($schedule), ENT_QUOTES, 'UTF-8') ?>)">詳細</button>
                                <a href="?action=edit&id=<?= $schedule['id'] ?>" class="btn-edit-mobile">編集</a>
                                <a href="?action=delete&id=<?= $schedule['id'] ?>&csrf_token=<?= h($csrf_token) ?>" 
                                   class="btn-delete-mobile" 
                                   onclick="return confirm('本当に削除しますか？')">削除</a>
                            </div>
                        </div>
                        <div class="card-content">
                            <div class="card-time">
                                <span class="time-label">開始:</span>
                                <?= date('Y/m/d H:i', strtotime($schedule['start_time'])) ?>
                                <?php if ($schedule['end_time']): ?>
                                <br><span class="time-label">終了:</span>
                                <?= date('Y/m/d H:i', strtotime($schedule['end_time'])) ?>
                                <?php endif; ?>
                            </div>
                            <div class="card-location">
                                <span class="location-icon">📍</span>
                                <?= h($schedule['location']) ?: '場所未設定' ?>
                            </div>
                            <?php if ($schedule['description']): ?>
                            <div class="card-description">
                                <?= h(mb_substr($schedule['description'], 0, 50)) ?>
                                <?php if (mb_strlen($schedule['description']) > 50): ?>...<?php endif; ?>
                            </div>
                            <?php endif; ?>
                            <?php if ($schedule['qr_image']): ?>
                            <div class="card-qr-status">
                                <span class="qr-badge">📱 QRコード設定済み</span>
                            </div>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>

                <!-- デスクトップ用テーブル表示 -->
                <div class="table-container desktop-only">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>イベント名</th>
                                <th>日時</th>
                                <th>場所</th>
                                <th>QR</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($schedules as $schedule): ?>
                            <tr onclick="showScheduleDetail(<?= htmlspecialchars(json_encode($schedule), ENT_QUOTES, 'UTF-8') ?>)" style="cursor: pointer;">
                                <td><?= h($schedule['title']) ?></td>
                                <td>
                                    <?= date('Y/m/d H:i', strtotime($schedule['start_time'])) ?>
                                    <?php if ($schedule['end_time']): ?>
                                    <br><small>～ <?= date('H:i', strtotime($schedule['end_time'])) ?></small>
                                    <?php endif; ?>
                                </td>
                                <td><?= h($schedule['location']) ?></td>
                                <td>
                                    <?php if ($schedule['qr_image']): ?>
                                    <span class="qr-status-active">✓</span>
                                    <?php else: ?>
                                    <span class="qr-status-inactive">-</span>
                                    <?php endif; ?>
                                </td>
                                <td class="table-actions" onclick="event.stopPropagation();">
                                    <a href="?action=edit&id=<?= $schedule['id'] ?>" class="btn-edit">編集</a>
                                    <a href="?action=delete&id=<?= $schedule['id'] ?>&csrf_token=<?= h($csrf_token) ?>" 
                                       class="btn-delete" 
                                       onclick="return confirm('本当に削除しますか？')">削除</a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
                <?php else: ?>
                <div class="no-data">
                    <p>登録されているスケジュールはありません。</p>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- スケジュール詳細モーダル -->
    <div id="scheduleDetailModal" class="modal">
        <div class="modal-content schedule-detail-modal">
            <div class="modal-header">
                <h2 class="modal-title">スケジュール詳細</h2>
                <button class="modal-close" onclick="closeScheduleModal()">&times;</button>
            </div>
            <div class="modal-body" id="scheduleModalBody">
                <!-- JavaScript で内容を設定 -->
            </div>
        </div>
    </div>

    <style>
        .qr-preview-container {
            margin-top: 1rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            text-align: center;
        }
        
        .qr-image-small {
            max-width: 150px;
            border-radius: 8px;
        }
        
        .qr-caption {
            margin-top: 0.5rem;
            font-size: 0.8rem;
            color: #666;
        }
        
        .form-help {
            color: #666;
            font-size: 0.8rem;
            margin-top: 0.3rem;
        }
        
        .qr-badge {
            background: #d1fae5;
            color: #065f46;
            padding: 0.3rem 0.6rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .qr-status-active {
            color: #059669;
            font-weight: bold;
            font-size: 1.2rem;
        }
        
        .qr-status-inactive {
            color: #9ca3af;
            font-size: 1.2rem;
        }
        
        .card-qr-status {
            margin-top: 0.8rem;
            padding-top: 0.8rem;
            border-top: 1px solid #f0f0f0;
        }
    </style>

    <script src="../assets/js/common.js"></script>
    <script src="../assets/js/admin.js"></script>
</body>
</html>
