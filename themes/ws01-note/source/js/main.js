document.addEventListener('DOMContentLoaded', function() {
    // 搜索功能
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    const diariesContainer = document.getElementById('diaries-container');
    const searchResultInfo = document.getElementById('search-result-info');
    
    if (searchInput) {
        let searchTimeout;
        
        function debounce(func, wait) {
            return function(...args) {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
        
        function performSearch() {
            const keyword = searchInput.value.trim().toLowerCase();
            
            if (keyword) {
                clearBtn.style.display = 'block';
            } else {
                clearBtn.style.display = 'none';
            }
            
            if (!keyword) {
                showAllItems();
                searchResultInfo.innerHTML = '';
                return;
            }
            
            filterItems(keyword);
        }
        
        function showAllItems() {
            const dateSections = diariesContainer.querySelectorAll('.date-section');
            dateSections.forEach(section => {
                section.classList.remove('hidden-section');
            });
            
            const items = diariesContainer.querySelectorAll('.diary-item');
            items.forEach(item => {
                item.classList.remove('hidden');
            });
        }
        
        function filterItems(keyword) {
            let matchCount = 0;
            const dateSections = diariesContainer.querySelectorAll('.date-section');
            
            dateSections.forEach(section => {
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
                
                if (sectionHasMatch) {
                    section.classList.remove('hidden-section');
                } else {
                    section.classList.add('hidden-section');
                }
            });
            
            if (matchCount > 0) {
                searchResultInfo.innerHTML = 
                    `搜索"<strong>${escapeHtml(keyword)}</strong>"，找到 <strong>${matchCount}</strong> 篇日记`;
            } else {
                searchResultInfo.innerHTML = 
                    `没有找到包含"<strong>${escapeHtml(keyword)}</strong>"的日记`;
            }
        }
        
        function clearSearch() {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            performSearch();
        }
        
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        searchInput.addEventListener('input', debounce(performSearch, 300));
        clearBtn.addEventListener('click', clearSearch);
    }
});