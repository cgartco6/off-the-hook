/* ============================================================
   OFF THE HOOK – Product Database + Owner Dashboard
   Database: localStorage (persists in the browser)
   ============================================================ */

const ADMIN_PASSWORD = 'offthehook2026'; // Change this to your own password
const DB_KEY = 'offthehook_products_v1';

/* ---------- Default products (used when no database exists) ---------- */
const DEFAULT_PRODUCTS = [
  { id: '1', category: 'fish', name: 'Fresh Hake Portions', price: 'From R89 / kg', description: 'Firm, mild, perfect for pan or braai', photo: '' },
  { id: '2', category: 'fish', name: 'Kingklip Fillets', price: 'From R149 / kg', description: 'Premium local favourite', photo: '' },
  { id: '3', category: 'fish', name: 'Fresh Snoek', price: 'Market price', description: 'Classic Cape braai fish', photo: '' },
  { id: '4', category: 'fish', name: 'Yellowtail', price: 'When available', description: 'Excellent grilled or smoked', photo: '' },
  { id: '5', category: 'chicken', name: 'Whole Chickens', price: 'From R79 each', description: 'Fresh, ready for roasting or braai', photo: '' },
  { id: '6', category: 'chicken', name: 'Chicken Portions', price: 'From R69 / kg', description: 'Legs, thighs, breasts available', photo: '' },
  { id: '7', category: 'chicken', name: 'Free-Range Chickens', price: 'Premium pricing', description: 'When stock allows', photo: '' },
  { id: '8', category: 'eggs', name: 'Free-Range Eggs (6)', price: 'From R28', description: 'Fresh free-range eggs', photo: '' },
  { id: '9', category: 'eggs', name: 'Free-Range Eggs (12)', price: 'From R52', description: 'Best value for families', photo: '' },
  { id: '10', category: 'eggs', name: 'Free-Range Eggs (18)', price: 'From R75', description: 'Weekly stock-up size', photo: '' }
];

const CATEGORY_LABELS = {
  fish: '🐟 Fresh Fish',
  chicken: '🐔 Quality Chickens',
  eggs: '🥚 Free-Range Eggs'
};

/* ---------- Database helpers ---------- */
function loadProducts() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
}

function saveProducts(products) {
  localStorage.setItem(DB_KEY, JSON.stringify(products));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ---------- Render public products section ---------- */
function renderProducts() {
  const products = loadProducts();
  const container = document.getElementById('products-container');
  if (!container) return;

  const categories = ['fish', 'chicken', 'eggs'];
  let html = '<div class="product-categories">';

  categories.forEach(cat => {
    const items = products.filter(p => p.category === cat);
    if (items.length === 0) return;

    html += `<div class="category"><h3>${CATEGORY_LABELS[cat]}</h3><div class="product-grid">`;

    items.forEach(p => {
      const imgHtml = p.photo
        ? `<img src="${p.photo}" alt="${p.name}" class="product-photo">`
        : `<div class="product-img ${p.category}">${p.name.split(' ').pop()}</div>`;

      html += `
        <div class="product-card">
          ${imgHtml}
          <h4>${escapeHtml(p.name)}</h4>
          <p class="price">${escapeHtml(p.price)}</p>
          <p class="note">${escapeHtml(p.description || '')}</p>
        </div>`;
    });

    html += '</div></div>';
  });

  html += '</div>';
  container.innerHTML = html;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ---------- Admin Dashboard ---------- */
let currentPhotoData = '';

function openAdmin() {
  document.getElementById('admin-modal').classList.remove('hidden');
  document.getElementById('admin-login').classList.remove('hidden');
  document.getElementById('admin-content').classList.add('hidden');
  document.getElementById('admin-password').value = '';
  document.getElementById('admin-password').focus();
}

function closeAdmin() {
  document.getElementById('admin-modal').classList.add('hidden');
}

function unlockAdmin() {
  const pass = document.getElementById('admin-password').value;
  if (pass === ADMIN_PASSWORD) {
    document.getElementById('admin-login').classList.add('hidden');
    document.getElementById('admin-content').classList.remove('hidden');
    renderAdminList();
  } else {
    alert('Incorrect password');
  }
}

function renderAdminList() {
  const products = loadProducts();
  const list = document.getElementById('admin-product-list');

  if (products.length === 0) {
    list.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px;">No products yet. Click “+ Add Product”.</p>';
    return;
  }

  list.innerHTML = products.map(p => {
    const thumb = p.photo
      ? `<img src="${p.photo}" class="admin-item-img" alt="">`
      : `<div class="admin-item-img ${p.category}">${(p.name||'').slice(0,6)}</div>`;

    return `
      <div class="admin-item" data-id="${p.id}">
        ${thumb}
        <div class="admin-item-info">
          <strong>${escapeHtml(p.name)}</strong>
          <span>${escapeHtml(p.price)}</span>
          <small>${escapeHtml(p.description || '')}</small>
        </div>
        <div class="admin-item-actions">
          <button type="button" onclick="editProduct('${p.id}')">Edit</button>
          <button type="button" class="btn-del" onclick="deleteProduct('${p.id}')">Delete</button>
        </div>
      </div>`;
  }).join('');
}

function openProductForm(product = null) {
  const modal = document.getElementById('product-form-modal');
  const title = document.getElementById('form-title');
  document.getElementById('form-id').value = product ? product.id : '';
  document.getElementById('form-category').value = product ? product.category : 'fish';
  document.getElementById('form-name').value = product ? product.name : '';
  document.getElementById('form-price').value = product ? product.price : '';
  document.getElementById('form-description').value = product ? (product.description || '') : '';
  currentPhotoData = product ? (product.photo || '') : '';

  const preview = document.getElementById('photo-preview');
  if (currentPhotoData) {
    preview.innerHTML = `<img src="${currentPhotoData}" alt="Preview">`;
  } else {
    preview.innerHTML = '';
  }
  document.getElementById('form-photo').value = '';

  title.textContent = product ? 'Edit Product' : 'Add Product';
  modal.classList.remove('hidden');
}

function closeProductForm() {
  document.getElementById('product-form-modal').classList.add('hidden');
  currentPhotoData = '';
}

function editProduct(id) {
  const products = loadProducts();
  const product = products.find(p => p.id === id);
  if (product) openProductForm(product);
}

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  let products = loadProducts();
  products = products.filter(p => p.id !== id);
  saveProducts(products);
  renderAdminList();
  renderProducts();
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 1.5 * 1024 * 1024) {
    alert('Image is too large. Please use a photo under 1.5 MB.');
    return;
  }
  const reader = new FileReader();
  reader.onload = function (ev) {
    currentPhotoData = ev.target.result;
    document.getElementById('photo-preview').innerHTML = `<img src="${currentPhotoData}" alt="Preview">`;
  };
  reader.readAsDataURL(file);
}

