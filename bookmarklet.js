/**
 * md-memo Bookmarklet
 * A zero-dependency bookmarklet that extracts article content to Markdown
 * and copies it to the clipboard with metadata.
 */

(function() {
  // Configuration
  const CDN_READABILITY = 'https://cdn.jsdelivr.net/npm/@mozilla/readability@0.4.1/Readability.js';
  const CDN_TURNDOWN = 'https://cdn.jsdelivr.net/npm/turndown@7.1.1/dist/turndown.js';

  /**
   * Show a temporary toast notification
   */
  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 16px 24px;
      border-radius: 4px;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 999999;
      animation: fadeIn 0.3s ease-in;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    // Remove after 2 seconds with fade out
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  /**
   * Show error toast notification
   */
  function showError(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f44336;
      color: white;
      padding: 16px 24px;
      border-radius: 4px;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 999999;
      animation: fadeIn 0.3s ease-in;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Load a script from CDN
   */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  /**
   * Fallback handler when no main content is found
   */
  function handleNoContent() {
    const markdown = `---
title: "${document.title.replace(/"/g, '\\"')}"
source: ${window.location.href}
clipped: ${new Date().toISOString().split('T')[0]}
---

# ${document.title}

[Read original article](${window.location.href})
`;

    return markdown;
  }

  /**
   * Extract and format article content
   */
  async function extractArticle() {
    showToast('Extracting...');

    try {
      // Load required libraries
      await Promise.all([
        loadScript(CDN_READABILITY),
        loadScript(CDN_TURNDOWN)
      ]);

      // Check if libraries loaded
      if (typeof Readability === 'undefined') {
        throw new Error('Readability library failed to load');
      }
      if (typeof TurndownService === 'undefined') {
        throw new Error('Turndown library failed to load');
      }

      // Extract article using Readability
      const documentClone = document.cloneNode(true);
      const reader = new Readability(documentClone);
      const article = reader.parse();

      let markdown;

      if (!article || !article.content) {
        // Fallback if no article content found
        markdown = handleNoContent();
      } else {
        // Convert HTML to Markdown using Turndown
        const turndownService = new TurndownService({
          headingStyle: 'atx',
          codeBlockStyle: 'fenced',
          bulletListMarker: '-'
        });

        const markdownContent = turndownService.turndown(article.content);

        // Format with frontmatter
        const title = article.title || document.title;
        const date = new Date().toISOString().split('T')[0];

        markdown = `---
title: "${title.replace(/"/g, '\\"')}"
source: ${window.location.href}
clipped: ${date}
---

# ${title}

${markdownContent}
`;
      }

      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(markdown);
        showToast('✓ Copied to clipboard!');
      } catch (clipboardError) {
        // Fallback: show textarea for manual copy
        const textarea = document.createElement('textarea');
        textarea.value = markdown;
        textarea.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          max-width: 600px;
          height: 300px;
          padding: 16px;
          border: 2px solid #2196F3;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          z-index: 999999;
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        `;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 999998;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close & Copy Manually';
        closeBtn.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, calc(-50% + 160px));
          padding: 8px 16px;
          background: #2196F3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          z-index: 999999;
        `;

        closeBtn.onclick = () => {
          textarea.remove();
          overlay.remove();
          closeBtn.remove();
        };

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
        showError(`md-memo error: ${error.message}`);
      }
      console.error('md-memo error:', error);
    }
  }

  // Start extraction
  extractArticle();
})();
