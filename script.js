// script.js – YGJ Frontend Global Script
document.addEventListener("DOMContentLoaded", () => {

  /* ============================
     THEME (Per-User Light/Dark)
  ============================ */

  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  function getCurrentUserToken() {
    return localStorage.getItem("ygj_token");
  }

  function applyTheme(theme) {
    if (theme === "dark") body.classList.add("dark");
    else body.classList.remove("dark");

    if (themeToggle) themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  function readTheme() {
    return localStorage.getItem("ygj_theme") || "light";
  }

  function saveTheme(theme) {
    localStorage.setItem("ygj_theme", theme);
  }

  applyTheme(readTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = body.classList.contains("dark") ? "light" : "dark";
      applyTheme(next);
      saveTheme(next);
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

    modal.querySelector(".close-modal-btn").addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (ev) => { if (ev.target === modal) modal.remove(); });
  }

  /* ============================
     LOGOUT HANDLER
  ============================ */
  function logout() {
    localStorage.removeItem("ygj_token");
    window.location.href = "login.html";
  }

  document.body.addEventListener("click", (e) => {
    if (e.target && e.target.id === "logout-btn") logout();
  });

  /* ============================
     LOGIN HANDLER
  ============================ */
  const loginSubmit = document.getElementById("login-submit");
  if (loginSubmit) {
    loginSubmit.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value.trim();
      const msg = document.getElementById("login-message");

      try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");

        localStorage.setItem("ygj_token", data.token);
        msg.textContent = "Login successful!";
        msg.style.color = "#0f0";

        setTimeout(() => window.location.href = "profile.html", 600);
      } catch (err) {
        msg.textContent = err.message;
        msg.style.color = "#f00";
      }
    });
  }

  /* ============================
     REGISTER HANDLER
  ============================ */
  const registerSubmit = document.getElementById("register-submit");
  if (registerSubmit) {
    registerSubmit.addEventListener("click", async (e) => {
      e.preventDefault();
      const displayName = document.getElementById("new-username").value.trim();
      const email = document.getElementById("new-email").value.trim();
      const password = document.getElementById("new-password").value.trim();
      const confirmPassword = document.getElementById("new-password-confirm").value.trim();
      const msg = document.getElementById("register-message");

      if (password !== confirmPassword) {
        msg.textContent = "Passwords do not match!";
        msg.style.color = "#f00";
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayName, email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");

        msg.textContent = "Registration successful! You can log in now.";
        msg.style.color = "#0f0";
        setTimeout(() => window.location.href = "login.html", 800);
      } catch (err) {
        msg.textContent = err.message;
        msg.style.color = "#f00";
      }
    });
  }

  /* ============================
     PROFILE HANDLER
  ============================ */
  const profileSection = document.getElementById("profile-section");
  if (profileSection) {
    const token = getCurrentUserToken();
    if (!token) return logout();

    const loading = document.getElementById("loading");
    const nameEl = document.getElementById("profile-name");
    const emailEl = document.getElementById("profile-email");
    const idEl = document.getElementById("profile-id");

    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { "Authorization": "Bearer " + token }
        });
        if (!res.ok) throw new Error("Session expired, please login again");
        const data = await res.json();

        loading.style.display = "none";
        profileSection.style.display = "block";
        nameEl.textContent = data.displayName || "User";
        emailEl.textContent = data.email;
        idEl.textContent = data.id || data._id || "-";
      } catch (err) {
        console.warn(err.message);
        logout();
      }
    })();
  }

});
