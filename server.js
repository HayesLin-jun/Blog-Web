const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// Setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Database
const db = new sqlite3.Database('./db/blog.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to the blog database.');
});

db.run(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    date TEXT
  )
`);

// Routes
app.get('/', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY id DESC', [], (err, rows) => {
    if (err) throw err;
    res.render('index', { posts: rows });
  });
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/add', (req, res) => {
  const { title, content } = req.body;
  const date = new Date().toLocaleString();
  db.run('INSERT INTO posts (title, content, date) VALUES (?, ?, ?)', [title, content, date], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
// Feature: comment system coming soon