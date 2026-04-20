import './style.scss';
import {
  faqs,
  heroHighlights,
  heroPills,
  portalCards,
  privacyPoints,
  processSteps,
  serviceCards,
  testimonials,
  termsPoints,
} from './content';
import { blogPosts, getBlogPostBySlug, type BlogPost } from './blog';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root not found');
}

type Route =
  | { kind: 'home' }
  | { kind: 'blogIndex' }
  | { kind: 'blogPost'; post: BlogPost }
  | { kind: 'blogMissing'; slug: string };

const year = new Date().getFullYear();
const HOME_PATH = '/';
const BLOG_INDEX_PATH = '/blog';
const CONTACT_EMAIL = 'bellare545@gmail.com';
const CONTACT_EMAIL_LINK = `mailto:${CONTACT_EMAIL}?subject=Sahaay%20Digital%20Enquiry`;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const cardIcons: Record<string, string> = {
  passport: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 4.75h7.25A3.75 3.75 0 0 1 18 8.5v10.75H9.75A2.75 2.75 0 0 0 7 22V4.75Z" />
      <path d="M7 4.75h7.25A3.75 3.75 0 0 1 18 8.5" />
      <circle cx="13.15" cy="11.5" r="2.35" />
      <path d="M10.8 11.5h4.7M13.15 9.15c.85.7.85 3 0 4.7M13.15 9.15c-.85.7-.85 3 0 4.7" />
    </svg>
  `,
  voter: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 10.5h14v7.75a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V10.5Z" />
      <path d="m12 4.75-3.4 3.75h6.8L12 4.75Z" />
      <path d="m9.5 15 1.75 1.75L14.75 13" />
    </svg>
  `,
  pan: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4.75" y="6.25" width="14.5" height="11.5" rx="2.25" />
      <circle cx="9.1" cy="11.2" r="1.7" />
      <path d="M12.5 10h3.8M12.5 12.6h3.8M7.6 15.2h8.7" />
    </svg>
  `,
  aadhaar: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19.25s4.75-4.05 4.75-8.05a4.75 4.75 0 1 0-9.5 0c0 4 4.75 8.05 4.75 8.05Z" />
      <circle cx="12" cy="11.25" r="1.7" />
      <path d="M17.2 18.25h2.05M18.225 17.2v2.1" />
    </svg>
  `,
  certificate: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5.25" y="5.25" width="13.5" height="10.75" rx="2" />
      <path d="M9 9.4h6M9 12.1h4.5" />
      <path d="M13.5 16v3.5l-1.5-.9-1.5.9V16" />
    </svg>
  `,
  online: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4.75" y="5.5" width="14.5" height="12.5" rx="2.25" />
      <path d="M8.2 9.4h7.6M8.2 12.2h5.1" />
      <path d="m12.5 14.4 3.65 4.35.2-2.4 2.15-.75-6-3.2Z" />
    </svg>
  `,
};

const renderCardIcon = (icon: string | undefined, className: string) => {
  if (!icon) {
    return '';
  }

  const svg = cardIcons[icon];

  if (!svg) {
    return '';
  }

  return `<span class="${className}__icon" aria-hidden="true">${svg}</span>`;
};

const renderCards = (
  cards: readonly { title: string; body: string; note?: string; icon?: string }[],
  className: string,
) =>
  cards
    .map(
      ({ title, body, note, icon }) => `
        <article class="${className}">
          ${renderCardIcon(icon, className)}
          <h3>${title}</h3>
          <p>${body}</p>
          ${note ? `<p class="${className}__note">${note}</p>` : ''}
        </article>
      `,
    )
    .join('');

const renderList = (items: readonly string[], className: string) =>
  items.map((item) => `<li class="${className}">${item}</li>`).join('');

const renderPills = (items: readonly string[]) =>
  items.map((item) => `<li class="hero-pill">${item}</li>`).join('');

const renderTimeline = (items: readonly { title: string; body: string }[]) =>
  items
    .map(
      ({ title, body }) => `
        <li class="timeline__item">
          <h5 class="timeline__title">${title}</h5>
          <p class="timeline__body">${body}</p>
        </li>
      `,
    )
    .join('');

const renderPortals = () =>
  portalCards
    .map(
      ({ title, href, body }) => `
        <a class="portal-card" href="${href}" target="_blank" rel="noreferrer">
          <span class="portal-card__label">Official Portal</span>
          <h3>${title}</h3>
          <p>${body}</p>
          <span class="portal-card__cta">Open site</span>
        </a>
      `,
    )
    .join('');

