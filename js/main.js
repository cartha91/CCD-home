/* =========================================================
   CrowsCoupe Designs — Digital Creative Rebellion
   main.js v1.0 (Controlled Motion + Theme Persistence)
   ========================================================= */

// Smooth scroll for in-page anchor links (only # links)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* -------------------------------
   Scroll Reveal (Hero + Sections)
   ------------------------------- */
const revealElements = document.querySelectorAll('.hero, .section');

function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.86;

  revealElements.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;

    if (boxTop < triggerBottom) {
      if (!el.classList.contains('show')) {
        el.classList.add('show');

        // Cinematic stagger for specific grids (subtle, not flashy)
        if (el.classList.contains('pillars')) {
          staggerChildren(el, '.pillar-card', 70);
        }
        if (el.classList.contains('process')) {
          staggerChildren(el, '.process-step', 70);
        }
        if (el.classList.contains('portfolio-preview')) {
          staggerChildren(el, '.thumb', 70);
        }
      }
    } else {
      // Optional: keep revealed state once shown by commenting this out
      el.classList.remove('show');
      resetStagger(el);
    }
  });
}

function staggerChildren(parent, selector, delayStep = 60) {
  const items = parent.querySelectorAll(selector);
  items.forEach((item, idx) => {
    item.style.transitionDelay = `${idx * delayStep}ms`;
  });
}

function resetStagger(parent) {
  const items = parent.querySelectorAll('.pillar-card, .process-step, .thumb');
  items.forEach(item => {
    item.style.transitionDelay = '0ms';
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

/* -------------------------------
   Theme Toggle (with persistence)
   ------------------------------- */
const body = document.body;

// Load saved theme preference
const savedTheme = localStorage.getItem('ccd-theme');
if (savedTheme === 'light') {
  body.classList.add('light-mode');
}

const toggleMode = document.createElement('button');
toggleMode.className = 'theme-toggle';
toggleMode.type = 'button';
toggleMode.setAttribute('aria-label', 'Toggle light/dark mode');
toggleMode.textContent = '🌓';

toggleMode.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  localStorage.setItem('ccd-theme', body.classList.contains('light-mode') ? 'light' : 'dark');
});

document.body.appendChild(toggleMode);

/* Give the toggle its new styling without relying on inline styles */
const toggleStyle = document.createElement('style');
toggleStyle.textContent = `
  .theme-toggle {
    position: fixed;
    bottom: 18px;
    right: 18px;
    z-index: 999;
    padding: 0.6rem 0.9rem;
    border-radius: 14px;
    border: 1px solid rgba(90, 62, 219, 0.28);
    cursor: pointer;
    color: #E6E9F2;
    background: linear-gradient(135deg, #5A3EDB, #3B2A99);
    transition: transform 220ms cubic-bezier(0.4,0,0.2,1), box-shadow 220ms cubic-bezier(0.4,0,0.2,1);
  }
  .theme-toggle:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 0 1px rgba(90, 62, 219, 0.18),
                0 18px 40px rgba(0,0,0,0.38),
                0 0 24px rgba(59, 42, 153, 0.32);
  }
`;
document.head.appendChild(toggleStyle);

/* -------------------------------------------
   Contact Form: validation + Formspree submit
   (runs only if contact form exists)
   ------------------------------------------- */
const ccForm = document.getElementById('cc-contact-form');
const formMsg = document.getElementById('form-message');

if (ccForm && formMsg) {
  ccForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = ccForm.querySelector('input[name="name"]').value.trim();
    const email = ccForm.querySelector('input[name="email"]').value.trim();
    const message = ccForm.querySelector('textarea[name="message"]').value.trim();

    let errors = [];

    if (name === '') errors.push('Please enter your name.');
    if (!/^\S+@\S+\.\S+$/.test(email)) errors.push('Please enter a valid email.');
    if (message.length < 10) errors.push('Message must be at least 10 characters.');

    if (errors.length > 0) {
      formMsg.textContent = errors.join(' ');
      formMsg.className = 'form-message error';
      formMsg.style.display = 'block';
      return;
    }

    try {
      const response = await fetch('https://formspree.io/f/xblywjan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
      });

      if (response.ok) {
        formMsg.textContent = '🎉 Message sent successfully! We’ll be in touch shortly.';
        formMsg.className = 'form-message success';
        formMsg.style.display = 'block';
        ccForm.reset();
      } else {
        throw new Error('Formspree request failed.');
      }
    } catch (err) {
      formMsg.textContent = '❌ Something went wrong. Please try again later.';
      formMsg.className = 'form-message error';
      formMsg.style.display = 'block';
    }
  });
}