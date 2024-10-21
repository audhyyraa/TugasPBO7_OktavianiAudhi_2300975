const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Set up middleware untuk session
app.use(session({
    secret: 'my_secret_key', // Ganti dengan secret key kamu
    resave: false,           // Jangan menyimpan ulang session jika tidak ada perubahan
    saveUninitialized: false, // Jangan buat session kosong
    cookie: { maxAge: 60000 } // Session expire setelah 1 menit
}));

// Middleware untuk parsing form (body-parser sudah built-in di Express 4.16 ke atas)
app.use(express.urlencoded({ extended: true }));
// Set view engine ke EJS
app.set('view engine', 'ejs');

// Set folder untuk file statis
app.use(express.static(path.join(__dirname, 'public')));

// Route untuk halaman login
app.get('/', (req, res) => {
    res.render('login'); // Render view login.ejs
});

// Route untuk menangani login
app.post('/login', (req, res) => {
    const { username } = req.body;
    if (username) {
        req.session.username = username; // Simpan username di session
        return res.redirect('/profile'); // Redirect ke halaman profile
    }
    res.redirect('/'); // Jika tidak ada username, redirect ke halaman login
});

// Route untuk halaman profile
app.get('/profile', (req, res) => {
    if (!req.session.username) { // Cek apakah ada session username
        return res.redirect('/'); // Jika tidak, redirect ke login
    }
    const profile = {             // Data profil statis, bisa diganti dengan data dinamis dari database
        name: 'John Doe',
        email: 'john@example.com'
    };
    res.render('profile', { user: { username: req.session.username }, profile });
});

// Route untuk logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/profile'); // Jika ada error saat destroy session
        }
        res.redirect('/'); // Redirect ke login setelah logout
    });
});

// Set port dan mulai server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
