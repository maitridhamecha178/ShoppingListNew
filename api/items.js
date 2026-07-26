const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Item = require('../models/item');

let cachedConnection = null;

async function connectDb() {
  if (cachedConnection) {
    return cachedConnection;
  }

  cachedConnection = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    autoIndex: true
  });

  return cachedConnection;
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    if (!req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        if (!body) {
          resolve({});
          return;
        }

        try {
          resolve(JSON.parse(body));
        } catch (error) {
          resolve({});
        }
      });
      return;
    }

    resolve(req.body || {});
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDb();

    if (req.method === 'GET') {
      const items = await Item.find().sort({ date: -1 });
      return res.status(200).json(items);
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const newItem = new Item({ name: body.name });
      const item = await newItem.save();
      return res.status(201).json(item);
    }

    if (req.method === 'DELETE') {
      const itemId = req.query?.id || req.url.split('/').pop();
      const item = await Item.findByIdAndDelete(itemId);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
