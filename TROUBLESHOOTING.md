# Troubleshooting Guide

Having issues with md-memo? This guide covers common problems and solutions.

## Installation Issues

### Bookmarklet won't save/appears as plain text

**Problem**: After pasting the bookmarklet code, it appears as a URL instead of executing.

**Solution**:
1. Make sure you pasted into the **URL field** of the bookmark, not the name
2. The URL should start with `javascript:` 
3. Common mistake: Pasting into the "Description" field instead of "URL"

**Steps to fix:**
- Edit the bookmark (right-click → Edit)
- Paste the code into the **Address** or **URL** field
- Leave "Name" as "md-memo"
- Save

### Setup page won't load

**Problem**: setup.html shows blank or doesn't fully load.

**Possible causes & solutions**:

| Cause | Fix |
|-------|-----|
| Opening as file (not via HTTP) | Some browsers block certain features for `file://` URLs. Use a local server: `python -m http.server 8000` then visit `localhost:8000` |
| Browser too old | Try a modern browser (Chrome 66+, Firefox 63+, Safari 13+) |
| JavaScript disabled | Enable JavaScript in browser settings |
| Browser extensions blocking | Try incognito/private mode |

**Quick fix - use local server:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server
```

Then visit: `http://localhost:8000`

---

## Extraction Issues

### Nothing gets extracted

**Problem**: Click the bookmarklet, see "Extracting..." but then nothing happens.

**Possible causes**:

1. **Page is dynamic/JavaScript-heavy**
   - Readability works best on static HTML pages
   - Try a different article
   - Real example: Single Page Apps (Gmail, Twitter) don't work well

2. **Page structure is unusual**
   - Some custom-built sites have non-standard HTML
   - The bookmarklet falls back to title + URL in this case

3. **Main content not detected**
   - Readability can't find a clear "main content" area
   - Result: Fallback showing just title and link

**Check what happened:**
- Open DevTools (F12)
- Go to Console tab
- Click the bookmarklet
- Look for error messages
- Share these with support if needed

**Workaround**: Use Firefox's built-in Reader Mode first, then try the bookmarklet

### "Extracting..." shows but nothing copied

**Problem**: Toast says "Extracting..." but hangs or disappears without "Copied."

**Most likely cause: CDN script loading failed**

This usually means the site blocks external scripts with CSP (Content Security Policy).

**Affected sites**:
- ❌ GitHub.com
- ❌ Twitter.com / X.com
- ❌ LinkedIn.com
- ❌ Facebook.com
- ✅ Most blogs and news sites work fine

**Workaround for CSP-blocked sites**:
1. Copy content manually
2. Paste into your note app
3. Format with frontmatter manually
4. Consider using browser's built-in reader mode first

**Check console for errors**:
```
Right-click → Inspect → Console tab
Click bookmarklet again
Look for messages about "blocked", "CSP", or "CORS"
```

---

## Clipboard Issues

### "Clipboard access denied" appears

**Problem**: Toast shows error, then a textarea dialog appears.

**Cause**: Browser blocked clipboard access (for security/privacy)

**Why it happened**:
- Page is not "trusted" enough (insecure context)
- Browser settings restrict clipboard
- User permissions blocked it

**Solutions in order of preference**:

**Option 1: Use the textarea**
- Text already selected in the dialog
- Press Ctrl+C (Cmd+C on Mac)
- Paste into your note app

**Option 2: Check browser settings**
- Chrome: Settings → Privacy & Security → Site Settings → Clipboard
- Firefox: about:config → `dom.events.clipboardevents.enabled`
- Safari: Preferences → Websites → Clipboard → Allow

**Option 3: Use secure context**
- Page must be HTTPS, not HTTP
- Try on the article's HTTPS version if available

**Option 4: Disable extensions**
- Security extensions sometimes block clipboard
- Try incognito/private mode
- Temporarily disable extensions

### Text copied but looks corrupted

**Problem**: Markdown in clipboard has encoding issues or special characters are wrong.

**Cause**: Character encoding mismatch

**Solution**:
1. Check browser console for warnings
2. Try pasting into different apps (Notepad, Word, etc.)
3. If issue persists, file a bug report with:
   - The article URL
   - Screenshot of console errors
   - Your browser/OS info

