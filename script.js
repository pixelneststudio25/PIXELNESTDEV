// ========== HAMBURGER MENU ==========
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// ========== SCROLL ANIMATIONS ==========
const animateElements = document.querySelectorAll('.animate');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.2 });

animateElements.forEach(el => observer.observe(el));

// ========== DROPDOWN (for touch devices) ==========
// Ensure dropdowns work on mobile with a click
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(drop => {
  drop.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const content = drop.querySelector('.dropdown-content');
      if (content) {
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
      }
    }
  });
});

// ========== TABS ON RESOURCES PAGE ==========
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (tabBtns.length) {
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// ========== CONTACT FORM SIMULATION ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('form-message');
    msg.textContent = '✅ Message sent successfully! (Demo)';
    msg.style.color = '#2dd4bf';
    contactForm.reset();
    setTimeout(() => msg.textContent = '', 5000);
  });
}