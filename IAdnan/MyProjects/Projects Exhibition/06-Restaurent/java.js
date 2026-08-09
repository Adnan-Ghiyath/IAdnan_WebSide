/* =========================================================
         ✅ Code Overview (Beginner Friendly)
         ---------------------------------------------------------
         ✅ Purpose:
            - Manage restaurant tables (Open/Close + Select)
            - Add menu items to the selected table’s order
            - Print a bill in a popup window, then close the table

         ✅ Layout:
            1️⃣ Left panel  → Tables list + open/close + select
            2️⃣ Right top   → Menu cards (Add item)
            3️⃣ Right bottom→ Current order table (qty + remove + total)

         ✅ Main Flow:
            1️⃣ User opens a table and selects it
            2️⃣ User adds menu items → order is stored in memory
            3️⃣ User prints check → popup opens → print dialog shows
            4️⃣ After that, table closes and its order clears (demo behavior)
         ========================================================= */

/* =========================================================
         ✅ 1) Data Models (In-Memory for this Demo)
         ---------------------------------------------------------
         ⚠️ This demo does NOT use a database.
         Data is stored in JavaScript variables (lost on refresh).
         ========================================================= */

// ✅ Restaurant tables list
// Each table: { id, name, isOpen }
let tables = [
  { id: 1, name: "Table 1", isOpen: false },
  { id: 2, name: "Table 2", isOpen: false },
  { id: 3, name: "Table 3", isOpen: false },
  { id: 4, name: "Table 4", isOpen: false },
];

// ✅ Static restaurant menu
// Each item: { id, name, price, description }
const menu = [
  {
    id: 101,
    name: "Margherita Pizza",
    price: 8.5,
    description: "Tomato, mozzarella, basil.",
    img: "https://media.istockphoto.com/id/686957124/photo/pizza-margherita.jpg?s=612x612&w=0&k=20&c=STQALvMIjcgXPIvpXXUXItAl05QtbmEUQ_PfwSato48=", // مثال صورة بيتزا مارجريتا 🍕 :contentReference[oaicite:0]{index=0}
  },
  {
    id: 102,
    name: "Grilled Chicken",
    price: 11.0,
    description: "Served with vegetables and rice.",
    img: "https://www.shutterstock.com/shutterstock/videos/3785582447/thumb/6.jpg?ip=x480", // مثال صورة دجاج مشوي 🍗 من Unsplash
  },
  {
    id: 103,
    name: "Caesar Salad",
    price: 6.5,
    description: "Fresh lettuce, croutons, parmesan.",
    img: "https://playswellwithbutter.com/wp-content/uploads/2024/06/Charred-Sweet-Corn-Caesar-Salad-12.jpg", // مثال Caesar Salad 🥗 من Unsplash
  },
  {
    id: 104,
    name: "Spaghetti Bolognese",
    price: 9.0,
    description: "Rich meat sauce, parmesan.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrXNdRpZFSMNy18t0g1otpOYXB8EgyOupwcw&s", // مثال سباغيتي بولونيز 🍝 من Unsplash
  },
  {
    id: 105,
    name: "Lemonade",
    price: 2.5,
    description: "Freshly squeezed.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyTeU6pr-M1OJa9eCCmFEbXIA1ZcKptaYxNw&s", // مثال عصير ليمونادة 🍋 من Unsplash
  },
  {
    id: 106,
    name: "Cheesecake",
    price: 4.5,
    description: "Classic baked cheesecake.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpS6yaJcvttjlTPYohqV_7Kgc-WjBUwY8iYw&s", // مثال تشيز كيك 🍰 من Unsplash
  },
  {
    id: 107,
    name: "Shawarma",
    price: 9.5,
    description: "Classic Shawarma.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5ihTwpfz29nMnVXUFFAwa3ypE5GkpJXIyWA&s", // مثال تشيز كيك 🍰 من Unsplash
  },
  {
    id: 108,
    name: "Rice and chicken",
    price: 15.5,
    description: "Classic Rice and chicken.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDJx_N-fY_RWTJuYRabwfXEo-EhBWQtV1VLg&s", // مثال تشيز كيك 🍰 من Unsplash
  },
  {
    id: 109,
    name: "grill meat",
    price: 13.5,
    description: "Classic  grill meat.",
    img: "https://www.seriouseats.com/thmb/DohQC_iADRKgJPdXvcxSjsPA930=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2016__06__20110516-cowboy-steak-kenji-lopez-alt-bb4a825bd05b4e91b7672bc1603043a8.jpg",
  },
];

