// MedCare Online Pharmacy - Prescription Page Script

document.addEventListener("DOMContentLoaded", () => {
  // App State
  const state = {
    uploadedFiles: [],
    cart: JSON.parse(localStorage.getItem("medcare_cart")) || [],
    user: JSON.parse(localStorage.getItem("medcare_user")) || null
  };

  // DOM Elements
  const rxDropzone = document.getElementById("rxDropzone");
  const btnBrowseFiles = document.getElementById("btnBrowseFiles");
  const rxMultiFileInput = document.getElementById("rxMultiFileInput");
  const uploadedFilesContainer = document.getElementById("uploadedFilesContainer");
  const uploadedFilesGrid = document.getElementById("uploadedFilesGrid");
  const attachedFilesCount = document.getElementById("attachedFilesCount");

  const rxOrderForm = document.getElementById("rxOrderForm");
  const patientNameInput = document.getElementById("patientNameInput");
  const doctorNameInput = document.getElementById("doctorNameInput");
  const contactPhoneInput = document.getElementById("contactPhoneInput");
  const contactEmailInput = document.getElementById("contactEmailInput");
  const deliveryAddressInput = document.getElementById("deliveryAddressInput");
  const specialNotesInput = document.getElementById("specialNotesInput");
  const termsCheckInput = document.getElementById("termsCheckInput");
  const btnSubmitPrescription = document.getElementById("btnSubmitPrescription");

  const rxSuccessModal = document.getElementById("rxSuccessModal");
  const btnDismissSuccess = document.getElementById("btnDismissSuccess");
  const rxRefNumber = document.getElementById("rxRefNumber");
  const successPhoneDisp = document.getElementById("successPhoneDisp");

  const rxFaqAccordion = document.getElementById("rxFaqAccordion");

  // Shared Components
  const cartBtn = document.getElementById("cartBtn");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartCountBadges = document.querySelectorAll(".cart-count-badge");
  const userGreeting = document.getElementById("userGreeting");
  const loginBtn = document.getElementById("loginBtn");

  // Initialize
  initDropzone();
  initFormSubmission();
  renderFaqs();
  initSharedComponents();

  // ==========================================
  // 1. DRAG & DROP MULTI-FILE UPLOAD
  // ==========================================
  function initDropzone() {
    if (!rxDropzone || !rxMultiFileInput || !btnBrowseFiles) return;

    btnBrowseFiles.addEventListener("click", () => rxMultiFileInput.click());
    rxDropzone.addEventListener("click", (e) => {
      if (e.target !== btnBrowseFiles && !e.target.closest("button")) {
        rxMultiFileInput.click();
      }
    });

    rxDropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      rxDropzone.classList.add("dragover");
    });

    rxDropzone.addEventListener("dragleave", () => {
      rxDropzone.classList.remove("dragover");
    });

    rxDropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      rxDropzone.classList.remove("dragover");
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    });

    rxMultiFileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(Array.from(e.target.files));
      }
    });
  }

  function handleFiles(files) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    let addedCount = 0;

    files.forEach(file => {
      if (!allowed.includes(file.type)) {
        showToast(`"${file.name}" is not a supported file type (Use JPG, PNG, PDF).`, "danger");
        return;
      }

      if (file.size > maxSizeBytes) {
        showToast(`"${file.name}" exceeds the 5MB file size limit.`, "danger");
        return;
      }

      // Check if already in list
      const exists = state.uploadedFiles.some(f => f.name === file.name && f.size === file.size);
      if (!exists) {
        state.uploadedFiles.push(file);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      showToast(`Attached ${addedCount} prescription document${addedCount > 1 ? 's' : ''}!`, "success");
      renderUploadedFiles();
    }
  }

  function renderUploadedFiles() {
    if (!uploadedFilesContainer || !uploadedFilesGrid || !attachedFilesCount) return;

    const count = state.uploadedFiles.length;
    attachedFilesCount.textContent = count;

    if (count === 0) {
      uploadedFilesContainer.style.display = "none";
      uploadedFilesGrid.innerHTML = "";
      return;
    }

    uploadedFilesContainer.style.display = "block";
    uploadedFilesGrid.innerHTML = state.uploadedFiles.map((file, index) => {
      const isPdf = file.type === "application/pdf";
      const icon = isPdf ? "fa-file-pdf" : "fa-file-image";
      const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + " MB";

      return `
        <div class="rx-file-chip" data-index="${index}">
          <div class="file-icon-box">
            <i class="fa-solid ${icon}"></i>
          </div>
          <div class="file-info-text">
            <span class="file-name-truncate" title="${file.name}">${file.name}</span>
            <span class="file-size-sub">${sizeStr}</span>
          </div>
          <button type="button" class="btn-remove-file" data-index="${index}" title="Remove file">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `;
    }).join("");

    uploadedFilesGrid.querySelectorAll(".btn-remove-file").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-index"), 10);
        state.uploadedFiles.splice(idx, 1);
        renderUploadedFiles();
        showToast("File removed", "info");
      });
    });
  }

  // ==========================================
  // 1b. MEDICINE SELECTOR FOR PRESCRIPTION
  // ==========================================
  state.selectedMedicines = [];
  state.catalogMedicines = (typeof PHARMACY_DATA !== "undefined" && PHARMACY_DATA.allProducts) ? [...PHARMACY_DATA.allProducts] : [];

  const rxMedSearch = document.getElementById("rxMedicineSearchInput");
  const rxMedSuggestions = document.getElementById("rxMedicineSuggestions");
  const rxSelectedList = document.getElementById("rxSelectedMedicinesList");

  fetch("/api/medicines")
    .then(r => (r.ok ? r.json() : null))
    .then(d => { if (d && Array.isArray(d.medicines) && d.medicines.length) state.catalogMedicines = d.medicines; })
    .catch(() => {});

  function renderSelectedRxMedicines() {
    if (!rxSelectedList) return;
    if (state.selectedMedicines.length === 0) {
      rxSelectedList.innerHTML = "";
      return;
    }
    rxSelectedList.innerHTML = state.selectedMedicines.map((m, idx) => `
      <div class="d-flex align-items-center justify-content-between p-2 border rounded bg-light">
        <div class="d-flex align-items-center gap-2">
          <img src="${m.image}" alt="${m.name}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;">
          <div>
            <div class="fw-bold small text-dark">${m.name}</div>
            <div class="text-muted" style="font-size:0.75rem;">₹${m.price} • ${m.brand}</div>
          </div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button type="button" class="btn btn-sm btn-outline-secondary py-0 px-2 rx-qty-dec" data-idx="${idx}">-</button>
          <span class="fw-bold small">${m.quantity}</span>
          <button type="button" class="btn btn-sm btn-outline-secondary py-0 px-2 rx-qty-inc" data-idx="${idx}">+</button>
          <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2 rx-med-rem" data-idx="${idx}">&times;</button>
        </div>
      </div>
    `).join("");

    rxSelectedList.querySelectorAll(".rx-qty-dec").forEach(b => b.addEventListener("click", () => {
      const i = parseInt(b.dataset.idx, 10);
      if (state.selectedMedicines[i].quantity > 1) state.selectedMedicines[i].quantity--;
      else state.selectedMedicines.splice(i, 1);
      renderSelectedRxMedicines();
    }));
    rxSelectedList.querySelectorAll(".rx-qty-inc").forEach(b => b.addEventListener("click", () => {
      const i = parseInt(b.dataset.idx, 10);
      state.selectedMedicines[i].quantity++;
      renderSelectedRxMedicines();
    }));
    rxSelectedList.querySelectorAll(".rx-med-rem").forEach(b => b.addEventListener("click", () => {
      state.selectedMedicines.splice(parseInt(b.dataset.idx, 10), 1);
      renderSelectedRxMedicines();
    }));
  }

  if (rxMedSearch && rxMedSuggestions) {
    rxMedSearch.addEventListener("input", () => {
      const q = rxMedSearch.value.trim().toLowerCase();
      if (q.length < 2) {
        rxMedSuggestions.style.display = "none";
        return;
      }
      const matches = state.catalogMedicines.filter(m =>
        m.name.toLowerCase().includes(q) || (m.brand && m.brand.toLowerCase().includes(q))
      ).slice(0, 6);
      if (matches.length === 0) {
        rxMedSuggestions.style.display = "none";
        return;
      }
      rxMedSuggestions.innerHTML = matches.map(m => `
        <button type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center rx-suggest-item" data-id="${m.id}">
          <span><strong>${m.name}</strong> <small class="text-muted">(${m.brand})</small></span>
          <span class="badge bg-primary rounded-pill">₹${m.price}</span>
        </button>
      `).join("");
      rxMedSuggestions.style.display = "block";

      rxMedSuggestions.querySelectorAll(".rx-suggest-item").forEach(btn => {
        btn.addEventListener("click", () => {
          const med = state.catalogMedicines.find(x => x.id === btn.dataset.id);
          if (med) {
            const existing = state.selectedMedicines.find(x => x.id === med.id);
            if (existing) existing.quantity++;
            else state.selectedMedicines.push({ id: med.id, name: med.name, brand: med.brand, price: med.price, mrp: med.mrp, quantity: 1, image: med.image });
            renderSelectedRxMedicines();
          }
          rxMedSearch.value = "";
          rxMedSuggestions.style.display = "none";
        });
      });
    });
  }

  // ==========================================
  // 2. PRESCRIPTION DETAILS FORM SUBMISSION
  // ==========================================
  function initFormSubmission() {
    if (!rxOrderForm) return;

    rxOrderForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Check if files are attached
      if (state.uploadedFiles.length === 0) {
        showToast("Please upload at least one prescription document (photo or PDF).", "warning");
        if (rxDropzone) rxDropzone.scrollIntoView({ behavior: "smooth" });
        return;
      }

      const patientName = patientNameInput.value.trim();
      const doctorName = doctorNameInput.value.trim();
      const phone = contactPhoneInput.value.trim();
      const email = contactEmailInput.value.trim();
      const address = deliveryAddressInput.value.trim();
      const terms = termsCheckInput.checked;

      if (!patientName || !doctorName || !phone || !email || !address) {
        showToast("Please fill in all mandatory fields.", "warning");
        return;
      }

      if (phone.length !== 10 || isNaN(phone)) {
        showToast("Please enter a valid 10-digit mobile number.", "warning");
        return;
      }

      if (!terms) {
        showToast("Please confirm agreement with Terms & Conditions.", "warning");
        return;
      }

      // Show Loading State
      const originalBtnText = btnSubmitPrescription.innerHTML;
      btnSubmitPrescription.disabled = true;
      btnSubmitPrescription.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i> Encrypting &amp; Submitting to Pharmacist Desk...`;

      const notesEl = document.getElementById("specialNotesInput") || document.getElementById("rxNotesInput");
      const notes = notesEl ? notesEl.value.trim() : "";
      const firstFile = state.uploadedFiles[0];
      const rxId = `#RX-${Math.floor(10000 + Math.random() * 90000)}`;
      const autoAddCart = document.getElementById("rxAutoAddToCart")?.checked;

      const readPreview = (file) => new Promise((resolve) => {
        if (!file || !file.type || !file.type.startsWith("image/")) {
          return resolve("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80");
        }
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = () => resolve("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80");
        reader.readAsDataURL(file);
      });

      (async () => {
        try {
          const previewImage = await readPreview(firstFile);
          const medNamesStr = state.selectedMedicines.length > 0
            ? state.selectedMedicines.map(m => `${m.name} (${m.quantity}x)`).join(", ")
            : (notes || (firstFile ? firstFile.name : "Uploaded Prescription"));

          const res = await fetch("/api/prescriptions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rxId,
              userEmail: email || (state.user && state.user.email) || "",
              patient: patientName,
              doctor: doctorName,
              phone,
              address,
              notes,
              medicines: medNamesStr,
              assignedMedicines: state.selectedMedicines,
              fileName: firstFile ? firstFile.name : "prescription.jpg",
              image: previewImage
            })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to upload prescription");

          const savedId = (data.prescription && data.prescription.rxId) || rxId;
          localStorage.setItem("medcare_active_rx", savedId);

          // Add selected medicines directly into cart if requested
          let addedCount = 0;
          if (autoAddCart && state.selectedMedicines.length > 0) {
            state.selectedMedicines.forEach(med => {
              const existing = state.cart.find(c => c.id === med.id);
              if (existing) existing.quantity += med.quantity;
              else state.cart.push({ ...med });
              addedCount += med.quantity;
            });
            localStorage.setItem("medcare_cart", JSON.stringify(state.cart));
            updateCartBadge();
          }

          if (rxRefNumber) rxRefNumber.textContent = savedId.replace("#RX-", "");
          if (successPhoneDisp) successPhoneDisp.textContent = `+91 ${phone}`;

          if (rxSuccessModal) {
            rxSuccessModal.classList.add("open");
            document.body.style.overflow = "hidden";
          }

          rxOrderForm.reset();
          state.uploadedFiles = [];
          state.selectedMedicines = [];
          renderUploadedFiles();
          renderSelectedRxMedicines();

          showToast(
            addedCount > 0
              ? `Prescription saved & ${addedCount} medicine(s) added to your Cart!`
              : "Prescription uploaded & saved to database!",
            "success"
          );
        } catch (err) {
          showToast(err.message || "Could not submit prescription.", "danger");
        } finally {
          btnSubmitPrescription.disabled = false;
          btnSubmitPrescription.innerHTML = originalBtnText;
        }
      })();
    });

    if (btnDismissSuccess && rxSuccessModal) {
      btnDismissSuccess.addEventListener("click", () => {
        rxSuccessModal.classList.remove("open");
        document.body.style.overflow = "";
      });
    }
  }

  // ==========================================
  // 3. ACCORDION FAQ SECTION
  // ==========================================
  function renderFaqs() {
    if (!rxFaqAccordion) return;
    const faqs = PHARMACY_DATA.prescriptionFaqs || [];

    rxFaqAccordion.innerHTML = faqs.map((faq, idx) => `
      <div class="faq-item-card ${idx === 0 ? 'open' : ''}">
        <button type="button" class="faq-question-btn" data-faq="${idx}">
          <span>${faq.q}</span>
          <i class="fa-solid fa-chevron-down faq-icon-toggle"></i>
        </button>
        <div class="faq-answer-panel" style="${idx === 0 ? 'max-height: 200px;' : 'max-height: 0;'}">
          <div class="faq-answer-body">
            ${faq.a}
          </div>
        </div>
      </div>
    `).join("");

    rxFaqAccordion.querySelectorAll(".faq-question-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".faq-item-card");
        const panel = card.querySelector(".faq-answer-panel");
        const isOpen = card.classList.contains("open");

        // Close other items
        rxFaqAccordion.querySelectorAll(".faq-item-card").forEach(c => {
          c.classList.remove("open");
          const p = c.querySelector(".faq-answer-panel");
          if (p) p.style.maxHeight = "0";
        });

        if (!isOpen) {
          card.classList.add("open");
          panel.style.maxHeight = panel.scrollHeight + 30 + "px";
        }
      });
    });
  }

  // ==========================================
  // 4. SHARED COMPONENTS (Cart, Auth, Toast)
  // ==========================================
  function initSharedComponents() {
    updateCartBadge();
    updateAuthUI();

    if (cartBtn && cartDrawer && cartOverlay) {
      cartBtn.addEventListener("click", () => {
        cartDrawer.classList.add("open");
        cartOverlay.classList.add("open");
        document.body.style.overflow = "hidden";
      });

      closeCartBtn.addEventListener("click", closeCart);
      cartOverlay.addEventListener("click", closeCart);
    }

    function closeCart() {
      cartDrawer.classList.remove("open");
      cartOverlay.classList.remove("open");
      document.body.style.overflow = "";
    }

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

  function updateCartBadge() {
    const total = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadges.forEach(b => {
      b.textContent = total;
      b.style.display = total > 0 ? "inline-flex" : "none";
    });

    const cartList = document.getElementById("cartItemsList");
    const cartTotal = document.getElementById("cartTotal");
    if (cartList && cartTotal) {
      if (state.cart.length === 0) {
        cartList.innerHTML = `<div class="p-4 text-center text-muted">Your cart is empty.</div>`;
        cartTotal.textContent = "₹0";
      } else {
        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartList.innerHTML = state.cart.map(i => `
          <div class="cart-item-row">
            <img src="${i.image}" class="cart-item-thumb" alt="${i.name}">
            <div class="cart-item-details">
              <h6>${i.name}</h6>
              <span>₹${i.price * i.quantity} (${i.quantity}x)</span>
            </div>
          </div>
        `).join("");
        cartTotal.textContent = `₹${subtotal}`;
      }
    }
  }

  function updateAuthUI() {
    if (!userGreeting) return;
    const loginBtn = document.getElementById("loginBtn");
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
