const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3008;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const feedbacks = [
  { name: "Rohan Verma", rating: "5", comment: "Clean Express routing and EJS template integration!" },
  { name: "Neha Sharma", rating: "4", comment: "Easy to follow GET and POST form handling." },
];

// Route 1: GET /
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// Route 2: GET /about
app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// Route 3: GET /services
app.get("/services", (req, res) => {
  const services = [
    "Backend REST API Architecture",
    "Dynamic EJS Server-Side Views",
    "NoSQL Database Modeling (MongoDB)",
    "Modern React Frontend Interfaces",
  ];
  res.render("services", { title: "Services", services });
});

// Route 4: GET /contact
app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact", submitted: null });
});

// Route 5: POST /contact
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  res.render("contact", {
    title: "Contact",
    submitted: { name, email, message },
  });
});

// Route 6: GET /feedback
app.get("/feedback", (req, res) => {
  res.render("feedback", { title: "Feedback", feedbacks });
});

// Route 7: POST /feedback
app.post("/feedback", (req, res) => {
  const { name, rating, comment } = req.body;
  if (name && comment) {
    feedbacks.unshift({ name, rating: rating || "5", comment });
  }
  res.redirect("/feedback");
});

app.listen(PORT, () => {
  console.log(`Task 08 Express EJS app running at http://localhost:${PORT}`);
});
