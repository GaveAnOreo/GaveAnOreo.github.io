const navLinks = document.querySelectorAll('.nav-links a');
const navMenu = document.getElementById('primary-navigation');
const navToggle = document.querySelector('.nav-toggle');

if (document.body.classList.contains('no-js')) {
    document.body.classList.remove('no-js');
}
const siteHeader = document.querySelector('header');
const themeToggle = document.querySelector('.theme-toggle');
const themeToggleLabel = themeToggle?.querySelector('.theme-toggle__label');

const projectListEl = document.querySelector('[data-project-list]');
const projectEmptyEl = document.querySelector('[data-project-empty]');
const projectErrorEl = document.querySelector('[data-project-error]');
const projectHelperEl = document.querySelector('.project-helper');
const projectFilters = document.querySelectorAll('[data-project-filter]');
const projectControlsEl = document.querySelector('[data-project-controls]');

if (projectListEl) {
    projectListEl.setAttribute('role', 'list');
    projectListEl.setAttribute('aria-live', 'polite');
}

const FEATURED_REPOS = new Set([
    'alien invasion case study',
    'study companion prototype'
]);

const FALLBACK_PROJECTS = [
    {
        name: 'Kyoto Travel Guide',
        description: 'A multi-page travel experience that blends curated itineraries, cultural highlights, and responsive layouts optimized for GitHub Pages.',
        status: 'Live on GitHub Pages',
        focus: 'Showcases my front-end storytelling, accessibility habits, and attention to detail learned in BSIT coursework.',
        language: 'HTML · CSS · JS',
        topics: ['Responsive design', 'Storytelling', 'Accessibility'],
        links: [
            {
                href: 'https://github.com/GaveAnOreo/Kyoto',
                label: 'GitHub repository'
            },
            {
                href: 'https://gaveanoreo.github.io/Kyoto/',
                label: 'Live site'
            }
        ],
        pushed_at: '2025-04-15T00:00:00Z',
        isPlaceholder: true,
        isFeatured: true
    },
    {
        name: 'Xiaomi 15T Pro Launch Page',
        description: 'Product microsite inspired by Xiaomi’s flagship phone, featuring specification breakdowns, hero interactions, and purchase CTAs.',
        status: 'Live on GitHub Pages',
        focus: 'Demonstrates my ability to translate tech specs into engaging layouts with clear hierarchy and motion cues.',
        language: 'HTML · CSS · JS',
        topics: ['Product design', 'Landing page', 'Interaction design'],
        links: [
            {
                href: 'https://github.com/GaveAnOreo/Xiaomi-15T-Pro',
                label: 'GitHub repository'
            },
            {
                href: 'https://gaveanoreo.github.io/Xiaomi-15T-Pro/',
                label: 'Live site'
            }
        ],
        pushed_at: '2025-04-10T00:00:00Z',
        isPlaceholder: true,
        isFeatured: true
    }
];

let projectData = [];
let activeProjectFilter = 'featured';

const setTheme = mode => {
    document.body.setAttribute('data-theme', mode);
    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', mode === 'dark');
    }
    if (themeToggleLabel) {
        themeToggleLabel.textContent = mode === 'dark' ? 'Dark' : 'Light';
    }
};

const getStoredTheme = () => window.localStorage.getItem('preferred-theme');
const storeTheme = mode => window.localStorage.setItem('preferred-theme', mode);

const prefersDarkMedia = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
const prefersReducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

const getDefaultTheme = () => {
    const stored = getStoredTheme();
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }
    return prefersDarkMedia?.matches ? 'dark' : 'light';
};

setTheme(getDefaultTheme());

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
        storeTheme(next);
    });

    if (prefersDarkMedia?.addEventListener) {
        prefersDarkMedia.addEventListener('change', event => {
            const stored = getStoredTheme();
            if (!stored) {
                setTheme(event.matches ? 'dark' : 'light');
            }
        });
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
        const target = document.querySelector(anchor.getAttribute('href'));

        if (target) {
            event.preventDefault();
            const behavior = prefersReducedMotion?.matches ? 'auto' : 'smooth';
            target.scrollIntoView({ behavior, block: 'start' });

            if (anchor.classList.contains('skip-link') && typeof target.focus === 'function') {
                target.focus({ preventScroll: true });
            }
        }
    });
});

const markActiveNavLink = () => {
    if (!navLinks.length) {
        return;
    }

    const currentPath = window.location.pathname.split(/[\\/]/).pop() || 'index.html';
    const internalLinks = Array.from(navLinks).filter(link => {
        const href = link.getAttribute('href');
        return href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto:');
    });

    internalLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });

    const activeLink = internalLinks.find(link => {
        const href = link.getAttribute('href');
        if (!href) return false;
        const normalizedHref = href.split('/').pop();
        if (!normalizedHref) return false;
        if (normalizedHref === currentPath) {
            return true;
        }
        if (normalizedHref === 'about.html' && (currentPath === '' || currentPath === 'index.html')) {
            return true;
        }
        return false;
    });

    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
    }
};

