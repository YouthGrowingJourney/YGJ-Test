document.addEventListener("DOMContentLoaded", () => {

  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menu-toggle");
  const closeBtn = document.getElementById("close-sidebar");
  const logoutBtn = document.getElementById("logout-btn");

  // --- Sidebar öffnen/schließen ---
  if (menuBtn && sidebar && closeBtn) {
    menuBtn.addEventListener("click", () => sidebar.classList.toggle("open"));
    closeBtn.addEventListener("click", () => sidebar.classList.remove("open"));
  }

  // --- Logout ---
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "index.html";
    });
  }

  // --- Login ---
  const loginSubmit = document.getElementById("login-submit");
  if (loginSubmit) {
    loginSubmit.addEventListener("click", () => {
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value.trim();
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(u => u.username === username && u.password === password);
      const msg = document.getElementById("login-message");

      if (user) {
        localStorage.setItem("currentUser", username);
        msg.textContent = "Login erfolgreich!";
        msg.style.color = "#0f0";
        setTimeout(() => window.location.href = "profile.html", 1000);
      } else {
        msg.textContent = "Benutzername oder Passwort falsch!";
        msg.style.color = "#f00";
      }
    });
  }

  // --- Register ---
  const registerSubmit = document.getElementById("register-submit");
  if (registerSubmit) {
    registerSubmit.addEventListener("click", () => {
      const username = document.getElementById("new-username").value.trim();
      const password = document.getElementById("new-password").value.trim();
      const msg = document.getElementById("register-message");
      if (!username || !password) {
        msg.textContent = "Bitte alles ausfüllen!";
        msg.style.color = "#f00";
        return;
      }
      let users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.find(u => u.username === username)) {
        msg.textContent = "Benutzername existiert schon!";
        msg.style.color = "#f00";
        return;
      }
      users.push({username, password});
      localStorage.setItem("users", JSON.stringify(users));
      msg.textContent = "Registrierung erfolgreich! Du kannst dich jetzt einloggen.";
      msg.style.color = "#0f0";
    });
  }

  // --- Profile Seite ---
  const profileUsername = document.getElementById("username");
  if (profileUsername) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      window.location.href = "login.html";
    } else {
      profileUsername.textContent = currentUser;
    }
  }
});
