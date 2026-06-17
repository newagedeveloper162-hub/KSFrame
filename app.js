document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize Reveal on Scroll (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, no need to track it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Mobile Menu Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileMenu) {
    const toggleMenu = () => {
      mobileMenu.classList.toggle('translate-x-full');
      document.body.classList.toggle('overflow-hidden');
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', toggleMenu);
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
        document.body.classList.remove('overflow-hidden');
      });
    });
  }

  // --- Active Nav Highlight ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120; // offset for nav bar

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-teal', 'font-medium');
      link.classList.add('text-zinc-400');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.remove('text-zinc-400');
        link.classList.add('text-teal', 'font-medium');
      }
    });
  });

  // --- Target Segment Tab Switcher ---
  const segmentTabs = document.querySelectorAll('.segment-tab');
  const segmentContents = document.querySelectorAll('.segment-content');

  segmentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetSegment = tab.getAttribute('data-segment');

      // Update tab active classes to use KSFrames Brand Identity (Teal & Navy)
      segmentTabs.forEach(t => {
        t.className = "segment-tab px-6 py-3 border border-zinc-800 bg-zinc-900 text-zinc-400 font-heading font-bold text-sm uppercase tracking-wider hover:border-zinc-700 transition-all";
      });
      tab.className = "segment-tab px-6 py-3 border border-teal bg-teal text-navy font-heading font-bold text-sm uppercase tracking-wider transition-all";

      // Update content visibility
      segmentContents.forEach(content => {
        if (content.getAttribute('id') === `segment-${targetSegment}`) {
          content.classList.remove('hidden');
          content.classList.add('grid');
          // Trigger scroll-reveal effect on children immediately since they just appeared
          const childReveals = content.querySelectorAll('.reveal');
          childReveals.forEach(child => child.classList.add('active'));
        } else {
          content.classList.remove('grid');
          content.classList.add('hidden');
        }
      });
    });
  });

  // --- Dynamic Filterable Portfolio Gallery ---
  const galleryGrid = document.getElementById('gallery-grid');
  let activeFilter = 'all';

  function setupGalleryFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
      const filterValue = btn.getAttribute('data-filter');
      
      // Initial button state styling (Teal/Navy active, White/Zinc inactive)
      if (filterValue === activeFilter) {
        btn.className = "filter-btn px-5 py-2 border border-teal bg-teal text-navy font-heading font-bold text-xs uppercase tracking-wider transition-all";
      } else {
        btn.className = "filter-btn px-5 py-2 border border-zinc-200 bg-white text-zinc-500 font-heading font-bold text-xs uppercase tracking-wider hover:bg-zinc-100 transition-all";
      }
      
      // We rewrite event listener to prevent duplicate binding issues if setup is rerun
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
    });

    // Re-select and bind event listeners
    const freshFilterBtns = document.querySelectorAll('.filter-btn');
    freshFilterBtns.forEach(btn => {
      const filterValue = btn.getAttribute('data-filter');
      
      btn.addEventListener('click', () => {
        activeFilter = filterValue;
        
        // Update active class on clicked button
        freshFilterBtns.forEach(b => {
          b.className = "filter-btn px-5 py-2 border border-zinc-200 bg-white text-zinc-500 font-heading font-bold text-xs uppercase tracking-wider hover:bg-zinc-100 transition-all";
        });
        btn.className = "filter-btn px-5 py-2 border border-teal bg-teal text-navy font-heading font-bold text-xs uppercase tracking-wider transition-all";
        
        // Filter gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
          const itemCategories = item.getAttribute('data-category').split(' ');
          if (filterValue === 'all' || itemCategories.includes(filterValue)) {
            item.classList.remove('hidden-item');
            setTimeout(() => {
              item.style.position = 'relative';
              item.style.zIndex = '1';
            }, 50);
          } else {
            item.classList.add('hidden-item');
            setTimeout(() => {
              if (item.classList.contains('hidden-item')) {
                item.style.position = 'absolute';
              }
            }, 400); // matches CSS transition time
          }
        });
      });
    });

    // Apply active filter instantly to dynamic list
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
      const itemCategories = item.getAttribute('data-category').split(' ');
      if (activeFilter === 'all' || itemCategories.includes(activeFilter)) {
        item.classList.remove('hidden-item');
        item.style.position = 'relative';
        item.style.zIndex = '1';
      } else {
        item.classList.add('hidden-item');
        item.style.position = 'absolute';
      }
    });
  }

  function renderGallery() {
    if (!galleryGrid || typeof PORTFOLIO_DATA === 'undefined') return;
    
    galleryGrid.innerHTML = '';
    
    PORTFOLIO_DATA.forEach(item => {
      let placeholderHTML = '';
      let categoryLabel = '';
      let categoryColorClass = '';
      
      if (item.category === 'web') {
        placeholderHTML = `
          <div class="w-full h-36 bg-zinc-100 border border-zinc-200 flex flex-col justify-between p-3 rounded-md mb-4 relative overflow-hidden group">
            <div class="flex items-center gap-1.5 border-b border-zinc-200 pb-2 mb-2">
              <span class="w-2.5 h-2.5 rounded-full bg-zinc-300"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-zinc-300"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-zinc-300"></span>
              <div class="h-3 w-2/3 bg-zinc-200 rounded ml-2"></div>
            </div>
            <div class="space-y-2 flex-grow">
              <div class="h-4 w-4/5 bg-zinc-300 rounded"></div>
              <div class="h-2 w-full bg-zinc-200 rounded"></div>
              <div class="h-2 w-5/6 bg-zinc-200 rounded"></div>
            </div>
            <div class="h-5 w-20 bg-teal/20 rounded"></div>
          </div>
        `;
        categoryLabel = "Web Development";
        categoryColorClass = "text-teal";
      } else if (item.category === 'design') {
        placeholderHTML = `
          <div class="w-full h-36 bg-zinc-100 border border-zinc-200 flex flex-col justify-between p-3 rounded-md mb-4 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-tr from-coral/10 to-teal/10"></div>
            <div class="relative h-full flex flex-col justify-between z-10">
              <div class="h-4 w-2/3 bg-coral/20 rounded"></div>
              <div class="border border-zinc-300 w-16 h-16 self-center rounded flex items-center justify-center text-xs font-bold font-heading text-zinc-400">FRAME</div>
              <div class="h-2 w-1/2 bg-zinc-300 rounded"></div>
            </div>
          </div>
        `;
        categoryLabel = "Poster Design";
        categoryColorClass = "text-coral";
      } else if (item.category === 'video') {
        placeholderHTML = `
          <div class="w-full h-36 bg-zinc-100 border border-zinc-200 flex items-center justify-center rounded-md mb-4 relative overflow-hidden">
            <div class="absolute inset-y-0 w-24 bg-zinc-200 border-l border-r border-zinc-300 flex flex-col justify-between py-4 px-2">
              <div class="h-2 w-full bg-zinc-300 rounded"></div>
              <!-- Play button graphic -->
              <div class="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center self-center text-teal">▶</div>
              <div class="h-2 w-2/3 bg-zinc-300 rounded"></div>
            </div>
          </div>
        `;
        categoryLabel = "Video Editing";
        categoryColorClass = "text-teal";
      } else if (item.category === 'resume') {
        placeholderHTML = `
          <div class="w-full h-36 bg-zinc-100 border border-zinc-200 p-3 rounded-md mb-4 flex gap-3 overflow-hidden">
            <div class="w-1/3 bg-zinc-200 h-full rounded flex flex-col gap-2 p-1.5">
              <div class="w-8 h-8 rounded-full bg-zinc-300 self-center"></div>
              <div class="h-1.5 w-full bg-zinc-300 rounded"></div>
              <div class="h-1.5 w-2/3 bg-zinc-300 rounded"></div>
            </div>
            <div class="flex-grow space-y-2 py-1">
              <div class="h-3 w-4/5 bg-zinc-300 rounded"></div>
              <div class="h-1.5 w-full bg-zinc-200 rounded"></div>
              <div class="h-1.5 w-full bg-zinc-200 rounded"></div>
              <div class="h-1.5 w-full bg-zinc-200 rounded"></div>
              <div class="h-1.5 w-5/6 bg-zinc-200 rounded"></div>
            </div>
          </div>
        `;
        categoryLabel = "Resume Polish";
        categoryColorClass = "text-coral";
      } else {
        placeholderHTML = `
          <div class="w-full h-36 bg-zinc-100 border border-zinc-200 flex items-center justify-center rounded-md mb-4 relative overflow-hidden">
            <div class="text-zinc-300 font-heading text-xs font-bold uppercase tracking-wider">KSFRAMES</div>
          </div>
        `;
        categoryLabel = "Creative Asset";
        categoryColorClass = "text-teal";
      }
      
      const card = document.createElement('div');
      card.className = "gallery-item frame-box flex flex-col justify-between";
      card.setAttribute('data-category', item.category);
      card.setAttribute('id', item.id);
      
      const tagsHTML = item.tags && item.tags.length > 0 ? `
        <div class="flex flex-wrap gap-1 mt-3">
          ${item.tags.map(tag => `<span class="bg-zinc-200/50 text-zinc-600 text-[9px] px-2 py-0.5 rounded border border-zinc-300/40 font-heading font-medium uppercase tracking-wider">${tag}</span>`).join('')}
        </div>
      ` : '';
      
      card.innerHTML = `
        <div>
          ${placeholderHTML}
          <span class="text-xs font-heading font-semibold ${categoryColorClass} uppercase tracking-widest">${categoryLabel}</span>
          <h4 class="font-heading font-bold text-navy text-base mt-1">
            ${item.link && item.link !== '#' ? `<a href="${item.link}" class="hover:text-teal transition-colors">${item.title}</a>` : item.title}
          </h4>
        </div>
        <div class="flex flex-col justify-between flex-grow">
          <p class="text-zinc-500 text-xs mt-2">${item.description}</p>
          ${tagsHTML}
        </div>
      `;
      
      galleryGrid.appendChild(card);
    });
    
    setupGalleryFiltering();
  }

  // Hook PORTFOLIO_DATA original push array method to auto-re-render
  if (typeof PORTFOLIO_DATA !== 'undefined') {
    const originalPush = PORTFOLIO_DATA.push;
    PORTFOLIO_DATA.push = function(...args) {
      const result = originalPush.apply(this, args);
      renderGallery();
      return result;
    };
  }

  // Initial render of gallery items
  renderGallery();

  // --- Interactive Bundle Price Calculator ---
  const pricingCheckboxes = document.querySelectorAll('.calc-checkbox');
  const studentDiscountToggle = document.getElementById('calc-student-toggle');
  
  const priceSubtotalEl = document.getElementById('calc-subtotal');
  const priceDiscountPctEl = document.getElementById('calc-discount-pct');
  const priceSavingsEl = document.getElementById('calc-savings');
  const priceTotalEl = document.getElementById('calc-total');
  const calcApplyToFormBtn = document.getElementById('calc-apply-form');
  const selectedServicesInput = document.getElementById('contact-service');

  const BASE_PRICES = {
    'web': { standard: 499, student: 299 },
    'poster': { standard: 149, student: 149 },
    'video': { standard: 249, student: 249 },
    'resume': { standard: 99, student: 49 }
  };

  const calculateQuote = () => {
    const isStudent = studentDiscountToggle ? studentDiscountToggle.checked : false;
    let selectedServices = [];
    let subtotal = 0;

    // 1. Calculate standard or student subtotal based on checkboxes
    pricingCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const serviceKey = checkbox.getAttribute('data-service');
        const price = isStudent ? BASE_PRICES[serviceKey].student : BASE_PRICES[serviceKey].standard;
        subtotal += price;
        selectedServices.push(serviceKey);

        // Update individual price label in UI if exists
        const label = document.getElementById(`price-val-${serviceKey}`);
        if (label) {
          label.textContent = `$${price}`;
        }
      } else {
        // If unchecked, still show current rate on label
        const serviceKey = checkbox.getAttribute('data-service');
        const price = isStudent ? BASE_PRICES[serviceKey].student : BASE_PRICES[serviceKey].standard;
        const label = document.getElementById(`price-val-${serviceKey}`);
        if (label) {
          label.textContent = `$${price}`;
        }
      }
    });

    // 2. Compute dynamic discount percentage
    let discountPct = 0;
    let bundleName = "None";

    if (selectedServices.length === 4) {
      discountPct = 25; // Complete Studio Retainer Package
      bundleName = "Complete Studio Retainer (25% Off)";
    } else if (selectedServices.includes('web') && selectedServices.includes('resume')) {
      discountPct = 15; // Web + Resume Bundle
      bundleName = "Web + Resume Package (15% Off)";
    } else if (selectedServices.includes('web') && selectedServices.includes('video') && selectedServices.includes('poster')) {
      discountPct = 20; // Full Brand Launcher
      bundleName = "Brand Launch Package (20% Off)";
    } else if (selectedServices.length >= 2) {
      discountPct = 10; // Simple multi-service discount
      bundleName = "Multi-Service Bundle (10% Off)";
    }

    // 3. Compute final figures
    const savings = Math.round(subtotal * (discountPct / 100));
    const total = subtotal - savings;

    // 4. Render to UI with nice transitions
    if (priceSubtotalEl) priceSubtotalEl.textContent = `$${subtotal}`;
    if (priceDiscountPctEl) {
      priceDiscountPctEl.textContent = discountPct > 0 ? `${discountPct}% (${bundleName})` : '0%';
    }
    if (priceSavingsEl) priceSavingsEl.textContent = `$${savings}`;
    if (priceTotalEl) {
      // Add subtle flash class on price update
      priceTotalEl.textContent = `$${total}`;
      priceTotalEl.classList.add('text-emerald-400');
      setTimeout(() => {
        priceTotalEl.classList.remove('text-emerald-400');
      }, 500);
    }
  };

  // Attach event listeners to pricing triggers
  pricingCheckboxes.forEach(cb => cb.addEventListener('change', calculateQuote));
  if (studentDiscountToggle) {
    studentDiscountToggle.addEventListener('change', () => {
      // Sync student toggle with I am a... dropdown in contact form
      const contactRole = document.getElementById('contact-role');
      if (contactRole) {
        contactRole.value = studentDiscountToggle.checked ? 'student' : '';
      }
      calculateQuote();
    });
  }

  // Handle Sync from Contact Role dropdown back to Calculator Student Toggle
  const contactRoleDropdown = document.getElementById('contact-role');
  if (contactRoleDropdown) {
    contactRoleDropdown.addEventListener('change', () => {
      if (studentDiscountToggle) {
        studentDiscountToggle.checked = (contactRoleDropdown.value === 'student');
        calculateQuote();
      }
    });
  }

  // "Apply Quote to Form" Button action
  if (calcApplyToFormBtn && selectedServicesInput) {
    calcApplyToFormBtn.addEventListener('click', () => {
      let activeServicesNames = [];
      pricingCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
          const serviceName = checkbox.nextElementSibling.querySelector('span:first-child').textContent;
          activeServicesNames.push(serviceName);
        }
      });

      if (activeServicesNames.length > 0) {
        // Find matching option in form dropdown or set text field
        const serviceString = activeServicesNames.join(' + ');
        
        // We'll pre-fill the form text details area and scroll down
        const contactDetails = document.getElementById('contact-details');
        if (contactDetails) {
          const studentNote = (studentDiscountToggle && studentDiscountToggle.checked) ? " [Student Package Rates Applied]" : "";
          contactDetails.value = `I am interested in booking: ${serviceString}.${studentNote}\n\nEstimated Quote: ${priceTotalEl.textContent}\n\nProject details: `;
        }
        
        // Also select the most prominent service in dropdown
        if (activeServicesNames.length === 1) {
          const firstKey = document.querySelector('.calc-checkbox:checked').getAttribute('data-service');
          if (firstKey === 'web') selectedServicesInput.value = 'web';
          else if (firstKey === 'poster') selectedServicesInput.value = 'brand';
          else if (firstKey === 'video') selectedServicesInput.value = 'video';
          else if (firstKey === 'resume') selectedServicesInput.value = 'resume';
        } else {
          selectedServicesInput.value = 'bundle';
        }

        // Highlight contact form section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          // Flash the contact card to show focus
          const formCard = document.getElementById('contact-form-card');
          if (formCard) {
            formCard.classList.add('border-violet-500', 'shadow-[0_0_15px_rgba(139,92,246,0.3)]');
            setTimeout(() => {
              formCard.classList.remove('border-violet-500', 'shadow-[0_0_15px_rgba(139,92,246,0.3)]');
            }, 1500);
          }
        }
      }
    });
  }

  // Initial Calculation
  calculateQuote();

 // --- Contact Form Submission Handling ---
  const contactForm = document.getElementById('contact-form');
  const successModal = document.getElementById('success-modal');
  const successModalClose = document.getElementById('success-modal-close');
  const successModalText = document.getElementById('success-modal-text');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Submit animation state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending Inquiry...
      `;

      // Form details gathering
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const role = document.getElementById('contact-role').value;
      const service = selectedServicesInput.value;
      const details = document.getElementById('contact-details').value; // Added this to capture the textarea

      // Prepare data for EmailJS
      const templateParams = {
        from_name: name,
        user_email: email,
        role: role,
        service: service,
        message: details
      };

      // Call EmailJS to send the email
      emailjs.send('service_fx3wcug', 'template_jd3f54p', templateParams)
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);

          // Dynamic, personalized modal confirmation messaging
          let customMessage = `Thank you, <strong>${name}</strong>! We have received your request for `;
          
          const serviceLabels = {
            'web': 'a Custom Portfolio Website',
            'brand': 'Poster & Custom Brand Templates',
            'video': 'Reel & Social Video Editing',
            'resume': 'Professional Resume Polishing',
            'bundle': 'a Custom Project Bundle Pack',
            'other': 'Creative Agency Consulting'
          };

          customMessage += `<strong>${serviceLabels[service] || 'our services'}</strong>.`;

          if (role === 'student') {
            customMessage += `<br><br>🎓 <strong>Student Package benefits activated!</strong> Our team will verify your student ID and match you with our special budget pricing.`;
          } else if (role === 'business') {
            customMessage += `<br><br>🚀 <strong>Business Strategy fast-track:</strong> Our media lead will analyze your brand profile before our call to present initial asset recommendations.`;
          } else {
            customMessage += `<br><br>💼 <strong>Professional consultation:</strong> A personal branding specialist will review your materials to optimize your digital resume and portfolio layout.`;
          }

          customMessage += `<br><br>We have sent a confirmation email to <strong>${email}</strong> and will follow up within 24 hours to schedule our onboarding session!`;

          if (successModalText) {
            successModalText.innerHTML = customMessage;
          }

          // Reset button and form
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          contactForm.reset();
          
          // Reset calculator checklist
          pricingCheckboxes.forEach(cb => {
            if (cb.getAttribute('data-service') === 'web') {
              cb.checked = true; // reset to default standard state
            } else {
              cb.checked = false;
            }
          });
          if (studentDiscountToggle) studentDiscountToggle.checked = false;
          calculateQuote();

          // Open modal
          if (successModal) {
            successModal.classList.remove('hidden');
            successModal.classList.add('flex');
            document.body.classList.add('overflow-hidden');
          }
        }, (error) => {
          // Error handling
          console.log('FAILED...', error);
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          alert("Oops! Something went wrong while sending the email. Please try again later.");
        });
    });
  }

  // Close Modal Action
  if (successModalClose) {
    successModalClose.addEventListener('click', () => {
      if (successModal) {
        successModal.classList.add('hidden');
        successModal.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
      }
    });
  }

  // Smooth scroll helper for explore down buttons
  const exploreBtn = document.getElementById('explore-hero-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
});
