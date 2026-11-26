const express = require("express");
const methodOverride = require("method-override");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3009;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

let nextId = 4;
let products = [
  { id: 1, name: "Wireless Earbuds Pro", price: 2199, description: "Bluetooth 5.3 earbuds with active noise isolation." },
  { id: 2, name: "27-inch IPS Monitor", price: 14999, description: "Full HD frameless display with 75Hz refresh rate." },
  { id: 3, name: "Laptop Backpack", price: 1299, description: "Water-resistant 15.6-inch padded commuter backpack." },
];

app.get("/", (req, res) => res.redirect("/products"));

// INDEX - GET /products
app.get("/products", (req, res) => {
  res.render("index", { products });
});

// NEW - GET /products/new
app.get("/products/new", (req, res) => {
  res.render("new");
});

// CREATE - POST /products
app.post("/products", (req, res) => {
  const { name, price, description } = req.body;
  products.push({
    id: nextId++,
    name: name.trim(),
    price: Number(price),
    description: description.trim(),
  });
  res.redirect("/products");
});

// SHOW - GET /products/:id
app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).send("Product not found");
  res.render("show", { product });
});

// EDIT - GET /products/:id/edit
app.get("/products/:id/edit", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).send("Product not found");
  res.render("edit", { product });
});

// UPDATE - PUT /products/:id
app.put("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).send("Product not found");
  product.name = req.body.name.trim();
  product.price = Number(req.body.price);
  product.description = req.body.description.trim();
  res.redirect(`/products/${product.id}`);
});

// DELETE - DELETE /products/:id
app.delete("/products/:id", (req, res) => {
  products = products.filter((p) => p.id !== Number(req.params.id));
  res.redirect("/products");
});

app.listen(PORT, () => {
  console.log(`Task 09 RESTful CRUD app running at http://localhost:${PORT}`);
});