const renderFaqs = () =>
  faqs
    .map(
      ({ question, answer }) => `
        <details class="faq-item">
          <summary>${question}</summary>
          <p>${answer}</p>
        </details>
      `,
    )
    .join('');

const renderTestimonials = () =>
  testimonials
    .map(
      ({ quote, author, detail, services }) => `
        <article class="testimonial-card">
          <p class="testimonial-card__eyebrow">Client feedback</p>
          <blockquote class="testimonial-card__quote">
            <p>${quote}</p>
          </blockquote>
          <ul class="testimonial-card__services" aria-label="Services used">
            ${services
              .map((service) => `<li class="testimonial-card__service">${service}</li>`)
              .join('')}
          </ul>
          <p class="testimonial-card__author">${author}</p>
          <p class="testimonial-card__detail">${detail}</p>
        </article>
      `,
    )
    .join('');

const renderBlogTags = (tags: readonly string[]) =>
  tags.length
    ? `
      <ul class="blog-tags" aria-label="Post tags">
        ${tags.map((tag) => `<li class="blog-tag">${tag}</li>`).join('')}
      </ul>
    `
    : '';

const renderBlogCards = (posts: readonly BlogPost[]) =>
  posts.length
    ? `
      <div class="blog-grid">
        ${posts
          .map(
            (post) => `
              <article class="blog-card">
                <p class="blog-card__eyebrow">Blog Post</p>
                <h5 class="blog-card__title">
                  <a href="${BLOG_INDEX_PATH}/${post.slug}">${post.title}</a>
                </h5>
                <p class="blog-card__summary">${post.summary}</p>
                <p class="blog-card__meta">
                  <span>${post.dateLabel}</span>
                  <span>${post.readingTime}</span>
                </p>
                ${renderBlogTags(post.tags)}
                <a class="blog-card__link" href="${BLOG_INDEX_PATH}/${post.slug}">Read post</a>
              </article>
            `,
          )
          .join('')}
      </div>
    `
    : `
      <div class="empty-state">
        <p>No blog posts have been added yet. Create a markdown file in <code>src/posts</code> to publish one.</p>
      </div>
    `;

const renderHeader = (route: Route) => `
  <header class="site-header">
    <a class="brand" href="${HOME_PATH}" aria-label="Sahaay Digital home">
      <span class="brand__text">
        <strong>Sahaay Digital</strong>
        <small>Independent documentation support</small>
      </span>
    </a>
    <nav class="site-nav" aria-label="Primary">
      <a href="/#services">Services</a>
      <a href="/#process">Process</a>
      <a href="/#testimonials">Testimonials</a>
      <a href="/#portals">Portals</a>
      <a href="${BLOG_INDEX_PATH}"${route.kind === 'blogIndex' || route.kind === 'blogPost' ? ' aria-current="page"' : ''}>Blog</a>
      <a href="/#privacy">Privacy</a>
      <a href="/#terms">Terms</a>
      <a href="/#faq">FAQ</a>
      <a class="site-nav__mail" href="${CONTACT_EMAIL_LINK}">Email</a>
    </nav>
  </header>
`;