---

## Output Issues

### Markdown looks wrong

**Problem**: Converted Markdown has formatting issues.

**Common issues & fixes**:

| Issue | Cause | Fix |
|-------|-------|-----|
| **Headings look like text** | Turndown setting mismatch | Check your bookmarklet version |
| **Links are broken** | Relative URLs | Readability should fix these; if not, links are relative-only |
| **Code blocks mangled** | Site uses custom code style | Fallback: manually format as code blocks |
| **Tables disappeared** | Turndown ignores some tables | Manually copy table, or use [table generator](https://www.tablesgenerator.com/) |
| **Images show as `![](url)`** | This is correct Markdown | Click the `![url]` syntax in your note app to preview |

**Check what was extracted:**
1. When you paste, first check the raw text
2. Look at the Markdown syntax
3. Manually fix if needed
4. Most formatting issues are site-specific

### Frontmatter missing or wrong

**Problem**: YAML frontmatter at top is missing or incomplete.

**Possible causes**:

1. **Using old bookmarklet version**
   - Regenerate from setup.html
   - Make sure to copy the latest version

2. **Metadata extraction failed**
   - Check browser console for errors
   - Some sites hide metadata in JavaScript (not in HTML)

3. **Special characters breaking YAML**
   - Quotes in title might break the syntax
   - The bookmarklet escapes quotes, but unusual characters might still cause issues

**Check your frontmatter syntax**:
```markdown
---
title: "Article Title"        ← Should have quotes
source: https://example.com   ← Should have URL
clipped: 2026-05-04           ← Should have YYYY-MM-DD format
---
```

**Fix manually if needed**:
```markdown
---
title: "Your Title Here"
source: https://actual-url-here.com
clipped: 2026-05-04
---
```

---

## Specific Site Issues

### Reddit posts extract poorly

**Problem**: Reddit posts show little content or miss parts of it.

**Cause**: Reddit uses dynamic JavaScript rendering + rate limiting

**Solution**:
1. Wait a moment before clicking bookmarklet (let page fully render)
2. Try on old.reddit.com instead
3. Consider using Reddit's native save feature instead

**Better workaround**:
```
View in Reddit → Open in browser reader mode → Then try bookmarklet
```

### Medium articles not working

**Problem**: Medium paywall or extraction incomplete.

**Cause**: Medium uses JavaScript heavily; Readability may miss partner program content

**Solution**:
1. Try on Medium's embedded reader first
2. Use medium.com/@username/stories (public stories list)
3. Some paywalled articles can't be extracted (by design)

### Twitter/X posts broken

**Problem**: Bookmarklet fails or extracts nothing from X/Twitter.

**Cause**: X has strict CSP and dynamic content

**Known limitation**: X/Twitter are not supported due to heavy JavaScript rendering and CSP restrictions.

**Workaround**:
1. Use browser's save/share functionality
2. Copy tweet text manually
3. Create your own frontmatter
4. Consider specialized Twitter archiving tools

### Archived/PDF pages

**Problem**: Can't extract from Wayback Machine or PDF viewer.

**Cause**: These are special content types, not HTML articles

**Workaround for Wayback Machine**:
1. Open original URL instead if available
2. Copy from Wayback's rendered HTML
3. Manually format

**For PDFs**:
1. PDFs viewed in browser aren't well-supported
2. Extract text from PDF tool first
3. Paste into your note app
4. The bookmarklet won't work on PDFs

---

## Performance Issues

### Bookmarklet is very slow

**Problem**: "Extracting..." takes 5+ seconds.

**Likely cause**: First-time library loading

**First use**: 
- Takes 1-3 seconds (loading libraries from CDN)
- This is normal

**Subsequent uses**: 
- Should be under 0.5 seconds (using browser cache)
- If still slow, see solutions below

**Solutions**:

1. **Check internet speed**
   - Slow connection = slower CDN loading
   - Try on faster WiFi

2. **Clear browser cache and retry**
   - Chrome: Settings → Clear browsing data
   - Firefox: History → Clear Recent History
   - Restart browser

3. **Check if site is slow**
   - Open DevTools
   - Click bookmarklet
   - Look at Network tab
   - See which scripts are slow

4. **Use offline version**
   - Advanced users can host libraries locally
   - See CUSTOMIZATION.md for details

### Browser tab freezes during extraction

**Problem**: Page becomes unresponsive while "Extracting..." shows.

**Cause**: Large page (100MB+ of content) or very complex HTML

**Solutions**:

1. **Wait longer** - May complete after freeze unfreezes
2. **Try smaller articles** - Simpler pages extract faster
3. **Close other tabs** - Free up browser memory
4. **Restart browser** - Clear memory
5. **Try different browser** - Chrome vs Firefox perform differently

---

## Browser-Specific Issues

### Safari on iOS: Bookmarklet not available

**Problem**: Bookmarklet doesn't appear in share menu or bookmarks.

**Note**: iOS Safari has limited bookmarklet support compared to desktop Safari.

**Workaround**:
1. Use Mac with Safari instead (better support)
2. Copy bookmarklet URL manually
3. Create bookmark on Mac, sync to iPhone

### Firefox on Android: Doesn't work

**Problem**: Clicked bookmarklet but nothing happens.

**Cause**: Firefox Android doesn't fully support bookmarklet JavaScript.

**Workaround**:
1. Use desktop Firefox with the bookmarklet
2. Or use third-party Android apps designed for clipping

### Edge: CSP errors on some sites

**Problem**: "Site CSP blocked script loading" on sites that work in Chrome.

**Cause**: Edge's CSP enforcement is stricter.

**Solution**:
- Try the same site in Chrome
- If it works in Chrome but not Edge, it's a known Edge issue
- Try again later (Edge updates security policies regularly)

---

## Error Messages Explained

| Error Message | Meaning | Fix |
|---------------|---------|-----|
| "md-memo failed: Site CSP blocked script loading" | CDN script couldn't load | Different site or manually copy |
| "Clipboard access denied" | Browser won't let us copy | Use textarea dialog to copy manually |
| "md-memo error: [error text]" | Something went wrong | Check browser console for details |
| "Failed to load [URL]" | CDN is down or blocked | Try again later; check internet |

**How to get more details**:
1. Open Developer Tools (F12)
2. Go to Console tab
3. Click bookmarklet again
4. Look for error messages with full details

---

## Still Have Issues?

### Before reporting a bug, check:

1. ✅ You're using a modern browser (Chrome 66+, Firefox 63+, Safari 13+)
2. ✅ The page is a typical article (not a web app or dynamic SPA)
3. ✅ You've tried on another website
4. ✅ You've checked console for errors (F12)
5. ✅ You've regenerated the bookmarklet from setup.html
6. ✅ Browser caches have been cleared

### Gather this information for bug reports:

```
- Browser: [Chrome/Firefox/Safari] version X.X
- OS: [Windows/Mac/Linux] version X.X
- Article URL: [full URL]
- Steps to reproduce: [exact steps]
- Console errors: [copy full error message]
- Screenshot: [if helpful]
```

### Get help:

- **Documentation**: [README.md](README.md) for basics
- **Advanced guide**: [CUSTOMIZATION.md](CUSTOMIZATION.md) for tweaks
- **Development**: [DEVELOPMENT.md](DEVELOPMENT.md) for technical details
- **Issues**: [GitHub Issues](https://github.com/yourusername/md-memo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/md-memo/discussions)

---

## Quick Debugging Checklist

```javascript
// Paste these in browser console (F12) while troubleshooting:

// Check if bookmarklet ran
console.log('Check console for md-memo messages');

// Test CDN access
fetch('https://cdn.jsdelivr.net/npm/@mozilla/readability@0.4.1/Readability.js')
  .then(r => r.ok ? 'CDN OK' : 'CDN blocked')
  .catch(e => `CDN error: ${e}`);

// Test clipboard
navigator.clipboard.writeText('test')
  .then(() => 'Clipboard OK')
  .catch(e => `Clipboard error: ${e}`);

// Test DOM cloning
document.cloneNode(true) ? 'Cloning OK' : 'Cloning failed';
```

Good luck, and happy clipping! 📌
