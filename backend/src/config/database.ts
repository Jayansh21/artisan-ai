import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/artisanai';
    
    await mongoose.connect(mongoURI);
    console.log('📦 MongoDB Connected');

    // Event listeners for real-time connection status
    mongoose.connection.on('connected', () => {
      console.log('Mongoose: Connection is open');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose: Connection error', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose: Connection disconnected');
    });

  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Optional helper function to check connection state anywhere in your app
export const isMongoConnected = (): boolean => {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  return mongoose.connection.readyState === 1;
};
