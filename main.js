// ============================================
// CONFIGURATION - Easy to modify
// ============================================

const CONFIG = {
  // Projects data - add new projects here
  projects: [
    {
      id: 1,
      title: 'Project One',
      year: '2025',
      image: 'images/project2.png',
      description: 'Project description here'
    },
    {
      id: 2,
      title: 'Project Two',
      year: '2024',
      image: 'project2.png',
      description: 'Project description here'
    }
    // Add more projects here - just copy the format above:
    // {
    //   id: 3,
    //   title: 'Project Three',
    //   year: '2023',
    //   image: 'images/your-image.png',
    //   description: 'Project description here'
    // }
  ],
  
  // Animation settings
  scrollAnimation: {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  },
  
  // Header settings
  header: {
    scrollThreshold: 50
  }
};

// ============================================
// NAVIGATION MODULE
// ============================================

const Navigation = {
  init() {
    this.header = document.querySelector('.header');
    this.menuToggle = document.getElementById('menuToggle');
    this.nav = document.getElementById('navMenu');
    this.navLinks = document.querySelectorAll('.header__nav-link');
    this.rightLink = document.querySelector('.header__nav-link--right');
    
    if (!this.header) return;
    
    this.setupScrollEffect();
    this.setupMobileMenu();
    this.setupSmoothScroll();
  },
  
  setupScrollEffect() {
    // Apply blend mode effect to header elements using canvas (like kad.no)
    this.setupHeaderBlendMode();
  },
  
  setupHeaderBlendMode() {
    const header = this.header;
    if (!header) return;
    
    const video = document.querySelector('.hero__video');
    const logoDesktop = header.querySelector('.header__logo--desktop');
    const logoLink = header.querySelector('.header__logo-link');
    const navLinks = header.querySelectorAll('.header__nav-link');
    const menuToggle = header.querySelector('.header__menu-toggle');
    const logoMobile = header.querySelector('.header__logo--mobile');
    
    // Apply blend mode - CSS should handle it, but ensure it's applied
    // The CSS already has mix-blend-mode: exclusion !important on all elements
    // Just ensure logos are visible and positioned correctly
    
    // Blend modes are handled entirely by CSS - just clean up any canvas elements
    // Remove any existing canvas elements from previous implementations
    const existingCanvases = header.querySelectorAll('.header__logo-canvas, .header__text-canvas, .header__toggle-canvas');
    existingCanvases.forEach(canvas => canvas.remove());
    
    // Ensure logos are visible (CSS handles blend modes)
    if (logoDesktop) {
      logoDesktop.style.opacity = '';
      logoDesktop.style.display = '';
      logoDesktop.style.mixBlendMode = '';
    }
    if (logoMobile) {
      logoMobile.style.opacity = '';
      logoMobile.style.display = '';
      logoMobile.style.mixBlendMode = '';
    }
    
    // Remove any inline blend mode styles from nav links - let CSS handle it
    navLinks.forEach(link => {
      link.style.mixBlendMode = '';
    });
    
    // Remove any inline blend mode styles from hamburger - let CSS handle it
    if (menuToggle) {
      const spans = menuToggle.querySelectorAll('span');
      spans.forEach(span => {
        span.style.mixBlendMode = '';
      });
    }
  },
  
  initLogoBlend(canvas, logoImg, video) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      logoImg.style.mixBlendMode = 'exclusion';
      logoImg.style.opacity = '1';
      return;
    }
    
    const logoImage = new Image();
    logoImage.src = logoImg.src;
    if (window.location.protocol !== 'file:') {
      logoImage.crossOrigin = 'anonymous';
    }
    
    let dpr = window.devicePixelRatio || 1;
    let canvasWidth = 0;
    let canvasHeight = 0;
    
    function resizeCanvas() {
      const logoRect = logoImg.getBoundingClientRect();
      const logoHeight = logoRect.height || 40;
      
      if (logoImage.complete && logoImage.naturalWidth > 0) {
        canvasHeight = logoHeight;
        canvasWidth = canvasHeight * (logoImage.naturalWidth / logoImage.naturalHeight);
      } else {
        canvasWidth = logoRect.width || 200;
        canvasHeight = logoHeight;
      }
      
      canvas.style.width = canvasWidth + 'px';
      canvas.style.height = canvasHeight + 'px';
      
      const internalWidth = Math.round(canvasWidth * dpr);
      const internalHeight = Math.round(canvasHeight * dpr);
      
      if (canvas.width !== internalWidth || canvas.height !== internalHeight) {
        canvas.width = internalWidth;
        canvas.height = internalHeight;
      }
    }
    
    function updateBlend() {
      if (video.readyState < 2 || !video.videoWidth || !logoImage.complete || !canvasWidth) return;
      
      const logoRect = logoImg.getBoundingClientRect();
      const videoRect = video.getBoundingClientRect();
      
      if (logoRect.width === 0 || logoRect.height === 0 || videoRect.width === 0) return;
      
      const logoCenterX = logoRect.left + logoRect.width / 2;
      const logoCenterY = logoRect.top + logoRect.height / 2;
      const videoCenterX = ((logoCenterX - videoRect.left) / videoRect.width) * video.videoWidth;
      const videoCenterY = ((logoCenterY - videoRect.top) / videoRect.height) * video.videoHeight;
      const videoWidth = (canvasWidth / videoRect.width) * video.videoWidth;
      const videoHeight = (canvasHeight / videoRect.height) * video.videoHeight;
      
      let videoX = Math.max(0, Math.min(videoCenterX - videoWidth / 2, video.videoWidth - videoWidth));
      let videoY = Math.max(0, Math.min(videoCenterY - videoHeight / 2, video.videoHeight - videoHeight));
      
      try {
        const internalWidth = Math.round(canvasWidth * dpr);
        const internalHeight = Math.round(canvasHeight * dpr);
        
        if (canvas.width !== internalWidth || canvas.height !== internalHeight) {
          canvas.width = internalWidth;
          canvas.height = internalHeight;
        }
        
        // Draw video section
        ctx.clearRect(0, 0, internalWidth, internalHeight);
        ctx.drawImage(video, videoX, videoY, videoWidth, videoHeight, 0, 0, internalWidth, internalHeight);
        const videoImageData = ctx.getImageData(0, 0, internalWidth, internalHeight);
        const videoData = videoImageData.data;
        
        // Draw logo
        ctx.clearRect(0, 0, internalWidth, internalHeight);
        ctx.drawImage(logoImage, 0, 0, internalWidth, internalHeight);
        const logoImageData = ctx.getImageData(0, 0, internalWidth, internalHeight);
        const logoData = logoImageData.data;
        
        // Apply difference blend
        for (let i = 0; i < logoData.length; i += 4) {
          if (logoData[i + 3] > 0) {
            logoData[i] = Math.abs(videoData[i] - logoData[i]);
            logoData[i + 1] = Math.abs(videoData[i + 1] - logoData[i + 1]);
            logoData[i + 2] = Math.abs(videoData[i + 2] - logoData[i + 2]);
          } else {
            logoData[i + 3] = 0;
          }
        }
        ctx.putImageData(logoImageData, 0, 0);
      } catch (e) {
        console.warn('Canvas blend failed:', e.message);
        logoImg.style.opacity = '1';
        logoImg.style.mixBlendMode = 'exclusion';
        canvas.style.display = 'none';
      }
    }
    
    logoImage.onerror = () => {
      logoImg.style.opacity = '1';
      logoImg.style.mixBlendMode = 'exclusion';
      canvas.style.display = 'none';
    };
    
    logoImage.onload = () => {
      if (!logoImage.naturalWidth || !logoImage.naturalHeight) {
        logoImg.style.opacity = '1';
        logoImg.style.mixBlendMode = 'exclusion';
        canvas.style.display = 'none';
        return;
      }
      
      resizeCanvas();
      
      function onVideoReady() {
        if (video.readyState >= 2 && video.videoWidth > 0) updateBlend();
      }
      
      if (video.readyState >= 2 && video.videoWidth > 0) {
        onVideoReady();
      } else {
        video.addEventListener('loadeddata', onVideoReady, { once: true });
        video.addEventListener('loadedmetadata', onVideoReady, { once: true });
        video.addEventListener('canplay', onVideoReady, { once: true });
      }
      
      video.addEventListener('timeupdate', updateBlend);
      const resizeHandler = () => { 
        resizeCanvas(); 
        updateBlend(); 
      };
      window.addEventListener('resize', resizeHandler);
      setInterval(updateBlend, 100);
    };
    
    if (logoImage.complete && logoImage.naturalWidth > 0) {
      setTimeout(() => logoImage.onload(), 50);
    } else {
      logoImage.onerror = () => {
        logoImg.style.opacity = '1';
        logoImg.style.mixBlendMode = 'exclusion';
        canvas.style.display = 'none';
      };
    }
  },
  
  initTextBlend(canvas, textElement, video) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      textElement.style.mixBlendMode = 'exclusion';
      return;
    }
    
    // Get text and apply uppercase (matching CSS text-transform)
    const text = textElement.textContent.trim().toUpperCase();
    const computedStyle = window.getComputedStyle(textElement);
    const fontSize = parseFloat(computedStyle.fontSize);
    const fontFamily = computedStyle.fontFamily;
    const fontWeight = computedStyle.fontWeight;
    const letterSpacing = computedStyle.letterSpacing;
    
    let dpr = window.devicePixelRatio || 1;
    let canvasWidth = 0;
    let canvasHeight = 0;
    
    function resizeCanvas() {
      const textRect = textElement.getBoundingClientRect();
      canvasWidth = textRect.width || 100;
      canvasHeight = textRect.height || fontSize * 1.2;
      
      canvas.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;width:' + canvasWidth + 'px;height:' + canvasHeight + 'px;';
      
      const internalWidth = Math.round(canvasWidth * dpr);
      const internalHeight = Math.round(canvasHeight * dpr);
      
      canvas.width = internalWidth;
      canvas.height = internalHeight;
      ctx.scale(dpr, dpr);
    }
    
    function updateBlend() {
      if (video.readyState < 2 || !video.videoWidth || !canvasWidth) return;
      
      const textRect = textElement.getBoundingClientRect();
      const videoRect = video.getBoundingClientRect();
      
      if (textRect.width === 0 || textRect.height === 0 || videoRect.width === 0) return;
      
      const textCenterX = textRect.left + textRect.width / 2;
      const textCenterY = textRect.top + textRect.height / 2;
      const videoCenterX = ((textCenterX - videoRect.left) / videoRect.width) * video.videoWidth;
      const videoCenterY = ((textCenterY - videoRect.top) / videoRect.height) * video.videoHeight;
      const videoWidth = (canvasWidth / videoRect.width) * video.videoWidth;
      const videoHeight = (canvasHeight / videoRect.height) * video.videoHeight;
      
      let videoX = Math.max(0, Math.min(videoCenterX - videoWidth / 2, video.videoWidth - videoWidth));
      let videoY = Math.max(0, Math.min(videoCenterY - videoHeight / 2, video.videoHeight - videoHeight));
      
      try {
        const internalWidth = Math.round(canvasWidth * dpr);
        const internalHeight = Math.round(canvasHeight * dpr);
        
        if (canvas.width !== internalWidth || canvas.height !== internalHeight) {
          canvas.width = internalWidth;
          canvas.height = internalHeight;
          ctx.scale(dpr, dpr);
        }
        
        // Draw video section
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(video, videoX, videoY, videoWidth, videoHeight, 0, 0, canvasWidth, canvasHeight);
        const videoImageData = ctx.getImageData(0, 0, internalWidth, internalHeight);
        const videoData = videoImageData.data;
        
        // Draw text (uppercase)
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = '#ffffff';
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.letterSpacing = letterSpacing;
        ctx.textBaseline = 'top';
        ctx.fillText(text, 0, 0);
        
        // Apply difference blend
        const textImageData = ctx.getImageData(0, 0, internalWidth, internalHeight);
        const textData = textImageData.data;
        for (let i = 0; i < textData.length; i += 4) {
          if (textData[i + 3] > 0) {
            textData[i] = Math.abs(videoData[i] - textData[i]);
            textData[i + 1] = Math.abs(videoData[i + 1] - textData[i + 1]);
            textData[i + 2] = Math.abs(videoData[i + 2] - textData[i + 2]);
          }
        }
        ctx.putImageData(textImageData, 0, 0);
        
        textElement.style.color = 'transparent';
        if (textElement.classList.contains('header__nav-link--right')) {
          textElement.style.display = 'flex';
          textElement.style.alignItems = 'center';
        }
      } catch (e) {
        console.warn('Text canvas blend failed:', e.message);
        textElement.style.mixBlendMode = 'exclusion';
        textElement.style.color = '';
        canvas.style.display = 'none';
      }
    }
    
    resizeCanvas();
    
    function onVideoReady() {
      if (video.readyState >= 2 && video.videoWidth > 0) updateBlend();
    }
    
    if (video.readyState >= 2 && video.videoWidth > 0) {
      onVideoReady();
    } else {
      video.addEventListener('loadeddata', onVideoReady, { once: true });
      video.addEventListener('loadedmetadata', onVideoReady, { once: true });
    }
    
    video.addEventListener('timeupdate', updateBlend);
    window.addEventListener('resize', () => { resizeCanvas(); updateBlend(); });
    setInterval(updateBlend, 100);
  },
  
  initToggleBlend(canvas, spanElement, video) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      spanElement.style.mixBlendMode = 'exclusion';
      return;
    }
    
    let dpr = window.devicePixelRatio || 1;
    const spanWidth = 24;
    const spanHeight = 2;
    
    function resizeCanvas() {
      canvas.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;width:' + spanWidth + 'px;height:' + spanHeight + 'px;';
      
      const internalWidth = Math.round(spanWidth * dpr);
      const internalHeight = Math.round(spanHeight * dpr);
      
      canvas.width = internalWidth;
      canvas.height = internalHeight;
      ctx.scale(dpr, dpr);
    }
    
    function updateBlend() {
      if (video.readyState < 2 || !video.videoWidth) return;
      
      const spanRect = spanElement.getBoundingClientRect();
      const videoRect = video.getBoundingClientRect();
      
      if (spanRect.width === 0 || spanRect.height === 0 || videoRect.width === 0) return;
      
      const spanCenterX = spanRect.left + spanRect.width / 2;
      const spanCenterY = spanRect.top + spanRect.height / 2;
      const videoCenterX = ((spanCenterX - videoRect.left) / videoRect.width) * video.videoWidth;
      const videoCenterY = ((spanCenterY - videoRect.top) / videoRect.height) * video.videoHeight;
      const videoWidth = (spanWidth / videoRect.width) * video.videoWidth;
      const videoHeight = (spanHeight / videoRect.height) * video.videoHeight;
      
      let videoX = Math.max(0, Math.min(videoCenterX - videoWidth / 2, video.videoWidth - videoWidth));
      let videoY = Math.max(0, Math.min(videoCenterY - videoHeight / 2, video.videoHeight - videoHeight));
      
      try {
        const internalWidth = Math.round(spanWidth * dpr);
        const internalHeight = Math.round(spanHeight * dpr);
        
        if (canvas.width !== internalWidth || canvas.height !== internalHeight) {
          canvas.width = internalWidth;
          canvas.height = internalHeight;
          ctx.scale(dpr, dpr);
        }
        
        // Draw video section
        ctx.clearRect(0, 0, spanWidth, spanHeight);
        ctx.drawImage(video, videoX, videoY, videoWidth, videoHeight, 0, 0, spanWidth, spanHeight);
        const videoImageData = ctx.getImageData(0, 0, internalWidth, internalHeight);
        const videoData = videoImageData.data;
        
        // Draw white rectangle
        ctx.clearRect(0, 0, spanWidth, spanHeight);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, spanWidth, spanHeight);
        const spanImageData = ctx.getImageData(0, 0, internalWidth, internalHeight);
        const spanData = spanImageData.data;
        
        // Apply difference blend
        for (let i = 0; i < spanData.length; i += 4) {
          if (spanData[i + 3] > 0) {
            spanData[i] = Math.abs(videoData[i] - spanData[i]);
            spanData[i + 1] = Math.abs(videoData[i + 1] - spanData[i + 1]);
            spanData[i + 2] = Math.abs(videoData[i + 2] - spanData[i + 2]);
          }
        }
        ctx.putImageData(spanImageData, 0, 0);
        spanElement.style.backgroundColor = 'transparent';
      } catch (e) {
        console.warn('Toggle canvas blend failed:', e.message);
        spanElement.style.mixBlendMode = 'exclusion';
        spanElement.style.backgroundColor = '';
        canvas.style.display = 'none';
      }
    }
    
    resizeCanvas();
    
    function onVideoReady() {
      if (video.readyState >= 2 && video.videoWidth > 0) updateBlend();
    }
    
    if (video.readyState >= 2 && video.videoWidth > 0) {
      onVideoReady();
    } else {
      video.addEventListener('loadeddata', onVideoReady, { once: true });
      video.addEventListener('loadedmetadata', onVideoReady, { once: true });
    }
    
    video.addEventListener('timeupdate', updateBlend);
    window.addEventListener('resize', () => { resizeCanvas(); updateBlend(); });
    setInterval(updateBlend, 100);
  },
  
  setupMobileMenu() {
    if (!this.menuToggle || !this.nav) {
      console.warn('Menu elements not found', { toggle: this.menuToggle, nav: this.nav });
      return;
    }
    
    this.menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isActive = this.nav.classList.toggle('active');
      this.menuToggle.classList.toggle('active', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
      console.log('Menu toggled', { isActive, navClasses: this.nav.className });
    });
    
    // Close menu when clicking nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.nav.classList.remove('active');
        this.menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    
    // Also close menu when clicking the right-side link
    if (this.rightLink) {
      this.rightLink.addEventListener('click', () => {
        this.nav.classList.remove('active');
        this.menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  },
  
  setupSmoothScroll() {
    // Only handle smooth scroll for anchor links on the same page
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        // Only prevent default for same-page anchor links
        if (href?.startsWith('#') && document.querySelector(href)) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target && this.header) {
            const headerHeight = this.header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }
};

// ============================================
// PROJECTS MODULE
// ============================================

const Projects = {
  init() {
    this.grid = document.getElementById('projectsGrid');
    if (!this.grid) return;
    
    this.render();
    this.attachEventListeners();
  },
  
  render() {
    if (!CONFIG.projects.length) return;
    
    this.grid.innerHTML = CONFIG.projects.map(project => `
      <div class="project-card" data-project-id="${project.id}">
        <img src="${project.image}" alt="${project.title}" class="project-card__image">
        <div class="project-card__overlay">
          <h3 class="project-card__title">${project.title}</h3>
          <span class="project-card__year">${project.year}</span>
        </div>
      </div>
    `).join('');
  },
  
  attachEventListeners() {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const projectId = parseInt(e.currentTarget.dataset.projectId);
        const project = CONFIG.projects.find(p => p.id === projectId);
        if (project) {
          this.handleProjectClick(project);
        }
      });
    });
  },
  
  handleProjectClick(project) {
    // Override this method to implement project detail view
    console.log('Opening project:', project);
  },
  
  // Public method to add projects dynamically
  addProject(project) {
    CONFIG.projects.push(project);
    this.render();
    this.attachEventListeners();
  }
};

