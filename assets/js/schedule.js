// イベント詳細表示機能（QRコード対応版）
function showEventDetail(event) {
    const modal = document.getElementById('eventDetailModal');
    if (!modal) {
        console.error('モーダル要素が見つかりません');
        return;
    }
    
    // モーダルを表示
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // スクロール防止
    
    // モーダルの内容を設定
    const content = `
        <div class="event-detail-content">
            // ... モーダルの内容 ...
        </div>
    `;
    
    document.getElementById('eventModalBody').innerHTML = content;
}
    
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
            
            ${qrSection}
        </div>
    `;
    
    const modalBody = document.getElementById('eventModalBody');
    const modal = document.getElementById('eventDetailModal');
    
    if (!modalBody || !modal) {
        console.error('モーダル要素が見つかりません');
        return;
    }
    
    modalBody.innerHTML = content;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // モーダルを確実に中央に配置
    setTimeout(() => {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.position = 'fixed';
            modalContent.style.top = '50%';
            modalContent.style.left = '50%';
            modalContent.style.transform = 'translate(-50%, -50%)';
            modalContent.style.margin = '0';
            modalContent.style.width = '90%';
            modalContent.style.maxWidth = '700px';
            modalContent.style.zIndex = '10001';
        }
    }, 10);
}

function closeEventModal() {
    const modal = document.getElementById('eventDetailModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // スクロールを再有効化
    }
}

// モーダル外クリックで閉じる機能
window.addEventListener('click', function(event) {
    const modal = document.getElementById('eventDetailModal');
    if (modal && event.target === modal) {
        closeEventModal();
    }
});

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeEventModal();
    }
});// スケジュールページ専用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // タイムラインアニメーションの初期化
    initTimelineAnimations();
    
    // 現在時刻との比較表示
    initTimeComparison();
    
    // イベント検索機能
    initEventSearch();
});

// タイムラインアニメーションの初期化
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 遅延アニメーション
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// 現在時刻との比較表示
function initTimeComparison() {
    const eventCards = document.querySelectorAll('.event-card');
    const now = new Date();
    
    eventCards.forEach(card => {
        const timelineItem = card.closest('.timeline-item');
        const timeElement = timelineItem?.querySelector('.start-time');
        
        if (timeElement) {
            const eventTime = parseEventTime(timeElement.textContent);
            
            if (eventTime) {
                const status = getEventStatus(eventTime, now);
                addEventStatus(card, status);
            }
        }
    });
}

// イベント時間をパース
function parseEventTime(timeString) {
    // "HH:MM" 形式を想定
    const timeMatch = timeString.match(/(\d{2}):(\d{2})/);
    if (timeMatch) {
        const today = new Date();
        const eventDate = new Date(2025, 9, 15); // 10月15日（月は0から始まる）
        eventDate.setHours(parseInt(timeMatch[1]), parseInt(timeMatch[2]), 0, 0);
        return eventDate;
    }
    return null;
}

// イベントステータスを取得
function getEventStatus(eventTime, currentTime) {
    const diff = eventTime.getTime() - currentTime.getTime();
    const hoursDiff = diff / (1000 * 60 * 60);
    
    if (hoursDiff < -1) {
        return { type: 'finished', text: '終了' };
    } else if (hoursDiff < 0) {
        return { type: 'happening', text: '開催中' };
    } else if (hoursDiff < 1) {
        const minutesDiff = Math.floor(diff / (1000 * 60));
        return { type: 'soon', text: `${minutesDiff}分後` };
    } else if (hoursDiff < 24) {
        const hoursLeft = Math.floor(hoursDiff);
        return { type: 'today', text: `${hoursLeft}時間後` };
    } else {
        return { type: 'future', text: '予定' };
    }
}

// イベントステータスを表示に追加
function addEventStatus(card, status) {
    const statusElement = document.createElement('div');
    statusElement.className = `event-status event-status-${status.type}`;
    statusElement.textContent = status.text;
    
    const title = card.querySelector('.event-title');
    if (title) {
        title.appendChild(statusElement);
    }
    
    // CSS for event status (if not already added)
    if (!document.querySelector('#event-status-styles')) {
        const style = document.createElement('style');
        style.id = 'event-status-styles';
        style.textContent = `
            .event-status {
                display: inline-block;
                padding: 0.2rem 0.8rem;
                border-radius: 20px;
                font-size: 0.7rem;
                font-weight: 500;
                margin-left: 1rem;
                vertical-align: middle;
            }
            .event-status-finished {
                background: #fee2e2;
                color: #dc2626;
            }
            .event-status-happening {
                background: #dcfce7;
                color: #16a34a;
                animation: pulse 2s infinite;
            }
            .event-status-soon {
                background: #fef3c7;
                color: #d97706;
            }
            .event-status-today {
                background: #dbeafe;
                color: #2563eb;
            }
            .event-status-future {
                background: #f3f4f6;
                color: #6b7280;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
    }
}

