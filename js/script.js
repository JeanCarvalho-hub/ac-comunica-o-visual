document.documentElement.classList.add('js');

/* ---------- Header e menu mobile ---------- */
const header = document.getElementById('header');
const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menuToggle');

function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', open);
}

menuToggle.addEventListener('click', () => {
    setMenu(!nav.classList.contains('is-open'));
});

nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        menuToggle.focus();
    }
});

window.matchMedia('(min-width: 961px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
});

function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Link ativo no menu ---------- */
const navLinks = [...document.querySelectorAll('.nav__link')];
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
        });
    });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach((section) => sectionObserver.observe(section));

/* ---------- Animações de entrada ---------- */
document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    group.querySelectorAll('[data-reveal]').forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index, 5) * 70}ms`;
    });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal], .process').forEach((el) => revealObserver.observe(el));

/* ---------- Filtro do portfólio ---------- */
const filterButtons = document.querySelectorAll('.filter');
const works = document.querySelectorAll('.work');
const worksEmpty = document.getElementById('worksEmpty');

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((btn) => {
            const active = btn === button;
            btn.classList.toggle('is-active', active);
            btn.setAttribute('aria-pressed', String(active));
        });

        let visible = 0;

        works.forEach((work) => {
            const show = filter === 'todos' || work.dataset.category === filter;

            if (show) {
                visible++;
                work.classList.remove('is-hidden');
                requestAnimationFrame(() => work.classList.remove('is-hiding'));
            } else {
                work.classList.add('is-hiding');
                setTimeout(() => {
                    if (work.classList.contains('is-hiding')) work.classList.add('is-hidden');
                }, 300);
            }
        });

        worksEmpty.hidden = visible > 0;
    });
});
