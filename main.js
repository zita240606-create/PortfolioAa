/**
 * ==========================================================================
 * PORTFOLIO JAVASCRIPT MASTER SCRIPT
 * Features: Dark/Light Mode, Preloader, Scroll-to-Top, Scroll Reveal,
 * Sticky Navbar, Portfolio Filter & Modal, Interactive Contact Form
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Preloader
  initPreloader();

  // 2. Initialize Dark / Light Theme
  initTheme();

  // 3. Initialize Sticky Navbar & Active Link Detection
  initNavbar();

  // 4. Initialize Scroll to Top Button
  initScrollTop();

  // 5. Initialize Scroll Reveal Animations (Intersection Observer)
  initScrollReveal();

  // 6. Initialize Portfolio Filtering & Modal (if present)
  initPortfolioFeatures();

  // 7. Initialize Contact Form Validation & Toast (if present)
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. Preloader Handler
   -------------------------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const hidePreloader = () => {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  };

  // If already loaded
  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 300);
  } else {
    window.addEventListener('load', () => {
      setTimeout(hidePreloader, 350);
    });
  }
}

/* --------------------------------------------------------------------------
   2. Dark / Light Theme Controller
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const storedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Determine initial theme
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        themeIcon.style.color = '#facc15'; // Warm yellow for sun
      } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        themeIcon.style.color = '#f43f5e'; // Chic rose for moon
      }
    }
  }
}

/* --------------------------------------------------------------------------
   3. Navbar Scroll Effect & Active Page Highlighter
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    });
  }

  // Highlight current page navigation link based on current file name
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile collapse controller
  const navCollapse = document.getElementById('navbarNav');
  let bsCollapse = null;
  if (navCollapse && window.bootstrap) {
    bsCollapse = new window.bootstrap.Collapse(navCollapse, { toggle: false });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (bsCollapse && window.innerWidth < 992 && navCollapse && navCollapse.classList.contains('show')) {
        bsCollapse.hide();
      }
    });
  });

  // Smooth scrolling for anchor links (e.g. Back to Top or # targets)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 75;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        if (bsCollapse && window.innerWidth < 992 && navCollapse && navCollapse.classList.contains('show')) {
          bsCollapse.hide();
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Scroll To Top Button
   -------------------------------------------------------------------------- */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 320) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   5. Scroll Reveal with Intersection Observer
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if observer not supported
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/* --------------------------------------------------------------------------
   6. Portfolio Filter & Detail Modal
   -------------------------------------------------------------------------- */
