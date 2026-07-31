/* ============================================================
   AATOTEK ENERGIA — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     Loading Screen
  ---------------------------------------------------------- */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 1800);
    });
  }

  /* ----------------------------------------------------------
     Navbar: scroll + hamburger
  ---------------------------------------------------------- */
  const navbar   = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu  = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
      toggleBackTop();
    }, { passive: true });
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* Active nav link */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage ||
        (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ----------------------------------------------------------
     Scroll Reveal
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------
     Animated Counters
  ---------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const suffix   = el.getAttribute('data-suffix') || '';
    const prefix   = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const step     = 16;
    const increment = target / (duration / step);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = prefix + Math.floor(current) + suffix;
    }, step);
  }

  /* ----------------------------------------------------------
     Gallery Lightbox
  ---------------------------------------------------------- */
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightbox-img');
  const lbClose   = document.getElementById('lightbox-close');
  const lbPrev    = document.getElementById('lightbox-prev');
  const lbNext    = document.getElementById('lightbox-next');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentLbIndex = 0;

  if (lightbox && galleryItems.length) {
    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });

    function openLightbox(index) {
      currentLbIndex = index;
      const src = galleryItems[index].querySelector('img').src;
      lbImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function prevImage() {
      currentLbIndex = (currentLbIndex - 1 + galleryItems.length) % galleryItems.length;
      lbImg.src = galleryItems[currentLbIndex].querySelector('img').src;
    }

    function nextImage() {
      currentLbIndex = (currentLbIndex + 1) % galleryItems.length;
      lbImg.src = galleryItems[currentLbIndex].querySelector('img').src;
    }

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', prevImage);
    lbNext.addEventListener('click', nextImage);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });
  }

  /* ----------------------------------------------------------
     Gallery Filter
  ---------------------------------------------------------- */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryAllItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        galleryAllItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ----------------------------------------------------------
     Back To Top
  ---------------------------------------------------------- */
  const backTop = document.querySelector('.back-top');
  function toggleBackTop() {
    if (!backTop) return;
    backTop.classList.toggle('show', window.scrollY > 400);
  }
  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ----------------------------------------------------------
     Contact Form
  ---------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.querySelector('.form-success');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Message Sent!';
        if (formSuccess) formSuccess.style.display = 'block';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = 'Send Message';
          btn.disabled = false;
          if (formSuccess) formSuccess.style.display = 'none';
        }, 4000);
      }, 1200);
    });
  }

  /* ----------------------------------------------------------
     Smooth Scroll for anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----------------------------------------------------------
     Navbar bg glow on scroll (hero page)
  ---------------------------------------------------------- */
  toggleBackTop();

});
