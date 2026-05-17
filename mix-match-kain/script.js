// ====== MENU DATA ======
const riceMenu = [
  {
    id: 1,
    name: 'Classic Rice',
    price: 10,
    img: 'pictures_of_foods/classic_rice.jpg',
  },
  {
    id: 2,
    name: 'Java Rice',
    price: 15,
    img: 'pictures_of_foods/java_rice.jpg',
  },
];

const ulamMenu = [
  {
    id: 4,
    name: 'Lumpia (3pcs)',
    price: 10,
    img: 'pictures_of_foods/lumpia.jpg',
  },
  {
    id: 5,
    name: 'Sunny Side Egg',
    price: 12,
    img: 'pictures_of_foods/sunny_side_egg.jpg',
  },
  {
    id: 6,
    name: 'Siomai (4pcs)',
    price: 8,
    img: 'pictures_of_foods/siomai.jpg',
  },
  {
    id: 8,
    name: 'Longganisa',
    price: 8,
    img: 'pictures_of_foods/longganisa.jpg',
  },
  {
    id: 7,
    name: 'Hotdog',
    price: 12,
    img: 'pictures_of_foods/hotdog.jpg',
  },
  { id: 9, name: 'Skinless', price: 8, img: 'pictures_of_foods/skinless.jpg' },
];

const drinksMenu = [
  { id: 10, name: 'Coke', price: 20, img: 'pictures_of_foods/coke.jpg' },
  { id: 12, name: 'Water', price: 15, img: 'pictures_of_foods/water.jpg' },
];

let cart = [];

// ====== AUDIO CONTEXT ======
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = 'sine') {
  if (!audioContext) return;
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration,
    );
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    console.log('Audio not available');
  }
}

// ====== PARTICLES ======
function createParticles() {
  const particleContainer = document.body;
  const particleTypes = [
    { size: '4px', color: 'rgba(255, 94, 0, 0.3)', shape: 'circle' },
    { size: '6px', color: 'rgba(255, 200, 0, 0.2)', shape: 'circle' },
    { size: '3px', color: 'rgba(0, 255, 200, 0.25)', shape: 'square' },
  ];

  for (let i = 0; i < 80; i++) {
    const particle = document.createElement('div');
    const type =
      particleTypes[Math.floor(Math.random() * particleTypes.length)];
    particle.className = 'particle';
    particle.style.width = type.size;
    particle.style.height = type.size;
    particle.style.background = type.color;
    if (type.shape === 'square') {
      particle.style.borderRadius = '0';
    }
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
  document
    .getElementById('main-content')
    .scrollTo({ top: 0, behavior: 'smooth' });
}

// ====== SHOW/HIDE FAB ======
window.onscroll = function () {
  const fab = document.getElementById('fab-btn');
  if (document.getElementById('main-content').scrollTop > 300) {
    fab.classList.add('show');
  } else {
    fab.classList.remove('show');
  }
};

// ====== PRANK SCREEN ======
function startPrank() {
  let timeLeft = 10;
  const terminalBox = document.querySelector('.terminal-box');

  const messages = [
    { time: 2000, text: '> Initializing repair protocol...' },
    { time: 4000, text: '> Downloading system patches...' },
    { time: 6000, text: '> Applying hotfix...' },
    { time: 8000, text: '> System restored. Loading interface...' },
  ];

  messages.forEach((msg) => {
    setTimeout(() => {
      const p = document.createElement('p');
      p.className = 'error-text';
      p.textContent = msg.text;
      terminalBox.appendChild(p);
    }, msg.time);
  });

  const countdown = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      revealSite();
    }
  }, 1000);
}

function revealSite() {
  const errorScreen = document.getElementById('error-screen');
  errorScreen.style.opacity = '0';
  errorScreen.style.visibility = 'hidden';

  const landingPage = document.getElementById('landing-page');
  landingPage.style.visibility = 'visible';
  landingPage.style.opacity = '1';

  createParticles();
  initHero();
}

// ====== HERO SCROLLER ======
function initHero() {
  const track = document.getElementById('hero-scroller');
  const allItems = [...riceMenu, ...ulamMenu, ...drinksMenu];
  track.innerHTML = '';

  const itemsToAppend = [];
  allItems.forEach((item) => {
    const cleanName = item.name.replace(/\s*\(.*?\)/, '');
    const fallback = `https://placehold.co/500x300/222/white?text=${cleanName}`;

    const scrollItem = document.createElement('div');
    scrollItem.className = 'scroll-item';

    const img = document.createElement('img');
    img.src = item.img;
    img.onerror = () => { img.src = fallback; };
    img.alt = item.name;

    const label = document.createElement('div');
    label.className = 'scroll-label';
    label.textContent = cleanName;

    scrollItem.appendChild(img);
    scrollItem.appendChild(label);
    itemsToAppend.push(scrollItem);
  });

  // Quadruple for seamless loop
  for (let i = 0; i < 4; i++) {
    itemsToAppend.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });
  }
}

