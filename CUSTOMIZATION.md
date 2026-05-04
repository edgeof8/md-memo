# Advanced Guide: Customizing md-memo

This guide covers advanced customization options for md-memo. Basic usage is documented in [README.md](README.md).

## Table of Contents

1. [Custom YAML Frontmatter](#custom-yaml-frontmatter)
2. [Modifying Toast Notifications](#modifying-toast-notifications)
3. [Changing Turndown Options](#changing-turndown-options)
4. [Handling Special Sites](#handling-special-sites)
5. [Building a Custom Setup Page](#building-a-custom-setup-page)
6. [Debugging](#debugging)

---

## Custom YAML Frontmatter

### Adding Custom Fields

Edit **bookmarklet.js** around line 130 to modify the frontmatter template:

**Default:**
```javascript
markdown = `---
title: "${title.replace(/"/g, '\\"')}"
source: ${window.location.href}
clipped: ${date}
---

# ${title}

${markdownContent}
`;
```

**With additional fields:**
```javascript
const author = document.querySelector('meta[name="author"]')?.content || 'Unknown';
const description = document.querySelector('meta[name="description"]')?.content || '';

markdown = `---
title: "${title.replace(/"/g, '\\"')}"
source: ${window.location.href}
clipped: ${date}
author: ${author}
tags: [inbox, read-later]
description: "${description.replace(/"/g, '\\"')}"
---

# ${title}

${markdownContent}
`;
```

### Dynamic Tags Based on Domain

```javascript
function getTagsForDomain(url) {
  const domain = new URL(url).hostname;
  
  if (domain.includes('github.com')) return ['code', 'documentation'];
  if (domain.includes('medium.com')) return ['article', 'blog'];
  if (domain.includes('academic')) return ['research', 'paper'];
  return ['inbox'];
}

const tags = getTagsForDomain(window.location.href).map(t => `"${t}"`).join(', ');

markdown = `---
title: "${title.replace(/"/g, '\\"')}"
source: ${window.location.href}
clipped: ${date}
tags: [${tags}]
---

# ${title}

${markdownContent}
`;
```

---

## Modifying Toast Notifications

### Change Toast Position

In the `showToast()` function, modify the `cssText`:

**Top-left:**
```javascript
toast.style.cssText = `
  position: fixed;
  top: 20px;
  left: 20px;
  ...
`;
```

**Bottom-right:**
```javascript
toast.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  ...
`;
```

### Change Toast Duration

In `showToast()`, modify the timeout (currently 2000ms = 2 seconds):

```javascript
setTimeout(() => {
  toast.style.animation = 'fadeOut 0.3s ease-out';
  setTimeout(() => toast.remove(), 300);
}, 4000); // Changed from 2000 to 4000 for 4-second display
```

### Add Sound Notification

Add after the toast appears:

```javascript
const audio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAAA=');
audio.play().catch(() => {}); // catch() prevents errors on muted tabs
```

---

## Changing Turndown Options

The Turndown.js configuration is set around line 105. Here are common customizations:

### Different Heading Style (Setext instead of ATX)

```javascript
const turndownService = new TurndownService({
  headingStyle: 'setext', // Changed from 'atx'
  codeBlockStyle: 'fenced',
  bulletListMarker: '-'
});
```

This converts `# Heading` to:
```
Heading
=======
```

### Different List Markers

```javascript
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '*' // Changed from '-' to '*'
});
```

### Add Horizontal Rule Style

```javascript
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  hr: '---' // or '***' or '___'
});
```

### Custom Filters

```javascript
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

// Remove all links (keep text, remove URL)
turndownService.addRule('removeLinks', {
  filter: 'a',
  replacement: (content) => content
});

// Skip images entirely
turndownService.addRule('skipImages', {
  filter: 'img',
  replacement: () => ''
});
```

---

## Handling Special Sites

### Skip Extraction on Certain Domains

Add this check at the start of `extractArticle()`:

```javascript
async function extractArticle() {
  const blockedDomains = ['github.com', 'twitter.com', 'linkedin.com'];
  const currentDomain = new URL(window.location.href).hostname;
  
  if (blockedDomains.some(domain => currentDomain.includes(domain))) {
    showError('md-memo doesn\'t work well on this site. Try manual copy.');
    return;
  }

  showToast('Extracting...');
  // ... rest of code
}
```

