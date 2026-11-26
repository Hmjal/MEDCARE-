// MedCare Online Pharmacy - Admin Dashboard Application

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial State & Data
  const adminState = {
    currentView: "dashboard",
    chartMode: "weekly", // 'weekly' or 'monthly'

    // Products State (initialized from PHARMACY_DATA.allProducts)
    products: (PHARMACY_DATA && PHARMACY_DATA.allProducts) ? [...PHARMACY_DATA.allProducts] : [],
    productSearch: "",
    productCategoryFilter: "all",
    productStockFilter: "all",
    productPage: 1,
    productPageSize: 8,
    selectedProductIds: [],
    editingProductId: null,
    selectedRxId: null,
    rxZoom: 1,
    criticalAlerts: [],

    // Orders State
    orders: [
      {
        id: "ORD-9481",
        customer: "Aditi Rao",
        email: "aditi.rao@gmail.com",
        phone: "+91 98451 23456",
        address: "Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103",
        date: "Oct 19, 2026",
        itemsCount: 3,
        items: [
          { name: "Paracetamol 650mg Tablets", qty: 2, price: 32 },
          { name: "Vitamin C 500mg Chewable", qty: 1, price: 120 }
        ],
        total: 184,
        paymentMethod: "UPI (Google Pay)",
        status: "processing"
      },
      {
        id: "ORD-9480",
        customer: "Dr. K. Srinivas Rao",
        email: "srinivas.rao@healthclinic.org",
        phone: "+91 94480 87654",
        address: "Clinic 12, 1st Block Koramangala, Bengaluru 560034",
        date: "Oct 19, 2026",
        itemsCount: 5,
        items: [
          { name: "Digital Blood Pressure Monitor", qty: 1, price: 1450 },
          { name: "N95 Protective Face Mask (Pack of 5)", qty: 2, price: 160 }
        ],
        total: 1770,
        paymentMethod: "Credit Card (Visa)",
        status: "delivered"
      },
      {
        id: "ORD-9479",
        customer: "Meera Subramanian",
        email: "meera.subramanian@outlook.com",
        phone: "+91 98860 11223",
        address: "Plot 88, Indiranagar 12th Main, Bengaluru 560038",
        date: "Oct 18, 2026",
        itemsCount: 2,
        items: [
          { name: "Omega 3 Fish Oil Capsules 1000mg", qty: 1, price: 499 }
        ],
        total: 499,
        paymentMethod: "Net Banking (HDFC)",
        status: "shipped"
      },
      {
        id: "ORD-9478",
        customer: "Rohan Kulkarni",
        email: "rohan.kulkarni@techcorp.in",
        phone: "+91 97310 99887",
        address: "B-204, Prestige Palms, Whitefield, Bengaluru 560066",
        date: "Oct 18, 2026",
        itemsCount: 4,
        items: [
          { name: "Dolo 650mg Tablets", qty: 3, price: 30 },
          { name: "Cetirizine 10mg Antiallergic", qty: 1, price: 25 }
        ],
        total: 115,
        paymentMethod: "Cash on Delivery",
        status: "pending"
      },
      {
        id: "ORD-9477",
        customer: "Sunita Deshmukh",
        email: "sunita.d@yahoo.com",
        phone: "+91 99001 44556",
        address: "Apt 12B, Salarpuria Symphony, Electronic City, Bengaluru 560100",
        date: "Oct 17, 2026",
        itemsCount: 1,
        items: [
          { name: "Accu-Chek Instant Blood Glucose Glucometer", qty: 1, price: 1099 }
        ],
        total: 1099,
        paymentMethod: "UPI (PhonePe)",
        status: "delivered"
      },
      {
        id: "ORD-9476",
        customer: "Farhan Qureshi",
        email: "farhan.q@gmail.com",
        phone: "+91 98450 77889",
        address: "34, Richmond Road, Shanthala Nagar, Bengaluru 560025",
        date: "Oct 17, 2026",
        itemsCount: 2,
        items: [
          { name: "Ayush Chyawanprash Special 1kg", qty: 2, price: 340 }
        ],
        total: 680,
        paymentMethod: "UPI (Paytm)",
        status: "cancelled"
      }
    ],
    orderStatusFilter: "all",
    orderSearchQuery: "",

    // Customers State
    customers: [
      {
        id: "CUST-101",
        name: "Aditi Rao",
        email: "aditi.rao@gmail.com",
        phone: "+91 98451 23456",
        city: "Bengaluru",
        ordersCount: 8,
        totalSpend: 4250,
        status: "Active",
        joinDate: "Jan 14, 2025"
      },
      {
        id: "CUST-102",
        name: "Dr. K. Srinivas Rao",
        email: "srinivas.rao@healthclinic.org",
        phone: "+91 94480 87654",
        city: "Bengaluru",
        ordersCount: 24,
        totalSpend: 28400,
        status: "VIP",
        joinDate: "Aug 10, 2024"
      },
      {
        id: "CUST-103",
        name: "Meera Subramanian",
        email: "meera.subramanian@outlook.com",
        phone: "+91 98860 11223",
        city: "Bengaluru",
        ordersCount: 5,
        totalSpend: 3120,
        status: "Active",
        joinDate: "Mar 22, 2025"
      },
      {
        id: "CUST-104",
        name: "Rohan Kulkarni",
        email: "rohan.kulkarni@techcorp.in",
        phone: "+91 97310 99887",
        city: "Pune",
        ordersCount: 3,
        totalSpend: 1450,
        status: "Active",
        joinDate: "May 04, 2026"
      },
      {
        id: "CUST-105",
        name: "Sunita Deshmukh",
        email: "sunita.d@yahoo.com",
        phone: "+91 99001 44556",
        city: "Mumbai",
        ordersCount: 12,
        totalSpend: 11800,
        status: "VIP",
        joinDate: "Nov 19, 2024"
      }
    ],
    customerSearchQuery: "",

    // Prescriptions Pending Review
    prescriptions: [
      {
        id: "RX-8841",
        patient: "Rajesh Kumar (Age 54)",
        doctor: "Dr. Arvind Mehta (Reg #KA-41028)",
        date: "Oct 19, 2026 - 18:40",
        medicines: "Telmisartan 40mg, Atorvastatin 10mg",
        status: "Pending Review",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "RX-8840",
        patient: "Priya Nair (Age 29)",
        doctor: "Dr. K. Srinivas Rao (Reg #KA-32910)",
        date: "Oct 19, 2026 - 17:15",
        medicines: "Amoxicillin 500mg, Paracetamol 650mg",
        status: "Pending Review",
        image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=400&q=80"
      }
    ]
  };

  // 2. DOM Elements
  const adminNavItems = document.querySelectorAll(".admin-nav-item[data-view]");
  const adminViewPanels = document.querySelectorAll(".admin-view-panel");
  const adminViewHeaderTitle = document.getElementById("adminViewHeaderTitle");
  const btnToggleSidebar = document.getElementById("btnToggleSidebar");
  const adminSidebar = document.getElementById("adminSidebar");

  // Chart Elements
  const chartWeeklyBtn = document.getElementById("chartWeeklyBtn");
  const chartMonthlyBtn = document.getElementById("chartMonthlyBtn");
  const salesChartContainer = document.getElementById("salesChartContainer");

  // Product Elements
  const adminProductsTableBody = document.getElementById("adminProductsTableBody");
  const productSearchInput = document.getElementById("productSearchInput");
  const productCategoryFilter = document.getElementById("productCategoryFilter");
  const productStockFilter = document.getElementById("productStockFilter");
  const selectAllProductsCheckbox = document.getElementById("selectAllProductsCheckbox");
  const btnAddProductModal = document.getElementById("btnAddProductModal");
  const btnTopAddProduct = document.getElementById("btnTopAddProduct");
  const productModal = document.getElementById("productModal");
  const productForm = document.getElementById("productForm");
  const closeProductModalBtn = document.getElementById("closeProductModalBtn");
  const cancelProductBtn = document.getElementById("cancelProductBtn");
  const productModalTitle = document.getElementById("productModalTitle");

  // Bulk Actions
  const btnBulkDelete = document.getElementById("btnBulkDelete");
  const btnBulkOutOfStock = document.getElementById("btnBulkOutOfStock");

  // Orders Elements
  const adminOrdersTableBody = document.getElementById("adminOrdersTableBody");
  const orderSearchInput = document.getElementById("orderSearchInput");
  const orderFilterTabs = document.querySelectorAll(".order-filter-tab");
  const orderDetailModal = document.getElementById("orderDetailModal");
  const closeOrderDetailBtn = document.getElementById("closeOrderDetailBtn");
  const orderDetailContent = document.getElementById("orderDetailContent");

  // Customers Elements
  const adminCustomersTableBody = document.getElementById("adminCustomersTableBody");
  const customerSearchInput = document.getElementById("customerSearchInput");
  const customerDetailModal = document.getElementById("customerDetailModal");
  const closeCustomerDetailBtn = document.getElementById("closeCustomerDetailBtn");
  const customerDetailContent = document.getElementById("customerDetailContent");

  // Prescriptions List
  const adminPrescriptionsList = document.getElementById("adminPrescriptionsList");

  // Low Stock Table
  const adminLowStockTableBody = document.getElementById("adminLowStockTableBody");

  // Live Time Display
  const adminClockDisplay = document.getElementById("adminClockDisplay");
  function updateAdminClock() {
    if (!adminClockDisplay) return;
    const now = new Date();
    adminClockDisplay.textContent = now.toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    }) + " • " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }
  setInterval(updateAdminClock, 1000);
  updateAdminClock();

  // 3. Navigation View Switching
  function switchView(viewName) {
    adminState.currentView = viewName;

    adminNavItems.forEach(item => {
      item.classList.toggle("active", item.dataset.view === viewName);
    });

    adminViewPanels.forEach(panel => {
      panel.classList.toggle("active", panel.id === `view-${viewName}`);
    });

    if (adminViewHeaderTitle) {
      const titles = {
        dashboard: "Dashboard Overview",
        products: "Product Catalog Management",
        orders: "Order Management & Fulfillment",
        customers: "Customer Directory",
        prescriptions: "Prescription Verifications Desk",
        categories: "Medicine Categories",
        coupons: "Discount Coupons & Promotions",
        reports: "Sales & Analytics Reports",
        settings: "Store & Dispensary Settings"
      };
      adminViewHeaderTitle.textContent = titles[viewName] || "Admin Portal";
    }

    // Close mobile sidebar if open
    if (adminSidebar) adminSidebar.classList.remove("show");

    // Render corresponding view data
    if (viewName === "products") renderProductsTable();
    if (viewName === "orders") renderOrdersTable();
    if (viewName === "customers") renderCustomersTable();
    if (viewName === "prescriptions") renderPrescriptionsList();
  }

  adminNavItems.forEach(item => {
    item.addEventListener("click", () => {
      const view = item.dataset.view;
      if (view) switchView(view);
    });
  });

  if (btnToggleSidebar && adminSidebar) {
    btnToggleSidebar.addEventListener("click", () => {
      adminSidebar.classList.toggle("show");
    });
  }

  // 4. Sales Chart Renderer (SVG)
  function renderSalesChart(mode = "weekly") {
    if (!salesChartContainer) return;

    const data = mode === "weekly" ? [
      { label: "Mon", val: 32000 },
      { label: "Tue", val: 48000 },
      { label: "Wed", val: 42000 },
      { label: "Thu", val: 68000 },
      { label: "Fri", val: 84000 },
      { label: "Sat", val: 96000 },
      { label: "Sun", val: 78000 }
    ] : [
      { label: "Jan", val: 380000 },
      { label: "Feb", val: 420000 },
      { label: "Mar", val: 560000 },
      { label: "Apr", val: 610000 },
      { label: "May", val: 590000 },
      { label: "Jun", val: 740000 },
      { label: "Jul", val: 820000 },
      { label: "Aug", val: 790000 },
      { label: "Sep", val: 890000 },
      { label: "Oct", val: 980000 }
    ];

    const maxVal = Math.max(...data.map(d => d.val)) * 1.15;
    const width = 600;
    const height = 220;
    const padding = { top: 20, right: 30, bottom: 35, left: 55 };

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Generate points
    const points = data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartW;
      const y = padding.top + chartH - (d.val / maxVal) * chartH;
      return { x, y, val: d.val, label: d.label };
    });

    const pathD = points.reduce((acc, pt, i) => {
      return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, "");

    // Area fill path
    const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

    let svgHtml = `
      <svg class="svg-sales-chart" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0d6efd" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#0d6efd" stop-opacity="0.02"/>
          </linearGradient>
        </defs>

        <!-- Grid Lines -->
        <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="#f3f4f6" stroke-dasharray="4"/>
        <line x1="${padding.left}" y1="${padding.top + chartH * 0.5}" x2="${width - padding.right}" y2="${padding.top + chartH * 0.5}" stroke="#f3f4f6" stroke-dasharray="4"/>
        <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="#e5e7eb"/>

        <!-- Area Fill -->
        <path d="${areaD}" fill="url(#chartGradient)"/>

        <!-- Line -->
        <path d="${pathD}" fill="none" stroke="#0d6efd" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

        <!-- Data Points & Labels -->
        ${points.map(pt => `
          <circle cx="${pt.x}" cy="${pt.y}" r="5" fill="#ffffff" stroke="#0d6efd" stroke-width="2.5" class="chart-point"/>
          <text x="${pt.x}" y="${height - 10}" text-anchor="middle" font-size="11" fill="#6b7280" font-weight="600">${pt.label}</text>
        `).join("")}

        <!-- Value Labels on Points -->
        ${points.map(pt => `
          <text x="${pt.x}" y="${pt.y - 10}" text-anchor="middle" font-size="10" font-weight="700" fill="#1e40af">₹${(pt.val / 1000).toFixed(0)}k</text>
        `).join("")}
      </svg>
    `;

    salesChartContainer.innerHTML = svgHtml;
  }

  if (chartWeeklyBtn && chartMonthlyBtn) {
    chartWeeklyBtn.addEventListener("click", () => {
      chartWeeklyBtn.classList.add("active");
      chartMonthlyBtn.classList.remove("active");
      renderSalesChart("weekly");
    });

    chartMonthlyBtn.addEventListener("click", () => {
      chartMonthlyBtn.classList.add("active");
      chartWeeklyBtn.classList.remove("active");
      renderSalesChart("monthly");
    });
  }

  // 5. Product Management Logic
  function renderProductsTable() {
    if (!adminProductsTableBody) return;

    let filtered = adminState.products.filter(p => {
      if (adminState.productSearch) {
        const q = adminState.productSearch.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !(p.brand && p.brand.toLowerCase().includes(q)) &&
          !(p.composition && p.composition.toLowerCase().includes(q)) &&
          !(p.batchNo && p.batchNo.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      if (adminState.productCategoryFilter !== "all" && p.category !== adminState.productCategoryFilter) {
        return false;
      }
      const stockQty = p.stock != null ? p.stock : (p.inStock ? 25 : 0);
      if (adminState.productStockFilter === "inStock" && stockQty <= 0) return false;
      if (adminState.productStockFilter === "outOfStock" && stockQty > 0) return false;
      return true;
    });

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / adminState.productPageSize));
    if (adminState.productPage > totalPages) adminState.productPage = totalPages;
    const startIdx = (adminState.productPage - 1) * adminState.productPageSize;
    const pageItems = filtered.slice(startIdx, startIdx + adminState.productPageSize);

    if (pageItems.length === 0) {
      adminProductsTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-4 text-muted">
            <i class="fa-solid fa-box-open fs-3 d-block mb-2"></i>
            No medicines or healthcare products matching filters.
          </td>
        </tr>
      `;
    } else {
      adminProductsTableBody.innerHTML = pageItems.map(prod => {
        const isSelected = adminState.selectedProductIds.includes(prod.id);
        const stockQty = prod.stock != null ? prod.stock : (prod.inStock ? 25 : 0);
        const stockStatusClass = stockQty > 0 ? (stockQty < 10 ? "pending" : "in-stock") : "out-of-stock";
        const stockStatusText = stockQty > 0 ? (stockQty < 10 ? "Low Stock" : "In Stock") : "Out of Stock";

        return `
          <tr data-id="${prod.id}">
            <td style="width: 40px;">
              <input type="checkbox" class="product-row-cb" data-id="${prod.id}" ${isSelected ? 'checked' : ''}>
            </td>
            <td>
              <div class="d-flex align-items-center gap-3">
                <img src="${prod.image}" alt="${prod.name}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb;">
                <div>
                  <strong class="d-block text-dark">${prod.name}</strong>
                  <span class="text-muted small">${prod.composition || prod.packSize || 'Standard'} &bull; ${prod.brand}</span>
                </div>
              </div>
            </td>
            <td><span class="badge bg-light text-dark border">${prod.category}</span></td>
            <td>
              <div class="small fw-semibold">${prod.batchNo || 'MC-2026-A1'}</div>
              <div class="text-muted" style="font-size:0.75rem;">Exp: ${prod.expiryDate || '2027-06-30'}</div>
            </td>
            <td>
              <span class="text-primary fw-bold">₹${prod.price}</span>
              <span class="text-muted small text-decoration-line-through ms-1">₹${prod.mrp}</span>
            </td>
            <td>
              <div class="stock-stepper">
                <button type="button" class="btn-stock-adj" data-id="${prod.id}" data-delta="-1" title="Decrease stock">-</button>
                <span class="fw-bold small ${stockQty < 10 ? 'text-danger' : 'text-dark'}">${stockQty}</span>
                <button type="button" class="btn-stock-adj" data-id="${prod.id}" data-delta="1" title="Increase stock">+</button>
              </div>
            </td>
            <td>
              <span class="status-pill ${stockStatusClass}">
                <i class="fa-solid fa-circle" style="font-size: 6px;"></i> ${stockStatusText}
              </span>
              ${prod.requiresPrescription ? '<span class="badge bg-danger-subtle text-danger ms-1" style="font-size:0.65rem;">Rx</span>' : ''}
            </td>
            <td>
              <div class="d-flex align-items-center gap-1">
                <button class="btn-table-action btn-edit-prod" data-id="${prod.id}" title="Edit Product">
                  <i class="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <button class="btn-table-action btn-table-danger btn-delete-prod" data-id="${prod.id}" title="Delete">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }

    const paginationEl = document.getElementById("adminProductsPagination");
    if (paginationEl) {
      paginationEl.innerHTML = `
        <div class="small text-muted">Showing ${pageItems.length} of ${totalItems} medicines (Page ${adminState.productPage} of ${totalPages})</div>
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-sm btn-outline-secondary" id="prodPrevPage" ${adminState.productPage <= 1 ? 'disabled' : ''}>Prev</button>
          <button type="button" class="btn btn-sm btn-outline-secondary" id="prodNextPage" ${adminState.productPage >= totalPages ? 'disabled' : ''}>Next</button>
        </div>
      `;
      document.getElementById("prodPrevPage")?.addEventListener("click", () => {
        if (adminState.productPage > 1) { adminState.productPage--; renderProductsTable(); }
      });
      document.getElementById("prodNextPage")?.addEventListener("click", () => {
        if (adminState.productPage < totalPages) { adminState.productPage++; renderProductsTable(); }
      });
    }

    adminProductsTableBody.querySelectorAll(".product-row-cb").forEach(cb => {
      cb.addEventListener("change", () => {
        const id = cb.dataset.id;
        if (cb.checked) adminState.selectedProductIds.push(id);
        else adminState.selectedProductIds = adminState.selectedProductIds.filter(i => i !== id);
      });
    });

    adminProductsTableBody.querySelectorAll(".btn-stock-adj").forEach(btn => {
      btn.addEventListener("click", () => adjustMedicineStock(btn.dataset.id, parseInt(btn.dataset.delta, 10)));
    });

    adminProductsTableBody.querySelectorAll(".btn-edit-prod").forEach(btn => {
      btn.addEventListener("click", () => openEditProductModal(btn.dataset.id));
    });

    adminProductsTableBody.querySelectorAll(".btn-delete-prod").forEach(btn => {
      btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
    });
  }

  async function adjustMedicineStock(id, delta) {
    const token = localStorage.getItem("medcare_token");
    try {
      const res = await fetch(`/api/admin/medicines/${encodeURIComponent(id)}/stock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ delta })
      });
      if (res.ok) {
        const d = await res.json();
        const idx = adminState.products.findIndex(p => p.id === id);
        if (idx > -1 && d.medicine) adminState.products[idx] = d.medicine;
        renderProductsTable();
        syncOverviewFromAPI();
        showToast(`Stock updated to ${d.medicine.stock}`, "success");
      }
    } catch (e) {
      showToast("Failed to update stock", "danger");
    }
  }

  // Populate Categories in Product Filter Dropdown
  if (productCategoryFilter && PHARMACY_DATA && PHARMACY_DATA.categories) {
    productCategoryFilter.innerHTML = `<option value="all">All Categories</option>` +
      PHARMACY_DATA.categories.map(c => `<option value="${c.name}">${c.name}</option>`).join("");
  }

  if (productSearchInput) {
    productSearchInput.addEventListener("input", (e) => {
      adminState.productSearch = e.target.value.trim();
      renderProductsTable();
    });
  }

  if (productCategoryFilter) {
    productCategoryFilter.addEventListener("change", (e) => {
      adminState.productCategoryFilter = e.target.value;
      renderProductsTable();
    });
  }

  if (productStockFilter) {
    productStockFilter.addEventListener("change", (e) => {
      adminState.productStockFilter = e.target.value;
      renderProductsTable();
    });
  }

  if (selectAllProductsCheckbox) {
    selectAllProductsCheckbox.addEventListener("change", () => {
      if (selectAllProductsCheckbox.checked) {
        adminState.selectedProductIds = adminState.products.map(p => p.id);
      } else {
        adminState.selectedProductIds = [];
      }
      renderProductsTable();
    });
  }

  // Add / Edit Product Modal
  function openAddProductModal() {
    adminState.editingProductId = null;
    if (productModalTitle) productModalTitle.textContent = "Add New Medicine / Product";
    if (productForm) productForm.reset();
    if (productModal) productModal.classList.add("active");
  }

  function openEditProductModal(id) {
    const prod = adminState.products.find(p => p.id === id);
    if (!prod) return;

    adminState.editingProductId = id;
    if (productModalTitle) productModalTitle.textContent = `Edit Medicine: ${prod.name}`;

    document.getElementById("prodFormName").value = prod.name;
    if (document.getElementById("prodFormComposition")) document.getElementById("prodFormComposition").value = prod.composition || "";
    document.getElementById("prodFormCategory").value = prod.category;
    document.getElementById("prodFormBrand").value = prod.brand;
    document.getElementById("prodFormPackSize").value = prod.packSize || "";
    document.getElementById("prodFormPrice").value = prod.price;
    document.getElementById("prodFormMrp").value = prod.mrp;
    if (document.getElementById("prodFormBatchNo")) document.getElementById("prodFormBatchNo").value = prod.batchNo || "MC-2026-A1";
    if (document.getElementById("prodFormExpiryDate")) document.getElementById("prodFormExpiryDate").value = prod.expiryDate || "2027-06-30";
    if (document.getElementById("prodFormStock")) document.getElementById("prodFormStock").value = prod.stock != null ? prod.stock : 25;
    document.getElementById("prodFormImage").value = prod.image;
    document.getElementById("prodFormRxRequired").checked = !!prod.requiresPrescription;
    document.getElementById("prodFormInStock").checked = prod.isActive !== false;

    if (productModal) productModal.classList.add("active");
  }

  async function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this medicine from MongoDB inventory?")) return;
    const token = localStorage.getItem("medcare_token");
    try {
      const res = await fetch(`/api/admin/medicines/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error("Failed to delete from database");
      adminState.products = adminState.products.filter(p => p.id !== id);
      renderProductsTable();
      syncOverviewFromAPI();
      showToast("Medicine deleted from MongoDB successfully", "info");
    } catch (err) {
      showToast(err.message || "Could not delete product", "danger");
    }
  }

  if (btnAddProductModal) btnAddProductModal.addEventListener("click", openAddProductModal);
  if (btnTopAddProduct) btnTopAddProduct.addEventListener("click", openAddProductModal);

  if (closeProductModalBtn && productModal) {
    closeProductModalBtn.addEventListener("click", () => productModal.classList.remove("active"));
  }
  if (cancelProductBtn && productModal) {
    cancelProductBtn.addEventListener("click", () => productModal.classList.remove("active"));
  }

  if (productForm) {
    productForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const token = localStorage.getItem("medcare_token");
      const name = document.getElementById("prodFormName").value.trim();
      const composition = document.getElementById("prodFormComposition")?.value.trim() || "";
      const category = document.getElementById("prodFormCategory").value;
      const brand = document.getElementById("prodFormBrand").value.trim();
      const packSize = document.getElementById("prodFormPackSize").value.trim();
      const price = parseFloat(document.getElementById("prodFormPrice").value);
      const mrp = parseFloat(document.getElementById("prodFormMrp").value);
      const batchNo = document.getElementById("prodFormBatchNo")?.value.trim() || "MC-2026-A1";
      const expiryDate = document.getElementById("prodFormExpiryDate")?.value || "2027-06-30";
      const stock = parseInt(document.getElementById("prodFormStock")?.value || "25", 10);
      const image = document.getElementById("prodFormImage").value.trim() || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80";
      const requiresPrescription = document.getElementById("prodFormRxRequired").checked;
      const isActive = document.getElementById("prodFormInStock").checked;
      const discount = mrp > 0 ? Math.max(0, Math.round(((mrp - price) / mrp) * 100)) : 0;

      const bodyPayload = {
        name, composition, category, brand, packSize, price, mrp, discount,
        batchNo, expiryDate, stock, inStock: stock > 0, isActive, requiresPrescription, image
      };

      try {
        if (adminState.editingProductId) {
          const res = await fetch(`/api/admin/medicines/${encodeURIComponent(adminState.editingProductId)}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(bodyPayload)
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to update medicine");

          const idx = adminState.products.findIndex(p => p.id === adminState.editingProductId);
          if (idx > -1) adminState.products[idx] = data.medicine;
          showToast(`Medicine "${name}" updated in MongoDB!`, "success");
        } else {
          const res = await fetch("/api/admin/medicines", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ id: `prod-${Date.now()}`, ...bodyPayload })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to create medicine");

          adminState.products.unshift(data.medicine);
          showToast(`New medicine "${name}" saved to MongoDB!`, "success");
        }

        productModal.classList.remove("active");
        renderProductsTable();
        syncOverviewFromAPI();
      } catch (err) {
        showToast(err.message || "Error saving medicine", "danger");
      }
    });
  }

  // Bulk Actions
  if (btnBulkDelete) {
    btnBulkDelete.addEventListener("click", () => {
      if (adminState.selectedProductIds.length === 0) {
        showToast("Please select at least one product using checkboxes.", "info");
        return;
      }
      if (!confirm(`Delete ${adminState.selectedProductIds.length} selected products?`)) return;
      adminState.products = adminState.products.filter(p => !adminState.selectedProductIds.includes(p.id));
      adminState.selectedProductIds = [];
      renderProductsTable();
      showToast("Selected products deleted", "info");
    });
  }

  if (btnBulkOutOfStock) {
    btnBulkOutOfStock.addEventListener("click", () => {
      if (adminState.selectedProductIds.length === 0) {
        showToast("Please select at least one product using checkboxes.", "info");
        return;
      }
      adminState.products.forEach(p => {
        if (adminState.selectedProductIds.includes(p.id)) {
          p.inStock = false;
        }
      });
      renderProductsTable();
      showToast("Selected items marked as Out of Stock", "success");
    });
  }

  // 6. Order Management Logic
  function renderOrdersTable() {
    if (!adminOrdersTableBody) return;

    let filtered = adminState.orders.filter(order => {
      if (adminState.orderStatusFilter !== "all") {
        if (order.status !== adminState.orderStatusFilter) return false;
      }
      if (adminState.orderSearchQuery) {
        const q = adminState.orderSearchQuery.toLowerCase();
        if (!order.id.toLowerCase().includes(q) && !order.customer.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });

    if (filtered.length === 0) {
      adminOrdersTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-4 text-muted">
            <i class="fa-solid fa-receipt fs-3 d-block mb-2"></i>
            No orders found matching the filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    adminOrdersTableBody.innerHTML = filtered.map(order => {
      return `
        <tr data-order-id="${order.id}">
          <td><strong>#${order.id}</strong></td>
          <td>
            <div class="fw-bold text-dark">${order.customer}</div>
            <div class="text-muted small">${order.phone}</div>
          </td>
          <td>${order.date}</td>
          <td>${order.itemsCount} items</td>
          <td><strong class="text-dark">₹${order.total}</strong></td>
          <td><span class="text-muted small">${order.paymentMethod}</span></td>
          <td>
            <span class="status-pill ${order.status}">${order.status}</span>
          </td>
          <td>
            <button class="btn-table-action btn-view-order" data-id="${order.id}">
              <i class="fa-regular fa-eye"></i> View &amp; Update
            </button>
          </td>
        </tr>
      `;
    }).join("");

    adminOrdersTableBody.querySelectorAll(".btn-view-order").forEach(btn => {
      btn.addEventListener("click", () => {
        openOrderDetailModal(btn.dataset.id);
      });
    });

    // Also populate Dashboard Overview recent orders table with inline status switcher
    const dashboardOrdersBody = document.getElementById("adminDashboardOrdersTableBody");
    if (dashboardOrdersBody) {
      const recentFive = adminState.orders.slice(0, 5);
      dashboardOrdersBody.innerHTML = recentFive.map(order => `
        <tr data-order-id="${order.id}">
          <td><strong>${order.id}</strong></td>
          <td>
            <div class="fw-bold text-dark">${order.customer}</div>
            <div class="text-muted small">${order.phone}</div>
          </td>
          <td>${order.date}</td>
          <td>${order.itemsCount} items</td>
          <td><strong class="text-dark">₹${order.total}</strong></td>
          <td><span class="text-muted small">${order.paymentMethod}</span></td>
          <td>
            <select class="admin-select form-select-sm dash-order-status" data-id="${order.id}" style="padding:4px 8px;font-size:0.78rem;">
              ${["pending", "processing", "shipped", "delivered", "cancelled"].map(st => `
                <option value="${st}" ${order.status === st ? "selected" : ""}>${st}</option>
              `).join("")}
            </select>
          </td>
          <td>
            <button class="btn-table-action btn-view-order" data-id="${order.id}">
              <i class="fa-regular fa-eye"></i> Details
            </button>
          </td>
        </tr>
      `).join("");

      dashboardOrdersBody.querySelectorAll(".dash-order-status").forEach(sel => {
        sel.addEventListener("change", async () => {
          const id = sel.dataset.id;
          const newStatus = sel.value;
          const token = localStorage.getItem("medcare_token");
          try {
            const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}/status`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
              },
              body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
              const ord = adminState.orders.find(o => o.id === id);
              if (ord) ord.status = newStatus;
              renderOrdersTable();
              showToast(`Order ${id} updated to ${newStatus}`, "success");
            }
          } catch (e) {
            showToast("Failed to update order status", "danger");
          }
        });
      });

      dashboardOrdersBody.querySelectorAll(".btn-view-order").forEach(btn => {
        btn.addEventListener("click", () => openOrderDetailModal(btn.dataset.id));
      });
    }
  }

  orderFilterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      orderFilterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      adminState.orderStatusFilter = tab.dataset.status;
      renderOrdersTable();
    });
  });

  if (orderSearchInput) {
    orderSearchInput.addEventListener("input", (e) => {
      adminState.orderSearchQuery = e.target.value.trim();
      renderOrdersTable();
    });
  }

  function openOrderDetailModal(orderId) {
    const order = adminState.orders.find(o => o.id === orderId);
    if (!order || !orderDetailContent) return;

    // Timeline step statuses
    const steps = ["pending", "processing", "shipped", "delivered"];
    const currentStepIdx = steps.indexOf(order.status);

    orderDetailContent.innerHTML = `
      <!-- Order Timeline -->
      <div class="order-timeline">
        <div class="timeline-step ${currentStepIdx >= 0 ? (currentStepIdx > 0 ? 'completed' : 'active') : ''}">
          <div class="timeline-dot"><i class="fa-solid fa-receipt"></i></div>
          <span class="timeline-step-label">Order Placed</span>
        </div>
        <div class="timeline-step ${currentStepIdx >= 1 ? (currentStepIdx > 1 ? 'completed' : 'active') : ''}">
          <div class="timeline-dot"><i class="fa-solid fa-boxes-packing"></i></div>
          <span class="timeline-step-label">Processing</span>
        </div>
        <div class="timeline-step ${currentStepIdx >= 2 ? (currentStepIdx > 2 ? 'completed' : 'active') : ''}">
          <div class="timeline-dot"><i class="fa-solid fa-truck-fast"></i></div>
          <span class="timeline-step-label">Shipped</span>
        </div>
        <div class="timeline-step ${currentStepIdx >= 3 ? 'completed' : ''}">
          <div class="timeline-dot"><i class="fa-solid fa-house-chimney-medical"></i></div>
          <span class="timeline-step-label">Delivered</span>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-6">
          <div class="p-3 bg-light rounded border">
            <h6 class="fw-bold mb-2 text-dark"><i class="fa-solid fa-user me-1 text-primary"></i> Patient / Customer</h6>
            <div><strong>${order.customer}</strong></div>
            <div class="text-muted small">${order.phone}</div>
            <div class="text-muted small">${order.email}</div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="p-3 bg-light rounded border">
            <h6 class="fw-bold mb-2 text-dark"><i class="fa-solid fa-location-dot me-1 text-danger"></i> Shipping Address</h6>
            <div class="small text-dark">${order.address}</div>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <h6 class="fw-bold mb-2">Prescribed Items &amp; Dosages</h6>
      <table class="table table-bordered table-sm mb-3">
        <thead class="table-light">
          <tr>
            <th>Item Name</th>
            <th class="text-center">Qty</th>
            <th class="text-end">Price</th>
            <th class="text-end">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td class="text-center">${item.qty}</td>
              <td class="text-end">₹${item.price}</td>
              <td class="text-end fw-bold">₹${item.price * item.qty}</td>
            </tr>
          `).join("")}
          <tr class="table-light">
            <td colspan="3" class="text-end fw-bold">Order Total:</td>
            <td class="text-end fw-bold text-success fs-6">₹${order.total}</td>
          </tr>
        </tbody>
      </table>

      <!-- Status Update Controls -->
      <div class="p-3 rounded border bg-light d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <label class="form-label fw-bold mb-1">Update Order Status:</label>
          <select class="admin-select" id="updateOrderStatusSelect">
            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending Verification</option>
            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing &amp; Packed</option>
            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped / Out for Delivery</option>
            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered to Patient</option>
            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </div>
        <button class="btn btn-primary" id="btnSaveOrderStatus" data-id="${order.id}">
          <i class="fa-solid fa-check me-1"></i> Save Status
        </button>
      </div>
    `;

    const saveOrderBtn = document.getElementById("btnSaveOrderStatus");
    if (saveOrderBtn) {
      saveOrderBtn.addEventListener("click", async () => {
        const statusSelect = document.getElementById("updateOrderStatusSelect");
        const newStatus = statusSelect ? statusSelect.value : order.status;
        try {
          const res = await fetch(`/api/orders/${encodeURIComponent(order.id)}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
          });
          if (res.ok) {
            order.status = newStatus;
            renderOrdersTable();
            if (orderDetailModal) orderDetailModal.classList.remove("active");
            showToast(`Order ${order.id} status updated to "${newStatus}" in MongoDB`, "success");
          } else {
            // Fallback for demo rows not in DB
            order.status = newStatus;
            renderOrdersTable();
            if (orderDetailModal) orderDetailModal.classList.remove("active");
            showToast(`Order ${order.id} status updated to "${newStatus}"`, "success");
          }
        } catch (err) {
          showToast("Failed to update order status", "danger");
        }
      });
    }

    if (orderDetailModal) orderDetailModal.classList.add("active");
  }

  if (closeOrderDetailBtn && orderDetailModal) {
    closeOrderDetailBtn.addEventListener("click", () => orderDetailModal.classList.remove("active"));
  }

  // 7. Customer Management Logic
  function renderCustomersTable() {
    if (!adminCustomersTableBody) return;

    let filtered = adminState.customers.filter(c => {
      if (adminState.customerSearchQuery) {
        const q = adminState.customerSearchQuery.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q) && !c.city.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });

    adminCustomersTableBody.innerHTML = filtered.map(c => `
      <tr>
        <td><strong>#${c.id}</strong></td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <div class="admin-avatar" style="width: 32px; height: 32px; font-size: 0.8rem;">
              ${c.name.charAt(0)}
            </div>
            <div>
              <div class="fw-bold text-dark">${c.name}</div>
              <div class="text-muted small">${c.email}</div>
            </div>
          </div>
        </td>
        <td>${c.phone}</td>
        <td>${c.city}</td>
        <td><strong>${c.ordersCount}</strong> orders</td>
        <td><strong class="text-success">₹${c.totalSpend.toLocaleString()}</strong></td>
        <td>
          <span class="badge ${c.status === 'VIP' ? 'bg-warning text-dark' : 'bg-success-subtle text-success'}">
            ${c.status}
          </span>
        </td>
        <td>
          <button class="btn-table-action btn-view-cust" data-id="${c.id}">
            <i class="fa-solid fa-user me-1"></i> Details
          </button>
        </td>
      </tr>
    `).join("");

    adminCustomersTableBody.querySelectorAll(".btn-view-cust").forEach(btn => {
      btn.addEventListener("click", () => openCustomerDetailModal(btn.dataset.id));
    });
  }

  if (customerSearchInput) {
    customerSearchInput.addEventListener("input", (e) => {
      adminState.customerSearchQuery = e.target.value.trim();
      renderCustomersTable();
    });
  }

  function openCustomerDetailModal(id) {
    const cust = adminState.customers.find(c => c.id === id);
    if (!cust || !customerDetailContent) return;

    customerDetailContent.innerHTML = `
      <div class="text-center mb-4">
        <div class="admin-avatar mx-auto mb-2" style="width: 64px; height: 64px; font-size: 1.5rem; background: var(--primary);">
          ${cust.name.charAt(0)}
        </div>
        <h4 class="mb-1 text-dark fw-bold">${cust.name}</h4>
        <span class="badge bg-primary-subtle text-primary">${cust.status} Member</span>
        <div class="text-muted small mt-1">Customer since ${cust.joinDate}</div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-4 text-center">
          <div class="p-3 bg-light rounded border">
            <span class="text-muted small d-block">Total Orders</span>
            <strong class="fs-5 text-dark">${cust.ordersCount}</strong>
          </div>
        </div>
        <div class="col-4 text-center">
          <div class="p-3 bg-light rounded border">
            <span class="text-muted small d-block">Lifetime Spend</span>
            <strong class="fs-5 text-success">₹${cust.totalSpend.toLocaleString()}</strong>
          </div>
        </div>
        <div class="col-4 text-center">
          <div class="p-3 bg-light rounded border">
            <span class="text-muted small d-block">City Location</span>
            <strong class="fs-5 text-dark">${cust.city}</strong>
          </div>
        </div>
      </div>

      <div class="p-3 bg-light rounded border">
        <h6 class="fw-bold mb-2">Contact &amp; Delivery Information</h6>
        <div class="small"><strong>Email:</strong> ${cust.email}</div>
        <div class="small"><strong>Phone:</strong> ${cust.phone}</div>
      </div>
    `;

    if (customerDetailModal) customerDetailModal.classList.add("active");
  }

  if (closeCustomerDetailBtn && customerDetailModal) {
    closeCustomerDetailBtn.addEventListener("click", () => customerDetailModal.classList.remove("active"));
  }

  // 8. Prescriptions Review & Medicine Assignment Logic
  adminState.rxFilter = "all";
  const rxReviewModal = document.getElementById("rxReviewModal");
  const rxReviewContent = document.getElementById("rxReviewContent");
  const closeRxReviewBtn = document.getElementById("closeRxReviewBtn");

  if (closeRxReviewBtn && rxReviewModal) {
    closeRxReviewBtn.addEventListener("click", () => rxReviewModal.classList.remove("active"));
  }

  async function savePrescriptionDecision(rx, status, prescribedItems, pharmacistNotes) {
    const targetId = rx.mongoId || rx.id;
    const payload = {
      status,
      pharmacist_notes: pharmacistNotes !== undefined ? pharmacistNotes : (rx.pharmacist_notes || ""),
      prescribed_items: Array.isArray(prescribedItems)
        ? prescribedItems.map(it => ({
          medicine_id: it.medicine_id,
          dosage: it.dosage || "",
          quantity: it.quantity || 1
        }))
        : (rx.prescribed_items || []).map(it => ({
          medicine_id: (it.medicine_id && it.medicine_id._id) || it.medicine_id,
          dosage: it.dosage || "",
          quantity: it.quantity || 1
        }))
    };

    try {
      const res = await fetch(`/api/admin/prescriptions/${encodeURIComponent(targetId)}/review`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const d = await res.json();
        if (d.prescription) {
          rx.status = d.prescription.status;
          rx.pharmacist_notes = d.prescription.pharmacist_notes;
          rx.prescribed_items = d.prescription.prescribed_items || [];
        }
      } else {
        rx.status = status;
      }
    } catch (e) {
      rx.status = status;
    }
    if (rxReviewModal) rxReviewModal.classList.remove("active");
    renderPrescriptionsList();
    const msg = status === "Reviewed"
      ? `Prescription ${rx.id} verified with ${(rx.prescribed_items || []).length} item(s)!`
      : `Prescription ${rx.id} marked as ${status}.`;
    showToast(msg, status === "Reviewed" ? "success" : "info");
  }

  function openRxReviewModal(id) {
    const rx = adminState.prescriptions.find(r => r.id === id || r.mongoId === id);
    if (!rx || !rxReviewContent || !rxReviewModal) return;

    let workingItems = Array.isArray(rx.prescribed_items)
      ? rx.prescribed_items.map(it => {
        const med = (it.medicine_id && typeof it.medicine_id === "object")
          ? it.medicine_id
          : adminState.products.find(p => p._id === it.medicine_id);
        return {
          medicine_id: (med && med._id) || it.medicine_id,
          name: (med && med.name) || it.name || "Medicine",
          brand: (med && med.brand) || "",
          price: (med && med.price) || 0,
          image: (med && med.image) || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80",
          dosage: it.dosage || "",
          quantity: it.quantity || 1
        };
      })
      : [];

    const renderAssignedMedsHtml = () => {
      if (workingItems.length === 0) {
        return `<div class="text-muted small p-2 border rounded bg-light">No medicines attached yet. Search below to add from inventory.</div>`;
      }
      return workingItems.map((m, idx) => `
        <div class="d-flex align-items-center justify-content-between p-2 border rounded bg-white flex-wrap gap-2">
          <div class="d-flex align-items-center gap-2">
            <img src="${m.image}" alt="${m.name}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;">
            <div>
              <div class="fw-bold small">${m.name}</div>
              <div class="text-muted" style="font-size:0.75rem;">₹${m.price} • ${m.brand || "MedCare"}</div>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <input type="text" class="form-control form-control-sm adm-rx-dosage" data-idx="${idx}" value="${m.dosage || ''}" placeholder="Dosage (e.g. 1-0-1)" style="width:130px;">
            <button type="button" class="btn btn-sm btn-outline-secondary py-0 px-2 adm-rx-dec" data-idx="${idx}">-</button>
            <span class="fw-bold small">${m.quantity || 1}</span>
            <button type="button" class="btn btn-sm btn-outline-secondary py-0 px-2 adm-rx-inc" data-idx="${idx}">+</button>
            <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2 adm-rx-rem" data-idx="${idx}">&times;</button>
          </div>
        </div>
      `).join("");
    };

    const fileUrl = rx.file_url || rx.image || "";
    const isPdf = fileUrl.toLowerCase().endsWith(".pdf");

    rxReviewContent.innerHTML = `
      <div class="row g-3">
        <div class="col-md-5 text-center">
          <a href="${fileUrl}" target="_blank" title="Click to open full size">
            ${isPdf ? `
              <div class="p-4 border rounded bg-light">
                <i class="fa-solid fa-file-pdf text-danger fs-1 mb-2"></i>
                <div class="small fw-bold">Open PDF Prescription</div>
              </div>
            ` : `<img src="${fileUrl}" alt="Prescription Slip" class="img-fluid rounded border shadow-sm" style="max-height:260px;object-fit:contain;width:100%;background:#f8fafc;">`}
          </a>
          <div class="small text-muted mt-2"><i class="fa-solid fa-magnifying-glass-plus me-1"></i> Click to open full file</div>
        </div>
        <div class="col-md-7">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="fw-bold m-0">${rx.patient_name || rx.patient}</h5>
            <span class="badge ${rx.status === 'Reviewed' || rx.status === 'Converted_To_Cart' ? 'bg-success' : rx.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'}">${rx.status || 'Pending'}</span>
          </div>
          <div class="small text-muted mb-2"><strong>Rx ID:</strong> ${rx.id} &bull; <strong>Uploaded:</strong> ${rx.date}</div>
          <div class="small mb-1"><strong>Phone:</strong> ${rx.patient_phone || rx.phone || 'N/A'} &bull; <strong>Email:</strong> ${rx.email || 'N/A'}</div>
          ${rx.notes_by_patient ? `<div class="p-2 bg-light border rounded small mt-2"><strong>Patient Notes:</strong> ${rx.notes_by_patient}</div>` : ''}
        </div>
      </div>

      <hr class="my-3">

      <div class="mb-3">
        <label class="form-label fw-bold small">Attach Prescribed Inventory Items &amp; Dosage:</label>
        <div class="position-relative mb-2">
          <input type="text" id="admRxMedSearch" class="form-control form-control-sm" placeholder="Search medicine catalog by name or brand...">
          <div id="admRxMedDropdown" class="list-group position-absolute w-100 shadow-sm" style="z-index:30;max-height:180px;overflow-y:auto;display:none;"></div>
        </div>
        <div id="admRxAssignedList" class="d-flex flex-column gap-2">${renderAssignedMedsHtml()}</div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold small" for="admRxPharmacistNotes">Pharmacist Verification / Rejection Notes:</label>
        <textarea id="admRxPharmacistNotes" class="form-control form-control-sm" rows="2" placeholder="Enter dosage instructions or rejection reason...">${rx.pharmacist_notes || ''}</textarea>
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-outline-danger" id="admRxRejectBtn">
          <i class="fa-solid fa-xmark me-1"></i> Reject Rx
        </button>
        <button type="button" class="btn btn-success" id="admRxApproveBtn">
          <i class="fa-solid fa-check me-1"></i> Mark Reviewed &amp; Save Items
        </button>
      </div>
    `;

    const assignedListEl = document.getElementById("admRxAssignedList");
    const bindMedItemActions = () => {
      assignedListEl.innerHTML = renderAssignedMedsHtml();
      assignedListEl.querySelectorAll(".adm-rx-dosage").forEach(inp => inp.addEventListener("input", () => {
        workingItems[parseInt(inp.dataset.idx, 10)].dosage = inp.value;
      }));
      assignedListEl.querySelectorAll(".adm-rx-dec").forEach(b => b.addEventListener("click", () => {
        const i = parseInt(b.dataset.idx, 10);
        if (workingItems[i].quantity > 1) workingItems[i].quantity--;
        else workingItems.splice(i, 1);
        bindMedItemActions();
      }));
      assignedListEl.querySelectorAll(".adm-rx-inc").forEach(b => b.addEventListener("click", () => {
        const i = parseInt(b.dataset.idx, 10);
        workingItems[i].quantity = (workingItems[i].quantity || 1) + 1;
        bindMedItemActions();
      }));
      assignedListEl.querySelectorAll(".adm-rx-rem").forEach(b => b.addEventListener("click", () => {
        workingItems.splice(parseInt(b.dataset.idx, 10), 1);
        bindMedItemActions();
      }));
    };
    bindMedItemActions();

    const searchInput = document.getElementById("admRxMedSearch");
    const dropdown = document.getElementById("admRxMedDropdown");
    if (searchInput && dropdown) {
      searchInput.addEventListener("input", () => {
        const q = searchInput.value.trim().toLowerCase();
        if (q.length < 2) { dropdown.style.display = "none"; return; }
        const matches = adminState.products.filter(p => p.name.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q))).slice(0, 6);
        if (matches.length === 0) { dropdown.style.display = "none"; return; }
        dropdown.innerHTML = matches.map(m => `
          <button type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center adm-rx-pick" data-id="${m._id || m.id}">
            <span><strong>${m.name}</strong> <small class="text-muted">(${m.brand})</small></span>
            <span class="badge bg-primary">₹${m.price}</span>
          </button>
        `).join("");
        dropdown.style.display = "block";
        dropdown.querySelectorAll(".adm-rx-pick").forEach(btn => {
          btn.addEventListener("click", () => {
            const med = adminState.products.find(x => (x._id || x.id) === btn.dataset.id);
            if (med) {
              const medObjId = med._id || med.id;
              const ex = workingItems.find(w => w.medicine_id === medObjId);
              if (ex) ex.quantity = (ex.quantity || 1) + 1;
              else workingItems.push({ medicine_id: medObjId, name: med.name, brand: med.brand, price: med.price, image: med.image, dosage: "1 tab daily", quantity: 1 });
              bindMedItemActions();
            }
            searchInput.value = "";
            dropdown.style.display = "none";
          });
        });
      });
    }

    document.getElementById("admRxApproveBtn")?.addEventListener("click", () => {
      const pNotes = document.getElementById("admRxPharmacistNotes")?.value || "";
      savePrescriptionDecision(rx, "Reviewed", workingItems, pNotes);
    });
    document.getElementById("admRxRejectBtn")?.addEventListener("click", () => {
      const pNotes = document.getElementById("admRxPharmacistNotes")?.value || "";
      savePrescriptionDecision(rx, "Rejected", workingItems, pNotes);
    });

    rxReviewModal.classList.add("active");
  }

  function renderPrescriptionsList() {
    if (!adminPrescriptionsList) return;

    const pendingList = adminState.prescriptions.filter(r => (r.status || "Pending") === "Pending");
    const renderCards = (list) => {
      if (list.length === 0) {
        return `
          <div class="p-4 text-center text-muted">
            <i class="fa-solid fa-clipboard-check fs-2 text-success d-block mb-2"></i>
            No prescriptions in this view.
          </div>
        `;
      }
      return list.map(rx => {
        const st = rx.status || "Pending";
        const badgeCls = st === "Reviewed" || st === "Converted_To_Cart" ? "bg-success-subtle text-success" : st === "Rejected" ? "bg-danger-subtle text-danger" : "bg-warning-subtle text-dark";
        const fileUrl = rx.file_url || rx.image || "";
        const items = Array.isArray(rx.prescribed_items) ? rx.prescribed_items : [];
        const medLine = items.length > 0
          ? items.map(it => `${(it.medicine_id && it.medicine_id.name) || it.name || "Item"} (${it.quantity || 1}x)`).join(", ")
          : (rx.notes_by_patient || "Awaiting medicine assignment");
        return `
          <div class="p-3 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div class="d-flex align-items-center gap-3">
              <img src="${fileUrl}" alt="Prescription" style="width: 56px; height: 56px; object-fit: cover; border-radius: 8px; border: 1px solid #d1d5db; cursor:pointer;" class="btn-review-rx" data-id="${rx.id}">
              <div>
                <div class="fw-bold text-dark">
                  ${rx.patient_name || rx.patient}
                  <span class="badge bg-primary-subtle text-primary ms-2">${rx.id}</span>
                  <span class="badge ${badgeCls} ms-1">${st}</span>
                </div>
                <div class="text-muted small">Phone: ${rx.patient_phone || rx.phone || 'N/A'} &bull; Uploaded ${rx.date}</div>
                <div class="text-primary small mt-1"><strong>Rx:</strong> ${medLine}</div>
                ${rx.pharmacist_notes ? `<div class="text-success small"><strong>Pharmacist:</strong> ${rx.pharmacist_notes}</div>` : ''}
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <button class="btn btn-sm btn-primary btn-review-rx" data-id="${rx.id}">
                <i class="fa-solid fa-stethoscope me-1"></i> Review &amp; Assign
              </button>
              ${st === "Pending" ? `
                <button class="btn btn-sm btn-success btn-approve-rx" data-id="${rx.id}" title="Mark Reviewed">
                  <i class="fa-solid fa-check"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-reject-rx" data-id="${rx.id}" title="Reject">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }).join("");
    };

    const bindRxContainer = (container) => {
      container.querySelectorAll(".btn-review-rx").forEach(btn => {
        btn.addEventListener("click", () => openRxReviewModal(btn.dataset.id));
      });
      container.querySelectorAll(".btn-approve-rx").forEach(btn => {
        btn.addEventListener("click", () => {
          const rx = adminState.prescriptions.find(r => r.id === btn.dataset.id);
          if (rx) savePrescriptionDecision(rx, "Reviewed");
        });
      });
      container.querySelectorAll(".btn-reject-rx").forEach(btn => {
        btn.addEventListener("click", () => {
          const rx = adminState.prescriptions.find(r => r.id === btn.dataset.id);
          if (rx) savePrescriptionDecision(rx, "Rejected");
        });
      });
    };

    adminPrescriptionsList.innerHTML = renderCards(pendingList);
    bindRxContainer(adminPrescriptionsList);

    const fullPrescriptionView = document.getElementById("viewPrescriptionsContent");
    if (fullPrescriptionView) {
      const filteredFull = adminState.rxFilter === "all"
        ? adminState.prescriptions
        : adminState.prescriptions.filter(r => (r.status || "Pending") === adminState.rxFilter);

      if (!adminState.selectedRxId || !filteredFull.some(r => r.id === adminState.selectedRxId)) {
        adminState.selectedRxId = filteredFull[0] ? filteredFull[0].id : null;
      }
      const activeRx = filteredFull.find(r => r.id === adminState.selectedRxId) || null;

      fullPrescriptionView.innerHTML = `
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div class="d-flex gap-2 flex-wrap">
            ${["all", "Pending", "Reviewed", "Rejected", "Converted_To_Cart"].map(f => `
              <button type="button" class="btn btn-sm ${adminState.rxFilter === f ? 'btn-primary' : 'btn-outline-secondary'} rx-filter-tab" data-filter="${f}">
                ${f.replace(/_/g, ' ')} (${f === 'all' ? adminState.prescriptions.length : adminState.prescriptions.filter(r => (r.status || 'Pending') === f).length})
              </button>
            `).join("")}
          </div>
          ${filteredFull.length > 0 ? `
            <select class="admin-select" id="splitRxSelector" style="min-width:260px;">
              ${filteredFull.map(r => `<option value="${r.id}" ${activeRx && r.id === activeRx.id ? 'selected' : ''}>${r.id} — ${r.patient_name || r.patient} (${r.status})</option>`).join("")}
            </select>
          ` : ''}
        </div>
        ${activeRx ? (() => {
          const fileUrl = activeRx.file_url || activeRx.image || "";
          const isPdf = fileUrl.toLowerCase().endsWith(".pdf");
          return `
            <div class="rx-split-desk">
              <div class="rx-viewer-pane">
                <div class="rx-viewer-toolbar">
                  <span class="small fw-semibold"><i class="fa-solid fa-file-medical me-1"></i> ${activeRx.id}</span>
                  <div class="d-flex gap-1">
                    <button type="button" class="btn btn-sm btn-outline-light" id="btnRxZoomOut" title="Zoom Out">-</button>
                    <button type="button" class="btn btn-sm btn-outline-light" id="btnRxZoomReset" title="Reset">100%</button>
                    <button type="button" class="btn btn-sm btn-outline-light" id="btnRxZoomIn" title="Zoom In">+</button>
                    <a href="${fileUrl}" target="_blank" class="btn btn-sm btn-primary ms-1">Open Full</a>
                  </div>
                </div>
                <div class="rx-zoom-canvas">
                  ${isPdf
              ? `<iframe src="${fileUrl}" style="width:100%;height:100%;border:none;border-radius:8px;background:#fff;"></iframe>`
              : `<img id="splitRxZoomImg" src="${fileUrl}" alt="Prescription" style="transform: scale(${adminState.rxZoom});">`}
                </div>
              </div>

              <div class="rx-assign-pane">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h5 class="fw-bold m-0">${activeRx.patient_name || activeRx.patient}</h5>
                  <span class="badge ${activeRx.status === 'Reviewed' || activeRx.status === 'Converted_To_Cart' ? 'bg-success' : activeRx.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'}">${activeRx.status}</span>
                </div>
                <div class="small text-muted mb-2">Phone: <strong>${activeRx.patient_phone || activeRx.phone || 'N/A'}</strong> &bull; Uploaded: ${activeRx.date}</div>
                ${activeRx.notes_by_patient ? `<div class="p-2 bg-light border rounded small mb-3"><strong>Patient Notes:</strong> ${activeRx.notes_by_patient}</div>` : ''}

                <label class="form-label fw-bold small">Autocomplete Medicine Selector (MongoDB Inventory):</label>
                <div class="position-relative mb-2">
                  <input type="text" id="splitRxMedSearch" class="form-control form-control-sm" placeholder="Type medicine name or composition...">
                  <div id="splitRxMedDropdown" class="list-group position-absolute w-100 shadow-sm" style="z-index:30;max-height:180px;overflow-y:auto;display:none;"></div>
                </div>
                <div id="splitRxAssignedList" class="d-flex flex-column gap-2 mb-3"></div>

                <label class="form-label fw-bold small" for="splitRxPharmacistNotes">Pharmacist Verification Notes:</label>
                <textarea id="splitRxPharmacistNotes" class="form-control form-control-sm mb-3" rows="2" placeholder="Dosage & clinical verification notes...">${activeRx.pharmacist_notes || ''}</textarea>

                <div class="d-flex gap-2 flex-wrap">
                  <button type="button" class="btn btn-success flex-fill" id="btnSplitApproveConvert">
                    <i class="fa-solid fa-cart-plus me-1"></i> Approve &amp; Send to Customer Cart
                  </button>
                  <button type="button" class="btn btn-outline-danger" id="btnSplitRejectReason">
                    <i class="fa-solid fa-xmark me-1"></i> Reject with Reason
                  </button>
                </div>
              </div>
            </div>
          `;
        })() : `<div class="p-4 text-center text-muted">No prescriptions found in this filter.</div>`}
      `;

      fullPrescriptionView.querySelectorAll(".rx-filter-tab").forEach(tab => {
        tab.addEventListener("click", () => {
          adminState.rxFilter = tab.dataset.filter;
          renderPrescriptionsList();
        });
      });

      document.getElementById("splitRxSelector")?.addEventListener("change", (e) => {
        adminState.selectedRxId = e.target.value;
        adminState.rxZoom = 1;
        renderPrescriptionsList();
      });

      if (activeRx) {
        const zoomImg = document.getElementById("splitRxZoomImg");
        document.getElementById("btnRxZoomIn")?.addEventListener("click", () => {
          adminState.rxZoom = Math.min(2.5, adminState.rxZoom + 0.25);
          if (zoomImg) zoomImg.style.transform = `scale(${adminState.rxZoom})`;
        });
        document.getElementById("btnRxZoomOut")?.addEventListener("click", () => {
          adminState.rxZoom = Math.max(0.75, adminState.rxZoom - 0.25);
          if (zoomImg) zoomImg.style.transform = `scale(${adminState.rxZoom})`;
        });
        document.getElementById("btnRxZoomReset")?.addEventListener("click", () => {
          adminState.rxZoom = 1;
          if (zoomImg) zoomImg.style.transform = `scale(1)`;
        });

        let splitItems = Array.isArray(activeRx.prescribed_items)
          ? activeRx.prescribed_items.map(it => {
            const med = (it.medicine_id && typeof it.medicine_id === "object")
              ? it.medicine_id
              : adminState.products.find(p => p._id === it.medicine_id);
            return {
              medicine_id: (med && med._id) || it.medicine_id,
              name: (med && med.name) || it.name || "Medicine",
              price: (med && med.price) || 0,
              dosage: it.dosage || "1 tab daily",
              quantity: it.quantity || 1
            };
          })
          : [];

        const splitListEl = document.getElementById("splitRxAssignedList");
        const renderSplitItems = () => {
          if (!splitListEl) return;
          if (splitItems.length === 0) {
            splitListEl.innerHTML = `<div class="text-muted small p-2 border rounded bg-light">No medicines attached yet. Search above to pick from inventory.</div>`;
            return;
          }
          splitListEl.innerHTML = splitItems.map((m, idx) => `
            <div class="d-flex align-items-center justify-content-between p-2 border rounded bg-light flex-wrap gap-2">
              <div>
                <div class="fw-bold small">${m.name}</div>
                <div class="text-muted" style="font-size:0.75rem;">₹${m.price}</div>
              </div>
              <div class="d-flex align-items-center gap-1">
                <input type="text" class="form-control form-control-sm split-rx-dosage" data-idx="${idx}" value="${m.dosage}" placeholder="Instructions" style="width:120px;">
                <button type="button" class="btn btn-sm btn-outline-secondary py-0 px-2 split-rx-dec" data-idx="${idx}">-</button>
                <span class="fw-bold small px-1">${m.quantity}</span>
                <button type="button" class="btn btn-sm btn-outline-secondary py-0 px-2 split-rx-inc" data-idx="${idx}">+</button>
                <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2 split-rx-rem" data-idx="${idx}">&times;</button>
              </div>
            </div>
          `).join("");

          splitListEl.querySelectorAll(".split-rx-dosage").forEach(inp => inp.addEventListener("input", () => {
            splitItems[parseInt(inp.dataset.idx, 10)].dosage = inp.value;
          }));
          splitListEl.querySelectorAll(".split-rx-dec").forEach(b => b.addEventListener("click", () => {
            const i = parseInt(b.dataset.idx, 10);
            if (splitItems[i].quantity > 1) splitItems[i].quantity--;
            else splitItems.splice(i, 1);
            renderSplitItems();
          }));
          splitListEl.querySelectorAll(".split-rx-inc").forEach(b => b.addEventListener("click", () => {
            splitItems[parseInt(b.dataset.idx, 10)].quantity++;
            renderSplitItems();
          }));
          splitListEl.querySelectorAll(".split-rx-rem").forEach(b => b.addEventListener("click", () => {
            splitItems.splice(parseInt(b.dataset.idx, 10), 1);
            renderSplitItems();
          }));
        };
        renderSplitItems();

        const sInput = document.getElementById("splitRxMedSearch");
        const sDrop = document.getElementById("splitRxMedDropdown");
        if (sInput && sDrop) {
          sInput.addEventListener("input", () => {
            const q = sInput.value.trim().toLowerCase();
            if (q.length < 2) { sDrop.style.display = "none"; return; }
            const matches = adminState.products.filter(p => p.name.toLowerCase().includes(q) || (p.composition && p.composition.toLowerCase().includes(q))).slice(0, 6);
            if (matches.length === 0) { sDrop.style.display = "none"; return; }
            sDrop.innerHTML = matches.map(m => `
              <button type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center split-rx-pick" data-id="${m._id || m.id}">
                <span><strong>${m.name}</strong> <small class="text-muted">(${m.stock != null ? m.stock : 25} in stock)</small></span>
                <span class="badge bg-primary">₹${m.price}</span>
              </button>
            `).join("");
            sDrop.style.display = "block";
            sDrop.querySelectorAll(".split-rx-pick").forEach(btn => {
              btn.addEventListener("click", () => {
                const med = adminState.products.find(x => (x._id || x.id) === btn.dataset.id);
                if (med) {
                  const mid = med._id || med.id;
                  const ex = splitItems.find(w => w.medicine_id === mid);
                  if (ex) ex.quantity++;
                  else splitItems.push({ medicine_id: mid, name: med.name, price: med.price, dosage: "1 tab twice daily", quantity: 1 });
                  renderSplitItems();
                }
                sInput.value = "";
                sDrop.style.display = "none";
              });
            });
          });
        }

        document.getElementById("btnSplitApproveConvert")?.addEventListener("click", async () => {
          const pNotes = document.getElementById("splitRxPharmacistNotes")?.value || "";
          const token = localStorage.getItem("medcare_token");
          const targetId = activeRx.mongoId || activeRx.id;
          try {
            const res = await fetch(`/api/admin/prescriptions/${encodeURIComponent(targetId)}/review`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
              },
              body: JSON.stringify({
                status: "Reviewed",
                pharmacist_notes: pNotes,
                prescribed_items: splitItems.map(it => ({ medicine_id: it.medicine_id, dosage: it.dosage, quantity: it.quantity })),
                approveAndConvert: splitItems.length > 0
              })
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error || "Failed to approve");
            if (d.prescription) {
              activeRx.status = d.prescription.status;
              activeRx.pharmacist_notes = d.prescription.pharmacist_notes;
              activeRx.prescribed_items = d.prescription.prescribed_items || [];
            }
            renderPrescriptionsList();
            syncOverviewFromAPI();
            showToast(splitItems.length > 0 ? "Approved & sent directly to customer's Cart!" : "Prescription marked Reviewed!", "success");
          } catch (err) {
            showToast(err.message || "Error approving prescription", "danger");
          }
        });

        document.getElementById("btnSplitRejectReason")?.addEventListener("click", () => {
          const rejectModal = document.getElementById("rxRejectReasonModal");
          const rejectInput = document.getElementById("rxRejectReasonInput");
          const confirmBtn = document.getElementById("confirmRxRejectBtn");
          if (!rejectModal || !confirmBtn) return;
          if (rejectInput) rejectInput.value = activeRx.pharmacist_notes || "";
          rejectModal.classList.add("active");
          confirmBtn.onclick = () => {
            const reason = (rejectInput && rejectInput.value.trim()) || "Prescription unclear. Please upload a clearer photo.";
            rejectModal.classList.remove("active");
            savePrescriptionDecision(activeRx, "Rejected", splitItems, reason);
          };
        });
      }
    }
  }

  // 9. Critical Alert Table (Stock < 10 or Expiring <= 30 days)
  function renderLowStockTable() {
    if (!adminLowStockTableBody) return;
    const alerts = adminState.criticalAlerts && adminState.criticalAlerts.length > 0
      ? adminState.criticalAlerts
      : adminState.products.filter(p => (p.stock != null ? p.stock : 25) < 10).map(p => ({
        id: p.id, name: p.name, batchNo: p.batchNo || 'MC-2026-A1', expiryDate: p.expiryDate || '2027-06-30', stock: p.stock || 0, alertType: 'Low Stock (<10)'
      }));

    if (alerts.length === 0) {
      adminLowStockTableBody.innerHTML = `
        <tr><td colspan="5" class="text-center py-3 text-success small"><i class="fa-solid fa-circle-check me-1"></i> All inventory stock &amp; expiry dates are healthy!</td></tr>
      `;
      return;
    }

    adminLowStockTableBody.innerHTML = alerts.map(item => `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td><span class="small text-muted">${item.batchNo} &bull; ${item.expiryDate}</span></td>
        <td><span class="text-danger fw-bold">${item.stock} left</span></td>
        <td><span class="badge bg-danger-subtle text-danger">${item.alertType}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-primary btn-quick-restock" data-id="${item.id}">
            <i class="fa-solid fa-plus me-1"></i> +10 Stock
          </button>
        </td>
      </tr>
    `).join("");

    adminLowStockTableBody.querySelectorAll(".btn-quick-restock").forEach(btn => {
      btn.addEventListener("click", () => adjustMedicineStock(btn.dataset.id, 10));
    });
  }

  window.medCareRestock = function (name) {
    showToast(`Purchase Order created: +50 units dispatched for ${name}`, "success");
  };

  // Toast Helper
  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `medcare-toast toast-${type}`;
    const icon = type === "success" ? "fa-circle-check" : type === "danger" ? "fa-circle-xmark" : "fa-circle-info";

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span class="toast-text">${message}</span>
      <button class="toast-close">&times;</button>
    `;

    container.appendChild(toast);
    toast.querySelector(".toast-close").addEventListener("click", () => toast.remove());

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // 10. Initial Render & Sync from MongoDB
  renderSalesChart("weekly");
  renderProductsTable();
  renderOrdersTable();
  renderCustomersTable();
  renderPrescriptionsList();
  renderLowStockTable();

  async function syncOverviewFromAPI() {
    const token = localStorage.getItem("medcare_token");
    if (!token) return;
    try {
      const res = await fetch("/api/admin/overview", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const d = await res.json();
      if (d.metrics) {
        const revEl = document.getElementById("kpiTotalRevenue");
        const ordEl = document.getElementById("kpiTotalOrders");
        const rxEl = document.getElementById("kpiPendingRx");
        const lowEl = document.getElementById("kpiLowStock");
        if (revEl) revEl.textContent = `₹${Number(d.metrics.totalRevenue || 0).toLocaleString("en-IN")}`;
        if (ordEl) ordEl.textContent = d.metrics.totalOrders || 0;
        if (rxEl) rxEl.textContent = d.metrics.pendingPrescriptions || 0;
        if (lowEl) lowEl.textContent = d.metrics.lowStockAlerts || 0;
      }
      if (Array.isArray(d.criticalAlerts)) {
        adminState.criticalAlerts = d.criticalAlerts;
        renderLowStockTable();
      }
    } catch (e) { }
  }

  async function syncAdminFromAPI() {
    const token = localStorage.getItem("medcare_token");
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      await syncOverviewFromAPI();
      const [medRes, ordRes, rxRes, usrRes] = await Promise.all([
        fetch("/api/admin/medicines?limit=200", { headers: authHeaders }),
        fetch("/api/admin/orders", { headers: authHeaders }),
        fetch("/api/admin/prescriptions?status=all", { headers: authHeaders }),
        fetch("/api/admin/users", { headers: authHeaders })
      ]);

      if (medRes.ok) {
        const d = await medRes.json();
        if (Array.isArray(d.medicines) && d.medicines.length > 0) {
          adminState.products = d.medicines;
          renderProductsTable();
        }
      }
      if (ordRes.ok) {
        const d = await ordRes.json();
        if (Array.isArray(d.orders) && d.orders.length > 0) {
          adminState.orders = d.orders.map(o => ({
            id: o.orderId,
            customer: o.customer,
            email: o.userEmail || "customer@medcare.com",
            phone: o.phone || "",
            address: o.deliveryAddress,
            date: o.date,
            itemsCount: (o.items || []).reduce((s, i) => s + (i.quantity || 1), 0),
            items: (o.items || []).map(i => ({ name: i.name, qty: i.quantity || 1, price: i.price })),
            total: o.total,
            paymentMethod: o.paymentMethod,
            status: o.status
          }));
          renderOrdersTable();
        }
      }
      if (rxRes.ok) {
        const d = await rxRes.json();
        if (Array.isArray(d.prescriptions) && d.prescriptions.length > 0) {
          adminState.prescriptions = d.prescriptions.map(rx => ({
            mongoId: rx._id,
            id: rx.rxId || rx._id,
            patient_name: rx.patient_name || rx.patient || "Patient",
            patient_phone: rx.patient_phone || rx.phone || "",
            email: (rx.user_id && rx.user_id.email) || rx.userEmail || "",
            notes_by_patient: rx.notes_by_patient || rx.notes || "",
            pharmacist_notes: rx.pharmacist_notes || "",
            status: rx.status || "Pending",
            date: rx.uploaded_at
              ? new Date(rx.uploaded_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
              : (rx.date || "Recent"),
            prescribed_items: rx.prescribed_items || [],
            file_url: rx.file_url || rx.image || ""
          }));
          renderPrescriptionsList();
        }
      }
      if (usrRes.ok) {
        const d = await usrRes.json();
        if (Array.isArray(d.users) && d.users.length > 0) {
          adminState.customers = d.users.map((u, idx) => ({
            id: `USR-${100 + idx}`,
            name: u.name,
            email: u.email,
            phone: u.phone || "N/A",
            city: "Registered",
            ordersCount: 0,
            totalSpend: u.walletBalance || 0,
            status: "Active",
            joinDate: u.memberSince || "Recent"
          }));
          renderCustomersTable();
        }
      }
    } catch (e) {
      // Keep static fallback if offline
    }
  }
  // Role-Based Auth Gate for Admin / Pharmacist Portal
  const adminAuthOverlay = document.getElementById("adminAuthOverlay");
  const adminGateLoginForm = document.getElementById("adminGateLoginForm");
  const btnFillAdminDemo = document.getElementById("btnFillAdminDemo");

  if (btnFillAdminDemo) {
    btnFillAdminDemo.addEventListener("click", () => {
      document.getElementById("adminGateEmail").value = "admin@medcare.com";
      document.getElementById("adminGatePassword").value = "Admin@123";
    });
  }

  document.getElementById("closeRxRejectModalBtn")?.addEventListener("click", () => {
    document.getElementById("rxRejectReasonModal")?.classList.remove("active");
  });
  document.getElementById("cancelRxRejectBtn")?.addEventListener("click", () => {
    document.getElementById("rxRejectReasonModal")?.classList.remove("active");
  });

  function checkAdminAccess() {
    const token = localStorage.getItem("medcare_token");
    const user = JSON.parse(localStorage.getItem("medcare_user") || "null");
    if (token && user && (user.role === "admin" || user.role === "pharmacist")) {
      if (adminAuthOverlay) adminAuthOverlay.classList.remove("active");
      syncAdminFromAPI();
    } else if (adminAuthOverlay) {
      adminAuthOverlay.classList.add("active");
    }
  }

  if (adminGateLoginForm) {
    adminGateLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const identifier = document.getElementById("adminGateEmail").value.trim();
      const password = document.getElementById("adminGatePassword").value;
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");
        if (!data.user || !["admin", "pharmacist"].includes(data.user.role)) {
          throw new Error("Access denied: Admin or Pharmacist role required.");
        }
        localStorage.setItem("medcare_token", data.token);
        localStorage.setItem("medcare_user", JSON.stringify(data.user));
        showToast(`Welcome, ${data.user.name}!`, "success");
        checkAdminAccess();
      } catch (err) {
        showToast(err.message || "Authentication failed", "danger");
      }
    });
  }

  checkAdminAccess();
});