const renderHomePage = () => `
  <main class="shell">
    <section class="hero section">
      <p class="eyebrow">Passport, voter, and PAN application assistance with clear boundaries.</p>
      <h1>Independent support for document-heavy government workflows.</h1>
      <p class="hero__lede">
        Sahaay Digital helps people understand requirements, organize records, and reduce avoidable mistakes before
        they use an official government portal or visit an office. The service is private assistance only and does
        not present itself as a public authority.
      </p>
      <ul class="hero-pills" aria-label="Core service principles">
        ${renderPills(heroPills)}
      </ul>
      <div class="hero__actions">
        <a class="button button--primary" href="/#services">View service scope</a>
        <a class="button button--ghost" href="${BLOG_INDEX_PATH}">Browse blog</a>
        <a class="button button--mail" href="${CONTACT_EMAIL_LINK}">GET IN TOUCH</a>
      </div>
      <p class="consent-note">
        By using this website, contacting Sahaay Digital, or sharing documents for support, the user agrees to the
        <a href="/#terms">Terms &amp; Conditions</a> and <a href="/#privacy">Privacy Notice</a>.
      </p>
      <div class="highlight-grid">
        ${renderCards(heroHighlights, 'highlight-card')}
      </div>
    </section>

    <section id="services" class="section">
      <h3>Service Scope</h3>
      <h4>What Sahaay Digital can help with.</h4>
      <p>
        The service is framed around review, preparation, and coordination. Official decisions, approvals, and
        issuance remain with the relevant government authority.
      </p>
      <div class="service-grid">
        ${renderCards(serviceCards, 'service-card')}
      </div>
    </section>

    <section id="process" class="section">
      <h3>Process</h3>
      <h4>Minimal-document, official-portal-first workflow.</h4>
      <p>
        The process is intentionally narrow: review what is needed, identify missing or conflicting information, and
        guide the user back to the correct official channel.
      </p>
      <ol class="timeline">
        ${renderTimeline(processSteps)}
      </ol>
    </section>

    <section id="testimonials" class="section">
      <h3>Testimonials</h3>
      <h4>Recent feedback from document-support work.</h4>
      <p>
        Names are intentionally withheld, but the work scope is shown so visitors can understand the kind of support
        clients have already used Sahaay Digital for.
      </p>
      <div class="testimonial-grid">
        ${renderTestimonials()}
      </div>
    </section>

    <section id="portals" class="section">
      <h3>Official Portals</h3>
      <h4>Keep the user pointed at the real authority.</h4>
      <p>
        The actual application, verification, and decision-making happen through the relevant government portal or
        office. These links make that boundary explicit.
      </p>
      <div class="portal-grid">
        ${renderPortals()}
      </div>
    </section>

    <section id="blog" class="section">
      <h3>Blog</h3>
      <h4>Simple guides and To do's around getting government IDs</h4>
      ${renderBlogCards(blogPosts.slice(0, 3))}
      <p class="blog-section__link">
        <a class="back-link" href="${BLOG_INDEX_PATH}">View all posts</a>
      </p>
    </section>

    <section id="privacy" class="section">
      <h3>Privacy Notice</h3>
      <h4>Sensitive records deserve narrow, explicit handling.</h4>
      <article class="policy-card">
        <ul class="policy-list">
          ${renderList(privacyPoints, 'policy-list__item')}
        </ul>
        <p class="policy-card__footnote">
          Do not send unnecessary records, and prefer masked Aadhaar where the full number is not required for the
          task.
        </p>
      </article>
    </section>

    <section id="terms" class="section">
      <h3>Terms &amp; Conditions</h3>
      <h4>Know the service boundary before you proceed.</h4>
      <article class="policy-card policy-card--accent">
        <ul class="policy-list">
          ${renderList(termsPoints, 'policy-list__item')}
        </ul>
        <p class="policy-card__footnote">
          When secure intake or booking is added later, users should be asked for explicit consent again before
          document upload or payment.
        </p>
      </article>
    </section>

    <section id="faq" class="section">
      <h3>FAQ</h3>
      <h4>Answer the most likely trust questions upfront.</h4>
      <div class="faq-list">
        ${renderFaqs()}
      </div>
    </section>
  </main>
`;

const renderBlogIndexPage = () => `
  <main class="shell">
    <section class="section blog-index">
      <a class="back-link" href="${HOME_PATH}">Back to home</a>
      <p class="eyebrow">Blog</p>
      <h1>Markdown-backed posts for guides, updates, and practical checklists.</h1>
      <p class="hero__lede">
        Every post is authored as a markdown file in <code>src/posts</code> and picked up automatically during the
        Vite build. That keeps publishing lightweight while still giving the site a dedicated blog surface.
      </p>
      ${renderBlogCards(blogPosts)}
    </section>
  </main>
`;

const renderBlogPostPage = (post: BlogPost) => `
  <main class="shell">
    <section class="section blog-post-view">
      <a class="back-link" href="${BLOG_INDEX_PATH}">Back to blog</a>
      <p class="eyebrow">Blog</p>
      <h1 class="blog-post__headline">${post.title}</h1>
      <p class="blog-post__meta">
        <span>${post.dateLabel}</span>
        <span>${post.readingTime}</span>
      </p>
      <p class="blog-post__summary">${post.summary}</p>
      ${renderBlogTags(post.tags)}
      <article class="blog-post">
        ${post.html}
      </article>
    </section>
  </main>
`;

const renderMissingPostPage = (slug: string) => `
  <main class="shell">
    <section class="section blog-index">
      <a class="back-link" href="${BLOG_INDEX_PATH}">Back to blog</a>
      <p class="eyebrow">Blog</p>
      <h1>Post not found.</h1>
      <p class="hero__lede">
        No markdown post matched the slug <code>${escapeHtml(slug)}</code>. Check the filename in
        <code>src/posts</code> or go back to the blog index.
      </p>
    </section>
  </main>
`;