markActiveNavLink();

const closeMobileNav = ({ focusToggle = false } = {}) => {
    if (!navMenu || !navToggle) {
        return;
    }
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    if (window.innerWidth <= 720) {
        navMenu.hidden = true;
    } else {
        navMenu.hidden = false;
    }
    document.body.classList.remove('nav-open');
    if (focusToggle) {
        navToggle.focus();
    }
};

if (navToggle && navMenu) {
    navMenu.hidden = window.innerWidth <= 720;

    navToggle.addEventListener('click', event => {
        event.stopPropagation();
        const isOpen = navMenu.classList.contains('is-open');
        if (isOpen) {
            closeMobileNav();
            return;
        }
        navMenu.hidden = false;
        navMenu.classList.add('is-open');
        navToggle.classList.add('is-active');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('nav-open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 720) {
                closeMobileNav();
            }
        });
    });

    document.addEventListener('click', event => {
        if (!navMenu.classList.contains('is-open')) {
            return;
        }
        if (navMenu.contains(event.target) || navToggle.contains(event.target)) {
            return;
        }
        closeMobileNav();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 720 && navMenu.classList.contains('is-open')) {
            closeMobileNav();
        } else if (navMenu && window.innerWidth > 720) {
            navMenu.hidden = false;
        } else if (navMenu && window.innerWidth <= 720 && !navMenu.classList.contains('is-open')) {
            navMenu.hidden = true;
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
            closeMobileNav({ focusToggle: true });
        }
    });
}

const toggleProjectControls = hasProjects => {
    if (!projectControlsEl) {
        return;
    }
    projectControlsEl.hidden = !hasProjects;
    projectControlsEl.setAttribute('aria-hidden', String(!hasProjects));
};

const setHeaderScrolledState = () => {
    if (!siteHeader) return;
    const shouldElevate = window.scrollY > 12;
    siteHeader.classList.toggle('is-scrolled', shouldElevate);
};

setHeaderScrolledState();
window.addEventListener('scroll', setHeaderScrolledState, { passive: true });

const formatRelativeTime = isoString => {
    if (!isoString) return '';
    const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const now = Date.now();
    const then = new Date(isoString).getTime();
    const diff = then - now;

    const divisions = [
        { amount: 60, unit: 'second' },
        { amount: 60, unit: 'minute' },
        { amount: 24, unit: 'hour' },
        { amount: 7, unit: 'day' },
        { amount: 4.34524, unit: 'week' },
        { amount: 12, unit: 'month' },
        { amount: Number.POSITIVE_INFINITY, unit: 'year' }
    ];

    let duration = diff / 1000;

    for (const division of divisions) {
        if (Math.abs(duration) < division.amount) {
            return formatter.format(Math.round(duration), division.unit);
        }
        duration /= division.amount;
    }

    return 'just now';
};

const formatNumber = value => {
    const formatter = new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1
    });
    return formatter.format(value ?? 0);
};

const removeSkeletons = () => {
    projectListEl?.querySelectorAll('[data-skeleton]')?.forEach(el => el.remove());
};

