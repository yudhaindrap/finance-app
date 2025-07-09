const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/Category.js");

dotenv.config();

const userId = "662c6bfb63f58ddde0123456"; // GANTI dengan user ID milikmu

const categories = [
  { name: "Gaji", type: "income", user: userId },
  { name: "Bonus", type: "income", user: userId },
  { name: "Investasi", type: "income", user: userId },
  { name: "Makan", type: "expense", user: userId },
  { name: "Transportasi", type: "expense", user: userId },
  { name: "Belanja", type: "expense", user: userId },
  { name: "Hiburan", type: "expense", user: userId },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Category.deleteMany({ user: userId });
    console.log("Kategori lama dihapus");

    await Category.insertMany(categories);
    console.log("Kategori baru berhasil ditambahkan!");

    mongoose.disconnect();
  } catch (err) {
    console.error("Gagal seeding:", err);
    mongoose.disconnect();
  }
}

seed();
