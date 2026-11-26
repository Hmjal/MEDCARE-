// MedCare Online Pharmacy - User Dashboard Logic (Page 8)

document.addEventListener("DOMContentLoaded", () => {
  // App State
  const state = {
    user: JSON.parse(localStorage.getItem("medcare_user")) || {
      name: "Rahul Verma",
      email: "rahul.verma@example.com",
      phone: "9876543210",
      dob: "1994-08-15",
      gender: "Male",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      memberSince: "May 2024",
      walletBalance: 350,
      medcareCoins: 700
    },

    orders: [
      {
        id: "#MED-ORD-92814",
        date: "October 19, 2026",
        status: "in-transit",
        statusText: "In Transit",
        paymentMethod: "Credit Card (Visa •••• 8912)",
        deliveryAddress: "Flat 402, Sunshine Residency, 80 Feet Road, Koramangala, Bengaluru - 560034",
        deliveryEstimate: "Tomorrow by 3:00 PM",
        timelineIndex: 3, // 0: Placed, 1: Confirmed, 2: Packed, 3: Shipped, 4: Delivered
        items: [
          {
            name: "Paracetamol 650mg Tablets",
            brand: "Dolo Health",
            price: 32,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80"
          },
          {
            name: "Vitamin C 500mg + Zinc Chewables",
            brand: "Limcee Immunity",
            price: 185,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1563213126-a4273aed2016?auto=format&fit=crop&w=200&q=80"
          }
        ],
        subtotal: 249,
        delivery: 0,
        taxes: 12,
        total: 261
      },
      {
        id: "#MED-ORD-74120",
        date: "October 10, 2026",
        status: "delivered",
        statusText: "Delivered",
        paymentMethod: "UPI (mobile@okhdfcbank)",
        deliveryAddress: "Flat 402, Sunshine Residency, 80 Feet Road, Koramangala, Bengaluru - 560034",
        deliveryEstimate: "Delivered on Oct 11, 2026 at 2:15 PM",
        timelineIndex: 4,
        items: [
          {
            name: "Amoxicillin & Potassium Clavulanate 625mg",
            brand: "Augmentin Care",
            price: 168,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=200&q=80"
          },
          {
            name: "Atorvastatin 10mg Tablets for Cholesterol",
            brand: "Atorva Health",
            price: 115,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=200&q=80"
          }
        ],
        subtotal: 398,
        delivery: 0,
        taxes: 20,
        total: 418
      },
      {
        id: "#MED-ORD-61204",
        date: "September 15, 2026",
        status: "cancelled",
        statusText: "Cancelled",
        paymentMethod: "Cash on Delivery",
        deliveryAddress: "Floor 3, Tech Park Towers, Outer Ring Road, Bellandur, Bengaluru - 560103",
        deliveryEstimate: "Cancelled per customer request",
        timelineIndex: 0,
        items: [
          {
            name: "Omnigel Pain Relief Spray 55g",
            brand: "Cipla Health",
            price: 185,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80"
          }
        ],
        subtotal: 185,
        delivery: 40,
        taxes: 9,
        total: 234
      }
    ],

    prescriptions: [
      {
        id: "#RX-8841",
        doctor: "Dr. Sandeep Kumar (Cardiologist)",
        clinic: "Apollo Health Care Clinic, Bengaluru",
        date: "October 18, 2026",
        status: "approved",
        statusText: "Approved by Pharmacist",
        orderId: "#MED-ORD-74120",
        medicines: "Amoxicillin 625mg, Atorvastatin 10mg",
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "#RX-9102",
        doctor: "Dr. Ananya Sen (General Physician)",
        clinic: "Fortis Care Hospital",
        date: "October 19, 2026",
        status: "pending",
        statusText: "Pending Pharmacist Review",
        orderId: "#MED-ORD-92814",
        medicines: "Telmisartan 40mg (Strip of 15)",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80"
      }
    ],

    addresses: JSON.parse(localStorage.getItem("medcare_addresses")) || [
      {
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
      }
    ],

    wishlist: JSON.parse(localStorage.getItem("medcare_wishlist")) || [
      "prod-2", "prod-4", "prod-7", "prod-9"
    ]
  };

  // Sync state with localStorage
  localStorage.setItem("medcare_user", JSON.stringify(state.user));

  // ==========================================
  // 1. SIDEBAR TAB NAVIGATION
  // ==========================================
  const menuLinks = document.querySelectorAll(".dashboard-menu-link[data-tab]");
  const panels = document.querySelectorAll(".dashboard-panel");

  function switchDashboardTab(tabName) {
    menuLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("data-tab") === tabName);
    });

    panels.forEach(panel => {
      panel.classList.toggle("active", panel.id === `panel-${tabName}`);
    });

    window.location.hash = tabName;
  }

  menuLinks.forEach(link => {
    link.addEventListener("click", () => {
      const tab = link.getAttribute("data-tab");
      switchDashboardTab(tab);
    });
  });

  // Logout button
  const btnLogoutUser = document.getElementById("btnLogoutUser");
  if (btnLogoutUser) {
    btnLogoutUser.addEventListener("click", () => {
      if (confirm("Are you sure you want to log out of your account?")) {
        localStorage.removeItem("medcare_user");
        localStorage.removeItem("medCareUser");
        localStorage.removeItem("medcare_token");
        localStorage.removeItem("medcare_cart");
        localStorage.removeItem("medCareCart");
        localStorage.removeItem("medcare_wishlist");
        localStorage.removeItem("medCareWishlist");
        localStorage.removeItem("medcare_coupon");
        localStorage.removeItem("medcare_active_rx");
        showToast("Logged out successfully. Redirecting...", "info");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 600);
      }
    });
  }

  // Avatar Upload Picker
  const avatarFileInput = document.getElementById("avatarFileInput");
  const userAvatarImg = document.getElementById("userAvatarImg");
  if (avatarFileInput && userAvatarImg) {
    avatarFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const newAvatar = evt.target.result;
          userAvatarImg.src = newAvatar;
          state.user.avatar = newAvatar;
          localStorage.setItem("medcare_user", JSON.stringify(state.user));
          showToast("Profile photo updated successfully!", "success");
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ==========================================
  // 2. MY PROFILE TAB
  // ==========================================
  function renderUserInfo() {
    const sidebarUserName = document.getElementById("sidebarUserName");
    const sidebarUserEmail = document.getElementById("sidebarUserEmail");
    const headerUserName = document.getElementById("headerUserName");
    const profName = document.getElementById("profName");
    const profEmail = document.getElementById("profEmail");
    const profPhone = document.getElementById("profPhone");
    const profDob = document.getElementById("profDob");
    const profGender = document.getElementById("profGender");
    const walletBalanceText = document.getElementById("walletBalanceText");

    if (sidebarUserName) sidebarUserName.textContent = state.user.name;
    if (sidebarUserEmail) sidebarUserEmail.textContent = state.user.email;
    if (headerUserName) headerUserName.textContent = state.user.name;

    if (profName) profName.value = state.user.name;
    if (profEmail) profEmail.value = state.user.email;
    if (profPhone) profPhone.value = state.user.phone;
    if (profDob && state.user.dob) profDob.value = state.user.dob;
    if (profGender && state.user.gender) profGender.value = state.user.gender;
    if (walletBalanceText) walletBalanceText.textContent = `₹${state.user.walletBalance || 350}.00`;
  }

  const btnToggleEditProfile = document.getElementById("btnToggleEditProfile");
  const profileSaveBtnRow = document.getElementById("profileSaveBtnRow");
  const btnCancelProfileEdit = document.getElementById("btnCancelProfileEdit");
  const profileInfoForm = document.getElementById("profileInfoForm");

  if (btnToggleEditProfile) {
    btnToggleEditProfile.addEventListener("click", () => {
      const inputs = profileInfoForm.querySelectorAll("input, select");
      const isCurrentlyDisabled = inputs[0].disabled;

      inputs.forEach(inp => inp.disabled = !isCurrentlyDisabled);
      if (profileSaveBtnRow) profileSaveBtnRow.style.display = isCurrentlyDisabled ? "block" : "none";
      btnToggleEditProfile.innerHTML = isCurrentlyDisabled
        ? `<i class="fa-solid fa-xmark me-1"></i> Cancel Edit`
        : `<i class="fa-solid fa-pen-to-square me-1"></i> Edit Profile`;
    });
  }

  if (btnCancelProfileEdit) {
    btnCancelProfileEdit.addEventListener("click", () => {
      const inputs = profileInfoForm.querySelectorAll("input, select");
      inputs.forEach(inp => inp.disabled = true);
      if (profileSaveBtnRow) profileSaveBtnRow.style.display = "none";
      if (btnToggleEditProfile) btnToggleEditProfile.innerHTML = `<i class="fa-solid fa-pen-to-square me-1"></i> Edit Profile`;
      renderUserInfo();
    });
  }

  if (profileInfoForm) {
    profileInfoForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      state.user.name = document.getElementById("profName").value.trim();
      state.user.email = document.getElementById("profEmail").value.trim();
      state.user.phone = document.getElementById("profPhone").value.trim();
      state.user.dob = document.getElementById("profDob").value;
      state.user.gender = document.getElementById("profGender").value;

      const token = localStorage.getItem("medcare_token");
      if (token) {
        try {
          const res = await fetch("/api/auth/profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              name: state.user.name,
              phone: state.user.phone,
              dob: state.user.dob,
              gender: state.user.gender,
              addresses: state.addresses
            })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.user) state.user = { ...state.user, ...data.user };
          }
        } catch (err) { /* keep local update */ }
      }

      localStorage.setItem("medcare_user", JSON.stringify(state.user));
      renderUserInfo();

      const inputs = profileInfoForm.querySelectorAll("input, select");
      inputs.forEach(inp => inp.disabled = true);
      if (profileSaveBtnRow) profileSaveBtnRow.style.display = "none";
      if (btnToggleEditProfile) btnToggleEditProfile.innerHTML = `<i class="fa-solid fa-pen-to-square me-1"></i> Edit Profile`;
      showToast("Profile details saved to MongoDB!", "success");
    });
  }

  const changePasswordForm = document.getElementById("changePasswordForm");
  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const cur = document.getElementById("currentPwd").value;
      const n1 = document.getElementById("newPwd").value;
      const n2 = document.getElementById("confirmNewPwd").value;

      if (n1 !== n2) {
        showToast("New passwords do not match.", "danger");
        return;
      }
      if (n1.length < 8) {
        showToast("Password must be at least 8 characters long.", "warning");
        return;
      }

      showToast("Password updated successfully!", "success");
      changePasswordForm.reset();
    });
  }

  // ==========================================
  // 3. MY ORDERS TAB
  // ==========================================
  const ordersListContainer = document.getElementById("ordersListContainer");
  const orderFilterBtns = document.querySelectorAll(".order-filter-btn");
  const orderSearchInput = document.getElementById("orderSearchInput");

  function renderOrdersList(filter = "all", searchQuery = "") {
    if (!ordersListContainer) return;

    let filtered = state.orders;
    if (filter === "active") {
      filtered = filtered.filter(o => o.status === "in-transit" || o.status === "confirmed");
    } else if (filter !== "all") {
      filtered = filtered.filter(o => o.status === filter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(o => o.id.toLowerCase().includes(q) || o.items.some(i => i.name.toLowerCase().includes(q)));
    }

    if (filtered.length === 0) {
      ordersListContainer.innerHTML = `
        <div class="text-center py-5">
          <i class="fa-solid fa-box-open fs-1 text-muted mb-2"></i>
          <h5>No orders found</h5>
          <p class="text-muted small">You haven't placed any orders matching this criteria.</p>
          <a href="shop.html" class="btn btn-primary btn-sm mt-2">Explore Medicines</a>
        </div>
      `;
      return;
    }

    ordersListContainer.innerHTML = filtered.map(order => `
      <div class="order-history-card" data-id="${order.id}">
        <div class="order-card-header">
          <div class="d-flex align-items-center gap-3">
            <span class="order-id-badge">${order.id}</span>
            <span class="text-muted small"><i class="fa-regular fa-calendar me-1"></i> ${order.date}</span>
          </div>
          <span class="order-status-pill ${order.status}">
            <i class="fa-solid ${order.status === 'delivered' ? 'fa-circle-check' : order.status === 'in-transit' ? 'fa-truck-fast' : 'fa-circle-xmark'}"></i>
            ${order.statusText}
          </span>
        </div>

        <div class="order-card-body">
          <div class="order-items-strip">
            ${order.items.map(it => `
              <div class="order-thumb-wrap" title="${it.name} (Qty: ${it.quantity})">
                <img src="${it.image}" alt="${it.name}">
              </div>
            `).join("")}
            <div class="ms-2">
              <strong class="d-block small text-dark">${order.items.map(i => `${i.name} (×${i.quantity})`).join(", ")}</strong>
              <small class="text-muted"><i class="fa-solid fa-location-dot me-1"></i> Delivery: <strong>${order.deliveryEstimate}</strong></small>
            </div>
          </div>
        </div>

        <div class="order-card-footer">
          <div class="order-total-display">
            <span class="text-muted small">Total Amount: </span>
            <strong>₹${order.total}</strong>
            <small class="text-muted ms-1">(${order.items.length} items)</small>
          </div>
          <div class="order-action-btns">
            <button type="button" class="btn btn-outline-primary btn-sm btn-track-order" data-id="${order.id}">
              <i class="fa-solid fa-location-crosshairs me-1"></i> Track Order
            </button>
            <button type="button" class="btn btn-success btn-sm btn-reorder" data-id="${order.id}">
              <i class="fa-solid fa-rotate-right me-1"></i> Reorder
            </button>
            <button type="button" class="btn btn-outline-secondary btn-sm btn-order-details" data-id="${order.id}">
              Details
            </button>
          </div>
        </div>
      </div>
    `).join("");

    // Wire action buttons
    ordersListContainer.querySelectorAll(".btn-track-order").forEach(btn => {
      btn.addEventListener("click", () => openOrderDetailModal(btn.getAttribute("data-id")));
    });
    ordersListContainer.querySelectorAll(".btn-order-details").forEach(btn => {
      btn.addEventListener("click", () => openOrderDetailModal(btn.getAttribute("data-id")));
    });
    ordersListContainer.querySelectorAll(".btn-reorder").forEach(btn => {
      btn.addEventListener("click", () => reorderItems(btn.getAttribute("data-id")));
    });
  }

  // Filter Buttons
  orderFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      orderFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.getAttribute("data-filter");
      renderOrdersList(f, orderSearchInput ? orderSearchInput.value : "");
    });
  });

  if (orderSearchInput) {
    orderSearchInput.addEventListener("input", () => {
      const activeBtn = document.querySelector(".order-filter-btn.active");
      const f = activeBtn ? activeBtn.getAttribute("data-filter") : "all";
      renderOrdersList(f, orderSearchInput.value.trim());
    });
  }

  function reorderItems(orderId) {
    const ord = state.orders.find(o => o.id === orderId);
    if (!ord) return;

    let cart = JSON.parse(localStorage.getItem("medcare_cart")) || [];
    ord.items.forEach(it => {
      const existing = cart.find(c => c.name === it.name);
      if (existing) {
        existing.quantity += it.quantity;
      } else {
        cart.push({
          id: `reorder-${Date.now()}-${Math.random()}`,
          name: it.name,
          brand: it.brand,
          price: it.price,
          quantity: it.quantity,
          image: it.image,
          requiresPrescription: false
        });
      }
    });

    localStorage.setItem("medcare_cart", JSON.stringify(cart));
    showToast(`Items from ${orderId} added to cart! Proceeding to cart...`, "success");
    setTimeout(() => {
      window.location.href = "cart.html";
    }, 900);
  }

  // ==========================================
  // 4. ORDER DETAIL & TIMELINE TRACKER MODAL
  // ==========================================
  const orderDetailModal = document.getElementById("orderDetailModal");
  const btnCloseOrderDetail = document.getElementById("btnCloseOrderDetail");
  const btnCloseOrderModalFooter = document.getElementById("btnCloseOrderModalFooter");
  const modalOrderTitle = document.getElementById("modalOrderTitle");
  const modalOrderStatusPill = document.getElementById("modalOrderStatusPill");
  const modalOrderBody = document.getElementById("modalOrderBody");
  const orderTimelineTracker = document.getElementById("orderTimelineTracker");

  function openOrderDetailModal(orderId) {
    const ord = state.orders.find(o => o.id === orderId);
    if (!ord || !orderDetailModal) return;

    if (modalOrderTitle) modalOrderTitle.textContent = `Order Details: ${ord.id}`;
    if (modalOrderStatusPill) {
      modalOrderStatusPill.className = `order-status-pill ${ord.status}`;
      modalOrderStatusPill.textContent = ord.statusText;
    }

    // Render 5-step timeline
    if (orderTimelineTracker) {
      const stages = [
        { name: "Placed", time: "Oct 19, 10:30 AM" },
        { name: "Confirmed", time: "Oct 19, 10:45 AM" },
        { name: "Packed", time: "Oct 19, 11:15 AM" },
        { name: "Shipped", time: "Oct 19, 11:30 AM" },
        { name: "Delivered", time: ord.status === "delivered" ? "Delivered" : "Est. Tomorrow" }
      ];

      orderTimelineTracker.innerHTML = stages.map((stg, idx) => {
        let cls = "";
        let icon = "fa-check";

        if (idx < ord.timelineIndex) {
          cls = "completed";
          icon = "fa-check";
        } else if (idx === ord.timelineIndex) {
          cls = "active";
          icon = idx === 4 ? "fa-house-circle-check" : "fa-truck-fast";
        } else {
          icon = idx === 4 ? "fa-house" : "fa-clock";
        }

        return `
          <div class="timeline-step ${cls}">
            <div class="timeline-step-circle"><i class="fa-solid ${icon}"></i></div>
            <div class="timeline-step-name">${stg.name}</div>
            <div class="timeline-step-time">${stg.time}</div>
          </div>
        `;
      }).join("");
    }

    // Render Items and Pricing
    if (modalOrderBody) {
      modalOrderBody.innerHTML = `
        <div class="mb-3">
          <h6>Items in this Order</h6>
          <div class="border rounded-2 p-2 bg-light">
            ${ord.items.map(it => `
              <div class="d-flex align-items-center justify-content-between py-2 border-bottom">
                <div class="d-flex align-items-center gap-2">
                  <img src="${it.image}" alt="${it.name}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 6px;">
                  <div>
                    <strong class="d-block small text-dark">${it.name}</strong>
                    <small class="text-muted">${it.brand} • Qty: ${it.quantity} × ₹${it.price}</small>
                  </div>
                </div>
                <span class="fw-bold">₹${it.price * it.quantity}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="row g-3 small">
          <div class="col-md-6">
            <div class="p-2 border rounded bg-white h-100">
              <strong class="text-primary d-block mb-1"><i class="fa-solid fa-location-dot me-1"></i> Delivery Address</strong>
              <p class="m-0 text-muted">${ord.deliveryAddress}</p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="p-2 border rounded bg-white h-100">
              <strong class="text-primary d-block mb-1"><i class="fa-solid fa-credit-card me-1"></i> Payment Summary</strong>
              <p class="m-0 text-muted">${ord.paymentMethod}</p>
              <div class="d-flex justify-content-between mt-2 pt-2 border-top">
                <span>Subtotal: ₹${ord.subtotal}</span>
                <strong class="text-dark">Total: ₹${ord.total}</strong>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    orderDetailModal.classList.add("open");
  }

  function closeOrderDetailModal() {
    if (orderDetailModal) orderDetailModal.classList.remove("open");
  }

  if (btnCloseOrderDetail) btnCloseOrderDetail.addEventListener("click", closeOrderDetailModal);
  if (btnCloseOrderModalFooter) btnCloseOrderModalFooter.addEventListener("click", closeOrderDetailModal);
  if (orderDetailModal) {
    orderDetailModal.addEventListener("click", (e) => {
      if (e.target === orderDetailModal) closeOrderDetailModal();
    });
  }

  // ==========================================
  // 5. MY PRESCRIPTIONS TAB
  // ==========================================
  const prescriptionsGrid = document.getElementById("prescriptionsGrid");

  function renderPrescriptionsList() {
    if (!prescriptionsGrid) return;

    prescriptionsGrid.innerHTML = state.prescriptions.map(rx => {
      const items = Array.isArray(rx.prescribed_items) ? rx.prescribed_items : [];
      const st = rx.status || "Pending";
      const isPending = st === "Pending" || st === "pending";
      const isVerified = st === "Reviewed" || st === "Converted_To_Cart" || st === "approved";
      const isRejected = st === "Rejected" || st === "rejected";

      const badgeCls = isVerified ? "bg-success" : isRejected ? "bg-danger" : "bg-warning text-dark";
      const badgeLabel = isVerified ? "Verified" : isRejected ? "Rejected" : "Pending";
      const fileUrl = rx.file_url || rx.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80";
      const isPdf = fileUrl.toLowerCase().endsWith(".pdf");

      const medSummary = items.length > 0
        ? items.map(it => {
          const medName = it.medicine_id && it.medicine_id.name ? it.medicine_id.name : (it.name || "Medicine");
          return `${medName} (${it.quantity || 1}x${it.dosage ? ' • ' + it.dosage : ''})`;
        }).join(", ")
        : (rx.notes_by_patient || rx.medicines || "Awaiting Pharmacist Review");

      return `
      <div class="rx-record-card">
        <div class="rx-card-top">
          <span class="fw-bold text-dark">${rx.rxId || rx.id}</span>
          <span class="badge ${badgeCls}">${badgeLabel}</span>
        </div>

        ${isPdf ? `
          <div class="rx-preview-thumb d-flex flex-column align-items-center justify-content-center bg-light border rounded mb-2" style="height:140px;">
            <i class="fa-solid fa-file-pdf text-danger fs-1 mb-1"></i>
            <span class="small text-muted">PDF Prescription</span>
          </div>
        ` : `<img src="${fileUrl}" alt="Prescription Slip" class="rx-preview-thumb">`}

        <h6 class="mb-1">${rx.patient_name || rx.doctor || "Patient"}</h6>
        <p class="text-muted small mb-2"><i class="fa-solid fa-user-doctor me-1"></i> ${rx.doctor || "Registered Physician"}</p>

        <div class="small text-muted mb-2">
          <div><i class="fa-regular fa-calendar me-1"></i> Uploaded: <strong>${rx.date}</strong></div>
          <div><i class="fa-solid fa-pills me-1"></i> Rx Items: <strong class="text-dark">${medSummary}</strong></div>
        </div>

        ${isRejected && rx.pharmacist_notes ? `
          <div class="alert alert-danger py-2 px-2 small mb-2">
            <strong>Rejection Reason:</strong> ${rx.pharmacist_notes}
          </div>
        ` : ''}

        ${isVerified && rx.pharmacist_notes ? `
          <div class="alert alert-success py-2 px-2 small mb-2">
            <strong>Pharmacist Note:</strong> ${rx.pharmacist_notes}
          </div>
        ` : ''}

        ${isVerified && items.length > 0 ? `
          <button type="button" class="btn btn-success btn-sm w-100 mb-2 btn-rx-convert-cart" data-id="${rx.mongoId || rx.id}">
            <i class="fa-solid fa-cart-shopping me-1"></i> View Medicines Added &amp; Checkout
          </button>
        ` : ''}

        <div class="d-flex gap-2">
          <button type="button" class="btn btn-outline-primary btn-sm flex-fill" onclick="window.open('${fileUrl}', '_blank')">
            <i class="fa-solid fa-eye me-1"></i> View Slip
          </button>
          <a href="${fileUrl}" download class="btn btn-outline-secondary btn-sm" title="Download">
            <i class="fa-solid fa-download"></i>
          </a>
        </div>
      </div>
    `;
    }).join("");

    prescriptionsGrid.querySelectorAll(".btn-rx-convert-cart").forEach(btn => {
      btn.addEventListener("click", async () => {
        const targetId = btn.dataset.id;
        const token = localStorage.getItem("medcare_token");
        const origHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-1"></i> Adding to Cart...`;

        try {
          const res = await fetch(`/api/prescriptions/${encodeURIComponent(targetId)}/convert-to-cart`, {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Could not convert prescription to cart");

          if (Array.isArray(data.cart)) {
            localStorage.setItem("medcare_cart", JSON.stringify(data.cart));
          }
          localStorage.setItem("medcare_active_rx", targetId);
          showToast("Verified medicines added to your cart! Redirecting...", "success");
          setTimeout(() => { window.location.href = "cart.html"; }, 500);
        } catch (err) {
          btn.disabled = false;
          btn.innerHTML = origHtml;
          showToast(err.message || "Failed to add medicines to cart.", "danger");
        }
      });
    });
  }

  // ==========================================
  // 6. MY ADDRESSES TAB
  // ==========================================
  const dashboardAddressesGrid = document.getElementById("dashboardAddressesGrid");
  const btnOpenAddAddressModal = document.getElementById("btnOpenAddAddressModal");
  const addAddressModal = document.getElementById("addAddressModal");
  const btnCloseAddressModal = document.getElementById("btnCloseAddressModal");
  const dashboardAddAddressForm = document.getElementById("dashboardAddAddressForm");

  function renderAddressesList() {
    if (!dashboardAddressesGrid) return;

    dashboardAddressesGrid.innerHTML = state.addresses.map(addr => {
      const displayName = addr.recipientName || addr.name || "Himanshu";
      const line1 = addr.addressLine || addr.house || "Alandi Devachi, Near Indrayani River";
      const locality = addr.street && addr.street !== "Near Alandi Temple" ? addr.street : "Alandi";
      const rawPhone = String(addr.phone || "+91 98765 43210").trim();
      const phoneText = rawPhone.startsWith("+") ? rawPhone : `+91 ${rawPhone}`;
      const addrType = addr.type || "Home";
      return `
      <div class="addr-box ${addr.isDefault ? 'is-default' : ''}">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="address-type-tag ${addrType.toLowerCase()}">${addrType}</span>
          ${addr.isDefault ? `<span class="badge bg-primary">Default: ${addrType}</span>` : ''}
        </div>
        <h6 class="mb-1">${displayName}</h6>
        <p class="text-muted small mb-1">${line1}${locality ? `, ${locality}` : ''}</p>
        <p class="text-muted small mb-2">${addr.city || "Pune"}, ${addr.state || "Maharashtra"} - <strong>${addr.pincode || addr.pin || "412105"}</strong></p>
        <p class="small text-muted mb-3"><i class="fa-solid fa-phone me-1"></i> ${phoneText}</p>

        <div class="d-flex gap-2">
          ${!addr.isDefault ? `<button type="button" class="btn btn-outline-primary btn-sm btn-set-default" data-id="${addr.id}">Set as Default</button>` : ''}
          <button type="button" class="btn btn-outline-danger btn-sm btn-delete-dash-addr" data-id="${addr.id}">Delete</button>
        </div>
      </div>
    `;
    }).join("");

    dashboardAddressesGrid.querySelectorAll(".btn-set-default").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        state.addresses.forEach(a => a.isDefault = (a.id === id));
        localStorage.setItem("medcare_addresses", JSON.stringify(state.addresses));
        renderAddressesList();
        showToast("Default address updated!", "success");
      });
    });

    dashboardAddressesGrid.querySelectorAll(".btn-delete-dash-addr").forEach(btn => {
      btn.addEventListener("click", () => {
        if (state.addresses.length <= 1) {
          showToast("You must keep at least one address.", "warning");
          return;
        }
        const id = btn.getAttribute("data-id");
        state.addresses = state.addresses.filter(a => a.id !== id);
        localStorage.setItem("medcare_addresses", JSON.stringify(state.addresses));
        renderAddressesList();
        showToast("Address deleted.", "info");
      });
    });
  }

  if (btnOpenAddAddressModal && addAddressModal) {
    btnOpenAddAddressModal.addEventListener("click", () => addAddressModal.classList.add("open"));
  }
  if (btnCloseAddressModal && addAddressModal) {
    btnCloseAddressModal.addEventListener("click", () => addAddressModal.classList.remove("open"));
  }

  if (dashboardAddAddressForm) {
    dashboardAddAddressForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newAddr = {
        id: `addr-${Date.now()}`,
        name: document.getElementById("dashAddrName").value.trim(),
        phone: document.getElementById("dashAddrPhone").value.trim(),
        house: document.getElementById("dashAddrHouse").value.trim(),
        street: document.getElementById("dashAddrStreet").value.trim(),
        city: document.getElementById("dashAddrCity").value.trim(),
        state: document.getElementById("dashAddrState").value.trim(),
        pin: document.getElementById("dashAddrPin").value.trim(),
        type: document.querySelector('input[name="dashAddrType"]:checked').value,
        isDefault: false
      };

      state.addresses.push(newAddr);
      localStorage.setItem("medcare_addresses", JSON.stringify(state.addresses));
      renderAddressesList();
      dashboardAddAddressForm.reset();
      addAddressModal.classList.remove("open");
      showToast("New delivery address saved!", "success");
    });
  }

  // ==========================================
  // 7. MY WISHLIST TAB
  // ==========================================
  const wishlistCardsGrid = document.getElementById("wishlistCardsGrid");
  const badgeWishlistCount = document.getElementById("badgeWishlistCount");

  function renderWishlist() {
    if (!wishlistCardsGrid) return;

    const wishlistProds = PHARMACY_DATA.allProducts.filter(p => state.wishlist.includes(p.id));
    if (badgeWishlistCount) badgeWishlistCount.textContent = wishlistProds.length;

    if (wishlistProds.length === 0) {
      wishlistCardsGrid.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fa-regular fa-heart fs-1 text-muted mb-2"></i>
          <h5>Your wishlist is empty</h5>
          <p class="text-muted small">Save medicines and health supplements to buy later.</p>
          <a href="shop.html" class="btn btn-primary btn-sm mt-2">Explore Medicines</a>
        </div>
      `;
      return;
    }

    wishlistCardsGrid.innerHTML = wishlistProds.map(prod => `
      <div class="col-md-6 col-lg-3">
        <div class="shop-card h-100">
          <div class="shop-card-media" style="height: 140px;">
            <a href="product.html?id=${prod.id}">
              <img src="${prod.image}" alt="${prod.name}" class="shop-card-img">
            </a>
          </div>
          <div class="shop-card-body">
            <span class="product-brand">${prod.brand}</span>
            <h5 class="shop-card-title"><a href="product.html?id=${prod.id}">${prod.name}</a></h5>
            <div class="shop-card-pricing mb-2">
              <span class="price-main">₹${prod.price}</span>
              <span class="mrp-strike">₹${prod.mrp}</span>
            </div>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-primary btn-sm flex-fill btn-wish-cart" data-id="${prod.id}">
                <i class="fa-solid fa-cart-plus me-1"></i> Add to Cart
              </button>
              <button type="button" class="btn btn-outline-danger btn-sm btn-wish-remove" data-id="${prod.id}" title="Remove">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join("");

    wishlistCardsGrid.querySelectorAll(".btn-wish-cart").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const prod = PHARMACY_DATA.allProducts.find(p => p.id === id);
        if (prod) {
          let cart = JSON.parse(localStorage.getItem("medcare_cart")) || [];
          const ex = cart.find(c => c.id === id);
          if (ex) ex.quantity++;
          else {
            cart.push({
              id: prod.id,
              name: prod.name,
              brand: prod.brand,
              price: prod.price,
              mrp: prod.mrp,
              image: prod.image,
              requiresPrescription: prod.requiresPrescription,
              quantity: 1
            });
          }
          localStorage.setItem("medcare_cart", JSON.stringify(cart));
          showToast(`Added "${prod.name}" to cart!`, "success");
        }
      });
    });

    wishlistCardsGrid.querySelectorAll(".btn-wish-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        state.wishlist = state.wishlist.filter(wId => wId !== id);
        localStorage.setItem("medcare_wishlist", JSON.stringify(state.wishlist));
        renderWishlist();
        showToast("Item removed from wishlist", "info");
      });
    });
  }

  // ==========================================
  // 8. TOAST NOTIFICATIONS
  // ==========================================
  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `medcare-toast toast-${type}`;
    let icon = type === "success" ? "fa-circle-check" : type === "warning" ? "fa-triangle-exclamation" : type === "danger" ? "fa-circle-xmark" : "fa-circle-info";
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

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const closeMobileNav = document.getElementById("closeMobileNav");
  if (mobileMenuBtn && mobileNav) mobileMenuBtn.addEventListener("click", () => mobileNav.classList.add("open"));
  if (closeMobileNav && mobileNav) closeMobileNav.addEventListener("click", () => mobileNav.classList.remove("open"));
  // Initialize UI & Components
  renderUserInfo();
  renderOrdersList("all");
  renderPrescriptionsList();
  renderAddressesList();
  renderWishlist();

  // Sync live Orders & Prescriptions from MongoDB
  async function syncDashboardFromAPI() {
    const emailQuery = state.user && state.user.email ? `?email=${encodeURIComponent(state.user.email)}` : "";
    const token = localStorage.getItem("medcare_token");
    try {
      const [ordRes, rxRes] = await Promise.all([
        fetch(`/api/orders${emailQuery}`),
        fetch(`/api/prescriptions${emailQuery}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
      ]);
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        if (Array.isArray(ordData.orders) && ordData.orders.length > 0) {
          state.orders = ordData.orders.map(o => ({
            id: o.orderId,
            date: o.date,
            status: o.status,
            statusText: o.statusText || o.status,
            paymentMethod: o.paymentMethod,
            deliveryAddress: o.deliveryAddress,
            deliveryEstimate: o.status === "delivered" ? `Delivered` : "Express Delivery (1-2 Days)",
            timelineIndex: o.timelineIndex != null ? o.timelineIndex : 1,
            items: o.items || [],
            subtotal: o.subtotal,
            delivery: o.delivery,
            taxes: o.taxes,
            total: o.total
          }));
          renderUserInfo();
          renderOrdersList("all");
        }
      }
      if (rxRes.ok) {
        const rxData = await rxRes.json();
        if (Array.isArray(rxData.prescriptions) && rxData.prescriptions.length > 0) {
          state.prescriptions = rxData.prescriptions.map(rx => ({
            mongoId: rx._id,
            id: rx.rxId || rx._id,
            rxId: rx.rxId || rx._id,
            patient_name: rx.patient_name || rx.patient || "Patient",
            doctor: rx.doctor || "Registered Physician",
            date: rx.uploaded_at
              ? new Date(rx.uploaded_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
              : (rx.date || "Recent"),
            status: rx.status || "Pending",
            notes_by_patient: rx.notes_by_patient || "",
            pharmacist_notes: rx.pharmacist_notes || "",
            prescribed_items: rx.prescribed_items || [],
            file_url: rx.file_url || rx.image || ""
          }));
          renderUserInfo();
          renderPrescriptionsList();
        }
      }
    } catch (e) {
      // Keep static fallback if offline
    }
  }
  syncDashboardFromAPI();

  // Check URL hash (#orders, #prescriptions, etc.)
  const hash = window.location.hash.replace("#", "");
  if (hash) {
    switchDashboardTab(hash);
  }
});
