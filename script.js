// script.js (kompletter Ersatz)
// YGJ - Global Script (Theme per User + Navbar + Auth + Page-specific behavior)
// Autor: ChatGPT für dich, Bruder. 💪🔥

document.addEventListener("DOMContentLoaded", () => {

  /* ============================
     THEME (Per-User Light/Dark)
     ============================ */

  // key builder: per user or 'guest'
  function getCurrentUser() {
    return localStorage.getItem("currentUser") || "guest";
  }
  function themeKeyForUser(user) {
    return `ygj_theme_${user}`;
  }

  // Find toggle button (may not exist on every page)
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Migration: falls vorher ein globaler "theme"-key existiert, übernehmen wir ihn
  (function migrateGlobalTheme() {
    try {
      const globalTheme = localStorage.getItem("theme");
      if (!globalTheme) return;
      const user = getCurrentUser();
      const perUserKey = themeKeyForUser(user);
      if (!localStorage.getItem(perUserKey)) {
        // set per-user theme from global
        localStorage.setItem(perUserKey, globalTheme);
      }
      // keep global key for backwards compatibility (optional)
    } catch (e) {
      // ignore silently
    }
  })();

  function readSavedThemeForCurrentUser() {
    const user = getCurrentUser();
    const perUserKey = themeKeyForUser(user);
    return localStorage.getItem(perUserKey); // 'dark' | 'light' | null
  }

  function saveThemeForCurrentUser(value) {
    const user = getCurrentUser();
    const perUserKey = themeKeyForUser(user);
    localStorage.setItem(perUserKey, value);
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
    // update toggle icon if present
    if (themeToggle) {
      themeToggle.textContent = (theme === "dark") ? "☀️" : "🌙";
      themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
  }

  // Initialize theme from per-user storage (or fallback to light)
  (function initTheme() {
    const saved = readSavedThemeForCurrentUser();
    if (saved === "dark" || saved === "light") {
      applyTheme(saved);
    } else {
      // Try to fall back to a global theme key for older setups, or default to light
      const global = localStorage.getItem("theme");
      if (global === "dark" || global === "light") {
        applyTheme(global);
        // and store per-user to be consistent
        saveThemeForCurrentUser(global);
      } else {
        applyTheme("light");
        saveThemeForCurrentUser("light");
      }
    }
  })();

  // Theme toggle handler
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = body.classList.contains("dark");
      const next = isDark ? "light" : "dark";
      applyTheme(next);
      saveThemeForCurrentUser(next);
      // If you have a slideshow or bg logic that needs reset on theme-change,
      // you can dispatch a custom event here for other modules to listen to:
      window.dispatchEvent(new CustomEvent('ygj:themechanged', { detail: { theme: next } }));
    });
  }

  /* ============================
     SIDEBAR (open/close)
     ============================ */

  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menu-toggle");
  const closeBtn = document.getElementById("close-sidebar");

  if (menuBtn && sidebar && closeBtn) {
    menuBtn.addEventListener("click", () => sidebar.classList.toggle("open"));
    closeBtn.addEventListener("click", () => sidebar.classList.remove("open"));
  }

  /* ============================
     MODAL helper
     ============================ */
  function openModal(message) {
    const modal = document.createElement("div");
    modal.classList.add("modal-overlay");
    modal.innerHTML = `
      <div class="modal-content">
        <p>${message}</p>
        <button class="close-modal-btn btn">OK</button>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector(".close-modal-btn");
    closeBtn.addEventListener("click", () => modal.remove());
  }

  /* ============================
     INDEX / START-Sektion Buttons
     ============================ */
  const startSection = document.querySelector("section.intro");
  if (startSection && window.location.pathname.includes("index.html")) {
    const startButtons = startSection.querySelectorAll(".btn");
    if (startButtons.length >= 2) {
      startButtons[0].addEventListener("click", () => {
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser || currentUser === "null") {
          window.location.href = "login.html";
        }
      });

      startButtons[1].addEventListener("click", () => {
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser || currentUser === "null") {
          window.location.href = "login.html";
        } else {
          openModal("Premium features will follow!");
        }
      });
    }
  }

  /* ============================
     NAVBAR LOGIN/SIGNUP/LOGOUT handling
     ============================ */
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const logoutBtn = document.getElementById("logout-btn");

  function updateNav() {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser && currentUser !== "null") {
      if (loginBtn) loginBtn.style.display = "none";
      if (signupBtn) signupBtn.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
      if (loginBtn) loginBtn.style.display = "inline-block";
      if (signupBtn) signupBtn.style.display = "inline-block";
      if (logoutBtn) logoutBtn.style.display = "none";
    }
  }

 // Delegate Logout: funktioniert auf allen Seiten
document.body.addEventListener("click", (e) => {
  if (e.target && e.target.id === "logout-btn") {
    // === unverändert: ausloggen + UI updaten ===
    localStorage.removeItem("currentUser");
    updateNav();

    // === Modal anzeigen (anstelle des blockierenden alert + sofort-redirect) ===
    // Falls schon ein Modal offen ist, nichts tun
    if (document.querySelector('.modal-overlay')) return;

    const modal = document.createElement('div');
    modal.classList.add('modal-overlay');

    modal.innerHTML = `
      <div class="modal-content" role="dialog" aria-modal="true" aria-label="Logged out">
        <p><i class="fa-solid fa-door-open"></i> You have been logged out successfully.</p>
        <button class="close-modal-btn btn" type="button">OK</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Klick auf OK -> Modal schließen und dann redirect (wie vorher)
    const okBtn = modal.querySelector('.close-modal-btn');
    okBtn.addEventListener('click', () => {
      modal.remove();
      // genau wie vorher: weiterleiten
      window.location.href = "index.html";
    });

    // Optional: Klick auf Overlay schließt ebenfalls und redirect (UX-freundlich)
    modal.addEventListener('click', (ev) => {
      if (ev.target === modal) {
        modal.remove();
        window.location.href = "index.html";
      }
    });

    // Optional: Escape key schließt ebenfalls
    const onEsc = (ev) => {
      if (ev.key === "Escape") {
        document.removeEventListener('keydown', onEsc);
        if (modal.parentElement) {
          modal.remove();
          window.location.href = "index.html";
        }
      }
    };
    document.addEventListener('keydown', onEsc);

    // --- wichtig: KEIN alert() mehr hier ---
    // alert("You have been logged out.");
    // window.location.href = "index.html";
  }
});
  updateNav();
  /* ============================
     LOGIN (page-specific)
     ============================ */
  const loginSubmit = document.getElementById("login-submit");
  if (loginSubmit) {
    loginSubmit.addEventListener("click", () => {
      // guard element retrieval to avoid null .value access
      const usernameEl = document.getElementById("login-username");
      const passwordEl = document.getElementById("login-password");
      const msg = document.getElementById("login-message");

      if (!usernameEl || !passwordEl || !msg) {
        console.warn("Login handler: missing input or message element on this page.");
        return;
      }

      const username = usernameEl.value.trim();
      const password = passwordEl.value.trim();
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem("currentUser", username);
        // migrate theme preference to the newly logged-in user if global theme existed
        const globalTheme = localStorage.getItem("theme");
        const perUserKey = themeKeyForUser(username);
        if (globalTheme && !localStorage.getItem(perUserKey)) {
          localStorage.setItem(perUserKey, globalTheme);
        }
        msg.textContent = "Log-In Successful!";
        msg.style.color = "#0f0";
        updateNav();

        // apply user's theme immediately after login
        const userTheme = readSavedThemeForCurrentUser();
        if (userTheme) applyTheme(userTheme);

        setTimeout(() => window.location.href = "profile.html", 800);
      } else {
        msg.textContent = "Wrong Username or Password";
        msg.style.color = "#f00";
      }
    });
  }

 /* ============================
   REGISTER (page-specific) with Email
   ============================ */
