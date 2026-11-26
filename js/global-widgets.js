// MedCare Online Pharmacy - Global Widgets & Micro-interactions

// Ensure Dynamic Navbar Controller is loaded on every page
if (typeof window.medCareRenderNavbar !== "function" && !document.querySelector('script[src*="navbar.js"]')) {
  const navScript = document.createElement("script");
  navScript.src = "js/navbar.js";
  document.head.appendChild(navScript);
}

// Global Performance Utilities: Debounce & Skeleton Toggler
window.medCareDebounce = function (fn, delay = 150) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

window.medCareShowSkeletons = function (container, count = 4) {
  if (!container) return;
  container.innerHTML = Array.from({ length: count }).map(() => `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton skeleton-line short"></div>
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-btn"></div>
    </div>
  `).join("");
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Sync Cart Count Badges on Every Page
  function syncHeaderCartBadges() {
    try {
      const cart = JSON.parse(localStorage.getItem("medcare_cart")) || [];
      const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      document.querySelectorAll(".cart-count-badge, #headerCartCount").forEach(badge => {
        badge.textContent = totalCount;
        badge.style.display = totalCount > 0 ? "inline-flex" : "none";
      });
    } catch (e) {
      console.warn("Unable to sync cart badges", e);
    }
  }
  syncHeaderCartBadges();
  window.addEventListener("storage", syncHeaderCartBadges);

  // 1b. MongoDB User Sync for Cart, Wishlist, Wallet & Coins
  (function initUserMongoSync() {
    const token = localStorage.getItem("medcare_token");
    if (!token) return;

    const origSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function (key, value) {
      origSetItem(key, value);
      const activeToken = localStorage.getItem("medcare_token");
      if (!activeToken) return;

      if (key === "medcare_cart") {
        localStorage.removeItem("medCareCart");
        try {
          const cart = JSON.parse(value) || [];
          fetch("/api/user/cart", {
            method: "PUT",
            keepalive: true,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${activeToken}` },
            body: JSON.stringify({ cart })
          }).catch(() => {});
        } catch (e) {}
      } else if (key === "medcare_wishlist") {
        localStorage.removeItem("medCareWishlist");
        try {
          const wishlist = JSON.parse(value) || [];
          fetch("/api/user/wishlist", {
            method: "PUT",
            keepalive: true,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${activeToken}` },
            body: JSON.stringify({ wishlist })
          }).catch(() => {});
        } catch (e) {}
      }
    };

    fetch("/api/user/sync", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (!data) return;
        // Only hydrate cart/wishlist from server if localStorage key does not exist yet (e.g. fresh session),
        // never overwrite an intentionally emptied local cart ("[]")!
        if (localStorage.getItem("medcare_cart") === null && Array.isArray(data.cart) && data.cart.length > 0) {
          origSetItem("medcare_cart", JSON.stringify(data.cart));
          syncHeaderCartBadges();
        }
        if (localStorage.getItem("medcare_wishlist") === null && Array.isArray(data.wishlist) && data.wishlist.length > 0) {
          origSetItem("medcare_wishlist", JSON.stringify(data.wishlist));
        }
        if (Array.isArray(data.addresses) && data.addresses.length > 0) {
          origSetItem("medcare_addresses", JSON.stringify(data.addresses));
        }
        const user = JSON.parse(localStorage.getItem("medcare_user") || "null");
        if (user) {
          if (data.walletBalance != null) user.walletBalance = data.walletBalance;
          if (data.medcareCoins != null) user.medcareCoins = data.medcareCoins;
          origSetItem("medcare_user", JSON.stringify(user));
        }
      })
      .catch(() => {});
  })();

  // 2. Global Back to Top Button (Passive Scroll Listener)
  const backToTopBtn = document.getElementById("backToTopBtn");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    }, { passive: true });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 3. Global Cookie Consent Banner
  const cookieBanner = document.getElementById("cookieConsentBanner");
  const btnAcceptCookies = document.getElementById("btnAcceptCookies");
  const btnDeclineCookies = document.getElementById("btnDeclineCookies");

  if (cookieBanner) {
    const consent = localStorage.getItem("medcare_cookie_consent");
    if (!consent) {
      setTimeout(() => {
        cookieBanner.classList.add("show");
      }, 1200);
    }

    if (btnAcceptCookies) {
      btnAcceptCookies.addEventListener("click", () => {
        localStorage.setItem("medcare_cookie_consent", "accepted");
        cookieBanner.classList.remove("show");
      });
    }

    if (btnDeclineCookies) {
      btnDeclineCookies.addEventListener("click", () => {
        localStorage.setItem("medcare_cookie_consent", "declined");
        cookieBanner.classList.remove("show");
      });
    }
  }

  // 4. Global Mobile Drawer Navigation Toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const closeMobileNav = document.getElementById("closeMobileNav");

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileNav.classList.add("open");
    });
  }
  if (closeMobileNav && mobileNav) {
    closeMobileNav.addEventListener("click", () => {
      mobileNav.classList.remove("open");
    });
  }

  // Close mobile drawer when clicking a link inside it
  if (mobileNav) {
    mobileNav.querySelectorAll(".mobile-nav-link").forEach(link => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
      });
    });
  }

  // 5. Global Search Redirect (Header Search input)
  const headerSearchInput = document.getElementById("searchInput");
  if (headerSearchInput) {
    headerSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && headerSearchInput.value.trim()) {
        window.location.href = `search.html?q=${encodeURIComponent(headerSearchInput.value.trim())}`;
      }
    });

    const searchBtn = headerSearchInput.closest(".search-input-wrapper")?.querySelector(".search-btn");
    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        if (headerSearchInput.value.trim()) {
          window.location.href = `search.html?q=${encodeURIComponent(headerSearchInput.value.trim())}`;
        }
      });
    }
  }
});
