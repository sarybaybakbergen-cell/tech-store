const defaultProducts = [
    {
        id: 1,
        title: "MacBook Air M2 16/512GB",
        price: 580000,
        category: "ноутбуки",
        badge: "hit",
        desc: "Тонкий алюминиевый корпус, чип Apple M2, экран Liquid Retina и до 18 часов работы от батареи.",
        img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80"
    },
    {
        id: 2,
        title: "Смартфон Poco F6 512GB",
        price: 210000,
        category: "смартфоны",
        badge: "new",
        desc: "Процессор Snapdragon флагманского уровня, AMOLED 120 Гц и скоростная зарядка 90 Вт.",
        img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80"
    },
    {
        id: 3,
        title: "Игровой ПК RTX 4070 / i7",
        price: 750000,
        category: "пк",
        badge: "hit",
        desc: "Сборка для 2K-гейминга на ультра-настройках, 32 ГБ DDR5 и скоростной NVMe SSD.",
        img: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=80"
    },
    {
        id: 4,
        title: "Игровой монитор 27' 165Hz IPS",
        price: 135000,
        category: "мониторы",
        badge: "sale",
        desc: "Разрешение 2K QHD, 1 мс отклик, яркая IPS матрица и регулируемая ножка.",
        img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80"
    },
    {
        id: 5,
        title: "Механическая клавиатура RGB",
        price: 35000,
        category: "аксессуары",
        badge: "none",
        desc: "Hot-Swap сокеты, линейные смазанные свитчи и шумоизоляция корпуса.",
        img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80"
    },
    {
        id: 6,
        title: "Беспроводная мышь 2.4G",
        price: 18000,
        category: "аксессуары",
        badge: "none",
        desc: "Сверхлегкий корпус 60 грамм, оптический сенсор без срывов и тефлоновые глайды.",
        img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80"
    },
    {
        id: 7,
        title: "Игровые наушники 7.1 Surround",
        price: 28000,
        category: "аксессуары",
        badge: "sale",
        desc: "Пространственное позиционирование звука, съемный микрофон и мягкие амбушюры.",
        img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80"
    },
    {
        id: 8,
        title: "Портативная консоль 512GB",
        price: 320000,
        category: "пк",
        badge: "new",
        desc: "ПК-игры в кармане: удобные стики, сенсорный дисплей и слот под microSD.",
        img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&q=80"
    }
];

let products = JSON.parse(localStorage.getItem("tech_products")) || defaultProducts;
let cart = JSON.parse(localStorage.getItem("store_cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("store_wishlist")) || [];
let currentCategory = "all";
let discountMultiplier = 1;

// DOM
const productsGrid = document.getElementById("productsGrid");
const cartCount = document.getElementById("cartCount");
const wishCount = document.getElementById("wishCount");
const cartModal = document.getElementById("cartModal");
const addModal = document.getElementById("addModal");
const wishlistModal = document.getElementById("wishlistModal");
const detailsModal = document.getElementById("detailsModal");
const detailsModalContent = document.getElementById("detailsModalContent");
const cartItems = document.getElementById("cartItems");
const wishlistItems = document.getElementById("wishlistItems");
const cartTotal = document.getElementById("cartTotal");
const discountValue = document.getElementById("discountValue");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const promoInput = document.getElementById("promoInput");
const toast = document.getElementById("toast");

function saveAll() {
    localStorage.setItem("tech_products", JSON.stringify(products));
    localStorage.setItem("store_cart", JSON.stringify(cart));
    localStorage.setItem("store_wishlist", JSON.stringify(wishlist));
}

function showToast(text) {
    toast.textContent = text;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// Отрисовка каталога
function renderProducts(items) {
    productsGrid.innerHTML = "";
    if (items.length === 0) {
        productsGrid.innerHTML = "<p style='color:#94a3b8;'>Товары не найдены</p>";
        return;
    }

    items.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        let badgeHTML = "";
        if (product.badge === "hit") badgeHTML = `<span class="badge badge-hit">🔥 ХИТ</span>`;
        if (product.badge === "new") badgeHTML = `<span class="badge badge-new">⚡ NEW</span>`;
        if (product.badge === "sale") badgeHTML = `<span class="badge badge-sale">-15% SALE</span>`;

        const isLiked = wishlist.includes(product.id);

        card.innerHTML = `
      ${badgeHTML}
      <button class="like-btn ${isLiked ? 'active' : ''}" onclick="toggleLike(${product.id})">♥</button>
      <img src="${product.img}" alt="${product.title}" class="product-img" onclick="openDetails(${product.id})">
      <div class="product-info">
        <div>
          <span class="product-category">${product.category}</span>
          <h3 class="product-title">${product.title}</h3>
        </div>
        <div>
          <div class="product-price">${product.price.toLocaleString("ru-RU")} ₸</div>
          <button class="add-btn" onclick="addToCart(${product.id})">В корзину</button>
        </div>
      </div>
    `;
        productsGrid.appendChild(card);
    });
}

function setCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll(".cat-btn").forEach(btn => {
        btn.classList.toggle("active", btn.textContent.toLowerCase() === (cat === "all" ? "все" : cat));
    });
    applyFilters();
}

function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    const sortType = sortSelect.value;

    let result = products.filter(p => {
        const matchCat = currentCategory === "all" || p.category === currentCategory;
        const matchSearch = p.title.toLowerCase().includes(query);
        return matchCat && matchSearch;
    });

    if (sortType === "asc") result.sort((a, b) => a.price - b.price);
    if (sortType === "desc") result.sort((a, b) => b.price - a.price);

    renderProducts(result);
}

