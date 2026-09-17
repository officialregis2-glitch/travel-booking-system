import dotenv from 'dotenv';
dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || process.env.mongoUri,
  jwtSecret: process.env.JWT_SECRET || process.env.jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  timezone: process.env.TIMEZONE || 'Africa/Kigali',
};

// Validate required environment variables
const required = ['MONGODB_URI', 'JWT_SECRET', 'mongoUri', 'jwtSecret'];
const hasMongoUri = process.env.MONGODB_URI || process.env.mongoUri;
const hasJwtSecret = process.env.JWT_SECRET || process.env.jwtSecret;

if (!hasMongoUri) {
  console.warn('⚠️  Missing MONGODB_URI in environment variables');
}
if (!hasJwtSecret) {
  console.warn('️  Missing JWT_SECRET in environment variables');
}

export default env;