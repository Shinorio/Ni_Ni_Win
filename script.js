(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     Data — sourced only from the CV content already in the HTML
     ============================================================ */
  const EXPERTISE = [
    ['Full-Set Accounting', 'End-to-end bookkeeping and account maintenance across the full accounting cycle.'],
    ['Bookkeeping', 'Accurate day-to-day recording of financial transactions.'],
    ['Financial Reporting', 'Preparation of monthly financial statements and management reports.'],
    ['Accounts Payable', 'Supplier payables, purchase processing, and payment control.'],
    ['Accounts Receivable', 'Customer invoicing, payment monitoring, and follow-up on balances.'],
    ['Bank Reconciliation', 'Matching bank statements against ledger records to resolve discrepancies.'],
    ['Cash Control', 'Daily cash register reconciliation and cash flow reporting.'],
    ['Budget Planning', 'Supporting budget preparation and expense tracking.'],
    ['Expense Control', 'Monitoring and controlling operating expenses.'],
    ['Financial Forecasting', 'Contributing to forecasting for operational planning.'],
    ['Inventory Control', 'Stock audits, stock movement tracking, and inventory accuracy.'],
    ['Stock Management', 'Maintaining stock ledgers and coordinating with suppliers.'],
    ['Payroll', 'Salary computation, attendance tracking, deductions, and payroll summaries.'],
    ['Fixed Asset Management', 'Fixed asset register, acquisition, depreciation, and disposal records.'],
    ['General Ledger', 'Maintaining accurate and up-to-date general ledger records.'],
    ['Inter-Company Reconciliation', 'Reconciling inter-company transactions and balances.'],
    ['Foreign Currency Accounting', 'Handling multi-currency transactions and accounting entries.'],
    ['Financial &amp; Profitability Analysis', 'Analyzing financial performance and profitability.'],
    ['Internal Controls', 'Maintaining and following internal control procedures.'],
    ['Audit Support', 'Supporting statutory audit processes with schedules and documentation.'],
    ['VAT / Tax Processes', 'Working knowledge of VAT and tax-related processes.'],
    ['GST Processes', 'Preparing and submitting GST returns, including F5, F7, and F8.'],
  ];

  const SOFTWARE = [
    ['SAP Business One ERP', 'Full-set accounting on an enterprise ERP platform.'],
    ['ABSS Premier (MYOB)', 'Accounting and bookkeeping software.'],
    ['QuickBooks', 'Full-set accounts and financial reporting.'],
    ['Xero', 'Cloud-based accounting software.'],
    ['Auto-Count', 'Accounting and inventory software.'],
    ['MBC', 'Accounting software platform.'],
    ['SQL', 'Working knowledge for data and reporting tasks.'],
    ['Tally', 'Accounting and bookkeeping software.'],
    ['Microsoft Excel', 'Financial data, reporting, and analysis.'],
    ['Microsoft Word', 'Professional document and report preparation.'],
    ['Microsoft Outlook', 'Business correspondence and scheduling.'],
  ];

  /* ============================================================
     Populate dynamic grids
     ============================================================ */
  function buildIconSvg(){
    return '<span class="ic ic-percent" aria-hidden="true"></span>';
  }

  function populateExpertise(){
    const grid = document.getElementById('expertiseGrid');
    if(!grid) return;
    const frag = document.createDocumentFragment();
    EXPERTISE.forEach(([title, desc]) => {
      const card = document.createElement('div');
      card.className = 'expertise-card reveal';
      card.innerHTML = `
        <div class="expertise-icon">${buildIconSvg()}</div>
        <h3>${title}</h3>
        <p>${desc}</p>
      `;
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }

  function populateSoftware(){
    const grid = document.getElementById('softwareGrid');
    if(!grid) return;
    const frag = document.createDocumentFragment();
    SOFTWARE.forEach(([name, desc]) => {
      const initials = name.replace(/\(.*?\)/g, '').trim().split(/\s+/).map(w => w[0]).slice(0,2).join('');
      const card = document.createElement('div');
      card.className = 'software-card reveal';
      card.innerHTML = `
        <div class="software-mark">${initials}</div>
        <h3>${name}</h3>
        <p>${desc}</p>
      `;
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }

  /* ============================================================
     Loader + progress bar
     ============================================================ */
  function initLoader(){
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
      setTimeout(() => loader && loader.classList.add('hide'), 350);
    });
    // Fallback in case load event already fired
    setTimeout(() => loader && loader.classList.add('hide'), 2500);
  }

  function initScrollProgress(){
    const bar = document.getElementById('progressBar');
    if(!bar) return;
    const update = () => {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + '%';
    };
    document.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ============================================================
     Navbar transition + active link
     ============================================================ */
  function initNavbar(){
    const navbar = document.getElementById('navbar');
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const navLinks = Array.from(document.querySelectorAll('[data-nav]'));

    const onScroll = () => {
      if(window.scrollY > 40){ navbar.classList.add('solid'); }
      else{ navbar.classList.remove('solid'); }
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if('IntersectionObserver' in window){
      const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            const id = entry.target.id;
            navLinks.forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      sections.forEach(sec => spy.observe(sec));
    }
  }

  /* ============================================================
     Mobile menu
     ============================================================ */
  function initMobileMenu(){
    const btn = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    if(!btn || !menu) return;

    const close = () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    };
    const toggle = () => {
      const isOpen = menu.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    };
    btn.addEventListener('click', toggle);
    menu.querySelectorAll('[data-nav-mobile]').forEach(a => a.addEventListener('click', close));
  }

  /* ============================================================
     Reveal-on-scroll
     ============================================================ */
  function initReveal(){
    const items = document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window) || prefersReducedMotion){
      items.forEach(el => el.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    items.forEach(el => io.observe(el));
  }

  /* ============================================================
     Expandable experience cards
     ============================================================ */
  function initExperienceToggles(){
    document.querySelectorAll('.exp-toggle').forEach((btn, idx) => {
      const body = btn.parentElement.querySelector('.exp-body');
      if(!body) return;
      // First item open by default
      if(idx === 0){
        btn.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        body.style.maxHeight = expanded ? '0px' : body.scrollHeight + 'px';
      });
    });
    // Recalculate on resize
    window.addEventListener('resize', () => {
      document.querySelectorAll('.exp-toggle[aria-expanded="true"]').forEach(btn => {
        const body = btn.parentElement.querySelector('.exp-body');
        if(body) body.style.maxHeight = body.scrollHeight + 'px';
      });
    });
  }

  /* ============================================================
     Training accordion
     ============================================================ */
  function initAccordion(){
    document.querySelectorAll('.accordion-head').forEach(btn => {
      const panel = btn.parentElement.querySelector('.accordion-panel');
      if(!panel) return;
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        // Close others
        document.querySelectorAll('.accordion-head').forEach(other => {
          if(other !== btn){
            other.setAttribute('aria-expanded', 'false');
            const otherPanel = other.parentElement.querySelector('.accordion-panel');
            if(otherPanel) otherPanel.style.maxHeight = '0px';
          }
        });
        btn.setAttribute('aria-expanded', String(!expanded));
        panel.style.maxHeight = expanded ? '0px' : panel.scrollHeight + 'px';
      });
    });
  }

  /* ============================================================
     Back to top
     ============================================================ */
  function initBackToTop(){
    const btn = document.getElementById('backToTop');
    if(!btn) return;
    document.addEventListener('scroll', () => {
      btn.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ============================================================
     Contact form validation (frontend only, no backend)
     ============================================================ */
  function initContactForm(){
    const form = document.getElementById('contactForm');
    if(!form) return;
    const status = document.getElementById('formStatus');

    const validators = {
      fullName: v => v.trim().length >= 2 || 'Please enter your full name.',
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
      subject: v => v.trim().length >= 3 || 'Please enter a subject.',
      message: v => v.trim().length >= 10 || 'Please enter a message of at least 10 characters.',
    };

    function validateField(name){
      const field = form.elements[name];
      const errEl = document.getElementById('err-' + name);
      const result = validators[name](field.value);
      const row = field.closest('.form-row');
      if(result === true){
        row.classList.remove('invalid');
        if(errEl) errEl.textContent = '';
        return true;
      } else {
        row.classList.add('invalid');
        if(errEl) errEl.textContent = result;
        return false;
      }
    }

    Object.keys(validators).forEach(name => {
      const field = form.elements[name];
      if(field) field.addEventListener('blur', () => validateField(name));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const allValid = Object.keys(validators).map(validateField).every(Boolean);
      if(!allValid){
        status.textContent = 'Please correct the highlighted fields.';
        status.className = 'form-status error';
        return;
      }
      status.textContent = 'Message sent. Thank you — I will get back to you shortly.';
      status.className = 'form-status success';
      form.reset();
    });
  }

  /* ============================================================
     Init
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    populateExpertise();
    populateSoftware();
    initLoader();
    initScrollProgress();
    initNavbar();
    initMobileMenu();
    initScrollCue();
    initReveal();
    initExperienceToggles();
    initAccordion();
    initBackToTop();
    initContactForm();
  });
})();
