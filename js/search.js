// MedCare Online Pharmacy - Search Results Application

document.addEventListener("DOMContentLoaded", () => {
  // 1. Search State
  const state = {
    cart: JSON.parse(localStorage.getItem("medcare_cart")) || [],
    wishlist: JSON.parse(localStorage.getItem("medcare_wishlist")) || [],
    user: JSON.parse(localStorage.getItem("medcare_user")) || null,
    recentSearches: JSON.parse(localStorage.getItem("medcare_recent_searches")) || [
      "Paracetamol 650", "Vitamin C", "BP Monitor", "Omega 3"
    ],

    // Search Query & Tab
    searchQuery: "",
    activeTab: "all", // 'all', 'medicines', 'health', 'articles'

    // Filter State (matching shop sidebar)
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

    // Sort & View
    sortBy: "relevance",
    viewMode: "grid",

    // Pagination
    currentPage: 1,
    itemsPerPage: 12,

    // Product item quantity selections on cards: { [productId]: number }
    cardQuantities: {}
  };

  // Popular search terms
  const popularSearchTerms = [
    "Paracetamol", "Vitamin C", "Blood Pressure Monitor", "Whey Protein", 
    "Dolo 650", "N95 Mask", "Fish Oil", "Cetirizine", "Omeprazole", "Digital Thermometer"
  ];

  // Category classification for tabs
  const MEDICINE_CATEGORIES = [
    "Prescription Medicines",
    "Over-the-Counter (OTC)",
    "Ayurvedic Products"
  ];

  const HEALTH_CATEGORIES = [
    "Health Supplements",
    "Personal Care",
    "Baby Care",
    "Medical Devices",
    "Covid Essentials"
  ];

  // 2. DOM Elements
  const mainSearchInput = document.getElementById("mainSearchInput");
  const mainSearchBtn = document.getElementById("mainSearchBtn");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const mainSearchSuggestions = document.getElementById("mainSearchSuggestions");
  const recentSearchesContainer = document.getElementById("recentSearchesContainer");
  const popularSearchesContainer = document.getElementById("popularSearchesContainer");

  const searchHeadlineText = document.getElementById("searchHeadlineText");
  const resultsCountText = document.getElementById("resultsCountText");
  const activeTagsContainer = document.getElementById("activeTagsContainer");
  const searchProductGrid = document.getElementById("searchProductGrid");
  const paginationWrapper = document.getElementById("paginationWrapper");
  const paginationControls = document.getElementById("paginationControls");
  const paginationStart = document.getElementById("paginationStart");
  const paginationEnd = document.getElementById("paginationEnd");
  const paginationTotal = document.getElementById("paginationTotal");
  const sortSelect = document.getElementById("sortSelect");
  const viewGridBtn = document.getElementById("viewGridBtn");
  const viewListBtn = document.getElementById("viewListBtn");

  // Tab Elements
  const tabBtns = document.querySelectorAll(".search-tab-btn");
  const tabBadgeAll = document.getElementById("tabBadgeAll");
  const tabBadgeMedicines = document.getElementById("tabBadgeMedicines");
  const tabBadgeHealth = document.getElementById("tabBadgeHealth");
  const tabBadgeArticles = document.getElementById("tabBadgeArticles");

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

  // Shared Header & Cart Elements
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

  const quickViewModal = document.getElementById("quickViewModal");
  const closeQuickViewBtn = document.getElementById("closeQuickViewBtn");
  const quickViewContent = document.getElementById("quickViewContent");

  const authModal = document.getElementById("authModal");
  const closeAuthBtn = document.getElementById("closeAuthBtn");
  const loginBtn = document.getElementById("loginBtn");
  const mobileLoginBtn = document.getElementById("mobileLoginBtn");
  const authTabs = document.querySelectorAll(".auth-tab");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const userGreeting = document.getElementById("userGreeting");

  // Mobile Nav
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const closeMobileNav = document.getElementById("closeMobileNav");

  // 3. Parse URL Parameters
  function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || params.get("search") || "";
    const category = params.get("category");
    const tab = params.get("tab");

    if (query) {
      state.searchQuery = query.trim();
      if (mainSearchInput) mainSearchInput.value = state.searchQuery;
      if (clearSearchBtn) clearSearchBtn.style.display = "flex";
      saveRecentSearch(state.searchQuery);
    }

    if (category) {
      state.filters.categories = [category];
    }

    if (tab && ["all", "medicines", "health", "articles"].includes(tab)) {
      state.activeTab = tab;
      tabBtns.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === tab);
      });
    }
  }

  // 4. Save & Render Recent Searches
  function saveRecentSearch(term) {
    if (!term || term.trim().length < 2) return;
    const cleanTerm = term.trim();
    state.recentSearches = state.recentSearches.filter(t => t.toLowerCase() !== cleanTerm.toLowerCase());
    state.recentSearches.unshift(cleanTerm);
    if (state.recentSearches.length > 8) state.recentSearches.pop();
    localStorage.setItem("medcare_recent_searches", JSON.stringify(state.recentSearches));
    renderRecentSearches();
  }

  function removeRecentSearch(term, e) {
    if (e) e.stopPropagation();
    state.recentSearches = state.recentSearches.filter(t => t.toLowerCase() !== term.toLowerCase());
    localStorage.setItem("medcare_recent_searches", JSON.stringify(state.recentSearches));
    renderRecentSearches();
  }

  function clearAllRecentSearches() {
    state.recentSearches = [];
    localStorage.removeItem("medcare_recent_searches");
    renderRecentSearches();
  }

  function renderRecentSearches() {
    if (!recentSearchesContainer) return;
    if (state.recentSearches.length === 0) {
      recentSearchesContainer.innerHTML = `<span class="text-white-50 small">No recent searches</span>`;
      return;
    }

    let html = `<span class="meta-label"><i class="fa-solid fa-clock-rotate-left"></i> Recent:</span>`;
    html += state.recentSearches.map(term => `
      <span class="search-pill-tag recent-pill" data-query="${escapeHtml(term)}">
        ${escapeHtml(term)}
        <button class="btn-remove-recent" data-remove="${escapeHtml(term)}" title="Remove">&times;</button>
      </span>
    `).join("");

    html += `<button class="btn-clear-recent-all" id="btnClearRecentAll">Clear</button>`;
    recentSearchesContainer.innerHTML = html;

    // Attach listeners
    recentSearchesContainer.querySelectorAll(".search-pill-tag").forEach(tag => {
      tag.addEventListener("click", (e) => {
        if (e.target.closest(".btn-remove-recent")) return;
        const q = tag.getAttribute("data-query");
        performSearch(q);
      });
    });

    recentSearchesContainer.querySelectorAll(".btn-remove-recent").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const term = btn.getAttribute("data-remove");
        removeRecentSearch(term, e);
      });
    });

    const clearAllBtn = document.getElementById("btnClearRecentAll");
    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", clearAllRecentSearches);
    }
  }

  // 5. Render Popular Searches
  function renderPopularSearches() {
    if (!popularSearchesContainer) return;
    let html = `<span class="meta-label"><i class="fa-solid fa-fire text-warning"></i> Popular:</span>`;
    html += popularSearchTerms.map(term => `
      <span class="search-pill-tag popular-pill" data-query="${escapeHtml(term)}">
        ${escapeHtml(term)}
      </span>
    `).join("");
    popularSearchesContainer.innerHTML = html;

    popularSearchesContainer.querySelectorAll(".search-pill-tag").forEach(tag => {
      tag.addEventListener("click", () => {
        const q = tag.getAttribute("data-query");
        performSearch(q);
      });
    });
  }

  // 6. Auto-Suggestions Dropdown Logic
  function handleMainSearchInput(val) {
    const query = val.trim();
    if (clearSearchBtn) {
      clearSearchBtn.style.display = query ? "flex" : "none";
    }

    if (!mainSearchSuggestions) return;

    if (query.length < 2) {
      mainSearchSuggestions.classList.remove("show");
      return;
    }

    const q = query.toLowerCase();

    // Match products
    const matchedProducts = PHARMACY_DATA.allProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      (p.dosage && p.dosage.toLowerCase().includes(q))
    ).slice(0, 5);

    // Match categories
    const matchedCategories = PHARMACY_DATA.categories.filter(c =>
      c.name.toLowerCase().includes(q)
    ).slice(0, 3);

    // Match blogs
    const matchedBlogs = (PHARMACY_DATA.blogs || []).filter(b =>
      b.title.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
    ).slice(0, 2);

    if (matchedProducts.length === 0 && matchedCategories.length === 0 && matchedBlogs.length === 0) {
      mainSearchSuggestions.innerHTML = `
        <div class="p-3 text-center text-muted">
          <i class="fa-solid fa-magnifying-glass me-2"></i> No quick suggestions for "<strong>${escapeHtml(query)}</strong>"
          <div class="mt-2">
            <button class="btn btn-sm btn-outline-primary" onclick="window.medCareSubmitSearch('${escapeHtml(query)}')">
              Search all results
            </button>
          </div>
        </div>
      `;
      mainSearchSuggestions.classList.add("show");
      return;
    }

    let html = "";

    // Categories
    if (matchedCategories.length > 0) {
      html += `<div class="suggestion-section-title"><i class="fa-solid fa-layer-group me-1"></i> Matching Categories</div>`;
      html += matchedCategories.map(cat => `
        <div class="suggestion-item suggestion-cat-item" data-category="${escapeHtml(cat.name)}">
          <div class="suggestion-icon"><i class="${cat.icon || 'fa-solid fa-capsules'}"></i></div>
          <div class="suggestion-info">
            <div class="suggestion-name">${highlightMatch(cat.name, query)}</div>
            <div class="suggestion-meta">${cat.count || 'Browse Category'}</div>
          </div>
          <i class="fa-solid fa-chevron-right text-muted small"></i>
        </div>
      `).join("");
    }

    // Products
    if (matchedProducts.length > 0) {
      html += `<div class="suggestion-section-title"><i class="fa-solid fa-prescription-bottle-medical me-1"></i> Medicines & Products</div>`;
      html += matchedProducts.map(prod => `
        <div class="suggestion-item suggestion-prod-item" data-id="${prod.id}" data-name="${escapeHtml(prod.name)}">
          <img src="${prod.image}" alt="${prod.name}" class="suggestion-img">
          <div class="suggestion-info">
            <div class="suggestion-name">${highlightMatch(prod.name, query)}</div>
            <div class="suggestion-meta">
              <span>${prod.brand}</span> • <span>${prod.category}</span>
            </div>
          </div>
          <div class="suggestion-price">₹${prod.price}</div>
        </div>
      `).join("");
    }

    // Blogs
    if (matchedBlogs.length > 0) {
      html += `<div class="suggestion-section-title"><i class="fa-solid fa-newspaper me-1"></i> Health Articles</div>`;
      html += matchedBlogs.map(blog => `
        <div class="suggestion-item suggestion-blog-item" data-title="${escapeHtml(blog.title)}">
          <div class="suggestion-icon" style="background:#e8f7ec; color:#28a745;"><i class="fa-solid fa-book-medical"></i></div>
          <div class="suggestion-info">
            <div class="suggestion-name">${highlightMatch(blog.title, query)}</div>
            <div class="suggestion-meta">${blog.category} • ${blog.readTime}</div>
          </div>
        </div>
      `).join("");
    }

    // View all button
    html += `
      <div class="suggestion-view-all" id="btnSuggestionViewAll">
        <i class="fa-solid fa-magnifying-glass me-2"></i> View all results for "<strong>${escapeHtml(query)}</strong>"
      </div>
    `;

    mainSearchSuggestions.innerHTML = html;
    mainSearchSuggestions.classList.add("show");

    // Click handlers
    mainSearchSuggestions.querySelectorAll(".suggestion-prod-item").forEach(item => {
      item.addEventListener("click", () => {
        const id = item.dataset.id;
        mainSearchSuggestions.classList.remove("show");
        window.location.href = `product.html?id=${id}`;
      });
    });

    mainSearchSuggestions.querySelectorAll(".suggestion-cat-item").forEach(item => {
      item.addEventListener("click", () => {
        const cat = item.dataset.category;
        mainSearchSuggestions.classList.remove("show");
        state.filters.categories = [cat];
        populateCategoryCheckboxes();
        applyFiltersAndRender();
      });
    });

    mainSearchSuggestions.querySelectorAll(".suggestion-blog-item").forEach(item => {
      item.addEventListener("click", () => {
        const title = item.dataset.title;
        mainSearchSuggestions.classList.remove("show");
        state.activeTab = "articles";
        tabBtns.forEach(btn => btn.classList.toggle("active", btn.dataset.tab === "articles"));
        performSearch(title);
      });
    });

    const viewAllBtn = document.getElementById("btnSuggestionViewAll");
    if (viewAllBtn) {
      viewAllBtn.addEventListener("click", () => {
        mainSearchSuggestions.classList.remove("show");
        performSearch(query);
      });
    }
  }

  function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    const regex = new RegExp(`(${query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")})`, "gi");
    return escapeHtml(text).replace(regex, "<mark>$1</mark>");
  }

  function performSearch(query) {
    state.searchQuery = (query || "").trim();
    if (mainSearchInput) mainSearchInput.value = state.searchQuery;
    if (clearSearchBtn) clearSearchBtn.style.display = state.searchQuery ? "flex" : "none";
    if (mainSearchSuggestions) mainSearchSuggestions.classList.remove("show");

    if (state.searchQuery) {
      saveRecentSearch(state.searchQuery);
      // Update browser URL without reload
      const newUrl = new URL(window.location);
      newUrl.searchParams.set("q", state.searchQuery);
      if (state.activeTab !== "all") newUrl.searchParams.set("tab", state.activeTab);
      window.history.pushState({}, "", newUrl);
    }

    state.currentPage = 1;
    applyFiltersAndRender();
  }

  window.medCareSubmitSearch = function(query) {
    performSearch(query);
  };

  // 7. Filter & Search Logic
  function getFilteredResults() {
    const q = (state.searchQuery || "").toLowerCase();
    const subKeyword = (state.filters.keyword || "").toLowerCase();

    // 1. Filter Products
    let matchedProducts = PHARMACY_DATA.allProducts.filter(prod => {
      // Main Search Query Match
      if (q) {
        const matchName = prod.name.toLowerCase().includes(q);
        const matchBrand = prod.brand.toLowerCase().includes(q);
        const matchCategory = prod.category.toLowerCase().includes(q);
        const matchDosage = prod.dosage ? prod.dosage.toLowerCase().includes(q) : false;
        if (!matchName && !matchBrand && !matchCategory && !matchDosage) {
          return false;
        }
      }

      // Tab Match
      if (state.activeTab === "medicines") {
        if (!MEDICINE_CATEGORIES.includes(prod.category)) return false;
      } else if (state.activeTab === "health") {
        if (!HEALTH_CATEGORIES.includes(prod.category)) return false;
      }

      // Sidebar Sub-Keyword
      if (subKeyword) {
        const subMatch = prod.name.toLowerCase().includes(subKeyword) || 
                         prod.brand.toLowerCase().includes(subKeyword);
        if (!subMatch) return false;
      }

      // Category filter
      if (state.filters.categories.length > 0) {
        if (!state.filters.categories.includes(prod.category)) return false;
      }

      // Brand filter
      if (state.filters.brands.length > 0) {
        if (!state.filters.brands.includes(prod.brand)) return false;
      }

      // Price filter
      if (prod.price < state.filters.minPrice || prod.price > state.filters.maxPrice) {
        return false;
      }

      // Rating filter
      if (state.filters.minRating > 0 && prod.rating < state.filters.minRating) {
        return false;
      }

      // Stock filter
      if (state.filters.inStockOnly && !prod.inStock) {
        return false;
      }
      if (!state.filters.includeOutOfStock && !prod.inStock) {
        return false;
      }

      // Discount filter
      if (state.filters.minDiscount > 0 && prod.discount < state.filters.minDiscount) {
        return false;
      }

      return true;
    });

    // 2. Filter Blog Articles
    let matchedArticles = (PHARMACY_DATA.blogs || []).filter(blog => {
      if (!q) return true;
      return blog.title.toLowerCase().includes(q) ||
             blog.category.toLowerCase().includes(q) ||
             blog.excerpt.toLowerCase().includes(q) ||
             blog.author.toLowerCase().includes(q);
    });

    // Sort Products
    matchedProducts = sortProducts(matchedProducts, state.sortBy);

    return {
      products: matchedProducts,
      articles: matchedArticles
    };
  }

  function sortProducts(products, sortBy) {
    const list = [...products];
    switch (sortBy) {
      case "priceLowHigh":
        return list.sort((a, b) => a.price - b.price);
      case "priceHighLow":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
      case "discount":
        return list.sort((a, b) => b.discount - a.discount);
      case "newest":
        return list.reverse();
      case "relevance":
      default:
        // Prioritize in-stock and higher rating
        return list.sort((a, b) => {
          if (a.inStock && !b.inStock) return -1;
          if (!a.inStock && b.inStock) return 1;
          return b.rating - a.rating;
        });
    }
  }

  // 8. Update Tab Counts
  function updateTabCounts(q) {
    const query = (q || "").toLowerCase();

    // All matching products across categories
    const allMatching = PHARMACY_DATA.allProducts.filter(p => {
      if (!query) return true;
      return p.name.toLowerCase().includes(query) ||
             p.brand.toLowerCase().includes(query) ||
             p.category.toLowerCase().includes(query) ||
             (p.dosage && p.dosage.toLowerCase().includes(query));
    });

    const medicineCount = allMatching.filter(p => MEDICINE_CATEGORIES.includes(p.category)).length;
    const healthCount = allMatching.filter(p => HEALTH_CATEGORIES.includes(p.category)).length;
    
    const blogCount = (PHARMACY_DATA.blogs || []).filter(b => {
      if (!query) return true;
      return b.title.toLowerCase().includes(query) || 
             b.category.toLowerCase().includes(query) || 
             b.excerpt.toLowerCase().includes(query);
    }).length;

    const totalCount = allMatching.length + blogCount;

    if (tabBadgeAll) tabBadgeAll.textContent = totalCount;
    if (tabBadgeMedicines) tabBadgeMedicines.textContent = medicineCount;
    if (tabBadgeHealth) tabBadgeHealth.textContent = healthCount;
    if (tabBadgeArticles) tabBadgeArticles.textContent = blogCount;
  }

  // 9. Main Render Function
  function applyFiltersAndRender() {
    updateTabCounts(state.searchQuery);
    const { products, articles } = getFilteredResults();

    // Update Header Summary
    if (searchHeadlineText) {
      if (state.searchQuery) {
        searchHeadlineText.innerHTML = `Showing results for <span class="highlight-term">"${escapeHtml(state.searchQuery)}"</span>`;
      } else {
        searchHeadlineText.innerHTML = `Showing <span class="highlight-term">All Products & Health Catalog</span>`;
      }
    }

    renderActiveTagPills();

    // Check if Tab is Blog Articles
    if (state.activeTab === "articles") {
      renderBlogArticles(articles);
      if (paginationWrapper) paginationWrapper.style.display = "none";
      if (resultsCountText) {
        resultsCountText.innerHTML = `Showing <strong>${articles.length}</strong> health articles`;
      }
      return;
    }

    // Otherwise Render Products
    renderProductGrid(products);
  }

  // 10. Render Product Grid
  function renderProductGrid(products) {
    const totalCount = products.length;
    const totalPages = Math.ceil(totalCount / state.itemsPerPage) || 1;

    if (state.currentPage > totalPages) state.currentPage = totalPages;

    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = Math.min(startIndex + state.itemsPerPage, totalCount);
    const pageItems = products.slice(startIndex, endIndex);

    // Update counts
    if (resultsCountText) {
      if (totalCount === 0) {
        resultsCountText.innerHTML = "Showing <strong>0</strong> products";
      } else {
        resultsCountText.innerHTML = `Showing <strong>${startIndex + 1}-${endIndex}</strong> of <strong>${totalCount}</strong> products`;
      }
    }

    if (paginationStart) paginationStart.textContent = totalCount === 0 ? 0 : startIndex + 1;
    if (paginationEnd) paginationEnd.textContent = endIndex;
    if (paginationTotal) paginationTotal.textContent = totalCount;

    if (!searchProductGrid) return;

    if (totalCount === 0) {
      renderNoResultsFoundState();
      if (paginationWrapper) paginationWrapper.style.display = "none";
      return;
    }

    if (paginationWrapper) paginationWrapper.style.display = totalPages > 1 ? "flex" : "none";

    searchProductGrid.className = `shop-product-grid ${state.viewMode}-mode`;

    searchProductGrid.innerHTML = pageItems.map(prod => {
      const isWishlisted = state.wishlist.includes(prod.id);
      const currentQty = state.cardQuantities[prod.id] || 1;

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
            <div class="product-brand-cat">
              <span class="product-brand">${prod.brand}</span>
              <span class="product-cat">${prod.category}</span>
            </div>

            <h3 class="shop-card-title" title="${prod.name}">
              <a href="product.html?id=${prod.id}">${prod.name}</a>
            </h3>

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

            <div class="shop-card-footer">
              <div class="shop-card-pricing">
                <div>
                  <span class="price-main">₹${prod.price}</span>
                  <span class="mrp-strike">MRP ₹${prod.mrp}</span>
                </div>
                <span class="badge bg-success-subtle text-success small">Save ₹${prod.mrp - prod.price}</span>
              </div>

              <div class="card-qty-add-row">
                <div class="card-qty-stepper">
                  <button class="card-qty-btn btn-card-minus" data-id="${prod.id}">-</button>
                  <span class="card-qty-num" id="qty-disp-${prod.id}">${currentQty}</span>
                  <button class="card-qty-btn btn-card-plus" data-id="${prod.id}">+</button>
                </div>

                <button class="btn-card-add" data-id="${prod.id}" ${!prod.inStock ? 'disabled' : ''}>
                  <i class="fa-solid fa-cart-plus"></i> ${prod.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join("");

    attachProductCardListeners();
    renderPagination(totalPages);
  }

  // 11. Render Blog Articles Tab
  function renderBlogArticles(articles) {
    if (!searchProductGrid) return;

    if (articles.length === 0) {
      searchProductGrid.className = "shop-product-grid";
      searchProductGrid.innerHTML = `
        <div class="no-results-card">
          <div class="no-results-icon-wrap" style="background: #e3f7fa; color: #17a2b8;">
            <i class="fa-solid fa-newspaper"></i>
          </div>
          <h3 class="no-results-title">No health articles found</h3>
          <p class="no-results-subtitle">We couldn't find any medical blog posts matching "${escapeHtml(state.searchQuery)}".</p>
          <button class="btn btn-primary" onclick="window.medCareSwitchTab('all')">
            <i class="fa-solid fa-capsules me-2"></i> View Medicine Results
          </button>
        </div>
      `;
      return;
    }

    searchProductGrid.className = "search-blog-grid col-12";
    searchProductGrid.style.gridColumn = "1 / -1";

    searchProductGrid.innerHTML = articles.map(blog => `
      <article class="search-blog-card">
        <div class="search-blog-thumb">
          <img src="${blog.thumbnail}" alt="${blog.title}" loading="lazy">
          <span class="search-blog-cat-badge">${blog.category}</span>
        </div>
        <div class="search-blog-body">
          <div class="search-blog-meta">
            <span><i class="fa-regular fa-calendar me-1"></i> ${blog.date}</span>
            <span>•</span>
            <span><i class="fa-regular fa-clock me-1"></i> ${blog.readTime}</span>
          </div>
          <h3 class="search-blog-title">
            <a href="index.html#health-blog">${blog.title}</a>
          </h3>
          <p class="search-blog-excerpt">${blog.excerpt}</p>
          <div class="search-blog-footer">
            <span class="search-blog-author"><i class="fa-solid fa-user-doctor text-primary"></i> ${blog.author}</span>
            <a href="index.html#health-blog" class="search-blog-read-link">
              Read Article <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </article>
    `).join("");
  }

  window.medCareSwitchTab = function(tabName) {
    state.activeTab = tabName;
    tabBtns.forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tabName));
    applyFiltersAndRender();
  };

  // 12. Render "No Results Found" State with suggestions & recommended products
  function renderNoResultsFoundState() {
    const recommendedProds = PHARMACY_DATA.allProducts.filter(p => p.inStock).slice(0, 4);

    searchProductGrid.className = "shop-product-grid grid-mode";
    searchProductGrid.innerHTML = `
      <div class="no-results-card">
        <div class="no-results-icon-wrap">
          <i class="fa-solid fa-magnifying-glass-arrow-right"></i>
        </div>
        <h3 class="no-results-title">No results found for "${escapeHtml(state.searchQuery || 'your search')}"</h3>
        <p class="no-results-subtitle">
          We couldn't find any medications or healthcare products matching your exact search criteria.
        </p>

        <div class="no-results-tips-box">
          <div class="no-results-tips-title">
            <i class="fa-regular fa-lightbulb text-warning"></i> Suggestions to help you find what you need:
          </div>
          <ul class="no-results-tips-list">
            <li>
              <i class="fa-solid fa-spell-check"></i>
              <span>Double-check your spelling or try using simpler search terms.</span>
            </li>
            <li>
              <i class="fa-solid fa-capsules"></i>
              <span>Search by generic salt / active ingredient name (e.g. <strong>Paracetamol</strong> instead of a specific brand).</span>
            </li>
            <li>
              <i class="fa-solid fa-sliders"></i>
              <span>Clear active filters such as brand, price limits, or rating to broaden your results.</span>
            </li>
            <li>
              <i class="fa-solid fa-file-prescription"></i>
              <span>Have a doctor's prescription? Upload it directly and our licensed pharmacist will verify and fulfill it for you.</span>
            </li>
          </ul>
        </div>

        <div class="no-results-actions">
          <button class="btn btn-outline-danger" onclick="window.medCareClearAllFilters()">
            <i class="fa-solid fa-rotate-left me-2"></i> Clear All Filters
          </button>
          <button class="btn btn-outline-primary" onclick="window.medCareSubmitSearch('')">
            <i class="fa-solid fa-border-all me-2"></i> Browse All Medicines
          </button>
          <a href="prescription.html" class="btn btn-success fw-bold">
            <i class="fa-solid fa-upload me-2"></i> Upload Prescription
          </a>
        </div>

        <div class="no-results-rec-header">
          <div class="no-results-rec-title">
            <i class="fa-solid fa-star text-warning"></i> Popular Medicines You May Need
          </div>
          <div class="shop-product-grid grid-mode" style="margin-top: 16px;">
            ${recommendedProds.map(prod => `
              <article class="shop-card" data-id="${prod.id}">
                <div class="shop-card-media">
                  <a href="product.html?id=${prod.id}">
                    <img src="${prod.image}" alt="${prod.name}" class="shop-card-img" loading="lazy">
                  </a>
                </div>
                <div class="shop-card-body">
                  <span class="product-brand">${prod.brand}</span>
                  <h4 class="shop-card-title"><a href="product.html?id=${prod.id}">${prod.name}</a></h4>
                  <div class="product-rating">
                    <div class="stars">${renderStars(prod.rating)}</div>
                    <span class="rating-val">${prod.rating}</span>
                  </div>
                  <div class="shop-card-pricing mt-2">
                    <span class="price-main">₹${prod.price}</span>
                    <span class="mrp-strike">₹${prod.mrp}</span>
                  </div>
                  <button class="btn btn-primary btn-sm w-100 mt-2 btn-card-add" data-id="${prod.id}">
                    <i class="fa-solid fa-cart-plus me-1"></i> Add to Cart
                  </button>
                </div>
              </article>
            `).join("")}
          </div>
        </div>
      </div>
    `;

    attachProductCardListeners();
  }

  // 13. Stars Renderer Helper
  function renderStars(rating) {
    let starsHtml = "";
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.4;
    for (let i = 1; i <= 5; i++) {
      if (i <= full) {
        starsHtml += '<i class="fa-solid fa-star"></i>';
      } else if (i === full + 1 && hasHalf) {
        starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
      } else {
        starsHtml += '<i class="fa-regular fa-star"></i>';
      }
    }
    return starsHtml;
  }

  // 14. Active Filter Tag Pills
  function renderActiveTagPills() {
    if (!activeTagsContainer) return;
    const tags = [];

    if (state.searchQuery) {
      tags.push({ type: "search", label: `Search: "${state.searchQuery}"` });
    }

    if (state.filters.keyword) {
      tags.push({ type: "keyword", label: `Filter: "${state.filters.keyword}"` });
    }

    state.filters.categories.forEach(cat => {
      tags.push({ type: "category", val: cat, label: cat });
    });

    state.filters.brands.forEach(br => {
      tags.push({ type: "brand", val: br, label: `Brand: ${br}` });
    });

    if (state.filters.minPrice > 0 || state.filters.maxPrice < 2500) {
      tags.push({ type: "price", label: `₹${state.filters.minPrice} - ₹${state.filters.maxPrice}` });
    }

    if (state.filters.minRating > 0) {
      tags.push({ type: "rating", label: `${state.filters.minRating}★ & above` });
    }

    if (state.filters.inStockOnly) {
      tags.push({ type: "stock", label: "In Stock Only" });
    }

    if (state.filters.minDiscount > 0) {
      tags.push({ type: "discount", label: `${state.filters.minDiscount}%+ Off` });
    }

    if (tags.length === 0) {
      activeTagsContainer.innerHTML = "";
      if (filterActiveDot) filterActiveDot.style.display = "none";
      if (activeFilterCounter) activeFilterCounter.textContent = "All items";
      return;
    }

    if (filterActiveDot) filterActiveDot.style.display = "inline-block";
    if (activeFilterCounter) activeFilterCounter.textContent = `${tags.length} active`;

    activeTagsContainer.innerHTML = tags.map(tag => `
      <span class="active-tag-pill">
        ${escapeHtml(tag.label)}
        <button class="btn-remove-tag" data-tag-type="${tag.type}" data-tag-val="${escapeHtml(tag.val || '')}">&times;</button>
      </span>
    `).join("");

    activeTagsContainer.querySelectorAll(".btn-remove-tag").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.tagType;
        const val = btn.dataset.tagVal;
        removeFilterTag(type, val);
      });
    });
  }

  function removeFilterTag(type, val) {
    if (type === "search") {
      performSearch("");
    } else if (type === "keyword") {
      state.filters.keyword = "";
      if (filterKeywordInput) filterKeywordInput.value = "";
      applyFiltersAndRender();
    } else if (type === "category") {
      state.filters.categories = state.filters.categories.filter(c => c !== val);
      populateCategoryCheckboxes();
      applyFiltersAndRender();
    } else if (type === "brand") {
      state.filters.brands = state.filters.brands.filter(b => b !== val);
      populateBrandCheckboxes();
      applyFiltersAndRender();
    } else if (type === "price") {
      state.filters.minPrice = 0;
      state.filters.maxPrice = 2500;
      if (priceMinInput) priceMinInput.value = 0;
      if (priceMaxInput) priceMaxInput.value = 2500;
      if (priceRangeSlider) priceRangeSlider.value = 2500;
      if (sliderMaxLabel) sliderMaxLabel.textContent = "Up to ₹2,500";
      applyFiltersAndRender();
    } else if (type === "rating") {
      state.filters.minRating = 0;
      const allRadio = document.querySelector('input[name="ratingFilter"][value="all"]');
      if (allRadio) allRadio.checked = true;
      applyFiltersAndRender();
    } else if (type === "stock") {
      state.filters.inStockOnly = false;
      if (stockInStockCheckbox) stockInStockCheckbox.checked = true;
      if (stockOutOfStockCheckbox) stockOutOfStockCheckbox.checked = true;
      applyFiltersAndRender();
    } else if (type === "discount") {
      state.filters.minDiscount = 0;
      const zeroRadio = document.querySelector('input[name="discountFilter"][value="0"]');
      if (zeroRadio) zeroRadio.checked = true;
      applyFiltersAndRender();
    }
  }

  window.medCareClearAllFilters = function() {
    state.filters.keyword = "";
    state.filters.categories = [];
    state.filters.brands = [];
    state.filters.minPrice = 0;
    state.filters.maxPrice = 2500;
    state.filters.minRating = 0;
    state.filters.inStockOnly = false;
    state.filters.includeOutOfStock = true;
    state.filters.minDiscount = 0;

    if (filterKeywordInput) filterKeywordInput.value = "";
    if (priceMinInput) priceMinInput.value = 0;
    if (priceMaxInput) priceMaxInput.value = 2500;
    if (priceRangeSlider) priceRangeSlider.value = 2500;
    if (sliderMaxLabel) sliderMaxLabel.textContent = "Up to ₹2,500";

    const allRatingRadio = document.querySelector('input[name="ratingFilter"][value="all"]');
    if (allRatingRadio) allRatingRadio.checked = true;

    const zeroDiscountRadio = document.querySelector('input[name="discountFilter"][value="0"]');
    if (zeroDiscountRadio) zeroDiscountRadio.checked = true;

    if (stockInStockCheckbox) stockInStockCheckbox.checked = true;
    if (stockOutOfStockCheckbox) stockOutOfStockCheckbox.checked = true;

    populateCategoryCheckboxes();
    populateBrandCheckboxes();
    applyFiltersAndRender();
  };

  // 15. Pagination Controls
  function renderPagination(totalPages) {
    if (!paginationControls) return;
    if (totalPages <= 1) {
      paginationControls.innerHTML = "";
      return;
    }

    let html = "";
    // Prev
    html += `
      <button class="page-nav-btn ${state.currentPage === 1 ? 'disabled' : ''}" 
              id="prevPageBtn" ${state.currentPage === 1 ? 'disabled' : ''}>
        <i class="fa-solid fa-chevron-left"></i>
      </button>
    `;

    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || (p >= state.currentPage - 1 && p <= state.currentPage + 1)) {
        html += `
          <button class="page-num-btn ${p === state.currentPage ? 'active' : ''}" data-page="${p}">
            ${p}
          </button>
        `;
      } else if (p === state.currentPage - 2 || p === state.currentPage + 2) {
        html += `<span class="page-ellipsis">...</span>`;
      }
    }

    // Next
    html += `
      <button class="page-nav-btn ${state.currentPage === totalPages ? 'disabled' : ''}" 
              id="nextPageBtn" ${state.currentPage === totalPages ? 'disabled' : ''}>
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    `;

    paginationControls.innerHTML = html;

    // Listeners
    const prevBtn = document.getElementById("prevPageBtn");
    const nextBtn = document.getElementById("nextPageBtn");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (state.currentPage > 1) {
          state.currentPage--;
          applyFiltersAndRender();
          window.scrollTo({ top: 380, behavior: "smooth" });
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (state.currentPage < totalPages) {
          state.currentPage++;
          applyFiltersAndRender();
          window.scrollTo({ top: 380, behavior: "smooth" });
        }
      });
    }

    paginationControls.querySelectorAll(".page-num-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.currentPage = parseInt(btn.dataset.page);
        applyFiltersAndRender();
        window.scrollTo({ top: 380, behavior: "smooth" });
      });
    });
  }

  // 16. Populate Sidebar Filter Checkboxes (Categories & Brands)
  function populateCategoryCheckboxes() {
    if (!categoryCheckboxesContainer) return;
    const catCounts = {};
    PHARMACY_DATA.allProducts.forEach(p => {
      catCounts[p.category] = (catCounts[p.category] || 0) + 1;
    });

    categoryCheckboxesContainer.innerHTML = PHARMACY_DATA.categories.map(cat => {
      const count = catCounts[cat.name] || 0;
      const isChecked = state.filters.categories.includes(cat.name);

      return `
        <label class="custom-checkbox-row">
          <input type="checkbox" class="category-filter-checkbox" value="${escapeHtml(cat.name)}" ${isChecked ? 'checked' : ''}>
          <span class="custom-checkmark"></span>
          <span class="category-name-text">${escapeHtml(cat.name)}</span>
          <span class="category-count-badge">${count}</span>
        </label>
      `;
    }).join("");

    categoryCheckboxesContainer.querySelectorAll(".category-filter-checkbox").forEach(cb => {
      cb.addEventListener("change", () => {
        if (cb.checked) {
          state.filters.categories.push(cb.value);
        } else {
          state.filters.categories = state.filters.categories.filter(c => c !== cb.value);
        }
        state.currentPage = 1;
        applyFiltersAndRender();
      });
    });
  }

  function populateBrandCheckboxes(searchQuery = "") {
    if (!brandCheckboxesContainer) return;
    const brandsSet = new Set();
    const brandCounts = {};
    PHARMACY_DATA.allProducts.forEach(p => {
      if (p.brand) {
        brandsSet.add(p.brand);
        brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
      }
    });

    let brandsList = Array.from(brandsSet).sort();
    if (searchQuery) {
      brandsList = brandsList.filter(b => b.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (brandsList.length === 0) {
      brandCheckboxesContainer.innerHTML = `<div class="text-muted small py-2">No matching brands</div>`;
      return;
    }

    brandCheckboxesContainer.innerHTML = brandsList.map(brand => {
      const count = brandCounts[brand] || 0;
      const isChecked = state.filters.brands.includes(brand);

      return `
        <label class="custom-checkbox-row">
          <input type="checkbox" class="brand-filter-checkbox" value="${escapeHtml(brand)}" ${isChecked ? 'checked' : ''}>
          <span class="custom-checkmark"></span>
          <span class="brand-name-text">${escapeHtml(brand)}</span>
          <span class="brand-count-badge">${count}</span>
        </label>
      `;
    }).join("");

    brandCheckboxesContainer.querySelectorAll(".brand-filter-checkbox").forEach(cb => {
      cb.addEventListener("change", () => {
        if (cb.checked) {
          state.filters.brands.push(cb.value);
        } else {
          state.filters.brands = state.filters.brands.filter(b => b !== cb.value);
        }
        state.currentPage = 1;
        applyFiltersAndRender();
      });
    });
  }

  // 17. Attach Card Event Listeners (Add to Cart, Wishlist, Stepper, Quick View)
  function attachProductCardListeners() {
    // Quantity Stepper Plus/Minus
    document.querySelectorAll(".btn-card-minus").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        let qty = state.cardQuantities[id] || 1;
        if (qty > 1) qty--;
        state.cardQuantities[id] = qty;
        const disp = document.getElementById(`qty-disp-${id}`);
        if (disp) disp.textContent = qty;
      });
    });

    document.querySelectorAll(".btn-card-plus").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        let qty = state.cardQuantities[id] || 1;
        if (qty < 20) qty++;
        state.cardQuantities[id] = qty;
        const disp = document.getElementById(`qty-disp-${id}`);
        if (disp) disp.textContent = qty;
      });
    });

    // Add to Cart
    document.querySelectorAll(".btn-card-add").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const prod = PHARMACY_DATA.allProducts.find(p => p.id === id);
        if (!prod || !prod.inStock) return;
        const qty = state.cardQuantities[id] || 1;
        addToCart(prod, qty);
      });
    });

    // Wishlist Toggle
    document.querySelectorAll(".btn-wishlist").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        toggleWishlist(id, btn);
      });
    });

    // Quick View
    document.querySelectorAll(".btn-quick-view").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        openQuickViewModal(id);
      });
    });
  }

  // 18. Cart Operations
  function addToCart(prod, quantity = 1) {
    const existingIndex = state.cart.findIndex(item => item.id === prod.id);
    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += quantity;
    } else {
      state.cart.push({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        mrp: prod.mrp,
        image: prod.image,
        category: prod.category,
        brand: prod.brand,
        quantity: quantity,
        requiresPrescription: prod.requiresPrescription,
        inStock: prod.inStock
      });
    }

    localStorage.setItem("medcare_cart", JSON.stringify(state.cart));
    updateCartUI();
    showToast(`Added ${quantity} × ${prod.name} to cart!`, "success");
    openCartDrawer();
  }

  function updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartCountBadges.forEach(badge => {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? "inline-flex" : "none";
    });

    if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal}`;
    if (cartTotalEl) cartTotalEl.textContent = `₹${subtotal}`;

    if (freeShippingBar && freeShippingText) {
      const threshold = 500;
      if (subtotal >= threshold) {
        freeShippingBar.style.width = "100%";
        freeShippingText.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> Congratulations! You unlocked <strong>FREE Delivery</strong>.`;
      } else {
        const pct = Math.min((subtotal / threshold) * 100, 100);
        freeShippingBar.style.width = `${pct}%`;
        freeShippingText.innerHTML = `Add <strong>₹${threshold - subtotal}</strong> more for <strong>FREE Express Delivery</strong>!`;
      }
    }

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

  // 19. Wishlist Operations
  function toggleWishlist(id, btn) {
    const index = state.wishlist.indexOf(id);
    if (index > -1) {
      state.wishlist.splice(index, 1);
      btn.classList.remove("active");
      const icon = btn.querySelector("i");
      if (icon) icon.className = "fa-regular fa-heart";
      showToast("Removed from wishlist", "info");
    } else {
      state.wishlist.push(id);
      btn.classList.add("active");
      const icon = btn.querySelector("i");
      if (icon) icon.className = "fa-solid fa-heart";
      showToast("Added to your wishlist!", "success");
    }
    localStorage.setItem("medcare_wishlist", JSON.stringify(state.wishlist));
  }

  // 20. Quick View Modal
  function openQuickViewModal(id) {
    const prod = PHARMACY_DATA.getProductById(id);
    if (!prod || !quickViewContent) return;

    quickViewContent.innerHTML = `
      <div class="quick-view-grid">
        <div class="quick-view-media">
          <img src="${prod.image}" alt="${prod.name}" class="quick-view-main-img">
        </div>
        <div class="quick-view-details">
          <div class="product-brand-cat mb-1">
            <span class="product-brand">${prod.brand}</span> • <span class="product-cat">${prod.category}</span>
          </div>
          <h2 class="quick-view-title">${prod.name}</h2>
          <div class="product-rating mb-2">
            <div class="stars">${renderStars(prod.rating)}</div>
            <span class="rating-val">${prod.rating}</span>
            <span class="rating-count">(${prod.reviewsCount} reviews)</span>
          </div>
          <div class="quick-view-pricing mb-3">
            <span class="price-main fs-3 fw-bold text-primary">₹${prod.price}</span>
            <span class="mrp-strike fs-5 ms-2">₹${prod.mrp}</span>
            <span class="badge bg-danger ms-2">${prod.discount}% OFF</span>
          </div>
          <p class="text-muted small mb-3">${prod.description || 'Authentic clinical grade healthcare product certified by MedCare.'}</p>
          <div class="mb-3">
            <strong>Packaging:</strong> ${prod.packSize || 'Standard Packaging'}
          </div>
          <div class="mb-4">
            ${prod.inStock ? '<span class="text-success"><i class="fa-solid fa-check-circle"></i> In Stock & Ready to Dispatch</span>' : '<span class="text-danger"><i class="fa-solid fa-times-circle"></i> Currently Out of Stock</span>'}
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-primary flex-grow-1 py-2 fw-bold" onclick="window.medCareQuickAddToCart('${prod.id}')" ${!prod.inStock ? 'disabled' : ''}>
              <i class="fa-solid fa-cart-plus me-1"></i> Add to Cart
            </button>
            <a href="product.html?id=${prod.id}" class="btn btn-outline-secondary py-2">
              Full Details <i class="fa-solid fa-arrow-right ms-1"></i>
            </a>
          </div>
        </div>
      </div>
    `;

    if (quickViewModal) quickViewModal.classList.add("active");
  }

  window.medCareQuickAddToCart = function(id) {
    const prod = PHARMACY_DATA.allProducts.find(p => p.id === id);
    if (prod) {
      addToCart(prod, 1);
      if (quickViewModal) quickViewModal.classList.remove("active");
    }
  };

  // 21. Toast Notification Helper
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

  // 22. Escape HTML Helper
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 23. Event Listeners Setup
  function setupEventListeners() {
    // Prominent search input
    if (mainSearchInput) {
      mainSearchInput.addEventListener("input", (e) => handleMainSearchInput(e.target.value));
      mainSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          performSearch(mainSearchInput.value);
        }
      });
    }

    if (mainSearchBtn) {
      mainSearchBtn.addEventListener("click", () => {
        if (mainSearchInput) performSearch(mainSearchInput.value);
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => {
        if (mainSearchInput) {
          mainSearchInput.value = "";
          mainSearchInput.focus();
        }
        clearSearchBtn.style.display = "none";
        performSearch("");
      });
    }

    // Close suggestions on outside click
    document.addEventListener("click", (e) => {
      if (mainSearchSuggestions && !mainSearchSuggestions.contains(e.target) && !mainSearchInput.contains(e.target)) {
        mainSearchSuggestions.classList.remove("show");
      }
    });

    // Tab buttons
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.activeTab = btn.dataset.tab;
        state.currentPage = 1;
        applyFiltersAndRender();
      });
    });

    // Sort select
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        state.sortBy = e.target.value;
        applyFiltersAndRender();
      });
    }

    // View mode toggle
    if (viewGridBtn) {
      viewGridBtn.addEventListener("click", () => {
        state.viewMode = "grid";
        viewGridBtn.classList.add("active");
        if (viewListBtn) viewListBtn.classList.remove("active");
        applyFiltersAndRender();
      });
    }

    if (viewListBtn) {
      viewListBtn.addEventListener("click", () => {
        state.viewMode = "list";
        viewListBtn.classList.add("active");
        if (viewGridBtn) viewGridBtn.classList.remove("active");
        applyFiltersAndRender();
      });
    }

    // Sidebar sub-search keyword
    if (filterKeywordInput) {
      let timeout;
      filterKeywordInput.addEventListener("input", (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          state.filters.keyword = e.target.value.trim();
          state.currentPage = 1;
          applyFiltersAndRender();
        }, 300);
      });
    }

    // Brand sub-search input
    if (brandSearchFilterInput) {
      brandSearchFilterInput.addEventListener("input", (e) => {
        populateBrandCheckboxes(e.target.value.trim());
      });
    }

    // Price range slider & inputs
    if (priceRangeSlider) {
      priceRangeSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        state.filters.maxPrice = val;
        if (priceMaxInput) priceMaxInput.value = val;
        if (sliderMaxLabel) sliderMaxLabel.textContent = `Up to ₹${val.toLocaleString()}`;
        state.currentPage = 1;
        applyFiltersAndRender();
      });
    }

    if (priceMinInput) {
      priceMinInput.addEventListener("change", (e) => {
        state.filters.minPrice = parseInt(e.target.value) || 0;
        state.currentPage = 1;
        applyFiltersAndRender();
      });
    }

    if (priceMaxInput) {
      priceMaxInput.addEventListener("change", (e) => {
        const val = parseInt(e.target.value) || 2500;
        state.filters.maxPrice = val;
        if (priceRangeSlider) priceRangeSlider.value = val;
        if (sliderMaxLabel) sliderMaxLabel.textContent = `Up to ₹${val.toLocaleString()}`;
        state.currentPage = 1;
        applyFiltersAndRender();
      });
    }

    // Rating radio filters
    document.querySelectorAll('input[name="ratingFilter"]').forEach(radio => {
      radio.addEventListener("change", (e) => {
        state.filters.minRating = e.target.value === "all" ? 0 : parseFloat(e.target.value);
        state.currentPage = 1;
        applyFiltersAndRender();
      });
    });

    // Stock availability
    if (stockInStockCheckbox) {
      stockInStockCheckbox.addEventListener("change", (e) => {
        state.filters.inStockOnly = e.target.checked && (!stockOutOfStockCheckbox || !stockOutOfStockCheckbox.checked);
        state.currentPage = 1;
        applyFiltersAndRender();
      });
    }

    if (stockOutOfStockCheckbox) {
      stockOutOfStockCheckbox.addEventListener("change", (e) => {
        state.filters.includeOutOfStock = e.target.checked;
        state.filters.inStockOnly = !e.target.checked;
        state.currentPage = 1;
        applyFiltersAndRender();
      });
    }

    // Discount radio filters
    document.querySelectorAll('input[name="discountFilter"]').forEach(radio => {
      radio.addEventListener("change", (e) => {
        state.filters.minDiscount = parseInt(e.target.value) || 0;
        state.currentPage = 1;
        applyFiltersAndRender();
      });
    });

    // Sidebar clear all button
    if (btnClearAllFilters) {
      btnClearAllFilters.addEventListener("click", window.medCareClearAllFilters);
    }

    // Mobile filter drawer toggles
    if (openMobileFilterBtn && shopSidebar && sidebarBackdrop) {
      openMobileFilterBtn.addEventListener("click", () => {
        shopSidebar.classList.add("active");
        sidebarBackdrop.classList.add("active");
      });
    }

    if (closeMobileFilterBtn && shopSidebar && sidebarBackdrop) {
      closeMobileFilterBtn.addEventListener("click", () => {
        shopSidebar.classList.remove("active");
        sidebarBackdrop.classList.remove("active");
      });
    }

    if (sidebarBackdrop && shopSidebar) {
      sidebarBackdrop.addEventListener("click", () => {
        shopSidebar.classList.remove("active");
        sidebarBackdrop.classList.remove("active");
      });
    }

    if (btnApplyFilters && shopSidebar && sidebarBackdrop) {
      btnApplyFilters.addEventListener("click", () => {
        shopSidebar.classList.remove("active");
        sidebarBackdrop.classList.remove("active");
      });
    }

    // Cart Drawer Toggle
    if (cartBtn) {
      cartBtn.addEventListener("click", openCartDrawer);
    }
    if (closeCartBtn) {
      closeCartBtn.addEventListener("click", closeCartDrawer);
    }
    if (cartOverlay) {
      cartOverlay.addEventListener("click", closeCartDrawer);
    }

    // Quick View Modal Close
    if (closeQuickViewBtn && quickViewModal) {
      closeQuickViewBtn.addEventListener("click", () => {
        quickViewModal.classList.remove("active");
      });
      quickViewModal.addEventListener("click", (e) => {
        if (e.target === quickViewModal) quickViewModal.classList.remove("active");
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

  // 24. Initialize
  function init() {
    parseUrlParams();
    renderRecentSearches();
    renderPopularSearches();
    populateCategoryCheckboxes();
    populateBrandCheckboxes();
    updateCartUI();
    setupEventListeners();
    applyFiltersAndRender();
  }

  init();
});
