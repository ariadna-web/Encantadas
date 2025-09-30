import express from "express";
import Product from "../models/Product.js/index.js";

const router = express.Router();

// GET todos
router.get("/", async (req, res) => {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET por id
router.get("/:id", async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "No encontrado" });
    res.json(prod);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST nuevo
router.post("/", async (req, res) => {
  try {
    const nuevo = new Product(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT actualizar
router.put("/:id", async (req, res) => {
  try {
    const actualizado = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ message: "No encontrado" });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const eliminado = await Product.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ message: "No encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;