const renderFooter = () => `
  <footer class="site-footer">
    <p>Sahaay Digital is a private assistance service. It does not issue passports, voter IDs, or any other government document.</p>
    <p class="site-footer__contact">Contact: <a class="site-footer__mail" href="${CONTACT_EMAIL_LINK}">${CONTACT_EMAIL}</a></p>
    <p>&copy; ${year} Sahaay Digital. Use of the website or services constitutes acceptance of the Terms &amp; Conditions and Privacy Notice.</p>
  </footer>
`;

const normalizePath = (pathname: string) => {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.replace(/\/+$/, '');
  }

  return pathname || HOME_PATH;
};

const getRoute = (): Route => {
  const pathname = normalizePath(window.location.pathname);

  if (pathname === BLOG_INDEX_PATH) {
    return { kind: 'blogIndex' };
  }

  if (pathname.startsWith(`${BLOG_INDEX_PATH}/`)) {
    const slug = decodeURIComponent(pathname.slice(`${BLOG_INDEX_PATH}/`.length)).trim();
    const post = getBlogPostBySlug(slug);

    if (post) {
      return { kind: 'blogPost', post };
    }

    return { kind: 'blogMissing', slug };
  }

  return { kind: 'home' };
};

const getRouteKey = (route: Route) => {
  switch (route.kind) {
    case 'blogIndex':
      return 'blogIndex';
    case 'blogPost':
      return `blogPost:${route.post.slug}`;
    case 'blogMissing':
      return `blogMissing:${route.slug}`;
    default:
      return 'home';
  }
};

const scrollToHomeHash = () => {
  const { hash } = window.location;

  if (!hash) {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return;
  }

  const target = document.querySelector<HTMLElement>(hash);
  target?.scrollIntoView({ block: 'start' });
};

let currentRouteKey = '';

const renderApp = (route = getRoute()) => {
  const main =
    route.kind === 'blogIndex'
      ? renderBlogIndexPage()
      : route.kind === 'blogPost'
        ? renderBlogPostPage(route.post)
        : route.kind === 'blogMissing'
          ? renderMissingPostPage(route.slug)
          : renderHomePage();

  app.innerHTML = `
    <div class="page-shell" id="top">
      ${renderHeader(route)}
      ${main}
      ${renderFooter()}
    </div>
  `;

  document.title =
    route.kind === 'blogPost'
      ? `${route.post.title} | Sahaay Digital`
      : route.kind === 'blogIndex'
        ? 'Blog | Sahaay Digital'
        : route.kind === 'blogMissing'
          ? 'Post Not Found | Sahaay Digital'
          : 'Sahaay Digital';

  currentRouteKey = getRouteKey(route);

  window.requestAnimationFrame(() => {
    if (route.kind === 'home') {
      scrollToHomeHash();
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  });
};

const isAppPath = (pathname: string) =>
  pathname === HOME_PATH ||
  pathname === BLOG_INDEX_PATH ||
  pathname.startsWith(`${BLOG_INDEX_PATH}/`);

const navigate = (pathname: string, hash = '') => {
  const nextPath = normalizePath(pathname);
  const nextUrl = `${nextPath}${hash}`;
  const currentUrl = `${normalizePath(window.location.pathname)}${window.location.hash}`;

  if (nextUrl !== currentUrl) {
    window.history.pushState({}, '', nextUrl);
  }

  syncRoute();
};

const syncRoute = () => {
  const route = getRoute();
  const nextRouteKey = getRouteKey(route);

  if (nextRouteKey !== currentRouteKey) {
    renderApp(route);
    return;
  }

  if (route.kind === 'home') {
    scrollToHomeHash();
  }
};

document.addEventListener('click', (event) => {
  if (event.defaultPrevented) {
    return;
  }

  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const anchor = target.closest<HTMLAnchorElement>('a[href]');

  if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) {
    return;
  }

  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  const url = new URL(anchor.href, window.location.origin);

  if (url.origin !== window.location.origin || !isAppPath(normalizePath(url.pathname))) {
    return;
  }

  event.preventDefault();
  navigate(url.pathname, url.hash);
});

window.addEventListener('popstate', syncRoute);
window.addEventListener('hashchange', syncRoute);

renderApp();
