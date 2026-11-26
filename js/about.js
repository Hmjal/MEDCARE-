// MedCare Online Pharmacy - About Us Page Application

document.addEventListener("DOMContentLoaded", () => {
  // 1. App State for Shared Components
  const state = {
    cart: JSON.parse(localStorage.getItem("medcare_cart")) || []
  };

  // 2. Animated Statistics Counters
  const counterElements = document.querySelectorAll(".counter-value");
  let animated = false;

  function animateCounters() {
    if (animated) return;
    animated = true;

    counterElements.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const suffix = counter.dataset.suffix || "";
      const prefix = counter.dataset.prefix || "";
      const duration = 2000; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutQuad)
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentVal = Math.floor(easeProgress * target);

        counter.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // IntersectionObserver to trigger animation when scrolled into view
  const statsSection = document.getElementById("statsCounterSection");
  if (statsSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(statsSection);
  } else {
    // Fallback if observer not supported
    setTimeout(animateCounters, 500);
  }

  // 3. Floating Back to Top Button
  const backToTopBtn = document.getElementById("backToTopBtn");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 4. Cookie Consent Banner
  const cookieBanner = document.getElementById("cookieConsentBanner");
  const btnAcceptCookies = document.getElementById("btnAcceptCookies");
  const btnDeclineCookies = document.getElementById("btnDeclineCookies");

  if (cookieBanner) {
    const hasConsented = localStorage.getItem("medcare_cookie_consent");
    if (!hasConsented) {
      setTimeout(() => {
        cookieBanner.classList.add("show");
      }, 1200);
    }

    if (btnAcceptCookies) {
      btnAcceptCookies.addEventListener("click", () => {
        localStorage.setItem("medcare_cookie_consent", "accepted");
        cookieBanner.classList.remove("show");
      });
    }

    if (btnDeclineCookies) {
      btnDeclineCookies.addEventListener("click", () => {
        localStorage.setItem("medcare_cookie_consent", "declined");
        cookieBanner.classList.remove("show");
      });
    }
  }

  // 5. Shared Cart Drawer Synchronization
  const cartBtn = document.getElementById("cartBtn");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartCountBadges = document.querySelectorAll(".cart-count-badge");
  const cartItemsList = document.getElementById("cartItemsList");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const cartTotalEl = document.getElementById("cartTotal");

  function updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartCountBadges.forEach(badge => {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? "inline-flex" : "none";
    });

    if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal}`;
    if (cartTotalEl) cartTotalEl.textContent = `₹${subtotal}`;

    renderCartDrawerItems();
  }

  function renderCartDrawerItems() {
    if (!cartItemsList) return;
    if (state.cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <i class="fa-solid fa-cart-shopping"></i>
          <h4>Your cart is empty</h4>
          <p>Explore genuine medicines and healthcare essentials.</p>
          <a href="shop.html" class="btn btn-primary btn-sm">Shop Now</a>
        </div>
      `;
      return;
    }

    cartItemsList.innerHTML = state.cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">₹${item.price} <span class="cart-item-mrp">₹${item.mrp}</span></div>
          <div class="cart-item-stepper">
            <button class="btn-drawer-qty" onclick="window.medCareUpdateCartQty('${item.id}', -1)">-</button>
            <span>${item.quantity}</span>
            <button class="btn-drawer-qty" onclick="window.medCareUpdateCartQty('${item.id}', 1)">+</button>
          </div>
        </div>
        <button class="btn-cart-item-remove" onclick="window.medCareRemoveCartItem('${item.id}')" title="Remove">&times;</button>
      </div>
    `).join("");
  }

  window.medCareUpdateCartQty = function(id, delta) {
    const item = state.cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      state.cart = state.cart.filter(i => i.id !== id);
    }
    localStorage.setItem("medcare_cart", JSON.stringify(state.cart));
    updateCartUI();
  };

  window.medCareRemoveCartItem = function(id) {
    state.cart = state.cart.filter(i => i.id !== id);
    localStorage.setItem("medcare_cart", JSON.stringify(state.cart));
    updateCartUI();
  };

  function openCartDrawer() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add("open");
      cartOverlay.classList.add("active");
    }
  }

  function closeCartDrawer() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove("open");
      cartOverlay.classList.remove("active");
    }
  }

  if (cartBtn) cartBtn.addEventListener("click", openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCartDrawer);

  // Mobile Nav Drawer
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const closeMobileNav = document.getElementById("closeMobileNav");

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", () => mobileNav.classList.add("open"));
  }
  if (closeMobileNav && mobileNav) {
    closeMobileNav.addEventListener("click", () => mobileNav.classList.remove("open"));
  }

  // Auth Modal
  const authModal = document.getElementById("authModal");
  const loginBtn = document.getElementById("loginBtn");
  const closeAuthBtn = document.getElementById("closeAuthBtn");

  if (loginBtn && authModal) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      authModal.classList.add("active");
    });
  }
  if (closeAuthBtn && authModal) {
    closeAuthBtn.addEventListener("click", () => authModal.classList.remove("active"));
  }

  // Initialize
  updateCartUI();
});
