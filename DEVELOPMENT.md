# Development Guide

## Project Structure

```
md-memo/
├── bookmarklet.js          # Main unminified source code
├── setup.html              # Interactive setup page (generates bookmarklet)
├── test.html               # Test page with sample article
├── README.md               # User documentation
├── CUSTOMIZATION.md        # Advanced customization guide
├── DEVELOPMENT.md          # This file
├── PRD.md                  # Product requirements
├── package.json            # Project metadata
└── LICENSE                 # MIT License
```

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/md-memo.git
   cd md-memo
   ```

2. **Open setup.html in your browser**
   ```bash
   # macOS
   open setup.html
   
   # Windows
   start setup.html
   
   # Linux
   xdg-open setup.html
   ```

3. **Generate your bookmarklet** - Click "Copy md-memo Bookmarklet" and bookmark it

4. **Test on test.html** - Open test.html and click your bookmarklet

## Development Workflow

### Making Changes

1. Edit `bookmarklet.js` with your desired changes
2. Test in a browser by:
   - Opening setup.html
   - It auto-generates a new version from bookmarklet.js
   - Click to copy the bookmarklet
   - Test on test.html or any real website

### Testing Process

```
1. Make change to bookmarklet.js
   ↓
2. Open setup.html in browser
   ↓
3. Copy the generated bookmarklet
   ↓
4. Open test.html (or any article page)
   ↓
5. Click the bookmarklet
   ↓
6. Check console for errors (F12)
   ↓
7. Verify clipboard contains expected Markdown
```

### Browser Testing

Test on multiple browsers:
- **Chrome/Chromium**: Full support
- **Firefox**: Full support
- **Safari**: Full support (macOS and iOS)
- **Edge**: Full support

## Code Structure

### bookmarklet.js Overview

```javascript
// 1. Configuration
CDN_READABILITY     // URL to Mozilla Readability library
CDN_TURNDOWN        // URL to Turndown.js library

// 2. Utility Functions
showToast()         // Display success notification
showError()         // Display error notification
loadScript()        // Dynamically load CDN scripts
handleNoContent()   // Fallback when no article found

// 3. Main Function
extractArticle()    // Core logic:
                    //   - Load libraries
                    //   - Extract content with Readability
                    //   - Convert to Markdown with Turndown
                    //   - Format with YAML frontmatter
                    //   - Copy to clipboard
                    //   - Show feedback

// 4. Execution
extractArticle()    // Run immediately when bookmarklet clicked
```

## Minification & Deployment

### Creating Minified Version

For production, the bookmarklet.js should be minified to reduce size:

```bash
# Using UglifyJS
npm install uglify-js
npx uglifyjs bookmarklet.js -o bookmarklet.min.js -c -m

# Using Terser (recommended)
npm install terser
npx terser bookmarklet.js -o bookmarklet.min.js
```

### URL Encoding

The bookmarklet needs to be URL-encoded for the bookmark:

```javascript
// In Node.js
const fs = require('fs');
const code = fs.readFileSync('bookmarklet.min.js', 'utf8');
const wrapped = `javascript:(${code})()`;
const encoded = wrapped.replace(/"/g, '%22').replace(/\n/g, '').replace(/\s+/g, ' ');
console.log(encoded);
```

The setup.html already handles this automatically.

## Common Development Tasks

### Adding a New Feature

1. **Identify the requirement** - What should the feature do?
2. **Find the right location** - Which function should it modify?
3. **Test on test.html** - Verify it works
4. **Test on real sites** - Try different article types
5. **Update documentation** - Add to README.md or CUSTOMIZATION.md

### Debugging Tips

#### Check if Readability is working
```javascript
// In browser console while testing
console.log(Readability);
// Should return a constructor function
```

#### Check if Turndown is working
```javascript
// In browser console
new TurndownService().turndown('<p>Test</p>');
// Should return 'Test'
```

#### Inspect extracted content
```javascript
// Add this in extractArticle() after Readability parsing
console.log('Article:', article);
console.log('Content length:', article.content.length);
```

#### Check clipboard content
```javascript
// After copying, check what's in clipboard
navigator.clipboard.readText().then(text => console.log(text));
```

### Performance Profiling

```javascript
console.time('md-memo');

// ... bookmarklet code runs here ...

console.timeEnd('md-memo');
// Shows execution time in console
```

## CI/CD Considerations

For future CI/CD setup:

```yaml
# .github/workflows/test.yml (example)
name: Test
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Lint JavaScript
        run: npx eslint bookmarklet.js
      - name: Check file size
        run: |
          SIZE=$(wc -c < bookmarklet.js)
          if [ $SIZE -gt 50000 ]; then
            echo "Bookmarklet too large (max 50KB)"
            exit 1
          fi
```

## Browser Compatibility

### Feature Detection

The bookmarklet uses these modern APIs:

```javascript
navigator.clipboard.writeText()  // Modern clipboard API
document.cloneNode()             // DOM cloning
Promise/async-await              // Modern async
```

**Minimum browser versions:**
- Chrome 66+ (2018)
- Firefox 63+ (2018)
- Safari 13.1+ (2020)
- Edge 79+ (2020)

Older browser support would require:
- Promise polyfill
- TextEncoder for clipboard fallback

## Security Considerations

### Content Security Policy (CSP)

Some sites block external script loading. The bookmarklet handles this with error catching, but there are a few approaches:

1. **Try-catch** (current approach) - Already implemented
2. **CORS proxy** - Route through proxy.cors.sh
3. **Local hosting** - Host libraries locally

### XSS Prevention

The bookmarklet:
- ✅ Uses `.textContent` instead of `.innerHTML` for messages
- ✅ Escapes YAML frontmatter quotes
- ✅ Never `eval()`s user input
- ⚠️ Clones DOM to avoid mutation

### Third-Party Dependencies

Current dependencies loaded from CDN:
- `@mozilla/readability@0.4.1` - Stable, mature library
- `turndown@7.1.1` - Stable, widely used

Both are from trusted sources and shouldn't change unexpectedly.

## Versioning

Use semantic versioning: MAJOR.MINOR.PATCH

- **MAJOR**: Breaking changes (e.g., frontmatter format changes)
- **MINOR**: New features (e.g., new frontmatter fields)
- **PATCH**: Bug fixes (e.g., better CSP handling)

Current version: **1.0.0**

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m "Add my feature"`
6. Push: `git push origin feature/my-feature`
7. Open a Pull Request

## Support & Issues

- **Bug reports**: GitHub Issues with reproduction steps
- **Feature requests**: GitHub Discussions with use cases
- **Questions**: README.md first, then GitHub Discussions

## Resources

- [Mozilla Readability Docs](https://github.com/mozilla/readability)
- [Turndown.js Docs](https://github.com/mixmark-io/turndown)
- [MDN: Bookmarklets](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Examples)
- [Navigator Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard)
- [YAML Spec](https://yaml.org/spec/1.2/spec.html)
