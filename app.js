document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. LIGHT / DARK MODE SYSTEM (THEME SWITCHER)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const rootElement = document.documentElement;

  // Retrieve persistent theme preference or default to dark
  const currentTheme = localStorage.getItem('theme') || 'dark';
  
  if (currentTheme === 'light') {
    rootElement.setAttribute('data-theme', 'light');
  } else {
    rootElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = rootElement.getAttribute('data-theme') === 'light';
      
      if (isLight) {
        rootElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        rootElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // ==========================================
  // 2. STICKY NAVIGATION EFFECT
  // ==========================================
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // ==========================================
  // 3. HERO SECTION AUTO-TYPING ENGINE
  // ==========================================
  const typingTextSpan = document.getElementById('typing-text');
  const roles = ['Full-Stack Engineer', 'UI/UX Creator', 'Web App Architect', 'Creative Developer'];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeRole() {
    if (!typingTextSpan) return;

    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Deleting speed is twice as fast
      typingSpeed = 50;
      typingTextSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingSpeed = 120;
      typingTextSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    // State machine check
    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      isDeleting = true;
      typingSpeed = 2000; // 2s pause
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length; // cycle next word
      typingSpeed = 500; // 0.5s pause before typing next
    }

    setTimeout(typeRole, typingSpeed);
  }

  // Initial call
  if (typingTextSpan) {
    setTimeout(typeRole, 1000);
  }

  // ==========================================
  // 4. SCROLL-TRIGGERED GLOWING SKILLS
  // ==========================================
  const skillsSection = document.getElementById('skills');
  const progressFills = document.querySelectorAll('.skill-progress-fill');

  if (skillsSection && progressFills.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.15 // trigger when 15% visible
    };

    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate each fill to target percent
          progressFills.forEach(fill => {
            const percent = fill.getAttribute('data-percent');
            fill.style.width = `${percent}%`;
          });
          // Stop observing after firing
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    skillsObserver.observe(skillsSection);
  }

  // ==========================================
  // 5. INTERACTIVE PORTFOLIO CARDS FILTER
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button styling
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Custom smooth scale animation triggers
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.85)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 350);
        }
      });
    });
  });

  // ==========================================
  // 6. TESTIMONIALS SLIDER
  // ==========================================
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const btnPrev = document.getElementById('slider-prev');
  const btnNext = document.getElementById('slider-next');
  let currentSlide = 0;
  let slideTimer = null;

  function showSlide(index) {
    if (slides.length === 0) return;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function startAutoSlide() {
    stopAutoSlide();
    slideTimer = setInterval(nextSlide, 6000); // cycle every 6s
  }

  function stopAutoSlide() {
    if (slideTimer) clearInterval(slideTimer);
  }

  if (btnNext && btnPrev) {
    btnNext.addEventListener('click', () => {
      nextSlide();
      startAutoSlide();
    });

    btnPrev.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      startAutoSlide();
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        startAutoSlide();
      });
    });

    // Initialize test slider
    showSlide(0);
    startAutoSlide();
  }

  // ==========================================
  // 7. CONTACT FORM SIMULATOR SUBMISSIONS
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btnSubmit = contactForm.querySelector('.btn-submit-contact');
      const originalText = btnSubmit.innerHTML;

      // Enter submitting loading state
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Initializing Intake...';

      setTimeout(() => {
        // Transition button to glowing green Success state
        btnSubmit.style.background = 'linear-gradient(135deg, var(--color-secondary) 0%, #059669 100%)';
        btnSubmit.style.boxShadow = '0 4px 15px rgba(5, 150, 105, 0.4)';
        btnSubmit.style.color = '#0B0F19';
        btnSubmit.innerHTML = '<i class="fas fa-check-circle"></i> Connection Registered Successfully!';

        // Clear input values
        contactForm.reset();

        // Restore button after delay
        setTimeout(() => {
          btnSubmit.disabled = false;
          btnSubmit.style.background = '';
          btnSubmit.style.boxShadow = '';
          btnSubmit.style.color = '';
          btnSubmit.innerHTML = originalText;
        }, 3000);
      }, 1500);
    });
  }

  // ==========================================
  // 8. INTERACTIVE GLASS CURSOR PHYSICS (LERP ENGINE)
  // ==========================================
  const cursorFollower = document.getElementById('cursor-follower');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;
  const lerpFactor = 0.15; // Smooth trailing factor

  if (cursorFollower) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Lerp update loop
    function updateCursorPosition() {
      // Linear Interpolation: current = current + (target - current) * lerp
      followerX += (mouseX - followerX) * lerpFactor;
      followerY += (mouseY - followerY) * lerpFactor;

      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;

      requestAnimationFrame(updateCursorPosition);
    }
    
    // Start physics loop
    requestAnimationFrame(updateCursorPosition);

  }

  // ==========================================
  // 9. HIGH-PERFORMANCE SCROLL REVEAL OBSERVER
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const revealObserverOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // reveal when 10% visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Optimize: run reveal only once
        }
      });
    }, revealObserverOptions);

    revealElements.forEach(elem => {
      revealObserver.observe(elem);
    });
  }

  // ==========================================
  // 10. B2B SMT PRODUCTION & COST SIMULATOR ENGINE
  // ==========================================
  const simQuantityInput = document.getElementById('sim-quantity');
  const simQtyBubble = document.getElementById('sim-qty-bubble');
  const systemClockSmt = document.getElementById('system-clock-smt');
  const btnSimulateSmt = document.getElementById('btn-simulate-smt');

  // A. Slider Volume Synchronization
  if (simQuantityInput && simQtyBubble) {
    simQuantityInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      simQtyBubble.textContent = `${val.toLocaleString()} users`;
    });
  }

  // B. High-Tech HUD Military Clock
  if (systemClockSmt) {
    function updateHUDClock() {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      systemClockSmt.textContent = `SYS TIME: ${hrs} : ${mins} : ${secs}`;
    }
    updateHUDClock();
    setInterval(updateHUDClock, 1000);
  }

  // C. Simulation State Machine Engine
  let isSimulating = false;

  if (btnSimulateSmt) {
    btnSimulateSmt.addEventListener('click', () => {
      if (isSimulating) return; // Prevent double trigger
      isSimulating = true;

      // Select DOM nodes
      const layersSelect = document.getElementById('sim-layers');
      const dfmSelect = document.getElementById('sim-dfm');
      const quantitySlider = document.getElementById('sim-quantity');

      const hudStatus = document.getElementById('hud-smt-status');
      const hudLead = document.getElementById('hud-smt-lead');
      const hudYield = document.getElementById('hud-smt-yield');
      const hudUnitCost = document.getElementById('hud-smt-unit-cost');
      const hudPlacements = document.getElementById('hud-smt-placements');
      const hudActiveTag = document.getElementById('hud-smt-active-tag');

      const msgIntro = document.getElementById('smt-message-intro');
      const pcbVisualizer = document.getElementById('pcb-visualizer');
      const laserSweep = document.getElementById('laser-sweep');
      const smtComponents = document.querySelectorAll('.smt-component');
      const pcbTraces = document.querySelectorAll('.pcb-trace');

      // 1. Enter Booting / Setup State
      btnSimulateSmt.disabled = true;
      btnSimulateSmt.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Provisioning Cloud...';
      
      if (msgIntro) msgIntro.style.display = 'none';
      if (pcbVisualizer) pcbVisualizer.style.display = 'block';

      // Clear previous simulation traces and components
      smtComponents.forEach(comp => comp.classList.remove('soldered'));
      pcbTraces.forEach(trace => trace.classList.remove('active-trace'));

      // Initial Hud Setup
      if (hudStatus) {
        hudStatus.textContent = 'PROVISIONING NODES...';
        hudStatus.className = 'orange-val';
      }
      if (hudLead) hudLead.textContent = '-- ms';
      if (hudYield) hudYield.textContent = '-- %';
      if (hudUnitCost) hudUnitCost.textContent = '$0.00';
      if (hudPlacements) hudPlacements.textContent = '0 / 240';
      if (hudActiveTag) {
        hudActiveTag.textContent = 'CLUSTER ENGAGED';
        hudActiveTag.className = 'orange-val';
      }

      // 2. Transition to Phase 2: Spawning Containers (800ms)
      setTimeout(() => {
        if (hudStatus) {
          hudStatus.textContent = 'SPAWNING CONTAINERS...';
          hudStatus.className = 'cyan-val';
        }
        if (laserSweep) {
          laserSweep.classList.remove('aoi-scanning');
          laserSweep.classList.add('sweeping');
        }
        pcbTraces.forEach(trace => trace.classList.add('active-trace'));

        // Staggered node orchestration animation
        let placementsCount = 0;
        const totalPlacements = 240;
        const placementIntervalTime = 8; // ticks every 8ms
        const solderingInterval = setInterval(() => {
          placementsCount += 1;
          if (hudPlacements) {
            hudPlacements.textContent = `${placementsCount} / ${totalPlacements}`;
          }

          // Staggered node classes on svg
          const componentIndex = Math.floor((placementsCount / totalPlacements) * smtComponents.length);
          for (let i = 0; i < componentIndex; i++) {
            if (smtComponents[i]) {
              smtComponents[i].classList.add('soldered');
            }
          }

          if (placementsCount >= totalPlacements) {
            clearInterval(solderingInterval);
          }
        }, placementIntervalTime);

      }, 800);

      // 3. Transition to Phase 3: Database Replication Sync (2800ms)
      setTimeout(() => {
        if (hudStatus) {
          hudStatus.textContent = 'DATABASE SYNC...';
          hudStatus.className = 'blue-val';
        }
        if (laserSweep) {
          laserSweep.classList.remove('sweeping');
          laserSweep.classList.add('aoi-scanning');
        }
        pcbTraces.forEach(trace => trace.classList.remove('active-trace'));
      }, 2800);

      // 4. Transition to Phase 4: Sourcing Calculations & Complete (4200ms)
      setTimeout(() => {
        if (laserSweep) {
          laserSweep.classList.remove('sweeping', 'aoi-scanning');
        }

        // Get user parameters
        const layers = parseInt(layersSelect.value) || 6;
        const dfm = dfmSelect.value || 'elite';
        const volume = parseInt(quantitySlider.value) || 5000;

        // A. Latency Mathematics
        let latencyVal = 45;
        if (layers === 2) latencyVal = 120;
        else if (layers === 12) latencyVal = 12;
        if (dfm === 'elite') latencyVal -= 4; // High optimizations reduce network hops
        
        // B. Uptime Mathematics (with dynamic realistic fluctuations)
        let yieldRate = 99.99;
        if (dfm === 'standard') {
          yieldRate = parseFloat((91.5 + Math.random() * 2.1).toFixed(2));
        } else if (dfm === 'advanced') {
          yieldRate = parseFloat((97.8 + Math.random() * 1.1).toFixed(2));
        }

        // C. Monthly Cloud Bill Sourcing Curves
        let baseHostingCost = 280.00; // Container cluster
        if (layers === 2) baseHostingCost = 45.00; // Single VM instance
        else if (layers === 12) baseHostingCost = 15.00; // Serverless edge base

        // Bandwidth traffic scale: $0.01 per Monthly Active User (MAU)
        const bandwidthCost = volume * 0.01;

        // HA scaling redundancy multipliers
        let scaleMultiplier = 1.30; // Pro Scale
        if (dfm === 'standard') scaleMultiplier = 1.00; // Basic
        else if (dfm === 'elite') scaleMultiplier = 1.90; // Multi-region latency replication

        // Gross hosting bill cost
        const grossHostingCost = (baseHostingCost + bandwidthCost) * scaleMultiplier;

        // Reliability tax divisor
        const finalUnitCost = parseFloat((grossHostingCost / (yieldRate / 100)).toFixed(2));

        // Update HUD display values
        if (hudStatus) {
          hudStatus.textContent = 'DEPLOYMENT STABLE';
          hudStatus.className = 'emerald-val';
        }
        if (hudLead) {
          hudLead.textContent = `${latencyVal} ms`;
          hudLead.className = 'cyan-val';
        }
        if (hudYield) {
          hudYield.textContent = `${yieldRate}%`;
          hudYield.className = yieldRate >= 99 ? 'emerald-val' : yieldRate >= 95 ? 'cyan-val' : 'orange-val';
        }
        if (hudUnitCost) {
          hudUnitCost.textContent = `$${finalUnitCost.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
          hudUnitCost.className = 'cyan-val';
        }
        if (hudActiveTag) {
          hudActiveTag.textContent = 'SYSTEM ONLINE';
          hudActiveTag.className = 'emerald-val';
        }

        // Re-enable button
        btnSimulateSmt.disabled = false;
        btnSimulateSmt.innerHTML = '<i class="fa-solid fa-industry"></i> Deploy Infrastructure';

        isSimulating = false;
      }, 4400);

    });
  }
});
