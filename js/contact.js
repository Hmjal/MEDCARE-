// MedCare Online Pharmacy - Contact Us Page Application

document.addEventListener("DOMContentLoaded", () => {
  // 1. App State for Shared Components
  const state = {
    cart: JSON.parse(localStorage.getItem("medcare_cart")) || [],
    user: JSON.parse(localStorage.getItem("medcare_user")) || null
  };

  // 2. DOM Elements - Contact Page
  const contactForm = document.getElementById("contactForm");
  const formFullName = document.getElementById("formFullName");
  const formEmail = document.getElementById("formEmail");
  const formPhone = document.getElementById("formPhone");
  const formSubject = document.getElementById("formSubject");
  const formOrderId = document.getElementById("formOrderId");
  const orderIdGroup = document.getElementById("orderIdGroup");
  const formMessage = document.getElementById("formMessage");
  const charCounter = document.getElementById("charCounter");
  const btnSubmitMessage = document.getElementById("btnSubmitMessage");
  const formSuccessBanner = document.getElementById("formSuccessBanner");
  const ticketRefNumber = document.getElementById("ticketRefNumber");
  const btnSubmitAnother = document.getElementById("btnSubmitAnother");

  // Accordion Items
  const faqAccordionItems = document.querySelectorAll(".faq-accordion-item");

  // Copy Buttons
  const btnCopyAddress = document.getElementById("btnCopyAddress");
  const btnCopyMapAddress = document.getElementById("btnCopyMapAddress");

  // Shared Header Elements
  const cartBtn = document.getElementById("cartBtn");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartCountBadges = document.querySelectorAll(".cart-count-badge");
  const cartItemsList = document.getElementById("cartItemsList");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const cartTotalEl = document.getElementById("cartTotal");

  // Auth Modal Elements
  const authModal = document.getElementById("authModal");
  const closeAuthBtn = document.getElementById("closeAuthBtn");
  const loginBtn = document.getElementById("loginBtn");
  const authTabs = document.querySelectorAll(".auth-tab");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // Mobile Nav Elements
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const closeMobileNav = document.getElementById("closeMobileNav");

  // 3. Message Textarea Character Counter
  if (formMessage && charCounter) {
    const maxChars = 600;
    formMessage.addEventListener("input", () => {
      const len = formMessage.value.length;
      charCounter.textContent = `${len} / ${maxChars} characters`;
      if (len > maxChars) {
        charCounter.style.color = "var(--danger)";
      } else {
        charCounter.style.color = "var(--text-muted)";
      }
    });
  }

  // 4. Show/Hide Order ID field conditionally based on subject
  if (formSubject && orderIdGroup) {
    formSubject.addEventListener("change", () => {
      const val = formSubject.value;
      if (val === "Order Issue" || val === "Medicine Query") {
        orderIdGroup.style.display = "block";
      } else {
        orderIdGroup.style.display = "none";
      }
    });
  }

  // 5. Contact Form Submission Handler
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const fullName = formFullName ? formFullName.value.trim() : "";
      const email = formEmail ? formEmail.value.trim() : "";
      const phone = formPhone ? formPhone.value.trim() : "";
      const subject = formSubject ? formSubject.value : "";
      const message = formMessage ? formMessage.value.trim() : "";

      // Simple validation
      if (!fullName || !email || !phone || !subject || !message) {
        showToast("Please fill in all required fields marked with *", "danger");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast("Please enter a valid email address.", "danger");
        if (formEmail) formEmail.focus();
        return;
      }

      // Enter loading state
      if (btnSubmitMessage) {
        btnSubmitMessage.disabled = true;
        btnSubmitMessage.innerHTML = `
          <i class="fa-solid fa-circle-notch fa-spin"></i>
          <span>Sending Message...</span>
        `;
      }

      // Send to MongoDB API
      const orderIdVal = document.getElementById("contactOrderId") ? document.getElementById("contactOrderId").value.trim() : "";
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, subject, orderId: orderIdVal, message })
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to send message");
          return data;
        })
        .then((data) => {
          const ticketId = (data.contact && data.contact.ticketId) || `MED-TKT-${Math.floor(10000 + Math.random() * 90000)}`;
          if (ticketRefNumber) ticketRefNumber.textContent = ticketId;

          contactForm.style.display = "none";
          if (formSuccessBanner) formSuccessBanner.classList.add("show");
          showToast(`Message saved! Ticket #${ticketId}`, "success");
          if (formSuccessBanner) formSuccessBanner.scrollIntoView({ behavior: "smooth", block: "center" });
        })
        .catch((err) => {
          showToast(err.message || "Could not send message. Please try again.", "danger");
        })
        .finally(() => {
          if (btnSubmitMessage) {
            btnSubmitMessage.disabled = false;
            btnSubmitMessage.innerHTML = `
              <i class="fa-solid fa-paper-plane"></i>
              <span>Send Message</span>
            `;
          }
        });
    });
  }

  // Submit another message button
  if (btnSubmitAnother && contactForm && formSuccessBanner) {
    btnSubmitAnother.addEventListener("click", () => {
      contactForm.reset();
      if (charCounter) charCounter.textContent = "0 / 600 characters";
      if (orderIdGroup) orderIdGroup.style.display = "none";
      formSuccessBanner.classList.remove("show");
      contactForm.style.display = "flex";
      if (formFullName) formFullName.focus();
    });
  }

  // 6. FAQ Accordion Logic
  faqAccordionItems.forEach(item => {
    const btn = item.querySelector(".faq-accordion-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Optional: close other items for clean single-open behavior
      faqAccordionItems.forEach(other => {
        if (other !== item) {
          other.classList.remove("active");
          const otherBtn = other.querySelector(".faq-accordion-btn");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove("active");
        btn.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("active");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // 7. Copy Address Clipboard Helpers
  function copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg, "success");
      }).catch(() => {
        fallbackCopyText(text, successMsg);
      });
    } else {
      fallbackCopyText(text, successMsg);
    }
  }

  function fallbackCopyText(text, successMsg) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      showToast(successMsg, "success");
    } catch (err) {
      showToast("Unable to copy to clipboard", "danger");
    }
    textArea.remove();
  }

  const pharmacyAddressText = "MedCare Healthcare Towers, 4th Cross, 100ft Inner Ring Road, Koramangala Industrial Hub, Bengaluru, Karnataka 560034, India";

  if (btnCopyAddress) {
    btnCopyAddress.addEventListener("click", () => {
      copyTextToClipboard(pharmacyAddressText, "Pharmacy address copied to clipboard!");
    });
  }

  if (btnCopyMapAddress) {
    btnCopyMapAddress.addEventListener("click", () => {
      copyTextToClipboard(pharmacyAddressText, "Pharmacy address copied to clipboard!");
    });
  }

  // 8. Toast Helper
  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `medcare-toast toast-${type}`;
    const icon = type === "success" ? "fa-circle-check" : type === "danger" ? "fa-circle-xmark" : "fa-circle-info";

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span class="toast-text">${escapeHtml(message)}</span>
      <button class="toast-close">&times;</button>
    `;

    container.appendChild(toast);

    toast.querySelector(".toast-close").addEventListener("click", () => {
      toast.remove();
    });

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 9. Cart UI Synchronization
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

  // 10. Event Listeners for Header, Cart, Modals & Mobile Nav
  if (cartBtn) cartBtn.addEventListener("click", openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCartDrawer);

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", () => mobileNav.classList.add("open"));
  }
  if (closeMobileNav && mobileNav) {
    closeMobileNav.addEventListener("click", () => mobileNav.classList.remove("open"));
  }

  if (loginBtn && authModal) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      authModal.classList.add("active");
    });
  }

  if (closeAuthBtn && authModal) {
    closeAuthBtn.addEventListener("click", () => authModal.classList.remove("active"));
    authModal.addEventListener("click", (e) => {
      if (e.target === authModal) authModal.classList.remove("active");
    });
  }

  authTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      authTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.tab;
      if (target === "login") {
        if (loginForm) loginForm.style.display = "block";
        if (registerForm) registerForm.style.display = "none";
      } else {
        if (loginForm) loginForm.style.display = "none";
        if (registerForm) registerForm.style.display = "block";
      }
    });
  });

  // Initialize Cart UI
  updateCartUI();
});
