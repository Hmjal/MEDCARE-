// MedCare Online Pharmacy - Main Application Script
// Production-Ready | All features included

'use strict';

// ============================================================
// HERO SLIDER CLASS
// ============================================================
class HeroSlider {
  constructor() {
    this.slides = document.querySelectorAll('.hero-slide');
    this.dots = document.querySelectorAll('.hero-dot');
    this.prevBtn = document.getElementById('heroPrev');
    this.nextBtn = document.getElementById('heroNext');
    this.currentSlide = 0;
    this.totalSlides = this.slides.length;
    this.autoplayInterval = null;
    this.autoplayDelay = 5000;
    this.isAnimating = false;

    if (this.totalSlides > 0) this.init();
  }

  init() {
    this.goToSlide(0);

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.prevSlide();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.nextSlide();
      });
    }

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });

    this.initSwipe();
    this.startAutoplay();

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', () => this.pauseAutoplay());
      heroSection.addEventListener('mouseleave', () => this.startAutoplay());
    }
  }

  goToSlide(index) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    this.slides.forEach(s => s.classList.remove('active'));
    this.dots.forEach(d => d.classList.remove('active'));

    this.currentSlide = (index + this.totalSlides) % this.totalSlides;

    this.slides[this.currentSlide].classList.add('active');
    if (this.dots[this.currentSlide]) {
      this.dots[this.currentSlide].classList.add('active');
    }

    setTimeout(() => { this.isAnimating = false; }, 500);
  }

  nextSlide() { this.goToSlide(this.currentSlide + 1); }
  prevSlide() { this.goToSlide(this.currentSlide - 1); }

  startAutoplay() {
    this.pauseAutoplay();
    this.autoplayInterval = setInterval(() => this.nextSlide(), this.autoplayDelay);
  }

  pauseAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  initSwipe() {
    let startX = 0, startY = 0;
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    hero.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    hero.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        dx > 0 ? this.prevSlide() : this.nextSlide();
      }
    }, { passive: true });
  }
}

// ============================================================
// APP STATE
// ============================================================
const appState = {
  cart: JSON.parse(localStorage.getItem('medcare_cart')) || JSON.parse(localStorage.getItem('medCareCart')) || [],
  wishlist: JSON.parse(localStorage.getItem('medcare_wishlist')) || JSON.parse(localStorage.getItem('medCareWishlist')) || [],
  user: JSON.parse(localStorage.getItem('medcare_user')) || JSON.parse(localStorage.getItem('medCareUser')) || null,
  currentTestimonialSlide: 0,
  testimonialInterval: null,
};

// ============================================================
// UTILITY: RENDER STARS
// ============================================================
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= full) {
      html += '<i class="fa-solid fa-star" style="color:#f59e0b;"></i>';
    } else if (i === full + 1 && half) {
      html += '<i class="fa-solid fa-star-half-stroke" style="color:#f59e0b;"></i>';
    } else {
      html += '<i class="fa-regular fa-star" style="color:#d1d5db;"></i>';
    }
  }
  return html;
}

