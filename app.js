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
let currentPortfolio = getCustomPortfolio();

function initPhotographerAdminState() {
  isPhotographerAdmin = sessionStorage.getItem("bloomy_photographer_admin") === "true";
  updateAdminUIState();
}

function updateAdminUIState() {
  const adminBar = document.getElementById("photographer-admin-bar");
  const navBtn = document.getElementById("photographer-nav-btn");

  if (adminBar) {
    adminBar.style.display = isPhotographerAdmin ? "block" : "none";
  }
  if (navBtn) {
    navBtn.innerHTML = isPhotographerAdmin 
      ? `<span>⚙️ Studio Admin Active</span>` 
      : `<span>📷 Photographer Portal</span>`;
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

  // Accepted credentials: Username "bloomy" or "admin", Password "bloomy2026" or "admin2026"
  if ((username === "bloomy" || username === "admin" || username === "photographer") && (password === "bloomy2026" || password === "admin2026")) {
    isPhotographerAdmin = true;
    sessionStorage.setItem("bloomy_photographer_admin", "true");
    updateAdminUIState();
    closePhotographerLogin();
    renderPortfolio();
    showToast("🔓 Welcome, Photographer! Studio Mode Unlocked. You can now add, reorder, edit, and remove photos.");
  } else {
    alert("Invalid Username or Password.\n\nDefault Credentials:\nUsername: bloomy\nPassword: bloomy2026");
  }
}

function photographerLogout() {
  isPhotographerAdmin = false;
  sessionStorage.removeItem("bloomy_photographer_admin");
  updateAdminUIState();
  renderPortfolio();
  showToast("Logged out of Photographer Studio Mode.");
}

function renderPortfolio(category = 'all') {
  const container = document.getElementById("gallery-grid");
  if (!container) return;

  currentPortfolio = getCustomPortfolio();

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

function savePhotoEdit(e) {
  e.preventDefault();
  const id = document.getElementById("edit-photo-id").value;
  const title = document.getElementById("edit-photo-title").value.trim();
  const category = document.getElementById("edit-photo-category").value;
  const desc = document.getElementById("edit-photo-desc").value.trim();

  const item = currentPortfolio.find(i => i.id === id);
  if (item) {
    item.title = title;
    item.category = category;
    item.desc = desc;
    saveCustomPortfolio(currentPortfolio);
    renderPortfolio();
    closeEditModal();
    showToast(`Updated "${title}" successfully.`);
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
