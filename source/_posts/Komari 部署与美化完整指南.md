---
title: Komari 部署与美化完整指南
---

- - ## 一、系统环境要求
  
    - 操作系统：Debian 12
    - 用户权限：root 或具备 sudo 权限的用户
  
    ## 二、Komari 安装步骤
  
    ### 1. 下载安装脚本
  
    ```
    curl -fsSL https://raw.githubusercontent.com/komari-monitor/komari/main/install-komari.sh -o install-komari.sh
    ```
  
    
  
    ### 2. 添加执行权限
  
    ```
    chmod +x install-komari.sh
    ```
  
    
  
    ### 3. 执行安装脚本
  
    ```
    sudo ./install-komari.sh
    ```
  
    安装过程中将自动完成依赖安装与系统配置，无需人工干预。
  
    ## 三、查找 Komari 安装目录
  
    安装完成后，可通过以下命令定位 Komari 的实际安装路径：
  
    ```
    sudo find / -type d -name "komari" 2>/dev/null
    ```
  
    默认情况下，Komari 通常安装在：
  
    /opt/komari
  
    ## 四、修改管理员密码
  
    ### 1. 进入 Komari 目录
  
    ```
    cd /opt/komari
    ```
  
    
  
    ### 2. 执行密码修改命令
  
    ```
    ./komari chpasswd -p 你的新密码
    ```
  
    示例：
  
    ```
    ./komari chpasswd -p Ab890725
    ```
  
    
  
    ### 3. 重启服务生效
  
    sudo reboot
  
    ## 五、验证安装状态
  
    服务器重启后，可通过浏览器访问 Komari 控制面板：
  
    - 访问地址：http://你的服务器IP:3000（以安装输出为准）
    - 默认用户名：admin
    - 密码：你刚刚设置的新密码
  
    注意事项：
  
    - 确保防火墙已放行 Komari 使用的端口
    - 建议首次登录后立即完成安全配置
    - 可定期检查 Komari 日志以确认运行状态
  
    ## 六、Komari 前端美化与功能增强
  
    以下内容为 Komari 探针自定义代码，可用于 **隐藏默认元素、固定顶部服务器名称、增加流量进度条、优化价格与流量展示逻辑**。
  
    ### 1. 自定义 Head 脚本
  
    将以下代码插入 Komari 页面 Head 区域：
  
    ```
    <script>
    (function() {
      // 配置
      var CONFIG = {
        interval: 60000,
        apiUrl: '/api/rpc2',
        trafficTolerance: 0.10
      };
    
      // 注入样式
      var style = document.createElement('style');
      style.textContent = '.server-footer-name>div:first-child{visibility:hidden!important}.server-footer-theme{display:none!important}';
      document.head.appendChild(style);
    
      // 全局配置
      window.CustomDesc = "BITJEBE's Node";
      window.ShowNetTransfer = true;
      window.DisableAnimatedMan = true;
      window.FixedTopServerName = true;
    
      // 工具函数
      var UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
      var UNIT_MAP = { KIB: 1024, MIB: 1048576, GIB: 1073741824, TIB: 1099511627776 };
      var CYCLE_MAP = { 30: '月', 92: '季', 184: '半年', 365: '年', 730: '二年', 1095: '三年', 1825: '五年' };
    
      function formatBytes(bytes) {
        if (!bytes) return { value: '0', unit: 'B' };
        var i = Math.floor(Math.log(bytes) / Math.log(1024));
        return { value: (bytes / Math.pow(1024, i)).toFixed(2), unit: UNITS[i] };
      }
    
      function formatTime(s) {
        if (!s) return 'N/A';
        try {
          return new Date(s).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } catch (e) { return 'N/A'; }
      }
    
      function getCycleText(c) {
        if (!c || c <= 0) return c === -1 || c === 0 ? '一次性' : '年';
        for (var days in CYCLE_MAP) {
          if (Math.abs(c - days) <= 3) return CYCLE_MAP[days];
        }
        var y = Math.round(c / 365);
        return y >= 1 && y <= 10 ? y + '年' : '年';
      }
    
      function calcResetDays(expiredAt) {
        if (!expiredAt) return 'N/A';
        try {
          var day = new Date(expiredAt).getDate(), now = new Date();
          var reset = new Date(now.getFullYear(), now.getMonth(), day);
          if (reset <= now) reset.setMonth(reset.getMonth() + 1);
          return Math.ceil((reset - now) / 86400000) + '日';
        } catch (e) { return 'N/A'; }
      }
    
      function parseTraffic(text) {
        var m = text.match(/([\d.]+)\s*(GiB|MiB|TiB|KiB)/i);
        return m ? parseFloat(m[1]) * (UNIT_MAP[m[2].toUpperCase()] || 1) : null;
      }
    
      function normName(n) { return n.toUpperCase().replace(/[^A-Z0-9-]/g, ''); }
    
      function getColor(p) { return 'hsl(' + ((100 - p) * 1.4) + ',70%,50%)'; }
    
      // 渲染器
      var barCache = new Map();
    
      function createBar(d) {
        var uf = formatBytes(d.used), tf = formatBytes(d.limit);
        var pc = Math.min(100, d.used / d.limit * 100).toFixed(2);
        var div = document.createElement('div');
        div.className = 'space-y-1.5 traffic-bar';
        div.dataset.uuid = d.uuid;
        div.style.width = '100%';
        div.innerHTML = 
          '<div class="flex items-center justify-between">' +
            '<div class="flex items-baseline gap-1">' +
              '<span class="text-[10px] font-medium text-neutral-800 dark:text-neutral-200 used-val">' + uf.value + '</span>' +
              '<span class="text-[10px] font-medium text-neutral-800 dark:text-neutral-200 used-unit">' + uf.unit + '</span>' +
              '<span class="text-[10px] text-neutral-500 dark:text-neutral-400">/ ' + tf.value + ' ' + tf.unit + '</span>' +
            '</div>' +
            '<div class="text-[10px] font-medium text-neutral-600 dark:text-neutral-300 percent-val">' + pc + '%</div>' +
          '</div>' +
          '<div class="relative h-1.5" style="width:100%">' +
            '<div class="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-full"></div>' +
            '<div class="absolute inset-0 rounded-full transition-all duration-300 progress-bar" style="width:' + pc + '%;background-color:' + getColor(parseFloat(pc)) + '"></div>' +
          '</div>' +
          '<div class="flex items-center justify-between">' +
            '<div class="text-[10px] text-neutral-500 dark:text-neutral-400 update-time">更新于: ' + formatTime(d.next_update) + '</div>' +
            '<div class="text-[10px] text-neutral-500 dark:text-neutral-400 reset-date">距离流量重置: ' + d.reset_date + '</div>' +
          '</div>';
        return div;
      }
    
      function updateBar(el, d) {
        var uf = formatBytes(d.used);
        var pc = Math.min(100, d.used / d.limit * 100).toFixed(2);
        el.querySelector('.used-val').textContent = uf.value;
        el.querySelector('.used-unit').textContent = uf.unit;
        el.querySelector('.percent-val').textContent = pc + '%';
        el.querySelector('.update-time').textContent = '更新于: ' + formatTime(d.next_update);
        el.querySelector('.reset-date').textContent = '距离流量重置: ' + d.reset_date;
        var bar = el.querySelector('.progress-bar');
        bar.style.width = pc + '%';
        bar.style.backgroundColor = getColor(parseFloat(pc));
      }
    
      function fixPrice(container, d) {
        if (!d.price || d.billing_cycle == null) return;
        var text = '价格: ' + (d.currency || '$') + d.price + '/' + getCycleText(d.billing_cycle);
        var ps = container.getElementsByTagName('p');
        for (var i = 0; i < ps.length; i++) {
          if (ps[i].textContent.indexOf('价格:') !== -1) ps[i].textContent = text;
        }
      }
    
      function getCardTraffic(container) {
        var divs = container.querySelectorAll('.inline-flex');
        var up = null, down = null;
        for (var i = 0; i < divs.length; i++) {
          var t = divs[i].textContent;
          if (t.indexOf('上传') !== -1) up = parseTraffic(t);
          else if (t.indexOf('下载') !== -1) down = parseTraffic(t);
        }
        return up && down ? { up: up, down: down } : null;
      }
    
      function matchCard(candidates, d) {
        if (candidates.length === 1) return candidates[0];
        var best = null, bestDiff = Infinity;
        for (var i = 0; i < candidates.length; i++) {
          var traffic = getCardTraffic(candidates[i].closest('div'));
          if (!traffic) continue;
          var upDiff = Math.abs(traffic.up - d.net_total_up) / Math.max(d.net_total_up, 1);
          var downDiff = Math.abs(traffic.down - d.net_total_down) / Math.max(d.net_total_down, 1);
          if (upDiff < CONFIG.trafficTolerance && downDiff < CONFIG.trafficTolerance) {
            var avg = (upDiff + downDiff) / 2;
            if (avg < bestDiff) { best = candidates[i]; bestDiff = avg; }
          }
        }
        return best || candidates[0];
      }
    
      function render(list) {
        var sections = document.querySelectorAll('section.grid.items-center.gap-2');
        var used = new Set();
    
        for (var i = 0; i < list.length; i++) {
          var d = list[i];
          if (!d.limit || !d.used) continue;
    
          var norm = normName(d.name);
          var candidates = [];
          for (var j = 0; j < sections.length; j++) {
            if (used.has(sections[j])) continue;
            var nameEl = sections[j].querySelector('p');
            if (nameEl && normName(nameEl.textContent.trim()) === norm) candidates.push(sections[j]);
          }
          if (!candidates.length) continue;
    
          var target = matchCard(candidates, d);
          used.add(target);
    
          var container = target.closest('div');
          fixPrice(container, d);
    
          // 找到上传下载的 section 作为插入点
          var uploadDownloadSec = null;
          var allSections = container.querySelectorAll('section.flex.items-center.w-full.justify-between.gap-1');
          for (var k = 0; k < allSections.length; k++) {
            if (allSections[k].textContent.indexOf('上传:') !== -1 && allSections[k].textContent.indexOf('下载:') !== -1) {
              uploadDownloadSec = allSections[k];
              break;
            }
          }
          
          if (!uploadDownloadSec) continue;
    
          // 检查是否已存在进度条（防止重复）
          var existingBar = container.querySelector('.traffic-bar[data-uuid="' + d.uuid + '"]');
          
          if (existingBar) {
            // 已存在，只更新数据
            updateBar(existingBar, d);
          } else {
            // 不存在，创建新的
            var bar = createBar(d);
            uploadDownloadSec.parentNode.insertBefore(bar, uploadDownloadSec.nextSibling);
            barCache.set(d.uuid, bar);
          }
        }
      }
    
      // 数据管理
      var dataCache = null, loading = false;
    
      function rpc(method, params) {
        return fetch(CONFIG.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ id: Date.now(), method: method, params: params || {}, jsonrpc: '2.0' })
        }).then(function(r) { return r.json(); });
      }
    
      function calcUsed(up, down, type) {
        if (type === 'max') return Math.max(up, down);
        if (type === 'min') return Math.min(up, down);
        if (type === 'up') return up;
        if (type === 'down') return down;
        return up + down;
      }
    
      function fetchData(cb) {
        var now = Date.now();
        if (dataCache && now - dataCache.time < CONFIG.interval) { cb(dataCache.data); return; }
        if (loading) return;
        loading = true;
    
        rpc('common:getNodes').then(function(res) {
          var nodes = Object.values(res.result || res.data || {});
          return Promise.all(nodes.map(function(n) {
            return rpc('common:getNodeRecentStatus', { uuid: n.uuid, limit: 1 }).then(function(sr) {
              var rec = ((sr.result || sr.data || {}).records || [])[0] || {};
              var up = rec.net_total_up || 0, down = rec.net_total_down || 0;
              return {
                name: n.name, uuid: n.uuid,
                limit: n.traffic_limit || 0,
                used: calcUsed(up, down, n.traffic_limit_type || 'sum'),
                next_update: rec.time,
                reset_date: calcResetDays(n.expired_at),
                price: n.price, currency: n.currency, billing_cycle: n.billing_cycle,
                net_total_up: up, net_total_down: down
              };
            }).catch(function() {
              return {
                name: n.name, uuid: n.uuid, limit: n.traffic_limit || 0, used: 0,
                next_update: null, reset_date: calcResetDays(n.expired_at),
                price: n.price, currency: n.currency, billing_cycle: n.billing_cycle,
                net_total_up: 0, net_total_down: 0
              };
            });
          }));
        }).then(function(data) {
          dataCache = { time: now, data: data };
          cb(data);
        }).finally(function() { loading = false; });
      }
    
      // 观察器 - 优化防止频繁触发
      var observer = null, timer = null, renderPending = false;
    
      function update() { fetchData(render); }
    
      function scheduleRender() {
        if (renderPending) return;
        renderPending = true;
        setTimeout(function() {
          renderPending = false;
          update();
        }, 300);
      }
    
      function init() {
        if (observer) return;
        
        observer = new MutationObserver(scheduleRender);
        observer.observe(document.body, { childList: true, subtree: true });
        
        update();
        timer = setInterval(update, CONFIG.interval);
        
        window.addEventListener('beforeunload', function() {
          if (observer) observer.disconnect();
          if (timer) clearInterval(timer);
          barCache.clear();
        }, { once: true });
      }
    
      // 启动
      function tryInit() {
        if (document.querySelector('section.grid[class*="grid-cols-"]')) {
          requestAnimationFrame(init);
        } else {
          setTimeout(tryInit, 250);
        }
      }
    
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit, { once: true });
      } else {
        tryInit();
      }
    })();
    </script>
    
    ```
  
    
  
    ### 2. 自定义 Body 脚本（流量进度条与数据增强）
  
    以下脚本用于动态获取节点流量数据，并在卡片中插入可视化进度条，同时修正价格、流量周期与重置时间展示逻辑。
  
    ```
    <script>
    (function() {
      // 配置
      var CONFIG = {
        interval: 60000,
        apiUrl: '/api/rpc2',
        trafficTolerance: 0.10
      };
    
      // 注入样式
      var style = document.createElement('style');
      style.textContent = '.server-footer-name>div:first-child{visibility:hidden!important}.server-footer-theme{display:none!important}';
      document.head.appendChild(style);
    
      // 全局配置
      window.CustomDesc = "BITJEBE's Node";
      window.ShowNetTransfer = true;
      window.DisableAnimatedMan = true;
      window.FixedTopServerName = true;
    
      // 工具函数
      var UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
      var UNIT_MAP = { KIB: 1024, MIB: 1048576, GIB: 1073741824, TIB: 1099511627776 };
      var CYCLE_MAP = { 30: '月', 92: '季', 184: '半年', 365: '年', 730: '二年', 1095: '三年', 1825: '五年' };
    
      function formatBytes(bytes) {
        if (!bytes) return { value: '0', unit: 'B' };
        var i = Math.floor(Math.log(bytes) / Math.log(1024));
        return { value: (bytes / Math.pow(1024, i)).toFixed(2), unit: UNITS[i] };
      }
    
      function formatTime(s) {
        if (!s) return 'N/A';
        try {
          return new Date(s).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } catch (e) { return 'N/A'; }
      }
    
      function getCycleText(c) {
        if (!c || c <= 0) return c === -1 || c === 0 ? '一次性' : '年';
        for (var days in CYCLE_MAP) {
          if (Math.abs(c - days) <= 3) return CYCLE_MAP[days];
        }
        var y = Math.round(c / 365);
        return y >= 1 && y <= 10 ? y + '年' : '年';
      }
    
      function calcResetDays(expiredAt) {
        if (!expiredAt) return 'N/A';
        try {
          var day = new Date(expiredAt).getDate(), now = new Date();
          var reset = new Date(now.getFullYear(), now.getMonth(), day);
          if (reset <= now) reset.setMonth(reset.getMonth() + 1);
          return Math.ceil((reset - now) / 86400000) + '日';
        } catch (e) { return 'N/A'; }
      }
    
      function parseTraffic(text) {
        var m = text.match(/([\d.]+)\s*(GiB|MiB|TiB|KiB)/i);
        return m ? parseFloat(m[1]) * (UNIT_MAP[m[2].toUpperCase()] || 1) : null;
      }
    
      function normName(n) { return n.toUpperCase().replace(/[^A-Z0-9-]/g, ''); }
    
      function getColor(p) { return 'hsl(' + ((100 - p) * 1.4) + ',70%,50%)'; }
    
      // 渲染器
      var barCache = new Map();
    
      function createBar(d) {
        var uf = formatBytes(d.used), tf = formatBytes(d.limit);
        var pc = Math.min(100, d.used / d.limit * 100).toFixed(2);
        var div = document.createElement('div');
        div.className = 'space-y-1.5 traffic-bar';
        div.dataset.uuid = d.uuid;
        div.style.width = '100%';
        div.innerHTML = 
          '<div class="flex items-center justify-between">' +
            '<div class="flex items-baseline gap-1">' +
              '<span class="text-[10px] font-medium text-neutral-800 dark:text-neutral-200 used-val">' + uf.value + '</span>' +
              '<span class="text-[10px] font-medium text-neutral-800 dark:text-neutral-200 used-unit">' + uf.unit + '</span>' +
              '<span class="text-[10px] text-neutral-500 dark:text-neutral-400">/ ' + tf.value + ' ' + tf.unit + '</span>' +
            '</div>' +
            '<div class="text-[10px] font-medium text-neutral-600 dark:text-neutral-300 percent-val">' + pc + '%</div>' +
          '</div>' +
          '<div class="relative h-1.5" style="width:100%">' +
            '<div class="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-full"></div>' +
            '<div class="absolute inset-0 rounded-full transition-all duration-300 progress-bar" style="width:' + pc + '%;background-color:' + getColor(parseFloat(pc)) + '"></div>' +
          '</div>' +
          '<div class="flex items-center justify-between">' +
            '<div class="text-[10px] text-neutral-500 dark:text-neutral-400 update-time">更新于: ' + formatTime(d.next_update) + '</div>' +
            '<div class="text-[10px] text-neutral-500 dark:text-neutral-400 reset-date">距离流量重置: ' + d.reset_date + '</div>' +
          '</div>';
        return div;
      }
    
      function updateBar(el, d) {
        var uf = formatBytes(d.used);
        var pc = Math.min(100, d.used / d.limit * 100).toFixed(2);
        el.querySelector('.used-val').textContent = uf.value;
        el.querySelector('.used-unit').textContent = uf.unit;
        el.querySelector('.percent-val').textContent = pc + '%';
        el.querySelector('.update-time').textContent = '更新于: ' + formatTime(d.next_update);
        el.querySelector('.reset-date').textContent = '距离流量重置: ' + d.reset_date;
        var bar = el.querySelector('.progress-bar');
        bar.style.width = pc + '%';
        bar.style.backgroundColor = getColor(parseFloat(pc));
      }
    
      function fixPrice(container, d) {
        if (!d.price || d.billing_cycle == null) return;
        var text = '价格: ' + (d.currency || '$') + d.price + '/' + getCycleText(d.billing_cycle);
        var ps = container.getElementsByTagName('p');
        for (var i = 0; i < ps.length; i++) {
          if (ps[i].textContent.indexOf('价格:') !== -1) ps[i].textContent = text;
        }
      }
    
      function getCardTraffic(container) {
        var divs = container.querySelectorAll('.inline-flex');
        var up = null, down = null;
        for (var i = 0; i < divs.length; i++) {
          var t = divs[i].textContent;
          if (t.indexOf('上传') !== -1) up = parseTraffic(t);
          else if (t.indexOf('下载') !== -1) down = parseTraffic(t);
        }
        return up && down ? { up: up, down: down } : null;
      }
    
      function matchCard(candidates, d) {
        if (candidates.length === 1) return candidates[0];
        var best = null, bestDiff = Infinity;
        for (var i = 0; i < candidates.length; i++) {
          var traffic = getCardTraffic(candidates[i].closest('div'));
          if (!traffic) continue;
          var upDiff = Math.abs(traffic.up - d.net_total_up) / Math.max(d.net_total_up, 1);
          var downDiff = Math.abs(traffic.down - d.net_total_down) / Math.max(d.net_total_down, 1);
          if (upDiff < CONFIG.trafficTolerance && downDiff < CONFIG.trafficTolerance) {
            var avg = (upDiff + downDiff) / 2;
            if (avg < bestDiff) { best = candidates[i]; bestDiff = avg; }
          }
        }
        return best || candidates[0];
      }
    
      function render(list) {
        var sections = document.querySelectorAll('section.grid.items-center.gap-2');
        var used = new Set();
    
        for (var i = 0; i < list.length; i++) {
          var d = list[i];
          if (!d.limit || !d.used) continue;
    
          var norm = normName(d.name);
          var candidates = [];
          for (var j = 0; j < sections.length; j++) {
            if (used.has(sections[j])) continue;
            var nameEl = sections[j].querySelector('p');
            if (nameEl && normName(nameEl.textContent.trim()) === norm) candidates.push(sections[j]);
          }
          if (!candidates.length) continue;
    
          var target = matchCard(candidates, d);
          used.add(target);
    
          var container = target.closest('div');
          fixPrice(container, d);
    
          // 找到上传下载的 section 作为插入点
          var uploadDownloadSec = null;
          var allSections = container.querySelectorAll('section.flex.items-center.w-full.justify-between.gap-1');
          for (var k = 0; k < allSections.length; k++) {
            if (allSections[k].textContent.indexOf('上传:') !== -1 && allSections[k].textContent.indexOf('下载:') !== -1) {
              uploadDownloadSec = allSections[k];
              break;
            }
          }
          
          if (!uploadDownloadSec) continue;
    
          // 检查是否已存在进度条（防止重复）
          var existingBar = container.querySelector('.traffic-bar[data-uuid="' + d.uuid + '"]');
          
          if (existingBar) {
            // 已存在，只更新数据
            updateBar(existingBar, d);
          } else {
            // 不存在，创建新的
            var bar = createBar(d);
            uploadDownloadSec.parentNode.insertBefore(bar, uploadDownloadSec.nextSibling);
            barCache.set(d.uuid, bar);
          }
        }
      }
    
      // 数据管理
      var dataCache = null, loading = false;
    
      function rpc(method, params) {
        return fetch(CONFIG.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ id: Date.now(), method: method, params: params || {}, jsonrpc: '2.0' })
        }).then(function(r) { return r.json(); });
      }
    
      function calcUsed(up, down, type) {
        if (type === 'max') return Math.max(up, down);
        if (type === 'min') return Math.min(up, down);
        if (type === 'up') return up;
        if (type === 'down') return down;
        return up + down;
      }
    
      function fetchData(cb) {
        var now = Date.now();
        if (dataCache && now - dataCache.time < CONFIG.interval) { cb(dataCache.data); return; }
        if (loading) return;
        loading = true;
    
        rpc('common:getNodes').then(function(res) {
          var nodes = Object.values(res.result || res.data || {});
          return Promise.all(nodes.map(function(n) {
            return rpc('common:getNodeRecentStatus', { uuid: n.uuid, limit: 1 }).then(function(sr) {
              var rec = ((sr.result || sr.data || {}).records || [])[0] || {};
              var up = rec.net_total_up || 0, down = rec.net_total_down || 0;
              return {
                name: n.name, uuid: n.uuid,
                limit: n.traffic_limit || 0,
                used: calcUsed(up, down, n.traffic_limit_type || 'sum'),
                next_update: rec.time,
                reset_date: calcResetDays(n.expired_at),
                price: n.price, currency: n.currency, billing_cycle: n.billing_cycle,
                net_total_up: up, net_total_down: down
              };
            }).catch(function() {
              return {
                name: n.name, uuid: n.uuid, limit: n.traffic_limit || 0, used: 0,
                next_update: null, reset_date: calcResetDays(n.expired_at),
                price: n.price, currency: n.currency, billing_cycle: n.billing_cycle,
                net_total_up: 0, net_total_down: 0
              };
            });
          }));
        }).then(function(data) {
          dataCache = { time: now, data: data };
          cb(data);
        }).finally(function() { loading = false; });
      }
    
      // 观察器 - 优化防止频繁触发
      var observer = null, timer = null, renderPending = false;
    
      function update() { fetchData(render); }
    
      function scheduleRender() {
        if (renderPending) return;
        renderPending = true;
        setTimeout(function() {
          renderPending = false;
          update();
        }, 300);
      }
    
      function init() {
        if (observer) return;
        
        observer = new MutationObserver(scheduleRender);
        observer.observe(document.body, { childList: true, subtree: true });
        
        update();
        timer = setInterval(update, CONFIG.interval);
        
        window.addEventListener('beforeunload', function() {
          if (observer) observer.disconnect();
          if (timer) clearInterval(timer);
          barCache.clear();
        }, { once: true });
      }
    
      // 启动
      function tryInit() {
        if (document.querySelector('section.grid[class*="grid-cols-"]')) {
          requestAnimationFrame(init);
        } else {
          setTimeout(tryInit, 250);
        }
      }
    
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit, { once: true });
      } else {
        tryInit();
      }
    })();
    </script>
    
    ```
  
    
  
    ## 七、Komari 通知模板（Telegram）
  
    以下为 Komari 事件通知的 Telegram 模板示例，支持：
  
    - 上线 / 离线通知
    - 异常告警
    - 到期与续费提醒
    - 面板与实例详情按钮跳转
  
    ### 消息发送函数
  
    ```
    async function sendMessage(message, title, instanceId = null) {
      const token = "你的token";
      const chatId = "你的id";
      const panelUrl = "你的域名"; 
    
      if (!token || !chatId) return false;
    
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      
      // 构建交互按钮
      let inline_keyboard = [];
      let row1 = [{ text: "📊 进入面板", url: panelUrl }];
    
      // 这里的路径修正为 /instance/，匹配你提供的格式
      if (instanceId && instanceId !== '未知') {
        row1.push({ 
          text: "🌐 实例详情", 
          url: `${panelUrl}/instance/${instanceId}` 
        });
      }
      
      inline_keyboard.push(row1);
    
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `<b>${title}</b>\n\n${message}`,
          parse_mode: 'HTML',
          reply_markup: { inline_keyboard: inline_keyboard }
        }),
      });
      return resp.ok;
    }
    
    async function sendEvent(event) {
      try {
        // ⏰ 时间转换函数 (处理 CST)
        const getCSTTime = (timeStr) => {
          if (!timeStr || timeStr.startsWith('0001')) return "1-01-01 08:00:00";
          const date = new Date(timeStr.replace(/\.\d+Z$/, 'Z'));
          const cst = new Date(date.getTime() + 8 * 60 * 60 * 1000);
          const f = (n) => n.toString().padStart(2, '0');
          return `${cst.getUTCFullYear()}-${f(cst.getUTCMonth() + 1)}-${f(cst.getUTCDate())} ${f(cst.getUTCHours())}:${f(cst.getUTCMinutes())}:${f(cst.getUTCSeconds())}`;
        };
    
        // 📦 流量单位转换函数
        const formatTraffic = (bytes) => {
          if (!bytes || bytes === 0) return '无限制';
          const gb = bytes / (1024 ** 3);
          if (gb >= 1024) return `${(gb / 1024).toFixed(2)} TB`;
          return `${gb.toFixed(2)} GB`;
        };
    
        // 内存和磁盘格式化函数
        const formatMemory = (bytes) => {
          if (!bytes || bytes === 0) return '0';
          const gb = bytes / (1024 ** 3);
          return gb < 1 ? `${Math.round(gb * 1024)}MB` : `${Math.round(gb)}G`;
        };
    
        const formatSwapMemory = (bytes) => {
          if (!bytes || bytes === 0) return '0';
          const gb = bytes / (1024 ** 3);
          return gb < 1 ? `${Math.round(gb * 1024)}MB` : `${Math.round(gb)}G`;
        };
    
        // IP 地址部分隐藏函数
        const hideIP = (ip) => {
          if (!ip) return '未知';
          const parts = ip.split('.');
          if (parts.length === 4) {
            return `${parts[0]}.${parts[1]}.xxx.xxx`;
          }
          // 对于 IPv6 地址，只显示前半部分
          const v6Parts = ip.split(':');
          return v6Parts.slice(0, 3).join(':') + ':xxxx:xxxx:xxxx';
        };
    
        // 标题映射
        const eventTitles = {
          'Online':  '🟢 服务器上线',
          'Offline': '🔴 服务器离线',
          'Alert':   '⚠️ 异常警报',
          'Renew':   '💰 续费通知',
          'Expire':  '🚨 到期预警',
          'Test':    '🧪 测试通知'
        };
    
        const title = eventTitles[event.event] || '📌 系统通知';
        
        let clientInfo = '';
        let targetInstanceId = null;
    
        if (event.clients && event.clients.length > 0) {
          const c = event.clients[0];
          targetInstanceId = c.uuid;
          
          const region = c.region ? ` [${c.region}]` : '';
          const hiddenIPv4 = hideIP(c.ipv4);
          const hiddenIPv6 = hideIP(c.ipv6);
          
          const mem = c.mem_total ? formatMemory(c.mem_total) : '0';
          const swap = c.swap_total ? formatSwapMemory(c.swap_total) : '0';
          const disk = c.disk_total ? formatMemory(c.disk_total) : '0';
          
          clientInfo += `🖥️服务器：${c.name}${region}\n`;
          clientInfo += `📝配置：${c.cpu_cores || '0'}C / ${mem}${swap !== '0' ? `+${swap}` : ''} / ${disk}\n`;
          clientInfo += `🌐IPv4：${hiddenIPv4}\n`;
          clientInfo += `🌐IPv6：${hiddenIPv6}\n`;
    
          // 流量管家
          const trafficLimit = formatTraffic(c.traffic_limit);
          clientInfo += `📶流量限额：${trafficLimit}${c.traffic_limit_type ? ` (${c.traffic_limit_type})` : ''}\n`;
          
          if (event.event === 'Renew' || event.event === 'Expire') {
             clientInfo += `💰账单：${c.currency || '$'}${c.price || '0'} (${c.billing_cycle || '0'}天/付)\n`;
          }
        } else {
          clientInfo += `🖥️服务器：未知设备\n📝配置：未知\n🌐IPv4：未知\n🌐IPv6：未知\n📶流量限额：未知\n`;
        }
    
        let message = clientInfo;
        message += `\n🗒️状态：${event.event} (${eventTitles[event.event] || '未知'})\n`;
        message += `⌚️时间：${getCSTTime(event.time)} (CST)`;
    
        if (event.message && event.message.trim()) {
          message += `\n\n📄详细描述：\n<i>${event.message}</i>`;
        }
    
        // 发送通知，传入真正的 UUID 以生成正确的按钮链接
        return await sendMessage(message, title, targetInstanceId);
      } catch (error) {
        return await sendMessage(`脚本解析出错: ${error.message}`, '❌ Error');
      }
    }
    
    
    ```
  
    
  
    ## 八、总结
  
    本文完整覆盖了 Komari 的：
  
    - Debian 12 环境部署
    - 安装与验证流程
    - 管理员密码管理
    - 前端 UI 与流量展示增强
    - Telegram 通知模板
  
    适合作为 Komari 的长期使用文档或二次定制基础。如后续需要：
  
    - 拆分 JS 模块
    - 自定义主题样式
    - 对接更多通知渠道
  
    可在此结构上持续扩展。
