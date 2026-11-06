// ====== MENU DATA ======
const riceMenu = [
  { id: 1, name: 'Classic Rice', price: 10, img: 'pictures_of_foods/classic_rice.jpg' },
  { id: 2, name: 'Java Rice', price: 15, img: 'pictures_of_foods/java_rice.jpg' },
];

const ulamMenu = [
  { id: 4, name: 'Lumpia (3pcs)', price: 10, img: 'pictures_of_foods/lumpia.jpg' },
  { id: 5, name: 'Sunny Side Egg', price: 12, img: 'pictures_of_foods/sunny_side_egg.jpg' },
  { id: 6, name: 'Siomai (4pcs)', price: 8, img: 'pictures_of_foods/siomai.jpg' },
  { id: 8, name: 'Longganisa', price: 8, img: 'pictures_of_foods/longganisa.jpg' },
  { id: 7, name: 'Hotdog', price: 12, img: 'pictures_of_foods/hotdog.jpg' },
  { id: 9, name: 'Skinless', price: 8, img: 'pictures_of_foods/skinless.jpg' },
];

const drinksMenu = [
  { id: 10, name: 'Coke', price: 20, img: 'pictures_of_foods/coke.jpg' },
  { id: 12, name: 'Water', price: 15, img: 'pictures_of_foods/water.jpg' },
];

let cart = [];
let cartTotalFrame = null;
let cartTotalVersion = 0;

// ====== AUDIO CONTEXT (lazy) ======
let audioContext = null;
function getAudioContext() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

function playSound(frequency, duration, type = 'sine') {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
  }
}

// ====== PARTICLES ======
function createParticles() {
  if (window.innerWidth <= 768) return;
  const particleContainer = document.body;
  const particleTypes = [
    { size: '4px', color: 'rgba(255, 94, 0, 0.3)', shape: 'circle' },
    { size: '6px', color: 'rgba(255, 200, 0, 0.2)', shape: 'circle' },
    { size: '3px', color: 'rgba(0, 255, 200, 0.25)', shape: 'square' },
  ];
  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div');
    const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
    particle.className = 'particle';
    particle.style.width = type.size;
    particle.style.height = type.size;
    particle.style.background = type.color;
    if (type.shape === 'square') particle.style.borderRadius = '0';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = Math.random() * 15 + 10 + 's';
    particleContainer.appendChild(particle);
  }
}

// ====== FLOATING HEARTS ======
function createFloatingHeart(x, y) {
  const hearts = ['❤️', '💕', '💖', '💗', '😍'];
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  heart.style.left = x + 'px';
  heart.style.top = y + 'px';
  heart.style.fontSize = Math.random() * 15 + 15 + 'px';
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 2000);
}

// ====== SCROLL TO TOP ======
function scrollToTop() {
  document.getElementById('main-content').scrollTo({ top: 0, behavior: 'smooth' });
}

// ====== SHOW/HIDE FAB ======
document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.addEventListener('scroll', () => {
      const fab = document.getElementById('fab-btn');
      if (fab) fab.classList.toggle('show', mainContent.scrollTop > 300);
    });
  }
});

// ====== HERO SCROLLER ======
function initHero() {
  const track = document.getElementById('hero-scroller');
  const allItems = [...riceMenu, ...ulamMenu, ...drinksMenu];
  const html = allItems.map((item) => {
    const cleanName = item.name.replace(/\s*\(.*?\)/, '');
    const fallback = `https://placehold.co/500x300/222/white?text=${cleanName}`;
    return `<div class="scroll-item"><img src="${item.img}" onerror="this.src='${fallback}'" alt="${item.name}"><div class="scroll-label">${cleanName}</div></div>`;
  }).join('');
  track.innerHTML = html.repeat(2);
}

// ====== MENU NAVIGATION ======
function goToMenu() {
  const landing = document.getElementById('landing-page');
  landing.classList.add('exit-3d');
  landing.inert = true;
  setTimeout(() => {
    document.getElementById('main-content').classList.add('enter-3d');
    document.getElementById('search-input').focus({ preventScroll: true });
  }, 200);
}

// ====== RENDER GRID ======
function renderGrid(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach((item, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'card';
    card.setAttribute('aria-label', `Add ${item.name}, ₱${item.price}, to demo cart`);
    card.onclick = (e) => addToCart(item, e);
    const fallback = `https://placehold.co/400x300/333/white?text=${item.name}`;
    card.innerHTML = `
      <img src="${item.img}" onerror="this.src='${fallback}'" alt="" loading="lazy" decoding="async" style="object-fit:cover;width:100%;height:140px;">
      <span class="card-description">
        <span class="card-name">${item.name}</span>
        <span class="card-price">&#8369;${item.price}</span>
      </span>
    `;
    container.appendChild(card);
    setTimeout(() => card.classList.add('reveal'), index * 150);
  });
}