const createProjectCard = repo => {
    const article = document.createElement('article');
    article.className = 'project-card';
    article.setAttribute('role', 'listitem');

    if (repo.isPlaceholder) {
        article.classList.add('project-card--placeholder');
    }

    const header = document.createElement('div');
    header.className = 'project-card__header';

    const title = document.createElement('h3');
    title.className = 'project-card__title';

    const titleLink = document.createElement('a');
    titleLink.href = repo.html_url || '#projects';
    if (!repo.isPlaceholder) {
        titleLink.target = '_blank';
        titleLink.rel = 'noopener';
    }
    titleLink.textContent = repo.name;
    title.appendChild(titleLink);

    const meta = document.createElement('p');
    meta.className = 'project-card__meta';
    const relativeTime = formatRelativeTime(repo.pushed_at);
    meta.textContent = relativeTime ? `Updated ${relativeTime}` : 'Recently updated';

    header.append(title, meta);

    const body = document.createElement('div');
    body.className = 'project-card__body';

    const description = document.createElement('p');
    description.textContent = repo.description || 'Description coming soon. I’ll break down the problem, my approach, and the final result here.';
    body.appendChild(description);

    if (repo.status) {
        const status = document.createElement('span');
        status.className = 'project-card__status';
        status.textContent = repo.status;
        body.appendChild(status);
    }

    if (repo.focus) {
        const focus = document.createElement('p');
        focus.className = 'project-card__focus';
        focus.textContent = repo.focus;
        body.appendChild(focus);
    }

    if (!repo.isPlaceholder) {
        const stats = document.createElement('div');
        stats.className = 'project-card__stats';
        stats.innerHTML = `
            <span><strong>${formatNumber(repo.stars)}</strong> stars</span>
            <span><strong>${formatNumber(repo.forks)}</strong> forks</span>
        `;
        body.appendChild(stats);
    }

    const footer = document.createElement('div');
    footer.className = 'project-card__footer';

    const tagsWrapper = document.createElement('div');
    tagsWrapper.className = 'project-card__tags';

    if (repo.language) {
        const languageTag = document.createElement('span');
        languageTag.className = 'project-tag';
        languageTag.textContent = repo.language;
        tagsWrapper.appendChild(languageTag);
    }

    if (Array.isArray(repo.topics)) {
        repo.topics.slice(0, 3).forEach(topic => {
            const topicTag = document.createElement('span');
            topicTag.className = 'project-tag';
            topicTag.textContent = topic;
            tagsWrapper.appendChild(topicTag);
        });
    }

    if (!tagsWrapper.children.length) {
        const placeholderTag = document.createElement('span');
        placeholderTag.className = 'project-tag';
        placeholderTag.textContent = 'New project';
        tagsWrapper.appendChild(placeholderTag);
    }

    const linksWrapper = document.createElement('div');
    linksWrapper.className = 'project-card__links';

    if (repo.isPlaceholder && Array.isArray(repo.links) && repo.links.length) {
        repo.links.forEach(link => {
            const anchor = document.createElement('a');
            anchor.href = link.href;
            anchor.textContent = link.label;
            const isExternal = typeof link.href === 'string' && /^https?:/i.test(link.href);
            if (isExternal) {
                anchor.target = '_blank';
                anchor.rel = 'noopener';
            }
            linksWrapper.appendChild(anchor);
        });
    } else {
        const repoLink = document.createElement('a');
        repoLink.href = repo.html_url;
        repoLink.target = '_blank';
        repoLink.rel = 'noopener';
        repoLink.textContent = 'Repository';
        linksWrapper.appendChild(repoLink);

        if (repo.homepage) {
            const demoLink = document.createElement('a');
            demoLink.href = repo.homepage;
            demoLink.target = '_blank';
            demoLink.rel = 'noopener';
            demoLink.textContent = 'Live preview';
            linksWrapper.appendChild(demoLink);
        }
    }

    footer.append(tagsWrapper, linksWrapper);

    article.append(header, body, footer);
    return article;
};

const renderProjects = items => {
    if (!projectListEl) return;

    removeSkeletons();
    projectListEl.innerHTML = '';

    if (projectHelperEl) {
        const hasPublishedProjects = items.some(item => !item.isPlaceholder);
        projectHelperEl.hidden = hasPublishedProjects;
    }

    if (projectEmptyEl) {
        projectEmptyEl.hidden = true;
    }

    if (projectErrorEl) {
        projectErrorEl.hidden = true;
    }

    if (!items.length) {
        if (projectEmptyEl) {
            projectEmptyEl.hidden = false;
        }
        return;
    }

    const fragment = document.createDocumentFragment();
    items.forEach(repo => fragment.appendChild(createProjectCard(repo)));
    projectListEl.appendChild(fragment);
};

const updateFilterUI = filter => {
    projectFilters.forEach(button => {
        const isActive = button.dataset.projectFilter === filter;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
};

const applyProjectFilter = (filter, options = {}) => {
    if (!projectData.length) {
        updateFilterUI(filter);
        renderProjects([]);
        toggleProjectControls(false);
        return;
    }

    activeProjectFilter = filter;
    updateFilterUI(filter);

    let filtered = [...projectData];

    if (filter === 'featured') {
        filtered = projectData.filter(
            repo => repo.isFeatured || FEATURED_REPOS.has((repo.name || '').toLowerCase())
        );
    } else if (filter === 'recent') {
        filtered = [...projectData]
            .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
            .slice(0, 6);
    }

    if (!filtered.length && filter === 'featured' && !options.skipFallback) {
        applyProjectFilter('recent', { skipFallback: true });
        return;
    }

    renderProjects(filtered);

    toggleProjectControls(projectData.length > 0);
};

projectFilters.forEach(button => {
    if (!button.hasAttribute('aria-pressed')) {
        button.setAttribute('aria-pressed', String(button.classList.contains('is-active')));
    }

    button.addEventListener('click', () => {
        const filter = button.dataset.projectFilter;
        if (filter && filter !== activeProjectFilter) {
            applyProjectFilter(filter);
        }
    });
});

const initializeProjects = () => {
    if (!projectListEl) return;

    projectData = [...FALLBACK_PROJECTS];
    applyProjectFilter(activeProjectFilter);
    removeSkeletons();

    toggleProjectControls(projectData.length > 0);
};

if (projectListEl) {
    initializeProjects();
}

const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}