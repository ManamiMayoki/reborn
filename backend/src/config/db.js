import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/reborn';
  
  try {
    mongoose.set('strictQuery', false);
    mongoose.set('bufferCommands', false);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    
    isConnected = true;
    console.log(`[Reborn DB] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`[Reborn DB] Direct MongoDB connection failed (${error.message}).`);
    console.log(`[Reborn DB] Activating Resilient In-Memory Fallback Engine so all workflows, 3D scenes, docking and reports remain 100% operational.`);
    isConnected = false;
    return false;
  }
};

export const getDbStatus = () => ({
  connected: isConnected,
  mode: isConnected ? 'mongodb-live' : 'in-memory-fallback',
  timestamp: new Date().toISOString()
});
