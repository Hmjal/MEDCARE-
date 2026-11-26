// MedCare Online Pharmacy - Product Detail Script

document.addEventListener("DOMContentLoaded", () => {
  // App State
  const state = {
    cart: JSON.parse(localStorage.getItem("medcare_cart")) || [],
    wishlist: JSON.parse(localStorage.getItem("medcare_wishlist")) || [],
    recentlyViewed: JSON.parse(localStorage.getItem("medcare_recently_viewed")) || [],
    user: JSON.parse(localStorage.getItem("medcare_user")) || null,
    currentProduct: null,
    currentImageIndex: 0,
    quantity: 1
  };

  // URL Query Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id") || "prod-1";
  state.currentProduct = PHARMACY_DATA.getProductById(productId);

  // Update Recently Viewed List in LocalStorage
  updateRecentlyViewed(state.currentProduct.id);

  // Initialize UI
  renderProductDetails();
  initImageGalleryAndZoom();
  initQuantityAndCta();
  initPincodeChecker();
  initTabs();
  initReviewForm();
  initSocialShare();
  renderRelatedProducts();
  renderRecentlyViewed();
  initSharedComponents();

  // ==========================================
  // 1. RENDER PRODUCT DETAILS
  // ==========================================
  function renderProductDetails() {
    const prod = state.currentProduct;
    if (!prod) return;

    // Document Title
    document.title = `${prod.name} | MedCare Online Pharmacy`;

    // Breadcrumb
    const breadcrumbCategoryLink = document.getElementById("breadcrumbCategoryLink");
    const breadcrumbProductName = document.getElementById("breadcrumbProductName");
    if (breadcrumbCategoryLink) {
      breadcrumbCategoryLink.textContent = prod.category;
      breadcrumbCategoryLink.href = `shop.html?category=${encodeURIComponent(prod.category)}`;
    }
    if (breadcrumbProductName) breadcrumbProductName.textContent = prod.name;

    // Product Title & Meta
    const prodTitle = document.getElementById("prodTitle");
    const prodCategoryBadge = document.getElementById("prodCategoryBadge");
    const prodBrandLink = document.getElementById("prodBrandLink");
    if (prodTitle) prodTitle.textContent = prod.name;
    if (prodCategoryBadge) prodCategoryBadge.textContent = prod.category;
    if (prodBrandLink) {
      prodBrandLink.textContent = prod.brand;
      prodBrandLink.href = `shop.html?brand=${encodeURIComponent(prod.brand)}`;
    }

    // Rating & Review counts
    const prodStars = document.getElementById("prodStars");
    const prodRatingVal = document.getElementById("prodRatingVal");
    const prodReviewsCount = document.getElementById("prodReviewsCount");
    const tabReviewsCountBadge = document.getElementById("tabReviewsCountBadge");

    if (prodStars) prodStars.innerHTML = renderStars(prod.rating);
    if (prodRatingVal) prodRatingVal.textContent = prod.rating;
    if (prodReviewsCount) prodReviewsCount.textContent = prod.reviewsCount.toLocaleString();
    if (tabReviewsCountBadge) tabReviewsCountBadge.textContent = prod.reviewsCount;

    // Prescription Warning
    const rxWarningBanner = document.getElementById("rxWarningBanner");
    const rxImageStamp = document.getElementById("rxImageStamp");
    if (prod.requiresPrescription) {
      if (rxWarningBanner) rxWarningBanner.style.display = "flex";
      if (rxImageStamp) rxImageStamp.style.display = "block";
    }

    // Pricing
    const sellingPrice = document.getElementById("prodSellingPrice");
    const mrpPrice = document.getElementById("prodMrpPrice");
    const discountPill = document.getElementById("prodDiscountPill");
    const savingsText = document.getElementById("prodSavingsText");

    const savings = prod.mrp - prod.price;
    if (sellingPrice) sellingPrice.textContent = `₹${prod.price}`;
    if (mrpPrice) mrpPrice.textContent = `MRP ₹${prod.mrp}`;
    if (discountPill) discountPill.textContent = `${prod.discount}% OFF`;
    if (savingsText) {
      savingsText.innerHTML = `You Save: <strong>₹${savings} (${prod.discount}% off)</strong>`;
    }

    // Variants & Stock Details
    const prodPackSize = document.getElementById("prodPackSize");
    const prodStockStatus = document.getElementById("prodStockStatus");
    const prodManufacturer = document.getElementById("prodManufacturer");

    if (prodPackSize) prodPackSize.textContent = prod.packSize || "Standard Packaging";
    if (prodManufacturer) prodManufacturer.textContent = prod.manufacturer || prod.brand;
    if (prodStockStatus) {
      if (prod.inStock) {
        prodStockStatus.innerHTML = `<span class="text-success"><i class="fa-solid fa-circle-check"></i> In Stock (Immediate Dispatch)</span>`;
      } else {
        prodStockStatus.innerHTML = `<span class="text-danger"><i class="fa-solid fa-circle-xmark"></i> Out of Stock</span>`;
        const addBtn = document.getElementById("btnAddToCart");
        const buyBtn = document.getElementById("btnBuyNow");
        if (addBtn) addBtn.disabled = true;
        if (buyBtn) buyBtn.disabled = true;
      }
    }

    // Wishlist Button State
    const btnDetailWishlist = document.getElementById("btnDetailWishlist");
    if (btnDetailWishlist) {
      const isWishlisted = state.wishlist.includes(prod.id);
      btnDetailWishlist.classList.toggle("active", isWishlisted);
      btnDetailWishlist.innerHTML = `<i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>`;
    }

    // Populate Tab 1: Description & Benefits
    const tabDescText = document.getElementById("tabDescText");
    const tabBenefitsList = document.getElementById("tabBenefitsList");
    const tabCompositionBox = document.getElementById("tabCompositionBox");

    if (tabDescText) tabDescText.textContent = prod.description;
    if (tabBenefitsList && prod.keyBenefits) {
      tabBenefitsList.innerHTML = prod.keyBenefits.map(b => `
        <li><i class="fa-solid fa-circle-check"></i> <span>${b}</span></li>
      `).join("");
    }
    if (tabCompositionBox) {
      tabCompositionBox.innerHTML = `<strong>Active Formula:</strong> ${prod.composition || 'Active Therapeutic Matrix'} • Pack: ${prod.packSize}`;
    }

    // Populate Tab 2: How to Use
    const tabDirectionUse = document.getElementById("tabDirectionUse");
    const tabDosageText = document.getElementById("tabDosageText");
    const tabStorageText = document.getElementById("tabStorageText");

    if (tabDirectionUse) tabDirectionUse.textContent = prod.howToUse.direction;
    if (tabDosageText) tabDosageText.textContent = prod.howToUse.dosage;
    if (tabStorageText) tabStorageText.textContent = prod.howToUse.storage;

    // Populate Tab 3: Precautions & Side Effects
    const tabSideEffectsList = document.getElementById("tabSideEffectsList");
    const tabPrecautionsList = document.getElementById("tabPrecautionsList");
    const tabInteractionsList = document.getElementById("tabInteractionsList");
    const tabWarningBox = document.getElementById("tabWarningBox");

    if (tabSideEffectsList && prod.safety.sideEffects) {
      tabSideEffectsList.innerHTML = prod.safety.sideEffects.map(s => `
        <li><i class="fa-solid fa-circle-xmark text-danger mt-1"></i> <span>${s}</span></li>
      `).join("");
    }
    if (tabPrecautionsList && prod.safety.precautions) {
      tabPrecautionsList.innerHTML = prod.safety.precautions.map(p => `
        <li><i class="fa-solid fa-triangle-exclamation text-warning mt-1"></i> <span>${p}</span></li>
      `).join("");
    }
    if (tabInteractionsList && prod.safety.interactions) {
      tabInteractionsList.innerHTML = prod.safety.interactions.map(i => `
        <li><i class="fa-solid fa-shield-virus text-info mt-1"></i> <span>${i}</span></li>
      `).join("");
    }
    if (tabWarningBox) tabWarningBox.textContent = prod.safety.warnings;

    // Populate Tab 4: Reviews
    const summaryScore = document.getElementById("summaryScore");
    const summaryStars = document.getElementById("summaryStars");
    const summaryReviewsTotal = document.getElementById("summaryReviewsTotal");

    if (summaryScore) summaryScore.textContent = prod.rating;
    if (summaryStars) summaryStars.innerHTML = renderStars(prod.rating);
    if (summaryReviewsTotal) summaryReviewsTotal.textContent = prod.reviewsCount.toLocaleString();

    renderReviewsList(prod.reviewsList);
  }

  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= full) html += '<i class="fa-solid fa-star text-warning"></i>';
      else if (i === full + 1 && half) html += '<i class="fa-solid fa-star-half-stroke text-warning"></i>';
      else html += '<i class="fa-regular fa-star text-muted"></i>';
    }
    return html;
  }

  // ==========================================
  // 2. IMAGE GALLERY, HOVER ZOOM & LIGHTBOX
  // ==========================================
  function initImageGalleryAndZoom() {
    const mainImg = document.getElementById("mainProductImage");
    const galleryRow = document.getElementById("thumbnailGallery");
    const mainWrapper = document.getElementById("mainImageWrapper");
    const zoomLens = document.getElementById("zoomLens");
    const zoomResultWindow = document.getElementById("zoomResultWindow");
    const btnZoomModal = document.getElementById("btnZoomModal");
    const imageZoomModal = document.getElementById("imageZoomModal");
    const closeZoomModalBtn = document.getElementById("closeZoomModalBtn");
    const lightboxZoomImg = document.getElementById("lightboxZoomImg");

    const images = state.currentProduct.galleryImages || [state.currentProduct.image];

    // Set initial main image
    if (mainImg) mainImg.src = images[0];
    if (lightboxZoomImg) lightboxZoomImg.src = images[0];

    // Populate Thumbnails (4-5 images)
    if (galleryRow) {
      galleryRow.innerHTML = images.map((imgSrc, idx) => `
        <div class="thumb-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
          <img src="${imgSrc}" alt="Thumbnail ${idx + 1}" loading="lazy">
        </div>
      `).join("");

      galleryRow.querySelectorAll(".thumb-item").forEach(thumb => {
        thumb.addEventListener("click", () => {
          const idx = parseInt(thumb.getAttribute("data-index"), 10);
          switchMainImage(idx);
        });
      });
    }

    function switchMainImage(index) {
      state.currentImageIndex = index;
      if (mainImg) mainImg.src = images[index];
      if (lightboxZoomImg) lightboxZoomImg.src = images[index];

      galleryRow.querySelectorAll(".thumb-item").forEach((thumb, i) => {
        thumb.classList.toggle("active", i === index);
      });
    }

    // Hover Zoom Magnifier Effect
    if (mainWrapper && zoomLens && zoomResultWindow && mainImg) {
      mainWrapper.addEventListener("mouseenter", () => {
        if (window.innerWidth > 992) {
          zoomLens.style.display = "block";
          zoomResultWindow.style.display = "block";
          zoomResultWindow.style.backgroundImage = `url('${mainImg.src}')`;
          zoomResultWindow.style.backgroundSize = `${mainImg.width * 2.2}px ${mainImg.height * 2.2}px`;
        }
      });

      mainWrapper.addEventListener("mouseleave", () => {
        zoomLens.style.display = "none";
        zoomResultWindow.style.display = "none";
      });

      mainWrapper.addEventListener("mousemove", (e) => {
        if (window.innerWidth <= 992) return;

        const rect = mainWrapper.getBoundingClientRect();
        let x = e.clientX - rect.left - (zoomLens.offsetWidth / 2);
        let y = e.clientY - rect.top - (zoomLens.offsetHeight / 2);

        // Prevent lens from going outside boundaries
        if (x > mainWrapper.offsetWidth - zoomLens.offsetWidth) x = mainWrapper.offsetWidth - zoomLens.offsetWidth;
        if (x < 0) x = 0;
        if (y > mainWrapper.offsetHeight - zoomLens.offsetHeight) y = mainWrapper.offsetHeight - zoomLens.offsetHeight;
        if (y < 0) y = 0;

        zoomLens.style.left = `${x}px`;
        zoomLens.style.top = `${y}px`;

        // Position zoom result
        const ratioX = zoomResultWindow.offsetWidth / zoomLens.offsetWidth;
        const ratioY = zoomResultWindow.offsetHeight / zoomLens.offsetHeight;
        zoomResultWindow.style.backgroundPosition = `-${x * ratioX}px -${y * ratioY}px`;
      });
    }

    // Lightbox Click to Zoom
    if (btnZoomModal && imageZoomModal) {
      btnZoomModal.addEventListener("click", () => {
        imageZoomModal.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    }

    if (closeZoomModalBtn && imageZoomModal) {
      closeZoomModalBtn.addEventListener("click", () => {
        imageZoomModal.classList.remove("open");
        document.body.style.overflow = "";
      });
    }

    if (imageZoomModal) {
      imageZoomModal.addEventListener("click", (e) => {
        if (e.target === imageZoomModal) {
          imageZoomModal.classList.remove("open");
          document.body.style.overflow = "";
        }
      });
    }
  }

  // ==========================================
  // 3. QUANTITY SELECTOR & CTA BUTTONS
  // ==========================================
  function initQuantityAndCta() {
    const qtyMinus = document.getElementById("qtyMinusBtn");
    const qtyPlus = document.getElementById("qtyPlusBtn");
    const qtyInput = document.getElementById("detailQtyInput");
    const btnAddToCart = document.getElementById("btnAddToCart");
    const btnBuyNow = document.getElementById("btnBuyNow");
    const btnDetailWishlist = document.getElementById("btnDetailWishlist");

    if (qtyMinus && qtyPlus && qtyInput) {
      qtyMinus.addEventListener("click", () => {
        if (state.quantity > 1) {
          state.quantity--;
          qtyInput.value = state.quantity;
        }
      });

      qtyPlus.addEventListener("click", () => {
        if (state.quantity < 50) {
          state.quantity++;
          qtyInput.value = state.quantity;
        }
      });

      qtyInput.addEventListener("change", () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val < 1) val = 1;
        if (val > 50) val = 50;
        state.quantity = val;
        qtyInput.value = val;
      });
    }

    if (btnAddToCart) {
      btnAddToCart.addEventListener("click", () => {
        addToCart(state.currentProduct.id, state.quantity);
      });
    }

    if (btnBuyNow) {
      btnBuyNow.addEventListener("click", () => {
        addToCart(state.currentProduct.id, state.quantity);
        setTimeout(() => {
          const checkoutBtn = document.getElementById("checkoutBtn");
          if (checkoutBtn) checkoutBtn.click();
        }, 400);
      });
    }

    if (btnDetailWishlist) {
      btnDetailWishlist.addEventListener("click", () => {
        toggleWishlist(state.currentProduct.id, btnDetailWishlist);
      });
    }
  }

  // ==========================================
  // 4. DELIVERY PINCODE CHECKER
  // ==========================================
  function initPincodeChecker() {
    const btnCheckPincode = document.getElementById("btnCheckPincode");
    const pincodeInput = document.getElementById("pincodeInput");
    const pincodeStatusMsg = document.getElementById("pincodeStatusMsg");

    if (!btnCheckPincode || !pincodeInput || !pincodeStatusMsg) return;

    btnCheckPincode.addEventListener("click", () => {
      const pin = pincodeInput.value.trim();
      if (!pin || pin.length !== 6 || isNaN(pin)) {
        pincodeStatusMsg.innerHTML = `<span class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> Please enter a valid 6-digit postal code.</span>`;
        return;
      }

      pincodeStatusMsg.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-primary"></i> Checking delivery slots for ${pin}...`;

      setTimeout(() => {
        pincodeStatusMsg.innerHTML = `
          <div class="mt-1">
            <span class="text-success fw-bold"><i class="fa-solid fa-circle-check"></i> Delivery Available to ${pin}</span>
            <div class="small text-muted mt-1">
              • <strong>Express 2-Hour Delivery</strong> available for this area<br>
              • Standard Delivery: <strong>Tomorrow by 3:00 PM</strong> (FREE on orders above ₹500)<br>
              • Cash on Delivery supported
            </div>
          </div>
        `;
        showToast(`Delivery confirmed for pincode ${pin}!`, "success");
      }, 700);
    });
  }

  // ==========================================
  // 5. PRODUCT TABS NAVIGATION
  // ==========================================
  function initTabs() {
    const tabBtns = document.querySelectorAll(".prod-tab-btn");
    const tabPanels = document.querySelectorAll(".prod-tab-panel");

    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-tab");

        tabBtns.forEach(b => b.classList.toggle("active", b === btn));
        tabPanels.forEach(p => p.classList.toggle("active", p.id === targetId));
      });
    });

    // Jump links from rating section
    const jumpToReviewsLink = document.getElementById("jumpToReviewsLink");
    const jumpToWriteReview = document.getElementById("jumpToWriteReview");
    const tabReviewsBtn = document.getElementById("tabReviewsBtn");

    if (jumpToReviewsLink && tabReviewsBtn) {
      jumpToReviewsLink.addEventListener("click", (e) => {
        e.preventDefault();
        tabReviewsBtn.click();
        document.getElementById("productTabs").scrollIntoView({ behavior: "smooth" });
      });
    }

    if (jumpToWriteReview && tabReviewsBtn) {
      jumpToWriteReview.addEventListener("click", (e) => {
        e.preventDefault();
        tabReviewsBtn.click();
        const writeCard = document.querySelector(".write-review-card");
        if (writeCard) writeCard.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  // ==========================================
  // 6. WRITE A REVIEW FORM
  // ==========================================
  function renderReviewsList(reviews) {
    const list = document.getElementById("individualReviewsList");
    if (!list || !reviews) return;

    list.innerHTML = reviews.map(rev => `
      <div class="review-item-card">
        <div class="review-item-header">
          <span class="review-user-name">
            <i class="fa-regular fa-circle-user text-primary"></i> ${rev.name}
            ${rev.verified ? '<span class="review-verified-pill"><i class="fa-solid fa-circle-check"></i> Verified Purchase</span>' : ''}
          </span>
          <span class="review-date">${rev.date}</span>
        </div>
        <div class="product-rating mb-2">
          ${renderStars(rev.rating)}
        </div>
        <h5 class="review-title">${rev.title || 'Verified Clinical Review'}</h5>
        <p class="review-text">${rev.comment}</p>
      </div>
    `).join("");
  }

  function initReviewForm() {
    const form = document.getElementById("writeReviewForm");
    if (!form) return;

    // Fetch real reviews from MongoDB for this product
    fetch(`/api/reviews/${encodeURIComponent(state.currentProduct.id)}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
          const existing = state.currentProduct.reviewsList || [];
          state.currentProduct.reviewsList = [...data.reviews, ...existing];
          renderReviewsList(state.currentProduct.reviewsList);
        }
      })
      .catch(() => {});

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("reviewerName").value.trim();
      const rating = parseInt(document.getElementById("reviewerRating").value, 10) || 5;
      const title = document.getElementById("reviewerTitle").value.trim();
      const comment = document.getElementById("reviewerComment").value.trim();

      if (!name || !comment) {
        showToast("Please enter your name and review comment.", "warning");
        return;
      }

      try {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            medicineId: state.currentProduct.id,
            userEmail: state.user && state.user.email ? state.user.email : "",
            name,
            rating,
            title: title || "Customer Feedback",
            comment
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not post review");

        state.currentProduct.reviewsList = state.currentProduct.reviewsList || [];
        state.currentProduct.reviewsList.unshift(data.review);
        if (data.medicine) {
          state.currentProduct.rating = data.medicine.rating;
          state.currentProduct.reviewsCount = data.medicine.reviewsCount;
          renderProductDetails();
        }
        renderReviewsList(state.currentProduct.reviewsList);
        form.reset();
        showToast("Thank you! Your review has been saved to MongoDB.", "success");
      } catch (err) {
        showToast(err.message || "Failed to post review.", "danger");
      }
    });
  }

  // ==========================================
  // 7. SOCIAL SHARE BUTTONS
  // ==========================================
  function initSocialShare() {
    const shareWa = document.getElementById("shareWhatsapp");
    const shareFb = document.getElementById("shareFacebook");
    const shareTw = document.getElementById("shareTwitter");
    const shareCopy = document.getElementById("shareCopyLink");

    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(`${state.currentProduct.name} on MedCare Pharmacy`);

    if (shareWa) {
      shareWa.addEventListener("click", () => {
        window.open(`https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`, "_blank");
      });
    }

    if (shareFb) {
      shareFb.addEventListener("click", () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`, "_blank");
      });
    }

    if (shareTw) {
      shareTw.addEventListener("click", () => {
        window.open(`https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`, "_blank");
      });
    }

    if (shareCopy) {
      shareCopy.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast("Product link copied to clipboard!", "success");
        }).catch(() => {
          showToast("Link: " + window.location.href, "info");
        });
      });
    }
  }

  // ==========================================
  // 8. RELATED & RECENTLY VIEWED PRODUCTS
  // ==========================================
  function renderRelatedProducts() {
    const container = document.getElementById("relatedProductsContainer");
    if (!container) return;

    // Filter products from same category or complementary
    const related = PHARMACY_DATA.allProducts
      .filter(p => p.id !== state.currentProduct.id && (p.category === state.currentProduct.category || p.rating >= 4.7))
      .slice(0, 5);

    container.innerHTML = related.map(prod => createScrollCardHtml(prod)).join("");

    // Horizontal arrow controls
    const scrollLeft = document.getElementById("scrollRelatedLeft");
    const scrollRight = document.getElementById("scrollRelatedRight");
    if (scrollLeft) scrollLeft.addEventListener("click", () => container.scrollBy({ left: -270, behavior: "smooth" }));
    if (scrollRight) scrollRight.addEventListener("click", () => container.scrollBy({ left: 270, behavior: "smooth" }));

    attachScrollCardListeners(container);
  }

  function renderRecentlyViewed() {
    const container = document.getElementById("recentlyViewedContainer");
    if (!container) return;

    const list = state.recentlyViewed
      .filter(id => id !== state.currentProduct.id)
      .map(id => PHARMACY_DATA.allProducts.find(p => p.id === id))
      .filter(Boolean)
      .slice(0, 5);

    if (list.length === 0) {
      // Fallback to top rated
      const fallback = PHARMACY_DATA.allProducts.filter(p => p.id !== state.currentProduct.id).slice(0, 4);
      container.innerHTML = fallback.map(prod => createScrollCardHtml(prod)).join("");
    } else {
      container.innerHTML = list.map(prod => createScrollCardHtml(prod)).join("");
    }

    attachScrollCardListeners(container);
  }

  function createScrollCardHtml(prod) {
    return `
      <div class="shop-card scroll-card" data-id="${prod.id}">
        <div class="product-badge-group">
          ${prod.requiresPrescription ? '<span class="badge badge-rx"><i class="fa-solid fa-receipt"></i> Rx Req.</span>' : ''}
          <span class="badge badge-discount">${prod.discount}% OFF</span>
        </div>
        <div class="shop-card-media" style="height: 140px;">
          <img src="${prod.image}" alt="${prod.name}" class="shop-card-img" loading="lazy">
        </div>
        <div class="shop-card-body">
          <span class="product-brand">${prod.brand}</span>
          <h4 class="shop-card-title" title="${prod.name}">
            <a href="product.html?id=${prod.id}">${prod.name}</a>
          </h4>
          <div class="product-rating mb-2">
            ${renderStars(prod.rating)}
          </div>
          <div class="shop-card-pricing mb-2">
            <span class="price-main">₹${prod.price}</span>
            <span class="mrp-strike">₹${prod.mrp}</span>
          </div>
          <a href="product.html?id=${prod.id}" class="btn btn-outline-primary btn-sm w-100">
            View Medicine
          </a>
        </div>
      </div>
    `;
  }

  function attachScrollCardListeners(container) {
    // Navigate smoothly
  }

  function updateRecentlyViewed(id) {
    let list = state.recentlyViewed.filter(item => item !== id);
    list.unshift(id);
    if (list.length > 8) list = list.slice(0, 8);
    state.recentlyViewed = list;
    localStorage.setItem("medcare_recently_viewed", JSON.stringify(list));
  }

  // ==========================================
  // 9. SHARED CART & AUTH
  // ==========================================
  function initSharedComponents() {
    updateCartUI();
    updateAuthUI();

    const cartBtn = document.getElementById("cartBtn");
    const closeCartBtn = document.getElementById("closeCartBtn");
    const cartOverlay = document.getElementById("cartOverlay");

    if (cartBtn) cartBtn.addEventListener("click", openCartDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener("click", closeCartDrawer);

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        if (state.cart.length === 0) {
          showToast("Your cart is empty! Add medicines before checkout.", "warning");
          return;
        }
        window.location.href = "checkout.html";
      });
    }

    // Auth
    const loginBtn = document.getElementById("loginBtn");
    const mobileLoginBtn = document.getElementById("mobileLoginBtn");
    const closeAuthBtn = document.getElementById("closeAuthBtn");
    const authModal = document.getElementById("authModal");

    if (loginBtn) loginBtn.addEventListener("click", () => { window.location.href = "login.html"; });
    if (mobileLoginBtn) mobileLoginBtn.addEventListener("click", () => { window.location.href = "login.html"; });
    if (closeAuthBtn) closeAuthBtn.addEventListener("click", closeAuthModal);
    if (authModal) {
      authModal.addEventListener("click", (e) => {
        if (e.target === authModal) closeAuthModal();
      });
    }

    const authTabs = document.querySelectorAll(".auth-tab");
    authTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const t = tab.getAttribute("data-tab");
        authTabs.forEach(x => x.classList.toggle("active", x === tab));
        document.getElementById("loginForm").style.display = t === "login" ? "block" : "none";
        document.getElementById("registerForm").style.display = t === "register" ? "block" : "none";
      });
    });

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const name = email.split("@")[0];
        state.user = { name: name.charAt(0).toUpperCase() + name.slice(1), email };
        localStorage.setItem("medcare_user", JSON.stringify(state.user));
        updateAuthUI();
        closeAuthModal();
        showToast(`Welcome back, ${state.user.name}!`, "success");
      });
    }

    // Header Autocomplete
    const searchInput = document.getElementById("searchInput");
    const searchDropdown = document.getElementById("searchDropdown");
    if (searchInput && searchDropdown) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length < 2) {
          searchDropdown.classList.remove("show");
          return;
        }

        const matches = PHARMACY_DATA.allProducts.filter(p => 
          p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
          searchDropdown.innerHTML = `<div class="p-3 text-muted small">No medicines found.</div>`;
        } else {
          searchDropdown.innerHTML = matches.map(p => `
            <a href="product.html?id=${p.id}" class="search-prod-item">
              <img src="${p.image}" class="search-thumb" alt="${p.name}">
              <div class="search-item-info">
                <span class="search-item-name">${p.name}</span>
                <small class="search-item-brand">${p.brand} • ${p.category}</small>
              </div>
              <span class="search-item-price">₹${p.price}</span>
            </a>
          `).join("");
        }
        searchDropdown.classList.add("show");
      });

      document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
          searchDropdown.classList.remove("show");
        }
      });
    }

    // Mobile nav
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileNav = document.getElementById("mobileNav");
    const closeMobileNav = document.getElementById("closeMobileNav");
    if (mobileMenuBtn && mobileNav) mobileMenuBtn.addEventListener("click", () => mobileNav.classList.add("open"));
    if (closeMobileNav && mobileNav) closeMobileNav.addEventListener("click", () => mobileNav.classList.remove("open"));
  }

  function addToCart(productId, qty = 1) {
    const product = PHARMACY_DATA.allProducts.find(p => p.id === productId);
    if (!product) return;

    const existing = state.cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += qty;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        mrp: product.mrp,
        image: product.image,
        requiresPrescription: product.requiresPrescription,
        quantity: qty
      });
    }

    saveCart();
    updateCartUI();
    showToast(`Added ${qty}x "${product.name.substring(0, 22)}..." to cart`, "success");
    openCartDrawer();
  }

  function toggleWishlist(productId, btnEl) {
    const index = state.wishlist.indexOf(productId);
    if (index > -1) {
      state.wishlist.splice(index, 1);
      btnEl.classList.remove("active");
      btnEl.innerHTML = '<i class="fa-regular fa-heart"></i>';
      showToast("Removed from wishlist", "info");
    } else {
      state.wishlist.push(productId);
      btnEl.classList.add("active");
      btnEl.innerHTML = '<i class="fa-solid fa-heart"></i>';
      showToast("Saved to wishlist!", "success");
    }
    localStorage.setItem("medcare_wishlist", JSON.stringify(state.wishlist));
  }

  function saveCart() {
    localStorage.setItem("medcare_cart", JSON.stringify(state.cart));
  }

  function updateCartUI() {
    const countBadges = document.querySelectorAll(".cart-count-badge");
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    countBadges.forEach(b => {
      b.textContent = totalCount;
      b.style.display = totalCount > 0 ? "inline-flex" : "none";
    });

    const cartList = document.getElementById("cartItemsList");
    if (!cartList) return;

    if (state.cart.length === 0) {
      cartList.innerHTML = `
        <div class="empty-cart-view">
          <i class="fa-solid fa-basket-shopping empty-cart-icon"></i>
          <h4>Your cart is empty</h4>
          <p>Explore genuine medicines and wellness essentials.</p>
        </div>
      `;
      document.getElementById("cartSubtotal").textContent = "₹0";
      document.getElementById("cartTotal").textContent = "₹0";
      document.getElementById("freeShippingBar").style.width = "0%";
      return;
    }

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartList.innerHTML = state.cart.map(item => `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
        <div class="cart-item-details">
          <div class="cart-item-top">
            <h5 class="cart-item-title">${item.name}</h5>
            <button class="btn-remove-item" onclick="window.medCareRemoveItem('${item.id}')"><i class="fa-solid fa-trash-can"></i></button>
          </div>
          <span class="cart-item-brand">${item.brand}</span>
          <div class="cart-item-bottom">
            <span class="cart-unit-price">₹${item.price * item.quantity}</span>
            <span class="badge bg-light text-muted">Qty: ${item.quantity}</span>
          </div>
        </div>
      </div>
    `).join("");

    document.getElementById("cartSubtotal").textContent = `₹${subtotal}`;
    document.getElementById("cartTotal").textContent = `₹${subtotal}`;

    const threshold = 500;
    const bar = document.getElementById("freeShippingBar");
    const text = document.getElementById("freeShippingText");
    if (subtotal >= threshold) {
      bar.style.width = "100%";
      text.innerHTML = `<span class="text-success"><i class="fa-solid fa-circle-check"></i> Yay! FREE Delivery unlocked!</span>`;
    } else {
      bar.style.width = `${Math.round((subtotal / threshold) * 100)}%`;
      text.innerHTML = `Add <strong>₹${threshold - subtotal}</strong> more for <strong>FREE Delivery</strong>`;
    }
  }

  window.medCareRemoveItem = (id) => {
    state.cart = state.cart.filter(i => i.id !== id);
    saveCart();
    updateCartUI();
    showToast("Item removed from cart", "info");
  };

  function openCartDrawer() {
    const d = document.getElementById("cartDrawer");
    const o = document.getElementById("cartOverlay");
    if (d && o) {
      d.classList.add("open");
      o.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeCartDrawer() {
    const d = document.getElementById("cartDrawer");
    const o = document.getElementById("cartOverlay");
    if (d && o) {
      d.classList.remove("open");
      o.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  function openAuthModal() {
    const a = document.getElementById("authModal");
    if (a) {
      a.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeAuthModal() {
    const a = document.getElementById("authModal");
    if (a) {
      a.classList.remove("open");
      document.body.style.overflow = "";
    }
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
