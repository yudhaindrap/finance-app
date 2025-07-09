const Category = require("../models/Category");

const getCategories = async (req, res) => {
  const categories = await Category.find({ user: req.userId });
  res.json(categories);
};

const createCategory = async (req, res) => {
  const { name, type } = req.body;

  try {
    const category = new Category({
      name,
      type,
      user: req.userId, // ✅ harus ini! sesuai dengan middleware
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCategory = async (req, res) => {
  const result = await Category.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!result) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
};

const seedCategories = async (req, res) => {
  const defaultCategories = [
    { name: "Gaji", type: "income" },
    { name: "Bonus", type: "income" },
    { name: "Investasi", type: "income" },
    { name: "Makan", type: "expense" },
    { name: "Transportasi", type: "expense" },
    { name: "Belanja", type: "expense" },
    { name: "Hiburan", type: "expense" },
  ];

  try {
    const categoriesWithUser = defaultCategories.map(cat => ({
      ...cat,
      user: req.userId,
    }));

    await Category.insertMany(categoriesWithUser);

    res.status(201).json({ message: "Default categories seeded!" });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ message: "Failed to seed categories" });
  }
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
  seedCategories, // ⬅️ tambahkan ini
};
