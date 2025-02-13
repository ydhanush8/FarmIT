import express from 'express';
const router = express.Router();
import { auth, checkRole } from '../middleware/auth.js';
import User from '../models/User.js';
import Farm from '../models/Farm.js';
import Loan from '../models/Loan.js';

router.get('/users', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id/verify', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/loans', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const loans = await Loan.find().populate('farm').populate('investors.investor');
    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/farms', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const farms = await Farm.find().populate('farmer');
    res.json(farms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 