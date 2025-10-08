// 管理画面専用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // ハンバーガーメニューの制御
    initAdminHamburgerMenu();
    
    // 削除確認ダイアログ
    initDeleteConfirmation();
    
    // テーブルの行ハイライト
    initTableHighlight();
    
    // フォームの入力補助
    initFormHelpers();
    
    // 自動保存機能
    initAutoSave();
    
    // 統計の更新
    initStatsRefresh();
});

// 管理画面用ハンバーガーメニュー
function initAdminHamburgerMenu() {
    const hamburger = document.querySelector('.admin-hamburger');
    const nav = document.querySelector('.admin-nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // ナビゲーションリンクがクリックされた時にメニューを閉じる
        document.querySelectorAll('.admin-nav a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });

        // メニュー外をクリックした時にメニューを閉じる
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            }
        });

        // ウィンドウリサイズ時にメニュー状態をリセット
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }
}

// 削除確認ダイアログ
function initDeleteConfirmation() {
    document.querySelectorAll('.btn-delete, a[href*="action=delete"]').forEach(button => {
        button.addEventListener('click', function(e) {
            const itemName = this.dataset.itemName || 'この項目';
            const confirmMessage = `本当に${itemName}を削除しますか？\n\nこの操作は取り消すことができません。`;
            
            if (!confirm(confirmMessage)) {
                e.preventDefault();
                return false;
            }
        });
    });
}

// テーブルの行ハイライト
function initTableHighlight() {
    document.querySelectorAll('.admin-table tbody tr').forEach(row => {
        row.addEventListener('click', function() {
            // 既存の選択を解除
            document.querySelectorAll('.admin-table tbody tr.selected').forEach(selectedRow => {
                selectedRow.classList.remove('selected');
            });
            
            // 現在の行を選択
            this.classList.add('selected');
        });
    });
}

// フォームの入力補助
function initFormHelpers() {
    // 日時入力のデフォルト値設定
    const dateTimeInputs = document.querySelectorAll('input[type="datetime-local"]');
    dateTimeInputs.forEach(input => {
        if (!input.value && input.name === 'start_time') {
            // デフォルトで祭り当日の10:00を設定
            const defaultDate = new Date(2025, 9, 15, 10, 0); // 2025年10月15日 10:00
            input.value = defaultDate.toISOString().slice(0, 16);
        }
    });
    
    // 終了時間の自動設定
    const startTimeInput = document.getElementById('start_time');
    const endTimeInput = document.getElementById('end_time');
    
    if (startTimeInput && endTimeInput) {
        startTimeInput.addEventListener('change', function() {
            if (!endTimeInput.value) {
                const startTime = new Date(this.value);
                const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1時間後
                endTimeInput.value = endTime.toISOString().slice(0, 16);
            }
        });
    }
    
    // 文字数制限表示
    document.querySelectorAll('textarea, input[type="text"]').forEach(input => {
        const maxLength = input.maxLength;
        if (maxLength && maxLength > 0) {
            addCharacterCounter(input, maxLength);
        }
    });
}

// 文字数カウンター追加
function addCharacterCounter(input, maxLength) {
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = 'font-size: 0.8rem; color: #666; margin-top: 0.3rem; text-align: right;';
    
    const updateCounter = () => {
        const current = input.value.length;
        counter.textContent = `${current} / ${maxLength}文字`;
        
        if (current > maxLength * 0.9) {
            counter.style.color = '#dc2626';
        } else if (current > maxLength * 0.8) {
            counter.style.color = '#d97706';
        } else {
            counter.style.color = '#666';
        }
    };
    
    input.parentNode.appendChild(counter);
    input.addEventListener('input', updateCounter);
    updateCounter();
}

// 自動保存機能
function initAutoSave() {
    const forms = document.querySelectorAll('form[data-autosave="true"]');
    
    forms.forEach(form => {
        const formId = form.id || 'form_' + Math.random().toString(36).substr(2, 9);
        const storageKey = 'autosave_' + formId;
        
        // 保存されたデータの復元
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(name => {
                    const field = form.querySelector(`[name="${name}"]`);
                    if (field && field.type !== 'password') {
                        field.value = data[name];
                    }
                });
                
                showNotification('下書きデータを復元しました', 'info', 3000);
            } catch (e) {
                console.warn('Failed to restore autosave data:', e);
            }
        }
        
        // 自動保存の設定
        const saveData = () => {
            const formData = new FormData(form);
            const data = {};
            
            for (let [name, value] of formData.entries()) {
                const field = form.querySelector(`[name="${name}"]`);
                if (field && field.type !== 'password' && field.type !== 'hidden') {
                    data[name] = value;
                }
            }
            
            localStorage.setItem(storageKey, JSON.stringify(data));
        };
        
        // 3秒間隔で自動保存
        let saveTimeout;
        form.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveData, 3000);
        });
        
        // 送信時に自動保存データをクリア
        form.addEventListener('submit', () => {
            localStorage.removeItem(storageKey);
        });
    });
}

// 統計の定期更新
function initStatsRefresh() {
    if (window.location.pathname.includes('dashboard.php')) {
        // 5分間隔で統計を更新
        setInterval(refreshStats, 5 * 60 * 1000);
    }
}