function saveProduct(e) {
  e.preventDefault();
  const id = document.getElementById('form-id').value;
  const product = {
    id: id || generateId(),
    category: document.getElementById('form-category').value,
    name: document.getElementById('form-name').value.trim(),
    price: document.getElementById('form-price').value.trim(),
    description: document.getElementById('form-description').value.trim(),
    photo: currentPhotoData
  };

  if (!product.name || !product.price) {
    alert('Name and price are required');
    return;
  }

  let products = loadProducts();
  if (id) {
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) products[idx] = product;
  } else {
    products.push(product);
  }

  saveProducts(products);
  closeProductForm();
  renderAdminList();
  renderProducts();
}

function exportJSON() {
  const products = loadProducts();
  const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'offthehook-products.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (ev) {
    try {
      const data = JSON.parse(ev.target.result);
      if (!Array.isArray(data)) throw new Error('Invalid format');
      saveProducts(data);
      renderAdminList();
      renderProducts();
      alert('Products imported successfully');
    } catch (err) {
      alert('Could not import file. Make sure it is a valid products JSON.');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function resetToDefaults() {
  if (!confirm('Reset all products to the original defaults? This cannot be undone.')) return;
  saveProducts(DEFAULT_PRODUCTS);
  renderAdminList();
  renderProducts();
}

/* ---------- Mobile menu + smooth scroll ---------- */
document.addEventListener('DOMContentLoaded', function () {
  // Render products from database on page load
  renderProducts();

  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
        const topBarHeight = document.querySelector('.top-bar')?.offsetHeight || 0;
        const offset = headerHeight + topBarHeight + 10;
        const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    });
  });

  // Admin triggers
  document.getElementById('admin-trigger')?.addEventListener('click', openAdmin);
  document.getElementById('admin-close')?.addEventListener('click', closeAdmin);
  document.querySelector('#admin-modal .admin-backdrop')?.addEventListener('click', closeAdmin);
  document.getElementById('admin-login-btn')?.addEventListener('click', unlockAdmin);
  document.getElementById('admin-password')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') unlockAdmin();
  });

  document.getElementById('btn-add-product')?.addEventListener('click', () => openProductForm());
  document.getElementById('form-close')?.addEventListener('click', closeProductForm);
  document.getElementById('form-cancel')?.addEventListener('click', closeProductForm);
  document.querySelector('#product-form-modal .admin-backdrop')?.addEventListener('click', closeProductForm);
  document.getElementById('product-form')?.addEventListener('submit', saveProduct);
  document.getElementById('form-photo')?.addEventListener('change', handlePhotoUpload);
  document.getElementById('btn-clear-photo')?.addEventListener('click', () => {
    currentPhotoData = '';
    document.getElementById('photo-preview').innerHTML = '';
    document.getElementById('form-photo').value = '';
  });

  document.getElementById('btn-export')?.addEventListener('click', exportJSON);
  document.getElementById('btn-import')?.addEventListener('click', () => document.getElementById('import-file').click());
  document.getElementById('import-file')?.addEventListener('change', importJSON);
  document.getElementById('btn-reset')?.addEventListener('click', resetToDefaults);
});

/* Mobile nav open style */
const style = document.createElement('style');
style.textContent = `
  @media (max-width: 700px) {
    .nav.open {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 72px;
      left: 0;
      right: 0;
      background: white;
      padding: 20px;
      gap: 16px;
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }
    .nav.open a { padding: 10px 0; font-size: 1.05rem; }
    .header { position: relative; }
  }
`;
document.head.appendChild(style);
