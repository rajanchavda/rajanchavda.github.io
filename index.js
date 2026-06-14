document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     NAVBAR SCROLL EFFECT
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  
  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Initial check
  
  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksMenu = document.getElementById('nav-links-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const toggleMenu = () => {
    mobileToggle.classList.toggle('active');
    navLinksMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  };
  
  mobileToggle.addEventListener('click', toggleMenu);
  
  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navLinksMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });

  /* ==========================================================================
     SCROLL PARALLAX - JS FALLBACK FOR UNSUPPORTED BROWSERS
     ========================================================================== */
  const supportsScrollDrivenAnimations = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  
  if (!supportsScrollDrivenAnimations) {
    const heroWrapper = document.getElementById('home');
    const layerBg = heroWrapper.querySelector('.layer-bg');
    const layerGlow = heroWrapper.querySelector('.layer-glow');
    const layerContent = heroWrapper.querySelector('.layer-content');
    const layerForeground = heroWrapper.querySelector('.layer-foreground');
    
    const onHeroScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Only run calculations if hero is visible
      if (scrollY <= windowHeight) {
        // Background layer: moves slowly downwards (speed 0.1)
        if (layerBg) {
          layerBg.style.transform = `translateY(${scrollY * 0.22}px)`;
        }
        // Glow layer: moves medium downwards (speed 0.3)
        if (layerGlow) {
          layerGlow.style.transform = `translateY(${scrollY * 0.14}px)`;
        }
        // Content layer: scrolls slightly slower, fades out
        if (layerContent) {
          const contentTranslate = scrollY * 0.06;
          const contentOpacity = Math.max(0, 1 - (scrollY / (windowHeight * 0.8)));
          layerContent.style.transform = `translateY(${contentTranslate}px)`;
          layerContent.style.opacity = contentOpacity;
        }
        // Foreground layer: moves upwards relative to scroll
        if (layerForeground) {
          layerForeground.style.transform = `translateY(${-scrollY * 0.09}px)`;
        }
      }
    };
    
    window.addEventListener('scroll', onHeroScroll);
    onHeroScroll(); // Initial position
  }

  /* ==========================================================================
     SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once revealed to keep animations static
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element reaches viewport center
  });
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  /* ==========================================================================
     PROJECTS FILTERING
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active to current button
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const cardTech = card.getAttribute('data-tech');
        
        // Match logic
        if (filterValue === 'all' || cardTech.split(' ').includes(filterValue)) {
          // Show card with quick fade-in
          card.classList.remove('hide');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          // Hide card with transition
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.classList.add('hide');
          }, 300);
        }
      });
    });
  });

  /* ==========================================================================
     TOAST NOTIFICATIONS & COPY-TO-CLIPBOARD
     ========================================================================== */
  const toastContainer = document.getElementById('toast-container');
  
  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Fade out and remove after 2.5s
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.5s ease forwards';
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 2500);
  };
  
  // Setup copyable cards
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyPhoneBtn = document.getElementById('copy-phone-btn');
  
  const setupCopy = (element, label) => {
    if (element) {
      element.addEventListener('click', () => {
        const textToCopy = element.getAttribute('data-clipboard');
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied ${label} to clipboard!`);
        }).catch(err => {
          console.error('Failed to copy: ', err);
        });
      });
    }
  };
  
  setupCopy(copyEmailBtn, 'Email');
  setupCopy(copyPhoneBtn, 'Phone Number');

  /* ==========================================================================
     THEME TOGGLE (LIGHT / DARK)
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Update color scheme meta tag
      const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
      if (metaColorScheme) {
        metaColorScheme.content = newTheme;
      }
    });
  }

  /* ==========================================================================
     GSAP INTERACTIVE HERO PARALLAX & ENTRANCE ANIMATIONS
     ========================================================================== */
  if (typeof gsap !== 'undefined') {
    // Register GSAP TextPlugin
    gsap.registerPlugin(TextPlugin);
    
    // Check for prefers-reduced-motion setting
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      // 1. Hero Entrance Animation Sequence
      const entranceTimeline = gsap.timeline({
        defaults: { ease: 'power4.out', duration: 1.2 }
      });
      
      entranceTimeline
        .from('.hero-badge', { y: -30, opacity: 0, duration: 1 })
        .from('.hero-title', { y: 40, opacity: 0 }, '-=0.8')
        .from('.hero-subtitle', { y: 30, opacity: 0 }, '-=0.9')
        .from('.hero-description', { y: 20, opacity: 0 }, '-=0.9')
        .from('.hero-buttons .btn', { scale: 0.8, opacity: 0, stagger: 0.15 }, '-=0.9')
        .from('.hero-scroll-indicator', { y: 20, opacity: 0 }, '-=0.5')
        .from('.tech-angular', { x: 40, y: -40, scale: 0.7, opacity: 0, duration: 1.4 }, '-=1.2')
        .from('.tech-react', { x: -40, y: 40, scale: 0.7, opacity: 0, duration: 1.4 }, '-=1.4')
        .from('.tech-ts', { x: 40, y: 40, scale: 0.7, opacity: 0, duration: 1.4 }, '-=1.4');

      // 2. Mousemove Parallax Effect (staggered layer velocities)
      const heroSection = document.getElementById('home');
      if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
          const rect = heroSection.getBoundingClientRect();
          const mouseX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
          const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
          
          gsap.to('.layer-bg .grid-mesh', {
            x: mouseX * 20,
            y: mouseY * 20,
            duration: 0.8,
            ease: 'power2.out'
          });
          
          gsap.to('.layer-glow', {
            x: mouseX * -40,
            y: mouseY * -40,
            duration: 1.0,
            ease: 'power2.out'
          });
          
          gsap.to('.layer-content', {
            x: mouseX * 30,
            y: mouseY * 30,
            rotationY: mouseX * 6,
            rotationX: mouseY * -6,
            transformPerspective: 1000,
            duration: 0.8,
            ease: 'power2.out'
          });
          
          gsap.to('.layer-foreground', {
            x: mouseX * 60,
            y: mouseY * 60,
            duration: 1.2,
            ease: 'power2.out'
          });
        });
        
        // Return layers to baseline coordinates on mouseleave
        heroSection.addEventListener('mouseleave', () => {
          gsap.to(['.layer-bg .grid-mesh', '.layer-glow', '.layer-content', '.layer-foreground'], {
            x: 0,
            y: 0,
            rotationY: 0,
            rotationX: 0,
            duration: 1.5,
            ease: 'power3.out'
          });
        });
      }
      
      // 3. Magnetic Hover Effect for Buttons and Social links
      const makeMagnetic = (element, strength = 0.35) => {
        if (!element) return;
        element.addEventListener('mousemove', (e) => {
          const bounds = element.getBoundingClientRect();
          const centerX = bounds.left + bounds.width / 2;
          const centerY = bounds.top + bounds.height / 2;
          const deltaX = e.clientX - centerX;
          const deltaY = e.clientY - centerY;
          
          gsap.to(element, {
            x: deltaX * strength,
            y: deltaY * strength,
            duration: 0.4,
            ease: 'power2.out'
          });
        });
        
        element.addEventListener('mouseleave', () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.3)'
          });
        });
      };
      
      document.querySelectorAll('.btn, .theme-toggle, .avatar-socials a').forEach(el => {
        makeMagnetic(el, 0.25);
      });
      
      // 4. 3D Tilt Effect on cards
      const applyTilt = (card, strength = 12) => {
        card.addEventListener('mousemove', (e) => {
          const bounds = card.getBoundingClientRect();
          const x = e.clientX - bounds.left;
          const y = e.clientY - bounds.top;
          const xPct = x / bounds.width - 0.5;
          const yPct = y / bounds.height - 0.5;
          
          gsap.to(card, {
            rotationY: xPct * strength,
            rotationX: yPct * -strength,
            transformPerspective: 800,
            duration: 0.4,
            ease: 'power2.out'
          });
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.8,
            ease: 'power3.out'
          });
        });
      };
      
      document.querySelectorAll('.project-card, .skills-category-card, .award-card').forEach(card => {
        applyTilt(card, 8);
      });
      
      // 5. Typewriter Subtitle Rotation (GSAP TextPlugin)
      const subtitleEl = document.getElementById('rotating-subtitle');
      if (subtitleEl) {
        const titles = [
          'Team Lead & Senior Frontend Engineer',
          'Advanced Angular & React Developer',
          'Web Performance & INP Optimizer',
          'Technical Mentor & Scrum Leader'
        ];
        let currentIndex = 0;
        
        const rotateText = () => {
          const nextIndex = (currentIndex + 1) % titles.length;
          const targetText = titles[nextIndex];
          
          const tl = gsap.timeline({
            onComplete: () => {
              currentIndex = nextIndex;
              setTimeout(rotateText, 4000);
            }
          });
          
          // Backspace current text
          tl.to(subtitleEl, {
            duration: subtitleEl.innerText.length * 0.015,
            text: '',
            ease: 'none'
          })
          // Pause slightly
          .to({}, { duration: 0.15 })
          // Type new text
          .to(subtitleEl, {
            duration: targetText.length * 0.035,
            text: targetText,
            ease: 'none'
          });
        };
        
        // Start cycle after entrance timeline finishes
        setTimeout(rotateText, 4000);
      }
    }
  }

});

// Inline rotation keyframe for button loading icon
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  @keyframes rotate {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
