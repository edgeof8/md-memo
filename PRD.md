# PRD: `md-memo` Bookmarklet

## 1. Overview & Problem Statement
**The Problem:** Note-takers, researchers, and developers who use Markdown-based tools (Obsidian, Notion, Logseq) frequently want to save web articles. Existing "web clippers" are heavy browser extensions that require permissions, collect data, or break frequently. Manual copy-pasting grabs unwanted ads, navigation menus, and inline CSS.
**The Solution:** `md-memo` is a zero-dependency, zero-install bookmarklet. With one click, it identifies the core article on a webpage, converts it to clean Markdown, prepends metadata (Title, URL), and copies it to the clipboard. 

## 2. Target Audience
*   Personal Knowledge Management (PKM) enthusiasts (Obsidian, Roam, Logseq users).
*   Developers and researchers who want to quickly pull documentation or tutorials into local markdown files.
*   Users who prefer minimalist, privacy-respecting tools over bloated browser extensions.

## 3. Core User Flow
1. User is reading an article they want to save.
2. User clicks the `md-memo` bookmarklet in their bookmarks bar.
3. The bookmarklet silently injects the necessary parsing scripts via a CDN.
4. A temporary, non-intrusive UI element (a "toast" notification or a screen flash) indicates "Extracting..."
5. The extracted Markdown is written to the user's clipboard.
6. The UI flashes "Copied!" and disappears.

## 4. Functional Requirements

### 4.1 Content Extraction
*   **Library:** Use `@mozilla/readability` (via unpkg or jsdelivr) to strip away ads, navbars, and footers, leaving only the main content.
*   **Implementation Note:** The script *must* pass a clone of the document (`document.cloneNode(true)`) to Readability so it doesn't accidentally mutate or destroy the active webpage.

### 4.2 Markdown Conversion
*   **Library:** Use `turndown.js` (via CDN) to convert the HTML output from Readability into clean Markdown.
*   **Configuration:** `turndown` should be configured for standard Markdown (e.g., heading style: `atx` (`#`), code block style: `fenced` (`` ` ``)).

### 4.3 Output Formatting (The Template)
The final string copied to the clipboard must include standard Frontmatter (YAML) to make it instantly useful for PKM software. 

**Format Draft:**
```markdown
---
title: "{article_title}"
source: {page_url}
clipped: {current_date}
---

# {article_title}

{markdown_content}
```

### 4.4 Clipboard Interaction
*   Use the modern `navigator.clipboard.writeText()` API.
*   Must be executed within a `try/catch` block to handle permissions or context issues.

### 4.5 Visual Feedback
*   Since `navigator.clipboard` is invisible, the bookmarklet must provide feedback.
*   Inject a simple, styled `div` fixed at the top/bottom of the screen displaying "Copied to clipboard!" that automatically removes itself (`.remove()`) after 2 seconds.

## 5. Non-Functional Requirements
*   **Speed:** Execution should take less than 1 second on a standard broadband connection.
*   **Size:** The raw bookmarklet code (before URL encoding) should be minified and as small as possible.
*   **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge). Mobile browser support where bookmarklets are supported (e.g., Safari iOS).

## 6. Edge Cases & Error Handling

| Scenario | Expected Behavior |
| :--- | :--- |
| **Strict Content Security Policy (CSP)** | Some sites (like GitHub or Twitter) have strict CSPs that block injecting scripts from CDNs. The bookmarklet should `catch` the load error and alert the user: `"md-memo failed: Site CSP blocked script loading."` |
| **No "Main Content" found** | If Readability returns `null` (e.g., running it on a dynamic web-app rather than an article), fallback to copying the `document.title` and `window.location.href`. |
| **Clipboard Permission Denied** | If the browser blocks clipboard access, show a fallback `prompt()` or `textarea` containing the markdown so the user can manually `Ctrl+C`. |

## 7. Future / "V2" Considerations
*   **Image Handling:** Turndown currently leaves images as `![alt](url)`. A future version could try to download images or convert them to base64 (though this makes the text massive).
*   **Custom Templates:** Provide a setup page where users can define their own Frontmatter template before generating their bookmarklet (e.g., adding tags like `tags: [inbox, read-later]`).
