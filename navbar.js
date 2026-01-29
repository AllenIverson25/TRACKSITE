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

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');

      // Add active indicator to current page
      const currentPage = this.getAttribute('href').split('/').pop() || 'index.html';
      const currentFilename = window.location.pathname.split('/').pop() || 'index.html';

      navLinks.forEach(l => {
        const linkPage = l.getAttribute('href').split('/').pop() || 'index.html';
        if (linkPage === currentFilename) {
          l.parentElement.querySelector('.nav-indicator').style.width = '100%';
        } else {
          l.parentElement.querySelector('.nav-indicator').style.width = '0';
        }
      });
    });
  });

  // Set active indicator on page load
  const currentFilename = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop() || 'index.html';
    if (linkPage === currentFilename) {
      link.parentElement.querySelector('.nav-indicator').style.width = '100%';
    }
  });

  // Add scroll effect to navbar
  let lastScrollTop = 0;
  const navbar = document.querySelector('.advanced-navbar');

  window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      navbar.style.background = 'rgba(0, 61, 130, 0.95)';
      navbar.style.boxShadow = '0 8px 32px 0 rgba(0, 61, 130, 0.5)';
    } else {
      navbar.style.background = 'rgba(0, 61, 130, 0.8)';
      navbar.style.boxShadow = '0 8px 32px 0 rgba(0, 61, 130, 0.37)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
});
