import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://admin:password123@localhost:27017/proyecto_ferreteria?authSource=admin";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Conectado a MongoDB en Docker");
  } catch (error) {
    console.error("Error conectando a la DB:", error);
  }
};