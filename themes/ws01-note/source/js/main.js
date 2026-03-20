document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    const diariesContainer = document.getElementById('diaries-container');
    const searchResultInfo = document.getElementById('search-result-info');
    const themeToggle = document.getElementById('theme-toggle');
    const storageKey = 'ws01-note-theme';

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    const preferredTheme = localStorage.getItem(storageKey) || 'light';
    applyTheme(preferredTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            localStorage.setItem(storageKey, nextTheme);
            applyTheme(nextTheme);
        });
    }
    
    if (searchInput && diariesContainer) {
        let searchTimeout;
        
        function debounce(func, wait) {
            return function(...args) {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
        
        function performSearch() {
            const keyword = searchInput.value.trim().toLowerCase();
            if (clearBtn) clearBtn.style.display = keyword ? 'block' : 'none';
            if (!keyword) {
                showAllItems();
                if (searchResultInfo) searchResultInfo.innerHTML = '';
                return;
            }
            filterItems(keyword);
        }
        
        function showAllItems() {
            diariesContainer.querySelectorAll('.date-section').forEach(section => section.classList.remove('hidden-section'));
            diariesContainer.querySelectorAll('.diary-item').forEach(item => item.classList.remove('hidden'));
        }
        
        function filterItems(keyword) {
            let matchCount = 0;
            diariesContainer.querySelectorAll('.date-section').forEach(section => {
                const items = section.querySelectorAll('.diary-item');
                let sectionHasMatch = false;
                items.forEach(item => {
                    const title = item.getAttribute('data-title') || '';
                    const preview = item.querySelector('.diary-item-preview')?.textContent || '';
                    if (title.toLowerCase().includes(keyword) || preview.toLowerCase().includes(keyword)) {
                        item.classList.remove('hidden');
                        sectionHasMatch = true;
                        matchCount++;
                    } else {
                        item.classList.add('hidden');
                    }
                });
                section.classList.toggle('hidden-section', !sectionHasMatch);
            });

            if (searchResultInfo) {
                searchResultInfo.innerHTML = matchCount > 0
                    ? `搜索“<strong>${escapeHtml(keyword)}</strong>”，找到 <strong>${matchCount}</strong> 篇文章`
                    : `没有找到包含“<strong>${escapeHtml(keyword)}</strong>”的文章`;
            }
        }
        
        function clearSearch() {
            searchInput.value = '';
            if (clearBtn) clearBtn.style.display = 'none';
            performSearch();
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        searchInput.addEventListener('input', debounce(performSearch, 300));
        if (clearBtn) clearBtn.addEventListener('click', clearSearch);
    }
});
