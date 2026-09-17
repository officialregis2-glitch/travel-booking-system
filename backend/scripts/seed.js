import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/User.js';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'Admin@12345';

    const exists = await User.findOne({ username });
    if (exists) {
      console.log('Admin already exists:', username);
    } else {
      await User.create({ username, password, role: 'admin' });
      console.log('✅ Admin created:', username);
    }
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

seed();