// ============================================================
// UTILITY: FORMAT NUMBER
// ============================================================
function formatNumber(n) {
  if (n >= 1000000) {
    const val = n / 1000000;
    return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + 'M';
  }
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
window.medCareShowToast = function (message, type = 'info', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    danger: 'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info'
  };
  const colors = {
    success: '#22c55e',
    error: '#ef4444',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };

  const iconKey = icons[type] || icons.info;
  const colorKey = colors[type] || colors.info;

  const toast = document.createElement('div');
  toast.className = `medcare-toast toast-${type}`;
  toast.style.cssText = `
    display:flex; align-items:center; gap:10px; padding:12px 16px;
    background:#fff; border-radius:10px; box-shadow:0 4px 20px rgba(0,0,0,0.12);
    margin-bottom:10px; border-left:4px solid ${colorKey};
    animation:slideInToast 0.3s ease;
    font-size:0.9rem; max-width:360px; min-width:240px;
  `;
  toast.innerHTML = `
    <i class="fa-solid ${iconKey}" style="color:${colorKey};font-size:1.2rem;flex-shrink:0;"></i>
    <span style="flex:1;color:#1e293b;">${message}</span>
    <button onclick="this.parentElement.style.opacity='0';setTimeout(()=>this.parentElement.remove(),300);"
      style="background:none;border:none;cursor:pointer;color:#94a3b8;font-size:1.2rem;line-height:1;padding:0;">×</button>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 320);
  }, duration);
};

function showToast(message, type = 'info', duration = 3500) {
  window.medCareShowToast(message, type, duration);
}

// ============================================================
// RENDER CATEGORIES
// ============================================================
function renderCategories() {
  const grid = document.getElementById('categoryGrid');
  if (!grid || !window.PHARMACY_DATA) return;

  // Render categories with 3D tilt
  grid.innerHTML = PHARMACY_DATA.categories.map(cat => `
    <a href="shop.html?category=${encodeURIComponent(cat.name)}" class="category-card" data-category="${cat.name}" data-tilt data-tilt-max="14" data-tilt-glare data-tilt-max-glare="0.15" data-aos="fade-up">
      <div class="category-icon-wrap" style="background:${cat.bgLight};color:${cat.color};">
        <i class="${cat.icon}"></i>
      </div>
      <div class="category-name">${cat.name}</div>
      <div class="category-count">${cat.count}</div>
    </a>
  `).join('');
}

// ============================================================
// RENDER FEATURED PRODUCTS + TABS
// ============================================================
function getFilteredProducts(tab) {
  if (!window.PHARMACY_DATA) return [];
  const all = PHARMACY_DATA.allProducts;
  switch (tab) {
    case 'bestsellers': return all.filter(p => p.isBestSeller !== false && p.reviewsCount > 1000).slice(0, 8);
    case 'new': return all.filter(p => p.isNew || (new Date(p.dateAdded) > new Date('2026-10-01'))).slice(0, 8);
    case 'toprated': return all.filter(p => p.rating >= 4.8).slice(0, 8);
    case 'sale': return all.filter(p => p.discount > 0).slice(0, 8);
    default: return all.slice(0, 8);
  }
}

function renderFeaturedProducts(tab = 'all') {
  const grid = document.getElementById('featuredProductGrid');
  if (!grid || !window.PHARMACY_DATA) return;

  let products = getFilteredProducts(tab);
  // Fallback: if filter returns 0, show first 8
  if (products.length === 0) products = PHARMACY_DATA.allProducts.slice(0, 8);

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fa-solid fa-prescription-bottle text-muted" style="font-size:3rem;margin-bottom:1rem;"></i>
        <h4 style="color:#64748b;">No products found in this category</h4>
        <button class="btn btn-primary mt-2" onclick="window.medCareResetFilter()">View All Products</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(prod => {
    const isWishlisted = appState.wishlist.includes(prod.id);
    return `
      <div class="product-card" data-product-id="${prod.id}" data-tilt data-tilt-max="6" data-tilt-glare data-tilt-max-glare="0.08" data-aos="fade-up">
        <div class="product-img-wrap">
          <img src="${prod.image}" alt="${prod.name}" loading="lazy" decoding="async"
            onerror="this.src='https://placehold.co/300x300/e8f0fe/0D6EFD?text=Medicine'">
          ${prod.discount > 0 ? `<span class="discount-badge">-${prod.discount}%</span>` : ''}
          ${prod.requiresPrescription ? `<span class="rx-badge">Rx</span>` : ''}
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${prod.id}" aria-label="Add to wishlist">
            <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <button class="quick-view-btn" data-id="${prod.id}">
            <i class="fa-solid fa-eye"></i> Quick View
          </button>
        </div>
        <div class="product-body">
          <div class="product-brand">${prod.brand}</div>
          <div class="product-name">${prod.name}</div>
          <div class="product-pack">${prod.packSize}</div>
          <div class="product-rating">
            <span class="stars">${renderStars(prod.rating)}</span>
            <span class="rating-count">(${prod.reviewsCount})</span>
          </div>
          <div class="product-price-row">
            <span class="price-selling">₹${prod.price}</span>
            ${prod.mrp ? `<span class="price-mrp">₹${prod.mrp}</span>` : ''}
          </div>
          <button class="btn-add-cart" data-id="${prod.id}">
            <i class="fa-solid fa-cart-shopping"></i> Add to Cart
          </button>
        </div>
      </div>
    `;
  }).join('');

  attachProductListeners();
  initScrollAnimations();
  initCardTilt();
  if (typeof AOS !== 'undefined') AOS.refresh();
}

function attachProductListeners() {
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(btn.dataset.id, 1);
    });
  });

  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openQuickView(btn.dataset.id);
    });
  });

  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(btn.dataset.id, btn);
    });
  });

  // Deals grab buttons
  document.querySelectorAll('.btn-grab-deal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const deal = PHARMACY_DATA.deals.find(d => d.id === btn.dataset.id);
      if (deal) {
        addCustomItemToCart({
          id: deal.id,
          name: deal.name,
          brand: deal.brand,
          price: deal.dealPrice,
          mrp: deal.originalPrice,
          image: deal.image,
          quantity: 1
        });
      }
    });
  });
}

window.medCareResetFilter = function () {
  renderFeaturedProducts('all');
  document.querySelectorAll('.product-tab-btn').forEach(b => b.classList.remove('active'));
  const allBtn = document.querySelector('.product-tab-btn[data-tab="all"]');
  if (allBtn) allBtn.classList.add('active');
};

window.medCareAddToCart = function (productId) {
  addToCart(productId, 1);
};

// ============================================================
// PRODUCT TABS
// ============================================================
function initProductTabs() {
  document.querySelectorAll('.product-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.product-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab || 'all';
      renderFeaturedProducts(tab);
    });
  });
}

// ============================================================
// RENDER DEALS
// ============================================================
function renderDeals() {
  const grid = document.getElementById('dealsGrid');
  if (!grid || !window.PHARMACY_DATA) return;

  grid.innerHTML = PHARMACY_DATA.deals.map(deal => `
    <div class="deal-card" data-product-id="${deal.id}" data-tilt data-tilt-max="12" data-tilt-glare data-tilt-max-glare="0.15" data-aos="fade-up">
      <div class="deal-img-wrap">
        <img src="${deal.image}" alt="${deal.name}"
          onerror="this.src='https://placehold.co/300x200/0d1b2a/white?text=Deal'">
        <span class="deal-discount-badge">${deal.discountPct}% OFF</span>
      </div>
      <div class="deal-body">
        <div class="deal-brand">${deal.brand}</div>
        <div class="deal-name">${deal.name}</div>
        <div class="deal-prices">
          <span class="deal-price">₹${deal.dealPrice}</span>
          <span class="deal-original">₹${deal.originalPrice}</span>
        </div>
        <div class="deal-stock-bar-wrap">
          <div class="deal-stock-text">${deal.soldPct}% sold</div>
          <div class="deal-stock-bar">
            <div class="deal-stock-fill" style="width:${deal.soldPct}%"></div>
          </div>
        </div>
        <button class="btn-grab-deal" data-id="${deal.id}">Grab Deal <i class="fa-solid fa-bolt"></i></button>
      </div>
    </div>
  `).join('');

  // Attach deal listeners
  grid.querySelectorAll('.btn-grab-deal').forEach(btn => {
    btn.addEventListener('click', () => {
      const deal = PHARMACY_DATA.deals.find(d => d.id === btn.dataset.id);
      if (deal) {
        addCustomItemToCart({
          id: deal.id,
          name: deal.name,
          brand: deal.brand,
          price: deal.dealPrice,
          mrp: deal.originalPrice,
          image: deal.image,
          quantity: 1
        });
      }
    });
  });
}

// ============================================================
// RENDER BLOGS
// ============================================================
function renderBlogs() {
  const grid = document.getElementById('blogsGrid');
  if (!grid || !window.PHARMACY_DATA) return;

  grid.innerHTML = PHARMACY_DATA.blogs.map(blog => `
    <div class="blog-card" data-tilt data-tilt-max="10" data-tilt-glare data-tilt-max-glare="0.12" data-aos="fade-up">
      <div class="blog-img">
        <img src="${blog.thumbnail}" alt="${blog.title}" loading="lazy"
          onerror="this.src='https://placehold.co/600x400/e8f0fe/0D6EFD?text=Health+Blog'">
      </div>
      <div class="blog-body">
        <span class="blog-tag">${blog.category}</span>
        <h3 class="blog-title">${blog.title}</h3>
        <p class="blog-excerpt">${blog.excerpt}</p>
        <div class="blog-meta">
          <div>
            <div class="blog-author-name">${blog.author}</div>
            <div class="blog-date">${blog.date} · ${blog.readTime}</div>
          </div>
        </div>
        <a href="#" class="btn-read-more">Read More <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.btn-read-more').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Blog articles coming soon! Stay tuned.', 'info');
    });
  });
}

