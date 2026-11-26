const productGrid = document.getElementById("productGrid");
const productForm = document.getElementById("productForm");

async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();

  productGrid.innerHTML = "";
  products.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="id-tag">ID: #${p.id}</div>
      <h3>${p.name}</h3>
      <div class="meta">
        <span>₹${p.price}</span>
        <span>⭐ ${p.rating}</span>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    name: document.getElementById("name").value,
    price: Number(document.getElementById("price").value),
    rating: Number(document.getElementById("rating").value),
  };

  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    productForm.reset();
    loadProducts();
  }
});

loadProducts();
