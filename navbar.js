// Advanced Navbar Functionality
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle mobile menu
  navToggle.addEventListener('click', function() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when a link is clicked and set active classes
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');

      // Add active class to matching link / nav item
      const currentFilename = this.getAttribute('href').split('/').pop() || 'index.html';

      navLinks.forEach(l => {
        const linkPage = l.getAttribute('href').split('/').pop() || 'index.html';
        if (linkPage === currentFilename) {
          l.classList.add('active');
          l.parentElement.classList.add('active');
        } else {
          l.classList.remove('active');
          l.parentElement.classList.remove('active');
        }
      });
    });
  });

  // Set active link on page load
  const currentFilename = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop() || 'index.html';
    if (linkPage === currentFilename) {
      link.classList.add('active');
      link.parentElement.classList.add('active');
    }
  });

  // Add scroll effect to navbar
  let lastScrollTop = 0;
  const navbar = document.querySelector('.advanced-navbar');

  window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
});
