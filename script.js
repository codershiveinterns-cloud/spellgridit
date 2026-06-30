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

document.querySelectorAll('[data-affiliate-popup]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
  });
});

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
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const message = form.querySelector('.form-message');
    const originalText = submitButton ? submitButton.textContent : '';
    const formData = new FormData(form);

    if (!formData.has('access_key')) {
      formData.append('access_key', 'c8a2cc4c-c15a-486f-a05c-fa97197d928d');
    }

    formData.append('subject', 'New SpellGridit project request');
    formData.append('from_name', 'SpellGridit Website');

    if (submitButton) {
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;
    }

    if (message) {
      message.textContent = '';
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        if (message) {
          message.textContent = 'Success! Your message has been sent to support@spellgridit.com.';
        }
        form.reset();
      } else if (message) {
        message.textContent = `Error: ${data.message || 'Unable to send your message.'}`;
      }
    } catch (error) {
      if (message) {
        message.textContent = 'Something went wrong. Please try again.';
      }
    } finally {
      if (submitButton) {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    }
  });
});

const consentStorageKey = 'spellgridit-cookie-consent-v2';

if (!localStorage.getItem(consentStorageKey)) {
  const consentModal = document.createElement('div');
  consentModal.className = 'consent-modal';
  consentModal.setAttribute('role', 'dialog');
  consentModal.setAttribute('aria-modal', 'true');
  consentModal.setAttribute('aria-labelledby', 'consent-title');
  consentModal.innerHTML = `
    <div class="consent-card">
      <div class="consent-copy">
        <p class="eyebrow">Privacy & Cookies</p>
        <h2 id="consent-title">We value your privacy</h2>
        <p>SpellGridit uses essential cookies and similar technologies to keep the website working, improve your browsing experience, and understand how visitors use our pages.</p>
        <p class="consent-links"><span>Privacy Policy</span> • <span>Cookie Policy</span></p>
      </div>
      <div class="consent-actions">
        <button class="button button-secondary" type="button" data-consent-choice="denied">Deny</button>
        <button class="button" type="button" data-consent-choice="accepted">Accept All</button>
      </div>
    </div>
  `;

  document.body.appendChild(consentModal);
  document.body.classList.add('consent-open');


  consentModal.querySelectorAll('[data-consent-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.setItem(consentStorageKey, button.dataset.consentChoice);
      consentModal.remove();
      document.body.classList.remove('consent-open');
    });
  });
}

const serviceSearchForm = document.querySelector('[data-service-search-form]');
const serviceSearchInput = document.querySelector('[data-service-search]');
const homeServicesGrid = document.querySelector('.home-services-grid');
const homeServiceCards = homeServicesGrid ? Array.from(homeServicesGrid.querySelectorAll('.service-card')) : [];

if (serviceSearchForm && serviceSearchInput && homeServicesGrid && homeServiceCards.length) {
  const emptyMessage = document.createElement('div');
  emptyMessage.className = 'service-search-empty';
  emptyMessage.textContent = 'No matching service found. Try Google Ads, Social Media, Email, WhatsApp, Leads, Influencer, or Reputation.';
  emptyMessage.hidden = true;
  homeServicesGrid.appendChild(emptyMessage);

  const filterServices = () => {
    const query = serviceSearchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    homeServiceCards.forEach((card) => {
      const matches = !query || card.textContent.toLowerCase().includes(query);
      card.classList.toggle('is-hidden', !matches);
      if (matches) visibleCount += 1;
    });

    emptyMessage.hidden = visibleCount !== 0;
  };

  serviceSearchInput.addEventListener('input', filterServices);

  serviceSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    filterServices();
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.querySelectorAll('[data-service-chip]').forEach((chip) => {
    chip.addEventListener('click', () => {
      serviceSearchInput.value = chip.dataset.serviceChip;
      filterServices();
      document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

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
