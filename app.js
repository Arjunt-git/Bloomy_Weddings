/**
 * BLOOMY WEDDINGS - Classic Edition Application Script
 * Particle canvas, theme switcher, service cards, filterable gallery,
 * package quote estimator, custom upload manager, and WhatsApp integration.
 */

document.addEventListener("DOMContentLoaded", () => {
  initParticlesCanvas();
  initPhotographerAdminState();
  renderServices();
  renderPortfolio('all');
  renderTestimonials();
  renderFAQs();
  initContactForm();
  initUploadModal();
  initThemeToggle();
});

/* ----------------------------------------------------
   1. Ambient Sparkle Particles Canvas
---------------------------------------------------- */
function initParticlesCanvas() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 35 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 0.5,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: -Math.random() * 0.3 - 0.05,
    opacity: Math.random() * 0.5 + 0.2,
    fadeSpeed: Math.random() * 0.006 + 0.002
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.opacity += p.fadeSpeed;

      if (p.opacity > 0.7 || p.opacity < 0.1) {
        p.fadeSpeed = -p.fadeSpeed;
      }
      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(184, 134, 11, ${p.opacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#b8860b';
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ----------------------------------------------------
   2. Theme Switcher (Classic Ivory vs Dark Velvet)
---------------------------------------------------- */
function initThemeToggle() {
  const saved = localStorage.getItem("bloomy_classic_theme");
  if (saved === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    updateThemeBtnText(true);
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  if (current === "dark") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("bloomy_classic_theme", "light");
    updateThemeBtnText(false);
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("bloomy_classic_theme", "dark");
    updateThemeBtnText(true);
  }
}

function updateThemeBtnText(isDark) {
  const textSpan = document.getElementById("theme-toggle-text");
  if (textSpan) {
    textSpan.textContent = isDark ? "🌙 Dark Velvet" : "☀️ Classic Ivory";
  }
}

/* ----------------------------------------------------
   3. Render 4 Core Photography Services
---------------------------------------------------- */
function renderServices() {
  const container = document.getElementById("services-grid");
  if (!container) return;

  container.innerHTML = BLOOMY_DATA.services.map(svc => `
    <div class="service-card" id="${svc.id}">
      <div class="service-img-wrapper">
        <img src="${svc.image}" alt="${svc.title}" class="service-img" loading="lazy">
        <span class="service-badge">${svc.badge}</span>
      </div>
      <div class="service-body">
        <h3 class="service-title">${svc.title}</h3>
        <p class="service-tagline">“${svc.tagline}”</p>
        <ul class="service-highlights">
          ${svc.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
        <div class="service-footer">
          <button class="btn btn-outline" style="flex:1;" onclick="filterPortfolioFromService('${svc.category}')">
            <span>View Gallery</span>
          </button>
          <a href="https://wa.me/917025198952?text=Hello%20Bloomy%20Weddings%2C%20I%20am%20interested%20in%20your%20classic%20${encodeURIComponent(svc.title)}%20services." target="_blank" class="btn btn-whatsapp" title="WhatsApp Enquiry">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
            <span>Enquire</span>
          </a>
        </div>
      </div>
    </div>
  `).join('');
}

function filterPortfolioFromService(cat) {
  const section = document.getElementById("portfolio");
  if (section) section.scrollIntoView({ behavior: 'smooth' });
  renderPortfolio(cat);

  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.getAttribute('data-category') === cat) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/* ----------------------------------------------------
   4. Photographer Admin Mode & Filterable Portfolio
 ---------------------------------------------------- */
let isPhotographerAdmin = false;
let currentPortfolio = Array.isArray(BLOOMY_DATA.portfolio)
  ? [...BLOOMY_DATA.portfolio]
  : [];

function initPhotographerAdminState() {
  isPhotographerAdmin = sessionStorage.getItem("bloomy_photographer_admin") === "true";
  updateAdminUIState();
}

function updateAdminUIState() {
  const adminBar = document.getElementById("photographer-admin-bar");
  const navBtn = document.getElementById("photographer-nav-btn");
  const isMasterAdmin = sessionStorage.getItem("bloomy_is_master_admin") === "true";

  // Show/hide the admin dashboard button (master admin only)
  const dashboardBtn = document.getElementById("admin-dashboard-btn");
  if (dashboardBtn) {
    dashboardBtn.style.display = (isPhotographerAdmin && isMasterAdmin) ? "inline-flex" : "none";
  }

  if (adminBar) {
    adminBar.style.display = isPhotographerAdmin ? "block" : "none";
  }
  if (navBtn) {
    navBtn.innerHTML = isPhotographerAdmin 
      ? `<span>⚙️ Admin Active</span>`
      : `<span>🔒 Admin Login</span>`;
  }
}

function openPhotographerLogin() {
  if (isPhotographerAdmin) {
    showToast("Photographer Studio Mode is active! You can reorder, edit, and delete photos directly in the gallery.");
    const section = document.getElementById("portfolio");
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  const modal = document.getElementById("photographer-login-modal");
  if (modal) modal.classList.add("active");
}

function closePhotographerLogin() {
  const modal = document.getElementById("photographer-login-modal");
  if (modal) modal.classList.remove("active");
}

function attemptPhotographerLogin(e) {
  e.preventDefault();
  const userInput = document.getElementById("photographer-username");
  const passInput = document.getElementById("photographer-passcode");
  
  if (!userInput || !passInput) return;
  const username = userInput.value.trim().toLowerCase();
  const password = passInput.value.trim();

  // Check the master admin credentials configured in the dashboard.
  let masterAccount = getMasterAdminAccount();
  const isLegacyMasterLogin = !hasConfiguredMasterAdminAccount()
    && (username === "bloomy" || username === "admin" || username === "photographer")
    && (password === "bloomy2026" || password === "admin2026");
  const isMasterAdmin = (username === masterAccount.username && password === masterAccount.password) || isLegacyMasterLogin;
  if (isLegacyMasterLogin) {
    // Keep existing first-login aliases working, then make the chosen one configurable.
    masterAccount = { username, password };
    saveMasterAdminAccount(masterAccount);
  }

  // Check employee accounts stored in localStorage
  const accounts = getEmployeeAccounts();
  const isEmployee = !isMasterAdmin && accounts[username] && accounts[username] === password;

  if (isMasterAdmin) {
    isPhotographerAdmin = true;
    sessionStorage.setItem("bloomy_photographer_admin", "true");
    sessionStorage.setItem("bloomy_is_master_admin", "true");
    sessionStorage.setItem("bloomy_current_admin_username", masterAccount.username);
    updateAdminUIState();
    closePhotographerLogin();
    renderPortfolio();
    showToast("🔓 Welcome, Admin! Studio Mode Unlocked.");
  } else if (isEmployee) {
    isPhotographerAdmin = true;
    sessionStorage.setItem("bloomy_photographer_admin", "true");
    sessionStorage.setItem("bloomy_is_master_admin", "false");
    sessionStorage.setItem("bloomy_current_admin_username", username);
    updateAdminUIState();
    closePhotographerLogin();
    renderPortfolio();
    showToast("🔓 Welcome, " + username + "! Studio Mode Unlocked.");
  } else {
    alert("Invalid Username or Password.\n\nPlease check your credentials and try again.");
  }
}

function photographerLogout() {
  isPhotographerAdmin = false;
  sessionStorage.removeItem("bloomy_photographer_admin");
  sessionStorage.removeItem("bloomy_is_master_admin");
  sessionStorage.removeItem("bloomy_current_admin_username");
  updateAdminUIState();
  renderPortfolio();
  showToast("Logged out of Photographer Studio Mode.");
}

function renderPortfolio(category = 'all') {
  const container = document.getElementById("gallery-grid");
  if (!container) return;

  if (!Array.isArray(currentPortfolio)) {
  currentPortfolio = Array.isArray(BLOOMY_DATA.portfolio)
    ? [...BLOOMY_DATA.portfolio]
    : [];
}

  const filtered = category === 'all' 
    ? currentPortfolio 
    : currentPortfolio.filter(item => item.category === category);

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding: 60px 0; color: var(--text-muted);">
      <p style="font-size: 1.1rem; font-family: var(--font-serif);">No classic photographs found in this category.</p>
    </div>`;
    return;
  }

  container.innerHTML = filtered.map((item, idx) => {
    const realIndex = currentPortfolio.findIndex(i => i.id === item.id);
    
    // Admin action controls when logged in
    const adminControlsHtml = isPhotographerAdmin ? `
      <div class="admin-card-actions" onclick="event.stopPropagation()">
        <div style="display: flex; gap: 4px;">
          <button class="admin-action-btn" onclick="movePortfolioItem(${realIndex}, -1)" title="Move Left / Earlier" ${realIndex === 0 ? 'disabled style="opacity:0.4;"' : ''}>⬅️</button>
          <button class="admin-action-btn" onclick="movePortfolioItem(${realIndex}, 1)" title="Move Right / Later" ${realIndex === currentPortfolio.length - 1 ? 'disabled style="opacity:0.4;"' : ''}>➡️</button>
        </div>
        <div style="display: flex; gap: 4px;">
          <button class="admin-action-btn" onclick="openEditModal('${item.id}')" title="Edit Photo Details">✏️ Edit</button>
          <button class="admin-action-btn danger" onclick="deletePortfolioItem('${item.id}')" title="Delete Photo">🗑️ Delete</button>
        </div>
      </div>
    ` : '';

    return `
      <div class="gallery-item" onclick="openLightbox('${item.id}')" style="position: relative;">
        ${adminControlsHtml}
        <img src="${item.image}" alt="${item.title}" class="gallery-img" loading="lazy">
        <div class="gallery-overlay">
          <span class="gallery-tag">${item.tag || item.category}</span>
          <h4 class="gallery-title">${item.title}</h4>
          ${item.location ? `<p class="gallery-location">📍 ${item.location}</p>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

/* ----------------------------------------------------
   Reordering, Deleting & Editing Portfolio Items
---------------------------------------------------- */
function movePortfolioItem(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= currentPortfolio.length) return;

  // Swap elements
  const temp = currentPortfolio[index];
  currentPortfolio[index] = currentPortfolio[newIndex];
  currentPortfolio[newIndex] = temp;

  saveCustomPortfolio(currentPortfolio);
  renderPortfolio();
  showToast(`Moved "${temp.title}" ${direction < 0 ? 'earlier' : 'later'} in position.`);
}

function deletePortfolioItem(id) {
  const item = currentPortfolio.find(i => i.id === id);
  if (!item) return;

  if (confirm(`Are you sure you want to delete "${item.title}" from your live portfolio?`)) {
    currentPortfolio = currentPortfolio.filter(i => i.id !== id);
    saveCustomPortfolio(currentPortfolio);
    renderPortfolio();
    showToast(`Removed "${item.title}" from portfolio.`);
  }
}

function openEditModal(id) {
  const item = currentPortfolio.find(i => i.id === id);
  if (!item) return;

  document.getElementById("edit-photo-id").value = item.id;
  document.getElementById("edit-photo-title").value = item.title;
  document.getElementById("edit-photo-category").value = item.category;
  document.getElementById("edit-photo-desc").value = item.desc || "";

  const modal = document.getElementById("edit-photo-modal");
  if (modal) modal.classList.add("active");
}

function closeEditModal() {
  const modal = document.getElementById("edit-photo-modal");
  if (modal) modal.classList.remove("active");
}

async function savePhotoEdit(e) {
  e.preventDefault();

  const id = document.getElementById("edit-photo-id").value;
  const title = document.getElementById("edit-photo-title").value.trim();
  const category = document.getElementById("edit-photo-category").value;
  const desc = document.getElementById("edit-photo-desc").value.trim();

  const item = currentPortfolio.find(i => i.id === id);

  if (!item) {
    showToast("Photo not found.");
    return;
  }

  if (!title) {
    showToast("Please enter a photo title.");
    return;
  }

  item.title = title;
  item.category = category;
  item.desc = desc;

  try {
    await api("/api/portfolio", {
      method: "POST",
      body: JSON.stringify({
        portfolio: currentPortfolio
      })
    });

    renderPortfolio();
    closeEditModal();

    showToast(
      `Updated "${title}" successfully. Changes are live.`
    );

  } catch (error) {
    showToast(
      `Could not save changes: ${error.message}`
    );
  }
}

function resetPortfolioDefault() {
  if (confirm("Reset portfolio back to original default setup? Any custom additions/reorders will be cleared.")) {
    localStorage.removeItem("bloomy_custom_portfolio");
    currentPortfolio = BLOOMY_DATA.portfolio;
    renderPortfolio();
    showToast("Portfolio reset to default.");
  }
}

function openLightbox(id) {
  const item = currentPortfolio.find(i => i.id === id);
  if (!item) return;

  const modal = document.getElementById("lightbox-modal");
  const imgBox = document.getElementById("lightbox-img");
  const title = document.getElementById("lightbox-title");
  const location = document.getElementById("lightbox-location");
  const desc = document.getElementById("lightbox-desc");
  const waBtn = document.getElementById("lightbox-wa-btn");

  imgBox.src = item.image;
  imgBox.alt = item.title;
  imgBox.setAttribute("data-fullscreen-src", item.image);
  imgBox.setAttribute("data-fullscreen-caption", item.title);
  title.textContent = item.title;
  
  if (item.location) {
    location.textContent = `📍 ${item.location}`;
    location.style.display = 'block';
  } else {
    location.textContent = '';
    location.style.display = 'none';
  }

  desc.textContent = item.desc || "Fine-art classic photography by Bloomy Weddings.";
  
  const locStr = item.location ? ` (${item.location})` : '';
  const waText = encodeURIComponent(`Hi Bloomy Weddings! I loved your classic photography shoot "${item.title}"${locStr}. I would like to check available dates and pricing.`);
  waBtn.href = `https://wa.me/917025198952?text=${waText}`;

  modal.classList.add("active");
}

function closeLightbox() {
  const modal = document.getElementById("lightbox-modal");
  if (modal) modal.classList.remove("active");
}

/* Dedicated Full-Size Photo Modal Handler */
function triggerCurrentFullscreen() {
  const imgBox = document.getElementById("lightbox-img");
  if (!imgBox) return;
  const src = imgBox.getAttribute("data-fullscreen-src") || imgBox.src;
  const caption = imgBox.getAttribute("data-fullscreen-caption") || "";
  openFullscreenPhoto(src, caption);
}

function openFullscreenPhoto(src, caption = "") {
  const modal = document.getElementById("fullscreen-modal");
  const fullImg = document.getElementById("fullscreen-img");
  const capDiv = document.getElementById("fullscreen-caption");

  if (!modal || !fullImg) return;
  fullImg.src = src;
  if (capDiv) capDiv.textContent = caption ? `✦ ${caption} ✦` : "";

  modal.classList.add("active");
}

function closeFullscreenPhoto() {
  const modal = document.getElementById("fullscreen-modal");
  if (modal) modal.classList.remove("active");
}

// Global Keyboard Handler for closing modals via Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeFullscreenPhoto();
    closeLightbox();
  }
});



/* ----------------------------------------------------
   6. Render Testimonials & FAQs
---------------------------------------------------- */
function renderTestimonials() {
  const container = document.getElementById("testimonials-grid");
  if (!container) return;

  container.innerHTML = BLOOMY_DATA.testimonials.map(t => `
    <div class="testimonial-card">
      <div class="stars">${'★'.repeat(t.rating)}</div>
      <p class="quote-text">“${t.quote}”</p>
      <div class="client-info">
        <img src="${t.avatar}" alt="${t.names}" class="client-avatar">
        <div>
          <div class="client-name">${t.names}</div>
          <div class="client-type">${t.type}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderFAQs() {
  const container = document.getElementById("faq-list");
  if (!container) return;

  container.innerHTML = BLOOMY_DATA.faqs.map((faq, index) => `
    <div class="faq-item" id="faq-item-${index}">
      <div class="faq-question" onclick="toggleFAQ(${index})">
        <span>${faq.q}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      <div class="faq-answer">
        <p>${faq.a}</p>
      </div>
    </div>
  `).join('');
}

function toggleFAQ(index) {
  const item = document.getElementById(`faq-item-${index}`);
  if (item) {
    item.classList.toggle("active");
  }
}

/* ----------------------------------------------------
   7. Contact Form & Custom Upload
---------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("booking-contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("contact-name").value.trim();
    const phone = document.getElementById("contact-phone").value.trim();
    const service = document.getElementById("contact-service").value;
    const date = document.getElementById("contact-date").value;
    const location = document.getElementById("contact-location").value.trim();
    const notes = document.getElementById("contact-notes").value.trim();

    if (!name || !phone) {
      alert("Please enter your Name and Phone number.");
      return;
    }

    const text = `Hi Bloomy Weddings! New Enquiry from website:
- Name: ${name}
- Phone: ${phone}
- Service: ${service}
- Preferred Date: ${date || 'TBD'}
- Location: ${location || 'Not specified'}
- Message: ${notes || 'None'}`;

    window.open(`https://wa.me/917025198952?text=${encodeURIComponent(text)}`, '_blank');
    showToast("Opening WhatsApp chat with Bloomy Weddings...");
    form.reset();
  });
}

