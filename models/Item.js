const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  category: String,
  userId: String,
  status: String,       // "wardrobe" or "wash"
  image: String         // New field to store image path
});

module.exports = mongoose.model("Item", itemSchema);
