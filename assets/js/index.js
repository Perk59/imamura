// トップページ専用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // スライドショーの初期化
    initSlideshow();
    
    // スケジュールカードのアニメーション
    initScheduleCards();
    
    // カードホバー時の光沢エフェクト
    initGlowEffects();
    
    // タッチデバイス最適化
    initTouchOptimization();
    
    // アクセシビリティ向上
    initAccessibilityFeatures();
});

// イベント詳細表示機能（グローバルに定義）
window.showEventDetail = function(event) {
    // モーダル要素の存在確認
    const modalBody = document.getElementById('eventModalBody');
    const modal = document.getElementById('eventDetailModal');
    
    if (!modalBody || !modal) {
        console.error('モーダル要素が見つかりません');
        return;
    }
    
    const startTime = new Date(event.start_time);
    const endTime = event.end_time ? new Date(event.end_time) : null;
    
    const content = `
        <div class="event-detail-content">
            <div class="event-detail-header">
                <h3 class="event-detail-title">${event.title}</h3>
                <div class="event-detail-time">
                    <span class="time-badge-large">開始: ${startTime.toLocaleString('ja-JP')}</span>
                    ${endTime ? `<span class="time-badge-large">終了: ${endTime.toLocaleString('ja-JP')}</span>` : ''}
                </div>
                ${event.location ? `
                <div class="event-detail-location">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    ${event.location}
                </div>
                ` : ''}
            </div>
            
            ${event.description ? `
            <div class="event-detail-description">
                ${event.description.replace(/\n/g, '<br>')}
            </div>
            ` : '<div class="event-detail-description">詳細説明はありません。</div>'}
            
            <div class="event-detail-cta">
                <p>このイベントへの参加申込みは、スケジュールページでご確認ください。</p>
                <a href="schedule.php" class="detail-schedule-link">スケジュールページへ</a>
            </div>
        </div>
    `;
    
    modalBody.innerHTML = content;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // モーダルを中央に配置
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.position = 'fixed';
        modalContent.style.top = '50%';
        modalContent.style.left = '50%';
        modalContent.style.transform = 'translate(-50%, -50%)';
        modalContent.style.margin = '0';
        modalContent.style.zIndex = '10001';
    }
}

window.closeEventModal = function() {
    const modal = document.getElementById('eventDetailModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// カードホバー時の光沢エフェクト
function initGlowEffects() {
    const cards = document.querySelectorAll('.schedule-card, .experience-card');
    
    cards.forEach(card => {
        // 光沢エフェクト用の要素を作成
        const glowElement = document.createElement('div');
        glowElement.className = 'glow-effect';
        card.appendChild(glowElement);
        
        card.addEventListener('mouseenter', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            glowElement.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(217, 105, 65, 0.3) 0%, transparent 60%)`;
            glowElement.style.opacity = '1';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            glowElement.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(217, 105, 65, 0.3) 0%, transparent 60%)`;
        });
        
        card.addEventListener('mouseleave', function() {
            glowElement.style.opacity = '0';
        });
    });
}

// タッチデバイス最適化
function initTouchOptimization() {
    // タッチデバイス検出
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
        
        // タッチイベントの最適化
        const cards = document.querySelectorAll('.schedule-card, .experience-card');
        cards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            card.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            });
        });
        
        // スクロール性能最適化
        document.addEventListener('touchstart', function(){}, {passive: true});
        document.addEventListener('touchmove', function(){}, {passive: true});
    }
}

// アクセシビリティ向上
function initAccessibilityFeatures() {
    // キーボードナビゲーション
    const interactiveElements = document.querySelectorAll('.schedule-card, .experience-card, .join-button');
    
    interactiveElements.forEach((element, index) => {
        element.setAttribute('tabindex', '0');
        element.setAttribute('role', 'button');
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // フォーカス時のスタイル
        element.addEventListener('focus', function() {
            this.classList.add('keyboard-focus');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('keyboard-focus');
        });
    });
    
    // スクリーンリーダー対応
    const scheduleCards = document.querySelectorAll('.schedule-card');
    scheduleCards.forEach(card => {
        const title = card.querySelector('.schedule-title')?.textContent || '';
        const time = card.querySelector('.schedule-time')?.textContent || '';
        const location = card.querySelector('.schedule-location')?.textContent || '';
        
        card.setAttribute('aria-label', `イベント: ${title}, 時間: ${time}, 場所: ${location}. 詳細を見るにはクリックまたはEnterキーを押してください。`);
    });
    
    // 段階的なアニメーション遅延（動きに敏感な人への配慮）
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        initStaggeredAnimations();
    }
}

