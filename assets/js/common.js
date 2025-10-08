// 共通JavaScript機能

document.addEventListener('DOMContentLoaded', function() {
    // ハンバーガーメニューの制御
    initHamburgerMenu();
    
    // Intersection Observer for animations
    initScrollAnimations();
    
    // スムーススクロール
    initSmoothScroll();
});

// ハンバーガーメニューの初期化
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // ナビゲーションリンクがクリックされた時にメニューを閉じる
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // メニュー外をクリックした時にメニューを閉じる
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

// スクロールアニメーションの初期化
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // 監視対象の要素を追加
    const targets = document.querySelectorAll('.section-title, .notice-card, .timeline-item, .join-description, .join-buttons, .experience-card, .schedule-card, .participation-card, .fade-in-up');
    
    targets.forEach(target => {
        observer.observe(target);
    });
}

// スムーススクロールの初期化
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ユーティリティ関数

// 要素の表示/非表示切り替え
function toggleElement(selector, show = null) {
    const element = document.querySelector(selector);
    if (element) {
        if (show === null) {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        } else {
            element.style.display = show ? 'block' : 'none';
        }
    }
}

// 要素にクラス追加/削除
function toggleClass(selector, className) {
    const element = document.querySelector(selector);
    if (element) {
        element.classList.toggle(className);
    }
}

// フォームバリデーション用ヘルパー
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const existingError = field.parentNode.querySelector('.error-message');
    
    // 既存のエラーメッセージを削除
    if (existingError) {
        existingError.remove();
    }
    
    // 新しいエラーメッセージを追加
    if (message) {
        field.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    } else {
        field.classList.remove('error');
    }
}

function clearFieldErrors() {
    document.querySelectorAll('.error').forEach(field => {
        field.classList.remove('error');
    });
    document.querySelectorAll('.error-message').forEach(error => {
        error.remove();
    });
}

// ローディング表示
function showLoading(show = true) {
    let loader = document.getElementById('loading');
    
    if (show) {
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loading';
            loader.innerHTML = `
                <div class="loading-overlay">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>読み込み中...</p>
                    </div>
                </div>
            `;
            document.body.appendChild(loader);
            
            // ローディング用CSS
            const style = document.createElement('style');
            style.textContent = `
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.9);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }
                .loading-spinner {
                    text-align: center;
                }
                .spinner {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #D96941;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        loader.style.display = 'block';
    } else {
        if (loader) {
            loader.style.display = 'none';
        }
    }
}

// 通知表示
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // 通知用CSS（初回のみ）
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 2rem;
                border-radius: 8px;
                color: white;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 1rem;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 400px;
                word-wrap: break-word;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-success {
                background: #059669;
            }
            .notification-error {
                background: #dc2626;
            }
            .notification-warning {
                background: #d97706;
            }
            .notification-info {
                background: #2563eb;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // 閉じるボタン
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // 表示アニメーション
    setTimeout(() => notification.classList.add('show'), 100);
    
    // 自動非表示
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
}

// 確認ダイアログ
function confirmDialog(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// 日付フォーマット
function formatDate(date, format = 'Y-m-d H:i') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return format
        .replace('Y', year)
        .replace('m', month)
        .replace('d', day)
        .replace('H', hours)
        .replace('i', minutes);
}
