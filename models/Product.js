import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  imagen: { type: String },
  categoria: { type: String },
  stock: { type: Number, default: 0 },
  destacado: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);