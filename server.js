require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('pagina'));
app.use(express.static('imagenes'));
app.use(express.static('login-register'));
app.use(express.static('carrito'));


// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB', err));

// Modelo de usuario
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Rutas
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.json({ mensaje: 'Usuario registrado con éxito' });
    } catch(err) {
        res.status(400).json({ mensaje: 'Error registrando usuario', error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if(!user) return res.status(400).json({ mensaje: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

        res.json({ mensaje: 'Login exitoso', user: { username: user.username, email: user.email } });
    } catch(err) {
        res.status(500).json({ mensaje: 'Error en login' });
    }
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));