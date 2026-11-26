const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3010;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let nextId = 4;
const products = [
  { id: 1, name: "Smart LED Desk Lamp", price: 1599, rating: 4.6 },
  { id: 2, name: "Portable Bluetooth Speaker", price: 2499, rating: 4.5 },
  { id: 3, name: "NVMe External SSD 1TB", price: 6499, rating: 4.8 },
];

// GET /api/products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// POST /api/products
app.post("/api/products", (req, res) => {
  const { name, price, rating } = req.body;
  if (!name || price === undefined || rating === undefined) {
    return res.status(400).json({ error: "name, price, and rating are required." });
  }
  const newProduct = {
    id: nextId++,
    name: String(name).trim(),
    price: Number(price),
    rating: Number(rating),
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.listen(PORT, () => {
  console.log(`Task 10 API + CSR app running at http://localhost:${PORT}`);
});
