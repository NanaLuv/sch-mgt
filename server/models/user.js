const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    validate: [(val) => {}, "enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "password field is required"],
    minlength: [6, "minimum password is 6 characters"],
  },
});

// userSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

const User = mongoose.model("User", userSchema);
module.exports = User;
