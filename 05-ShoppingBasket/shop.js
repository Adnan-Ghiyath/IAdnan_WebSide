/* =========================================================
         ✅ Code Overview (JavaScript Part)
         ---------------------------------------------------------
         ✅ Goal:
            - Create / open IndexedDB database "ShopDB"
            - Store products in "products" store
            - Store basket items in "cart" store
            - Render products and cart from IndexedDB
            - Allow user to:
              1️⃣ Add to cart
              2️⃣ Increase / Decrease quantity
              3️⃣ Remove item
              4️⃣ Clear basket
              5️⃣ Checkout navigation

         ✅ Important Note:
            - IndexedDB works with transactions + requests (event-based).
            - We must use onsuccess/onerror to know when reads/writes finish.
         ========================================================= */

/* =========================================================
         ✅ 1) GLOBALS + DOM CACHING
         ========================================================= */

// ✅ Global DB reference (will hold IDBDatabase instance after open)
let db = null;

// ✅ Cache DOM elements for faster access (avoid repeated getElementById)
const productsGrid = document.getElementById("productsGrid");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartTotal = document.getElementById("cartTotal");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

const MyAdd = {
  btn_Show: document.getElementById("btn_Show"),
  closeBtn: document.getElementById("closeBtn"),
  MySaveButtion: document.getElementById("MySaveButtion"),
  modal: document.getElementById("modal"),
  Nameinput: document.getElementById("Name-input"),
  descriptioninput: document.getElementById("description-input"),
  Imginput: document.getElementById("Img-input"),
  priceinput: document.getElementById("price-input"),
};
/* =========================================================
         ✅ 2) STATUS HELPERS (UI feedback)
         ========================================================= */

// ✅ Show "OK" status (green dot)
function setStatusOk(message) {
  statusDot.classList.remove("dot-wait"); // remove yellow
  statusDot.classList.add("dot-ok"); // add green
  statusText.textContent = message; // set message text
}

// ✅ Show "Waiting/Busy" status (yellow dot)
function setStatusWait(message) {
  statusDot.classList.remove("dot-ok"); // remove green
  statusDot.classList.add("dot-wait"); // add yellow
  statusText.textContent = message; // set message text
}

/* =========================================================
         ✅ 3) OPEN (OR CREATE) IndexedDB DATABASE
         ---------------------------------------------------------
         - DB Name   : "ShopDB"
         - Version   : 1
         - Stores    : "products", "cart"
         ========================================================= */

setStatusWait("Opening database...");

// ✅ Open database (creates it if it doesn't exist)
const openRequest = indexedDB.open("ShopDB", 1);

// ✅ Runs ONLY on first creation or when version number changes
openRequest.onupgradeneeded = function (event) {
  // ✅ The database instance being created/upgraded
  const dbInstance = event.target.result;

  // ✅ Create products store (keyPath "id" means id is primary key)
  dbInstance.createObjectStore("products", { keyPath: "id" });

  // ✅ Create cart store (keyPath "id" where id = product id)
  dbInstance.createObjectStore("cart", { keyPath: "id" });

  // ✅ Seed initial products (only once on first run)
  const seedProducts = [
    {
      id: 1,
      name: "Gold Necklace 18K",
      img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
      price: 1299.99,
      description: "Elegant 18K yellow gold chain necklace.",
    },
    {
      id: 2,
      name: "Diamond Ring - 1 Carat",
      img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
      price: 3499.99,
      description: "Stunning solitaire diamond engagement ring.",
    },
    {
      id: 3,
      name: "Gold Bracelet 22K",
      img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
      price: 899.99,
      description: "Traditional 22K gold bangle bracelet.",
    },
    {
      id: 4,
      name: "Pearl Earrings",
      img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
      price: 449.99,
      description: "Classic freshwater pearl stud earrings.",
    },
    {
      id: 5,
      name: "Gold Watch - Men's",
      img: "https://images.unsplash.com/photo-1587836374058-4ec0b0c1e79d?w=400",
      price: 2199.99,
      description: "Luxury automatic gold-plated watch.",
    },
    {
      id: 6,
      name: "Gold Pendant with Chain",
      img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
      price: 679.99,
      description: "Delicate heart-shaped gold pendant.",
    },
  ];

  // ✅ Use the SAME upgrade transaction to add seed data
  const tx = event.target.transaction; // upgrade transaction

  const store = tx.objectStore("products"); // products store

  // ✅ Insert each seeded product into IndexedDB
  seedProducts.forEach((product) => {
    store.add(product);
  });
};

