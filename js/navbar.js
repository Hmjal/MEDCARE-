// MedCare+ Dynamic Navbar & Session Controller (Runs across all pages)
(function () {
  const DEFAULT_AVATAR =
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";

  function clearSessionStorage() {
    localStorage.removeItem("medcare_token");
    localStorage.removeItem("medcare_user");
    localStorage.removeItem("medCareUser");
    localStorage.removeItem("medcare_cart");
    localStorage.removeItem("medCareCart");
    localStorage.removeItem("medcare_wishlist");
    localStorage.removeItem("medCareWishlist");
    localStorage.removeItem("medcare_coupon");
    localStorage.removeItem("medcare_active_rx");
  }

  function logoutUser(redirectToHome = true) {
    clearSessionStorage();
    renderNavbar();
    if (redirectToHome) {
      window.location.href = "index.html";
    }
  }

  function getInitials(name) {
    const parts = String(name || "User").trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }

  function renderNavbar() {
    const token = localStorage.getItem("medcare_token");
    const user = JSON.parse(localStorage.getItem("medcare_user") || "null");
    const userGreeting = document.getElementById("userGreeting");
    const loginBtn = document.getElementById("loginBtn");
    const adminNavLink = document.getElementById("adminNavLink");
    const mobileLoginBtn = document.getElementById("mobileLoginBtn");

    if (!user) {
      if (userGreeting) userGreeting.innerHTML = "";
      if (loginBtn) loginBtn.style.display = "inline-flex";
      if (adminNavLink) adminNavLink.style.display = "none";
      if (mobileLoginBtn) mobileLoginBtn.style.display = "block";
      return;
    }

    if (loginBtn) loginBtn.style.display = "none";
    if (mobileLoginBtn) mobileLoginBtn.style.display = "none";

    const isAdminOrPharm = user.role === "admin" || user.role === "pharmacist";
    if (adminNavLink) {
      adminNavLink.style.display = "none";
    }

    if (!userGreeting) return;

    const firstName = (user.name || "User").split(" ")[0];
    const initials = getInitials(user.name);
    const avatarHtml = user.avatar
      ? `<img src="${user.avatar}" alt="${firstName}" class="mc-user-avatar">`
      : `<span class="mc-user-avatar d-inline-flex align-items-center justify-content-center bg-primary text-white fw-bold" style="font-size:0.72rem;">${initials}</span>`;
    const roleLabel = isAdminOrPharm
      ? (user.role === "admin" ? "Admin" : "Pharmacist")
      : "Customer";

    const menuItemsHtml = isAdminOrPharm
      ? `
        <a href="admin.html" class="mc-nav-dd-item"><i class="fa-solid fa-gauge-high text-primary"></i> Admin Dashboard</a>
        <a href="admin.html#products" class="mc-nav-dd-item"><i class="fa-solid fa-pills text-success"></i> Inventory Manager</a>
        <a href="admin.html#prescriptions" class="mc-nav-dd-item"><i class="fa-solid fa-file-medical text-warning"></i> Review Prescriptions</a>
        <a href="dashboard.html#orders" class="mc-nav-dd-item"><i class="fa-solid fa-box text-info"></i> My Orders</a>
        <a href="dashboard.html#settings" class="mc-nav-dd-item"><i class="fa-solid fa-gear text-secondary"></i> Account Settings</a>
      `
      : `
        <a href="dashboard.html#profile" class="mc-nav-dd-item"><i class="fa-regular fa-user text-primary"></i> My Profile</a>
        <a href="dashboard.html#orders" class="mc-nav-dd-item"><i class="fa-solid fa-box-archive text-success"></i> My Orders</a>
        <a href="dashboard.html#prescriptions" class="mc-nav-dd-item"><i class="fa-solid fa-file-prescription text-info"></i> My Prescriptions</a>
        <a href="dashboard.html#settings" class="mc-nav-dd-item"><i class="fa-solid fa-gear text-secondary"></i> Account Settings</a>
      `;

    userGreeting.innerHTML = `
      <div class="mc-user-dropdown" id="mcUserDropdown">
        <button type="button" class="mc-user-trigger" id="mcUserTrigger" aria-expanded="false" aria-haspopup="true">
          ${avatarHtml}
          <span class="mc-user-name">Hi, ${firstName}</span>
          <i class="fa-solid fa-chevron-down mc-user-caret"></i>
        </button>
        <div class="mc-user-menu" id="mcUserMenu" role="menu">
          <div class="mc-user-menu-head">
            <div class="fw-bold text-dark small">${user.name || "MedCare User"}</div>
            <div class="text-muted" style="font-size:0.74rem;">${user.email || ""}</div>
            <span class="badge ${isAdminOrPharm ? "bg-danger-subtle text-danger" : "bg-primary-subtle text-primary"} mt-1" style="font-size:0.68rem;">${roleLabel}</span>
          </div>
          <div class="mc-user-menu-list">
            ${menuItemsHtml}
            <div class="mc-nav-dd-divider"></div>
            <button type="button" class="mc-nav-dd-item text-danger" id="mcNavLogoutBtn">
              <i class="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>
        </div>
      </div>
    `;

    const dropdown = document.getElementById("mcUserDropdown");
    const trigger = document.getElementById("mcUserTrigger");
    const logoutBtn = document.getElementById("mcNavLogoutBtn");

    if (trigger && dropdown) {
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle("open");
        trigger.setAttribute("aria-expanded", String(isOpen));
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        logoutUser(true);
      });
    }
  }

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    const dd = document.getElementById("mcUserDropdown");
    if (dd && !dd.contains(e.target)) {
      dd.classList.remove("open");
      const trig = document.getElementById("mcUserTrigger");
      if (trig) trig.setAttribute("aria-expanded", "false");
    }
  });

  // Verify token with /api/auth/me in background so stale sessions auto-clean
  function verifySessionInBackground() {
    const token = localStorage.getItem("medcare_token");
    if (!token) return;

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        if (res.status === 401) {
          clearSessionStorage();
          renderNavbar();
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((data) => {
        if (data && data.user) {
          localStorage.setItem("medcare_user", JSON.stringify(data.user));
          renderNavbar();
        }
      })
      .catch(() => {});
  }

  // Auth Modal Handler (for index.html #authModal)
  function initAuthModalHandler() {
    const authModal = document.getElementById("authModal");
    if (!authModal) return;

    const tabs = authModal.querySelectorAll(".auth-tab");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const loginErrBox = document.getElementById("modalLoginError");
    const regErrBox = document.getElementById("modalRegisterError");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const mode = tab.getAttribute("data-tab");
        if (loginForm) loginForm.style.display = mode === "login" ? "block" : "none";
        if (registerForm) registerForm.style.display = mode === "register" ? "block" : "none";
        if (loginErrBox) loginErrBox.style.display = "none";
        if (regErrBox) regErrBox.style.display = "none";
      });
    });

    function showModalErr(box, msg) {
      if (!box) return;
      box.textContent = msg;
      box.style.display = "block";
    }

    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (loginErrBox) loginErrBox.style.display = "none";

        const email = document.getElementById("loginEmail")?.value.trim();
        const password = document.getElementById("loginPassword")?.value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        if (!email || !password) {
          showModalErr(loginErrBox, "Please enter your email and password.");
          return;
        }

        const origHtml = submitBtn ? submitBtn.innerHTML : "";
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i> Signing In...`;
        }

        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Invalid email or password");

          localStorage.setItem("medcare_token", data.token);
          localStorage.setItem("medcare_user", JSON.stringify(data.user));

          if (data.user.role === "admin" || data.user.role === "pharmacist") {
            window.location.href = "admin.html";
            return;
          }

          authModal.classList.remove("open");
          document.body.style.overflow = "";
          renderNavbar();
          if (window.medCareShowToast) {
            window.medCareShowToast(`Welcome back, ${data.user.name}!`, "success");
          }
        } catch (err) {
          showModalErr(loginErrBox, err.message || "Invalid email or password");
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origHtml;
          }
        }
      });
    }

    if (registerForm) {
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (regErrBox) regErrBox.style.display = "none";

        const name = document.getElementById("regName")?.value.trim();
        const email = document.getElementById("regEmail")?.value.trim();
        const phone = document.getElementById("regPhone")?.value.trim() || "9999999999";
        const password = document.getElementById("regPassword")?.value;
        const confirmPwd = document.getElementById("regConfirmPassword")?.value;
        const submitBtn = registerForm.querySelector('button[type="submit"]');

        if (!name || !email || !password) {
          showModalErr(regErrBox, "All fields are required.");
          return;
        }
        if (confirmPwd !== undefined && password !== confirmPwd) {
          showModalErr(regErrBox, "Passwords do not match.");
          return;
        }
        if (password.length < 6) {
          showModalErr(regErrBox, "Password must be at least 6 characters.");
          return;
        }

        const origHtml = submitBtn ? submitBtn.innerHTML : "";
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i> Creating Account...`;
        }

        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, password })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Registration failed");

          localStorage.setItem("medcare_token", data.token);
          localStorage.setItem("medcare_user", JSON.stringify(data.user));

          authModal.classList.remove("open");
          document.body.style.overflow = "";
          renderNavbar();
          if (window.medCareShowToast) {
            window.medCareShowToast(`Welcome to MedCare+, ${data.user.name}!`, "success");
          }
        } catch (err) {
          showModalErr(regErrBox, err.message || "Could not create account.");
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origHtml;
          }
        }
      });
    }
  }

  const HIMANSHU_DEFAULT_ADDRESS = {
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
    isDefault: true,
    type: "Home"
  };

  function syncHimanshuProfileInStorage() {
    try {
      const user = JSON.parse(localStorage.getItem("medcare_user") || "null");
      if (!user) return;
      const isHimanshu =
        String(user.name || "").toLowerCase().includes("himanshu") ||
        String(user.fullName || "").toLowerCase().includes("himanshu") ||
        String(user.email || "").toLowerCase() === "himanshu@example.com";

      if (!isHimanshu) return;

      const hasPuneAddress =
        Array.isArray(user.addresses) &&
        user.addresses.some(
          (a) =>
            String(a.pincode || a.pin || "") === "412105" &&
            String(a.city || "").toLowerCase() === "pune"
        );

      if (!hasPuneAddress) {
        const updatedUser = {
          ...user,
          id: user.id || "usr_101",
          name: "Himanshu",
          fullName: "Himanshu",
          email: user.email || "himanshu@example.com",
          phone: "+91 98765 43210",
          addresses: [HIMANSHU_DEFAULT_ADDRESS]
        };
        localStorage.setItem("medcare_user", JSON.stringify(updatedUser));
        localStorage.setItem("medcare_addresses", JSON.stringify([HIMANSHU_DEFAULT_ADDRESS]));
      }
    } catch (_) {}
  }

  function ensureCartButtonWorks() {
    const cartBtn = document.getElementById("cartBtn");
    if (!cartBtn || cartBtn.dataset.mcCartBound === "1") return;
    cartBtn.dataset.mcCartBound = "1";
    cartBtn.addEventListener("click", () => {
      const cartDrawer = document.getElementById("cartDrawer");
      const cartOverlay = document.getElementById("cartOverlay");
      if (cartDrawer && cartOverlay) {
        setTimeout(() => {
          if (!cartDrawer.classList.contains("open")) {
            cartDrawer.classList.add("open");
            cartOverlay.classList.add("open");
            document.body.style.overflow = "hidden";
          }
        }, 0);
      } else {
        window.location.href = "cart.html";
      }
    });
  }

  window.medCareRenderNavbar = renderNavbar;
  window.medCareLogout = logoutUser;

  document.addEventListener("DOMContentLoaded", () => {
    syncHimanshuProfileInStorage();
    renderNavbar();
    ensureCartButtonWorks();
    verifySessionInBackground();
    initAuthModalHandler();
  });
})();
