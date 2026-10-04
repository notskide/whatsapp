const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
let messageBuffer = ["System: Cloud Proxy Active", "Welcome to BB WhatsApp Bridge"];

app.get('/messages', (req, res) => {
    res.json({status: "online", messages: messageBuffer});
});

app.post('/send', (req, res) => {
    const { number, message } = req.body;
    if (!number || !message) {
        return res.status(400).json({ error: "Missing parameters" });
    }
    const entry = `To ${number}: ${message}`;
    messageBuffer.push(entry);
    if (messageBuffer.length > 15) messageBuffer.shift();
    res.json({ status: "success", sent: entry });
});

app.listen(PORT, () => {
    console.log(`Cloud proxy live on port ${PORT}`);
});
