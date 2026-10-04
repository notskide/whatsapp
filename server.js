const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const DB_FILE = 'database.json';

if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

app.get('/messages', (req, res) => {
    try {
        const data = fs.readFileSync(DB_FILE);
        const messages = JSON.parse(data);
        res.json({ status: "success", messages: messages.slice(-50) });
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
        const data = fs.readFileSync(DB_FILE);
        const messages = JSON.parse(data);
        const entry = { id: Date.now(), sender, text: message, timestamp: new Date().toISOString() };
        messages.push(entry);
        if (messages.length > 500) messages.shift();
        fs.writeFileSync(DB_FILE, JSON.stringify(messages));
        res.json({ status: "success", message: entry });
    } catch (err) {
        res.status(500).json({ error: "Failed" });
    }
});

app.listen(PORT);