function initUploadModal() {
  const modal = document.getElementById("upload-modal");
  const form = document.getElementById("upload-form");
  if (!modal || !form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("upload-title").value.trim();
    const category = document.getElementById("upload-category").value;
    const location = document.getElementById("upload-location").value.trim();
    const fileInput = document.getElementById("upload-file");
    const urlInput = document.getElementById("upload-url").value.trim();

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        saveNewPhoto(title, category, location, e.target.result);
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else if (urlInput) {
      saveNewPhoto(title, category, location, urlInput);
    } else {
      alert("Please select an image file or provide an image URL.");
    }
  });
}

function saveNewPhoto(title, category, location, imageSrc) {
  const newItem = {
    id: "custom-" + Date.now(),
    title: title || "Classic Memory",
    category: category,
    image: imageSrc,
    location: location || "India",
    tag: category.charAt(0).toUpperCase() + category.slice(1),
    desc: "Classic uploaded photography showcase."
  };

  currentPortfolio.unshift(newItem);
  saveCustomPortfolio(currentPortfolio);
  renderPortfolio('all');
  closeUploadModal();
  showToast("Classic photo added to portfolio!");
}

function openUploadModal() {
  const modal = document.getElementById("upload-modal");
  if (modal) modal.classList.add("active");
}

function closeUploadModal() {
  const modal = document.getElementById("upload-modal");
  if (modal) modal.classList.remove("active");
}

