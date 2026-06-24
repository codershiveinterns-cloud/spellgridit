const yearElements = document.querySelectorAll('#year');
yearElements.forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const siteHeader = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('#main-nav');

if (siteHeader && navToggle && mainNav) {
  const closeNav = () => {
    siteHeader.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = siteHeader.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeNav();
    }
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');

    if (!targetId || targetId === '#') {
      return;
    }

    const target = document.querySelector(targetId);

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

document.querySelectorAll('[data-lead-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const message = form.querySelector('.form-message');
    if (message) {
      message.textContent = 'Thanks! Your project request has been received. SpellGridit will follow up soon.';
    }

    form.reset();
  });
});

const projectFilterButtons = document.querySelectorAll('[data-project-filter]');
const projectCards = document.querySelectorAll('[data-project-category]');

projectFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.projectFilter;

    projectFilterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    projectCards.forEach((card) => {
      const shouldShow = selectedFilter === 'all' || card.dataset.projectCategory === selectedFilter;
      card.classList.toggle('is-hidden', !shouldShow);
    });
  });
});
