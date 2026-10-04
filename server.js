const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/bb_whatsapp";

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ _id: -1 }).limit(50);
        res.json({ status: "success", messages: messages.reverse() });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

app.post('/send', async (req, res) => {
    const { sender, message } = req.body;
    if (!sender || !message) {
        return res.status(400).json({ error: "Missing parameters" });
    }
    try {
        const newMessage = new Message({ sender, text: message });
        await newMessage.save();
        res.json({ status: "success", message: newMessage });
    } catch (err) {
        res.status(500).json({ error: "Failed to save message" });
    }
});

app.listen(PORT);
