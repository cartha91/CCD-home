// =========================
// SMOOTH SCROLL (for anchor links)
// =========================
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// =========================
// SCROLL REVEAL (FIXED)
// =========================
const revealElements = document.querySelectorAll('.reveal');

function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.85;

  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < triggerBottom) {
      el.classList.add('show');
    } else {
      el.classList.remove('show');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// =========================
// LIGHT / DARK MODE TOGGLE
// =========================
const body = document.body;

const toggleMode = document.createElement('button');
toggleMode.textContent = '🌓';

toggleMode.style.position = 'fixed';
toggleMode.style.bottom = '20px';
toggleMode.style.right = '20px';
toggleMode.style.padding = '0.5rem 1rem';
toggleMode.style.borderRadius = '10px';
toggleMode.style.border = 'none';
toggleMode.style.cursor = 'pointer';
toggleMode.style.backgroundColor = '#b2d4ff';
toggleMode.style.color = '#0e0e1a';
toggleMode.style.zIndex = '999';

toggleMode.addEventListener('click', () => {
  body.classList.toggle('light-mode');
});

document.body.appendChild(toggleMode);

// =========================
// CONTACT FORM (VALIDATION + FORMSPREE)
// =========================
const ccForm = document.getElementById('cc-contact-form');
const formMsg = document.getElementById('form-message');

if (ccForm && formMsg) {
  ccForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = ccForm.querySelector('input[name="name"]').value.trim();
    const email = ccForm.querySelector('input[name="email"]').value.trim();
    const message = ccForm.querySelector('textarea[name="message"]').value.trim();

    let errors = [];

    // Validation checks
    if (name === '') {
      errors.push('Please enter your name.');
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.push('Please enter a valid email address.');
    }

    if (message.length < 10) {
      errors.push('Message must be at least 10 characters.');
    }

    // Show errors if any
    if (errors.length > 0) {
      formMsg.textContent = errors.join(' ');
      formMsg.className = 'form-message error';
      formMsg.style.display = 'block';
      return;
    }

    // Submit to Formspree
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
        throw new Error('Submission failed');
      }
    } catch (error) {
      formMsg.textContent = '❌ Something went wrong. Please try again later.';
      formMsg.className = 'form-message error';
      formMsg.style.display = 'block';
    }
  });
}