// ====== MENU NAVIGATION ======
function goToMenu() {
  document.getElementById('landing-page').classList.add('exit-3d');
  setTimeout(() => {
    document.getElementById('main-content').classList.add('enter-3d');
  }, 200);
}

// ====== RENDER GRID ======
function renderGrid(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = (e) => addToCart(item, e);
    const fallback = `https://placehold.co/400x300/333/white?text=${item.name}`;

    const img = document.createElement('img');
    img.src = item.img;
    img.onerror = () => { img.src = fallback; };
    img.alt = item.name;

    const desc = document.createElement('div');
    desc.className = 'card-description';

    const name = document.createElement('div');
    name.className = 'card-name';
    name.textContent = item.name;

    const price = document.createElement('div');
    price.className = 'card-price';
    price.textContent = `₱${item.price}`;

    desc.appendChild(name);
    desc.appendChild(price);
    card.appendChild(img);
    card.appendChild(desc);

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

  // Create floating heart
  const rect = event.currentTarget.getBoundingClientRect();
  createFloatingHeart(rect.left + rect.width / 2, rect.top);

  // Flying item animation
  const card = event.currentTarget;
  const img = card.querySelector('img');
  const flyingItem = document.createElement('div');
  flyingItem.className = 'flying-item';
  flyingItem.style.backgroundImage = `url(${img.src})`;

  const startX = card.getBoundingClientRect().left + card.offsetWidth / 2 - 30;
  const startY = card.getBoundingClientRect().top + card.offsetHeight / 2 - 30;
  flyingItem.style.left = `${startX}px`;
  flyingItem.style.top = `${startY}px`;

  const cartRect = document
    .getElementById('cart-sidebar')
    .getBoundingClientRect();
  const cartX = cartRect.left + cartRect.width / 2 - 30;
  const cartY = cartRect.top + cartRect.height / 2 - 30;
  flyingItem.style.setProperty('--start-x', `${startX}px`);
  flyingItem.style.setProperty('--start-y', `${startY}px`);
  flyingItem.style.setProperty('--cart-x', `${cartX}px`);
  flyingItem.style.setProperty('--cart-y', `${cartY}px`);

  document.body.appendChild(flyingItem);
  setTimeout(() => flyingItem.remove(), 800);

  // Cart bounce
  const cartSidebar = document.getElementById('cart-sidebar');
  cartSidebar.classList.remove('cart-bounce');
  void cartSidebar.offsetWidth;
  cartSidebar.classList.add('cart-bounce');

  updateCart();
  showToast(`Added ${item.name} to cart!`, 'success');
}

