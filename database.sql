-- 今村宮 秋祭り データベース構築用SQL

-- データベース作成
CREATE DATABASE IF NOT EXISTS imamura_festival CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE imamura_festival;

-- 管理者テーブル
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- スケジュールテーブル
CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    location VARCHAR(100),
    qr_image VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 参加者テーブル
CREATE TABLE participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    category ENUM('mikoshi','yatai','volunteer') NOT NULL,
    message TEXT,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 管理者初期データ（パスワード: admin123）
-- 注意: 以下のハッシュ値は仮のものです。実際には generate_hash.php で生成したハッシュ値を使用してください
INSERT INTO admins (username, password_hash) VALUES 
('admin', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm');

-- スケジュール初期データ
INSERT INTO schedules (title, description, start_time, end_time, location) VALUES 
('開会式', '神社での伝統的な開会の儀式', '2025-10-15 10:00:00', '2025-10-15 10:30:00', '今村宮 本殿前'),
('伝統芸能披露', '地域の伝統芸能団体による演舞', '2025-10-15 11:00:00', '2025-10-15 12:00:00', '境内特設ステージ'),
('昼食・屋台開始', '各種屋台での飲食提供開始', '2025-10-15 12:00:00', '2025-10-15 21:00:00', '境内屋台エリア'),
('神輿渡御', '町内を練り歩く神輿行列', '2025-10-15 14:00:00', '2025-10-15 15:30:00', '町内一円'),
('夕涼みコンサート', '地域の音楽家による演奏会', '2025-10-15 16:00:00', '2025-10-15 18:00:00', '境内特設ステージ'),
('花火大会', 'フィナーレを飾る花火の打ち上げ', '2025-10-15 19:00:00', '2025-10-15 20:00:00', '今村宮周辺'),
('閉会式', '祭りの締めくくり', '2025-10-15 20:30:00', '2025-10-15 21:00:00', '今村宮 本殿前');
