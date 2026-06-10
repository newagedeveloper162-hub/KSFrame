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
      link.classList.remove('text-violet-400', 'font-medium');
      link.classList.add('text-zinc-400');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.remove('text-zinc-400');
        link.classList.add('text-violet-400', 'font-medium');
      }
    });
  });

  // --- Target Segment Tab Switcher ---
  const segmentTabs = document.querySelectorAll('.segment-tab');
  const segmentContents = document.querySelectorAll('.segment-content');

  segmentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetSegment = tab.getAttribute('data-segment');

      // Update tab active classes
      segmentTabs.forEach(t => {
        t.classList.remove('bg-violet-600', 'text-white', 'border-violet-500');
        t.classList.add('bg-zinc-900', 'text-zinc-400', 'border-zinc-800', 'hover:border-zinc-700');
      });
      tab.classList.remove('bg-zinc-900', 'text-zinc-400', 'border-zinc-800', 'hover:border-zinc-700');
      tab.classList.add('bg-violet-600', 'text-white', 'border-violet-500');

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

  // --- Filterable Portfolio Gallery ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      // Update button active states
      filterBtns.forEach(b => {
        b.classList.remove('bg-violet-600', 'text-white', 'border-violet-500');
        b.classList.add('bg-zinc-900', 'text-zinc-400', 'border-zinc-800', 'hover:bg-zinc-800');
      });
      btn.classList.remove('bg-zinc-900', 'text-zinc-400', 'border-zinc-800', 'hover:bg-zinc-800');
      btn.classList.add('bg-violet-600', 'text-white', 'border-violet-500');

      // Filter gallery cards
      galleryItems.forEach(item => {
        const itemCategories = item.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || itemCategories.includes(filterValue)) {
          item.classList.remove('hidden-item');
          // Quick timeout to let display restore before opacity transitions in
          setTimeout(() => {
            item.style.position = 'relative';
            item.style.zindex = '1';
          }, 50);
        } else {
          item.classList.add('hidden-item');
          setTimeout(() => {
            item.style.position = 'absolute';
          }, 400); // match transition duration
        }
      });
    });
  });

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

      // Simulate network request delay (800ms)
      setTimeout(() => {
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
      }, 1000);
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
