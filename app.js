/**
 * BLOOMY WEDDINGS - Classic Edition Application Script
 * Particle canvas, theme switcher, service cards, filterable gallery,
 * package quote estimator, custom upload manager, and WhatsApp integration.
 */

document.addEventListener("DOMContentLoaded", () => {
  initParticlesCanvas();
  renderServices();
  renderPortfolio('all');
  initPackageEstimator();
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
   4. Filterable Portfolio Gallery & Lightbox
---------------------------------------------------- */
let currentPortfolio = getCustomPortfolio();

function renderPortfolio(category = 'all') {
  const container = document.getElementById("gallery-grid");
  if (!container) return;

  const filtered = category === 'all' 
    ? currentPortfolio 
    : currentPortfolio.filter(item => item.category === category);

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding: 60px 0; color: var(--text-muted);">
      <p style="font-size: 1.1rem; font-family: var(--font-serif);">No classic photographs found in this category.</p>
    </div>`;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="gallery-item" onclick="openLightbox('${item.id}')">
      <img src="${item.image}" alt="${item.title}" class="gallery-img" loading="lazy">
      <div class="gallery-overlay">
        <span class="gallery-tag">${item.tag || item.category}</span>
        <h4 class="gallery-title">${item.title}</h4>
        <p class="gallery-location">📍 ${item.location}</p>
      </div>
    </div>
  `).join('');
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
  title.textContent = item.title;
  location.textContent = `📍 ${item.location}`;
  desc.textContent = item.desc || "Fine-art classic photography by Bloomy Weddings.";
  
  const waText = encodeURIComponent(`Hi Bloomy Weddings! I loved your classic photography shoot "${item.title}" (${item.location}). I would like to check available dates and pricing.`);
  waBtn.href = `https://wa.me/917025198952?text=${waText}`;

  modal.classList.add("active");
}

function closeLightbox() {
  const modal = document.getElementById("lightbox-modal");
  if (modal) modal.classList.remove("active");
}

/* ----------------------------------------------------
   5. Interactive Package & Quote Estimator
---------------------------------------------------- */
let selectedAddons = new Set();

function initPackageEstimator() {
  const serviceSelect = document.getElementById("est-service");
  const durationSelect = document.getElementById("est-duration");
  const addonsContainer = document.getElementById("est-addons-container");
  if (!serviceSelect || !addonsContainer) return;

  addonsContainer.innerHTML = BLOOMY_DATA.pricingAddons.map(addon => `
    <div class="addon-item" id="addon-card-${addon.id}" onclick="toggleAddon('${addon.id}')">
      <div class="addon-info">
        <input type="checkbox" id="addon-chk-${addon.id}" value="${addon.id}" style="accent-color: var(--gold-primary);" onclick="event.stopPropagation(); toggleAddon('${addon.id}')">
        <div>
          <div style="font-weight: 600; font-size: 0.92rem; font-family: var(--font-title);">${addon.name}</div>
          <div style="font-size: 0.82rem; color: var(--text-muted);">${addon.desc}</div>
        </div>
      </div>
      <div class="addon-price">+₹${addon.price.toLocaleString('en-IN')}</div>
    </div>
  `).join('');

  serviceSelect.addEventListener("change", calculateTotalEstimate);
  durationSelect.addEventListener("change", calculateTotalEstimate);

  calculateTotalEstimate();
}

function toggleAddon(addonId) {
  const chk = document.getElementById(`addon-chk-${addonId}`);
  const card = document.getElementById(`addon-card-${addonId}`);
  
  if (selectedAddons.has(addonId)) {
    selectedAddons.delete(addonId);
    if (chk) chk.checked = false;
    if (card) card.classList.remove("selected");
  } else {
    selectedAddons.add(addonId);
    if (chk) chk.checked = true;
    if (card) card.classList.add("selected");
  }
  calculateTotalEstimate();
}

function calculateTotalEstimate() {
  const serviceSelect = document.getElementById("est-service");
  const durationSelect = document.getElementById("est-duration");
  const basePriceDisplay = document.getElementById("summary-base-price");
  const addonsPriceDisplay = document.getElementById("summary-addons-price");
  const totalPriceDisplay = document.getElementById("summary-total-price");
  const sendWaBtn = document.getElementById("est-wa-btn");

  if (!serviceSelect) return;

  const baseRates = {
    "wedding": 45000,
    "destination": 75000,
    "modeling": 20000,
    "birthday": 15000
  };

  const serviceType = serviceSelect.value;
  const durationMultiplier = parseFloat(durationSelect.value) || 1;

  const baseTotal = (baseRates[serviceType] || 45000) * durationMultiplier;
  
  let addonsTotal = 0;
  selectedAddons.forEach(id => {
    const item = BLOOMY_DATA.pricingAddons.find(a => a.id === id);
    if (item) addonsTotal += item.price;
  });

  const grandTotal = baseTotal + addonsTotal;

  if (basePriceDisplay) basePriceDisplay.textContent = `₹${baseTotal.toLocaleString('en-IN')}`;
  if (addonsPriceDisplay) addonsPriceDisplay.textContent = `₹${addonsTotal.toLocaleString('en-IN')}`;
  if (totalPriceDisplay) totalPriceDisplay.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

  const serviceNames = {
    "wedding": "Royal Wedding Photography",
    "destination": "Destination Photography",
    "modeling": "Modeling & Portraiture",
    "birthday": "Birthday Party & Galas"
  };
  const durationTexts = {
    "1": "1 Full Day",
    "2": "2 Days Package",
    "3": "3 Days Royal Package",
    "0.5": "Half Day Session"
  };

  const selectedAddonNames = Array.from(selectedAddons).map(id => {
    const found = BLOOMY_DATA.pricingAddons.find(a => a.id === id);
    return found ? found.name : '';
  }).filter(Boolean);

  const waMsg = `Hi Bloomy Weddings! I calculated an estimate on your website:
- Service: ${serviceNames[serviceType]}
- Duration: ${durationTexts[durationSelect.value] || '1 Day'}
- Add-ons: ${selectedAddonNames.length > 0 ? selectedAddonNames.join(', ') : 'None'}
- Total Quote: ₹${grandTotal.toLocaleString('en-IN')}

I would like to check availability and book a consultation!`;

  if (sendWaBtn) {
    sendWaBtn.href = `https://wa.me/917025198952?text=${encodeURIComponent(waMsg)}`;
  }
}

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
