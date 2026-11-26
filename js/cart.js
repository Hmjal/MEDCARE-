// MedCare Online Pharmacy - Shopping Cart Page Application

document.addEventListener("DOMContentLoaded", () => {
  // App State
  const state = {
    cart: JSON.parse(localStorage.getItem("medcare_cart")) || [],
    appliedCoupon: JSON.parse(localStorage.getItem("medcare_coupon")) || null,
    user: JSON.parse(localStorage.getItem("medcare_user")) || null
  };

  // Coupons database
  const COUPONS = {
    "FIRST20": { code: "FIRST20", discountPct: 20, flat: 0, desc: "20% Off on First Order" },
    "HEALTH10": { code: "HEALTH10", discountPct: 10, flat: 0, desc: "10% Health Discount" },
    "MEDCARE50": { code: "MEDCARE50", discountPct: 0, flat: 50, desc: "Flat ₹50 Off" },
    "MEDCARE20": { code: "MEDCARE20", discountPct: 20, flat: 0, desc: "20% Welcome Offer" }
  };

  // DOM Elements
  const cartTitleCount = document.getElementById("cartTitleCount");
  const cartTableBody = document.getElementById("cartTableBody");
  const emptyCartDisplay = document.getElementById("emptyCartDisplay");
  const cartActionsToolbar = document.getElementById("cartActionsToolbar");
  const couponBoxCard = document.getElementById("couponBoxCard");
  const cartLayoutContainer = document.getElementById("cartLayoutContainer");
  const btnClearCartBtn = document.getElementById("btnClearCartBtn");
  const btnUpdateCartBtn = document.getElementById("btnUpdateCartBtn");
  const btnAddSampleItems = document.getElementById("btnAddSampleItems");

  const freeDeliveryMeterText = document.getElementById("freeDeliveryMeterText");
  const freeDeliveryMeterFill = document.getElementById("freeDeliveryMeterFill");

  const couponForm = document.getElementById("couponForm");
  const couponCodeInput = document.getElementById("couponCodeInput");
  const appliedCouponTag = document.getElementById("appliedCouponTag");
  const appliedCouponName = document.getElementById("appliedCouponName");
  const appliedCouponDesc = document.getElementById("appliedCouponDesc");
  const btnRemoveCoupon = document.getElementById("btnRemoveCoupon");

  // Summary Card Elements
  const summarySubtotal = document.getElementById("summarySubtotal");
  const summaryMrpDiscount = document.getElementById("summaryMrpDiscount");
  const summaryCouponRow = document.getElementById("summaryCouponRow");
  const summaryCouponDiscount = document.getElementById("summaryCouponDiscount");
  const summaryDeliveryCharges = document.getElementById("summaryDeliveryCharges");
  const summaryTaxes = document.getElementById("summaryTaxes");
  const summaryTotalAmount = document.getElementById("summaryTotalAmount");
  const summarySavingsAmount = document.getElementById("summarySavingsAmount");
  const cartRxNotice = document.getElementById("cartRxNotice");
  const btnProceedCheckout = document.getElementById("btnProceedCheckout");

  const recommendedCardsGrid = document.getElementById("recommendedCardsGrid");
  const headerCartCount = document.getElementById("headerCartCount");

  // Initialize
  renderCart();
  initCouponHandlers();
  renderRecommendedProducts();
  initSharedComponents();

  // ==========================================
  // 1. RENDER CART TABLE & SUMMARY
  // ==========================================
  function renderCart() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartTitleCount) cartTitleCount.textContent = `(${totalCount} ${totalCount === 1 ? 'Item' : 'Items'})`;
    if (headerCartCount) {
      headerCartCount.textContent = totalCount;
      headerCartCount.style.display = totalCount > 0 ? "inline-flex" : "none";
    }

    if (!cartTableBody) return;

    if (state.cart.length === 0) {
      cartTableBody.innerHTML = "";
      if (emptyCartDisplay) emptyCartDisplay.style.display = "block";
      if (cartActionsToolbar) cartActionsToolbar.style.display = "none";
      if (couponBoxCard) couponBoxCard.style.display = "none";
      if (btnProceedCheckout) {
        btnProceedCheckout.classList.add("disabled");
        btnProceedCheckout.style.pointerEvents = "none";
        btnProceedCheckout.style.opacity = "0.5";
      }

      // Reset values
      if (summarySubtotal) summarySubtotal.textContent = "₹0";
      if (summaryMrpDiscount) summaryMrpDiscount.textContent = "-₹0";
      if (summaryCouponRow) summaryCouponRow.style.display = "none";
      if (summaryDeliveryCharges) summaryDeliveryCharges.textContent = "₹0";
      if (summaryTaxes) summaryTaxes.textContent = "₹0";
      if (summaryTotalAmount) summaryTotalAmount.textContent = "₹0";
      if (summarySavingsAmount) summarySavingsAmount.textContent = "₹0";
      if (cartRxNotice) cartRxNotice.style.display = "none";
      if (freeDeliveryMeterFill) freeDeliveryMeterFill.style.width = "0%";
      if (freeDeliveryMeterText) freeDeliveryMeterText.innerHTML = "Add <strong>₹500</strong> more to unlock <strong>FREE Delivery</strong>";
      return;
    }

    // Has items
    if (emptyCartDisplay) emptyCartDisplay.style.display = "none";
    if (cartActionsToolbar) cartActionsToolbar.style.display = "flex";
    if (couponBoxCard) couponBoxCard.style.display = "block";
    if (btnProceedCheckout) {
      btnProceedCheckout.classList.remove("disabled");
      btnProceedCheckout.style.pointerEvents = "auto";
      btnProceedCheckout.style.opacity = "1";
    }

    // Render Rows
    cartTableBody.innerHTML = state.cart.map(item => {
      const lineSubtotal = item.price * item.quantity;
      return `
        <tr data-id="${item.id}">
          <td class="td-product">
            <a href="product.html?id=${item.id}">
              <img src="${item.image}" alt="${item.name}" class="cart-thumb-img">
            </a>
          </td>
          <td class="td-name">
            <h4 class="cart-table-name">
              <a href="product.html?id=${item.id}">${item.name}</a>
            </h4>
            <span class="cart-table-pack">${item.brand || 'MedCare Brand'} • ${item.packSize || 'Standard Pack'}</span>
            ${item.requiresPrescription ? '<span class="badge badge-rx"><i class="fa-solid fa-receipt"></i> Prescription Required</span>' : ''}
          </td>
          <td class="td-price">
            <span class="cart-unit-price-cell">₹${item.price}</span>
            ${item.mrp ? `<span class="cart-mrp-strike">MRP ₹${item.mrp}</span>` : ''}
          </td>
          <td class="td-qty">
            <div class="table-qty-stepper">
              <button type="button" class="btn-table-step btn-qty-minus" data-id="${item.id}">-</button>
              <span class="table-qty-val">${item.quantity}</span>
              <button type="button" class="btn-table-step btn-qty-plus" data-id="${item.id}">+</button>
            </div>
          </td>
          <td class="td-subtotal">
            <span class="cart-subtotal-cell">₹${lineSubtotal}</span>
          </td>
          <td class="td-action">
            <button type="button" class="btn-table-delete" data-id="${item.id}" title="Remove item">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      `;
    }).join("");

    attachTableEvents();
    calculateTotals();
  }

  function attachTableEvents() {
    document.querySelectorAll(".btn-qty-minus").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        updateItemQuantity(id, -1);
      });
    });

    document.querySelectorAll(".btn-qty-plus").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        updateItemQuantity(id, 1);
      });
    });

    document.querySelectorAll(".btn-table-delete").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        removeItem(id);
      });
    });
  }

  function updateItemQuantity(id, delta) {
    const item = state.cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      removeItem(id);
      return;
    }

    saveCart();
    renderCart();
  }

  function removeItem(id) {
    state.cart = state.cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
    showToast("Item removed from cart", "info");
  }

  function saveCart() {
    localStorage.setItem("medcare_cart", JSON.stringify(state.cart));
  }

  // ==========================================
  // 2. TOTALS, SAVINGS & FREE SHIPPING
  // ==========================================
  function calculateTotals() {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const mrpTotal = state.cart.reduce((sum, item) => sum + ((item.mrp || item.price) * item.quantity), 0);
    const productSavings = Math.max(0, mrpTotal - subtotal);

    // Coupon discount
    let couponSavings = 0;
    if (state.appliedCoupon) {
      if (state.appliedCoupon.discountPct > 0) {
        couponSavings = Math.round((subtotal * state.appliedCoupon.discountPct) / 100);
      } else if (state.appliedCoupon.flat > 0) {
        couponSavings = Math.min(subtotal, state.appliedCoupon.flat);
      }
    }

    // Delivery charges (Free above ₹500, else ₹40)
    const freeDeliveryThreshold = 500;
    let deliveryCharge = 0;
    if (subtotal >= freeDeliveryThreshold || subtotal === 0) {
      deliveryCharge = 0;
      if (summaryDeliveryCharges) summaryDeliveryCharges.innerHTML = `<span class="text-success fw-bold">FREE</span>`;
      if (freeDeliveryMeterFill) freeDeliveryMeterFill.style.width = "100%";
      if (freeDeliveryMeterText) freeDeliveryMeterText.innerHTML = `<span class="text-success"><i class="fa-solid fa-circle-check"></i> Yay! You unlocked <strong>FREE Delivery</strong>!</span>`;
    } else {
      deliveryCharge = 40;
      const needed = freeDeliveryThreshold - subtotal;
      const pct = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
      if (summaryDeliveryCharges) summaryDeliveryCharges.textContent = `₹${deliveryCharge}`;
      if (freeDeliveryMeterFill) freeDeliveryMeterFill.style.width = `${pct}%`;
      if (freeDeliveryMeterText) freeDeliveryMeterText.innerHTML = `Add <strong>₹${needed}</strong> more to unlock <strong>FREE Delivery</strong>`;
    }

    // Estimated Taxes (5% GST)
    const taxes = Math.round((subtotal * 0.05));

    // Final Total
    const finalTotal = Math.max(0, (subtotal - couponSavings) + deliveryCharge + taxes);
    const totalSavings = productSavings + couponSavings;

    if (summarySubtotal) summarySubtotal.textContent = `₹${subtotal}`;
    if (summaryMrpDiscount) summaryMrpDiscount.textContent = `-₹${productSavings}`;
    
    if (state.appliedCoupon && couponSavings > 0) {
      if (summaryCouponRow) summaryCouponRow.style.display = "flex";
      if (summaryCouponDiscount) summaryCouponDiscount.textContent = `-₹${couponSavings}`;
    } else {
      if (summaryCouponRow) summaryCouponRow.style.display = "none";
    }

    if (summaryTaxes) summaryTaxes.textContent = `₹${taxes}`;
    if (summaryTotalAmount) summaryTotalAmount.textContent = `₹${finalTotal}`;
    if (summarySavingsAmount) summarySavingsAmount.textContent = `₹${totalSavings}`;

    // Rx required check
    const hasRx = state.cart.some(item => item.requiresPrescription);
    if (cartRxNotice) cartRxNotice.style.display = hasRx ? "flex" : "none";
  }

  // ==========================================
  // 3. CART ACTIONS: CLEAR, UPDATE, SAMPLES
  // ==========================================
  if (btnClearCartBtn) {
    btnClearCartBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all items from your cart?")) {
        state.cart = [];
        state.appliedCoupon = null;
        localStorage.removeItem("medcare_coupon");
        saveCart();
        renderCart();
        showToast("Cart cleared", "info");
      }
    });
  }

  if (btnUpdateCartBtn) {
    btnUpdateCartBtn.addEventListener("click", () => {
      renderCart();
      showToast("Cart updated successfully!", "success");
    });
  }

  if (btnAddSampleItems) {
    btnAddSampleItems.addEventListener("click", () => {
      state.cart = [
        {
          id: "prod-1",
          name: "Paracetamol 650mg Tablets",
          brand: "Dolo Health",
          price: 32,
          mrp: 40,
          packSize: "Strip of 15 tablets",
          image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80",
          requiresPrescription: false,
          quantity: 2
        },
        {
          id: "prod-3",
          name: "Vitamin C 500mg + Zinc Chewables",
          brand: "Limcee Immunity",
          price: 185,
          mrp: 240,
          packSize: "Bottle of 60 tablets",
          image: "https://images.unsplash.com/photo-1563213126-a4273aed2016?auto=format&fit=crop&w=500&q=80",
          requiresPrescription: false,
          quantity: 1
        },
        {
          id: "prod-2",
          name: "Amoxicillin & Potassium Clavulanate 625mg",
          brand: "Augmentin Care",
          price: 168,
          mrp: 210,
          packSize: "Strip of 10 tablets",
          image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=500&q=80",
          requiresPrescription: true,
          quantity: 1
        }
      ];
      saveCart();
      renderCart();
      showToast("Added popular healthcare essentials to cart!", "success");
    });
  }

  // ==========================================
  // 4. COUPON CODE HANDLERS
  // ==========================================
  function initCouponHandlers() {
    updateCouponDisplay();

    if (couponForm && couponCodeInput) {
      couponForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const code = couponCodeInput.value.trim().toUpperCase();
        applyCouponCode(code);
      });
    }

    document.querySelectorAll(".quick-coupon-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const code = pill.getAttribute("data-code");
        if (couponCodeInput) couponCodeInput.value = code;
        applyCouponCode(code);
      });
    });

    if (btnRemoveCoupon) {
      btnRemoveCoupon.addEventListener("click", () => {
        state.appliedCoupon = null;
        localStorage.removeItem("medcare_coupon");
        updateCouponDisplay();
        calculateTotals();
        showToast("Coupon removed", "info");
      });
    }
  }

  function applyCouponCode(code) {
    if (!code) {
      showToast("Please enter a coupon code.", "warning");
      return;
    }

    if (state.cart.length === 0) {
      showToast("Your cart is empty! Add medicines before applying coupons.", "warning");
      return;
    }

    const found = COUPONS[code];
    if (found) {
      state.appliedCoupon = found;
      localStorage.setItem("medcare_coupon", JSON.stringify(found));
      updateCouponDisplay();
      calculateTotals();
      if (couponCodeInput) couponCodeInput.value = "";
      showToast(`Coupon "${found.code}" applied! ${found.desc}`, "success");
    } else {
      showToast(`Invalid coupon code "${code}". Try FIRST20 or HEALTH10`, "danger");
    }
  }

  function updateCouponDisplay() {
    if (state.appliedCoupon && appliedCouponTag && appliedCouponName && appliedCouponDesc) {
      appliedCouponTag.style.display = "flex";
      appliedCouponName.textContent = state.appliedCoupon.code;
      appliedCouponDesc.textContent = state.appliedCoupon.desc;
    } else if (appliedCouponTag) {
      appliedCouponTag.style.display = "none";
    }
  }

  // ==========================================
  // 5. RECOMMENDED: "YOU MIGHT ALSO NEED"
  // ==========================================
  function renderRecommendedProducts() {
    if (!recommendedCardsGrid) return;

    // Pick 4 items not already in cart
    const cartIds = state.cart.map(i => i.id);
    const recommended = PHARMACY_DATA.allProducts
      .filter(p => !cartIds.includes(p.id))
      .slice(0, 4);

    recommendedCardsGrid.innerHTML = recommended.map(prod => `
      <div class="shop-card" data-id="${prod.id}">
        <div class="product-badge-group">
          ${prod.requiresPrescription ? '<span class="badge badge-rx">Rx Req.</span>' : ''}
          <span class="badge badge-discount">${prod.discount}% OFF</span>
        </div>
        <div class="shop-card-media" style="height: 140px;">
          <a href="product.html?id=${prod.id}">
            <img src="${prod.image}" alt="${prod.name}" class="shop-card-img" loading="lazy">
          </a>
        </div>
        <div class="shop-card-body">
          <span class="product-brand">${prod.brand}</span>
          <h4 class="shop-card-title">
            <a href="product.html?id=${prod.id}">${prod.name}</a>
          </h4>
          <span class="cart-table-pack mb-2">${prod.packSize || 'Standard Packaging'}</span>
          <div class="shop-card-pricing mb-2">
            <span class="price-main">₹${prod.price}</span>
            <span class="mrp-strike">₹${prod.mrp}</span>
          </div>
          <button type="button" class="btn btn-primary btn-sm w-100 btn-add-rec" data-id="${prod.id}">
            <i class="fa-solid fa-cart-plus me-1"></i> Add to Cart
          </button>
        </div>
      </div>
    `).join("");

    recommendedCardsGrid.querySelectorAll(".btn-add-rec").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const prod = PHARMACY_DATA.allProducts.find(p => p.id === id);
        if (prod) {
          state.cart.push({
            id: prod.id,
            name: prod.name,
            brand: prod.brand,
            price: prod.price,
            mrp: prod.mrp,
            image: prod.image,
            requiresPrescription: prod.requiresPrescription,
            packSize: prod.packSize,
            quantity: 1
          });
          saveCart();
          renderCart();
          renderRecommendedProducts();
          showToast(`Added "${prod.name}" to cart!`, "success");
        }
      });
    });
  }

  // ==========================================
  // 6. SHARED AUTH & TOASTS
  // ==========================================
  function initSharedComponents() {
    updateAuthUI();

    const loginBtn = document.getElementById("loginBtn");
    const mobileLoginBtn = document.getElementById("mobileLoginBtn");
    if (loginBtn) loginBtn.addEventListener("click", () => { window.location.href = "login.html"; });
    if (mobileLoginBtn) mobileLoginBtn.addEventListener("click", () => { window.location.href = "login.html"; });

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileNav = document.getElementById("mobileNav");
    const closeMobileNav = document.getElementById("closeMobileNav");
    if (mobileMenuBtn && mobileNav) mobileMenuBtn.addEventListener("click", () => mobileNav.classList.add("open"));
    if (closeMobileNav && mobileNav) closeMobileNav.addEventListener("click", () => mobileNav.classList.remove("open"));
  }

  function updateAuthUI() {
    const userGreeting = document.getElementById("userGreeting");
    const loginBtn = document.getElementById("loginBtn");
    if (!userGreeting) return;

    const currentUser = JSON.parse(localStorage.getItem("medcare_user")) || state.user;
    if (currentUser) {
      state.user = currentUser;
      userGreeting.innerHTML = `
        <a href="dashboard.html" class="user-profile-badge" title="Go to My Dashboard">
          <i class="fa-solid fa-circle-user text-primary fs-5"></i>
          <span>Hi, ${currentUser.name}</span>
          <span class="badge bg-primary text-white ms-1" style="font-size:0.65rem;">Dashboard</span>
        </a>
      `;
      if (loginBtn) loginBtn.style.display = "none";
    } else {
      userGreeting.innerHTML = "";
      if (loginBtn) loginBtn.style.display = "inline-flex";
    }
  }

  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `medcare-toast toast-${type}`;
    let icon = type === "success" ? "fa-circle-check" : type === "warning" ? "fa-triangle-exclamation" : "fa-circle-info";
    toast.innerHTML = `
      <i class="fa-solid ${icon} toast-icon"></i>
      <span class="toast-message">${message}</span>
      <button class="toast-close">&times;</button>
    `;
    container.appendChild(toast);
    toast.querySelector(".toast-close").addEventListener("click", () => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 300);
    });
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.add("fade-out");
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }

  window.medCareShowToast = showToast;
});
