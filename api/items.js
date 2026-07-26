const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();
const Item = require('../models/item');

const app = express();
app.use(express.json());

const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    autoIndex: true
  });
};

router.get('/', async (req, res) => {
  try {
    await connectDb();
    const items = await Item.find().sort({ date: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    await connectDb();
    const newItem = new Item({ name: req.body.name });
    const item = await newItem.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create item', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await connectDb();
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = async function handler(req, res) {
  await connectDb();
  return router(req, res, function () {
    res.status(404).json({ message: 'Not found' });
  });
};