// イベント検索機能
function initEventSearch() {
    // 検索ボックスを動的に追加
    const scheduleSection = document.querySelector('.schedule-section .content-wrapper');
    
    if (scheduleSection && !document.querySelector('.event-search')) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'event-search';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" id="eventSearchInput" placeholder="イベントを検索..." class="search-input">
                <button type="button" onclick="clearSearch()" class="search-clear" style="display: none;">&times;</button>
            </div>
        `;
        
        scheduleSection.insertBefore(searchContainer, scheduleSection.firstChild);
        
        // 検索機能の実装
        const searchInput = document.getElementById('eventSearchInput');
        const clearButton = searchContainer.querySelector('.search-clear');
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            filterEvents(query);
            
            clearButton.style.display = query ? 'block' : 'none';
        });
        
        // 検索用CSS追加
        if (!document.querySelector('#search-styles')) {
            const style = document.createElement('style');
            style.id = 'search-styles';
            style.textContent = `
                .event-search {
                    margin-bottom: 2rem;
                    text-align: center;
                }
                .search-box {
                    position: relative;
                    display: inline-block;
                    max-width: 400px;
                    width: 100%;
                }
                .search-input {
                    width: 100%;
                    padding: 0.8rem 2.5rem 0.8rem 1rem;
                    border: 2px solid #ddd;
                    border-radius: 50px;
                    font-size: 1rem;
                    transition: border-color 0.3s ease;
                }
                .search-input:focus {
                    outline: none;
                    border-color: #D96941;
                    box-shadow: 0 0 0 3px rgba(217, 105, 65, 0.1);
                }
                .search-clear {
                    position: absolute;
                    right: 0.8rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    color: #666;
                    cursor: pointer;
                    padding: 0.2rem;
                }
                .search-clear:hover {
                    color: #333;
                }
                .timeline-item.hidden {
                    display: none;
                }
                .no-results {
                    text-align: center;
                    padding: 2rem;
                    color: #666;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// イベントフィルタリング
function filterEvents(query) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    let visibleCount = 0;
    
    timelineItems.forEach(item => {
        const title = item.querySelector('.event-title')?.textContent.toLowerCase() || '';
        const description = item.querySelector('.event-description')?.textContent.toLowerCase() || '';
        const location = item.querySelector('.event-location')?.textContent.toLowerCase() || '';
        
        const isMatch = !query || 
                       title.includes(query) || 
                       description.includes(query) || 
                       location.includes(query);
        
        if (isMatch) {
            item.classList.remove('hidden');
            visibleCount++;
        } else {
            item.classList.add('hidden');
        }
    });
    
    // 結果がない場合のメッセージ表示
    showNoResultsMessage(visibleCount === 0 && query);
}

// 検索結果なしのメッセージ表示
function showNoResultsMessage(show) {
    let noResultsElement = document.querySelector('.no-results');
    
    if (show) {
        if (!noResultsElement) {
            noResultsElement = document.createElement('div');
            noResultsElement.className = 'no-results';
            noResultsElement.innerHTML = '<p>検索条件に一致するイベントが見つかりませんでした。</p>';
            
            const scheduleSection = document.querySelector('.schedule-section .content-wrapper');
            scheduleSection.appendChild(noResultsElement);
        }
        noResultsElement.style.display = 'block';
    } else {
        if (noResultsElement) {
            noResultsElement.style.display = 'none';
        }
    }
}

// 検索クリア
function clearSearch() {
    const searchInput = document.getElementById('eventSearchInput');
    const clearButton = document.querySelector('.search-clear');
    
    if (searchInput) {
        searchInput.value = '';
        filterEvents('');
        clearButton.style.display = 'none';
        searchInput.focus();
    }
}

// 現在時刻の更新（1分おき）
setInterval(() => {
    initTimeComparison();
}, 60000);

// スケジュール印刷機能
function initPrintFunction() {
    // 印刷ボタンを追加
    const scheduleSection = document.querySelector('.schedule-section .content-wrapper');
    const printButton = document.createElement('button');
    printButton.className = 'print-button';
    printButton.innerHTML = '📄 スケジュールを印刷';
    printButton.onclick = printSchedule;
    
    if (scheduleSection) {
        scheduleSection.insertBefore(printButton, scheduleSection.firstChild);
    }
}

function printSchedule() {
    window.print();
}

// ページ読み込み時に印刷機能も初期化
document.addEventListener('DOMContentLoaded', function() {
    initPrintFunction();
});

// イベント詳細表示機能（QRコード対応版）
function showEventDetail(event) {
    const startTime = new Date(event.start_time);
    const endTime = event.end_time ? new Date(event.end_time) : null;
    
    let qrSection = '';
    if (event.qr_url) {
        const qr_data = encodeURIComponent(event.qr_url);
        const qr_image_url = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${qr_data}`;
        
        qrSection = `
            <div class="event-detail-qr">
                <h4>このイベントに参加する</h4>
                <div class="qr-section">
                    <img src="${qr_image_url}" alt="参加申込QRコード" class="qr-code-modal">
                    <p class="qr-instruction">QRコードを読み取って参加申込み</p>
                    <a href="${event.qr_url}" target="_blank" class="qr-direct-link">直接フォームを開く</a>
                </div>
            </div>
        `;
    }
    
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
            
            ${qrSection}
        </div>
    `;
    
    document.getElementById('eventModalBody').innerHTML = content;
    const modal = document.getElementById('eventDetailModal');
    modal.style.display = 'block';
    
    // モーダルを中央に配置（固定位置）
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.position = 'fixed';
    modalContent.style.top = '50%';
    modalContent.style.left = '50%';
    modalContent.style.transform = 'translate(-50%, -50%)';
    modalContent.style.margin = '0';
    modalContent.style.zIndex = '10001';
    
    // スクロールを無効化
    document.body.style.overflow = 'hidden';
    
    // モーダル表示時のアニメーション
    setTimeout(() => {
        modalContent.style.animation = 'modalSlideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }, 10);
}

function closeEventModal() {
    const modal = document.getElementById('eventDetailModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // スクロールを再有効化
}

// モーダル外クリックで閉じる機能を拡張
const originalWindowClick = window.onclick;
window.onclick = function(event) {
    const eventModal = document.getElementById('eventDetailModal');
    
    if (event.target === eventModal) {
        closeEventModal();
    }
    
    // 既存の機能も実行
    if (originalWindowClick) {
        originalWindowClick(event);
    }
}
