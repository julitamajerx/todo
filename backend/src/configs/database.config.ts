import { connect } from 'mongoose';

export const dbConnect = async () => {
  try {
    await connect(process.env.MONGO_URI!);
    console.log('Connected successfully to the database.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};
