const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarUrl: { type: String, default: "" }, // ✅ tambahkan field untuk foto profil
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
