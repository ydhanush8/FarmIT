import express from "express";
import { auth, checkRole } from '../middleware/auth.js';
import User from '../models/User.js'
import Issue from '../models/Issue.js'

const router = express.Router();

router.post("/add-issue", [auth, checkRole(["farmer","investor"])], async (req, res) => {
  try {
    const { userId, issueTitle, issueDiscription } = req.body;

    const user = await User.findOne({ _id: userId});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const issue = new Issue({
      user: userId,
      issueTitle:issueTitle,
      issueDiscription:issueDiscription
    });

    await issue.save();
    res.json({message:"Issue created Successfully"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all-issues", [auth, checkRole(["farmer","investor","admin"])], async (req, res) => {
    try {
        const issues = await Issue.find();
        res.json(issues);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router