function refreshStats() {
    fetch('api/stats.php')
        .then(response => response.json())
        .then(data => {
            // 統計カードの更新
            document.querySelectorAll('.stats-number').forEach((element, index) => {
                if (data.stats && data.stats[index]) {
                    const newValue = data.stats[index].count;
                    const currentValue = parseInt(element.textContent);
                    
                    if (newValue !== currentValue) {
                        animateNumber(element, currentValue, newValue, 1000);
                    }
                }
            });
        })
        .catch(error => {
            console.warn('Failed to refresh stats:', error);
        });
}

// 数字のアニメーション
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.round(start + (end - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// テーブルのソート機能
function initTableSort() {
    document.querySelectorAll('.admin-table th[data-sort]').forEach(header => {
        header.addEventListener('click', function() {
            const table = this.closest('table');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const column = this.dataset.sort;
            const isNumeric = this.dataset.sortType === 'number';
            const currentOrder = this.dataset.sortOrder || 'asc';
            const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
            
            rows.sort((a, b) => {
                const aVal = a.querySelector(`td[data-sort="${column}"]`)?.textContent || '';
                const bVal = b.querySelector(`td[data-sort="${column}"]`)?.textContent || '';
                
                let comparison;
                if (isNumeric) {
                    comparison = parseFloat(aVal) - parseFloat(bVal);
                } else {
                    comparison = aVal.localeCompare(bVal);
                }
                
                return newOrder === 'desc' ? -comparison : comparison;
            });
            
            // ソート結果をテーブルに適用
            rows.forEach(row => tbody.appendChild(row));
            
            // ヘッダーの更新
            table.querySelectorAll('th[data-sort]').forEach(th => {
                th.classList.remove('sort-asc', 'sort-desc');
                th.dataset.sortOrder = '';
            });
            
            this.classList.add(`sort-${newOrder}`);
            this.dataset.sortOrder = newOrder;
        });
    });
}

// エクスポート機能の改善
function enhancedExport(format = 'csv') {
    showLoading(true);
    
    const params = new URLSearchParams(window.location.search);
    params.set('action', `export_${format}`);
    
    fetch(`${window.location.pathname}?${params.toString()}`)
        .then(response => {
            if (!response.ok) throw new Error('Export failed');
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `export_${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showNotification('エクスポートが完了しました', 'success');
        })
        .catch(error => {
            console.error('Export error:', error);
            showNotification('エクスポートに失敗しました', 'error');
        })
        .finally(() => {
            showLoading(false);
        });
}

// バッチ操作の実装
function initBatchOperations() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="selected[]"]');
    const batchActions = document.querySelector('.batch-actions');
    
    if (checkboxes.length === 0) return;
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateBatchActions);
    });
    
    // 全選択チェックボックス
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateBatchActions();
        });
    }
}

function updateBatchActions() {
    const selectedItems = document.querySelectorAll('input[type="checkbox"][name="selected[]"]:checked');
    const batchActions = document.querySelector('.batch-actions');
    
    if (batchActions) {
        if (selectedItems.length > 0) {
            batchActions.style.display = 'block';
            batchActions.querySelector('.selected-count').textContent = selectedItems.length;
        } else {
            batchActions.style.display = 'none';
        }
    }
}

// 初期化時に追加機能を有効化
document.addEventListener('DOMContentLoaded', function() {
    initTableSort();
    initBatchOperations();
});

// スケジュール詳細表示
function showScheduleDetail(schedule) {
    const content = `
        <div class="schedule-detail-content">
            <div class="detail-section">
                <h4>イベント名</h4>
                <div class="detail-value">${schedule.title}</div>
            </div>
            
            <div class="detail-section">
                <h4>開催日時</h4>
                <div class="detail-time-range">
                    <span class="time-badge">開始: ${new Date(schedule.start_time).toLocaleString('ja-JP')}</span>
                    ${schedule.end_time ? `<span class="time-badge">終了: ${new Date(schedule.end_time).toLocaleString('ja-JP')}</span>` : ''}
                </div>
            </div>
            
            <div class="detail-section">
                <h4>開催場所</h4>
                <div class="detail-value">${schedule.location || '場所未設定'}</div>
            </div>
            
            ${schedule.description ? `
            <div class="detail-section">
                <h4>詳細説明</h4>
                <div class="detail-value" style="white-space: pre-wrap; line-height: 1.6;">${schedule.description}</div>
            </div>
            ` : ''}
            
            <div class="detail-section">
                <h4>管理情報</h4>
                <div class="detail-value">
                    登録日時: ${new Date(schedule.created_at).toLocaleString('ja-JP')}<br>
                    ID: ${schedule.id}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('scheduleModalBody').innerHTML = content;
    document.getElementById('scheduleDetailModal').style.display = 'block';
}

function closeScheduleModal() {
    document.getElementById('scheduleDetailModal').style.display = 'none';
}

// モーダル外クリックで閉じる
window.onclick = function(event) {
    const scheduleModal = document.getElementById('scheduleDetailModal');
    const participantModal = document.getElementById('detailModal');
    
    if (event.target === scheduleModal) {
        closeScheduleModal();
    }
    if (event.target === participantModal) {
        closeModal();
    }
}