// ✅ Orders storage (per table)
// key   → tableId (number)
// value → array of order lines
// order line: { menuId, name, price, quantity }
const ordersByTable = {};

// ✅ Which table is selected right now
let selectedTableId = null;

/* =========================================================
         ✅ 2) DOM References (Cache elements once)
         ========================================================= */
const tablesList = document.getElementById("tablesList");
const selectedTableLabel = document.getElementById("selectedTableLabel");
const menuGrid = document.getElementById("menuGrid");
const orderBody = document.getElementById("orderBody");
const orderEmpty = document.getElementById("orderEmpty");
const orderTotal = document.getElementById("orderTotal");

/* =========================================================
         ✅ 3) Initial Render (Run once at startup)
         ========================================================= */
renderTables();
renderMenu();
renderCurrentOrder();

/* =========================================================
         ✅ 4) Tables: Render + Actions
         ========================================================= */

// ✅ Render all tables in the left panel
function renderTables() {
  tablesList.innerHTML = "";

  tables.forEach(function (table) {
    // ✅ Row wrapper
    const row = document.createElement("div");
    row.className = "table-item";

    // ✅ Table info: name + status
    const info = document.createElement("div");
    info.className = "table-info";

    const name = document.createElement("div");
    name.className = "table-name";
    name.textContent = table.name;

    const status = document.createElement("div");
    status.className = "table-status";

    const dot = document.createElement("div");
    dot.className = "status-dot " + (table.isOpen ? "dot-open" : "dot-closed");

    const statusText = document.createElement("span");
    statusText.textContent = table.isOpen ? "Open" : "Closed";

    status.appendChild(dot);
    status.appendChild(statusText);

    info.appendChild(name);
    info.appendChild(status);

    // ✅ Actions: select + open/close
    const actions = document.createElement("div");
    actions.className = "table-actions";

    const selectBtn = document.createElement("button");
    selectBtn.className = "btn-small";
    selectBtn.textContent = "Select";
    selectBtn.onclick = function () {
      selectTable(table.id);
    };

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "btn-secondary btn-small";
    toggleBtn.textContent = table.isOpen ? "Close" : "Open";
    toggleBtn.onclick = function () {
      toggleTableOpen(table.id);
    };

    actions.appendChild(selectBtn);
    actions.appendChild(toggleBtn);

    row.appendChild(info);
    row.appendChild(actions);

    tablesList.appendChild(row);
  });
}

// ✅ Select a table so we can add items to its order
function selectTable(tableId) {
  selectedTableId = tableId;

  const table = tables.find(function (t) {
    return t.id === tableId;
  });

  if (table) {
    selectedTableLabel.textContent =
      "Selected table: " +
      table.name +
      (table.isOpen ? " (Open)" : " (Closed)");
  } else {
    selectedTableLabel.textContent = "Selected table: none";
  }

  renderCurrentOrder();
}

// ✅ Toggle a table between Open and Closed
function toggleTableOpen(tableId) {
  const table = tables.find(function (t) {
    return t.id === tableId;
  });

  if (!table) return;

  // ✅ Flip the boolean
  table.isOpen = !table.isOpen;

  renderTables();
  renderCurrentOrder();
}

// ✅ Add a new table (demo: auto-increment id)
function addNewTable() {
  const nextId = tables.length > 0 ? tables[tables.length - 1].id + 1 : 1;

  tables.push({
    id: nextId,
    name: "Table " + nextId,
    isOpen: false,
  });

  renderTables();
}

// ✅ Reset everything (tables + orders) back to initial demo state
function resetAll() {
  if (!confirm("Reset all tables and orders (demo only)?")) return;

  tables = [
    { id: 1, name: "Table 1", isOpen: false },
    { id: 2, name: "Table 2", isOpen: false },
    { id: 3, name: "Table 3", isOpen: false },
    { id: 4, name: "Table 4", isOpen: false },
  ];

  // ✅ Clear orders object
  for (const key in ordersByTable) {
    delete ordersByTable[key];
  }

  selectedTableId = null;

  renderTables();
  selectedTableLabel.textContent = "Selected table: none";
  renderCurrentOrder();
}

/* =========================================================
         ✅ 5) Menu: Render + Add Items to Order
         ========================================================= */

