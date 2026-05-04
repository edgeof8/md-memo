# md-memo 📌

A zero-dependency, zero-install bookmarklet that converts any web article to clean Markdown with YAML metadata, ready for your PKM tools.

## 🎯 Features

- **One-click extraction**: Click the bookmarklet, get Markdown to clipboard
- **Clean output**: Removes ads, navigation, and clutter using Mozilla Readability
- **Markdown-first**: Converts HTML to clean Markdown with Turndown.js
- **Metadata included**: Adds YAML frontmatter with title, source URL, and date
- **No permissions**: Doesn't need browser extension permissions
- **Privacy-respecting**: All processing happens client-side, nothing sent to servers
- **Fast**: Extraction completes in under 1 second on typical broadband
- **Works offline**: After first load, uses browser cache

## 🚀 Quick Start

### Option 1: Use the Web Setup Page (Easiest)

1. Open [setup.html](setup.html) in your browser
2. Click the **"Copy md-memo Bookmarklet"** button
3. Right-click in your Bookmarks Bar and paste
4. Done! Navigate to any article and click it

### Option 2: Manual Bookmark Creation

1. Create a new bookmark in your browser
2. Name it: `md-memo`
3. Paste the entire bookmarklet code (from [bookmarklet.js](bookmarklet.js)) into the URL field
4. Save and use

## 📖 How to Use

1. Read an article or documentation page you want to save
2. Click the **md-memo** bookmarklet in your Bookmarks Bar
3. See "Extracting..." notification (appears briefly)
4. See "✓ Copied to clipboard!" when complete
5. Paste into your Obsidian vault, Notion database, Logseq journal, or text editor
6. Done! Metadata is already formatted with YAML frontmatter

## 📋 Output Format

The bookmarklet copies this format to your clipboard:

```markdown
---
title: "Article Title Here"
source: https://example.com/article
clipped: 2026-05-04
---

# Article Title Here

Article content in clean Markdown format...
```

This format is instantly compatible with:
- **Obsidian** (frontmatter metadata, note creation)
- **Notion** (can be pasted and formatted as database entry)
- **Logseq** (YAML properties recognized)
- **Hugo/Jekyll** (standard frontmatter)
- **Any Markdown editor**

## 🛠️ How It Works

1. **Content Extraction**: Uses [@mozilla/readability](https://github.com/mozilla/readability) to identify main article content
2. **HTML to Markdown**: Uses [Turndown.js](https://github.com/mixmark-io/turndown) to convert HTML to clean Markdown
3. **Formatting**: Wraps output in YAML frontmatter with metadata
4. **Clipboard**: Uses modern `navigator.clipboard` API to copy to clipboard
5. **Feedback**: Shows toast notifications for status (extracting, copied, errors)

## ⚙️ Configuration

The bookmarklet loads libraries from CDN (via jsDelivr):
- `@mozilla/readability` - Content extraction
- `turndown` - HTML to Markdown conversion

These are minified and cached by your browser, so subsequent uses are very fast.

## 🚨 Troubleshooting

### "md-memo failed: Site CSP blocked script loading"
**Problem**: Website has strict Content Security Policy (CSP) blocking CDN scripts
**Solution**: Try a different article or contact the website owner about CSP policies
**Affected sites**: GitHub, Twitter, some SaaS platforms

### "Clipboard access denied"
**Problem**: Browser blocked clipboard access
**Solution**: A textarea will appear on screen; select and manually copy (Ctrl+C / Cmd+C)

### No content extracted
**Problem**: The page isn't a typical article (e.g., interactive web app)
**Solution**: The bookmarklet copies page title and URL instead; manually copy the relevant content

### Links appear as plain text
**This is normal** — Markdown format preserves links as `[text](url)`. Your PKM tool may display them styled as links.

## 📱 Browser Support

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome/Edge | ✅ | ✅ (via bookmarks menu) |
| Firefox | ✅ | ✅ (via bookmarks menu) |
| Safari | ✅ | ✅ (via bookmarks) |
| Opera | ✅ | ✅ |

**Mobile note**: Bookmarklets work in mobile browsers, but accessing the bookmarks menu may vary. iOS Safari and Android Firefox both support bookmarklets.

## 🔍 What Gets Extracted?

The bookmarklet intelligently extracts:
- ✅ Article/blog post body
- ✅ Headings and structure  
- ✅ Paragraphs
- ✅ Lists
- ✅ Code blocks
- ✅ Images (as Markdown `![alt](url)`)
- ✅ Links (as Markdown `[text](url)`)

**Removed**:
- ❌ Navigation menus
- ❌ Sidebars
- ❌ Ads and trackers
- ❌ Comments sections
- ❌ Footers

## 🎨 Customization

### Want a custom frontmatter template?

Edit [bookmarklet.js](bookmarklet.js) at the section marked `// Format with frontmatter` (around line 130) to modify the YAML structure. For example, add tags:

```javascript
markdown = `---
title: "${title.replace(/"/g, '\\"')}"
source: ${window.location.href}
clipped: ${date}
tags: [inbox, read-later]
---

# ${title}

${markdownContent}
`;
```

Then regenerate your bookmarklet using [setup.html](setup.html).

## 📦 Files Included

- **bookmarklet.js** - Unminified source code (readable, good for customization)
- **setup.html** - Interactive setup page (generates your personalized bookmarklet)
- **test.html** - Local testing playground
- **README.md** - This file

## 🔐 Privacy & Security

- ✅ **No tracking**: No analytics, no data collection
- ✅ **Client-side only**: All processing happens in your browser
- ✅ **No server calls**: Libraries loaded via CDN but no custom endpoints
- ✅ **No permissions needed**: Not a browser extension
- ✅ **Open source**: Audit the code yourself

## 🐛 Known Limitations

1. **CSP-blocked sites** (GitHub, Twitter, etc.) will fail to load libraries from CDN
2. **JavaScript-heavy sites** may have partially rendered content (Readability uses static HTML)
3. **Paywalled articles** - Only content visible in page source is extracted
4. **Dynamic content** - Works best with static/server-rendered pages
5. **PDF rendering** - PDFs viewed in browser may not extract well

## 🚀 Future Ideas (V2+)

- Custom frontmatter templates via setup page
- Image downloading/base64 conversion
- Browser extension version (for better CSP handling)
- Support for more metadata (author, published date, canonical URL)
- Keyboard shortcut alternative to bookmarklet
- Article preview before copying

## 📄 License

MIT License - Use and modify freely

## 🤝 Contributing

Found a bug? Have an improvement? Create an issue or submit a PR!

## 👨‍💻 Made with

- [Mozilla Readability](https://github.com/mozilla/readability) - Smart content extraction
- [Turndown.js](https://github.com/mixmark-io/turndown) - HTML to Markdown conversion
- jsDelivr CDN - Reliable library distribution
- Plain JavaScript - No dependencies, no build step
