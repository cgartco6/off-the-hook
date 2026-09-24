// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });

    // Close menu when a link is clicked
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }

  // Smooth scroll offset for sticky header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
        const topBarHeight = document.querySelector('.top-bar')?.offsetHeight || 0;
        const offset = headerHeight + topBarHeight + 10;
        const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    });
  });
});

// Add open state styles via JS-injected rule for mobile nav
const style = document.createElement('style');
style.textContent = `
  @media (max-width: 700px) {
    .nav.open {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 72px;
      left: 0;
      right: 0;
      background: white;
      padding: 20px;
      gap: 16px;
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }
    .nav.open a {
      padding: 10px 0;
      font-size: 1.05rem;
    }
    .header {
      position: relative;
    }
  }
`;
document.head.appendChild(style);