// ============================================================
// RENDER TESTIMONIALS + CAROUSEL
// ============================================================
function renderTestimonials() {
  const wrapper = document.getElementById('testimonialsWrapper');
  const dotsContainer = document.getElementById('testimonialDots');
  if (!wrapper || !window.PHARMACY_DATA) return;

  wrapper.innerHTML = PHARMACY_DATA.testimonials.map((t, i) => `
    <div class="testimonial-card ${i === 0 ? 'active' : ''}" data-index="${i}" data-tilt data-tilt-max="8" data-tilt-glare data-tilt-max-glare="0.1" data-aos="fade-up">
      <div class="testimonial-header">
        <img src="${t.photo}" alt="${t.name}" class="testimonial-avatar"
          onerror="this.src='https://placehold.co/80x80/0D6EFD/white?text=${encodeURIComponent(t.name[0])}'">
        <div class="testimonial-author">
          <h4>${t.name} <span class="verified-badge"><i class="fa-solid fa-circle-check"></i> Verified</span></h4>
          <p>${t.role} · ${t.location}</p>
        </div>
        <div class="testimonial-stars">${renderStars(t.rating)}</div>
      </div>
      <p class="testimonial-quote">"${t.text}"</p>
      <span class="testimonial-date"><i class="fa-regular fa-clock"></i> ${t.date}</span>
    </div>
  `).join('');

  if (dotsContainer) {
    dotsContainer.innerHTML = PHARMACY_DATA.testimonials.map((_, i) => `
      <button class="t-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Testimonial ${i + 1}"></button>
    `).join('');

    dotsContainer.querySelectorAll('.t-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        showTestimonial(parseInt(dot.dataset.index, 10));
        resetTestimonialAutoplay();
      });
    });
  }

  startTestimonialAutoplay();

  const section = wrapper.closest('section') || wrapper.parentElement;
  if (section) {
    section.addEventListener('mouseenter', () => pauseTestimonialAutoplay());
    section.addEventListener('mouseleave', () => startTestimonialAutoplay());
  }
}

function showTestimonial(index) {
  if (!window.PHARMACY_DATA) return;
  appState.currentTestimonialSlide = (index + PHARMACY_DATA.testimonials.length) % PHARMACY_DATA.testimonials.length;
  const wrapper = document.getElementById('testimonialsWrapper');
  const dotsContainer = document.getElementById('testimonialDots');

  if (wrapper) {
    wrapper.querySelectorAll('.testimonial-card').forEach((card, i) => {
      card.classList.toggle('active', i === appState.currentTestimonialSlide);
    });
  }
  if (dotsContainer) {
    dotsContainer.querySelectorAll('.t-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === appState.currentTestimonialSlide);
    });
  }
}

function startTestimonialAutoplay() {
  pauseTestimonialAutoplay();
  appState.testimonialInterval = setInterval(() => {
    showTestimonial(appState.currentTestimonialSlide + 1);
  }, 4000);
}

function pauseTestimonialAutoplay() {
  if (appState.testimonialInterval) {
    clearInterval(appState.testimonialInterval);
    appState.testimonialInterval = null;
  }
}

function resetTestimonialAutoplay() {
  pauseTestimonialAutoplay();
  startTestimonialAutoplay();
}

// ============================================================
// COUNTDOWN TIMER
// ============================================================
function startCountdownTimer() {
  const timerDays = document.getElementById('timerDays');
  const timerHours = document.getElementById('timerHours');
  const timerMinutes = document.getElementById('timerMinutes');
  const timerSeconds = document.getElementById('timerSeconds');

  if (!timerHours && !timerDays) return;

  const endTime = new Date();
  endTime.setHours(23, 59, 59, 0);

  function update() {
    const now = new Date();
    const diff = endTime - now;
    if (diff <= 0) {
      endTime.setDate(endTime.getDate() + 1);
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    if (timerDays) timerDays.textContent = '00';
    if (timerHours) timerHours.textContent = String(h).padStart(2, '0');
    if (timerMinutes) timerMinutes.textContent = String(m).padStart(2, '0');
    if (timerSeconds) timerSeconds.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// ============================================================
// ANIMATED COUNTERS
// ============================================================
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = parseInt(entry.target.dataset.target, 10);
        const suffix = entry.target.dataset.suffix || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          entry.target.textContent = formatNumber(Math.floor(current)) + suffix;
        }, 16);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}

// ============================================================
// SCROLL ANIMATIONS
// ============================================================
function initScrollAnimations() {
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
    return;
  }

  const elementsToAnimate = document.querySelectorAll(
    '.feature-card, .category-card, .product-card, .blog-card, .step-card, .deal-card, .testimonial-card, .section-header, .trust-stats-grid .stat-item'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        if (!entry.target.hasAttribute('data-tilt')) {
          entry.target.style.transform = 'translateY(0)';
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

  elementsToAnimate.forEach(el => {
    if (el.style.opacity === '1') return;
    el.style.opacity = '0';
    if (!el.hasAttribute('data-tilt')) {
      el.style.transform = 'translateY(20px)';
    }
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ============================================================
// 3D CARD TILT
// ============================================================
// ============================================================
// AOS (ANIMATE ON SCROLL) INIT
// ============================================================
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50
    });
  }
}

