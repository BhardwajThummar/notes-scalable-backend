import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';
import searchRoutes from './routes/searchRoutes';
import expressRateLimit from 'express-rate-limit';
import expressSlowDown from 'express-slow-down';
import { errorHandler, errorNotFoundHandler } from "./middleware/errorhandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || "", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(express.json());

// Rate limiting middleware
const limiter = expressRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Slow down middleware
const speedLimiter = expressSlowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per windowMs, then...
  delayMs: () => 500, // begin adding 500ms of delay per request above 100
});

app.use(limiter);
app.use(speedLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', noteRoutes);
app.use('/api', searchRoutes);

// Error handling middleware
app.use(errorHandler);
app.use(errorNotFoundHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;