// ✅ Render menu cards (top-right)
function renderMenu() {
  menuGrid.innerHTML = "";

  menu.forEach(function (item) {
    const card = document.createElement("div");
    card.className = "menu-item";

    const img = document.createElement("img");
    img.className = "menu-img";
    img.src = item.img;

    const name = document.createElement("div");
    name.className = "menu-name";
    name.textContent = item.name;

    const desc = document.createElement("div");
    desc.className = "menu-desc";
    desc.textContent = item.description;

    const footer = document.createElement("div");
    footer.className = "menu-footer";

    const price = document.createElement("div");
    price.className = "menu-price";
    price.textContent = "$" + item.price.toFixed(2);

    const addBtn = document.createElement("button");
    addBtn.className = "btn-small";
    addBtn.textContent = "Add";
    addBtn.onclick = function () {
      addMenuItemToOrder(item.id);
    };

    footer.appendChild(price);
    footer.appendChild(addBtn);

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(desc);
    card.appendChild(footer);

    menuGrid.appendChild(card);
  });
}

// ✅ Add a menu item to the currently selected table order
function addMenuItemToOrder(menuId) {
  // ✅ Must select a table first
  if (selectedTableId === null) {
    alert("Please select a table first.");
    return;
  }

  // ✅ Selected table must be OPEN
  const table = tables.find(function (t) {
    return t.id === selectedTableId;
  });

  if (!table || !table.isOpen) {
    alert("Selected table must be OPEN to add items.");
    return;
  }

  // ✅ Find menu item details
  const menuItem = menu.find(function (m) {
    return m.id === menuId;
  });

  if (!menuItem) return;

  // ✅ Create order array if it doesn't exist yet
  if (!ordersByTable[selectedTableId]) {
    ordersByTable[selectedTableId] = [];
  }

  const orderItems = ordersByTable[selectedTableId];

  // ✅ Check if item already exists in the order
  const existingItem = orderItems.find(function (it) {
    return it.menuId === menuId;
  });

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    orderItems.push({
      menuId: menuItem.id,
      img: menuItem.img,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
    });
  }

  renderCurrentOrder();
}

/* =========================================================
         ✅ 6) Order: Render + Update Quantity + Remove + Clear
         ========================================================= */

// ✅ Render the selected table order (bottom-right)
function renderCurrentOrder() {
  orderBody.innerHTML = "";

  // ✅ No table selected
  if (selectedTableId === null) {
    orderEmpty.textContent = "No table selected.";
    orderEmpty.style.display = "block";
    orderTotal.textContent = "$0.00";
    return;
  }

  const orderItems = ordersByTable[selectedTableId] || [];

  // ✅ Selected table has no items yet
  if (orderItems.length === 0) {
    orderEmpty.textContent = "No items for this table yet.";
    orderEmpty.style.display = "block";
    orderTotal.textContent = "$0.00";
    return;
  }

  orderEmpty.style.display = "none";

  let total = 0;

  orderItems.forEach(function (item) {
    const tr = document.createElement("tr");

    // ✅ Item name
    const tdName = document.createElement("td");
    tdName.textContent = item.name;

    // ✅ Unit price
    const tdPrice = document.createElement("td");
    tdPrice.textContent = "$" + item.price.toFixed(2);

    // ✅ Quantity controls (+/-)
    const tdQty = document.createElement("td");
    const qtyControls = document.createElement("div");
    qtyControls.className = "qty-controls";

    const btnMinus = document.createElement("button");
    btnMinus.className = "btn-small";
    btnMinus.textContent = "-";
    btnMinus.onclick = function () {
      changeQuantity(item.menuId, -1);
    };

    const spanQty = document.createElement("span");
    spanQty.className = "qty-value";
    spanQty.textContent = item.quantity;

    const btnPlus = document.createElement("button");
    btnPlus.className = "btn-small";
    btnPlus.textContent = "+";
    btnPlus.onclick = function () {
      changeQuantity(item.menuId, 1);
    };

    qtyControls.appendChild(btnMinus);
    qtyControls.appendChild(spanQty);
    qtyControls.appendChild(btnPlus);
    tdQty.appendChild(qtyControls);

    // ✅ Subtotal
    const tdSub = document.createElement("td");
    const subtotal = item.price * item.quantity;
    tdSub.textContent = "$" + subtotal.toFixed(2);
    total += subtotal;

    // ✅ Remove line button
    const tdRemove = document.createElement("td");
    const removeBtn = document.createElement("button");
    removeBtn.className = "btn-danger btn-small";
    removeBtn.textContent = "×";
    removeBtn.onclick = function () {
      removeOrderItem(item.menuId);
    };
    tdRemove.appendChild(removeBtn);

    tr.appendChild(tdName);
    tr.appendChild(tdPrice);
    tr.appendChild(tdQty);
    tr.appendChild(tdSub);
    tr.appendChild(tdRemove);

    orderBody.appendChild(tr);
  });

  orderTotal.textContent = "$" + total.toFixed(2);
}