// ============================================================
// HERO TYPING ANIMATION
// ============================================================
function initHeroTyping() {
  const el = document.getElementById('heroTypingText');
  if (!el) return;
  const words = [
    'Order Medicines Online',
    'Flat 20% Discount on First Order',
    'Guaranteed 2-Hour Delivery',
    '100% Genuine Certified Drugs'
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 300;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

// ============================================================
// 3D CARD TILT (VANILLA TILT + FALLBACK)
// ============================================================
function initCardTilt() {
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 6,
      speed: 400,
      glare: true,
      'max-glare': 0.08,
      perspective: 1000
    });
  } else {
    document.querySelectorAll('.feature-card, .category-card, .product-card, .deal-card, .blog-card, .step-card').forEach(card => {
      let rafId = null;
      card.addEventListener('mousemove', (e) => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const rotateX = Math.max(-6, Math.min(6, (y - rect.height / 2) / 30));
          const rotateY = Math.max(-6, Math.min(6, (rect.width / 2 - x) / 30));
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(0, -4px, 0)`;
          rafId = null;
        });
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
}

// ============================================================
// NAVBAR SCROLL EFFECT
// ============================================================
function initNavbarScroll() {
  window.addEventListener('scroll', () => {
    const header = document.getElementById('mainHeader');
    if (!header) return;
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ============================================================
// MOBILE MENU
// ============================================================
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const closeMobileNav = document.getElementById('closeMobileNav');

  let overlay = null;

  function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';

    overlay = document.createElement('div');
    overlay.id = 'mobileNavOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9998;';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeMobileNavFn);
  }

  function closeMobileNavFn() {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    if (overlay) { overlay.remove(); overlay = null; }
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileNav);
  if (closeMobileNav) closeMobileNav.addEventListener('click', closeMobileNavFn);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileNavFn);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      closeMobileNavFn();
    }
  });
}

// ============================================================
// SEARCH AUTOCOMPLETE
// ============================================================
function initSearchAutocomplete() {
  const searchInput = document.getElementById('searchInput');
  const searchDropdown = document.getElementById('searchDropdown');
  const mobileSearchInput = document.getElementById('mobileSearchInput');

  function handleSearch(value, dropdown) {
    if (!dropdown || !window.PHARMACY_DATA) return;
    const query = value.trim().toLowerCase();

    if (query.length < 2) {
      dropdown.classList.remove('show');
      return;
    }

    const matchedProducts = PHARMACY_DATA.allProducts.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    ).slice(0, 6);

    const matchedCategories = PHARMACY_DATA.categories.filter(c =>
      c.name.toLowerCase().includes(query)
    ).slice(0, 3);

    if (matchedProducts.length === 0 && matchedCategories.length === 0) {
      dropdown.innerHTML = `
        <div style="padding:16px;text-align:center;color:#94a3b8;">
          <i class="fa-solid fa-magnifying-glass" style="font-size:1.5rem;margin-bottom:8px;display:block;"></i>
          No results for "<strong>${query}</strong>"
        </div>
      `;
      dropdown.classList.add('show');
      return;
    }

    let html = '';

    if (matchedCategories.length > 0) {
      html += `<div class="search-section-header" style="padding:8px 12px;font-size:0.75rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;">Categories</div>`;
      html += matchedCategories.map(cat => `
        <div class="search-cat-item" data-category="${cat.name}"
          style="display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;transition:background .15s;"
          onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background=''">
          <i class="${cat.icon}" style="color:#3b82f6;width:18px;text-align:center;"></i>
          <span style="flex:1;font-size:0.9rem;">${cat.name}</span>
          <small style="color:#94a3b8;">${cat.count}</small>
        </div>
      `).join('');
    }

    if (matchedProducts.length > 0) {
      html += `<div class="search-section-header" style="padding:8px 12px;font-size:0.75rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;">Medicines & Healthcare</div>`;
      html += matchedProducts.map(prod => `
        <div class="search-prod-item" data-id="${prod.id}"
          style="display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;transition:background .15s;"
          onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background=''">
          <img src="${prod.image}" alt="${prod.name}"
            style="width:40px;height:40px;object-fit:cover;border-radius:8px;"
            onerror="this.src='https://placehold.co/40x40/e8f0fe/0D6EFD?text=Med'">
          <div style="flex:1;overflow:hidden;">
            <div style="font-size:0.875rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${prod.name}</div>
            <small style="color:#94a3b8;">${prod.brand} · ${prod.category}</small>
          </div>
          <span style="font-weight:700;color:#0d6efd;font-size:0.875rem;">₹${prod.price}</span>
        </div>
      `).join('');
    }

    dropdown.innerHTML = html;
    dropdown.classList.add('show');

    dropdown.querySelectorAll('.search-prod-item').forEach(item => {
      item.addEventListener('click', () => {
        dropdown.classList.remove('show');
        openQuickView(item.dataset.id);
      });
    });

    dropdown.querySelectorAll('.search-cat-item').forEach(item => {
      item.addEventListener('click', () => {
        dropdown.classList.remove('show');
        window.location.href = `shop.html?category=${encodeURIComponent(item.dataset.category)}`;
      });
    });
  }

  if (searchInput && searchDropdown) {
    let searchDebounceTimer = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounceTimer);
      const val = e.target.value;
      searchDebounceTimer = setTimeout(() => handleSearch(val, searchDropdown), 150);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        searchDropdown.classList.remove('show');
        window.location.href = `search.html?q=${encodeURIComponent(searchInput.value.trim())}`;
      }
      if (e.key === 'Escape') searchDropdown.classList.remove('show');
    });

    const searchBtn = searchInput.closest('.search-input-wrapper')?.querySelector('.search-btn') ||
      searchInput.parentElement?.querySelector('.search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        if (searchInput.value.trim()) {
          window.location.href = `search.html?q=${encodeURIComponent(searchInput.value.trim())}`;
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.remove('show');
      }
    });
  }

  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (query.length >= 2 && window.PHARMACY_DATA) {
        const filtered = PHARMACY_DATA.allProducts.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
        );
        renderFeaturedProducts('all');
      }
    });

    mobileSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && mobileSearchInput.value.trim()) {
        window.location.href = `search.html?q=${encodeURIComponent(mobileSearchInput.value.trim())}`;
      }
    });
  }
}

// ============================================================
// CART SYSTEM
// ============================================================
function saveCart() {
  const json = JSON.stringify(appState.cart);
  localStorage.setItem('medcare_cart', json);
  localStorage.setItem('medCareCart', json);
  try { window.dispatchEvent(new Event('storage')); } catch (e) { }
}

function getCartTotal() {
  return appState.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartCount() {
  return appState.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function addToCart(productId, qty = 1) {
  if (!window.PHARMACY_DATA) return;
  const product = PHARMACY_DATA.allProducts.find(p => p.id === productId);
  if (!product) return;

  const existing = appState.cart.findIndex(item => item.id === productId);
  if (existing > -1) {
    appState.cart[existing].quantity += qty;
  } else {
    appState.cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      packSize: product.packSize || 'Standard Pack',
      price: product.price,
      mrp: product.mrp,
      image: product.image,
      quantity: qty,
      requiresPrescription: product.requiresPrescription
    });
  }

  saveCart();
  renderCart();
  showToast(`"${product.name.substring(0, 28)}..." added to cart!`, 'success');
  openCartDrawer();
}

function addCustomItemToCart(item) {
  const existing = appState.cart.findIndex(i => i.id === item.id);
  if (existing > -1) {
    appState.cart[existing].quantity += item.quantity || 1;
  } else {
    appState.cart.push({ ...item, quantity: item.quantity || 1 });
  }
  saveCart();
  renderCart();
  showToast(`Deal claimed: "${item.name.substring(0, 26)}..."`, 'success');
  openCartDrawer();
}

function removeFromCart(id) {
  appState.cart = appState.cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
  showToast('Item removed from cart.', 'info');
}

function updateQuantity(id, delta) {
  const idx = appState.cart.findIndex(item => item.id === id);
  if (idx > -1) {
    appState.cart[idx].quantity += delta;
    if (appState.cart[idx].quantity <= 0) {
      appState.cart.splice(idx, 1);
      showToast('Item removed from cart.', 'info');
    }
    saveCart();
    renderCart();
  }
}

function renderCart() {
  const totalCount = getCartCount();
  const subtotal = getCartTotal();

  // Update all cart count badges
  document.querySelectorAll('.cart-count-badge').forEach(badge => {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
  });

  // Free shipping bar
  const freeShippingBar = document.getElementById('freeShippingBar');
  const freeShippingText = document.getElementById('freeShippingText');
  const threshold = 500;
  if (freeShippingBar) {
    const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
    freeShippingBar.style.width = `${pct}%`;
  }
  if (freeShippingText) {
    if (subtotal >= threshold) {
      freeShippingText.innerHTML = `<span style="color:#22c55e;"><i class="fa-solid fa-circle-check"></i> You unlocked <strong>FREE Delivery</strong>!</span>`;
    } else {
      freeShippingText.innerHTML = `Add <strong>₹${threshold - subtotal}</strong> more for <strong>FREE Delivery</strong>`;
    }
  }

  // Sticky cart bar
  const stickyBar = document.getElementById('stickyCartBar');
  const stickyCount = document.getElementById('stickyCartCount');
  const stickyTotal = document.getElementById('stickyCartTotal');
  if (stickyBar) {
    stickyBar.style.display = totalCount > 0 ? 'flex' : 'none';
    if (stickyCount) stickyCount.textContent = totalCount;
    if (stickyTotal) stickyTotal.textContent = `₹${subtotal}`;
  }

  const cartItemsList = document.getElementById('cartItemsList');
  if (!cartItemsList) return;

  if (appState.cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="empty-cart-view" style="text-align:center;padding:40px 20px;">
        <i class="fa-solid fa-basket-shopping" style="font-size:3rem;color:#cbd5e1;margin-bottom:16px;display:block;"></i>
        <h4 style="color:#64748b;">Your cart is empty</h4>
        <p style="color:#94a3b8;font-size:0.9rem;">Explore our wide selection of genuine medicines and healthcare essentials.</p>
        <button class="btn btn-primary mt-3" id="emptyCartShopBtn">Start Shopping</button>
      </div>
    `;
    const shopBtn = document.getElementById('emptyCartShopBtn');
    if (shopBtn) {
      shopBtn.addEventListener('click', () => {
        closeCartDrawer();
        const fp = document.getElementById('featured-products') || document.querySelector('.featured-products-section');
        if (fp) fp.scrollIntoView({ behavior: 'smooth' });
      });
    }
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    if (subtotalEl) subtotalEl.textContent = '₹0';
    if (totalEl) totalEl.textContent = '₹0';
    return;
  }

  const hasRx = appState.cart.some(item => item.requiresPrescription);

  cartItemsList.innerHTML = appState.cart.map(item => `
    <div class="cart-item-row" data-id="${item.id}" style="display:flex;gap:12px;padding:14px 0;border-bottom:1px solid #f1f5f9;">
      <img src="${item.image}" alt="${item.name}" class="cart-item-thumb"
        style="width:60px;height:60px;object-fit:cover;border-radius:8px;flex-shrink:0;"
        onerror="this.src='https://placehold.co/60x60/e8f0fe/0D6EFD?text=Med'">
      <div style="flex:1;overflow:hidden;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
          <h5 style="font-size:0.85rem;font-weight:600;color:#1e293b;margin:0;line-height:1.3;">${item.name}</h5>
          <button class="btn-remove-item" data-id="${item.id}" title="Remove"
            style="background:none;border:none;color:#ef4444;cursor:pointer;padding:2px;flex-shrink:0;">
            <i class="fa-solid fa-trash-can" style="font-size:0.8rem;"></i>
          </button>
        </div>
        <span style="font-size:0.78rem;color:#94a3b8;display:block;margin:2px 0;">${item.brand || 'MedCare Brand'}</span>
        ${item.requiresPrescription ? `<span style="font-size:0.72rem;background:#fef3c7;color:#b45309;border-radius:4px;padding:2px 6px;"><i class="fa-solid fa-file-prescription"></i> Rx Required</span>` : ''}
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
          <div class="qty-stepper" style="display:flex;align-items:center;gap:8px;">
            <button class="btn-qty-minus" data-id="${item.id}"
              style="width:28px;height:28px;border-radius:6px;border:1px solid #e2e8f0;background:#f8fafc;cursor:pointer;font-weight:700;">−</button>
            <span class="qty-val" style="font-weight:700;min-width:20px;text-align:center;">${item.quantity}</span>
            <button class="btn-qty-plus" data-id="${item.id}"
              style="width:28px;height:28px;border-radius:6px;border:1px solid #e2e8f0;background:#f8fafc;cursor:pointer;font-weight:700;">+</button>
          </div>
          <div>
            <span style="font-weight:700;color:#0d6efd;">₹${item.price * item.quantity}</span>
            ${item.mrp ? `<span style="font-size:0.78rem;color:#94a3b8;text-decoration:line-through;margin-left:4px;">₹${item.mrp * item.quantity}</span>` : ''}
          </div>
        </div>
      </div>
    </div>
  `).join('');

  if (hasRx) {
    cartItemsList.innerHTML += `
      <div class="rx-alert-box" style="background:#fef9c3;border:1px solid #fde68a;border-radius:10px;padding:12px;margin-top:12px;display:flex;gap:10px;align-items:flex-start;">
        <i class="fa-solid fa-triangle-exclamation" style="color:#d97706;flex-shrink:0;margin-top:2px;"></i>
        <div>
          <strong style="color:#92400e;font-size:0.875rem;">Prescription Needed</strong>
          <p style="color:#92400e;font-size:0.8rem;margin:4px 0 8px;">One or more items require a valid doctor's prescription before dispatch.</p>
          <button class="btn btn-sm btn-outline-primary" id="cartUploadRxBtn" style="font-size:0.8rem;">Upload Prescription</button>
        </div>
      </div>
    `;
    const rxBtn = document.getElementById('cartUploadRxBtn');
    if (rxBtn) {
      rxBtn.addEventListener('click', () => {
        closeCartDrawer();
        openPrescriptionModal();
      });
    }
  }

  // Attach qty listeners
  cartItemsList.querySelectorAll('.btn-qty-minus').forEach(b => {
    b.addEventListener('click', () => updateQuantity(b.dataset.id, -1));
  });
  cartItemsList.querySelectorAll('.btn-qty-plus').forEach(b => {
    b.addEventListener('click', () => updateQuantity(b.dataset.id, 1));
  });
  cartItemsList.querySelectorAll('.btn-remove-item').forEach(b => {
    b.addEventListener('click', () => removeFromCart(b.dataset.id));
  });

  // Totals
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  if (totalEl) totalEl.textContent = `₹${subtotal}`;
}

function openCartDrawer() {
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  if (cartDrawer) cartDrawer.classList.add('open');
  if (cartOverlay) cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  if (cartDrawer) cartDrawer.classList.remove('open');
  if (cartOverlay) cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function initCartSystem() {
  const cartBtn = document.getElementById('cartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartOverlay = document.getElementById('cartOverlay');

  if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (appState.cart.length === 0) {
        showToast('Your cart is empty! Add items before checkout.', 'warning');
        return;
      }
      window.location.href = 'checkout.html';
    });
  }

  const headerCheckoutBtn = document.getElementById('headerCheckoutBtn');
  if (headerCheckoutBtn) {
    headerCheckoutBtn.addEventListener('click', (e) => {
      if (appState.cart.length === 0) {
        e.preventDefault();
        showToast('Your cart is currently empty!', 'warning');
        openCartDrawer();
      }
    });
  }

  // Sticky cart bar open
  const stickyBar = document.getElementById('stickyCartBar');
  if (stickyBar) {
    stickyBar.addEventListener('click', openCartDrawer);
  }

  renderCart();
}

// ============================================================
// STICKY CART BAR
// ============================================================
function initStickyCartBar() {
  const stickyBar = document.getElementById('stickyCartBar');
  if (stickyBar) {
    stickyBar.addEventListener('click', openCartDrawer);
  }
}

// ============================================================
// WISHLIST
// ============================================================
function toggleWishlist(productId, btnEl) {
  const idx = appState.wishlist.indexOf(productId);
  const prod = window.PHARMACY_DATA ? PHARMACY_DATA.allProducts.find(p => p.id === productId) : null;

  if (idx > -1) {
    appState.wishlist.splice(idx, 1);
    btnEl.classList.remove('active');
    btnEl.innerHTML = '<i class="fa-regular fa-heart"></i>';
    showToast('Removed from wishlist.', 'info');
  } else {
    appState.wishlist.push(productId);
    btnEl.classList.add('active');
    btnEl.innerHTML = '<i class="fa-solid fa-heart"></i>';
    showToast(`"${prod ? prod.name.substring(0, 22) + '...' : 'Item'}" saved to wishlist!`, 'success');
  }

  const wJson = JSON.stringify(appState.wishlist);
  localStorage.setItem('medcare_wishlist', wJson);
  localStorage.setItem('medCareWishlist', wJson);
}

// ============================================================
// QUICK VIEW MODAL
// ============================================================
function openQuickView(productId) {
  const modal = document.getElementById('quickViewModal');
  const content = document.getElementById('quickViewContent');
  if (!modal || !content || !window.PHARMACY_DATA) return;

  const prod = PHARMACY_DATA.allProducts.find(p => p.id === productId);
  if (!prod) return;

  content.innerHTML = `
    <div class="quick-view-grid" style="display:grid;grid-template-columns:1fr 1.4fr;gap:28px;">
      <div class="quick-view-media">
        <img src="${prod.image}" alt="${prod.name}" style="width:100%;border-radius:12px;object-fit:cover;aspect-ratio:1;"
          onerror="this.src='https://placehold.co/400x400/e8f0fe/0D6EFD?text=Medicine'">
        ${prod.requiresPrescription ? `<div class="rx-stamp" style="background:#fef3c7;color:#b45309;border-radius:8px;padding:8px 12px;margin-top:12px;font-size:0.85rem;"><i class="fa-solid fa-file-prescription"></i> Prescription Required</div>` : ''}
      </div>
      <div class="quick-view-info">
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
          <span style="background:#eff6ff;color:#2563eb;border-radius:6px;padding:3px 10px;font-size:0.8rem;font-weight:600;">${prod.category}</span>
          <span style="color:#64748b;font-size:0.85rem;">Brand: <strong>${prod.brand}</strong></span>
        </div>
        <h2 style="font-size:1.25rem;font-weight:700;color:#0f172a;margin-bottom:10px;">${prod.name}</h2>
        <div class="product-rating" style="display:flex;align-items:center;gap:6px;margin-bottom:14px;">
          ${renderStars(prod.rating)}
          <span style="font-weight:700;">${prod.rating}</span>
          <span style="color:#94a3b8;font-size:0.85rem;">(${prod.reviewsCount} reviews)</span>
        </div>
        <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:16px;">
          <span style="font-size:2rem;font-weight:800;color:#0f172a;">₹${prod.price}</span>
          ${prod.mrp ? `<span style="font-size:1.1rem;color:#94a3b8;text-decoration:line-through;">₹${prod.mrp}</span>` : ''}
          ${prod.discount > 0 ? `<span style="background:#dcfce7;color:#16a34a;border-radius:6px;padding:3px 10px;font-size:0.85rem;font-weight:700;">${prod.discount}% OFF</span>` : ''}
        </div>
        <div style="background:#f8fafc;border-radius:10px;padding:14px;margin-bottom:16px;">
          ${[
      ['Pack Size', prod.packSize],
      ['Composition', prod.composition],
      ['Dosage', prod.dosage],
      ['Manufacturer', prod.manufacturer],
    ].map(([label, val]) => `
            <div style="display:flex;gap:10px;margin-bottom:8px;font-size:0.85rem;">
              <span style="color:#64748b;min-width:100px;flex-shrink:0;">${label}:</span>
              <span style="color:#1e293b;font-weight:500;">${val || 'N/A'}</span>
            </div>
          `).join('')}
        </div>
        <p style="font-size:0.875rem;color:#475569;line-height:1.6;margin-bottom:18px;">${prod.description}</p>
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="qv-qty-selector" style="display:flex;align-items:center;gap:10px;background:#f1f5f9;border-radius:10px;padding:6px 12px;">
            <button id="qvMinus" style="width:28px;height:28px;border-radius:6px;border:1px solid #e2e8f0;background:#fff;cursor:pointer;font-size:1.2rem;font-weight:700;">−</button>
            <span id="qvQtyVal" style="font-weight:700;min-width:20px;text-align:center;">1</span>
            <button id="qvPlus" style="width:28px;height:28px;border-radius:6px;border:1px solid #e2e8f0;background:#fff;cursor:pointer;font-size:1.2rem;font-weight:700;">+</button>
          </div>
          <button id="qvAddToCartBtn" style="flex:1;background:linear-gradient(135deg,#1d4ed8,#0d6efd);color:#fff;border:none;border-radius:10px;padding:12px 20px;font-size:0.95rem;font-weight:700;cursor:pointer;">
            <i class="fa-solid fa-cart-plus" style="margin-right:8px;"></i>Add to Cart · ₹${prod.price}
          </button>
        </div>
      </div>
    </div>
  `;

  let selectedQty = 1;
  const qvMinus = document.getElementById('qvMinus');
  const qvPlus = document.getElementById('qvPlus');
  const qvQtyVal = document.getElementById('qvQtyVal');
  const qvAddBtn = document.getElementById('qvAddToCartBtn');

  if (qvMinus) {
    qvMinus.addEventListener('click', () => {
      if (selectedQty > 1) {
        selectedQty--;
        qvQtyVal.textContent = selectedQty;
        qvAddBtn.innerHTML = `<i class="fa-solid fa-cart-plus" style="margin-right:8px;"></i>Add to Cart · ₹${prod.price * selectedQty}`;
      }
    });
  }
  if (qvPlus) {
    qvPlus.addEventListener('click', () => {
      selectedQty++;
      qvQtyVal.textContent = selectedQty;
      qvAddBtn.innerHTML = `<i class="fa-solid fa-cart-plus" style="margin-right:8px;"></i>Add to Cart · ₹${prod.price * selectedQty}`;
    });
  }
  if (qvAddBtn) {
    qvAddBtn.addEventListener('click', () => {
      addToCart(prod.id, selectedQty);
      closeQuickView();
    });
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  const modal = document.getElementById('quickViewModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ============================================================
// PRESCRIPTION MODAL
// ============================================================
function openPrescriptionModal() {
  const modal = document.getElementById('prescriptionModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closePrescriptionModal() {
  const modal = document.getElementById('prescriptionModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function initModals() {
  // Quick view modal close
  const closeQuickViewBtn = document.getElementById('closeQuickViewBtn');
  const quickViewModal = document.getElementById('quickViewModal');
  if (closeQuickViewBtn) closeQuickViewBtn.addEventListener('click', closeQuickView);
  if (quickViewModal) {
    quickViewModal.addEventListener('click', (e) => {
      if (e.target === quickViewModal) closeQuickView();
    });
  }

  // Prescription modal close
  const closePrescriptionBtn = document.getElementById('closePrescriptionBtn');
  const prescriptionModal = document.getElementById('prescriptionModal');
  if (closePrescriptionBtn) closePrescriptionBtn.addEventListener('click', closePrescriptionModal);
  if (prescriptionModal) {
    prescriptionModal.addEventListener('click', (e) => {
      if (e.target === prescriptionModal) closePrescriptionModal();
    });
  }

  // Prescription file drop zone
  const fileDropZone = document.getElementById('fileDropZone');
  const fileInput = document.getElementById('prescriptionFileInput');
  const filePreviewArea = document.getElementById('filePreviewArea');

  if (fileDropZone && fileInput) {
    fileDropZone.addEventListener('click', () => fileInput.click());

    fileDropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileDropZone.classList.add('dragover');
    });
    fileDropZone.addEventListener('dragleave', () => fileDropZone.classList.remove('dragover'));
    fileDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      fileDropZone.classList.remove('dragover');
      if (e.dataTransfer.files.length) handlePrescriptionFile(e.dataTransfer.files[0], fileInput, filePreviewArea);
    });
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) handlePrescriptionFile(fileInput.files[0], fileInput, filePreviewArea);
    });
  }

  // Prescription form submit
  const prescriptionForm = document.getElementById('prescriptionForm');
  if (prescriptionForm) {
    prescriptionForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const patientName = (document.getElementById('rxPatientName') || {}).value?.trim();
      const patientPhone = (document.getElementById('rxPatientPhone') || {}).value?.trim();
      const notes = (document.getElementById('rxPatientNotes') || {}).value?.trim() || '';

      if (!patientName || !patientPhone) {
        showToast('Please fill in patient name and phone number.', 'warning');
        return;
      }

      const submitBtn = prescriptionForm.querySelector("button[type='submit']");
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying...';
      }

      const file = fileInput && fileInput.files && fileInput.files[0];
      const readImg = (f) => new Promise((resolve) => {
        if (!f || !f.type || !f.type.startsWith('image/')) {
          return resolve('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80');
        }
        const r = new FileReader();
        r.onload = (ev) => resolve(ev.target.result);
        r.onerror = () => resolve('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80');
        r.readAsDataURL(f);
      });

      try {
        const preview = await readImg(file);
        const res = await fetch('/api/prescriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: appState.user && appState.user.email ? appState.user.email : '',
            patient: patientName,
            doctor: 'Quick Rx Upload',
            phone: patientPhone,
            notes,
            medicines: notes || (file ? file.name : 'Quick Rx Upload'),
            fileName: file ? file.name : 'prescription.jpg',
            image: preview
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        if (data.prescription && data.prescription.rxId) {
          localStorage.setItem('medcare_active_rx', data.prescription.rxId);
        }
        closePrescriptionModal();
        prescriptionForm.reset();
        if (filePreviewArea) filePreviewArea.style.display = 'none';
        showToast('✅ Prescription saved to database! Our pharmacist will review & assign medicines.', 'success', 5000);
      } catch (err) {
        showToast(err.message || 'Could not upload prescription.', 'danger');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }

  // Auth modal
  const authModal = document.getElementById('authModal');
  const closeAuthBtn = document.getElementById('closeAuthBtn');
  const loginBtn = document.getElementById('loginBtn');
  const mobileLoginBtn = document.getElementById('mobileLoginBtn');

  if (loginBtn) loginBtn.addEventListener('click', () => window.location.href = 'login.html');
  if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', () => window.location.href = 'login.html');
  if (closeAuthBtn) closeAuthBtn.addEventListener('click', () => {
    if (authModal) { authModal.classList.remove('open'); document.body.style.overflow = ''; }
  });
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) { authModal.classList.remove('open'); document.body.style.overflow = ''; }
    });
  }

  // Auth tabs
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabName = tab.dataset.tab;
      const loginForm = document.getElementById('loginForm');
      const registerForm = document.getElementById('registerForm');
      if (loginForm) loginForm.style.display = tabName === 'login' ? 'block' : 'none';
      if (registerForm) registerForm.style.display = tabName === 'register' ? 'block' : 'none';
    });
  });

  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = (document.getElementById('loginEmail') || {}).value?.trim() || '';
      const name = email.split('@')[0];
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      appState.user = { name: capitalizedName, email };
      const uJson = JSON.stringify(appState.user);
      localStorage.setItem('medcare_user', uJson);
      localStorage.setItem('medCareUser', uJson);
      updateAuthUI();
      if (authModal) { authModal.classList.remove('open'); document.body.style.overflow = ''; }
      showToast(`Welcome back, ${capitalizedName}! 👋`, 'success');
    });
  }

  // Register form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('regName') || {}).value?.trim() || '';
      const email = (document.getElementById('regEmail') || {}).value?.trim() || '';
      appState.user = { name, email };
      const uJson = JSON.stringify(appState.user);
      localStorage.setItem('medcare_user', uJson);
      localStorage.setItem('medCareUser', uJson);
      updateAuthUI();
      if (authModal) { authModal.classList.remove('open'); document.body.style.overflow = ''; }
      showToast(`Account created! Welcome to MedCare, ${name}! 🎉`, 'success');
    });
  }

  // ESC key closes all modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickView();
      closePrescriptionModal();
      if (authModal) { authModal.classList.remove('open'); document.body.style.overflow = ''; }
    }
  });
}

