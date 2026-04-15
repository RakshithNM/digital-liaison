# Blogging

Blog posts live in `src/posts/` as Markdown files.

## File format

Each post should use this structure:

```md
---
title: Your Post Title
date: 2026-04-15
summary: One short summary sentence for cards and previews.
tags: passports, privacy
---
Your markdown content starts here.
```

## Notes

- The filename becomes the post slug.
- Posts are loaded automatically with Vite through `import.meta.glob`.
- Post URLs are served as clean routes like `/blog/your-post-slug`.
- The blog currently supports headings, paragraphs, links, lists, blockquotes, inline code, and fenced code blocks.
- Dates should be written as `YYYY-MM-DD`.
- External links in posts open in a new tab.
- Netlify SPA fallback is configured through `public/_redirects`.
