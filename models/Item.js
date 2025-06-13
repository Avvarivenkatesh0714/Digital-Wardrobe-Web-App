const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  name: String,
  category: String,
  userId: String,
  status: String // wardrobe or wash
});
module.exports = mongoose.model("Item", itemSchema);