function handlePrescriptionFile(file, fileInput, filePreviewArea) {
  if (!file) return;
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (!allowed.includes(file.type)) {
    showToast('Please upload an image (JPG, PNG, WEBP) or PDF.', 'warning');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    showToast('File size exceeds 10MB limit.', 'warning');
    return;
  }

  if (filePreviewArea) {
    filePreviewArea.style.display = 'block';
    filePreviewArea.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px;">
        <i class="fa-solid fa-file-circle-check" style="color:#16a34a;font-size:1.5rem;"></i>
        <div style="flex:1;">
          <strong style="font-size:0.875rem;color:#15803d;">${file.name}</strong>
          <small style="display:block;color:#86efac;">${(file.size / (1024 * 1024)).toFixed(2)} MB · Ready for review</small>
        </div>
        <button type="button" id="btnRemoveFile"
          style="background:none;border:1px solid #fca5a5;color:#ef4444;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:0.8rem;">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;
    const removeBtn = document.getElementById('btnRemoveFile');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        if (fileInput) fileInput.value = '';
        filePreviewArea.style.display = 'none';
        filePreviewArea.innerHTML = '';
      });
    }
  }

  showToast('Prescription file selected!', 'success');
}

// ============================================================
// UPDATE AUTH UI
// ============================================================
function updateAuthUI() {
  const userGreeting = document.getElementById('userGreeting');
  const loginBtn = document.getElementById('loginBtn');
  const currentUser = JSON.parse(localStorage.getItem('medcare_user')) || JSON.parse(localStorage.getItem('medCareUser')) || appState.user;

  if (currentUser && userGreeting) {
    appState.user = currentUser;
    userGreeting.innerHTML = `
      <a href="dashboard.html" class="user-profile-badge" title="My Dashboard"
        style="display:flex;align-items:center;gap:6px;text-decoration:none;color:inherit;">
        <i class="fa-solid fa-circle-user" style="color:#3b82f6;font-size:1.25rem;"></i>
        <span style="font-size:0.875rem;font-weight:600;">Hi, ${currentUser.name}</span>
      </a>
    `;
    if (loginBtn) loginBtn.style.display = 'none';
  } else {
    if (userGreeting) userGreeting.innerHTML = '';
    if (loginBtn) loginBtn.style.display = 'inline-flex';
  }
}

