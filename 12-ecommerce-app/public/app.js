let products = [];
let cart = [];

// Tab switching
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
  });
});

async function fetchProducts() {
  const res = await fetch("/api/products");
  products = await res.json();
  renderStorefront();
  renderSellerProducts();
}

async function fetchOrders() {
  const res = await fetch("/api/orders");
  const orders = await res.json();
  const ordersList = document.getElementById("ordersList");
  ordersList.innerHTML = orders.length
    ? orders
        .map(
          (o) => `
      <div class="card-box">
        <div class="row">
          <strong>Order #${o.id} — ${o.customerName}</strong>
          <span class="badge">${o.status}</span>
        </div>
        <p style="margin:6px 0;color:#475569;font-size:0.9rem;">
          Payment: ${o.paymentMethod} | Txn: ${o.transactionId} | Date: ${new Date(o.createdAt).toLocaleString()}
        </p>
        <ul style="margin-left:18px;margin-bottom:8px;">
          ${o.items.map((i) => `<li>${i.name} × ${i.qty} — ₹${i.price * i.qty}</li>`).join("")}
        </ul>
        <strong>Total Paid: ₹${o.total}</strong>
      </div>`
        )
        .join("")
    : "<p>No orders placed yet.</p>";
}

function renderStorefront() {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = products
    .map(
      (p) => `
    <article class="card-box stack">
      <div>
        <span class="badge">${p.category}</span>
        <h3>${p.name}</h3>
        <p style="color:#475569;font-size:0.9rem;margin-top:4px;">${p.description}</p>
      </div>
      <div>
        <div class="price">₹${p.price}</div>
        <div style="font-size:0.82rem;color:#64748b;margin-bottom:8px;">In Stock: ${p.stock}</div>
        <button class="btn-primary" style="width:100%;" onclick="addToCart(${p.id})" ${p.stock <= 0 ? "disabled" : ""}>
          ${p.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </article>`
    )
    .join("");
}

window.addToCart = (id) => {
  const product = products.find((p) => p.id === id);
  if (!product) return;
  const existing = cart.find((c) => c.id === id);
  if (existing) {
    if (existing.qty < product.stock) existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  renderCart();
};

window.updateCartQty = (id, delta) => {
  const item = cart.find((c) => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((c) => c.id !== id);
  renderCart();
};

function renderCart() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = `₹${total}`;

  const cartList = document.getElementById("cartList");
  cartList.innerHTML = cart.length
    ? cart
        .map(
          (i) => `
      <div class="row" style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
        <div>
          <strong>${i.name}</strong><br/>
          <small>₹${i.price} × ${i.qty} = ₹${i.price * i.qty}</small>
        </div>
        <div class="row">
          <button class="btn-sec" onclick="updateCartQty(${i.id}, -1)">-</button>
          <span>${i.qty}</span>
          <button class="btn-sec" onclick="updateCartQty(${i.id}, 1)">+</button>
        </div>
      </div>`
        )
        .join("")
    : "<p>Your cart is empty. Add products from the Storefront.</p>";
}

document.getElementById("checkoutForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!cart.length) {
    document.getElementById("paymentMsg").textContent = "Cart is empty!";
    return;
  }
  const payload = {
    customerName: document.getElementById("customerName").value,
    paymentMethod: document.getElementById("paymentMethod").value,
    paymentDetail: document.getElementById("paymentDetail").value,
    items: cart.map(({ id, qty }) => ({ id, qty })),
  };

  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (res.ok) {
    cart = [];
    renderCart();
    e.target.reset();
    document.getElementById("paymentMsg").innerHTML = `<strong style="color:#16a34a;">Payment successful! Order #${data.id} confirmed.</strong>`;
    await fetchProducts();
    await fetchOrders();
  } else {
    document.getElementById("paymentMsg").innerHTML = `<strong style="color:#dc2626;">${data.error}</strong>`;
  }
});

// Seller Master Panel
function renderSellerProducts() {
  const list = document.getElementById("sellerProductList");
  list.innerHTML = products
    .map(
      (p) => `
    <div class="row" style="padding:10px;border:1px solid #e2e8f0;border-radius:8px;">
      <div>
        <strong>${p.name}</strong> (₹${p.price})<br/>
        <small>${p.category} | Stock: ${p.stock}</small>
      </div>
      <button class="btn-sec" onclick="startEdit(${p.id})">Edit</button>
    </div>`
    )
    .join("");
}

window.startEdit = (id) => {
  const p = products.find((item) => item.id === id);
  if (!p) return;
  document.getElementById("editProductId").value = p.id;
  document.getElementById("pName").value = p.name;
  document.getElementById("pCategory").value = p.category;
  document.getElementById("pPrice").value = p.price;
  document.getElementById("pStock").value = p.stock;
  document.getElementById("pDesc").value = p.description;
  document.getElementById("sellerFormTitle").textContent = `Edit Product #${p.id}`;
  document.getElementById("sellerSubmitBtn").textContent = "Update Product";
  document.getElementById("cancelEditBtn").style.display = "inline-block";
};

function resetSellerForm() {
  document.getElementById("sellerForm").reset();
  document.getElementById("editProductId").value = "";
  document.getElementById("sellerFormTitle").textContent = "Add New Product";
  document.getElementById("sellerSubmitBtn").textContent = "Add Product";
  document.getElementById("cancelEditBtn").style.display = "none";
}

document.getElementById("cancelEditBtn").addEventListener("click", resetSellerForm);

document.getElementById("sellerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const editId = document.getElementById("editProductId").value;
  const payload = {
    name: document.getElementById("pName").value,
    category: document.getElementById("pCategory").value,
    price: Number(document.getElementById("pPrice").value),
    stock: Number(document.getElementById("pStock").value),
    description: document.getElementById("pDesc").value,
  };

  const url = editId ? `/api/products/${editId}` : "/api/products";
  const method = editId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    resetSellerForm();
    await fetchProducts();
  }
});

fetchProducts();
fetchOrders();
renderCart();
