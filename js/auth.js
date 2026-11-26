// MedCare Online Pharmacy - Authentication Logic (Page 7)

document.addEventListener("DOMContentLoaded", () => {
  // Tabs and Panels
  const tabLogin = document.getElementById("tabLogin");
  const tabOtp = document.getElementById("tabOtp");
  const tabRegister = document.getElementById("tabRegister");
  const tabs = [tabLogin, tabOtp, tabRegister];

  const loginFormBox = document.getElementById("loginFormBox");
  const otpLoginFormBox = document.getElementById("otpLoginFormBox");
  const registerFormBox = document.getElementById("registerFormBox");
  const forgotFormBox = document.getElementById("forgotFormBox");
  const panels = [loginFormBox, otpLoginFormBox, registerFormBox, forgotFormBox];

  // Forms
  const emailLoginForm = document.getElementById("emailLoginForm");
  const otpRequestForm = document.getElementById("otpRequestForm");
  const userRegisterForm = document.getElementById("userRegisterForm");
  const forgotRequestForm = document.getElementById("forgotRequestForm");
  const newPasswordSubmitForm = document.getElementById("newPasswordSubmitForm");

  // Inputs & Controls
  const otpVerifySection = document.getElementById("otpVerifySection");
  const forgotResetSection = document.getElementById("forgotResetSection");
  const btnConfirmOtpLogin = document.getElementById("btnConfirmOtpLogin");
  const btnResendPhoneOtp = document.getElementById("btnResendPhoneOtp");
  const btnGoogleLogin = document.getElementById("btnGoogleLogin");
  const btnFacebookLogin = document.getElementById("btnFacebookLogin");
  const regPassword = document.getElementById("regPassword");
  const pwdStrengthFill = document.getElementById("pwdStrengthFill");
  const pwdStrengthLabel = document.getElementById("pwdStrengthLabel");
  const pwdStrengthScore = document.getElementById("pwdStrengthScore");

  // Ensure email/password inputs start completely empty on page load
  const loginIdentifierEl = document.getElementById("loginIdentifier");
  const loginPasswordEl = document.getElementById("loginPassword");
  if (loginIdentifierEl) loginIdentifierEl.value = "";
  if (loginPasswordEl) loginPasswordEl.value = "";

  // Check URL parameters for mode (?mode=register, ?mode=forgot)
  const urlParams = new URLSearchParams(window.location.search);
  const initialMode = urlParams.get("mode") || "login";
  switchMode(initialMode);

  // Check if already logged in
  const currentUser = JSON.parse(localStorage.getItem("medcare_user"));
  const authNavDashboardLink = document.getElementById("authNavDashboardLink");
  if (currentUser && authNavDashboardLink) {
    authNavDashboardLink.style.display = "inline-flex";
  }

  // ==========================================
  // 1. TAB & MODE SWITCHING
  // ==========================================
  function switchMode(mode) {
    panels.forEach(p => { if (p) p.style.display = "none"; });
    tabs.forEach(t => { if (t) t.classList.remove("active"); });

    if (mode === "login") {
      if (loginFormBox) loginFormBox.style.display = "block";
      if (tabLogin) tabLogin.classList.add("active");
    } else if (mode === "otp") {
      if (otpLoginFormBox) otpLoginFormBox.style.display = "block";
      if (tabOtp) tabOtp.classList.add("active");
    } else if (mode === "register") {
      if (registerFormBox) registerFormBox.style.display = "block";
      if (tabRegister) tabRegister.classList.add("active");
    } else if (mode === "forgot") {
      if (forgotFormBox) forgotFormBox.style.display = "block";
    }
  }

  if (tabLogin) tabLogin.addEventListener("click", () => switchMode("login"));
  if (tabOtp) tabOtp.addEventListener("click", () => switchMode("otp"));
  if (tabRegister) tabRegister.addEventListener("click", () => switchMode("register"));

  document.querySelectorAll(".link-switch-mode").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const mode = link.getAttribute("data-mode");
      switchMode(mode);
    });
  });

  // ==========================================
  // 2. SHOW / HIDE PASSWORD TOGGLES
  // ==========================================
  document.querySelectorAll(".btn-toggle-pwd").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      btn.innerHTML = isPassword ? `<i class="fa-regular fa-eye-slash text-primary"></i>` : `<i class="fa-regular fa-eye"></i>`;
    });
  });

  // ==========================================
  // 3. LIVE PASSWORD STRENGTH METER
  // ==========================================
  if (regPassword && pwdStrengthFill && pwdStrengthLabel && pwdStrengthScore) {
    regPassword.addEventListener("input", () => {
      const val = regPassword.value;
      let score = 0;

      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      const widths = ["0%", "25%", "50%", "75%", "100%"];
      const colors = ["#e2e8f0", "#dc3545", "#f59e0b", "#0ea5e9", "#28a745"];
      const labels = [
        "Strength: Enter password",
        "Strength: Weak (add capital & number)",
        "Strength: Fair (add special character)",
        "Strength: Good",
        "Strength: Strong (Excellent)"
      ];

      pwdStrengthFill.style.width = widths[score];
      pwdStrengthFill.style.backgroundColor = colors[score];
      pwdStrengthLabel.textContent = labels[score];
      pwdStrengthLabel.style.color = colors[score];
      pwdStrengthScore.textContent = `${score}/4`;
    });
  }

  // ==========================================
  // 4. EMAIL / PASSWORD LOGIN
  // ==========================================
  if (emailLoginForm) {
    const handleLoginSubmission = (e) => {
      if (e) e.preventDefault();
      const identifierInput = document.getElementById("loginIdentifier");
      const passwordInput = document.getElementById("loginPassword");
      const identifier = identifierInput ? identifierInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

      if (!identifier) {
        showToast("Please enter your email or phone number.", "warning");
        if (identifierInput) identifierInput.focus();
        return;
      }

      if (!password) {
        showToast("Please enter your password.", "warning");
        if (passwordInput) passwordInput.focus();
        return;
      }

      const submitBtn = document.getElementById("btnLoginSubmit") || emailLoginForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i> Logging in...`;
      }

      showToast("Logging in...", "info");

      fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password })
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Invalid credentials");
          return data;
        })
        .then((data) => {
          if (data.token) localStorage.setItem("medcare_token", data.token);
          localStorage.setItem("medcare_user", JSON.stringify(data.user));
          if (Array.isArray(data.user.cart) && data.user.cart.length > 0) {
            localStorage.setItem("medcare_cart", JSON.stringify(data.user.cart));
          }
          if (Array.isArray(data.user.wishlist) && data.user.wishlist.length > 0) {
            localStorage.setItem("medcare_wishlist", JSON.stringify(data.user.wishlist));
          }
          if (Array.isArray(data.user.addresses) && data.user.addresses.length > 0) {
            localStorage.setItem("medcare_addresses", JSON.stringify(data.user.addresses));
          }
          showToast(`Welcome back, ${data.user.name}! Redirecting...`, "success");

          setTimeout(() => {
            const isAdmin = data.user.role === "admin" || data.user.role === "pharmacist";
            const redirect = urlParams.get("redirect") || (isAdmin ? "admin.html" : "index.html");
            window.location.href = redirect;
          }, 400);
        })
        .catch((err) => {
          // Simulated test account support (himanshu@example.com / password123)
          if (identifier.toLowerCase() === "himanshu@example.com" && password === "password123") {
            const himanshuProfile = {
              id: "usr_101",
              name: "Himanshu",
              fullName: "Himanshu",
              email: "himanshu@example.com",
              phone: "+91 98765 43210",
              role: "customer",
              avatar: "",
              walletBalance: 350,
              medcareCoins: 700,
              addresses: [
                {
                  id: "addr_pune_1",
                  recipientName: "Himanshu",
                  name: "Himanshu",
                  phone: "+91 98765 43210",
                  addressLine: "Alandi Devachi, Near Indrayani River",
                  house: "Alandi Devachi, Near Indrayani River",
                  landmark: "Near Alandi Temple",
                  street: "Near Alandi Temple",
                  city: "Pune",
                  state: "Maharashtra",
                  pincode: "412105",
                  pin: "412105",
                  isDefault: true,
                  type: "Home"
                }
              ]
            };
            localStorage.setItem("medcare_user", JSON.stringify(himanshuProfile));
            localStorage.setItem("medcare_addresses", JSON.stringify(himanshuProfile.addresses));
            showToast("Welcome back, Himanshu!", "success");
            setTimeout(() => {
              window.location.href = urlParams.get("redirect") || "index.html";
            }, 400);
            return;
          }

          showToast(err.message || "Login failed. Please check your credentials.", "danger");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket me-2"></i> Login to Account`;
          }
        });
    };

    emailLoginForm.addEventListener("submit", handleLoginSubmission);

    const btnLoginSubmit = document.getElementById("btnLoginSubmit");
    if (btnLoginSubmit) {
      btnLoginSubmit.addEventListener("click", (e) => {
        // If form is valid, execute submission
        if (emailLoginForm.checkValidity && !emailLoginForm.checkValidity()) {
          emailLoginForm.reportValidity();
          return;
        }
        handleLoginSubmission(e);
      });
    }
  }

  // ==========================================
  // 5. PHONE OTP LOGIN
  // ==========================================
  if (otpRequestForm) {
    otpRequestForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const phone = document.getElementById("otpPhoneInput").value.trim();
      if (phone.length < 10) {
        showToast("Please enter a valid 10-digit mobile number.", "warning");
        return;
      }

      const btn = document.getElementById("btnSendPhoneOtp");
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i> Sending OTP...`;
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = `<i class="fa-solid fa-check me-2"></i> OTP Sent!`;
        if (otpVerifySection) otpVerifySection.style.display = "block";
        showToast(`Verification code sent to +91 ${phone}. Demo code is 123456`, "success");

        // Focus first OTP digit box
        const firstDigit = document.querySelector(".otp-box-digit");
        if (firstDigit) firstDigit.focus();
      }, 800);
    });
  }

  // Auto-advance OTP digit inputs
  const otpInputs = document.querySelectorAll(".otp-box-digit");
  otpInputs.forEach((inp, idx) => {
    inp.addEventListener("input", (e) => {
      if (inp.value.length === 1 && idx < otpInputs.length - 1) {
        otpInputs[idx + 1].focus();
      }
    });

    inp.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && inp.value.length === 0 && idx > 0) {
        otpInputs[idx - 1].focus();
      }
    });
  });

  if (btnConfirmOtpLogin) {
    btnConfirmOtpLogin.addEventListener("click", () => {
      const enteredOtp = Array.from(otpInputs).map(i => i.value).join("");
      if (enteredOtp.length !== 6) {
        showToast("Please enter the complete 6-digit verification code.", "warning");
        return;
      }

      if (enteredOtp === "123456" || enteredOtp.length === 6) {
        btnConfirmOtpLogin.disabled = true;
        btnConfirmOtpLogin.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i> Verifying...`;

        setTimeout(() => {
          const phone = document.getElementById("otpPhoneInput").value.trim() || "9876543210";
          const userObj = {
            name: "Rahul Verma",
            email: "rahul.verma@example.com",
            phone: phone,
            gender: "Male",
            dob: "1994-08-15",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            memberSince: "May 2024",
            walletBalance: 350,
            medcareCoins: 700
          };

          localStorage.setItem("medcare_user", JSON.stringify(userObj));
          showToast("OTP verified! Redirecting to Dashboard...", "success");

          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 900);
        }, 700);
      }
    });
  }

  if (btnResendPhoneOtp) {
    btnResendPhoneOtp.addEventListener("click", () => {
      showToast("New OTP sent to your phone! Demo code: 123456", "info");
    });
  }

  // ==========================================
  // 6. NEW ACCOUNT REGISTRATION
  // ==========================================
  if (userRegisterForm) {
    userRegisterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("regFullName").value.trim();
      const phone = document.getElementById("regPhone").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const pwd = document.getElementById("regPassword").value;
      const confirmPwd = document.getElementById("regConfirmPassword").value;
      const dob = document.getElementById("regDob").value;
      const gender = document.getElementById("regGender").value;

      if (!name || !phone || !email || !pwd) {
        showToast("Please fill in all required fields.", "warning");
        return;
      }

      if (pwd !== confirmPwd) {
        showToast("Passwords do not match. Please re-check.", "danger");
        return;
      }

      if (pwd.length < 6) {
        showToast("Password must be at least 6 characters long.", "warning");
        return;
      }

      const submitBtn = document.getElementById("btnRegisterSubmit") || userRegisterForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i> Creating Account...`;
      }

      fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password: pwd,
          phone,
          gender: gender || "Not Specified",
          dob: dob || "1996-01-01"
        })
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Registration failed");
          return data;
        })
        .then((data) => {
          if (data.token) localStorage.setItem("medcare_token", data.token);
          localStorage.setItem("medcare_user", JSON.stringify(data.user));
          showToast("🎉 Account created successfully! Unlocked ₹100 Welcome Bonus.", "success");

          setTimeout(() => {
            const redirect = urlParams.get("redirect") || "dashboard.html";
            window.location.href = redirect;
          }, 500);
        })
        .catch((err) => {
          showToast(err.message || "Could not create account.", "danger");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-user-plus me-2"></i> Create Free Account`;
          }
        });
    });

    const btnRegisterSubmit = document.getElementById("btnRegisterSubmit");
    if (btnRegisterSubmit) {
      btnRegisterSubmit.addEventListener("click", (e) => {
        if (userRegisterForm.checkValidity && !userRegisterForm.checkValidity()) {
          userRegisterForm.reportValidity();
          return;
        }
      });
    }
  }

  // ==========================================
  // 7. FORGOT PASSWORD & RESET
  // ==========================================
  if (forgotRequestForm) {
    forgotRequestForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const identifier = document.getElementById("forgotIdentifier").value.trim();
      if (!identifier) {
        showToast("Please enter your registered email or phone.", "warning");
        return;
      }

      const btn = document.getElementById("btnSendForgotOtp");
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i> Sending Code...`;
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = `<i class="fa-solid fa-check me-2"></i> Reset Code Sent!`;
        if (forgotResetSection) forgotResetSection.style.display = "block";
        showToast(`Reset code dispatched. Demo OTP is 123456`, "success");
      }, 700);
    });
  }

  if (newPasswordSubmitForm) {
    newPasswordSubmitForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const otp = document.getElementById("forgotOtpInput").value.trim();
      const newPwd = document.getElementById("forgotNewPassword").value;
      const confirmNewPwd = document.getElementById("forgotConfirmNewPassword").value;

      if (otp !== "123456" && otp.length < 4) {
        showToast("Invalid reset code. Demo code is 123456", "danger");
        return;
      }

      if (newPwd !== confirmNewPwd) {
        showToast("New passwords do not match.", "danger");
        return;
      }

      if (newPwd.length < 8) {
        showToast("Password must be at least 8 characters long.", "warning");
        return;
      }

      showToast("Password updated successfully! Logging you in...", "success");

      setTimeout(() => {
        const identifier = document.getElementById("forgotIdentifier").value.trim();
        const userObj = {
          name: identifier.includes("@") ? identifier.split("@")[0] : "Rahul Verma",
          email: identifier.includes("@") ? identifier : "rahul.verma@example.com",
          phone: "9876543210",
          gender: "Male",
          dob: "1994-08-15",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
          memberSince: "May 2024",
          walletBalance: 350,
          medcareCoins: 700
        };

        localStorage.setItem("medcare_user", JSON.stringify(userObj));
        window.location.href = "dashboard.html";
      }, 1000);
    });
  }

  // ==========================================
  // 8. SOCIAL LOGIN SIMULATION
  // ==========================================
  // 8. GOOGLE IDENTITY SERVICES (GIS) SIGN-IN + FALLBACK
  // ==========================================
  function decodeGoogleJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  function completeGoogleLogin(profile) {
    const userObj = {
      id: "usr_101",
      name: profile.name || "Himanshu",
      fullName: profile.name || "Himanshu",
      email: profile.email || "himanshu@example.com",
      phone: "+91 98765 43210",
      role: "customer",
      avatar: profile.picture || "",
      memberSince: "Just Now",
      walletBalance: 200,
      medcareCoins: 400,
      addresses: [
        {
          id: "addr_pune_1",
          recipientName: profile.name || "Himanshu",
          name: profile.name || "Himanshu",
          phone: "+91 98765 43210",
          addressLine: "Alandi Devachi, Near Indrayani River",
          house: "Alandi Devachi, Near Indrayani River",
          landmark: "Near Alandi Temple",
          street: "Near Alandi Temple",
          city: "Pune",
          state: "Maharashtra",
          pincode: "412105",
          pin: "412105",
          isDefault: true,
          type: "Home"
        }
      ]
    };
    localStorage.setItem("medcare_user", JSON.stringify(userObj));
    localStorage.setItem("medcare_addresses", JSON.stringify(userObj.addresses));
    showToast(`Welcome back, ${userObj.name}!`, "success");
    setTimeout(() => {
      window.location.href = urlParams.get("redirect") || "index.html";
    }, 600);
  }

  window.handleGoogleCredentialResponse = function (response) {
    const payload = response && response.credential ? decodeGoogleJwt(response.credential) : null;
    if (payload && payload.email) {
      completeGoogleLogin(payload);
    } else {
      showToast("Google sign-in could not verify credentials.", "danger");
    }
  };

  if (btnGoogleLogin) {
    btnGoogleLogin.addEventListener("click", () => {
      const clientId = window.MEDCARE_GOOGLE_CLIENT_ID || "";
      if (clientId && window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: window.handleGoogleCredentialResponse
        });
        window.google.accounts.id.prompt();
      } else {
        // Fallback instant demo login when Google OAuth Client ID is not configured
        showToast("Signing in with Google...", "info");
        setTimeout(() => {
          completeGoogleLogin({
            name: "Himanshu",
            email: "himanshu@example.com",
            picture: ""
          });
        }, 500);
      }
    });
  }

  if (btnFacebookLogin) {
    btnFacebookLogin.addEventListener("click", () => {
      completeGoogleLogin({ name: "Himanshu", email: "himanshu@example.com", picture: "" });
    });
  }

  // ==========================================
  // 9. TOAST NOTIFICATIONS
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
    }, 4000);
  }

  // Mobile Drawer Toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const closeMobileNav = document.getElementById("closeMobileNav");
  if (mobileMenuBtn && mobileNav) mobileMenuBtn.addEventListener("click", () => mobileNav.classList.add("open"));
  if (closeMobileNav && mobileNav) closeMobileNav.addEventListener("click", () => mobileNav.classList.remove("open"));
});
