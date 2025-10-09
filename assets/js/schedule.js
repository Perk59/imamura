// スケジュールページ専用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Schedule page loaded');
    
    // タイムラインアニメーションの初期化
    initTimelineAnimations();
    
    // 現在時刻との比較表示
    initTimeComparison();
    
    // イベント検索機能
    initEventSearch();
    
    // 印刷機能
    initPrintFunction();
    
    // モーダル初期化
    initModalEvents();
});

// モーダルイベントの初期化
function initModalEvents() {
    const modal = document.getElementById('eventDetailModal');
    const closeBtn = document.querySelector('.modal-close');
    
    console.log('Modal element:', modal);
    console.log('Close button:', closeBtn);
    
    // 閉じるボタンのクリックイベント
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeEventModal();
        });
    }
    
    // モーダル背景クリックで閉じる
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeEventModal();
            }
        });
    }
    
    // ESCキーで閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeEventModal();
        }
    });
}

// イベント詳細表示機能（グローバルスコープで定義）
window.showEventDetail = function(event) {
    console.log('showEventDetail called with:', event);
    
    const modal = document.getElementById('eventDetailModal');
    const modalBody = document.getElementById('eventModalBody');
    
    if (!modal || !modalBody) {
        console.error('モーダル要素が見つかりません');
        console.log('modal:', modal);
        console.log('modalBody:', modalBody);
        return;
    }
    
    const startTime = new Date(event.start_time);
    const endTime = event.end_time ? new Date(event.end_time) : null;
    
    // QRコードセクションの構築
    let qrSection = '';
    if (event.qr_image) {
        // データベースに保存されたQR画像を使用
        qrSection = `
            <div class="event-detail-qr">
                <h4 style="text-align: center; color: #D96941; margin-bottom: 1.5rem; font-size: 1.3rem;">このイベントに参加する</h4>
                <div class="qr-section" style="text-align: center;">
                    <div style="background: white; padding: 1.5rem; border-radius: 10px; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        <img src="/Ima/${event.qr_image}" alt="参加申込QRコード" style="width: 200px; height: 200px; display: block; margin: 0 auto;">
                    </div>
                    <p style="margin-top: 1rem; color: #666; font-size: 0.95rem;">スマートフォンでQRコードを読み取って参加申込み</p>
                </div>
            </div>
        `;
    }
    
    const modalContent = `
        <div class="event-detail-content">
            <div class="event-detail-header">
                <h3 class="event-detail-title">${escapeHtml(event.title)}</h3>
                <div class="event-detail-time">
                    <span class="time-badge-large">開始: ${formatDateTime(startTime)}</span>
                    ${endTime ? `<span class="time-badge-large">終了: ${formatDateTime(endTime)}</span>` : ''}
                </div>
                ${event.location ? `
                <div class="event-detail-location">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    ${escapeHtml(event.location)}
                </div>
                ` : ''}
            </div>
            
            ${event.description ? `
            <div class="event-detail-description">
                ${escapeHtml(event.description).replace(/\n/g, '<br>')}
            </div>
            ` : '<div class="event-detail-description">詳細説明はありません。</div>'}
            
            ${qrSection}
        </div>
    `;
    
    modalBody.innerHTML = modalContent;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    console.log('Modal displayed');
    
    // モーダルアニメーション
    setTimeout(() => {
        const modalContentEl = modal.querySelector('.modal-content');
        if (modalContentEl) {
            modalContentEl.style.animation = 'modalSlideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
    }, 10);
};

// モーダルを閉じる（グローバルスコープで定義）
window.closeEventModal = function() {
    console.log('closeEventModal called');
    const modal = document.getElementById('eventDetailModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// HTMLエスケープ関数
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// 日時フォーマット
function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}

// タイムラインアニメーションの初期化
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
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
    const timeMatch = timeString.match(/(\d{2}):(\d{2})/);
    if (timeMatch) {
        const today = new Date();
        const eventDate = new Date(2025, 9, 15);
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
    if (title && !title.querySelector('.event-status')) {
        title.appendChild(statusElement);
    }
    
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
        
        const searchInput = document.getElementById('eventSearchInput');
        const clearButton = searchContainer.querySelector('.search-clear');
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            filterEvents(query);
            clearButton.style.display = query ? 'block' : 'none';
        });
        
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

// 検索クリア（グローバルスコープで定義）
window.clearSearch = function() {
    const searchInput = document.getElementById('eventSearchInput');
    const clearButton = document.querySelector('.search-clear');
    
    if (searchInput) {
        searchInput.value = '';
        filterEvents('');
        clearButton.style.display = 'none';
        searchInput.focus();
    }
};

// スケジュール印刷機能
function initPrintFunction() {
    const scheduleSection = document.querySelector('.schedule-section .content-wrapper');
    
    if (scheduleSection && !document.querySelector('.print-button')) {
        const printButton = document.createElement('button');
        printButton.className = 'print-button btn btn-secondary';
        printButton.innerHTML = '📄 スケジュールを印刷';
        printButton.onclick = printSchedule;
        printButton.style.marginBottom = '2rem';
        
        scheduleSection.insertBefore(printButton, scheduleSection.firstChild);
    }
}

function printSchedule() {
    window.print();
}

// 現在時刻の更新（1分おき）
setInterval(() => {
    initTimeComparison();
}, 60000);
