const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  name: String,
  userId: String
});
module.exports = mongoose.model("Category", categorySchema);
