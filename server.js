const express = require('express');
const Database = require('better-sqlite3');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const db = new Database('messages.db');
db.prepare(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();
app.get('/messages', (req, res) => {
    try {
        const rows = db.prepare('SELECT id, sender, text, timestamp FROM messages ORDER BY id DESC LIMIT 50').all();
        res.json({ status: "success", messages: rows.reverse() });
    } catch (err) {
        res.status(500).json({ error: "Failed" });
    }
});
app.post('/send', (req, res) => {
    const { sender, message } = req.body;
    if (!sender || !message) {
        return res.status(400).json({ error: "Missing" });
    }
    try {
        const insert = db.prepare('INSERT INTO messages (sender, text) VALUES (?, ?)');
        const result = insert.run(sender, message);
        res.json({ 
            status: "success", 
            message: { id: result.lastInsertRowid, sender, text: message } 
        });
    } catch (err) {
        res.status(500).json({ error: "Failed" });
    }
});
app.listen(PORT);
