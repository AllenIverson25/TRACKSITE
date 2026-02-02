// Advanced Navbar Functionality
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle mobile menu (defensive: only if elements exist)
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Close menu when a link is clicked and set active classes
  if (navLinks && navLinks.length) {
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (navToggle && navMenu) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
        }

        // Add active class to matching link / nav item
        const currentFilename = this.getAttribute('href') ? this.getAttribute('href').split('/').pop() : 'index.html';

        navLinks.forEach(l => {
          const href = l.getAttribute('href') || 'index.html';
          const linkPage = href.split('/').pop() || 'index.html';
          if (linkPage === currentFilename) {
            l.classList.add('active');
            if (l.parentElement) l.parentElement.classList.add('active');
          } else {
            l.classList.remove('active');
            if (l.parentElement) l.parentElement.classList.remove('active');
          }
        });
      });
    });
  }

  // Set active link on page load (defensive)
  const currentFilename = window.location.pathname.split('/').pop() || 'index.html';
  if (navLinks && navLinks.length) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || 'index.html';
      const linkPage = href.split('/').pop() || 'index.html';
      if (linkPage === currentFilename) {
        link.classList.add('active');
        if (link.parentElement) link.parentElement.classList.add('active');
      }
    });
  }

  // Add scroll effect to navbar (defensive)
  const navbar = document.querySelector('.advanced-navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 100) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    });
  }
});