### Custom Content Extraction for Specific Sites

```javascript
function getCustomContent() {
  const domain = new URL(window.location.href).hostname;
  
  if (domain.includes('medium.com')) {
    // Custom extraction for Medium
    return document.querySelector('article')?.innerHTML || null;
  }
  
  if (domain.includes('reddit.com')) {
    // Custom extraction for Reddit
    return document.querySelector('[data-testid="post-container"]')?.innerHTML || null;
  }
  
  return null; // Use default Readability
}
```

Then modify the extraction logic:

```javascript
let article;
const customContent = getCustomContent();

if (customContent) {
  article = {
    title: document.title,
    content: customContent
  };
} else {
  const documentClone = document.cloneNode(true);
  const reader = new Readability(documentClone);
  article = reader.parse();
}
```

---

## Building a Custom Setup Page

### Auto-Generate Bookmarklet with Saved Preferences

Create an enhanced setup page that stores user preferences:

```html
<script>
function savePreferences() {
  const prefs = {
    frontmatterFields: document.querySelector('[name="frontmatterFields"]').value,
    toastDuration: document.querySelector('[name="toastDuration"]').value,
    toastPosition: document.querySelector('[name="toastPosition"]').value,
  };
  
  localStorage.setItem('mdMemoPreferences', JSON.stringify(prefs));
  generateBookmarklet(); // Regenerate with new preferences
}

function generateBookmarklet() {
  const prefs = JSON.parse(localStorage.getItem('mdMemoPreferences') || '{}');
  // Build customized bookmarklet code here
}
</script>
```

---

## Debugging

### Enable Verbose Logging

Add console logging to debug issues:

```javascript
async function extractArticle() {
  showToast('Extracting...');
  console.log('Starting extraction on:', window.location.href);

  try {
    console.log('Loading Readability...');
    await loadScript(CDN_READABILITY);
    console.log('Readability loaded');

    console.log('Loading Turndown...');
    await loadScript(CDN_TURNDOWN);
    console.log('Turndown loaded');

    const documentClone = document.cloneNode(true);
    const reader = new Readability(documentClone);
    const article = reader.parse();
    
    console.log('Article parsed:', { title: article?.title, contentLength: article?.content?.length });

    // ... rest of code
  } catch (error) {
    console.error('Full error stack:', error);
    showError(`md-memo error: ${error.message}`);
  }
}
```

### Browser DevTools

1. Open DevTools (F12)
2. Click the bookmarklet
3. Check Console tab for logs and errors
4. Check Network tab to verify CDN scripts loaded

### Test Different Content Types

- ✅ Blog posts (Medium, Dev.to)
- ✅ News articles (CNN, BBC)
- ✅ Technical documentation (MDN, API docs)
- ✅ Academic papers (ArXiv, ResearchGate)
- ❌ JavaScript-heavy SPAs (may not work well)

---

## Performance Optimization

### Reduce Bundle Size

The current bookmarklet is ~3KB unminified. To reduce further:

1. **Remove CSS animations**: Strip out the `@keyframes` styles
2. **Use shorter variable names**: `showToast` → `st`
3. **Inline utility functions**: Combine related functions
4. **Remove error handling**: For trusted sites only (risky!)

### Cache Libraries Longer

The CDN links use specific versions. To use latest:

```javascript
const CDN_READABILITY = 'https://cdn.jsdelivr.net/npm/@mozilla/readability/Readability.js';
const CDN_TURNDOWN = 'https://cdn.jsdelivr.net/npm/turndown/dist/turndown.js';
```

Note: This may break if library APIs change.

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Script won't load on site | CSP blocks CDN | Try using a CORS proxy or fork libraries locally |
| Toast appears but no extraction | Readability found nothing | Add fallback extraction logic |
| Clipboard empty | Permissions denied | Use fallback textarea method |
| Slow on first use | Libraries loading | First load is slower; subsequent uses are fast |

---

## Next Steps

- Test your customizations on different websites
- Share your custom versions in GitHub discussions
- Consider creating a setup page variant for your custom build
