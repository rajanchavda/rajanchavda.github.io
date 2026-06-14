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
     SCROLL REVEAL (FALLBACK & GSAP INTEGRATION)
     ========================================================================== */
  // Target all items we want to reveal on scroll
  const revealElements = document.querySelectorAll(
    '.reveal-on-scroll, .section-header, .about-visual-col, .about-content-col, .skills-category-card'
  );
  
  // Add base class dynamically so they remain visible if JS is disabled
  revealElements.forEach(el => {
    el.classList.add('reveal-on-scroll');
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion || typeof gsap === 'undefined') {
    // Fallback CSS-based reveal
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // GSAP-based reveal: disables CSS transitions during animation to avoid inline collisions
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          
          el.style.transition = 'none';
          el.classList.add('revealed');
          
          let startX = 0;
          let startY = 35;
          
          // Apply directional slide-ins based on column layout
          if (el.classList.contains('about-visual-col')) {
            startX = -40;
            startY = 0;
          } else if (el.classList.contains('about-content-col')) {
            startX = 40;
            startY = 0;
          }
          
          gsap.from(el, {
            x: startX,
            y: startY,
            opacity: 0,
            scale: el.classList.contains('skills-category-card') ? 0.96 : 1,
            duration: 0.8,
            ease: 'power2.out',
            clearProps: 'transition'
          });
          
          revealObserver.unobserve(el);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }

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
     THEME TOGGLE (LIGHT / DARK) WITH VIEW TRANSITIONS
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      const changeThemeData = () => {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
        if (metaColorScheme) {
          metaColorScheme.content = newTheme;
        }
      };
      
      if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        changeThemeData();
        return;
      }
      
      const x = e.clientX;
      const y = e.clientY;
      
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      
      const transition = document.startViewTransition(changeThemeData);
      
      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`
            ]
          },
          {
            duration: 500,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );
      });
    });
  }

  /* ==========================================================================
     GSAP INTERACTIVE HERO PARALLAX & ENTRANCE ANIMATIONS
     ========================================================================== */
  if (typeof gsap !== 'undefined') {
    // Register GSAP TextPlugin & ScrollTrigger safely
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(TextPlugin, ScrollTrigger);
    } else {
      gsap.registerPlugin(TextPlugin);
    }
    
    // Check for prefers-reduced-motion setting
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // A. Custom Damped Cursor Movement (Desktop Only)
    const cursor = document.getElementById('custom-cursor');
    if (cursor && !prefersReducedMotion) {
      let cursorPos = { x: 0, y: 0 };
      let mousePos = { x: 0, y: 0 };
      
      window.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        cursor.classList.add('active');
      });
      
      document.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
      });
      
      document.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
      });
      
      // GSAP Ticker for smooth damping
      gsap.ticker.add(() => {
        const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio());
        cursorPos.x += (mousePos.x - cursorPos.x) * dt;
        cursorPos.y += (mousePos.y - cursorPos.y) * dt;
        
        gsap.set(cursor, {
          x: cursorPos.x,
          y: cursorPos.y
        });
      });
      
      // Magnetic snappings and scale changes
      const hoverSelector = 'a, button, .project-card, .skills-category-card, .award-card, .contact-item, .theme-toggle, .mobile-nav-toggle';
      document.querySelectorAll(hoverSelector).forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('hovered');
        });
      });
    }

    // B. Hero Canvas Particle Backdrop
    const canvas = document.getElementById('hero-canvas');
    if (canvas && !prefersReducedMotion) {
      const ctx = canvas.getContext('2d');
      let particles = [];
      const maxParticles = 65;
      let width = canvas.width = canvas.offsetWidth;
      let height = canvas.height = canvas.offsetHeight;
      
      const mouse = { x: null, y: null, radius: 150 };
      
      const handleResize = () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      };
      window.addEventListener('resize', handleResize);
      
      const heroSection = document.getElementById('home');
      if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
          const rect = heroSection.getBoundingClientRect();
          mouse.x = e.clientX - rect.left;
          mouse.y = e.clientY - rect.top;
        });
        
        heroSection.addEventListener('mouseleave', () => {
          mouse.x = null;
          mouse.y = null;
        });
      }
      
      class Particle {
        constructor() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 0.35;
          this.vy = (Math.random() - 0.5) * 0.35;
          this.radius = Math.random() * 2 + 1;
        }
        
        update() {
          this.x += this.vx;
          this.y += this.vy;
          
          if (this.x < 0 || this.x > width) this.vx = -this.vx;
          if (this.y < 0 || this.y > height) this.vy = -this.vy;
          
          if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.hypot(dx, dy);
            
            if (dist < mouse.radius) {
              const force = (mouse.radius - dist) / mouse.radius;
              this.x += (dx / dist) * force * 0.4;
              this.y += (dy / dist) * force * 0.4;
            }
          }
        }
        
        draw() {
          const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
          ctx.fillStyle = isLightMode ? 'rgba(14, 116, 144, 0.25)' : 'rgba(0, 242, 254, 0.35)';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      const initParticles = () => {
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
          particles.push(new Particle());
        }
      };
      initParticles();
      
      const drawLines = () => {
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
        const lineColor = isLightMode ? '14, 116, 144' : '0, 242, 254';
        
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);
            
            if (dist < 100) {
              const opacity = ((100 - dist) / 100) * 0.12;
              ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      };
      
      const animateParticles = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
          p.update();
          p.draw();
        });
        drawLines();
        requestAnimationFrame(animateParticles);
      };
      
      animateParticles();
    }

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