// Избранное
function toggleLike(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(itemId => itemId !== id);
        showToast("Удалено из избранного");
    } else {
        wishlist.push(id);
        showToast("Добавлено в избранное ❤️");
    }
    saveAll();
    updateWishlistUI();
    applyFilters();
}

function updateWishlistUI() {
    wishCount.textContent = wishlist.length;

    if (wishlist.length === 0) {
        wishlistItems.innerHTML = "<p style='color:#94a3b8; text-align:center; padding:20px;'>В избранном пусто</p>";
        return;
    }

    const likedProducts = products.filter(p => wishlist.includes(p.id));
    wishlistItems.innerHTML = likedProducts.map(p => `
    <div class="cart-row">
      <div>
        <div style="font-size:14px; font-weight:600;">${p.title}</div>
        <div style="font-size:13px; color:#4ade80;">${p.price.toLocaleString("ru-RU")} ₸</div>
      </div>
      <button class="add-btn" style="width:auto; padding:6px 12px; font-size:12px;" onclick="addToCart(${p.id})">В корзину</button>
    </div>
  `).join("");
}

function toggleWishlist() {
    wishlistModal.style.display = wishlistModal.style.display === "flex" ? "none" : "flex";
}

// Модальное окно деталей товара
function openDetails(id) {
    const p = products.find(item => item.id === id);
    if (!p) return;

    detailsModalContent.innerHTML = `
    <div class="modal-header">
      <h2>${p.title}</h2>
      <button class="icon-btn" onclick="toggleDetails()">✕</button>
    </div>
    <img src="${p.img}" class="details-img">
    <span class="product-category">${p.category}</span>
    <p class="details-desc">${p.desc || "Качественное устройство с гарантией 1 год."}</p>
    <div class="total-row main-total" style="margin-bottom:15px;">
      <span>Цена:</span>
      <strong>${p.price.toLocaleString("ru-RU")} ₸</strong>
    </div>
    <button class="checkout-btn" onclick="addToCart(${p.id}); toggleDetails();">Купить сейчас</button>
  `;
    toggleDetails();
}

function toggleDetails() {
    detailsModal.style.display = detailsModal.style.display === "flex" ? "none" : "flex";
}

// Добавление кастомного товара
function handleCreateProduct(e) {
    e.preventDefault();
    const title = document.getElementById("newTitle").value.trim();
    const price = Number(document.getElementById("newPrice").value);
    const category = document.getElementById("newCategory").value;
    const badge = document.getElementById("newBadge").value;
    const img = document.getElementById("newImg").value.trim() || "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80";

    const newProduct = {
        id: Date.now(),
        title,
        price,
        category,
        badge,
        desc: "Новое поступление в ассортименте нашего магазина.",
        img
    };

    products.unshift(newProduct);
    saveAll();
    applyFilters();
    toggleAddModal();
    e.target.reset();
    showToast("Товар добавлен в каталог!");
}

// Корзина
function addToCart(id) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.count += 1;
    } else {
        const product = products.find(p => p.id === id);
        cart.push({ ...product, count: 1 });
    }

    saveAll();
    updateCartUI();
    showToast("Товар добавлен в корзину!");
}

function changeCount(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.count += delta;
    if (item.count <= 0) {
        cart = cart.filter(i => i.id !== id);
    }

    saveAll();
    updateCartUI();
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm("Очистить всю корзину?")) {
        cart = [];
        discountMultiplier = 1;
        saveAll();
        updateCartUI();
    }
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.count, 0);
    cartCount.textContent = totalCount;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p style='color:#94a3b8; text-align:center; padding: 20px 0;'>Корзина пуста</p>";
        cartTotal.textContent = "0";
        discountValue.textContent = "0 ₸";
        return;
    }

    cartItems.innerHTML = cart.map(item => `
    <div class="cart-row">
      <div>
        <div style="font-size:14px; font-weight:600;">${item.title}</div>
        <div style="font-size:13px; color:#94a3b8;">${item.price.toLocaleString("ru-RU")} ₸ × ${item.count}</div>
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        <button class="qty-btn" onclick="changeCount(${item.id}, -1)">-</button>
        <span style="min-width:18px; text-align:center;">${item.count}</span>
        <button class="qty-btn" onclick="changeCount(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join("");

    const rawTotal = cart.reduce((sum, item) => sum + item.price * item.count, 0);
    const discountAmount = rawTotal * (1 - discountMultiplier);
    const finalTotal = rawTotal * discountMultiplier;

    discountValue.textContent = `${Math.round(discountAmount).toLocaleString("ru-RU")} ₸`;
    cartTotal.textContent = Math.round(finalTotal).toLocaleString("ru-RU");
}

function applyPromo() {
    const code = promoInput.value.trim().toUpperCase();
    if (code === "OXIDE") {
        discountMultiplier = 0.9;
        showToast("Скидка 10% активирована!");
    } else {
        discountMultiplier = 1;
        alert("Неверный промокод");
    }
    updateCartUI();
}

function toggleCart() {
    cartModal.style.display = cartModal.style.display === "flex" ? "none" : "flex";
}

function toggleAddModal() {
    addModal.style.display = addModal.style.display === "flex" ? "none" : "flex";
}

function handleBackdropClick(e, modalId) {
    const targetModal = document.getElementById(modalId);
    if (e.target === targetModal) {
        targetModal.style.display = "none";
    }
}

function checkout() {
    if (cart.length === 0) return alert("Корзина пуста!");
    alert(`Заказ оформлен на сумму: ${cartTotal.textContent} ₸!\nТовары отправлены в доставку.`);
    cart = [];
    discountMultiplier = 1;
    promoInput.value = "";
    saveAll();
    updateCartUI();
    toggleCart();
}

// Запуск
applyFilters();
updateCartUI();
updateWishlistUI();