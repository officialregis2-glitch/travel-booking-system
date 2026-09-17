import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Try both uppercase and lowercase variants
    const mongoUri = process.env.MONGODB_URI || process.env.mongoUri;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables. Please create a .env file');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

export default connectDB;