function showToast(message) {
  let toast = document.getElementById("toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    toast.style.cssText = `
      position: fixed;
      top: 80px;
      right: 28px;
      z-index: 3000;
      background: var(--bg-card);
      border: 1px solid var(--gold-primary);
      color: var(--gold-primary);
      padding: 12px 24px;
      border-radius: var(--radius-pill);
      box-shadow: var(--shadow-gold);
      font-family: var(--font-sans);
      font-size: 0.88rem;
      font-weight: 600;
      transition: all 0.3s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  setTimeout(() => {
    toast.style.opacity = "0";
  }, 4000);
}

/* Mobile Navigation Menu Toggle */
function toggleMobileMenu() {
  const drawer = document.getElementById("mobile-drawer");
  if (drawer) {
    drawer.classList.toggle("active");
  }
}

function closeMobileMenu() {
  const drawer = document.getElementById("mobile-drawer");
  if (drawer) {
    drawer.classList.remove("active");
  }
}

/* ----------------------------------------------------
   Admin Employee Dashboard
---------------------------------------------------- */

/** Retrieve employee accounts from localStorage */
function getEmployeeAccounts() {
  try {
    const raw = localStorage.getItem("bloomy_employee_accounts");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

/** Persist employee accounts to localStorage */
function saveEmployeeAccounts(accounts) {
  localStorage.setItem("bloomy_employee_accounts", JSON.stringify(accounts));
}

/** Retrieve the configurable master-admin account, with the existing login as the first-use default. */
function getMasterAdminAccount() {
  try {
    const stored = JSON.parse(localStorage.getItem("bloomy_master_admin_account"));
    if (stored && typeof stored.username === "string" && typeof stored.password === "string") {
      return stored;
    }
  } catch (e) {
    // Use the first-use account below if an older saved value is malformed.
  }
  return { username: "bloomy", password: "bloomy2026" };
}

/** Whether this browser already has a deliberately configured master-admin account. */
function hasConfiguredMasterAdminAccount() {
  try {
    const stored = JSON.parse(localStorage.getItem("bloomy_master_admin_account"));
    return Boolean(stored && typeof stored.username === "string" && typeof stored.password === "string");
  } catch (e) {
    return false;
  }
}

/** Persist the master-admin account for this browser. */
function saveMasterAdminAccount(account) {
  localStorage.setItem("bloomy_master_admin_account", JSON.stringify(account));
}

/** Open the admin dashboard modal (master admin only) */
function openAdminDashboard() {
  if (!isPhotographerAdmin || sessionStorage.getItem("bloomy_is_master_admin") !== "true") {
    showToast("Access denied. Admin only.");
    return;
  }
  renderEmployeeList();
  populateAdminAccountSettings();
  const modal = document.getElementById("admin-dashboard-modal");
  if (modal) modal.classList.add("active");
}

/** Fill the account form with the currently signed-in admin's username. */
function populateAdminAccountSettings() {
  const account = getMasterAdminAccount();
  const usernameInput = document.getElementById("admin-current-username");
  const form = document.getElementById("admin-account-settings-form");
  if (form) form.reset();
  if (usernameInput) usernameInput.value = account.username;
}

/** Update the master admin's own credentials after confirming the current password. */
function updateAdminCredentials(e) {
  e.preventDefault();
  if (!isPhotographerAdmin || sessionStorage.getItem("bloomy_is_master_admin") !== "true") {
    showToast("Access denied. Admin only.");
    return;
  }

  const currentUsername = document.getElementById("admin-current-username").value.trim().toLowerCase();
  const currentPassword = document.getElementById("admin-current-password").value;
  const requestedUsername = document.getElementById("admin-new-username").value.trim().toLowerCase();
  const newPassword = document.getElementById("admin-new-password").value;
  const confirmPassword = document.getElementById("admin-confirm-password").value;
  const account = getMasterAdminAccount();

  if (currentUsername !== account.username || currentPassword !== account.password) {
    showToast("Your current username or password is incorrect.");
    return;
  }
  if (!requestedUsername && !newPassword) {
    showToast("Enter a new username or password to make a change.");
    return;
  }
  if (requestedUsername && !/^[a-z0-9._-]{3,32}$/.test(requestedUsername)) {
    showToast("Usernames must be 3–32 characters and use letters, numbers, dots, hyphens, or underscores.");
    return;
  }
  if (requestedUsername && getEmployeeAccounts()[requestedUsername] !== undefined) {
    showToast("That username is already used by an employee account.");
    return;
  }
  if (newPassword && newPassword.length < 8) {
    showToast("Your new password must be at least 8 characters.");
    return;
  }
  if (newPassword !== confirmPassword) {
    showToast("New password confirmation does not match.");
    return;
  }

  const updatedAccount = {
    username: requestedUsername || account.username,
    password: newPassword || account.password
  };
  saveMasterAdminAccount(updatedAccount);
  sessionStorage.setItem("bloomy_current_admin_username", updatedAccount.username);
  populateAdminAccountSettings();
  showToast("Your admin login details have been updated.");
}

/** Close the admin dashboard modal */
function closeAdminDashboard() {
  const modal = document.getElementById("admin-dashboard-modal");
  if (modal) modal.classList.remove("active");
}

/** Render the employee list inside the dashboard */
function renderEmployeeList() {
  const container = document.getElementById("admin-employee-list");
  if (!container) return;

  const accounts = getEmployeeAccounts();
  const keys = Object.keys(accounts);

  if (keys.length === 0) {
    container.innerHTML = `<div class="admin-emp-empty">No employee accounts yet. Create one above.</div>`;
    return;
  }

  container.innerHTML = keys.map(username => `
    <div class="admin-emp-row">
      <div class="admin-emp-username">${username}</div>
      <button class="admin-emp-delete-btn" onclick="deleteEmployee('${username}')">🗑 Remove</button>
    </div>
  `).join('');
}

/** Create a new employee account */
function createEmployee(e) {
  e.preventDefault();
  const usernameInput = document.getElementById("new-emp-username");
  const passwordInput = document.getElementById("new-emp-password");

  if (!usernameInput || !passwordInput) return;

  const username = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showToast("Please fill in both username and password.");
    return;
  }

  // Reserved usernames cannot be overwritten
  const reserved = ["bloomy", "admin", "photographer"];
  if (reserved.includes(username)) {
    showToast("That username is reserved. Choose a different one.");
    return;
  }

  const accounts = getEmployeeAccounts();

  if (accounts[username]) {
    showToast(`Username "${username}" already exists.`);
    return;
  }

  accounts[username] = password;
  saveEmployeeAccounts(accounts);
  renderEmployeeList();

  // Reset form
  usernameInput.value = "";
  passwordInput.value = "";

  showToast(`Employee account "${username}" created successfully!`);
}

/** Delete an employee account */
function deleteEmployee(username) {
  if (!confirm(`Remove employee account "${username}"? They will no longer be able to log in.`)) return;

  const accounts = getEmployeeAccounts();
  if (accounts[username] !== undefined) {
    delete accounts[username];
    saveEmployeeAccounts(accounts);
    renderEmployeeList();
    showToast(`Employee "${username}" removed.`);
  }
}

/* ----------------------------------------------------
   Server-backed login, shared portfolio & live updates
---------------------------------------------------- */
async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Something went wrong. Please try again.");
  return body;
}

async function initPhotographerAdminState() {
  try {
    const { user } = await api("/api/me");
    applyServerSession(user);
  } catch (error) {
    applyServerSession(null);
  }
  await loadSharedPortfolio();
  connectLiveUpdates();
}

function applyServerSession(user) {
  isPhotographerAdmin = Boolean(user);
  if (user) {
    sessionStorage.setItem("bloomy_photographer_admin", "true");
    sessionStorage.setItem("bloomy_is_master_admin", String(user.role === "admin"));
    sessionStorage.setItem("bloomy_current_admin_username", user.username);
  } else {
    sessionStorage.removeItem("bloomy_photographer_admin");
    sessionStorage.removeItem("bloomy_is_master_admin");
    sessionStorage.removeItem("bloomy_current_admin_username");
  }
  updateAdminUIState();
  renderPortfolio();
}

async function loadSharedPortfolio() {
  try {
    const { portfolio } = await api("/api/portfolio");
    currentPortfolio = Array.isArray(portfolio) ? portfolio : BLOOMY_DATA.portfolio;
    renderPortfolio();
  } catch (error) {
    console.warn("Could not load the shared portfolio.", error);
  }
}

function connectLiveUpdates() {
  const stream = new EventSource("/api/events");
  stream.addEventListener("portfolio", (event) => {
    const { portfolio } = JSON.parse(event.data);
    currentPortfolio = Array.isArray(portfolio) ? portfolio : BLOOMY_DATA.portfolio;
    renderPortfolio();
    showToast("Portfolio updated live.");
  });
  stream.addEventListener("employees", () => {
    if (sessionStorage.getItem("bloomy_is_master_admin") === "true") renderEmployeeList();
  });
}

async function attemptPhotographerLogin(e) {
  e.preventDefault();
  const username = document.getElementById("photographer-username").value.trim();
  const password = document.getElementById("photographer-passcode").value;
  try {
    const { user } = await api("/api/login", { method: "POST", body: JSON.stringify({ username, password }) });
    applyServerSession(user);
    closePhotographerLogin();
    e.target.reset();
    showToast(`🔓 Welcome, ${user.username}! Admin mode unlocked.`);
  } catch (error) {
    alert(error.message);
  }
}

async function photographerLogout() {
  try { await api("/api/logout", { method: "POST", body: "{}" }); } catch (error) { console.warn(error); }
  applyServerSession(null);
  showToast("Logged out of Admin Mode.");
}

function saveCustomPortfolio(portfolioArray) {
  api("/api/portfolio", { method: "POST", body: JSON.stringify({ portfolio: portfolioArray }) })
    .catch((error) => showToast(error.message));
}

async function resetPortfolioDefault() {
  if (!confirm("Reset the shared portfolio back to its original setup? This affects every visitor.")) return;
  try {
    await api("/api/portfolio", { method: "DELETE" });
    currentPortfolio = BLOOMY_DATA.portfolio;
    renderPortfolio();
    showToast("Shared portfolio reset to default.");
  } catch (error) { showToast(error.message); }
}

async function openAdminDashboard() {
  if (!isPhotographerAdmin || sessionStorage.getItem("bloomy_is_master_admin") !== "true") {
    showToast("Access denied. Admin only.");
    return;
  }
  populateAdminAccountSettings();
  await renderEmployeeList();
  document.getElementById("admin-dashboard-modal")?.classList.add("active");
}

async function renderEmployeeList() {
  const container = document.getElementById("admin-employee-list");
  if (!container) return;
  try {
    const { employees } = await api("/api/employees");
    container.innerHTML = employees.length ? employees.map((username) => `
      <div class="admin-emp-row"><div class="admin-emp-username"></div><button class="admin-emp-delete-btn">🗑 Remove</button></div>`).join("") :
      `<div class="admin-emp-empty">No employee accounts yet. Create one above.</div>`;
    container.querySelectorAll(".admin-emp-row").forEach((row, index) => {
      row.querySelector(".admin-emp-username").textContent = employees[index];
      row.querySelector("button").onclick = () => deleteEmployee(employees[index]);
    });
  } catch (error) { container.innerHTML = `<div class="admin-emp-empty">${error.message}</div>`; }
}

async function createEmployee(e) {
  e.preventDefault();
  const usernameInput = document.getElementById("new-emp-username"), passwordInput = document.getElementById("new-emp-password");
  try {
    const { username } = await api("/api/employees", { method: "POST", body: JSON.stringify({ username: usernameInput.value, password: passwordInput.value }) });
    e.target.reset();
    await renderEmployeeList();
    showToast(`Employee account "${username}" created successfully!`);
  } catch (error) { showToast(error.message); }
}

async function deleteEmployee(username) {
  if (!confirm(`Remove employee account "${username}"? They will no longer be able to log in.`)) return;
  try {
    await api(`/api/employees/${encodeURIComponent(username)}`, { method: "DELETE" });
    await renderEmployeeList();
    showToast(`Employee "${username}" removed.`);
  } catch (error) { showToast(error.message); }
}

async function updateAdminCredentials(e) {
  e.preventDefault();
  const currentPassword = document.getElementById("admin-current-password").value;
  const newUsername = document.getElementById("admin-new-username").value;
  const newPassword = document.getElementById("admin-new-password").value;
  const confirmation = document.getElementById("admin-confirm-password").value;
  if (newPassword !== confirmation) return showToast("New password confirmation does not match.");
  try {
    const { user } = await api("/api/admin/credentials", { method: "PUT", body: JSON.stringify({ currentPassword, newUsername, newPassword }) });
    applyServerSession(user);
    populateAdminAccountSettings();
    showToast("Your admin login details have been updated.");
  } catch (error) { showToast(error.message); }
}

function populateAdminAccountSettings() {
  const form = document.getElementById("admin-account-settings-form");
  const usernameInput = document.getElementById("admin-current-username");
  if (form) form.reset();
  if (usernameInput) usernameInput.value = sessionStorage.getItem("bloomy_current_admin_username") || "";
}
