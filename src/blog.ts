export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  dateLabel: string;
  summary: string;
  tags: string[];
  readingTime: string;
  html: string;
};

type Frontmatter = {
  title?: string;
  date?: string;
  summary?: string;
  tags?: string[];
};

const rawPosts = import.meta.glob('./posts/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const sanitizeUrl = (value: string) => {
  const trimmed = value.trim();
  if (/^(https?:\/\/|mailto:|tel:|#|\/)/i.test(trimmed)) {
    return trimmed;
  }

  return '#';
};

const toTitleCase = (slug: string) =>
  slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const stripMarkdown = (source: string) =>
  source
    .replace(/^---[\s\S]*?---\n?/m, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[*_>#-]/g, ' ')
    .replace(/\d+\.\s/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getReadingTime = (source: string) => {
  const words = stripMarkdown(source).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

const formatBlogDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const parseFrontmatter = (source: string) => {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    return {
      frontmatter: {} as Frontmatter,
      body: source.trim(),
    };
  }

  const frontmatter: Frontmatter = {};

  for (const line of match[1].split('\n')) {
    const separatorIndex = line.indexOf(':');

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (!rawValue) {
      continue;
    }

    if (key === 'tags') {
      frontmatter.tags = rawValue
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      continue;
    }

    if (key === 'title' || key === 'date' || key === 'summary') {
      frontmatter[key] = rawValue;
    }
  }

  return {
    frontmatter,
    body: match[2].trim(),
  };
};

const renderInlineMarkdown = (source: string) => {
  let html = escapeHtml(source);

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match: string, label: string, href: string) => {
    const safeHref = escapeHtml(sanitizeUrl(href));
    return `<a href="${safeHref}" target="_blank" rel="noreferrer">${label}</a>`;
  });

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  return html;
};

const renderMarkdown = (source: string) => {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      const languageClass = language ? ` class="language-${escapeHtml(language)}"` : '';
      blocks.push(
        `<pre class="blog-post__code"><code${languageClass}>${escapeHtml(codeLines.join('\n'))}</code></pre>`,
      );
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);

    if (headingMatch) {
      const level = Math.min(6, headingMatch[1].length + 1);
      blocks.push(`<h${level}>${renderInlineMarkdown(headingMatch[2].trim())}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];

      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ''));
        index += 1;
      }

      blocks.push(`<ul>${items.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];

      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ''));
        index += 1;
      }

      blocks.push(`<ol>${items.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</ol>`);
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines: string[] = [];

      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ''));
        index += 1;
      }

      blocks.push(`<blockquote><p>${renderInlineMarkdown(quoteLines.join(' '))}</p></blockquote>`);
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      blocks.push('<hr />');
      index += 1;
      continue;
    }

    const paragraphLines = [trimmed];
    index += 1;

    while (index < lines.length) {
      const nextLine = lines[index].trim();

      if (
        !nextLine ||
        nextLine.startsWith('```') ||
        /^#{1,6}\s+/.test(nextLine) ||
        /^[-*]\s+/.test(nextLine) ||
        /^\d+\.\s+/.test(nextLine) ||
        /^>\s?/.test(nextLine) ||
        /^---+$/.test(nextLine)
      ) {
        break;
      }

      paragraphLines.push(nextLine);
      index += 1;
    }

    blocks.push(`<p>${renderInlineMarkdown(paragraphLines.join(' '))}</p>`);
  }

  return blocks.join('\n');
};

const buildPost = (path: string, source: string): BlogPost => {
  const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? 'post';
  const { frontmatter, body } = parseFrontmatter(source);
  const title = frontmatter.title ?? toTitleCase(slug);
  const date = frontmatter.date ?? '1970-01-01';
  const summary = frontmatter.summary ?? stripMarkdown(body).slice(0, 180);

  return {
    slug,
    title,
    date,
    dateLabel: formatBlogDate(date),
    summary,
    tags: frontmatter.tags ?? [],
    readingTime: getReadingTime(body),
    html: renderMarkdown(body),
  };
};

export const blogPosts = Object.entries(rawPosts)
  .map(([path, source]) => buildPost(path, source))
  .sort((left, right) => {
    const leftTime = new Date(`${left.date}T00:00:00`).getTime();
    const rightTime = new Date(`${right.date}T00:00:00`).getTime();
    return rightTime - leftTime;
  });

export const getBlogPostBySlug = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);
