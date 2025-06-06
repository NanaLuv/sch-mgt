const mongoose = require("mongoose");
const schoolInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: false },
  email: { type: String, required: true },
  contact: { type: String, required: true },
});
module.exports = mongoose.model("SchoolInfo", schoolInfoSchema);
