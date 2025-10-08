# 今村宮 秋祭り 公式サイト

地域の秋祭りを管理・運営するための公式Webサイトです。

## 📋 機能概要

### 公開ページ
- **トップページ**: 祭りの紹介、開催日時、体験コンテンツの案内
- **スケジュールページ**: イベント詳細とタイムライン表示、QRコード表示

### 管理ページ
- **ダッシュボード**: 統計情報と管理メニュー
- **スケジュール管理**: イベントの追加・編集・削除、QRコード画像アップロード

## 🛠️ 技術仕様

- **フロントエンド**: HTML5, CSS3, JavaScript (Vanilla)
- **バックエンド**: PHP 8.0+
- **データベース**: MySQL 8.0+
- **セキュリティ**: CSRF対策, SQLインジェクション対策, パスワードハッシュ化

## 📁 ディレクトリ構成

```
imamura_festival/
├── index.php              # トップページ
├── schedule.php           # スケジュールページ
├── database.sql           # DB作成スクリプト
├── README.md             
│
├── includes/              # 共通ファイル
│   ├── config.php        # 設定ファイル ★重要
│   ├── header.php        # ヘッダー
│   └── footer.php        # フッター
│
├── admin/                 # 管理画面
│   ├── login.php         # ログインページ
│   ├── logout.php        # ログアウト処理
│   ├── dashboard.php     # ダッシュボード
│   ├── schedules.php     # スケジュール管理
│   ├── .htaccess         # セキュリティ設定
│   └── includes/
│       └── admin_header.php
│
└── assets/               # 静的ファイル
    ├── css/
    │   ├── common.css    # 共通スタイル
    │   ├── index.css     # トップページ専用
    │   ├── schedule.css  # スケジュール専用
    │   └── admin.css     # 管理画面専用
    ├── js/
    │   ├── common.js     # 共通JavaScript
    │   ├── index.js      # トップページ専用
    │   ├── schedule.js   # スケジュール専用
    │   └── admin.js      # 管理画面専用
    └── images/
        └── qr/           # QRコード画像保存先
```

## 🚀 セットアップ手順

### 1. 環境要件
- PHP 8.0以上
- MySQL 8.0以上
- Webサーバー（Apache/Nginx）

### 2. ファイルの配置
```bash
# プロジェクトファイルをWebサーバーのドキュメントルートに配置
cp -r imamura_festival/ /var/www/html/
```

### 3. データベースのセットアップ
```sql
-- MySQLにログインしてデータベースを作成
mysql -u root -p

-- database.sqlファイルを実行
source /path/to/database.sql;
```

### 4. 設定ファイルの編集
**重要**: `includes/config.php`でデータベース接続情報を設定：

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'imamura_festival');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
```

### 5. 権限設定
```bash
# ファイル権限を設定
chmod 644 *.php
chmod 755 admin/
chmod 755 assets/images/qr/
chmod 666 assets/images/qr/
```

### 6. 管理者アカウント
初期管理者アカウント：
- **ユーザー名**: `admin`
- **パスワード**: `admin123`

⚠️ **重要**: 初回ログイン後、必ずパスワードを変更してください。

## 🔧 QRコード機能の使い方

### QRコード画像のアップロード

1. 管理画面にログイン
2. 「スケジュール管理」を選択
3. イベントを追加または編集
4. 「参加申込QRコード画像」セクションでファイルを選択
5. 画像ファイル（JPEG, PNG, GIF, WebP）をアップロード（最大5MB）
6. 保存

### QRコードの表示

- スケジュールページでイベントをクリック
- モーダルにQRコードが表示される
- 来場者はスマートフォンで読み取って参加申込み

## 🔒 セキュリティ設定

### 本番環境での設定
1. **HTTPS有効化**: `admin/.htaccess`のHTTPSリダイレクトを有効化
2. **IP制限**: 管理画面へのアクセスを特定IPに制限
3. **エラー表示無効化**: `php.ini`でエラー表示をoff
4. **定期バックアップ**: データベースの自動バックアップを設定

## 📊 運用

### 日次作業
- スケジュールの確認・更新
- QRコード画像の確認

### 週次作業
- データベースのバックアップ
- ログファイルの確認

### 祭り後の作業
- データのアーカイブ
- 来年度用のスケジュールリセット

## 🐛 トラブルシューティング

### よくある問題

**Q: ログインできない**
A: 
1. ユーザー名・パスワードを確認
2. `includes/config.php`のDB設定を確認
3. `error.log`でエラー内容を確認

**Q: モーダルが表示されない**
A:
1. ブラウザのコンソールでJavaScriptエラーを確認
2. `schedule.js`が正しく読み込まれているか確認
3. ブラウザのキャッシュをクリア

**Q: QRコード画像がアップロードできない**
A:
1. `assets/images/qr/`ディレクトリの書き込み権限を確認（755推奨）
2. ファイルサイズが5MB以下か確認
3. 対応形式（JPEG, PNG, GIF, WebP）か確認

**Q: config.phpが見つからないエラー**
A:
1. `config.php`が`includes/`ディレクトリに配置されているか確認
2. 各PHPファイルで`require_once 'includes/config.php'`または`require_once '../includes/config.php'`を使用しているか確認

---

© 2025 今村宮 秋祭り実行委員会

## 🚀 セットアップ手順

### 1. 環境要件
- PHP 8.0以上
- MySQL 8.0以上
- Webサーバー（Apache/Nginx）

### 2. ファイルの配置
```bash
# プロジェクトファイルをWebサーバーのドキュメントルートに配置
cp -r imamura_festival/ /var/www/html/
```

### 3. データベースのセットアップ
```sql
-- MySQLにログインしてデータベースを作成
mysql -u root -p

