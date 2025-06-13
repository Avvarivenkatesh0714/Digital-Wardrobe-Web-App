const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const app = express();

mongoose.connect("mongodb://localhost:27017/wardrobeDB", { useNewUrlParser: true, useUnifiedTopology: true });

const User = require("./models/User");
const Item = require("./models/Item");
const Category = require("./models/Category");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Multer storage setup for images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    // Use Date.now + originalname to avoid conflicts
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.redirect("/dashboard?user=" + user._id);
  } else {
    res.send("Invalid credentials");
  }
});

app.get("/dashboard", async (req, res) => {
  const userId = req.query.user;
  const user = await User.findById(userId);
  const categories = await Category.find({ userId });
  const items = await Item.find({ userId });
  res.render("dashboard", { user, categories, items });
});

app.post("/add-category", async (req, res) => {
  const { name, userId } = req.body;
  const category = new Category({ name, userId });
  await category.save();
  res.redirect("/dashboard?user=" + userId);
});



app.post("/wear-item", async (req, res) => {
  const { itemId, userId } = req.body;
  await Item.findByIdAndUpdate(itemId, { status: "wash" });
  res.redirect("/dashboard?user=" + userId);
});

app.post("/wash-item", async (req, res) => {
  const { itemId, userId } = req.body;
  await Item.findByIdAndUpdate(itemId, { status: "wardrobe" });
  res.redirect("/dashboard?user=" + userId);
});

// Modify add-item route to accept image upload
app.post("/add-item", upload.single('image'), async (req, res) => {
  const { name, category, userId } = req.body;
  let imagePath = null;
  if (req.file) {
    imagePath = '/uploads/' + req.file.filename;  // relative path for front-end
  }
  const item = new Item({ name, category, userId, status: "wardrobe", image: imagePath });
  await item.save();
  res.redirect("/dashboard?user=" + userId);
});

app.listen(3000, () => console.log("Server running on port 3000"));
