// script.js - Core Portfolio Logic & Dynamic Tech Interactions

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Data Loading from config.js
  if (typeof CONFIG !== 'undefined') {
    loadPortfolioData(CONFIG);
  } else {
    console.error("CONFIG data not found. Please ensure config.js is loaded correctly.");
  }

  // 2. Interactive Canvas Grid Background
  initCanvasBackground();

  // 3. Theme Toggler
  initThemeToggle();

  // 4. Mobile Menu Navigation
  initMobileMenu();

  // 5. Scroll Reveal & Skill Progress Bar Trigger
  initScrollReveal();

  // 6. Project Filter Matrix
  initProjectFilters();

  // 7. Contact Form Handling
  initContactForm();
});

/**
 * Loads dynamic content from config.js and injects it into HTML nodes
 * @param {Object} data CONFIG object
 */
function loadPortfolioData(data) {
  // Profile elements
  const profile = data.profile;
  document.getElementById('hero-name').innerText = profile.name;
  document.getElementById('hero-name').setAttribute('data-text', profile.name);
  document.getElementById('detail-name').innerText = profile.name;
  document.getElementById('footer-name').innerText = profile.name;
  document.getElementById('hero-bio').innerText = profile.bio;
  document.getElementById('about-bio-text').innerText = profile.bio;
  document.getElementById('detail-email').innerText = profile.socials.email;

  // Gmail compose link (opens Gmail directly to send a message)
  const contactEmail = document.getElementById('contact-email');
  if (contactEmail) {
    contactEmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.socials.email)}&su=${encodeURIComponent('Hello from your portfolio site')}`;
    contactEmail.innerText = profile.socials.email;
  }

  // GitHub link in contact card
  const contactGithub = document.getElementById('contact-github');
  if (contactGithub && profile.socials.github) {
    contactGithub.href = profile.socials.github;
    contactGithub.innerText = profile.socials.github.replace(/^https?:\/\//, '');
  }

  // LinkedIn link in contact card
  const contactLinkedin = document.getElementById('contact-linkedin');
  if (contactLinkedin && profile.socials.linkedin) {
    contactLinkedin.href = profile.socials.linkedin;
    contactLinkedin.innerText = profile.socials.linkedin.replace(/^https?:\/\//, '');
  }
  
  // Set resume href
  const resumeBtn = document.getElementById('resume-btn');
  if (resumeBtn && profile.resumeUrl) {
    resumeBtn.href = profile.resumeUrl;
  }

  // Update Footer Year
  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.innerText = new Date().getFullYear();
  }

  // Social Links
  setSocialLink('social-github', profile.socials.github);
  setSocialLink('social-linkedin', profile.socials.linkedin);
  setSocialLink('social-twitter', profile.socials.twitter);

  // Typewriter animation trigger
  if (profile.titles && profile.titles.length > 0) {
    initTypewriter(profile.titles);
  }

  // Inject Skills
  renderSkills(data.skills);

  // Inject Projects
  renderProjects(data.projects);
}

function setSocialLink(id, url) {
  const el = document.getElementById(id);
  if (el) {
    if (url) {
      el.href = url;
    } else {
      el.style.display = 'none';
    }
  }
}

/**
 * Typewriter effect for Hero Titles
 * @param {Array<string>} titles 
 */
function initTypewriter(titles) {
  const target = document.getElementById('typewriter');
  if (!target) return;

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100; // Normal typing speed

  function type() {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
      target.innerText = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      delay = 50; // Deleting speed
    } else {
      target.innerText = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      delay = 100; // Normal speed
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      delay = 2000; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      delay = 500; // Pause before typing next word
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 500);
}

/**
 * Renders skill matrix categorized into layout panels
 * @param {Array<Object>} skillsList 
 */
function renderSkills(skillsList) {
  const container = document.getElementById('skills-container');
  if (!container) return;

  // Group by category
  const categories = {};
  skillsList.forEach(skill => {
    if (!categories[skill.category]) {
      categories[skill.category] = [];
    }
    categories[skill.category].push(skill);
  });

  // Generate layouts
  let html = '';
  for (const category in categories) {
    html += `
      <div class="terminal-panel">
        <div class="terminal-header">
          <div class="terminal-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="terminal-title">${category}</div>
          <div></div>
        </div>
        <div class="terminal-body skill-items">
          <h3 class="skill-category-title">
            <span>[#] ${category.toUpperCase()}</span>
            <i class="fa-solid fa-square-poll-vertical"></i>
          </h3>
          ${categories[category].map(skill => `
            <div class="skill-item">
              <div class="skill-info">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-percentage">${skill.level}%</span>
              </div>
              <div class="skill-bar-bg">
                <div class="skill-bar-fill" data-level="${skill.level}"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}

/**
 * Renders interactive projects into the projects grid
 * @param {Array<Object>} projectList 
 */
function renderProjects(projectList) {
  const container = document.getElementById('projects-container');
  if (!container) return;

  const html = projectList.map(project => {
    const filterClass = project.tags.join(' ');
    return `
      <div class="terminal-panel project-card" data-tags="${project.tags.join(',')}">
        <div class="terminal-header">
          <div class="terminal-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="terminal-title">${project.title}</div>
          <div></div>
        </div>
        <div class="terminal-body project-card-body" style="display: flex; flex-direction: column; height: 100%;">
          <span class="project-icon">${project.mockupIcon || '📂'}</span>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-desc">${project.description}</p>
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
          </div>
          <div class="project-links">
            <a href="${project.codeLink}" class="project-link" target="_blank">
              <i class="fa-brands fa-github"></i> REPO_DIR
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

/**
 * Floating interactive tech-nodes particle background animation
 */
function initCanvasBackground() {
  const canvas = document.getElementById('canvas-background');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const maxParticles = 60;

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      // Use HSL based accent color from style
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.fillStyle = isDark ? 'rgba(0, 240, 255, 0.4)' : 'rgba(2, 132, 199, 0.2)';
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Render Grid lines subtly
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    ctx.strokeStyle = isDark ? 'rgba(0, 240, 255, 0.02)' : 'rgba(15, 23, 42, 0.02)';
    ctx.lineWidth = 1;
    const gridSpacing = 40;
    for (let x = 0; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Update & draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw interactive node lines
    ctx.strokeStyle = isDark ? 'rgba(0, 240, 255, 0.08)' : 'rgba(2, 132, 199, 0.08)';
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Connect particles to mouse
    if (mouse.x !== null) {
      particles.forEach(p => {
        const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dist < 150) {
          ctx.strokeStyle = isDark ? 'rgba(0, 240, 255, 0.12)' : 'rgba(2, 132, 199, 0.1)';
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/**
 * Handle Theme switching (Light Mode vs Dark Mode)
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#theme-toggle i');
  if (!icon) return;
  if (theme === 'light') {
    icon.className = 'fa-solid fa-moon';
  } else {
    icon.className = 'fa-solid fa-sun';
  }
}

/**
 * Responsive Hamburger Mobile Navigation Menu
 */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const linksContainer = document.getElementById('nav-links');
  if (!toggle || !linksContainer) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    linksContainer.classList.toggle('open');
    const icon = toggle.querySelector('i');
    if (icon) {
      icon.className = linksContainer.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  });

  // Close menu when a navigation item is clicked
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      linksContainer.classList.remove('open');
      const icon = toggle.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !linksContainer.contains(e.target)) {
      linksContainer.classList.remove('open');
      const icon = toggle.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    }
  });
}

/**
 * Viewport Observer for fade-in reveals and skill progress filling
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.scroll-reveal');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  const options = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Check if this revealed section is the Skills section
        if (entry.target.id === 'skills') {
          animateSkillBars();
        }
      }
    });
  }, options);

  reveals.forEach(el => observer.observe(el));

  // Sync Nav active link on scroll
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop;
      const secHeight = sec.clientHeight;
      if (window.scrollY >= (secTop - 200)) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function animateSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-fill');
  fills.forEach(fill => {
    const level = fill.getAttribute('data-level');
    fill.style.width = `${level}%`;
  });
}

/**
 * Project filter catalog selector
 */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length === 0 || projectCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button states
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const tags = card.getAttribute('data-tags').toLowerCase().split(',');
        const filterLower = filterValue.toLowerCase();

        if (filterValue === 'all' || tags.includes(filterLower)) {
          card.style.display = 'block';
          // Fade-in animation
          card.animate([
            { opacity: 0, transform: 'scale(0.95)' },
            { opacity: 1, transform: 'scale(1)' }
          ], { duration: 300, easing: 'ease-out' });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Contact form submission — sends a real email via FormSubmit.co (no backend required)
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const origBtnHtml = submitBtn.innerHTML;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> TRANSMITTING...';
    status.className = 'form-status';
    status.style.display = 'none';

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      let data = null;
      try { data = await response.json(); } catch (_) { /* non-JSON response */ }

      const succeeded = response.ok && data && (data.success === true || data.success === 'true');

      if (succeeded) {
        status.className = 'form-status success';
        status.innerHTML = `<i class="fa-solid fa-circle-check"></i> Message sent! I'll get back to you soon.`;
        form.reset();
      } else if (data && data.message && /confirm|activat/i.test(data.message)) {
        status.className = 'form-status error';
        status.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Almost there — check your inbox for a FormSubmit activation email and click the confirmation link, then try again.`;
      } else {
        throw new Error((data && data.message) || 'Request failed');
      }
    } catch (err) {
      status.className = 'form-status error';
      status.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Couldn't send that (this page may need to be hosted online, not opened as a local file). Please email me directly instead.`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origBtnHtml;
      status.style.display = 'block';
    }
  });
}