-- database.sqlファイルを実行
source /path/to/database.sql;
```

### 4. 設定ファイルの編集
`config.php`でデータベース接続情報を設定：

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'imamura_festival');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
```

### 5. 権限設定
```bash
# ファイル権限を設定
chmod 644 *.php
chmod 755 admin/
chmod 644 admin/*.php
chmod 666 error.log  # ログファイル（作成される場合）
```

### 6. 管理者アカウント
初期管理者アカウント：
- **ユーザー名**: `admin`
- **パスワード**: `admin123`

⚠️ **重要**: 初回ログイン後、必ずパスワードを変更してください。

## 🔧 カスタマイズ

### テーマカラーの変更
`assets/css/common.css`の以下の値を変更：
```css
:root {
    --primary-color: #D96941;
    --primary-dark: #B54B1E;
}
```

### 開催日時の変更
1. `database.sql`のスケジュール初期データを編集
2. `index.php`の開催日時表示を更新
3. 各JavaScriptファイルの日付指定を更新

### 画像の追加
`assets/images/`ディレクトリに以下の画像を配置：
- `yatai.jpg` - 屋台の写真
- `sumo.jpg` - 相撲大会の写真
- `danjiri.jpg` - だんじりの写真
- `bingo.jpg` - 抽選会の写真

## 🔒 セキュリティ設定

### 本番環境での設定
1. **HTTPS有効化**: `admin/.htaccess`のHTTPSリダイレクトを有効化
2. **IP制限**: 管理画面へのアクセスを特定IPに制限
3. **エラー表示無効化**: `php.ini`でエラー表示をoff
4. **定期バックアップ**: データベースの自動バックアップを設定

### パスワード変更
管理画面でパスワードを変更するには：
```php
// 新しいパスワードをハッシュ化
$new_password_hash = password_hash('new_password', PASSWORD_DEFAULT);

// データベースで更新
UPDATE admins SET password_hash = '$new_password_hash' WHERE username = 'admin';
```

## 📊 運用

### 日次作業
- 参加申込の確認・承認
- スケジュールの更新（必要に応じて）

### 週次作業
- データベースのバックアップ
- ログファイルの確認

### 祭り後の作業
- 参加者データのアーカイブ
- 来年度用のスケジュールリセット

## 🐛 トラブルシューティング

### よくある問題

**Q: ログインできない**
A: 
1. ユーザー名・パスワードを確認
2. データベース接続を確認
3. `error.log`でエラー内容を確認

**Q: 画像が表示されない**
A:
1. 画像ファイルのパスを確認
2. ファイル権限を確認（644推奨）
3. 画像ファイルが存在するか確認

**Q: フォーム送信でエラーが出る**
A:
1. PHPエラーログを確認
2. データベース接続を確認
3. CSRFトークンの問題かチェック

## 📞 サポート

技術的な問題や機能要望については、開発チームまでお問い合わせください。

---

© 2025 今村宮 秋祭り実行委員会
