const express= require('express')
const session= require('express-session')
const passport= require('passport')
const GoogleStrategy= require('passport-google-oauth20').Strategy
//const mongoose= require('mongoose')//
const bcrypt= require('bcrypt')
const path= require('path')

const app= express()
const PORT= 3000

/*const userSchema= new mongoose.Schema({
    username: stringify,
    email:{type: String, unique: true },
    password: String, // hashed
    google: { type: Boolean, default: false }

})
const User = mongoose.model("User", userSchema)

// ------------------ Middleware ------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());*/

app.use(session({
    secret: "secreto123",
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// ------------------ Passport Google ------------------
passport.use(new GoogleStrategy({
    clientID: "TU_CLIENT_ID",
    clientSecret: "TU_CLIENT_SECRET",
    callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
            user = await User.create({
                username: profile.displayName,
                email: profile.emails[0].value,
                password: null,
                google: true
            });
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// ------------------ Rutas Frontend ------------------
app.use(express.static(path.join(__dirname, "/"))); // sirve index.html, script.js, style.css

// ------------------ Registro Normal ------------------
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const exist = await User.findOne({ email });
        if (exist) return res.send("Usuario ya existe");
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashed, google: false });
        res.send("Usuario registrado con éxito");
    } catch (err) {
        res.send("Error al registrar usuario");
    }
});

// ------------------ Login Normal ------------------
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.send("Usuario no encontrado");
        if (user.google) return res.send("Usá login con Google");
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.send("Contraseña incorrecta");
        req.session.user = user;
        res.send("Login exitoso");
    } catch (err) {
        res.send("Error en login");
    }
});

// ------------------ Forgot Password ------------------
app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.send("Usuario no encontrado");
        res.send(`Tu correo registrado es: ${user.email}`);
    } catch (err) {
        res.send("Error en recuperación de password");
    }
});

// ------------------ Google Login/Registro ------------------
app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login-register/index.html" }),
    (req, res) => {
        res.redirect("/pagina/pagina.html");
    }
);

// ------------------ Logout ------------------
app.get("/logout", (req, res) => {
    req.logout(() => res.redirect("/login-register/index.html"));
});

// ------------------ Servidor ------------------
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});