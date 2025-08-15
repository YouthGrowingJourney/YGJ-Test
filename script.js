document.addEventListener("DOMContentLoaded", () => {
  // MODALS
  const buttons = document.querySelectorAll(".btn");
  function openModal(message) {
    const modal = document.createElement("div");
    modal.classList.add("modal-overlay");
    modal.innerHTML = `
      <div class="modal-content">
        <p>${message}</p>
        <button id="close-modal" class="btn">OK</button>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("close-modal").addEventListener("click", () => {
      modal.remove();
    });
  }

  if (buttons.length >= 2) {
    buttons[0].addEventListener("click", () => openModal("The free plan will be available soon. Stay tuned!"));
    buttons[1].addEventListener("click", () => openModal("Premium features will follow!"));
  }

  // SIDEBAR
  const menuBtn = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const closeBtn = document.getElementById('close-sidebar');

  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));
  }

  // Sidebar Buttons → Redirect
  const sidebarButtons = document.querySelectorAll(".sidebar-content button");
  if (sidebarButtons.length >= 4) {
    sidebarButtons[0].addEventListener("click", () => window.location.href = "profile.html");
    sidebarButtons[1].addEventListener("click", () => window.location.href = "about-us.html");
    sidebarButtons[2].addEventListener("click", () => window.location.href = "contact.html");
    sidebarButtons[3].addEventListener("click", () => window.location.href = "logout.html");
  }

  // LOGIN
  const loginSubmit = document.getElementById("login-submit");
  if (loginSubmit) {
    loginSubmit.addEventListener("click", () => {
      const user = document.getElementById("username").value.trim();
      const pass = document.getElementById("password").value.trim();
      const message = document.getElementById("login-message");

      if (user === "admin" && pass === "1234") {
        message.textContent = "Login erfolgreich!";
        message.style.color = "#0f0";
        setTimeout(() => window.location.href = "profile.html", 1000);
      } else {
        message.textContent = "Falsche Zugangsdaten!";
        message.style.color = "#f00";
      }
    });
  }
});
