document.addEventListener("DOMContentLoaded", () => {

  // ------------------ MODALS ------------------
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

    modal.querySelector(".close-modal-btn").addEventListener("click", () => {
      modal.remove();
    });
  }

  // ------------------ HEADER LOGIN BUTTON ------------------
  const loginHeaderBtn = document.querySelector(".login-header-btn");
  if (loginHeaderBtn) {
    loginHeaderBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  // ------------------ SIDEBAR ------------------
  const menuBtn = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const closeBtn = document.getElementById('close-sidebar');

  if (menuBtn && sidebar && closeBtn) {
    menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));
  }

  // ------------------ SIDEBAR BUTTONS ------------------
  const sidebarButtons = document.querySelectorAll(".sidebar-content button");
  sidebarButtons.forEach(btn => {
    const target = btn.getAttribute("onclick");
    if (target) {
      btn.addEventListener("click", () => eval(target));
    }
  });

  // ------------------ INDEX.HTML BUTTONS ------------------
  if (window.location.pathname.includes("index.html")) {
    const startSection = document.querySelector("section.intro");
    if (startSection) {
      const startButtons = startSection.querySelectorAll(".btn");
      if (startButtons.length >= 2) {
        startButtons[0].addEventListener("click", () => openModal("The free plan will be available soon. Stay tuned!"));
        startButtons[1].addEventListener("click", () => openModal("Premium features will follow!"));
      }
    }
  }

  // ------------------ REGISTER.HTML ------------------
  if (window.location.pathname.includes("register.html")) {
    const registerBtn = document.getElementById("register-submit");
    const message = document.getElementById("register-message");

    registerBtn.addEventListener("click", () => {
      const username = document.getElementById("new-username").value.trim();
      const password = document.getElementById("new-password").value.trim();

      if (!username || !password) {
        message.textContent = "Bitte alle Felder ausfüllen!";
        message.style.color = "#f00";
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.find(u => u.username === username)) {
        message.textContent = "Benutzername bereits vergeben!";
        message.style.color = "#f00";
        return;
      }

      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));
      message.textContent = "Registrierung erfolgreich!";
      message.style.color = "#0f0";

      setTimeout(() => window.location.href = "login.html", 1200);
    });
  }

  // ------------------ LOGIN.HTML ------------------
  if (window.location.pathname.includes("login.html")) {
    const loginBtn = document.getElementById("login-submit");
    const message = document.getElementById("login-message");

    loginBtn.addEventListener("click", () => {
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value.trim();

      let users = JSON.parse(localStorage.getItem("users")) || [];
      let found = users.find(u => u.username === username && u.password === password);

      if (found) {
        message.textContent = "Login erfolgreich!";
        message.style.color = "#0f0";

        localStorage.setItem("currentUser", username);
        setTimeout(() => window.location.href = "profile.html", 1200);
      } else {
        message.textContent = "Falscher Benutzername oder Passwort!";
        message.style.color = "#f00";
      }
    });
  }

  // ------------------ PROFILE.HTML ------------------
  if (window.location.pathname.includes("profile.html")) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) window.location.href = "login.html";
    else {
      const usernameSpan = document.getElementById("username");
      if (usernameSpan) usernameSpan.textContent = currentUser;
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
      });
    }
  }

});
