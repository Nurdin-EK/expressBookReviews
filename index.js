const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { authenticated: customer_routes, isValid } = require('./router/auth_users');
const { general: genl_routes } = require('./router/general');

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth", function auth(req, res, next) {
    // Implementasi mekanisme autentikasi di sini jika diperlukan
    next(); // Pastikan selalu memanggil next() untuk melanjutkan ke middleware atau rute berikutnya
});

const PORT = 5000;

// Gunakan middleware untuk rute customer
app.use("/customer", customer_routes);

// Gunakan middleware untuk rute umum
app.use("/", genl_routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