// ✅ Runs when DB is opened successfully
openRequest.onsuccess = function (event) {
  db = event.target.result; // save db globally
  setStatusOk("Database opened.");

  // ✅ On startup: render products and cart
  loadProducts();
  renderCart();
};

// ✅ Runs when opening fails
openRequest.onerror = function (event) {
  console.error("Error opening ShopDB:", event.target.error);
  setStatusWait("Error opening DB.");
};

/* =========================================================
         ✅ 4) LOAD & RENDER PRODUCTS
         ---------------------------------------------------------
         - Read all products from "products" store
         - Create a card in the UI for each one
         ========================================================= */

function loadProducts() {
  // ✅ clear grid before rendering again
  productsGrid.innerHTML = "";

  // ✅ readonly transaction (no writing)
  const tx = db.transaction("products", "readonly");
  const store = tx.objectStore("products");

  // ✅ getAll returns all products in store
  const request = store.getAll();

  request.onsuccess = function () {
    const products = request.result;

    // ✅ if empty store, show message
    if (!products || products.length === 0) {
      productsGrid.innerHTML =
        "<p style='color:#9ca3af;font-size:0.9rem;'>No products found.</p>";
      return;
    }

    // ✅ create card for each product
    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img
    style="width: 100%; height: 150px; object-fit: cover; border-radius: 10px;"
    src="${product.img}"
    alt="${product.name}"
  />
              <div class="product-name">${product.name}</div>
              <div class="product-desc">${product.description}</div>
              <div class="product-footer">
               <div class="product-price">$${(Number(product.price) || 0).toFixed(2)}</div>
                <button onclick="addToCart(${
                  product.id
                })">Add to Basket</button>
              </div>
            `;

      productsGrid.appendChild(card);
    });
  };

  request.onerror = function () {
    console.error("Error loading products.");
  };
}

/* =========================================================
         ✅ 5) CART OPERATIONS (Add / Increase / Decrease / Remove)
         ========================================================= */

// ✅ Add product to cart, or increase quantity if it already exists
function addToCart(productId) {
  setStatusWait("Updating basket...");

  // ✅ readwrite transaction (we will update cart)
  // We need both stores:
  // - products: to read product info
  // - cart: to add/update basket entry
  const tx = db.transaction(["products", "cart"], "readwrite");
  const productsStore = tx.objectStore("products");
  const cartStore = tx.objectStore("cart");

  // ✅ Step 1: read product from products store
  const productRequest = productsStore.get(productId);

  productRequest.onsuccess = function () {
    const product = productRequest.result;

    if (!product) {
      console.error("Product not found:", productId);
      setStatusWait("Product not found.");
      return;
    }

    // ✅ Step 2: check if the product is already in cart
    const cartItemRequest = cartStore.get(productId);

    cartItemRequest.onsuccess = function () {
      const existing = cartItemRequest.result;

      if (existing) {
        // ✅ already in cart → increment quantity
        existing.quantity += 1;
        cartStore.put(existing); // put() updates existing row
      } else {
        // ✅ not in cart → create new cart item
        cartStore.add({
          id: product.id,
          img: product.img,
          name: product.name,
          price: product.price,
          quantity: 1,
        });
      }
    };
  };

  // ✅ When whole transaction completes, we refresh the cart UI
  tx.oncomplete = function () {
    renderCart();
    setStatusOk("Basket updated.");
  };

  tx.onerror = function () {
    console.error("Error adding to cart.");
    setStatusWait("Error updating basket.");
  };
}

// ✅ Increase quantity for a cart item
function increaseQty(productId) {
  const tx = db.transaction("cart", "readwrite");
  const cartStore = tx.objectStore("cart");

  const req = cartStore.get(productId);

  req.onsuccess = function () {
    const item = req.result;
    if (!item) return;

    item.quantity += 1;
    cartStore.put(item); // update
  };

  tx.oncomplete = function () {
    renderCart(); // refresh UI
  };
}

// ✅ Decrease quantity for a cart item (delete if quantity reaches 0)
function decreaseQty(productId) {
  const tx = db.transaction("cart", "readwrite");
  const cartStore = tx.objectStore("cart");

  const req = cartStore.get(productId);

  req.onsuccess = function () {
    const item = req.result;
    if (!item) return;

    // ✅ if quantity would become 0 → remove row
    if (item.quantity <= 1) {
      cartStore.delete(productId);
    } else {
      item.quantity -= 1;
      cartStore.put(item);
    }
  };

  tx.oncomplete = function () {
    renderCart();
  };
}

// ✅ Remove item completely
function removeFromCart(productId) {
  const tx = db.transaction("cart", "readwrite");
  const cartStore = tx.objectStore("cart");

  cartStore.delete(productId);

  tx.oncomplete = function () {
    renderCart();
  };
}

// ✅ Clear entire cart store
function clearCart() {
  if (!confirm("Clear entire basket?")) return;

  const tx = db.transaction("cart", "readwrite");
  const cartStore = tx.objectStore("cart");

  cartStore.clear();

  tx.oncomplete = function () {
    renderCart();
    setStatusOk("Basket cleared.");
  };
}

/* =========================================================
         ✅ 6) RENDER CART (Read from IndexedDB + Build UI)
         ---------------------------------------------------------
         - Reads all items from "cart" store
         - Builds HTML rows
         - Calculates total = Σ(price × quantity)
         ========================================================= */

function renderCart() {
  cartItems.innerHTML = ""; // clear current items UI

  const tx = db.transaction("cart", "readonly");
  const cartStore = tx.objectStore("cart");
  const req = cartStore.getAll();

  req.onsuccess = function () {
    const items = req.result;

    // ✅ empty cart
    if (!items || items.length === 0) {
      cartEmpty.style.display = "block";
      cartEmpty.textContent = "Your basket is empty.";
      cartTotal.textContent = "$0.00";
      return;
    }

    // ✅ cart has items
    cartEmpty.style.display = "none";

    let total = 0;

    items.forEach((item) => {
      // ✅ calculate item total and add to cart total
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      // ✅ build row element
      const row = document.createElement("div");
      row.className = "cart-item";

      row.innerHTML = `
              <div class="cart-item-main">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">
                  $${item.price.toFixed(2)} × ${
                    item.quantity
                  } = $${itemTotal.toFixed(2)}
                </div>
                <span class="remove-link" onclick="removeFromCart(${item.id})">
                  Remove
                </span>
              </div>

              <div class="cart-item-controls">
                <button class="small-btn" onclick="decreaseQty(${
                  item.id
                })">−</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="small-btn" onclick="increaseQty(${
                  item.id
                })">+</button>
              </div>
            `;

      cartItems.appendChild(row);
    });

    // ✅ update total
    cartTotal.textContent = "$" + total.toFixed(2);
  };

  req.onerror = function () {
    console.error("Error reading cart.");
  };
}

/* =========================================================
         ✅ 7) CHECKOUT NAVIGATION
         ========================================================= */

function goToCheckout() {
  // ✅ navigate to checkout page (must exist in same folder)
  window.location.href = "checkout.html";
}
//fghghdugudshgokfdhgokhkoi
MyAdd.btn_Show.addEventListener("click", () => {
  MyAdd.modal.style.display = "flex";
});

function closeModel() {
  MyAdd.modal.style.display = "none";
  rest();
}
MyAdd.closeBtn.addEventListener("click", closeModel);

// إغلاق عند الضغط خارج الصندوق
MyAdd.modal.addEventListener("click", (e) => {
  if (e.target === MyAdd.modal) {
    MyAdd.modal.style.display = "none";
  }
});
function rest() {
  MyAdd.Nameinput.value = "";
  MyAdd.descriptioninput.value = "";
  MyAdd.Imginput.value = "";
  MyAdd.priceinput.value = "";
}
function AddCostumerItem() {
  if (!db) {
    console.error("Database not ready");
    return;
  }

  const name = MyAdd.Nameinput.value.trim();
  const description = MyAdd.descriptioninput.value.trim();
  const ImgURL = MyAdd.Imginput.value.trim();
  const price = parseFloat(MyAdd.priceinput.value);
  if (!name || !description || !price || price <= 0) {
    alert("Please fill all fields with valid data");
    return;
  }
  setStatusWait("Adding product...");

  const tx = db.transaction("products", "readwrite");
  const store = tx.objectStore("products");
  const count = document.querySelectorAll(".product-card").length;
  const nextId = count + 1;
  const newProduct = {
    id: nextId,
    name: name,
    img: ImgURL || "https://via.placeholder.com/200x150?text=No+Image",
    price: price,
    description: description,
  };

  const req = store.add(newProduct);

  req.onsuccess = function () {
    console.log(`Product ${nextId} added`);
    closeModel();
  };

  req.onerror = function (e) {
    console.error("Failed to add product:", e.target.error);
    closeModel();
  };

  tx.oncomplete = function () {
    loadProducts(); // إعادة عرض المنتجات
    setStatusOk(`Product ${nextId} added successfully.`);
    closeModel();
  };
}
MyAdd.MySaveButtion.addEventListener("click", AddCostumerItem);