// ============================================================
// SCROLL TO TOP
// ============================================================
function initScrollToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// NEWSLETTER FORM
// ============================================================
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    if (!emailInput || !emailInput.value.trim()) return;

    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'warning');
      return;
    }

    fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Subscription failed');
        return data;
      })
      .then((data) => {
        showToast(data.message || `Thanks! You'll get 10% off on first order 🎉 · Check ${email}`, 'success', 5000);
        form.reset();
      })
      .catch((err) => {
        showToast(err.message || 'Could not subscribe. Please try again.', 'danger');
      });
  });
}

// ============================================================
// ANNOUNCEMENT BAR
// ============================================================
function initAnnouncementBar() {
  const closeBarBtn = document.getElementById('closeAnnouncementBar');
  if (closeBarBtn) {
    closeBarBtn.addEventListener('click', () => {
      const bar = document.getElementById('announcementBar') || document.querySelector('.top-bar');
      if (bar) {
        bar.style.transition = 'height 0.3s ease, opacity 0.3s ease';
        bar.style.opacity = '0';
        setTimeout(() => {
          bar.style.height = '0';
          bar.style.overflow = 'hidden';
        }, 300);
      }
    });
  }
}

// ============================================================
// PRESCRIPTION TRIGGERS
// ============================================================
function initPrescriptionTriggers() {
  document.querySelectorAll('.trigger-upload-rx').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openPrescriptionModal();
    });
  });
}