function initPortfolioFeatures() {
  const filterBtns = document.querySelectorAll('.portfolio-filter .filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  // Filter Buttons
  if (filterBtns.length && portfolioItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.92)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // Portfolio Item Data Map for Modal
  const projectDatabase = {
    '1': {
      title: 'MindFlow - Mental Wellness Mobile App',
      category: 'UI/UX Design & Prototyping',
      image: 'assets/images/project-1.svg',
      client: 'HealthTech Innovation Studio',
      year: '2026',
      tools: ['Figma', 'Adobe Illustrator', 'Protopie'],
      description: 'แอปพลิเคชันส่งเสริมสุขภาพจิตและฝึกสมาธิ ออกแบบด้วยแนวคิด Human-Centered Design เน้นสร้างบรรยากาศที่ผ่อนคลายผ่านโทนสีฟ้า ขาว และเหลือง พร้อมระบบ Daily Mood Tracker, Guided Meditation และ Analytics Dashboard.',
      features: [
        'ระบบ Interactive Mood Tracking รายวัน',
        'ระบบแนะนำแบบฝึกสมาธิเฉพาะบุคคลด้วย AI',
        'ดีไซน์แบบ Glassmorphism สบายตา ใช้งานง่าย'
      ],
      link: '#'
    },
    '2': {
      title: 'Lumina Cafe - Specialty Coffee Brand Identity',
      category: 'Branding & Packaging Design',
      image: 'assets/images/project-2.svg',
      client: 'Lumina Specialty Roasters',
      year: '2025',
      tools: ['Adobe Illustrator', 'Photoshop', 'Dimension'],
      description: 'การออกแบบอัตลักษณ์แบรนด์ร้านกาแฟระดับพรีเมียม ตั้งแต่การออกแบบโลโก้ โทนสี บรรจุภัณฑ์เมล็ดกาแฟ แก้วกาแฟ และสื่อส่งเสริมการขาย ที่ผสมผสานความอบอุ่นของสีเหลืองทองและความโมเดิร์นของสีฟ้าเข้มอย่างลงตัว',
      features: [
        'Brand Identity Guidelines & Typography Set',
        'การออกแบบบรรจุภัณฑ์แบบยั่งยืน (Eco-Friendly)',
        'ชุด Stationary และสื่อโซเชียลมีเดียครบวงจร'
      ],
      link: '#'
    },
    '3': {
      title: 'Aura Creative Studio - Interactive Web Experience',
      category: 'Web Design & Front-End Development',
      image: 'assets/images/project-3.svg',
      client: 'Aura Interactive Bangkok',
      year: '2026',
      tools: ['HTML5/CSS3', 'JavaScript', 'Bootstrap 5', 'Three.js'],
      description: 'เว็บไซต์พอร์ตโฟลิโอสำหรับครีเอทีฟสตูดิโอ รองรับการตอบสนองทุกอุปกรณ์แบบ Fully Responsive พร้อมแอนิเมชัน Smooth Scrolling, Interactive 3D Canvas และระบบจัดการเนื้อหาที่ลื่นไหลระดับสากล',
      features: [
        'High Performance Score 99+ บน Google Lighthouse',
        'Smooth Micro-interactions & Glassmorphism UI',
        'รองรับ Responsive 100% ทั้งมือถือ แท็บเล็ต และคอมพิวเตอร์'
      ],
      link: '#'
    },
    '4': {
      title: 'Solaris - 3D Character & Sci-Fi Metaverse Art',
      category: '3D Art & Motion Animation',
      image: 'assets/images/project-4.svg',
      client: 'Metaverse Visual Showcase',
      year: '2025',
      tools: ['Blender 4.2', 'Octane Render', 'After Effects'],
      description: 'งานออกแบบ 3D โมเดลตัวละครและฉากสไตล์ไซไฟอวกาศ เพื่อนำไปใช้ในงาน Virtual Production และ Interactive Media Showcase โดดเด่นด้วยแสงเงา Shader และ Particle Effect ระดับสตูดิโอมืออาชีพ',
      features: [
        'Octane Lighting & Volumetric Glow System',
        'Rigging & Dynamic Particle Animation',
        'การเรนเดอร์ความละเอียดสูงระดับ 4K สำหรับ Virtual Media'
      ],
      link: '#'
    },
    '5': {
      title: 'EcoCycle - Smart Waste & Sustainability Analytics',
      category: 'Product Design & Web App UI',
      image: 'assets/images/project-5.svg',
      client: 'Green Earth Initiative',
      year: '2025',
      tools: ['Figma', 'Chart.js', 'Bootstrap 5'],
      description: 'แดชบอร์ดแสดงผลข้อมูลการจัดการขยะรีไซเคิลและการลดคาร์บอนฟุตพริ้นท์แบบเรียลไทม์ ออกแบบเพื่อองค์กรธุรกิจที่มุ่งเน้นความยั่งยืน แสดงผลผ่านกราฟิก กราฟข้อมูล และดัชนีชี้วัดที่เข้าใจง่าย',
      features: [
        'Real-time Data Visualization & Smart Gauges',
        'ระบบแจ้งเตือนและดาวน์โหลดสรุปรายงาน ESG รายเดือน',
        'รองรับโหมด Dark / Light Mode สำหรับการทำงานในสำนักงาน'
      ],
      link: '#'
    },
    '6': {
      title: 'Neon Pulse - Digital Media & Sound Festival',
      category: 'Visual Identity & Creative Media Campaign',
      image: 'assets/images/project-6.svg',
      client: 'Bangkok Creative Arts Council',
      year: '2026',
      tools: ['Photoshop', 'Illustrator', 'Cinema 4D'],
      description: 'แคมเปญสื่อสร้างสรรค์สำหรับเทศกาลดนตรีและศิลปะดิจิทัลประจำปี ออกแบบโปสเตอร์หลัก โมชั่นกราฟิกสปอตโฆษณา บัตรเข้าชมงาน และสเตจกราฟิกสำหรับจัดแสดงบนจอ LED ขนาดใหญ่',
      features: [
        'Kinetic Typography & Audio-reactive Poster Design',
        'Social Media Campaign Media Pack (10+ formats)',
        'Key Visuals สำหรับงานจัดแสดงระดับนานาชาติ'
      ],
      link: '#'
    }
  };

  // Attach Modal Triggers
  const viewDetailBtns = document.querySelectorAll('.btn-view-project');
  const projectModalElement = document.getElementById('projectModal');

  if (viewDetailBtns.length && projectModalElement && window.bootstrap) {
    const modal = new window.bootstrap.Modal(projectModalElement);

    viewDetailBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = btn.getAttribute('data-project-id');
        const data = projectDatabase[projectId];

        if (data) {
          document.getElementById('modalProjectTitle').textContent = data.title;
          document.getElementById('modalProjectCategory').textContent = data.category;
          document.getElementById('modalProjectImg').src = data.image;
          document.getElementById('modalProjectClient').textContent = data.client;
          document.getElementById('modalProjectYear').textContent = data.year;
          document.getElementById('modalProjectDesc').textContent = data.description;

          // Tools badge list
          const toolsContainer = document.getElementById('modalProjectTools');
          toolsContainer.innerHTML = '';
          data.tools.forEach(tool => {
            const badge = document.createElement('span');
            badge.className = 'glass-pill me-2 mb-2';
            badge.innerHTML = `<i class="fa-solid fa-code text-primary"></i> ${tool}`;
            toolsContainer.appendChild(badge);
          });

          // Features list
          const featuresList = document.getElementById('modalProjectFeatures');
          featuresList.innerHTML = '';
          data.features.forEach(feat => {
            const li = document.createElement('li');
            li.className = 'mb-2 d-flex align-items-center gap-2';
            li.innerHTML = `<i class="fa-solid fa-check-circle text-warning"></i> <span>${feat}</span>`;
            featuresList.appendChild(li);
          });

          modal.show();
        }
      });
    });
  }
}

/* --------------------------------------------------------------------------
   7. Contact Form Handler (Validation & Success Feedback)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check HTML5 validity
    if (!contactForm.checkValidity()) {
      e.stopPropagation();
      contactForm.classList.add('was-validated');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Simulate sending with loading spinner
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> กำลังส่งข้อความ...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      // Show friendly success notification
      if (formSuccessAlert) {
        formSuccessAlert.classList.remove('d-none');
        formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert('ส่งข้อความสำเร็จเรียบร้อยแล้ว! ขอบคุณที่ติดต่อ จะตอบกลับโดยเร็วที่สุดครับ');
      }

      // Reset form
      contactForm.reset();
      contactForm.classList.remove('was-validated');
    }, 900);
  });
}

