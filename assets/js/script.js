let allProducts = [];
let currentCategory = 'semua';
let testimonialIndex = 0;
let testimonialData = [];

document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
    loadTestimonials();
    initUI();
});

// ===== LOAD PRODUCTS =====
async function loadProducts() {
    try {
        const res = await fetch('produk.json');
        allProducts = await res.json();
        renderProducts(allProducts);
        populateFilters();
    } catch (e) {
        document.getElementById('productGrid').innerHTML =
            '<div class="no-products"><p>Gagal memuat produk. Pastikan file produk.json tersedia.</p></div>';
    }
}

// ===== RENDER PRODUCTS =====
function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    if (!products.length) {
        grid.innerHTML = '<div class="no-products"><p>Tidak ada produk ditemukan.</p></div>';
        return;
    }
    grid.innerHTML = products.map(p => `
        <div class="product-card fade-in" onclick="openLightbox(${p.id})">
            <img src="${p.foto}" alt="${p.nama}" class="product-img"
                 onerror="this.src='assets/images/products/placeholder.svg'">
            <div class="product-info">
                <div class="product-category">${p.kategori}</div>
                <div class="product-name">${p.nama}</div>
                <div class="product-price">${p.harga}</div>
                <div class="product-variants">
                    ${p.warna.slice(0, 3).map(w => `<span class="variant-tag">${w}</span>`).join('')}
                    ${p.warna.length > 3 ? `<span class="variant-tag">+${p.warna.length - 3}</span>` : ''}
                </div>
                <button class="btn-order" onclick="event.stopPropagation(); orderWhatsApp(${p.id})">
                    Pesan via WhatsApp
                </button>
            </div>
        </div>
    `).join('');

    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    }, 100);
}

// ===== CATEGORY FILTER =====
function populateFilters() {
    const cats = ['semua', ...new Set(allProducts.map(p => p.kategori))];
    const bar = document.getElementById('filterBar');
    bar.innerHTML = cats.map(c => `
        <button class="filter-btn ${c === currentCategory ? 'active' : ''}"
                onclick="filterCategory('${c}')">
            ${c.charAt(0).toUpperCase() + c.slice(1)}
        </button>
    `).join('');
}

function filterCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase() === category);
    });
    applyFilters();
}

// ===== SEARCH =====
function searchProducts() {
    applyFilters();
}

function applyFilters() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    let filtered = allProducts;

    if (currentCategory !== 'semua') {
        filtered = filtered.filter(p => p.kategori === currentCategory);
    }

    if (query) {
        filtered = filtered.filter(p =>
            p.nama.toLowerCase().includes(query) ||
            p.kategori.toLowerCase().includes(query) ||
            p.deskripsi.toLowerCase().includes(query)
        );
    }

    renderProducts(filtered);
}

// ===== LIGHTBOX =====
function openLightbox(id) {
    const p = allProducts.find(x => x.id === id);
    if (!p) return;

    const lb = document.getElementById('lightbox');
    document.getElementById('lbImg').src = p.foto;
    document.getElementById('lbNama').textContent = p.nama;
    document.getElementById('lbHarga').textContent = p.harga;
    document.getElementById('lbDesc').textContent = p.deskripsi;
    document.getElementById('lbOrder').onclick = () => orderWhatsApp(p.id);
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

// ===== WHATSAPP ORDER =====
function orderWhatsApp(id) {
    const p = allProducts.find(x => x.id === id);
    if (!p) return;
    const msg = `${CONFIG.whatsappMessage}%0A%0A*${p.nama}*%0AHarga: ${p.harga}%0A%0AKode: TEST-${String(p.id).padStart(3, '0')}`;
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`, '_blank');
}

function orderWhatsAppGeneral() {
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=Halo%20${CONFIG.brandName}%2C%20saya%20ingin%20tanya%20produk`, '_blank');
}

// ===== LOAD TESTIMONIALS =====
async function loadTestimonials() {
    try {
        const res = await fetch('testimoni.json');
        testimonialData = await res.json();
        renderTestimonials(testimonialData);
        if (testimonialData.length > 1) {
            setInterval(() => nextTestimonial(testimonialData), 4000);
        }
    } catch (e) {
        // no testimonials
    }
}

function renderTestimonials(data) {
    const track = document.getElementById('testimonialTrack');
    const dots = document.getElementById('testimonialDots');
    track.innerHTML = data.map(t => `
        <div class="testimonial-card">
            <div class="testimonial-user">
                <img src="${t.foto}" alt="${t.nama}" onerror="this.style.display='none'">
            </div>
            <div class="testimonial-stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
            <div class="testimonial-text">"${t.komentar}"</div>
            <div class="testimonial-name">${t.nama}</div>
            <div class="testimonial-city">${t.kota}</div>
        </div>
    `).join('');

    dots.innerHTML = data.map((_, i) => `
        <button class="testimonial-dot ${i === 0 ? 'active' : ''}"
                onclick="goToTestimonial(${i})"></button>
    `).join('');
}

function nextTestimonial(data) {
    testimonialIndex = (testimonialIndex + 1) % data.length;
    updateTestimonial(data);
}

function goToTestimonial(idx) {
    testimonialIndex = idx;
    updateTestimonial(testimonialData);
}

function updateTestimonial(data) {
    const track = document.getElementById('testimonialTrack');
    track.style.transform = `translateX(-${testimonialIndex * 100}%)`;
    document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === testimonialIndex);
    });
}

// ===== UI INIT =====
function initUI() {
    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    if (hamburger) {
        hamburger.addEventListener('click', () => nav.classList.toggle('open'));
    }

    // Close nav on link click
    document.querySelectorAll('nav a').forEach(a => {
        a.addEventListener('click', () => nav.classList.remove('open'));
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
    });

    // Lightbox close on overlay click
    document.getElementById('lightbox').addEventListener('click', function (e) {
        if (e.target === this) closeLightbox();
    });

    // Escape key close lightbox
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeLightbox();
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Inject CONFIG values
    document.querySelectorAll('[data-brand]').forEach(el => el.textContent = CONFIG.brandName);
    document.querySelectorAll('[data-hero-title]').forEach(el => el.textContent = CONFIG.heroTitle);
    document.querySelectorAll('[data-hero-subtitle]').forEach(el => el.textContent = CONFIG.heroSubtitle);
    document.querySelectorAll('[data-about]').forEach(el => el.textContent = CONFIG.aboutText);
    document.querySelectorAll('[data-wa]').forEach(a => {
        a.href = `https://wa.me/${CONFIG.whatsapp}`;
    });
    document.querySelectorAll('[data-ig]').forEach(a => {
        a.href = `https://instagram.com/${CONFIG.instagram}`;
    });
}