// ============================================================
// TOAST ANIMATION STYLE INJECTION
// ============================================================
function injectToastStyles() {
  if (document.getElementById('medCareToastStyles')) return;
  const style = document.createElement('style');
  style.id = 'medCareToastStyles';
  style.textContent = `
    @keyframes slideInToast {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    #toastContainer {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0;
      pointer-events: none;
    }
    #toastContainer > * {
      pointer-events: all;
    }
    .search-section-header {
      padding: 8px 12px;
      font-size: 0.72rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      background: #f8fafc;
    }
    #searchDropdown.show {
      display: block !important;
    }
    #searchDropdown:not(.show) {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}

// ============================================================
// DOMContentLoaded — MAIN INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  injectToastStyles();

  // Initialize hero slider
  const heroSlider = new HeroSlider();

  // Render all dynamic content
  renderCategories();
  renderFeaturedProducts('bestsellers');
  renderDeals();
  renderBlogs();
  renderTestimonials();

  // Sync medicines from MongoDB backend if available
  fetch('/api/medicines')
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      if (data && Array.isArray(data.medicines) && data.medicines.length > 0 && window.PHARMACY_DATA) {
        window.PHARMACY_DATA.allProducts = data.medicines;
        const activeTab = document.querySelector('.product-tab-btn.active');
        const tabKey = activeTab ? activeTab.getAttribute('data-tab') : 'bestsellers';
        renderFeaturedProducts(tabKey);
      }
    })
    .catch(() => { /* Keep static data.js fallback */ });

  // Initialize UI features & 3D animations
  initAOS();
  initHeroTyping();
  startCountdownTimer();
  initCounterAnimation();
  initScrollAnimations();
  initCardTilt();
  initNavbarScroll();
  initMobileMenu();
  initSearchAutocomplete();
  initCartSystem();
  initModals();
  initScrollToTop();
  initAnnouncementBar();
  initNewsletterForm();
  initProductTabs();
  initStickyCartBar();
  initPrescriptionTriggers();
  updateAuthUI();

  // Set first product tab active
  const defaultTab = document.querySelector('.product-tab-btn[data-tab="bestsellers"]') ||
    document.querySelector('.product-tab-btn');
  if (defaultTab) defaultTab.classList.add('active');

  // Global expose
  window.medCareResetFilter = function () {
    renderFeaturedProducts('all');
    document.querySelectorAll('.product-tab-btn').forEach(b => b.classList.remove('active'));
    const allBtn = document.querySelector('.product-tab-btn[data-tab="all"]');
    if (allBtn) allBtn.classList.add('active');
  };

  window.medCareAddToCart = function (productId) {
    addToCart(productId, 1);
  };

  window.openQuickView = openQuickView;
  window.openPrescriptionModal = openPrescriptionModal;
  window.closePrescriptionModal = closePrescriptionModal;
  window.openCartDrawer = openCartDrawer;
  window.closeCartDrawer = closeCartDrawer;

});
