let allProducts = [];
let currentCategory = 'semua';
let testimonialIndex = 0;
let testimonialData = [];

document.addEventListener('DOMContentLoaded', function () {
    createParticles();
    typingEffect();
    loadProducts();
    loadTestimonials();
    initUI();
    setupScrollReveal();
});

// ===== PARTICLES BACKGROUND =====
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (15 + Math.random() * 25) + 's';
        p.style.animationDelay = Math.random() * 15 + 's';
        p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
        container.appendChild(p);
    }
}

// ===== TYPING EFFECT =====
function typingEffect() {
    const el = document.getElementById('typing-text');
    if (!el) return;
    const text = el.textContent;
    el.textContent = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, 40 + Math.random() * 30);
        }
    }
    setTimeout(type, 800);
}

// ===== LOAD PRODUCTS =====
async function loadProducts() {
    showShimmer();
    try {
        const res = await fetch('produk.json');
        allProducts = await res.json();
        setTimeout(() => {
            renderProducts(allProducts);
            populateFilters();
        }, 400);
    } catch (e) {
        document.getElementById('productGrid').innerHTML =
            '<div class="no-products"><p>Gagal memuat produk.</p></div>';
    }
}

function showShimmer() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = Array(6).fill(0).map(() => `
        <div class="shimmer">
            <div class="shimmer-img"></div>
            <div class="shimmer-text">
                <div class="shimmer-line" style="width:30%"></div>
                <div class="shimmer-line" style="width:70%"></div>
                <div class="shimmer-line"></div>
            </div>
        </div>
    `).join('');
}

// ===== RENDER PRODUCTS =====
function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    if (!products.length) {
        grid.innerHTML = '<div class="no-products"><p>Tidak ada produk ditemukan.</p></div>';
        return;
    }
    grid.innerHTML = products.map((p, i) => `
        <div class="product-card stagger tilt" onclick="openLightbox(${p.id})" style="--delay:${i * 0.08}s">
            <div class="product-img-wrapper">
                <img src="${p.foto}" alt="${p.nama}" class="product-img"
                     onerror="this.src='assets/images/products/placeholder.svg'">
            </div>
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

    // Staggered entrance
    requestAnimationFrame(() => {
        document.querySelectorAll('.product-card.stagger').forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 80);
        });
    });

    // 3D tilt
    setupTilt();
}

// ===== 3D TILT EFFECT =====
function setupTilt() {
    document.querySelectorAll('.product-card.tilt').forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            this.classList.add('glowing');
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            this.classList.remove('glowing');
        });
    });
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

    document.body.style.overflow = 'hidden';
    const lb = document.getElementById('lightbox');
    document.getElementById('lbImg').src = p.foto;
    document.getElementById('lbNama').textContent = p.nama;
    document.getElementById('lbHarga').textContent = p.harga;
    document.getElementById('lbDesc').textContent = p.deskripsi;
    document.getElementById('lbOrder').onclick = () => orderWhatsApp(p.id);
    lb.classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

// ===== WHATSAPP ORDER =====
function orderWhatsApp(id) {
    const p = allProducts.find(x => x.id === id);
    if (!p) return;
    const msg = `${CONFIG.whatsappMessage}%0A%0A*${p.nama}*%0AHarga: ${p.harga}%0A%0AKode: TB-${String(p.id).padStart(3, '0')}`;
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
            setInterval(() => nextTestimonial(), 4000);
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

function nextTestimonial() {
    testimonialIndex = (testimonialIndex + 1) % testimonialData.length;
    updateTestimonial();
}

function goToTestimonial(idx) {
    testimonialIndex = idx;
    updateTestimonial();
}

function updateTestimonial() {
    const track = document.getElementById('testimonialTrack');
    track.style.transform = `translateX(-${testimonialIndex * 100}%)`;
    document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === testimonialIndex);
    });
}

// ===== SCROLL REVEAL =====
function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        observer.observe(el);
    });
}

// ===== UI INIT =====
function initUI() {
    // Hamburgermenu
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    if (hamburger) {
        hamburger.addEventListener('click', () => nav.classList.toggle('open'));
    }

    document.querySelectorAll('nav a').forEach(a => {
        a.addEventListener('click', () => nav.classList.remove('open'));
    });

    // Header scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        const st = document.getElementById('scrollTop');
        if (st) st.classList.toggle('visible', window.scrollY > 400);
    });

    // Lightbox
    const lb = document.getElementById('lightbox');
    if (lb) {
        lb.addEventListener('click', function (e) {
            if (e.target === this) closeLightbox();
        });
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeLightbox();
    });

    // Smooth scroll nav
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
    document.querySelectorAll('[data-hero-subtitle-typing]').forEach(el => {
        el.textContent = CONFIG.heroSubtitle;
    });
    document.querySelectorAll('[data-about]').forEach(el => el.textContent = CONFIG.aboutText);
    document.querySelectorAll('[data-wa]').forEach(a => {
        a.href = `https://wa.me/${CONFIG.whatsapp}`;
    });
    document.querySelectorAll('[data-ig]').forEach(a => {
        a.href = `https://instagram.com/${CONFIG.instagram}`;
    });
}
