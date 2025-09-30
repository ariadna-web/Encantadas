import express from "express";
import User from "../models/User.js/index.js";
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ message: "Email ya registrado" });
    const user = new User({ nombre, email, password });
    await user.save();
    res.status(201).json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login simple
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Credenciales inválidas" });
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Credenciales inválidas" });
    res.json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET todos
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET por id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "No encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT actualizar
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "No encontrado" });
    user.nombre = req.body.nombre ?? user.nombre;
    user.email = req.body.email ?? user.email;
    if (req.body.password) user.password = req.body.password;
    await user.save();
    res.json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
