const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastActive = null;

openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    lastActive = document.activeElement;
    dlg.showModal();
    dlg.querySelector('input,select,textarea,button')?.focus();
});

closeBtn.addEventListener('click', () => dlg.close('cancel'));

form?.addEventListener('submit', (e) => {
    [...form.elements].forEach(el => el.setCustomValidity?.(''));

    if (!form.checkValidity()) {
        e.preventDefault();
        
        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }
        
        form.reportValidity();

        [...form.elements].forEach(el => {
            if (el.willValidate) {
                el.toggleAttribute('aria-invalid', !el.checkValidity());
            }
        });

        return;
    }

    e.preventDefault();
    document.getElementById('contactDialog')?.close('success');
    form.reset();
    
    [...form.elements].forEach(el => {
        if (el.hasAttribute('aria-invalid')) {
            el.removeAttribute('aria-invalid');
        }
    });
});

dlg.addEventListener('close', () => {
    lastActive?.focus();
});

const THEME_KEY = 'theme';
const themeToggle = document.querySelector('.theme-toggle');
const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;

function updateThemeIcon(isDark) {
    const icon = themeToggle.querySelector('[aria-hidden="true"]');
    if (icon) {
        icon.textContent = isDark ? '☀️' : '🌙';
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    if (shouldUseDark) {
        document.body.classList.add('theme-dark');
        themeToggle?.setAttribute('aria-pressed', 'true');
    }
    
    updateThemeIcon(shouldUseDark);
}

themeToggle?.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('theme-dark');
    themeToggle.setAttribute('aria-pressed', String(isDark));
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
});

matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
        const isDark = e.matches;
        document.body.classList.toggle('theme-dark', isDark);
        themeToggle?.setAttribute('aria-pressed', String(isDark));
        updateThemeIcon(isDark);
    }
});

initTheme();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.site-nav__link[href^="#"]');
    
    let current = '';
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('site-nav__link--active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('site-nav__link--active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavigation);
window.addEventListener('load', updateActiveNavigation);

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dlg.open) {
        dlg.close('cancel');
    }
});

dlg.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        const focusableElements = dlg.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
});

if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        cardObserver.observe(card);
    });
}