const registerSubmit = document.getElementById("register-submit");
if (registerSubmit) {
  registerSubmit.addEventListener("click", () => {
    // guard element retrieval to avoid null .value access
    const usernameEl = document.getElementById("new-username");
    const emailEl = document.getElementById("new-email");
    const passwordEl = document.getElementById("new-password");
    const confirmEl = document.getElementById("new-password-confirm");
    const msg = document.getElementById("register-message");

    if (!usernameEl || !emailEl || !passwordEl || !confirmEl || !msg) {
      console.warn("Register handler: missing input or message element on this page.");
      return;
    }

    const username = usernameEl.value.trim();
    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();
    const confirmPassword = confirmEl.value.trim();

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      msg.textContent = "Please fill out all fields!";
      msg.style.color = "#f00";
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      msg.textContent = "Invalid email format!";
      msg.style.color = "#f00";
      return;
    }

    // Password match check
    if (password !== confirmPassword) {
      msg.textContent = "Passwords do not match!";
      msg.style.color = "#f00";
      return;
    }

    // Load existing users
    let users = JSON.parse(localStorage.getItem("users") || "[]");

   // Check if username or email already exists
const usernameExists = users.find(u => u.username === username);
const emailExists = users.find(u => u.email === email);

if (usernameExists || emailExists) {
  // Rote Fehlermeldung mit kurzer "Aufleucht"-Animation
  let msgText = "";
  if (usernameExists) msgText += "Username is already taken ";
  if (emailExists) msgText += "E-Mail already in use";

  msg.textContent = msgText;
  msg.style.display = "block";
  msg.style.color = "#f00";
  msg.style.fontWeight = "bold";
  msg.style.transition = "opacity 0.4s ease";
  msg.style.opacity = "1";

  // sanftes Aufleuchten
  msg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, iterations: 1 });
  return;
}

    // Add new user
    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    // Set default theme for new user
    const globalTheme = localStorage.getItem("theme") || "light";
    const perUserKey = themeKeyForUser(username);
    localStorage.setItem(perUserKey, globalTheme);

    msg.textContent = "Registration successful! You can log in now.";
    msg.style.color = "#0f0";

    // Optionally, redirect after a short delay
    setTimeout(() => window.location.href = "login.html", 1000);
  });
}


  /* ============================
     PROFILE page stats (page-specific)
     ============================ */
  const profileUsername = document.getElementById("username");
  if (profileUsername) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser || currentUser === "null") {
      window.location.href = "login.html";
    } else {
      profileUsername.textContent = currentUser;

      const pProgress = document.getElementById("progress-percentage");
      const pTasks = document.getElementById("tasks-completed");
      const pStreak = document.getElementById("streak-days");
      const pLevel = document.getElementById("level");
      if (pProgress) pProgress.textContent = progress + "%";
      if (pTasks) pTasks.textContent = tasks;
      if (pStreak) pStreak.textContent = streak;
      if (pLevel) pLevel.textContent = level;
    }
  }

  /* ============================
     Optional: small page-specific button handlers
     ============================ */


  /* ============================
     Trigger an event to notify others that theme is ready
     Useful for background/slideshow modules to react immediately
     ============================ */
  window.dispatchEvent(new CustomEvent('ygj:themeloaded', { detail: { theme: body.classList.contains('dark') ? 'dark' : 'light' } }));

}); // DOMContentLoaded end
