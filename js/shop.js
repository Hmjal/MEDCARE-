// MedCare Online Pharmacy - Shop & Product Listing Application

document.addEventListener("DOMContentLoaded", () => {
  // App State for Shop Page
  const state = {
    cart: JSON.parse(localStorage.getItem("medcare_cart")) || [],
    wishlist: JSON.parse(localStorage.getItem("medcare_wishlist")) || [],
    user: JSON.parse(localStorage.getItem("medcare_user")) || null,
    
    // Filter State
    filters: {
      keyword: "",
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 2500,
      minRating: 0,
      inStockOnly: false,
      includeOutOfStock: true,
      minDiscount: 0
    },

    // Sort & View State
    sortBy: "relevance",
    viewMode: localStorage.getItem("medcare_shop_view") || "grid", // 'grid' or 'list'

    // Pagination State
    currentPage: 1,
    itemsPerPage: 12,

    // Product item quantity selections on cards: { [productId]: number }
    cardQuantities: {}
  };

  // DOM Elements - Shop Page
  const shopProductGrid = document.getElementById("shopProductGrid");
  const resultsCountText = document.getElementById("resultsCountText");
  const activeTagsContainer = document.getElementById("activeTagsContainer");
  const sortSelect = document.getElementById("sortSelect");
  const viewGridBtn = document.getElementById("viewGridBtn");
  const viewListBtn = document.getElementById("viewListBtn");
  const itemsPerPageSelect = document.getElementById("itemsPerPageSelect");
  const paginationControls = document.getElementById("paginationControls");
  const breadcrumbCategoryName = document.getElementById("breadcrumbCategoryName");
  const shopTitleText = document.getElementById("shopTitleText");
  const shopSubText = document.getElementById("shopSubText");

  // Sidebar Elements
  const shopSidebar = document.getElementById("shopSidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  const openMobileFilterBtn = document.getElementById("openMobileFilterBtn");
  const closeMobileFilterBtn = document.getElementById("closeMobileFilterBtn");
  const filterActiveDot = document.getElementById("filterActiveDot");
  const activeFilterCounter = document.getElementById("activeFilterCounter");
  const btnClearAllFilters = document.getElementById("btnClearAllFilters");
  const btnApplyFilters = document.getElementById("btnApplyFilters");
  
  const filterKeywordInput = document.getElementById("filterKeywordInput");
  const categoryCheckboxesContainer = document.getElementById("categoryCheckboxesContainer");
  const brandSearchFilterInput = document.getElementById("brandSearchFilterInput");
  const brandCheckboxesContainer = document.getElementById("brandCheckboxesContainer");
  const priceMinInput = document.getElementById("priceMinInput");
  const priceMaxInput = document.getElementById("priceMaxInput");
  const priceRangeSlider = document.getElementById("priceRangeSlider");
  const sliderMaxLabel = document.getElementById("sliderMaxLabel");
  const stockInStockCheckbox = document.getElementById("stockInStockCheckbox");
  const stockOutOfStockCheckbox = document.getElementById("stockOutOfStockCheckbox");
  const inStockCountEl = document.getElementById("inStockCount");

  // Shared Header & Modal Elements
  const cartBtn = document.getElementById("cartBtn");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartCountBadges = document.querySelectorAll(".cart-count-badge");
  const cartItemsList = document.getElementById("cartItemsList");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const cartTotalEl = document.getElementById("cartTotal");
  const freeShippingBar = document.getElementById("freeShippingBar");
  const freeShippingText = document.getElementById("freeShippingText");
  const checkoutBtn = document.getElementById("checkoutBtn");

  const quickViewModal = document.getElementById("quickViewModal");
  const closeQuickViewBtn = document.getElementById("closeQuickViewBtn");
  const quickViewContent = document.getElementById("quickViewContent");

  const prescriptionModal = document.getElementById("prescriptionModal");
  const closePrescriptionBtn = document.getElementById("closePrescriptionBtn");
  const prescriptionForm = document.getElementById("prescriptionForm");
  const fileDropZone = document.getElementById("fileDropZone");
  const fileInput = document.getElementById("prescriptionFileInput");
  const filePreviewArea = document.getElementById("filePreviewArea");

  const authModal = document.getElementById("authModal");
  const closeAuthBtn = document.getElementById("closeAuthBtn");
  const loginBtn = document.getElementById("loginBtn");
  const mobileLoginBtn = document.getElementById("mobileLoginBtn");
  const authTabs = document.querySelectorAll(".auth-tab");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const userGreeting = document.getElementById("userGreeting");

  const searchInput = document.getElementById("searchInput");
  const searchDropdown = document.getElementById("searchDropdown");
  const mobileSearchInput = document.getElementById("mobileSearchInput");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const closeMobileNav = document.getElementById("closeMobileNav");

  // ==========================================
  // 1. INITIALIZATION & URL PARAMETER PARSING
  // ==========================================
  parseUrlParams();
  initSidebarFilters();
  initSharedComponents();
  applyFiltersAndRender();

  function parseUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get("category");
    const searchParam = urlParams.get("search");
    const brandParam = urlParams.get("brand");

    if (catParam) {
      state.filters.categories = [catParam];
      if (breadcrumbCategoryName) breadcrumbCategoryName.textContent = catParam;
      if (shopTitleText) shopTitleText.textContent = catParam;
      if (shopSubText) shopSubText.textContent = `Browsing authentic products in ${catParam}`;
    }

    if (searchParam) {
      state.filters.keyword = searchParam;
      if (filterKeywordInput) filterKeywordInput.value = searchParam;
    }

    if (brandParam) {
      state.filters.brands = [brandParam];
    }
  }

  // ==========================================
  // 2. SIDEBAR FILTER SETUP & INTERACTION
  // ==========================================
  function initSidebarFilters() {
    // Populate Category Checkboxes with dynamic item counts
    if (categoryCheckboxesContainer) {
      categoryCheckboxesContainer.innerHTML = PHARMACY_DATA.categories.map(cat => {
        const count = PHARMACY_DATA.allProducts.filter(p => p.category === cat.name).length;
        const isChecked = state.filters.categories.includes(cat.name);
        return `
          <label class="custom-checkbox-row">
            <input type="checkbox" class="category-checkbox" value="${cat.name}" ${isChecked ? 'checked' : ''}>
            <span>${cat.name} <span class="filter-count-badge">${count}</span></span>
          </label>
        `;
      }).join("");

      categoryCheckboxesContainer.querySelectorAll(".category-checkbox").forEach(cb => {
        cb.addEventListener("change", () => {
          handleCategoryChange();
        });
      });
    }

    // Populate Brand Checkboxes with dynamic item counts
    renderBrandCheckboxes();

    if (brandSearchFilterInput) {
      brandSearchFilterInput.addEventListener("input", debounce((e) => {
        renderBrandCheckboxes(e.target.value.trim().toLowerCase());
      }, 150));
    }

    // Keyword Search within results
    if (filterKeywordInput) {
      filterKeywordInput.addEventListener("input", debounce(() => {
        const grid = document.getElementById("shopProductsGrid");
        if (grid && window.medCareShowSkeletons) window.medCareShowSkeletons(grid, 6);
        state.filters.keyword = filterKeywordInput.value.trim();
        state.currentPage = 1;
        requestAnimationFrame(() => applyFiltersAndRender());
      }, 150));
    }

    // Price Slider & Inputs
    if (priceRangeSlider && priceMaxInput && priceMinInput) {
      priceRangeSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        priceMaxInput.value = val;
        state.filters.maxPrice = val;
        if (sliderMaxLabel) sliderMaxLabel.textContent = `Up to ₹${val.toLocaleString()}`;
        state.currentPage = 1;
        applyFiltersAndRender();
      });

      priceMaxInput.addEventListener("change", (e) => {
        let val = parseInt(e.target.value, 10) || 2500;
        if (val < 0) val = 0;
        priceRangeSlider.value = val;
        state.filters.maxPrice = val;
        if (sliderMaxLabel) sliderMaxLabel.textContent = `Up to ₹${val.toLocaleString()}`;
        state.currentPage = 1;
        applyFiltersAndRender();
      });

      priceMinInput.addEventListener("change", (e) => {
        let val = parseInt(e.target.value, 10) || 0;
        if (val < 0) val = 0;
        state.filters.minPrice = val;
        state.currentPage = 1;
        applyFiltersAndRender();
      });
    }

    // Rating Radio Buttons
    document.querySelectorAll(".filter-rating-radio").forEach(radio => {
      radio.addEventListener("change", (e) => {
        state.filters.minRating = e.target.value === "all" ? 0 : parseFloat(e.target.value);
        state.currentPage = 1;
        applyFiltersAndRender();
      });
    });

    // Availability Checkboxes
    const inStockCount = PHARMACY_DATA.allProducts.filter(p => p.inStock).length;
    if (inStockCountEl) inStockCountEl.textContent = inStockCount;

    if (stockInStockCheckbox && stockOutOfStockCheckbox) {
      stockInStockCheckbox.addEventListener("change", () => {
        updateAvailabilityFilter();
      });
      stockOutOfStockCheckbox.addEventListener("change", () => {
        updateAvailabilityFilter();
      });
    }

    // Discount Radio Buttons
    document.querySelectorAll(".filter-discount-radio").forEach(radio => {
      radio.addEventListener("change", (e) => {
        state.filters.minDiscount = parseInt(e.target.value, 10) || 0;
        state.currentPage = 1;
        applyFiltersAndRender();
      });
    });

    // Clear All Filters Button
    if (btnClearAllFilters) {
      btnClearAllFilters.addEventListener("click", () => {
        clearAllFilters();
      });
    }

    // Apply Filters Button (for mobile or explicit apply)
    if (btnApplyFilters) {
      btnApplyFilters.addEventListener("click", () => {
        closeMobileSidebar();
        applyFiltersAndRender();
        showToast("Filters applied", "info");
      });
    }

    // Mobile Sidebar Drawer Toggle
    if (openMobileFilterBtn && shopSidebar && sidebarBackdrop) {
      openMobileFilterBtn.addEventListener("click", () => {
        shopSidebar.classList.add("open");
        sidebarBackdrop.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    }

    if (closeMobileFilterBtn) {
      closeMobileFilterBtn.addEventListener("click", closeMobileSidebar);
    }
    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener("click", closeMobileSidebar);
    }

    // Collapsible Accordion Groups
    document.querySelectorAll(".filter-title").forEach(title => {
      title.addEventListener("click", () => {
        const group = title.closest(".filter-group");
        if (group) group.classList.toggle("collapsed");
      });
    });
  }

  function renderBrandCheckboxes(searchQuery = "") {
    if (!brandCheckboxesContainer) return;
    const allBrands = [...new Set(PHARMACY_DATA.allProducts.map(p => p.brand))].sort();
    const filteredBrands = searchQuery 
      ? allBrands.filter(b => b.toLowerCase().includes(searchQuery))
      : allBrands;

    if (filteredBrands.length === 0) {
      brandCheckboxesContainer.innerHTML = `<small class="text-muted py-1">No brands matching "${searchQuery}"</small>`;
      return;
    }

    brandCheckboxesContainer.innerHTML = filteredBrands.map(brand => {
      const count = PHARMACY_DATA.allProducts.filter(p => p.brand === brand).length;
      const isChecked = state.filters.brands.includes(brand);
      return `
        <label class="custom-checkbox-row">
          <input type="checkbox" class="brand-checkbox" value="${brand}" ${isChecked ? 'checked' : ''}>
          <span>${brand} <span class="filter-count-badge">${count}</span></span>
        </label>
      `;
    }).join("");

    brandCheckboxesContainer.querySelectorAll(".brand-checkbox").forEach(cb => {
      cb.addEventListener("change", () => {
        const val = cb.value;
        if (cb.checked) {
          if (!state.filters.brands.includes(val)) state.filters.brands.push(val);
        } else {
          state.filters.brands = state.filters.brands.filter(b => b !== val);
        }
        state.currentPage = 1;
        applyFiltersAndRender();
      });
    });
  }

  function handleCategoryChange() {
    const selected = [];
    document.querySelectorAll(".category-checkbox:checked").forEach(cb => {
      selected.push(cb.value);
    });
    state.filters.categories = selected;
    state.currentPage = 1;

    // Update Breadcrumb & Heading
    if (selected.length === 1) {
      if (breadcrumbCategoryName) breadcrumbCategoryName.textContent = selected[0];
      if (shopTitleText) shopTitleText.textContent = selected[0];
      if (shopSubText) shopSubText.textContent = `Verified medications & healthcare items in ${selected[0]}`;
    } else if (selected.length > 1) {
      if (breadcrumbCategoryName) breadcrumbCategoryName.textContent = `Multiple Categories (${selected.length})`;
      if (shopTitleText) shopTitleText.textContent = "Filtered Products";
      if (shopSubText) shopSubText.textContent = `Showing items across ${selected.length} categories`;
    } else {
      if (breadcrumbCategoryName) breadcrumbCategoryName.textContent = "All Medicines";
      if (shopTitleText) shopTitleText.textContent = "All Medicines & Healthcare";
      if (shopSubText) shopSubText.textContent = "Explore verified medications, wellness supplements, and medical equipment at discount prices.";
    }

    applyFiltersAndRender();
  }

  function updateAvailabilityFilter() {
    const inStockChecked = stockInStockCheckbox ? stockInStockCheckbox.checked : true;
    const outOfStockChecked = stockOutOfStockCheckbox ? stockOutOfStockCheckbox.checked : true;

    state.filters.inStockOnly = inStockChecked && !outOfStockChecked;
    state.filters.includeOutOfStock = outOfStockChecked;
    state.currentPage = 1;
    applyFiltersAndRender();
  }

  function clearAllFilters() {
    state.filters = {
      keyword: "",
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 2500,
      minRating: 0,
      inStockOnly: false,
      includeOutOfStock: true,
      minDiscount: 0
    };

    if (filterKeywordInput) filterKeywordInput.value = "";
    if (brandSearchFilterInput) brandSearchFilterInput.value = "";
    if (priceMinInput) priceMinInput.value = 0;
    if (priceMaxInput) priceMaxInput.value = 2500;
    if (priceRangeSlider) priceRangeSlider.value = 2500;
    if (sliderMaxLabel) sliderMaxLabel.textContent = "Up to ₹2,500";
    if (stockInStockCheckbox) stockInStockCheckbox.checked = true;
    if (stockOutOfStockCheckbox) stockOutOfStockCheckbox.checked = true;

    // Uncheck categories & brands
    document.querySelectorAll(".category-checkbox").forEach(cb => cb.checked = false);
    document.querySelectorAll(".brand-checkbox").forEach(cb => cb.checked = false);

    // Reset radio buttons
    const allRatingRadio = document.querySelector('input[name="ratingFilter"][value="all"]');
    if (allRatingRadio) allRatingRadio.checked = true;

    const allDiscountRadio = document.querySelector('input[name="discountFilter"][value="0"]');
    if (allDiscountRadio) allDiscountRadio.checked = true;

    if (breadcrumbCategoryName) breadcrumbCategoryName.textContent = "All Medicines";
    if (shopTitleText) shopTitleText.textContent = "All Medicines & Healthcare";
    if (shopSubText) shopSubText.textContent = "Explore verified medications, wellness supplements, and medical equipment at discount prices.";

    state.currentPage = 1;
    applyFiltersAndRender();
    showToast("All filters cleared", "info");
  }

  function closeMobileSidebar() {
    if (shopSidebar && sidebarBackdrop) {
      shopSidebar.classList.remove("open");
      sidebarBackdrop.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  // ==========================================
  // 3. FILTERING, SORTING & RENDERING ENGINE
  // ==========================================
  function applyFiltersAndRender() {
    let result = [...PHARMACY_DATA.allProducts];

    // 1. Keyword Filter
    if (state.filters.keyword) {
      const q = state.filters.keyword.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.composition && p.composition.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (state.filters.categories.length > 0) {
      result = result.filter(p => state.filters.categories.includes(p.category));
    }

    // 3. Brand Filter
    if (state.filters.brands.length > 0) {
      result = result.filter(p => state.filters.brands.includes(p.brand));
    }

    // 4. Price Filter
    result = result.filter(p => p.price >= state.filters.minPrice && p.price <= state.filters.maxPrice);

    // 5. Rating Filter
    if (state.filters.minRating > 0) {
      result = result.filter(p => p.rating >= state.filters.minRating);
    }

    // 6. Availability Filter
    if (state.filters.inStockOnly) {
      result = result.filter(p => p.inStock);
    } else if (!state.filters.includeOutOfStock) {
      result = result.filter(p => p.inStock);
    }

    // 7. Discount Filter
    if (state.filters.minDiscount > 0) {
      result = result.filter(p => p.discount >= state.filters.minDiscount);
    }

    // Apply Sorting
    result = sortProducts(result, state.sortBy);

    // Update Filter Active Indicators & Tag Pills
    updateFilterTagPills();

    // Render Product Cards & Pagination
    renderProductCards(result);
  }

  function sortProducts(list, criteria) {
    const sorted = [...list];
    switch (criteria) {
      case "priceLowHigh":
        return sorted.sort((a, b) => a.price - b.price);
      case "priceHighLow":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "discount":
        return sorted.sort((a, b) => b.discount - a.discount);
      case "newest":
        return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      case "relevance":
      default:
        return sorted;
    }
  }

  function updateFilterTagPills() {
    let activeCount = 0;
    let pillsHtml = "";

    if (state.filters.keyword) {
      activeCount++;
      pillsHtml += `
        <span class="filter-tag-pill">
          "${state.filters.keyword}"
          <button data-remove="keyword">&times;</button>
        </span>
      `;
    }

    state.filters.categories.forEach(cat => {
      activeCount++;
      pillsHtml += `
        <span class="filter-tag-pill">
          ${cat}
          <button data-remove="category" data-val="${cat}">&times;</button>
        </span>
      `;
    });

    state.filters.brands.forEach(brand => {
      activeCount++;
      pillsHtml += `
        <span class="filter-tag-pill">
          Brand: ${brand}
          <button data-remove="brand" data-val="${brand}">&times;</button>
        </span>
      `;
    });

    if (state.filters.maxPrice < 2500 || state.filters.minPrice > 0) {
      activeCount++;
      pillsHtml += `
        <span class="filter-tag-pill">
          ₹${state.filters.minPrice} - ₹${state.filters.maxPrice}
          <button data-remove="price">&times;</button>
        </span>
      `;
    }

    if (state.filters.minRating > 0) {
      activeCount++;
      pillsHtml += `
        <span class="filter-tag-pill">
          ${state.filters.minRating}★ &amp; above
          <button data-remove="rating">&times;</button>
        </span>
      `;
    }

    if (state.filters.minDiscount > 0) {
      activeCount++;
      pillsHtml += `
        <span class="filter-tag-pill">
          ${state.filters.minDiscount}%+ Off
          <button data-remove="discount">&times;</button>
        </span>
      `;
    }

    if (state.filters.inStockOnly) {
      activeCount++;
      pillsHtml += `
        <span class="filter-tag-pill">
          In Stock Only
          <button data-remove="stock">&times;</button>
        </span>
      `;
    }

    if (activeTagsContainer) activeTagsContainer.innerHTML = pillsHtml;

    if (activeFilterCounter) {
      activeFilterCounter.textContent = activeCount > 0 ? `${activeCount} filter${activeCount > 1 ? 's' : ''} active` : 'All items';
    }

    if (filterActiveDot) {
      filterActiveDot.style.display = activeCount > 0 ? "block" : "none";
    }

    // Attach click listeners to pill remove buttons
    if (activeTagsContainer) {
      activeTagsContainer.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          const type = btn.getAttribute("data-remove");
          const val = btn.getAttribute("data-val");

          if (type === "keyword") {
            state.filters.keyword = "";
            if (filterKeywordInput) filterKeywordInput.value = "";
          } else if (type === "category") {
            state.filters.categories = state.filters.categories.filter(c => c !== val);
            const cb = document.querySelector(`.category-checkbox[value="${val}"]`);
            if (cb) cb.checked = false;
          } else if (type === "brand") {
            state.filters.brands = state.filters.brands.filter(b => b !== val);
            const cb = document.querySelector(`.brand-checkbox[value="${val}"]`);
            if (cb) cb.checked = false;
          } else if (type === "price") {
            state.filters.minPrice = 0;
            state.filters.maxPrice = 2500;
            if (priceMinInput) priceMinInput.value = 0;
            if (priceMaxInput) priceMaxInput.value = 2500;
            if (priceRangeSlider) priceRangeSlider.value = 2500;
            if (sliderMaxLabel) sliderMaxLabel.textContent = "Up to ₹2,500";
          } else if (type === "rating") {
            state.filters.minRating = 0;
            const r = document.querySelector('input[name="ratingFilter"][value="all"]');
            if (r) r.checked = true;
          } else if (type === "discount") {
            state.filters.minDiscount = 0;
            const d = document.querySelector('input[name="discountFilter"][value="0"]');
            if (d) d.checked = true;
          } else if (type === "stock") {
            state.filters.inStockOnly = false;
            state.filters.includeOutOfStock = true;
            if (stockInStockCheckbox) stockInStockCheckbox.checked = true;
            if (stockOutOfStockCheckbox) stockOutOfStockCheckbox.checked = true;
          }

          state.currentPage = 1;
          applyFiltersAndRender();
        });
      });
    }
  }

  // ==========================================
  // 4. RENDERING PRODUCT CARDS & PAGINATION
  // ==========================================
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

  function renderProductCards(products) {
    const totalCount = products.length;
    const totalPages = Math.ceil(totalCount / state.itemsPerPage) || 1;

    if (state.currentPage > totalPages) state.currentPage = totalPages;

    // Slice for current page
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = Math.min(startIndex + state.itemsPerPage, totalCount);
    const currentPageProducts = products.slice(startIndex, endIndex);

    // Update Results Count Text
    if (resultsCountText) {
      if (totalCount === 0) {
        resultsCountText.innerHTML = "Showing <strong>0</strong> products";
      } else {
        resultsCountText.innerHTML = `Showing <strong>${startIndex + 1}-${endIndex}</strong> of <strong>${totalCount}</strong> products`;
      }
    }

    if (!shopProductGrid) return;

    if (totalCount === 0) {
      shopProductGrid.innerHTML = `
        <div class="shop-empty-state col-12" style="grid-column: 1 / -1; width: 100%;">
          <i class="fa-solid fa-prescription-bottle-medical shop-empty-icon"></i>
          <h3>No medicines match your filter criteria.</h3>
          <p class="text-muted mb-3">Try adjusting your filters, clearing search keywords, or selecting a broader category.</p>
          <button class="btn btn-primary" onclick="window.medCareClearAllFilters()">
            <i class="fa-solid fa-rotate-left me-1"></i> Reset Filters
          </button>
        </div>
      `;
      if (paginationControls) paginationControls.innerHTML = "";
      return;
    }

    // Set Grid Mode or List Mode class
    shopProductGrid.className = `shop-product-grid ${state.viewMode}-mode`;

    // Render Cards
    shopProductGrid.innerHTML = currentPageProducts.map(prod => {
      const isWishlisted = state.wishlist.includes(prod.id);
      const cartItem = state.cart.find(item => item.id === prod.id);
      const inCartQty = cartItem ? cartItem.quantity : 0;

      const actionHtml = inCartQty > 0
        ? `
          <div class="card-qty-stepper active-cart-stepper" data-id="${prod.id}">
            <button type="button" class="card-qty-btn btn-cart-dec" data-id="${prod.id}" aria-label="Decrease quantity">-</button>
            <span class="card-qty-num" id="qty-disp-${prod.id}">${inCartQty}</span>
            <button type="button" class="card-qty-btn btn-cart-inc" data-id="${prod.id}" aria-label="Increase quantity">+</button>
          </div>
        `
        : `
          <button class="btn-card-add btn-blinkit-add" data-id="${prod.id}" ${!prod.inStock ? 'disabled' : ''}>
            <i class="fa-solid fa-cart-plus"></i> ${prod.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        `;

      return `
        <article class="shop-card" data-id="${prod.id}">
          <div class="product-badge-group">
            ${prod.requiresPrescription ? '<span class="badge badge-rx"><i class="fa-solid fa-receipt"></i> Rx Req.</span>' : ''}
            <span class="badge badge-discount">${prod.discount}% OFF</span>
          </div>

          <button class="btn-wishlist ${isWishlisted ? 'active' : ''}" data-id="${prod.id}" title="Wishlist">
            <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>

          <div class="shop-card-media">
            <a href="product.html?id=${prod.id}" class="d-block w-100 h-100">
              <img src="${prod.image}" alt="${prod.name}" class="shop-card-img" loading="lazy">
            </a>
            <button class="btn-quick-view" data-id="${prod.id}">
              <i class="fa-regular fa-eye"></i> Quick View
            </button>
          </div>

          <div class="shop-card-body">
            <div class="shop-card-info-col">
              <div class="product-brand-cat">
                <span class="product-brand">${prod.brand}</span>
                <span class="product-cat">${prod.category}</span>
              </div>

              <h3 class="shop-card-title" title="${prod.name}">
                <a href="product.html?id=${prod.id}">${prod.name}</a>
              </h3>

              <div class="shop-card-salt" title="${prod.composition || ''}">
                ${prod.composition || 'Clinical Grade Formulation'}
              </div>

              <div class="shop-card-pack">
                <i class="fa-solid fa-box"></i>
                <span>${prod.packSize || 'Standard Packaging'}</span>
              </div>

              <div class="product-rating">
                <div class="stars">${renderStars(prod.rating)}</div>
                <span class="rating-val">${prod.rating}</span>
                <span class="rating-count">(${prod.reviewsCount})</span>
              </div>

              <div class="shop-card-stock-status">
                ${prod.inStock ? '<span class="in-stock-label"><i class="fa-solid fa-circle-check"></i> In Stock</span>' : '<span class="out-of-stock-label"><i class="fa-solid fa-circle-xmark"></i> Out of Stock</span>'}
              </div>
            </div>

            <div class="shop-card-footer">
              <div class="shop-card-pricing">
                <div>
                  <span class="price-main">₹${prod.price}</span>
                  <span class="mrp-strike">MRP ₹${prod.mrp}</span>
                </div>
                <span class="badge bg-success-subtle text-success small">Save ₹${prod.mrp - prod.price}</span>
              </div>

              <div class="card-qty-add-row">
                ${actionHtml}
              </div>
            </div>
          </div>
        </article>
      `;
    }).join("");

    attachCardEventListeners();
    renderPagination(totalPages);
  }

  window.medCareClearAllFilters = clearAllFilters;

  function triggerCartBadgeBounce() {
    cartCountBadges.forEach(badge => {
      badge.classList.remove("mc-bounce");
      void badge.offsetWidth;
      badge.classList.add("mc-bounce");
    });
  }

  function attachCardEventListeners() {
    // Active Cart Stepper (-)
    document.querySelectorAll(".btn-cart-dec").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        updateCartQuantity(id, -1);
        triggerCartBadgeBounce();
        applyFiltersAndRender();
      });
    });

    // Active Cart Stepper (+)
    document.querySelectorAll(".btn-cart-inc").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        updateCartQuantity(id, 1);
        triggerCartBadgeBounce();
        applyFiltersAndRender();
      });
    });

    // State A: Add to Cart button -> transforms into stepper
    document.querySelectorAll(".btn-card-add").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        addToCart(id, 1, false);
        triggerCartBadgeBounce();
        applyFiltersAndRender();
      });
    });

    // Wishlist heart buttons
    document.querySelectorAll(".btn-wishlist").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        toggleWishlist(id, btn);
      });
    });

    // Quick View buttons
    document.querySelectorAll(".btn-quick-view").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        openQuickView(id);
      });
    });
  }

  // ==========================================
  // 5. PAGINATION RENDERING & CONTROLS
  // ==========================================
  function renderPagination(totalPages) {
    if (!paginationControls) return;

    if (totalPages <= 1) {
      paginationControls.innerHTML = "";
      return;
    }

    let html = "";

    // Previous Button
    html += `
      <li>
        <button class="page-btn" id="prevPageBtn" ${state.currentPage === 1 ? 'disabled' : ''} aria-label="Previous Page">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
      </li>
    `;

    // Page numbers with ellipsis
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= state.currentPage - 1 && i <= state.currentPage + 1)
      ) {
        html += `
          <li>
            <button class="page-btn ${i === state.currentPage ? 'active' : ''}" data-page="${i}">
              ${i}
            </button>
          </li>
        `;
      } else if (
        i === state.currentPage - 2 || 
        i === state.currentPage + 2
      ) {
        html += `<li><span class="page-ellipsis">...</span></li>`;
      }
    }

    // Next Button
    html += `
      <li>
        <button class="page-btn" id="nextPageBtn" ${state.currentPage === totalPages ? 'disabled' : ''} aria-label="Next Page">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </li>
    `;

    paginationControls.innerHTML = html;

    // Attach Pagination Click Listeners
    const prevBtn = document.getElementById("prevPageBtn");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (state.currentPage > 1) {
          state.currentPage--;
          applyFiltersAndRender();
          scrollToTop();
        }
      });
    }

    const nextBtn = document.getElementById("nextPageBtn");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (state.currentPage < totalPages) {
          state.currentPage++;
          applyFiltersAndRender();
          scrollToTop();
        }
      });
    }

    paginationControls.querySelectorAll(".page-btn[data-page]").forEach(btn => {
      btn.addEventListener("click", () => {
        const page = parseInt(btn.getAttribute("data-page"), 10);
        if (page !== state.currentPage) {
          state.currentPage = page;
          applyFiltersAndRender();
          scrollToTop();
        }
      });
    });
  }

  function scrollToTop() {
    const target = document.querySelector(".shop-products-column");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // ==========================================
  // 6. TOOLBAR SORT & VIEW TOGGLES
  // ==========================================
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      applyFiltersAndRender();
    });
  }

  if (viewGridBtn && viewListBtn) {
    if (state.viewMode === "list") {
      viewListBtn.classList.add("active");
      viewGridBtn.classList.remove("active");
    } else {
      viewGridBtn.classList.add("active");
      viewListBtn.classList.remove("active");
    }

    viewGridBtn.addEventListener("click", () => {
      state.viewMode = "grid";
      localStorage.setItem("medcare_shop_view", "grid");
      viewGridBtn.classList.add("active");
      viewListBtn.classList.remove("active");
      applyFiltersAndRender();
    });

    viewListBtn.addEventListener("click", () => {
      state.viewMode = "list";
      localStorage.setItem("medcare_shop_view", "list");
      viewListBtn.classList.add("active");
      viewGridBtn.classList.remove("active");
      applyFiltersAndRender();
    });
  }

  if (itemsPerPageSelect) {
    itemsPerPageSelect.addEventListener("change", (e) => {
      state.itemsPerPage = parseInt(e.target.value, 10);
      state.currentPage = 1;
      applyFiltersAndRender();
    });
  }

  // ==========================================
  // 7. SHARED COMPONENTS (Cart, Quick View, Modals, Auth)
  // ==========================================
  function initSharedComponents() {
    updateCartUI();
    updateAuthUI();

    // Cart Drawer Toggle
    if (cartBtn) cartBtn.addEventListener("click", openCartDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener("click", closeCartDrawer);

    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        if (state.cart.length === 0) {
          showToast("Your cart is empty! Add medicines before checkout.", "warning");
          return;
        }
        window.location.href = "checkout.html";
      });
    }

    // Prescription triggers
    document.querySelectorAll(".trigger-upload-rx").forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openPrescriptionModal();
      });
    });

    if (closePrescriptionBtn) closePrescriptionBtn.addEventListener("click", closePrescriptionModal);
    if (prescriptionModal) {
      prescriptionModal.addEventListener("click", (e) => {
        if (e.target === prescriptionModal) closePrescriptionModal();
      });
    }

    // Prescription File Drag and Drop
    if (fileDropZone && fileInput) {
      fileDropZone.addEventListener("click", () => fileInput.click());
      fileDropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        fileDropZone.classList.add("dragover");
      });
      fileDropZone.addEventListener("dragleave", () => fileDropZone.classList.remove("dragover"));
      fileDropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        fileDropZone.classList.remove("dragover");
        if (e.dataTransfer.files.length) handlePrescriptionFile(e.dataTransfer.files[0]);
      });
      fileInput.addEventListener("change", () => {
        if (fileInput.files.length) handlePrescriptionFile(fileInput.files[0]);
      });
    }

    if (prescriptionForm) {
      prescriptionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const submitBtn = prescriptionForm.querySelector("button[type='submit']");
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i> Reviewing Prescription...`;

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          closePrescriptionModal();
          prescriptionForm.reset();
          if (filePreviewArea) filePreviewArea.style.display = "none";
          showToast("✅ Prescription received! Pharmacist will call to confirm doses.", "success");
        }, 1400);
      });
    }

    // Auth Modal / Page
    if (loginBtn) loginBtn.addEventListener("click", () => { window.location.href = "login.html"; });
    if (mobileLoginBtn) mobileLoginBtn.addEventListener("click", () => { window.location.href = "login.html"; });
    if (closeAuthBtn) closeAuthBtn.addEventListener("click", closeAuthModal);
    if (authModal) {
      authModal.addEventListener("click", (e) => {
        if (e.target === authModal) closeAuthModal();
      });
    }

    authTabs.forEach(tab => {
      tab.addEventListener("click", () => switchAuthTab(tab.getAttribute("data-tab")));
    });

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

    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        state.user = { name, email };
        localStorage.setItem("medcare_user", JSON.stringify(state.user));
        updateAuthUI();
        closeAuthModal();
        showToast(`Account created for ${name}!`, "success");
      });
    }

    // Header Live Autocomplete Search (150ms debounced)
    if (searchInput) {
      searchInput.addEventListener("input", debounce((e) => handleSearchInput(e.target.value), 150));
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && searchInput.value.trim()) {
          window.location.href = `search.html?q=${encodeURIComponent(searchInput.value.trim())}`;
        }
      });
      const headerSearchBtn = searchInput.closest(".search-input-wrapper") ? searchInput.closest(".search-input-wrapper").querySelector(".search-btn") : null;
      if (headerSearchBtn) {
        headerSearchBtn.addEventListener("click", () => {
          if (searchInput.value.trim()) {
            window.location.href = `search.html?q=${encodeURIComponent(searchInput.value.trim())}`;
          }
        });
      }
      document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
          searchDropdown.classList.remove("show");
        }
      });
    }

    if (mobileSearchInput) {
      mobileSearchInput.addEventListener("input", (e) => {
        state.filters.keyword = e.target.value.trim();
        applyFiltersAndRender();
      });
    }

    // Mobile Navigation Drawer Toggle
    if (mobileMenuBtn && mobileNav) {
      mobileMenuBtn.addEventListener("click", () => mobileNav.classList.add("open"));
    }
    if (closeMobileNav && mobileNav) {
      closeMobileNav.addEventListener("click", () => mobileNav.classList.remove("open"));
    }
  }

  // Cart Management
  function addToCart(productId, qty = 1, openDrawer = true) {
    const product = PHARMACY_DATA.allProducts.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = state.cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += qty;
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
    if (openDrawer) openCartDrawer();
  }

  function updateCartQuantity(id, delta) {
    const index = state.cart.findIndex(item => item.id === id);
    if (index > -1) {
      state.cart[index].quantity += delta;
      if (state.cart[index].quantity <= 0) {
        state.cart.splice(index, 1);
        showToast("Item removed from cart", "info");
      }
      saveCart();
      updateCartUI();
      applyFiltersAndRender();
    }
  }

  function removeCartItem(id) {
    state.cart = state.cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
    applyFiltersAndRender();
    showToast("Item removed from cart", "info");
  }

  function saveCart() {
    localStorage.setItem("medcare_cart", JSON.stringify(state.cart));
  }

  function updateCartUI() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? "inline-flex" : "none";
    });

    if (!cartItemsList) return;

    if (state.cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="empty-cart-view">
          <i class="fa-solid fa-basket-shopping empty-cart-icon"></i>
          <h4>Your cart is empty</h4>
          <p>Explore our wide selection of genuine medicines and healthcare essentials.</p>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = "₹0";
      if (cartTotalEl) cartTotalEl.textContent = "₹0";
      if (freeShippingBar) freeShippingBar.style.width = "0%";
      if (freeShippingText) freeShippingText.innerHTML = "Add ₹500 more for <strong>FREE Delivery</strong>";
      return;
    }

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const hasRx = state.cart.some(item => item.requiresPrescription);

    cartItemsList.innerHTML = state.cart.map(item => `
      <div class="cart-item-row" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
        <div class="cart-item-details">
          <div class="cart-item-top">
            <h5 class="cart-item-title">${item.name}</h5>
            <button class="btn-remove-item" data-id="${item.id}" title="Remove">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
          <span class="cart-item-brand">${item.brand || 'MedCare Brand'}</span>
          ${item.requiresPrescription ? '<span class="rx-pill"><i class="fa-solid fa-file-prescription"></i> Prescription Required</span>' : ''}
          <div class="cart-item-bottom">
            <div class="qty-stepper">
              <button class="btn-qty-minus" data-id="${item.id}">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="btn-qty-plus" data-id="${item.id}">+</button>
            </div>
            <div class="cart-item-pricing">
              <span class="cart-unit-price">₹${item.price * item.quantity}</span>
              ${item.mrp ? `<span class="cart-mrp">₹${item.mrp * item.quantity}</span>` : ''}
            </div>
          </div>
        </div>
      </div>
    `).join("");

    if (hasRx) {
      cartItemsList.innerHTML += `
        <div class="rx-alert-box">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <div>
            <strong>Prescription Needed</strong>
            <p>One or more items in your cart require a valid doctor's prescription before dispatch.</p>
            <button class="btn btn-sm btn-outline-primary mt-1" id="cartUploadRxBtn">Upload Prescription Now</button>
          </div>
        </div>
      `;
      const cartUploadRx = document.getElementById("cartUploadRxBtn");
      if (cartUploadRx) {
        cartUploadRx.addEventListener("click", () => {
          closeCartDrawer();
          openPrescriptionModal();
        });
      }
    }

    cartItemsList.querySelectorAll(".btn-qty-minus").forEach(b => {
      b.addEventListener("click", () => updateCartQuantity(b.getAttribute("data-id"), -1));
    });
    cartItemsList.querySelectorAll(".btn-qty-plus").forEach(b => {
      b.addEventListener("click", () => updateCartQuantity(b.getAttribute("data-id"), 1));
    });
    cartItemsList.querySelectorAll(".btn-remove-item").forEach(b => {
      b.addEventListener("click", () => removeCartItem(b.getAttribute("data-id")));
    });

    if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal}`;
    if (cartTotalEl) cartTotalEl.textContent = `₹${subtotal}`;

    const threshold = 500;
    if (subtotal >= threshold) {
      if (freeShippingBar) freeShippingBar.style.width = "100%";
      if (freeShippingText) freeShippingText.innerHTML = `<span class="text-success"><i class="fa-solid fa-circle-check"></i> Yay! You unlocked <strong>FREE Delivery</strong>!</span>`;
    } else {
      const remaining = threshold - subtotal;
      const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
      if (freeShippingBar) freeShippingBar.style.width = `${pct}%`;
      if (freeShippingText) freeShippingText.innerHTML = `Add <strong>₹${remaining}</strong> more for <strong>FREE Delivery</strong>`;
    }
  }

  function openCartDrawer() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add("open");
      cartOverlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeCartDrawer() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove("open");
      cartOverlay.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  // Quick View Modal
  function openQuickView(productId) {
    const prod = PHARMACY_DATA.allProducts.find(p => p.id === productId);
    if (!prod || !quickViewModal || !quickViewContent) return;

    quickViewContent.innerHTML = `
      <div class="quick-view-grid">
        <div class="quick-view-media">
          <img src="${prod.image}" alt="${prod.name}" class="quick-view-img">
          ${prod.requiresPrescription ? '<div class="rx-stamp"><i class="fa-solid fa-file-prescription"></i> Prescription Required</div>' : ''}
        </div>
        <div class="quick-view-info">
          <div class="quick-view-brand-row">
            <span class="badge bg-light text-primary">${prod.category}</span>
            <span class="text-muted fs-7">Brand: <strong>${prod.brand}</strong></span>
          </div>
          <h2 class="quick-view-title">${prod.name}</h2>
          
          <div class="product-rating mb-2">
            <div class="stars">${renderStars(prod.rating)}</div>
            <span class="rating-val">${prod.rating}</span>
            <span class="rating-count">(${prod.reviewsCount} customer reviews)</span>
          </div>

          <div class="quick-view-price-box">
            <span class="qv-price">₹${prod.price}</span>
            <span class="qv-mrp">₹${prod.mrp}</span>
            <span class="badge bg-success-subtle text-success">${prod.discount}% Instant Savings</span>
          </div>

          <div class="quick-specs-list">
            <div class="spec-item">
              <span class="spec-label">Pack Size:</span>
              <span class="spec-val"><strong>${prod.packSize || 'Standard Packaging'}</strong></span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Composition:</span>
              <span class="spec-val">${prod.composition || 'Clinical Grade Formulation'}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Dosage / Form:</span>
              <span class="spec-val">${prod.dosage || 'As directed by physician'}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Manufacturer:</span>
              <span class="spec-val">${prod.manufacturer || 'Approved Pharma Ltd.'}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Availability:</span>
              <span class="spec-val ${prod.inStock ? 'text-success' : 'text-danger'}">
                <i class="fa-solid ${prod.inStock ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> ${prod.inStock ? 'In Stock (Immediate Dispatch)' : 'Out of Stock'}
              </span>
            </div>
          </div>

          <p class="quick-view-desc">${prod.description}</p>

          <div class="quick-view-actions">
            <div class="qv-qty-selector">
              <button id="qvMinus" class="btn btn-outline-secondary">-</button>
              <span id="qvQtyVal" class="qv-qty-number">1</span>
              <button id="qvPlus" class="btn btn-outline-secondary">+</button>
            </div>
            <button id="qvAddToCartBtn" class="btn btn-success btn-lg flex-grow-1" ${!prod.inStock ? 'disabled' : ''}>
              <i class="fa-solid fa-cart-plus me-2"></i> ${prod.inStock ? `Add to Cart • ₹${prod.price}` : 'Out of Stock'}
            </button>
          </div>
          <div class="mt-3">
            <a href="product.html?id=${prod.id}" class="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-2">
              View Full Medicine Details <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    `;

    let selectedQty = 1;
    const qvMinus = document.getElementById("qvMinus");
    const qvPlus = document.getElementById("qvPlus");
    const qvQtyVal = document.getElementById("qvQtyVal");
    const qvAddBtn = document.getElementById("qvAddToCartBtn");

    if (qvMinus && qvPlus && qvQtyVal && qvAddBtn && prod.inStock) {
      qvMinus.addEventListener("click", () => {
        if (selectedQty > 1) {
          selectedQty--;
          qvQtyVal.textContent = selectedQty;
          qvAddBtn.innerHTML = `<i class="fa-solid fa-cart-plus me-2"></i> Add to Cart • ₹${prod.price * selectedQty}`;
        }
      });

      qvPlus.addEventListener("click", () => {
        selectedQty++;
        qvQtyVal.textContent = selectedQty;
        qvAddBtn.innerHTML = `<i class="fa-solid fa-cart-plus me-2"></i> Add to Cart • ₹${prod.price * selectedQty}`;
      });

      qvAddBtn.addEventListener("click", () => {
        addToCart(prod.id, selectedQty);
        closeQuickView();
      });
    }

    quickViewModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeQuickView() {
    if (quickViewModal) {
      quickViewModal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  if (closeQuickViewBtn) closeQuickViewBtn.addEventListener("click", closeQuickView);
  if (quickViewModal) {
    quickViewModal.addEventListener("click", (e) => {
      if (e.target === quickViewModal) closeQuickView();
    });
  }

  // Wishlist Toggle
  function toggleWishlist(productId, btnEl) {
    const index = state.wishlist.indexOf(productId);
    const prod = PHARMACY_DATA.allProducts.find(p => p.id === productId);

    if (index > -1) {
      state.wishlist.splice(index, 1);
      btnEl.classList.remove("active");
      btnEl.innerHTML = '<i class="fa-regular fa-heart"></i>';
      showToast("Removed from wishlist", "info");
    } else {
      state.wishlist.push(productId);
      btnEl.classList.add("active");
      btnEl.innerHTML = '<i class="fa-solid fa-heart"></i>';
      showToast(`Saved "${prod ? prod.name.substring(0, 20) : 'Item'}" to wishlist!`, "success");
    }

    localStorage.setItem("medcare_wishlist", JSON.stringify(state.wishlist));
  }

  // Prescription Modal
  function openPrescriptionModal() {
    if (prescriptionModal) {
      prescriptionModal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  function closePrescriptionModal() {
    if (prescriptionModal) {
      prescriptionModal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  function handlePrescriptionFile(file) {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) {
      showToast("Please upload an image (JPG, PNG) or PDF document.", "danger");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("File size exceeds 10MB limit.", "danger");
      return;
    }

    if (filePreviewArea) {
      filePreviewArea.style.display = "block";
      filePreviewArea.innerHTML = `
        <div class="file-card-preview">
          <i class="fa-solid fa-file-circle-check text-success fs-3"></i>
          <div class="file-card-info">
            <strong>${file.name}</strong>
            <small>${(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for pharmacist review</small>
          </div>
          <button type="button" class="btn btn-sm btn-outline-danger" id="btnRemoveFile">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `;
      const removeBtn = document.getElementById("btnRemoveFile");
      if (removeBtn) {
        removeBtn.addEventListener("click", () => {
          fileInput.value = "";
          filePreviewArea.style.display = "none";
          filePreviewArea.innerHTML = "";
        });
      }
    }
    showToast("Prescription file attached!", "success");
  }

  // Auth Modal
  function openAuthModal(tab = "login") {
    if (!authModal) return;
    switchAuthTab(tab);
    authModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeAuthModal() {
    if (!authModal) return;
    authModal.classList.remove("open");
    document.body.style.overflow = "";
  }

  function switchAuthTab(tab) {
    authTabs.forEach(t => t.classList.toggle("active", t.getAttribute("data-tab") === tab));
    if (loginForm && registerForm) {
      loginForm.style.display = tab === "login" ? "block" : "none";
      registerForm.style.display = tab === "register" ? "block" : "none";
    }
  }

  function updateAuthUI() {
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

  // Header Search Autocomplete
  function handleSearchInput(value) {
    const query = value.trim().toLowerCase();
    if (!searchDropdown) return;
    if (query.length < 2) {
      searchDropdown.classList.remove("show");
      return;
    }

    const matchedProducts = PHARMACY_DATA.allProducts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );

    const matchedCategories = PHARMACY_DATA.categories.filter(c =>
      c.name.toLowerCase().includes(query)
    );

    if (matchedProducts.length === 0 && matchedCategories.length === 0) {
      searchDropdown.innerHTML = `
        <div class="search-empty-state">
          <i class="fa-solid fa-magnifying-glass"></i>
          <p>No medicines or categories found for "${query}".</p>
        </div>
      `;
      searchDropdown.classList.add("show");
      return;
    }

    let html = "";
    if (matchedCategories.length > 0) {
      html += `<div class="search-section-header">Categories</div>`;
      html += matchedCategories.map(cat => `
        <div class="search-cat-item" data-category="${cat.name}">
          <i class="${cat.icon} text-primary me-2"></i>
          <span>${cat.name}</span>
          <small class="text-muted ms-auto">${cat.count}</small>
        </div>
      `).join("");
    }

    if (matchedProducts.length > 0) {
      html += `<div class="search-section-header">Medicines & Healthcare</div>`;
      html += matchedProducts.map(prod => `
        <div class="search-prod-item" data-id="${prod.id}">
          <img src="${prod.image}" alt="${prod.name}" class="search-thumb">
          <div class="search-item-info">
            <span class="search-item-name">${prod.name}</span>
            <small class="search-item-brand">${prod.brand} • ${prod.category}</small>
          </div>
          <span class="search-item-price">₹${prod.price}</span>
        </div>
      `).join("");
    }

    searchDropdown.innerHTML = html;
    searchDropdown.classList.add("show");

    searchDropdown.querySelectorAll(".search-prod-item").forEach(item => {
      item.addEventListener("click", () => {
        const id = item.getAttribute("data-id");
        searchDropdown.classList.remove("show");
        openQuickView(id);
      });
    });

    searchDropdown.querySelectorAll(".search-cat-item").forEach(item => {
      item.addEventListener("click", () => {
        const catName = item.getAttribute("data-category");
        searchDropdown.classList.remove("show");
        state.filters.categories = [catName];
        document.querySelectorAll(".category-checkbox").forEach(cb => {
          cb.checked = (cb.value === catName);
        });
        state.currentPage = 1;
        applyFiltersAndRender();
      });
    });
  }

  // Toast Notification System
  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `medcare-toast toast-${type}`;

    let icon = "fa-circle-info";
    if (type === "success") icon = "fa-circle-check";
    if (type === "warning") icon = "fa-triangle-exclamation";
    if (type === "danger") icon = "fa-circle-xmark";

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

  // Debounce utility
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  window.medCareShowToast = showToast;
});
