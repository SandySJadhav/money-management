import mongoose from "mongoose";

let isConnected = false;

mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('------------- MongoDB connection is established -------------');
});
mongoose.connection.on('open', () => {
  isConnected = true;
  console.log('------------- MongoDB connection is open -------------');
});
mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('------------- MongoDB connection is disconnected -------------');
});
mongoose.connection.on('disconnecting', () => {
  isConnected = false;
  console.log('------------- MongoDB connection is disconnecting -------------');

});
mongoose.connection.on('close', () => {
  isConnected = false;
  console.log('------------- MongoDB connection is closed -------------');
});

const connectDB = async () => {
  try {
    if (isConnected) {
      console.log('MongoDB connection is already active');
      return;
    } else {
      await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_CONNECTION_STRING, {
        dbName: process.env.DATABASE_NAME,
      })
    }
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

export default connectDB;