// ✅ Change quantity for one menu line (+1 or -1)
function changeQuantity(menuId, delta) {
  if (selectedTableId === null) return;

  const orderItems = ordersByTable[selectedTableId];
  if (!orderItems) return;

  const item = orderItems.find(function (it) {
    return it.menuId === menuId;
  });

  if (!item) return;

  item.quantity += delta;

  // ✅ If quantity goes to 0 → remove line
  if (item.quantity <= 0) {
    const index = orderItems.indexOf(item);
    if (index !== -1) orderItems.splice(index, 1);
  }

  renderCurrentOrder();
}

// ✅ Remove an order line completely
function removeOrderItem(menuId) {
  if (selectedTableId === null) return;

  const orderItems = ordersByTable[selectedTableId];
  if (!orderItems) return;

  const index = orderItems.findIndex(function (it) {
    return it.menuId === menuId;
  });

  if (index !== -1) orderItems.splice(index, 1);

  renderCurrentOrder();
}

// ✅ Clear the entire current table order
function clearOrder() {
  if (selectedTableId === null) {
    alert("Select a table first.");
    return;
  }

  const current = ordersByTable[selectedTableId] || [];
  if (current.length === 0) {
    alert("No items to clear for this table.");
    return;
  }

  if (!confirm("Clear all items for this table?")) return;

  ordersByTable[selectedTableId] = [];
  renderCurrentOrder();
}

/* =========================================================
         ✅ 7) Print Check in a Popup + Close Table
         ========================================================= */

function printCheckAndClose() {
  // ✅ Must select a table first
  if (selectedTableId === null) {
    alert("Please select a table first.");
    return;
  }

  // ✅ Find table object
  const table = tables.find(function (t) {
    return t.id === selectedTableId;
  });

  if (!table) {
    alert("Table not found.");
    return;
  }

  // ✅ Must have items to print
  const orderItems = ordersByTable[selectedTableId] || [];
  if (orderItems.length === 0) {
    alert("No items for this table to print.");
    return;
  }

  // ✅ Calculate total
  let total = 0;
  orderItems.forEach(function (item) {
    total += item.price * item.quantity;
  });

  // ✅ Open a popup window (new tab/window)
  const popup = window.open("", "PrintCheck", "width=600,height=700");

  // ✅ Build printable HTML string
  const now = new Date();

  let checkHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Bill - ${table.name}</title>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 20px; color: #111827; }
    h1, h2 { margin: 0; }
    .header { text-align: center; margin-bottom: 16px; }
    .meta { font-size: 0.9rem; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 0.9rem; }
    th, td { border-bottom: 1px solid #d1d5db; padding: 6px 4px; text-align: left; }
    th { background: #f3f4f6; }
    .total-row td { font-weight: 700; }
    .footer { margin-top: 20px; text-align: center; font-size: 0.9rem; }
    .small { font-size: 0.8rem; color: #6b7280; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Restaurant Bill</h1>
    <h2>${table.name}</h2>
  </div>
  <div class="meta">
    Date: ${now.toLocaleDateString()}<br/>
    Time: ${now.toLocaleTimeString()}
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:45%">Item</th>
        <th style="width:15%">Price</th>
        <th style="width:15%">Qty</th>
        <th style="width:25%">Subtotal</th>
      </tr>
    </thead>
    <tbody>
`;

  // ✅ Add rows for each item
  orderItems.forEach(function (item) {
    const sub = item.price * item.quantity;
    checkHtml += `
<tr>
  <td>${item.name}</td>
  <td>$${item.price.toFixed(2)}</td>
  <td>${item.quantity}</td>
  <td>$${sub.toFixed(2)}</td>
</tr>
`;
  });

  // ✅ Finish HTML (auto-print on load)
  checkHtml += `
<tr class="total-row">
  <td colspan="3">Total</td>
  <td>$${total.toFixed(2)}</td>
</tr>
</tbody>
</table>
<div class="footer">
  <div>Thank you for your visit! 😊</div>
  <div class="small">You can print this page or save it as PDF from your browser.</div>
</div>
<script>
  window.onload = function () {
    window.print();
  };
<\/script>
</body>
</html>
`;

  // ✅ Write printable content into the popup
  popup.document.open();
  popup.document.write(checkHtml);
  popup.document.close();

  // ✅ Demo behavior: close the table immediately & clear its order
  // (We can't reliably detect print completion in all browsers.)
  table.isOpen = false;
  ordersByTable[selectedTableId] = [];

  renderTables();
  renderCurrentOrder();
}
