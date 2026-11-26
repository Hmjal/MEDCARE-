// MedCare Online Pharmacy - Amazon & Flipkart Style Checkout Process

document.addEventListener("DOMContentLoaded", () => {
  const defaultHimanshuAddress = {
    id: "addr_pune_1",
    recipientName: "Himanshu",
    name: "Himanshu",
    phone: "+91 98765 43210",
    addressLine: "Alandi Devachi, Near Indrayani River",
    house: "Alandi Devachi, Near Indrayani River",
    landmark: "Near Alandi Temple",
    street: "Alandi",
    city: "Pune",
    state: "Maharashtra",
    pincode: "412105",
    pin: "412105",
    type: "Home",
    isDefault: true
  };

  const savedUser = JSON.parse(localStorage.getItem("medcare_user")) || null;
  let storedAddresses = JSON.parse(localStorage.getItem("medcare_addresses")) || null;
  if (savedUser && Array.isArray(savedUser.addresses) && savedUser.addresses.length > 0) {
    if (!storedAddresses || storedAddresses.some(a => a.city === "Bengaluru" || a.name === "Rahul Verma")) {
      storedAddresses = savedUser.addresses;
      localStorage.setItem("medcare_addresses", JSON.stringify(storedAddresses));
    }
  }
  if (!storedAddresses || storedAddresses.length === 0) {
    storedAddresses = [defaultHimanshuAddress];
    localStorage.setItem("medcare_addresses", JSON.stringify(storedAddresses));
  }

  // App State
  const state = {
    currentStep: 1,
    cart: JSON.parse(localStorage.getItem("medcare_cart")) || [],
    appliedCoupon: JSON.parse(localStorage.getItem("medcare_coupon")) || null,
    user: savedUser,

    // Addresses
    addresses: storedAddresses,
    selectedAddressId: (storedAddresses.find(a => a.isDefault) || storedAddresses[0]).id,

    // Payment Choice
    selectedPaymentMethod: "card",
    paymentDetails: {
      method: "Credit / Debit Card",
      summary: "Visa / Mastercard (256-Bit SSL)"
    }
  };

  // Seed fallback cart items if empty so user can test checkout seamlessly
  if (state.cart.length === 0) {
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
      }
    ];
    localStorage.setItem("medcare_cart", JSON.stringify(state.cart));
  }

  // DOM Elements - Stepper
  const progressBar = document.getElementById("checkoutProgressBar");
  const stepIndicators = [
    document.getElementById("stepIndicator1"),
    document.getElementById("stepIndicator2"),
    document.getElementById("stepIndicator3"),
    document.getElementById("stepIndicator4")
  ];
  const stepPanels = [
    document.getElementById("stepPanel1"),
    document.getElementById("stepPanel2"),
    document.getElementById("stepPanel3"),
    document.getElementById("stepPanel4")
  ];

  // DOM Elements - Step 1 Address
  const savedAddressesGrid = document.getElementById("savedAddressesGrid");
  const btnToggleNewAddressForm = document.getElementById("btnToggleNewAddressForm");
  const newAddressFormContainer = document.getElementById("newAddressFormContainer");
  const newAddressForm = document.getElementById("newAddressForm");
  const btnCancelNewAddress = document.getElementById("btnCancelNewAddress");
  const btnContinueToSummary = document.getElementById("btnContinueToSummary") || document.getElementById("btnContinueToPayment");

  // DOM Elements - Step 2 Order Summary
  const reviewAddressDisplay = document.getElementById("reviewAddressDisplay");
  const reviewItemsList = document.getElementById("reviewItemsList");
  const reviewItemsCount = document.getElementById("reviewItemsCount");
  const reviewRxNotice = document.getElementById("reviewRxNotice");
  const btnChangeAddress = document.getElementById("btnChangeAddress");
  const btnBackToAddress = document.getElementById("btnBackToAddress");
  const btnContinueToPayment = document.getElementById("btnContinueToPayment");

  // DOM Elements - Step 3 Payment
  const paymentMethodsGroup = document.getElementById("paymentMethodsGroup");
  const paymentAddressName = document.getElementById("paymentAddressName");
  const paymentTotalAmount = document.getElementById("paymentTotalAmount");
  const btnChangeToSummary = document.getElementById("btnChangeToSummary");
  const btnBackToSummary = document.getElementById("btnBackToSummary");
  const btnVerifyUpi = document.getElementById("btnVerifyUpi");
  const upiIdInput = document.getElementById("upiIdInput");
  const btnPlaceOrder = document.getElementById("btnPlaceOrder");
  const btnPlaceOrderTotal = document.getElementById("btnPlaceOrderTotal");

  // DOM Elements - Step 4 Confirmation
  const confirmedOrderId = document.getElementById("confirmedOrderId");
  const confirmedOrderTime = document.getElementById("confirmedOrderTime");

  // DOM Elements - Order Summary Sidebar
  const sidebarItemsList = document.getElementById("sidebarItemsList");
  const sideSubtotal = document.getElementById("sideSubtotal");
  const sideMrpDiscount = document.getElementById("sideMrpDiscount");
  const sideCouponRow = document.getElementById("sideCouponRow");
  const sideCouponDiscount = document.getElementById("sideCouponDiscount");
  const sideDeliveryCharges = document.getElementById("sideDeliveryCharges");
  const sideTaxes = document.getElementById("sideTaxes");
  const sideTotal = document.getElementById("sideTotal");

  // Initialize all components
  renderSavedAddresses();
  initStep1AddressHandlers();
  initStep2OrderSummaryHandlers();
  initStep3PaymentHandlers();
  renderSidebarSummary();

  // ==========================================
  // 1. STEP NAVIGATION LOGIC (Amazon / Flipkart Flow)
  // ==========================================
  function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > 4) return;
    state.currentStep = stepNumber;

    // Progress Bar percentage
    const progressWidths = { 1: "15%", 2: "50%", 3: "82%", 4: "100%" };
    if (progressBar) progressBar.style.width = progressWidths[stepNumber];

    // Update Indicators
    stepIndicators.forEach((ind, idx) => {
      const stepIdx = idx + 1;
      ind.classList.toggle("active", stepIdx === stepNumber);
      ind.classList.toggle("completed", stepIdx < stepNumber);

      const circle = ind.querySelector(".step-circle");
      if (stepIdx < stepNumber) {
        circle.innerHTML = '<i class="fa-solid fa-check"></i>';
      } else {
        const icons = ["fa-location-dot", "fa-basket-shopping", "fa-credit-card", "fa-circle-check"];
        circle.innerHTML = `<i class="fa-solid ${icons[idx]}"></i>`;
      }
    });

    // Update Panels
    stepPanels.forEach((panel, idx) => {
      panel.classList.toggle("active", idx + 1 === stepNumber);
    });

    // Trigger step-specific renders
    if (stepNumber === 2) {
      renderOrderSummary();
    } else if (stepNumber === 3) {
      renderPaymentRecap();
    }

    renderSidebarSummary();
    window.scrollTo({ top: 100, behavior: "smooth" });
  }

  // ==========================================
  // 2. STEP 1: SAVED ADDRESSES & NEW ADDRESS
  // ==========================================
  function formatAddrFields(addr) {
    const displayName = addr.recipientName || addr.name || "Himanshu";
    const line1 = addr.addressLine || addr.house || "Alandi Devachi, Near Indrayani River";
    const locality = addr.street && addr.street !== "Near Alandi Temple" ? addr.street : "Alandi";
    const addressText = line1.toLowerCase().includes("alandi") && locality === "Alandi"
      ? `${line1}, Alandi`
      : `${line1}${locality ? ", " + locality : ""}`;
    const cityStatePin = `${addr.city || "Pune"}, ${addr.state || "Maharashtra"} - <strong>${addr.pincode || addr.pin || "412105"}</strong>`;
    const rawPhone = String(addr.phone || "+91 98765 43210").trim();
    const phoneText = rawPhone.startsWith("+") ? rawPhone : `+91 ${rawPhone}`;
    const addrType = addr.type || "Home";
    return { displayName, addressText, cityStatePin, phoneText, addrType };
  }

  function renderSavedAddresses() {
    if (!savedAddressesGrid) return;

    savedAddressesGrid.innerHTML = state.addresses.map(addr => {
      const isSelected = addr.id === state.selectedAddressId;
      const f = formatAddrFields(addr);
      return `
        <div class="address-card-item ${isSelected ? 'selected' : ''}" data-id="${addr.id}">
          <input type="radio" name="selectedAddressRadio" value="${addr.id}" ${isSelected ? 'checked' : ''}>
          <div class="address-card-content">
            <div class="address-card-top">
              <span class="address-name">${f.displayName}</span>
              ${addr.isDefault
          ? `<span class="badge bg-primary-subtle text-primary ms-1">Default: ${f.addrType}</span>`
          : `<span class="address-type-tag ${f.addrType.toLowerCase()}">${f.addrType}</span>`}
            </div>
            <p class="address-full-text mb-1">${f.addressText}</p>
            <p class="address-full-text">${f.cityStatePin}</p>
            <p class="address-phone-text"><i class="fa-solid fa-phone me-1"></i> ${f.phoneText}</p>
            <div class="address-card-actions">
              <button type="button" class="btn-addr-action delete btn-delete-addr" data-id="${addr.id}">Delete</button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Radio Card Selection Click Listeners
    savedAddressesGrid.querySelectorAll(".address-card-item").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        state.selectedAddressId = id;
        renderSavedAddresses();
      });
    });

    // Delete Address
    savedAddressesGrid.querySelectorAll(".btn-delete-addr").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        if (state.addresses.length <= 1) {
          showToast("You must maintain at least one delivery address.", "warning");
          return;
        }
        state.addresses = state.addresses.filter(a => a.id !== id);
        if (state.selectedAddressId === id) {
          state.selectedAddressId = state.addresses[0].id;
        }
        localStorage.setItem("medcare_addresses", JSON.stringify(state.addresses));
        renderSavedAddresses();
        showToast("Address deleted", "info");
      });
    });
  }

  function initStep1AddressHandlers() {
    if (btnToggleNewAddressForm && newAddressFormContainer) {
      btnToggleNewAddressForm.addEventListener("click", () => {
        const isHidden = newAddressFormContainer.style.display === "none";
        newAddressFormContainer.style.display = isHidden ? "block" : "none";
        if (isHidden) newAddressFormContainer.scrollIntoView({ behavior: "smooth" });
      });
    }

    if (btnCancelNewAddress && newAddressFormContainer) {
      btnCancelNewAddress.addEventListener("click", () => {
        newAddressFormContainer.style.display = "none";
      });
    }

    if (newAddressForm) {
      newAddressForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("newAddrName").value.trim();
        const phone = document.getElementById("newAddrPhone").value.trim();
        const house = document.getElementById("newAddrHouse").value.trim();
        const street = document.getElementById("newAddrStreet").value.trim();
        const city = document.getElementById("newAddrCity").value.trim();
        const stateName = document.getElementById("newAddrState").value.trim();
        const pin = document.getElementById("newAddrPin").value.trim();
        const typeInput = document.querySelector('input[name="addrType"]:checked');
        const type = typeInput ? typeInput.value : "Home";

        if (!name || !phone || !house || !street || !city || !stateName || !pin) {
          showToast("Please fill in all address fields.", "warning");
          return;
        }

        const newId = `addr-${Date.now()}`;
        const newAddressObj = {
          id: newId,
          name,
          phone,
          house,
          street,
          city,
          state: stateName,
          pin,
          type,
          isDefault: document.getElementById("setAsDefaultAddr").checked
        };

        state.addresses.push(newAddressObj);
        state.selectedAddressId = newId;
        localStorage.setItem("medcare_addresses", JSON.stringify(state.addresses));

        renderSavedAddresses();
        newAddressForm.reset();
        newAddressFormContainer.style.display = "none";
        showToast("New delivery address added and selected!", "success");
      });
    }

    // Step 1 -> Step 2 (Order Summary)
    if (btnContinueToSummary) {
      btnContinueToSummary.addEventListener("click", () => {
        if (!state.selectedAddressId) {
          showToast("Please select a delivery address.", "warning");
          return;
        }
        goToStep(2);
      });
    }
  }

  // ==========================================
  // 3. STEP 2: ORDER SUMMARY (What you added to cart)
  // ==========================================
  function renderOrderSummary() {
    // 1. Delivery Address Summary
    const addr = state.addresses.find(a => a.id === state.selectedAddressId) || state.addresses[0];
    if (reviewAddressDisplay && addr) {
      const f = formatAddrFields(addr);
      reviewAddressDisplay.innerHTML = `
        <div class="d-flex align-items-center gap-2 mb-1">
          <strong>${f.displayName}</strong>
          <span class="badge bg-primary-subtle text-primary">${addr.isDefault ? `Default: ${f.addrType}` : f.addrType}</span>
          <span class="text-muted small">• ${f.phoneText}</span>
        </div>
        <p class="m-0 text-muted small">${f.addressText}, ${f.cityStatePin}</p>
      `;
    }

    // 2. Prescription alert
    const hasRx = state.cart.some(i => i.requiresPrescription);
    if (reviewRxNotice) reviewRxNotice.style.display = hasRx ? "flex" : "none";

    // 3. Detailed Cart Items List
    if (reviewItemsList && reviewItemsCount) {
      const totalCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);
      reviewItemsCount.textContent = totalCount;

      if (state.cart.length === 0) {
        reviewItemsList.innerHTML = `
          <div class="text-center py-4">
            <i class="fa-solid fa-basket-shopping fs-1 text-muted mb-2"></i>
            <h5>Your cart is empty</h5>
            <p class="text-muted small">Please browse our shop to add medicines.</p>
            <a href="shop.html" class="btn btn-primary btn-sm mt-2">Go to Shop</a>
          </div>
        `;
        if (btnContinueToPayment) btnContinueToPayment.disabled = true;
        return;
      }

      if (btnContinueToPayment) btnContinueToPayment.disabled = false;

      reviewItemsList.innerHTML = state.cart.map(item => `
        <div class="review-item-row" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="review-thumb">
          <div class="review-item-info">
            <h6 class="review-item-title">${item.name}</h6>
            <span class="review-item-meta">${item.brand || 'MedCare'} • ${item.packSize || 'Standard Packaging'}</span>
            ${item.requiresPrescription ? '<span class="badge bg-warning text-dark me-2 small" style="display:inline-block; margin-top:2px;"><i class="fa-solid fa-file-prescription"></i> Prescription Required</span>' : ''}
            <div class="review-item-qty-actions mt-2 d-flex align-items-center gap-3">
              <div class="d-flex align-items-center gap-1">
                <button type="button" class="btn btn-sm btn-outline-secondary px-2 py-0 btn-step-minus" data-id="${item.id}">-</button>
                <span class="px-2 fw-bold small">${item.quantity}</span>
                <button type="button" class="btn btn-sm btn-outline-secondary px-2 py-0 btn-step-plus" data-id="${item.id}">+</button>
              </div>
              <button type="button" class="btn-addr-action delete btn-step-remove" data-id="${item.id}">
                <i class="fa-solid fa-trash-can me-1"></i> Remove
              </button>
            </div>
          </div>
          <div class="text-end">
            <span class="review-item-total d-block">₹${item.price * item.quantity}</span>
            ${item.mrp ? `<small class="text-muted text-decoration-line-through">₹${item.mrp * item.quantity}</small>` : ''}
          </div>
        </div>
      `).join("");

      // Attach Stepper Listeners
      reviewItemsList.querySelectorAll(".btn-step-plus").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          const it = state.cart.find(i => i.id === id);
          if (it) {
            it.quantity++;
            saveCartState();
            renderOrderSummary();
            renderSidebarSummary();
          }
        });
      });

      reviewItemsList.querySelectorAll(".btn-step-minus").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          const it = state.cart.find(i => i.id === id);
          if (it) {
            it.quantity--;
            if (it.quantity <= 0) {
              state.cart = state.cart.filter(i => i.id !== id);
            }
            saveCartState();
            renderOrderSummary();
            renderSidebarSummary();
          }
        });
      });

      reviewItemsList.querySelectorAll(".btn-step-remove").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          state.cart = state.cart.filter(i => i.id !== id);
          saveCartState();
          renderOrderSummary();
          renderSidebarSummary();
          showToast("Item removed from cart", "info");
        });
      });
    }
  }

  function saveCartState() {
    localStorage.setItem("medcare_cart", JSON.stringify(state.cart));
  }

  function initStep2OrderSummaryHandlers() {
    if (btnChangeAddress) btnChangeAddress.addEventListener("click", () => goToStep(1));
    if (btnBackToAddress) btnBackToAddress.addEventListener("click", () => goToStep(1));
    if (btnContinueToPayment) {
      btnContinueToPayment.addEventListener("click", () => {
        if (state.cart.length === 0) {
          showToast("Your cart is empty! Add medicines before proceeding to payment.", "warning");
          return;
        }
        goToStep(3);
      });
    }
  }

  // ==========================================
  // 4. STEP 3: PAYMENT METHOD SELECTION & ORDER PLACEMENT
  // ==========================================
  function renderPaymentRecap() {
    const addr = state.addresses.find(a => a.id === state.selectedAddressId) || state.addresses[0];
    if (paymentAddressName && addr) {
      paymentAddressName.textContent = `${addr.name} (${addr.type} - ${addr.city})`;
    }

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let couponDiscount = 0;
    if (state.appliedCoupon) {
      couponDiscount = state.appliedCoupon.discountPct
        ? Math.round((subtotal * state.appliedCoupon.discountPct) / 100)
        : state.appliedCoupon.flat;
    }
    const delivery = subtotal >= 500 ? 0 : 40;
    const taxes = Math.round(subtotal * 0.05);
    const finalTotal = Math.max(0, (subtotal - couponDiscount) + delivery + taxes);

    if (paymentTotalAmount) paymentTotalAmount.textContent = `₹${finalTotal}`;
    if (btnPlaceOrderTotal) btnPlaceOrderTotal.textContent = `₹${finalTotal}`;
  }

  function initStep3PaymentHandlers() {
    if (btnBackToSummary) btnBackToSummary.addEventListener("click", () => goToStep(2));
    if (btnChangeToSummary) btnChangeToSummary.addEventListener("click", () => goToStep(2));

    if (paymentMethodsGroup) {
      const options = paymentMethodsGroup.querySelectorAll(".payment-method-option");

      options.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');

        option.addEventListener("click", (e) => {
          if (e.target.tagName !== "INPUT" && e.target.tagName !== "BUTTON" && e.target.tagName !== "SELECT") {
            radio.checked = true;
          }

          options.forEach(opt => {
            opt.classList.toggle("active", opt === option);
            const sub = opt.querySelector(".payment-subform");
            if (sub) sub.style.display = (opt === option) ? "block" : "none";
          });

          state.selectedPaymentMethod = option.getAttribute("data-method");
          updatePaymentSummaryText(state.selectedPaymentMethod);
        });
      });
    }

    if (btnVerifyUpi && upiIdInput) {
      btnVerifyUpi.addEventListener("click", () => {
        const val = upiIdInput.value.trim();
        if (!val || !val.includes("@")) {
          showToast("Please enter a valid UPI ID (e.g. mobile@okhdfcbank).", "warning");
          return;
        }
        btnVerifyUpi.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
        setTimeout(() => {
          btnVerifyUpi.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> Verified`;
          showToast(`UPI ID "${val}" verified successfully!`, "success");
        }, 700);
      });
    }

    if (btnPlaceOrder) {
      btnPlaceOrder.addEventListener("click", async () => {
        if (state.cart.length === 0) {
          showToast("Your cart is empty! Please add medicines before checkout.", "warning");
          goToStep(2);
          return;
        }

        const originalText = btnPlaceOrder.innerHTML;
        btnPlaceOrder.disabled = true;
        btnPlaceOrder.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i> Processing Secure Payment...`;

        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let couponDiscount = 0;
        if (state.appliedCoupon) {
          couponDiscount = state.appliedCoupon.discountPct
            ? Math.round((subtotal * state.appliedCoupon.discountPct) / 100)
            : (state.appliedCoupon.flat || 0);
        }
        const delivery = subtotal >= 500 || subtotal === 0 ? 0 : 40;
        const taxes = Math.round(subtotal * 0.05);
        const finalTotal = Math.max(0, (subtotal - couponDiscount) + delivery + taxes);

        const addrObj = state.addresses.find(a => a.id === state.selectedAddressId) || state.addresses[0];
        const addressStr = addrObj
          ? `${addrObj.addressLine}, ${addrObj.city}${addrObj.state ? ', ' + addrObj.state : ''} - ${addrObj.pincode}`
          : "Default Delivery Address";

        const randomOrderNo = Math.floor(10000 + Math.random() * 90000);
        const orderIdStr = `#MED-ORD-${randomOrderNo}`;

        const orderPayload = {
          orderId: orderIdStr,
          userEmail: state.user && state.user.email ? state.user.email : "",
          customer: (addrObj && addrObj.name) || (state.user && state.user.name) || "Customer",
          phone: (addrObj && addrObj.phone) || (state.user && state.user.phone) || "",
          deliveryAddress: addressStr,
          status: "processing",
          statusText: "Processing & Packed",
          timelineIndex: 1,
          paymentMethod: state.paymentDetails ? state.paymentDetails.method : "Online Payment",
          items: state.cart.map(item => ({
            id: item.id,
            name: item.name,
            brand: item.brand || "",
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          subtotal,
          delivery,
          taxes,
          discount: couponDiscount,
          total: finalTotal
        };

        try {
          const res = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderPayload)
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Order submission failed");

          if (confirmedOrderId) confirmedOrderId.textContent = data.order.orderId || orderIdStr;

          const now = new Date();
          const timeStr = now.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) +
            " • " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
          if (confirmedOrderTime) confirmedOrderTime.textContent = timeStr;

          if (data.updatedUser) {
            localStorage.setItem("medcare_user", JSON.stringify(data.updatedUser));
          }
          localStorage.removeItem("medcare_cart");
          localStorage.removeItem("medcare_coupon");
          state.cart = [];

          goToStep(4);
          showToast(`Order ${orderIdStr} saved & placed successfully!`, "success");
        } catch (err) {
          showToast(err.message || "Could not place order. Please try again.", "danger");
        } finally {
          btnPlaceOrder.disabled = false;
          btnPlaceOrder.innerHTML = originalText;
        }
      });
    }
  }

  function updatePaymentSummaryText(method) {
    const titles = {
      card: { method: "Credit / Debit Card", summary: "Online 256-Bit Secure Payment" },
      upi: { method: "UPI Application", summary: "GPay / PhonePe / Paytm / BHIM" },
      netbanking: { method: "Net Banking", summary: "Direct Bank Transfer" },
      wallet: { method: "Digital Wallet", summary: "Prepaid Wallet Balance" },
      cod: { method: "Cash on Delivery", summary: "Pay Cash or Scan QR upon Delivery" }
    };
    state.paymentDetails = titles[method] || titles.card;
  }

  // ==========================================
  // 5. ORDER SUMMARY SIDEBAR (Visible in all steps)
  // ==========================================
  function renderSidebarSummary() {
    if (!sidebarItemsList) return;

    if (state.cart.length === 0) {
      sidebarItemsList.innerHTML = `
        <div class="text-center py-3 text-muted small">
          <i class="fa-solid fa-basket-shopping me-1"></i> No items in cart
        </div>
      `;
    } else {
      sidebarItemsList.innerHTML = state.cart.map(item => `
        <div class="sidebar-item-row">
          <img src="${item.image}" alt="${item.name}" class="sidebar-item-thumb">
          <div class="sidebar-item-info">
            <span class="sidebar-item-name" title="${item.name}">${item.name}</span>
            <span class="sidebar-item-qty">Qty: ${item.quantity} × ₹${item.price}</span>
          </div>
          <span class="sidebar-item-price">₹${item.price * item.quantity}</span>
        </div>
      `).join("");
    }

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const mrpTotal = state.cart.reduce((sum, item) => sum + ((item.mrp || item.price) * item.quantity), 0);
    const productSavings = Math.max(0, mrpTotal - subtotal);

    let couponDiscount = 0;
    if (state.appliedCoupon) {
      couponDiscount = state.appliedCoupon.discountPct
        ? Math.round((subtotal * state.appliedCoupon.discountPct) / 100)
        : state.appliedCoupon.flat;
      if (sideCouponRow) sideCouponRow.style.display = "flex";
      if (sideCouponDiscount) sideCouponDiscount.textContent = `-₹${couponDiscount}`;
    } else {
      if (sideCouponRow) sideCouponRow.style.display = "none";
    }

    const delivery = subtotal >= 500 || subtotal === 0 ? 0 : 40;
    const taxes = Math.round(subtotal * 0.05);
    const finalTotal = Math.max(0, (subtotal - couponDiscount) + delivery + taxes);

    if (sideSubtotal) sideSubtotal.textContent = `₹${subtotal}`;
    if (sideMrpDiscount) sideMrpDiscount.textContent = `-₹${productSavings}`;
    if (sideDeliveryCharges) sideDeliveryCharges.innerHTML = delivery === 0 ? `<span class="text-success fw-bold">FREE</span>` : `₹${delivery}`;
    if (sideTaxes) sideTaxes.textContent = `₹${taxes}`;
    if (sideTotal) sideTotal.textContent = `₹${finalTotal}`;
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
    }, 3500);
  }

  window.medCareShowToast = showToast;
});