// 段階的なアニメーション遅延
function initStaggeredAnimations() {
    const animatedElements = document.querySelectorAll('.schedule-card, .experience-card, .stats-card');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 150 + 200); // 150msずつ遅延
    });
}

// スライドショーの制御
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    if (slides.length === 0) return;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // 初期表示
    showSlide(0);
    
    // 自動スライドショー（5秒間隔）
    const slideInterval = setInterval(nextSlide, 5000);
    
    // ページを離れる際はインターバルをクリア
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(slideInterval);
        }
    });
}

// スケジュールカードのアニメーション
function initScheduleCards() {
    const scheduleCards = document.querySelectorAll('.schedule-card');
    
    scheduleCards.forEach((card, index) => {
        // 遅延アニメーション
        card.style.animationDelay = `${index * 0.1}s`;
        
        // ホバー効果の強化
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });
    });
}

// 体験コンテンツのパララックス効果
function initExperienceParallax() {
    const experienceCards = document.querySelectorAll('.experience-card');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        experienceCards.forEach((card, index) => {
            const speed = (index % 2 === 0) ? 0.5 : -0.5;
            card.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
        });
    });
}

// 数字のカウントアップアニメーション
function animateNumbers() {
    const numbers = document.querySelectorAll('.animate-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.dataset.value || target.textContent);
                
                animateValue(target, 0, finalValue, 2000);
                observer.unobserve(target);
            }
        });
    });
    
    numbers.forEach(number => observer.observe(number));
}

function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // イージング関数（ease-out）
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(start + (end - start) * easedProgress);
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// スクロール時のヘッダー背景変更
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// 初期化時に数字アニメーションとヘッダースクロール効果を追加
document.addEventListener('DOMContentLoaded', function() {
    animateNumbers();
    initHeaderScroll();
    initCountdownTimer();
    initWeatherWidget();
});

// パフォーマンス最適化：Intersection Observerの使用
function optimizeAnimations() {
    // 画面外の要素のアニメーションを停止
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            } else {
                entry.target.style.animationPlayState = 'paused';
            }
        });
    });
    
    document.querySelectorAll('.animated-element').forEach(el => {
        observer.observe(el);
    });
}

// イベント詳細表示機能
function showEventDetail(event) {
    const startTime = new Date(event.start_time);
    const endTime = event.end_time ? new Date(event.end_time) : null;
    
    const content = `
        <div class="event-detail-content">
            <div class="event-detail-header">
                <h3 class="event-detail-title">${event.title}</h3>
                <div class="event-detail-time">
                    <span class="time-badge-large">開始: ${startTime.toLocaleString('ja-JP')}</span>
                    ${endTime ? `<span class="time-badge-large">終了: ${endTime.toLocaleString('ja-JP')}</span>` : ''}
                </div>
                ${event.location ? `
                <div class="event-detail-location">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    ${event.location}
                </div>
                ` : ''}
            </div>
            
            ${event.description ? `
            <div class="event-detail-description">
                ${event.description.replace(/\n/g, '<br>')}
            </div>
            ` : '<div class="event-detail-description">詳細説明はありません。</div>'}
        </div>
    `;
    
    document.getElementById('eventModalBody').innerHTML = content;
    document.getElementById('eventDetailModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // スクロールを無効化
}

function closeEventModal() {
    const modal = document.getElementById('eventDetailModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // スクロールを再有効化
}

// モーダル外クリックで閉じる
window.onclick = function(event) {
    const modal = document.getElementById('eventDetailModal');
    if (event.target === modal) {
        closeEventModal();
    }
}

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeEventModal();
    }
});