// ====== ADD TO CART ======
function addToCart(item, event) {
  const found = cart.find((c) => c.id === item.id);
  if (found) found.qty++;
  else cart.push({ ...item, qty: 1 });

  playSound(800, 0.1, 'sine');

  const rect = event.currentTarget.getBoundingClientRect();
  createFloatingHeart(rect.left + rect.width / 2, rect.top);

  const card = event.currentTarget;
  const img = card.querySelector('img');
  const flyingItem = document.createElement('div');
  flyingItem.className = 'flying-item';
  flyingItem.style.backgroundImage = `url(${img.src})`;

  const startX = card.getBoundingClientRect().left + card.offsetWidth / 2 - 30;
  const startY = card.getBoundingClientRect().top + card.offsetHeight / 2 - 30;
  flyingItem.style.left = `${startX}px`;
  flyingItem.style.top = `${startY}px`;

  const isMobile = window.innerWidth <= 768;
  const edgeTab = document.getElementById('mobile-cart-fab');
  const cartRect = document.getElementById('cart-sidebar').getBoundingClientRect();
  const targetRect = (isMobile && edgeTab) ? edgeTab.getBoundingClientRect() : cartRect;
  const cartX = targetRect.left + targetRect.width / 2 - 30;
  const cartY = targetRect.top + targetRect.height / 2 - 30;
  flyingItem.style.setProperty('--start-x', `${startX}px`);
  flyingItem.style.setProperty('--start-y', `${startY}px`);
  flyingItem.style.setProperty('--cart-x', `${cartX}px`);
  flyingItem.style.setProperty('--cart-y', `${cartY}px`);

  document.body.appendChild(flyingItem);
  setTimeout(() => flyingItem.remove(), 800);

  const cartSidebar = document.getElementById('cart-sidebar');
  cartSidebar.classList.remove('cart-bounce');
  void cartSidebar.offsetWidth;
  cartSidebar.classList.add('cart-bounce');

  updateCart();
  showToast(`Added ${item.name} to cart!`, 'success');

  if (isMobile) {
    const fab = document.getElementById('mobile-cart-fab');
    if (fab) {
      fab.classList.remove('fab-added');
      void fab.offsetWidth;
      fab.classList.add('fab-added');
    }
  }
}

// ====== UPDATE CART ======
function updateCart() {
  const list = document.getElementById('cart-list');
  const totalEl = document.getElementById('total-price');
  const version = ++cartTotalVersion;
  if (cartTotalFrame !== null) {
    cancelAnimationFrame(cartTotalFrame);
    cartTotalFrame = null;
  }
  totalEl.classList.remove('updating');

  if (cart.length === 0) {
    list.innerHTML = '<p style="color:#555; text-align:center;">Empty bowl...</p>';
    totalEl.textContent = '₱0';
    const badge = document.getElementById('cart-badge');
    const mobileFab = document.getElementById('mobile-cart-fab');
    if (badge) badge.textContent = '0';
    if (mobileFab) mobileFab.classList.remove('has-items');
    return;
  }

  list.innerHTML = '';
  let total = 0;

  cart.forEach((c, i) => {
    total += c.price * c.qty;
    list.innerHTML += `
      <div class="cart-item">
        <div>
          <div class="cart-item-details">${c.name}</div>
          <div class="cart-item-price">&#8369;${c.price} ea</div>
        </div>
        <div class="cart-item-controls">
          <button type="button" class="qty-btn" aria-label="Decrease ${c.name} quantity" onclick="changeQty(${i}, -1)">-</button>
          <span>${c.qty}</span>
          <button type="button" class="qty-btn" aria-label="Increase ${c.name} quantity" onclick="changeQty(${i}, 1)">+</button>
        </div>
      </div>
    `;
  });

  const oldTotal = parseInt(totalEl.textContent.replace('₱', '')) || 0;
  if (oldTotal !== total) {
    totalEl.classList.add('updating');
    const duration = 600;
    const start = Date.now();
    const step = () => {
      if (version !== cartTotalVersion) return;
      const progress = Math.min((Date.now() - start) / duration, 1);
      const current = Math.round(oldTotal + (total - oldTotal) * progress);
      totalEl.textContent = '₱' + current;
      if (progress < 1) cartTotalFrame = requestAnimationFrame(step);
      else {
        cartTotalFrame = null;
        totalEl.classList.remove('updating');
      }
    };
    cartTotalFrame = requestAnimationFrame(step);
  }

  const badge = document.getElementById('cart-badge');
  const mobileFab = document.getElementById('mobile-cart-fab');
  if (badge && mobileFab) {
    const totalQty = cart.reduce((s, c) => s + c.qty, 0);
    badge.textContent = totalQty;
    mobileFab.classList.toggle('has-items', cart.length > 0);
    const fabText = mobileFab.querySelector('.fab-text');
    if (fabText) fabText.textContent = cart.length > 0 ? `₱${total}` : 'VIEW CART';
  }
}

function changeQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCart();
}

// ====== TOAST NOTIFICATIONS ======
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ====== DEMO ORDER PREVIEW ======
function generateQR() {
  const name = document.getElementById('cust-name').value.trim();
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  if (!name || cart.length === 0) {
    showToast('Enter name & select items!', 'error');
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.add('cart-shake');
    setTimeout(() => cartSidebar.classList.remove('cart-shake'), 500);
    playSound(200, 0.3, 'sawtooth');
    return;
  }

  playSound(600, 0.3, 'triangle');

  // Close the cart drawer before opening modal so body.overflow and drawer state are clean
  if (typeof closeCartDrawer === 'function') closeCartDrawer();

  const qrBox = document.getElementById('qrcode');
  qrBox.textContent = 'DEMO ONLY · NO PAYMENT';

  const modal = document.getElementById('modal');
  modal.style.display = 'flex';
  document.getElementById('main-content').inert = true;
  document.getElementById('page-wrapper').inert = true;
  document.getElementById('fab-btn').inert = true;
  modal.querySelector('.done-btn').focus();
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);

  // FIX BUG 2: sanitize name via textContent before injecting into innerHTML (XSS prevention)
  const sanitized = document.createElement('span');
  sanitized.textContent = name.toUpperCase();
  const safeName = sanitized.innerHTML;

  document.getElementById('summary').innerHTML = `
    <strong>CUSTOMER:</strong> ${safeName}<br>
    <strong>TOTAL:</strong> &#8369;${total}
    <hr class="summary-label">
    ${cart.map((c) => `• ${c.name} <span class="summary-item">x${c.qty}</span>`).join('<br>')}
  `;

  createConfetti();
  setTimeout(() => createSparkles(document.getElementById('qrcode'), 30), 500);
}

// ====== CLOSE MODAL ======
function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
    cart = [];
    updateCart();
    document.getElementById('cust-name').value = '';
    // FIX BUG 3: clear auto-close timer so it can't fire on the reset/landed state
    if (typeof _clearAutoClose === 'function') _clearAutoClose();
    // FIX: close the cart drawer before returning to landing — prevents stale drawer-open state on next session
    if (typeof closeCartDrawer === 'function') closeCartDrawer();
    // Reset scroll position so next order starts from top of menu
    const mc = document.getElementById('main-content');
    if (mc) {
      mc.scrollTop = 0;
      mc.inert = false;
    }
    const landing = document.getElementById('landing-page');
    landing.classList.remove('exit-3d');
    landing.inert = false;
    document.getElementById('page-wrapper').inert = false;
    document.getElementById('fab-btn').inert = false;
    document.getElementById('main-content').classList.remove('enter-3d');
    landing.querySelector('.order-now-btn').focus();
  }, 500);
}

// ====== CONFETTI EFFECT ======
function createConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);
  const colors = ['#ff5e00', '#ff9e42', '#ffd700', '#00ff88', '#ff3333', '#00ffff'];
  const shapes = ['square', 'circle', 'star'];
  const confettiCount = window.innerWidth <= 768 ? 12 : 40;
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = `confetti ${shapes[Math.floor(Math.random() * shapes.length)]}`;
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.width = Math.random() * 10 + 8 + 'px';
    confetti.style.height = confetti.style.width;
    container.appendChild(confetti);
  }
  setTimeout(() => container.remove(), 5000);
}

// ====== SPARKLE EFFECT ======
function createSparkles(element, count = 20) {
  const rect = element.getBoundingClientRect();
  const container = document.createElement('div');
  container.className = 'sparkle-container';
  container.style.left = rect.left + 'px';
  container.style.top = rect.top + 'px';
  container.style.width = rect.width + 'px';
  container.style.height = rect.height + 'px';
  document.body.appendChild(container);
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('div');
    const shapes = ['', 'star', 'circle', 'diamond'];
    sparkle.className = `sparkle ${shapes[Math.floor(Math.random() * shapes.length)]}`;
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 0.5 + 's';
    sparkle.style.background = Math.random() > 0.5 ? '#ffd700' : '#ff5e00';
    container.appendChild(sparkle);
  }
  setTimeout(() => container.remove(), 1500);
}

// ====== INITIALIZE ======
document.addEventListener('DOMContentLoaded', () => {
  initHero();
  createParticles();
  renderGrid(riceMenu, 'rice-grid');
  renderGrid(ulamMenu, 'ulam-grid');
  renderGrid(drinksMenu, 'drinks-grid');
  document.getElementById('modal').addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
    if (event.key === 'Tab') {
      event.preventDefault();
      document.querySelector('#modal .done-btn').focus();
    }
  });
});
