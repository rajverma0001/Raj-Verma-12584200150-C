const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3012;
const STORE_PATH = path.join(__dirname, "data", "store.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readStore() {
  return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
}

function writeStore(data) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}

// Get all products
app.get("/api/products", (req, res) => {
  const store = readStore();
  res.json(store.products);
});

// Seller Master Panel: Add product
app.post("/api/products", (req, res) => {
  const { name, category, price, stock, description } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: "Product name and price are required." });
  }
  const store = readStore();
  const product = {
    id: store.nextProductId++,
    name: String(name).trim(),
    category: String(category || "General").trim(),
    price: Number(price),
    stock: Number(stock || 10),
    description: String(description || "").trim(),
  };
  store.products.push(product);
  writeStore(store);
  res.status(201).json(product);
});

// Seller Master Panel: Edit product
app.put("/api/products/:id", (req, res) => {
  const store = readStore();
  const product = store.products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found." });

  const { name, category, price, stock, description } = req.body;
  if (name !== undefined) product.name = String(name).trim();
  if (category !== undefined) product.category = String(category).trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (description !== undefined) product.description = String(description).trim();

  writeStore(store);
  res.json(product);
});

// Get successful orders
app.get("/api/orders", (req, res) => {
  const store = readStore();
  res.json(store.orders);
});

// Checkout & Payment
app.post("/api/orders", (req, res) => {
  const { customerName, paymentMethod, paymentDetail, items } = req.body;
  if (!customerName || !paymentMethod || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: "Customer name, payment method, and cart items are required." });
  }

  const store = readStore();
  let total = 0;
  const orderItems = [];

  for (const item of items) {
    const product = store.products.find((p) => p.id === Number(item.id));
    if (!product) return res.status(400).json({ error: `Invalid product ID ${item.id}` });
    const qty = Math.max(1, Number(item.qty || 1));
    if (product.stock < qty) {
      return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
    }
    product.stock -= qty;
    total += product.price * qty;
    orderItems.push({ id: product.id, name: product.name, price: product.price, qty });
  }

  const order = {
    id: store.nextOrderId++,
    customerName: String(customerName).trim(),
    paymentMethod,
    paymentDetail: paymentDetail ? String(paymentDetail).trim() : "",
    transactionId: `TXN-${Date.now()}`,
    items: orderItems,
    total,
    status: "Paid & Confirmed",
    createdAt: new Date().toISOString(),
  };

  store.orders.unshift(order);
  writeStore(store);
  res.status(201).json(order);
});

app.listen(PORT, () => {
  console.log(`Task 12 E-Commerce app running at http://localhost:${PORT}`);
});
