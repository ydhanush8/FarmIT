import express from "express";
const router = express.Router();
import { auth, checkRole } from "../middleware/auth.js";
import Loan from "../models/Loan.js";
import Farm from "../models/Farm.js";
import Transaction from "../models/Transaction.js";

router.get("/my-loans", auth, async (req, res) => {
  try {
    const loans = await Loan.find({ "farm.farmer": req.user.userId })
      .populate("farm")
      .populate("investors.investor");
    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get(
  "/my-investments",
  [auth, checkRole(["investor"])],
  async (req, res) => {
    try {
      const loans = await Loan.find({ "investors.investor": req.user.userId })
        .populate("farm")
        .populate("investors.investor");
      res.json(loans);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/available", [auth, checkRole(["investor"])], async (req, res) => {
  try {
    const loans = await Loan.find({ status: "pending" })
      .populate("farm")
      .populate("investors.investor");
    res.json({ loans, investorId: req.user.userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", [auth, checkRole(["farmer"])], async (req, res) => {
  try {
    const { farmId, amount, interestRate, duration } = req.body;

    const farm = await Farm.findOne({ _id: farmId, farmer: req.user.userId });
    if (!farm) {
      return res.status(404).json({ message: "Farm not found" });
    }

    const loan = new Loan({
      farm: farmId,
      amount,
      interestRate,
      duration,
      repaymentSchedule: generateRepaymentSchedule(
        amount,
        interestRate,
        duration
      ),
    });

    await loan.save();
    await Farm.findByIdAndUpdate(farmId, { loan: loan._id });
    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/:id/invest",
  [auth, checkRole(["investor"])],
  async (req, res) => {
    try {
      const { amount, fromUserId, toUserId } = req.body;
      const loan = await Loan.findById(req.params.id).populate("farm");

      const transaction = new Transaction({
        type: "investment",
        amount: amount,
        loan: loan,
        from: fromUserId,
        to: toUserId,
      });

      await transaction.save();

      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }

      if (loan.status !== "pending") {
        return res
          .status(400)
          .json({ message: "Loan is not available for investment" });
      }

      const totalInvested =
        loan.investors.reduce((sum, inv) => sum + inv.amount, 0) + amount;
      if (totalInvested > loan.amount) {
        return res
          .status(400)
          .json({ message: "Investment amount exceeds loan requirement" });
      }

      loan.investors.push({
        investor: req.user.userId,
        amount,
      });

      if (totalInvested === loan.amount) {
        loan.status = "active";
        loan.farm.status = "funded";
        await loan.farm.save();
      }

      await loan.save();
      res.json({
        message: "Investment successful and transaction recorded",
        loan,
        transaction,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.post("/:id/repay", [auth, checkRole(["farmer"])], async (req, res) => {
  try {
    const { amount, fromUserId, toUserId } = req.body;
    const loan = await Loan.findById(req.params.id).populate("farm");

    const transaction = new Transaction({
      type: "repayment",
      amount: amount,
      loan: loan,
      from: fromUserId,
      to: toUserId,
    });

    await transaction.save();

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.farm.farmer.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const unpaidPayment = loan.repaymentSchedule.find(
      (p) => p.status === "pending"
    );
    if (!unpaidPayment) {
      return res.status(400).json({ message: "No pending payments found" });
    }

    if (amount !== unpaidPayment.amount) {
      return res
        .status(400)
        .json({ message: "Payment amount must match the scheduled amount" });
    }

    unpaidPayment.status = "paid";

    const allPaid = loan.repaymentSchedule.every((p) => p.status === "paid");
    if (allPaid) {
      loan.status = "completed";
    }

    await loan.save();

    res.json({
      message: "Repayment successful and transaction recorded",
      loan,
      transaction,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/schedule", auth, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate("farm");

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    const isAuthorized =
      loan.farm.farmer.toString() === req.user.userId ||
      loan.investors.some((inv) => inv.investor.toString() === req.user.userId);

    if (!isAuthorized) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(loan.repaymentSchedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

function generateRepaymentSchedule(amount, interestRate, duration) {
  const monthlyInterest = interestRate / 12 / 100;
  const monthlyPayment =
    (amount * monthlyInterest * Math.pow(1 + monthlyInterest, duration)) /
    (Math.pow(1 + monthlyInterest, duration) - 1);

  const schedule = [];
  let remainingBalance = amount;

  for (let i = 1; i <= duration; i++) {
    const interest = remainingBalance * monthlyInterest;
    const principal = monthlyPayment - interest;
    remainingBalance -= principal;

    schedule.push({
      dueDate: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000),
      amount: monthlyPayment,
      status: "pending",
    });
  }

  return schedule;
}

export default router;
