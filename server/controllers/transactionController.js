const Transaction = require("../models/Transaction");

const getTransactions = async (req, res) => {
  try {
    const { start, end, category } = req.query;

    const filter = { user: req.userId };

    if (start && end) {
      filter.date = { $gte: new Date(start), $lte: new Date(end) };
    }

    if (category) {
      filter.category = category;
    }

    const transactions = await Transaction.find(filter).populate({
      path: "category",
      select: "name type", // ✅ penting agar 'type' ikut dibawa
    });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { category, amount, note, date, type } = req.body;

    const transaction = await Transaction.create({
      user: req.userId,
      category,
      amount,
      note,
      date,
      type,
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const result = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!result) return res.status(404).json({ message: "Transaction not found" });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { category, amount, note, date } = req.body;

    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { category, amount, note, date },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Transaction not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId }).populate({
      path: "category",
      select: "name type", // ✅ pastikan type ikut dibawa
    });

    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      if (tx.category?.type === "income") {
        income += tx.amount;
      } else if (tx.category?.type === "expense") {
        expense += tx.amount;
      }
    });

    res.json({
      income,
      expense,
      balance: income - expense,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMonthlyStats = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const stats = await Transaction.aggregate([
      {
        $match: {
          user: req.userId,
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            type: "$categoryDetails.type",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          income: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "income"] }, "$total", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          income: 1,
          expense: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    const fullStats = Array.from({ length: 12 }, (_, i) => {
      const monthData = stats.find((d) => d.month === i + 1);
      return {
        month: i + 1,
        income: monthData?.income || 0,
        expense: monthData?.expense || 0,
      };
    });

    res.json(fullStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  getSummary,
  getMonthlyStats,
};