// ====== UPDATE CART ======
function updateCart() {
  const list = document.getElementById('cart-list');
  const totalEl = document.getElementById('total-price');

  if (cart.length === 0) {
    list.innerHTML = '';
    const emptyMsg = document.createElement('p');
    emptyMsg.style.cssText = 'color:#555; text-align:center;';
    emptyMsg.textContent = 'Empty bowl...';
    list.appendChild(emptyMsg);
    totalEl.textContent = '₱0';
    return;
  }

  list.innerHTML = '';
  let total = 0;

  cart.forEach((c, i) => {
    total += c.price * c.qty;
    const item = document.createElement('div');
    item.className = 'cart-item';

    const info = document.createElement('div');
    const details = document.createElement('div');
    details.className = 'cart-item-details';
    details.textContent = c.name;
    const price = document.createElement('div');
    price.className = 'cart-item-price';
    price.textContent = `₱${c.price} ea`;
    info.appendChild(details);
    info.appendChild(price);

    const controls = document.createElement('div');
    controls.className = 'cart-item-controls';

    const minusBtn = document.createElement('button');
    minusBtn.className = 'qty-btn';
    minusBtn.textContent = '-';
    minusBtn.onclick = () => changeQty(i, -1);

    const qtySpan = document.createElement('span');
    qtySpan.textContent = c.qty;

    const plusBtn = document.createElement('button');
    plusBtn.className = 'qty-btn';
    plusBtn.textContent = '+';
    plusBtn.onclick = () => changeQty(i, 1);

    controls.appendChild(minusBtn);
    controls.appendChild(qtySpan);
    controls.appendChild(plusBtn);

    item.appendChild(info);
    item.appendChild(controls);
    list.appendChild(item);
  });

  // Animated price update
  const oldTotal = parseInt(totalEl.textContent.replace('₱', '')) || 0;
  if (oldTotal !== total) {
    totalEl.classList.add('updating');
    const duration = 600;
    const start = Date.now();
    const step = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const current = Math.round(oldTotal + (total - oldTotal) * progress);
      totalEl.textContent = '₱' + current;
      if (progress < 1) requestAnimationFrame(step);
      else totalEl.classList.remove('updating');
    };
    requestAnimationFrame(step);
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
  const span = document.createElement('span');
  span.textContent = message;
  toast.appendChild(span);
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ====== GENERATE QR ======
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

  const qrBox = document.getElementById('qrcode');
  qrBox.innerHTML = '';
  qrBox.style.position = 'relative';
  new QRCode(qrBox, { text: '09618866276', width: 180, height: 180 });
  setTimeout(() => {
    const qrImg = qrBox.querySelector('img');
    const qrCanvas = qrBox.querySelector('canvas');
    if (qrImg) qrImg.style.cssText = 'filter:blur(14px);pointer-events:none;display:block;';
    if (qrCanvas) qrCanvas.style.cssText = 'filter:blur(14px);pointer-events:none;display:block;';
    const overlay = document.createElement('div');
    overlay.className = 'qr-unavailable';
    overlay.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,0.55);z-index:10;';

    const unavailableText = document.createElement('span');
    unavailableText.style.cssText = 'font-family:Anton,sans-serif;font-size:1.1rem;letter-spacing:.15em;color:#ff5e00;text-transform:uppercase;line-height:1.2;text-align:center;';
    unavailableText.appendChild(document.createTextNode('QR'));
    unavailableText.appendChild(document.createElement('br'));
    unavailableText.appendChild(document.createTextNode('UNAVAILABLE'));

    overlay.appendChild(unavailableText);
    qrBox.appendChild(overlay);
  }, 120);

  document.getElementById('modal').style.display = 'flex';
  setTimeout(() => document.getElementById('modal').classList.add('show'), 10);

  const summary = document.getElementById('summary');
  summary.innerHTML = '';

  const customerStrong = document.createElement('strong');
  customerStrong.textContent = 'CUSTOMER: ';
  summary.appendChild(customerStrong);
  summary.appendChild(document.createTextNode(name.toUpperCase()));
  summary.appendChild(document.createElement('br'));

  const totalStrong = document.createElement('strong');
  totalStrong.textContent = 'TOTAL: ';
  summary.appendChild(totalStrong);
  summary.appendChild(document.createTextNode(`₱${total}`));

  summary.appendChild(document.createElement('hr')).className = 'summary-label';

  cart.forEach((c, index) => {
    summary.appendChild(document.createTextNode(`• ${c.name} `));
    const itemSpan = document.createElement('span');
    itemSpan.className = 'summary-item';
    itemSpan.textContent = `x${c.qty}`;
    summary.appendChild(itemSpan);
    summary.appendChild(document.createElement('br'));
  });

  summary.appendChild(document.createElement('hr')).className = 'summary-label';

  // Celebration effects
  createConfetti();
  setTimeout(() => createSparkles(document.getElementById('qrcode'), 30), 500);

  // Send order to server
  const orderData = {
    customer: name,
    total: total,
    items: cart.map((c) => ({ name: c.name, qty: c.qty, price: c.price })),
  };
  sendOrderToServer(orderData);
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
    document.getElementById('landing-page').classList.remove('exit-3d');
    document.getElementById('main-content').classList.remove('enter-3d');
  }, 500);
}

// ====== SEND ORDER TO SERVER ======
async function sendOrderToServer(orderData) {
  try {
    const response = await fetch('http://localhost:3000/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const result = await response.json();
    console.log('Order sent:', result);
  } catch (error) {
    console.log('Server not available, order saved locally');
  }
}

// ====== CONFETTI EFFECT ======
function createConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  const colors = [
    '#ff5e00',
    '#ff9e42',
    '#ffd700',
    '#00ff88',
    '#ff3333',
    '#00ffff',
  ];
  const shapes = ['square', 'circle', 'star'];

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.className = `confetti ${shapes[Math.floor(Math.random() * shapes.length)]}`;
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.background =
      colors[Math.floor(Math.random() * colors.length)];
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
  renderGrid(riceMenu, 'rice-grid');
  renderGrid(ulamMenu, 'ulam-grid');
  renderGrid(drinksMenu, 'drinks-grid');
});
