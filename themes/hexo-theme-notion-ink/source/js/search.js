(function () {
  const config = window.NOTION_INK_CONFIG || {};
  const input = document.getElementById('site-search-input');
  const button = document.getElementById('site-search-button');
  const results = document.getElementById('search-results');
  if (!input || !button || !results) return;

  let searchIndex = [];
  let loaded = false;
  let loading = null;

  function stripHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return (div.textContent || div.innerText || '').trim();
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlight(text, keyword) {
    if (!keyword) return text;
    const regex = new RegExp('(' + escapeRegExp(keyword) + ')', 'ig');
    return text.replace(regex, '<mark>$1</mark>');
  }

  function render(items, keyword) {
    if (!keyword) {
      results.hidden = true;
      results.innerHTML = '';
      return;
    }

    results.hidden = false;

    if (!items.length) {
      results.innerHTML = '<div class="search-empty">' + (config.emptyText || '没有找到相关内容') + '</div>';
      return;
    }

    results.innerHTML = items.map(function(item) {
      const excerpt = item.content.slice(0, 120);
      return (
        '<a class="search-result" href="' + item.url + '">' +
          '<div class="search-result__title">' + highlight(item.title, keyword) + '</div>' +
          '<div class="search-result__excerpt">' + highlight(excerpt, keyword) + '</div>' +
        '</a>'
      );
    }).join('');
  }

  function search(keyword) {
    const q = keyword.trim().toLowerCase();
    if (!q) {
      render([], '');
      return;
    }

    const matched = searchIndex.filter(function(item) {
      return item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q);
    }).slice(0, 10);

    render(matched, keyword.trim());
  }

  async function loadJson() {
    const response = await fetch(config.searchPath || '/search.json');
    if (!response.ok) throw new Error('search.json not found');
    const data = await response.json();
    return data.map(function(item) {
      return {
        title: item.title || '未命名文章',
        url: item.url || '#',
        content: stripHTML(item.content || '')
      };
    });
  }

  async function ensureIndex() {
    if (loaded) return searchIndex;
    if (!loading) {
      loading = loadJson().then(function(data) {
        searchIndex = data;
        loaded = true;
        return data;
      }).catch(function() {
        searchIndex = [];
        loaded = true;
        return [];
      });
    }
    return loading;
  }

  async function handleSearch() {
    await ensureIndex();
    search(input.value || '');
  }

  button.addEventListener('click', handleSearch);
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  });
  input.addEventListener('input', function () {
    if (!input.value.trim()) {
      render([], '');
    }
  });
})();
