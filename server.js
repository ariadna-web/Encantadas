import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productosRouter from "./routes/Product.js";
import usuariosRouter from "./routes/User.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// montar rutas API
app.use("/api/productos", productosRouter);
app.use("/api/usuarios", usuariosRouter);

// servir front estático si quieren (por ejemplo carpeta 'pagina' o 'carrito')
app.use(express.static("pagina"));
app.use(express.static("carrito"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