// 祭りまでのカウントダウンタイマー
function initCountdownTimer() {
    const festivalDate = new Date('2025-10-15T10:00:00');
    const countdownElement = createCountdownElement();
    
    if (!countdownElement) return;
    
    function updateCountdown() {
        const now = new Date();
        const timeLeft = festivalDate - now;
        
        if (timeLeft <= 0) {
            countdownElement.innerHTML = '<div class="countdown-finished">🎉 秋祭り開催中！ 🎉</div>';
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `
            <div class="countdown-container">
                <h3>祭りまであと</h3>
                <div class="countdown-numbers">
                    <div class="countdown-item">
                        <span class="countdown-number">${days}</span>
                        <span class="countdown-label">日</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number">${hours}</span>
                        <span class="countdown-label">時間</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number">${minutes}</span>
                        <span class="countdown-label">分</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number">${seconds}</span>
                        <span class="countdown-label">秒</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function createCountdownElement() {
    // 開催日時セクションにカウントダウンを追加
    const dateSection = document.querySelector('.date-section .content-wrapper');
    if (!dateSection) return null;
    
    const countdownDiv = document.createElement('div');
    countdownDiv.className = 'countdown-section';
    dateSection.appendChild(countdownDiv);
    
    // CSS追加
    if (!document.querySelector('#countdown-styles')) {
        const style = document.createElement('style');
        style.id = 'countdown-styles';
        style.textContent = `
            .countdown-section {
                text-align: center;
                margin-top: 2rem;
                padding: 2rem;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                backdrop-filter: blur(5px);
            }
            .countdown-container h3 {
                color: white;
                margin-bottom: 1.5rem;
                font-size: 1.3rem;
            }
            .countdown-numbers {
                display: flex;
                justify-content: center;
                gap: 2rem;
                flex-wrap: wrap;
            }
            .countdown-item {
                text-align: center;
            }
            .countdown-number {
                display: block;
                font-size: 2.5rem;
                font-weight: 700;
                color: white;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .countdown-label {
                display: block;
                font-size: 0.9rem;
                color: rgba(255,255,255,0.8);
                margin-top: 0.5rem;
            }
            .countdown-finished {
                font-size: 1.8rem;
                color: white;
                font-weight: 600;
                animation: pulse 2s ease-in-out infinite;
            }
            @media (max-width: 768px) {
                .countdown-numbers { gap: 1rem; }
                .countdown-number { font-size: 2rem; }
            }
        `;
        document.head.appendChild(style);
    }
    
    return countdownDiv;
}

// 簡易的な天気ウィジェット（静的表示）
function initWeatherWidget() {
    const weatherWidget = createWeatherWidget();
    if (!weatherWidget) return;
    
    // 静的な天気情報表示（実際のAPIは使用せず）
    weatherWidget.innerHTML = `
        <div class="weather-widget">
            <h4>10月15日の天気予報</h4>
            <div class="weather-info">
                <div class="weather-icon">☀️</div>
                <div class="weather-details">
                    <div class="weather-temp">23°C</div>
                    <div class="weather-desc">晴れ</div>
                    <div class="weather-note">祭り日和です！</div>
                </div>
            </div>
        </div>
    `;
}

function createWeatherWidget() {
    const noticeSection = document.querySelector('.notice-section .content-wrapper');
    if (!noticeSection) return null;
    
    const weatherDiv = document.createElement('div');
    weatherDiv.className = 'weather-section';
    noticeSection.appendChild(weatherDiv);
    
    // CSS追加
    if (!document.querySelector('#weather-styles')) {
        const style = document.createElement('style');
        style.id = 'weather-styles';
        style.textContent = `
            .weather-section {
                margin-top: 3rem;
            }
            .weather-widget {
                background: linear-gradient(135deg, #87CEEB 0%, #4682B4 100%);
                color: white;
                padding: 1.5rem;
                border-radius: 12px;
                text-align: center;
                max-width: 300px;
                margin: 0 auto;
                box-shadow: 0 4px 15px rgba(70, 130, 180, 0.3);
            }
            .weather-widget h4 {
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            .weather-info {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
            }
            .weather-icon {
                font-size: 3rem;
            }
            .weather-temp {
                font-size: 1.8rem;
                font-weight: 600;
                margin-bottom: 0.3rem;
            }
            .weather-desc {
                font-size: 1rem;
                margin-bottom: 0.3rem;
            }
            .weather-note {
                font-size: 0.8rem;
                opacity: 0.9;
            }
        `;
        document.head.appendChild(style);
    }
    
    return weatherDiv;
}
