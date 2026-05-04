(function() {
  var CDN_READABILITY = 'https://cdn.jsdelivr.net/npm/@mozilla/readability@0.4.1/Readability.js';
  var CDN_TURNDOWN = 'https://cdn.jsdelivr.net/npm/turndown@7.1.1/dist/turndown.js';

  function showToast(message, bg) {
    var t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:' + (bg || '#6366f1') + ';color:#fff;padding:12px 24px;border-radius:8px;z-index:2147483647;font-family:system-ui;font-size:14px;box-shadow:0 10px 25px rgba(0,0,0,0.2);opacity:0;transition:0.3s;';
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(function() { t.style.opacity = '1'; }, 10);
    setTimeout(function() { t.style.opacity = '0'; setTimeout(function() { t.remove(); }, 300); }, 2500);
  }

  function showError(message) {
    showToast(message, '#c62828');
  }

  function loadScript(src) {
    return new Promise(function(resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = function() { reject(new Error('Failed to load ' + src)); };
      document.head.appendChild(script);
    });
  }

  function handleNoContent() {
    return '---\ntitle: "' + document.title.replace(/"/g, '\\"') + '"\nsource: ' + window.location.href + '\nclipped: ' + new Date().toISOString().split('T')[0] + '\n---\n\n# ' + document.title + '\n\n[Read original article](' + window.location.href + ')\n';
  }

  async function extractArticle() {
    showToast('Extracting...');
    try {
      await Promise.all([loadScript(CDN_READABILITY), loadScript(CDN_TURNDOWN)]);

      if (typeof Readability === 'undefined') throw new Error('Readability library failed to load');
      if (typeof TurndownService === 'undefined') throw new Error('Turndown library failed to load');

      var documentClone = document.cloneNode(true);
      var article = new Readability(documentClone).parse();

      var markdown;
      if (!article || !article.content) {
        markdown = handleNoContent();
      } else {
        var turndownService = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });
        var markdownContent = turndownService.turndown(article.content);
        var title = article.title || document.title;
        var date = new Date().toISOString().split('T')[0];
        markdown = '---\ntitle: "' + title.replace(/"/g, '\\"') + '"\nsource: ' + window.location.href + '\nclipped: ' + date + '\n---\n\n# ' + title + '\n\n' + markdownContent + '\n';
      }

      try {
        await navigator.clipboard.writeText(markdown);
        showToast('✓ Copied to clipboard!');
      } catch (clipboardError) {
        var textarea = document.createElement('textarea');
        textarea.value = markdown;
        textarea.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;max-width:600px;height:300px;padding:16px;border:2px solid #2196F3;border-radius:4px;font-family:monospace;font-size:12px;z-index:999999;box-shadow:0 4px 16px rgba(0,0,0,.25)';
        var overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:999998';
        var closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close & Copy Manually';
        closeBtn.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,calc(-50% + 160px));padding:8px 16px;background:#2196F3;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px;z-index:999999';
        closeBtn.onclick = function() { textarea.remove(); overlay.remove(); closeBtn.remove(); };
        document.body.appendChild(overlay);
        document.body.appendChild(textarea);
        document.body.appendChild(closeBtn);
        textarea.select();
        textarea.focus();
        showError('Clipboard access denied. Select text and copy manually.');
      }
    } catch (error) {
      if (error.message.includes('Failed to load')) {
        showError('md-memo failed: Site CSP blocked script loading.');
      } else {
        showError('md-memo error: ' + error.message);
      }
      console.error('md-memo error:', error);
    }
  }

  extractArticle();
})();