// ============================================
// ANIMATIONS MODULE
// ============================================

const Animations = {
  init() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      CONFIG.scrollAnimation
    );
    
    this.observeElements();
  },
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after animation to improve performance
        this.observer.unobserve(entry.target);
      }
    });
  },
  
  observeElements() {
    const elements = document.querySelectorAll('.project-card, .service-item, .news-item');
    elements.forEach(el => {
      this.observer.observe(el);
    });
  }
};

// ============================================
// APP INITIALIZATION
// ============================================

const App = {
  init() {
    // Initialize all modules
    Navigation.init();
    Projects.init();
    Animations.init();
  }
};

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// ============================================
// HERO VIDEO CANVAS MIRROR (BLEND FIX)
// ============================================

(function heroVideoCanvas() {
  const video = document.querySelector('.hero__video');
  const canvas = document.querySelector('.hero__video-canvas');
  if (!video || !canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let dpr = window.devicePixelRatio || 1;
  let hasDrawn = false;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function getPanPercent() {
    // Match kad.no mobile pan timing/positions
    const duration = video.duration || 25;
    const t = video.currentTime || 0;
    const nudgeStart = 8;
    const panStart = 10;
    const startPos = 60;
    const nudgePos = 75;
    const endPos = 15;

    if (t <= nudgeStart) {
      return startPos;
    }
    if (t <= panStart) {
      const fracNudge = (t - nudgeStart) / (panStart - nudgeStart);
      return startPos + (nudgePos - startPos) * fracNudge;
    }

    const span = Math.max(duration - panStart, 0.1);
    const frac = Math.min((t - panStart) / span, 1);
    return nudgePos + (endPos - nudgePos) * frac;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resize);
  video.addEventListener('loadedmetadata', resize);
  video.addEventListener('loadeddata', resize);
  resize();

  function draw() {
    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
      requestAnimationFrame(draw);
      return;
    }

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;

    if (!vw || !vh || !cw || !ch) {
      requestAnimationFrame(draw);
      return;
    }

    const vr = vw / vh;
    const cr = cw / ch;

    let sx, sy, sw, sh;

    if (vr > cr) {
      sh = vh;
      sw = vh * cr;
      const maxPan = Math.max(vw - sw, 0);
      if (isMobile() && maxPan > 0) {
        sx = maxPan * (getPanPercent() / 100);
      } else {
        sx = (vw - sw) / 2;
      }
      sy = 0;
    } else {
      sw = vw;
      sh = vw / cr;
      sx = 0;
      sy = (vh - sh) / 2;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);

    if (!hasDrawn) {
      // Hide the video once the canvas has a frame
      video.style.opacity = '0';
      hasDrawn = true;
    }

    requestAnimationFrame(draw);
  }

  video.addEventListener('play', draw);
  // Start the loop immediately in case autoplay is blocked
  requestAnimationFrame(draw);
})();

