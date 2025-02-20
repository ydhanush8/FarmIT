import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth.js";
import Transaction from "../models/Transaction.js";

// TODO
router.get("/my-transactions", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ from: req.user.userId }, { to: req.user.userId }],
    })
      .populate("loan", "amount interestRate")
      .populate("from", "firstName lastName")
      .populate("to", "firstName lastName")
      .sort("-createdAt");

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/analytics", auth, async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);

    const transactions = await Transaction.aggregate([
      {
        $match: {
          $or: [{ from: req.user.userId }, { to: req.user.userId }],
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            type: "$type",
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
