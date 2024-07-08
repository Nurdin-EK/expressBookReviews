// auth_users.js
const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

let users = ['nurdin']; // Daftar username yang terdaftar
let reviews = []; // Array untuk menyimpan ulasan

const isValid = (username) => {
  // Fungsi ini akan memeriksa apakah username ada dalam array users
  return users.includes(username);
}

const authenticatedUser = (username, password) => {
  // Fungsi ini memverifikasi apakah username dan password sesuai dengan yang ada di records
  // Untuk contoh ini, gunakan password 'password123'
  return username === 'nurdin' && password === 'password123';
}

// Hanya pengguna terdaftar yang bisa login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Periksa apakah username dan password disediakan
  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password diperlukan" });
  }

  // Periksa apakah username ada
  if (!isValid(username)) {
    return res.status(401).json({ message: "Kredensial tidak valid" });
  }

  // Autentikasi pengguna
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Kredensial tidak valid" });
  }

  // Generate token JWT
  const token = jwt.sign({ username }, 'secret_key');
  
  // Kirim token dalam respons
  res.status(200).json({ message: "Login berhasil", token });
});

// Tambahkan atau modifikasi review buku berdasarkan ISBN
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const { username } = req.session;

  // Periksa apakah ada ulasan yang sudah ada dari pengguna yang sama untuk ISBN yang sama
  let existingReviewIndex = reviews.findIndex(entry => entry.isbn === isbn && entry.username === username);

  if (existingReviewIndex !== -1) {
    // Jika sudah ada, modifikasi ulasan yang ada
    reviews[existingReviewIndex].review = review;
    res.status(200).json({ message: "Ulasan berhasil diperbarui" });
  } else {
    // Jika belum ada, tambahkan ulasan baru
    reviews.push({ isbn, username, review });
    res.status(200).json({ message: "Ulasan berhasil ditambahkan" });
  }
});

// Hapus review buku berdasarkan ISBN
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.session;

  // Filter ulasan untuk mendapatkan hanya ulasan yang tidak sesuai dengan ISBN dan username yang diberikan
  reviews = reviews.filter(entry => !(entry.isbn === isbn && entry.username === username));

  res.status(200).json({ message: "Ulasan berhasil dihapus" });
});

module.exports = {
  authenticated: regd_users,
  isValid: isValid,
  users: users
};
