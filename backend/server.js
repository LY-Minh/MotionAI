import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

console.log("Bot token being used:", BOT_TOKEN);

// Store: phone → chatId
const userPhoneToChatId = {};

const otpStore = new Map();

// Send Telegram message
async function sendTelegramMessage(chatId, text) {
  return fetch(`${API_URL}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  }).then((res) => res.json());
}

// STEP 1: Telegram webhook receives /start <phone>
app.post("/webhook", async (req, res) => {
  const update = req.body;
  console.log("RAW UPDATE:", JSON.stringify(update, null, 2));

  if (!update.message) {
    console.log("No message field in update");
    return res.sendStatus(200);
  }

  const text = update.message.text || "";
  console.log("Received message text:", text);

  if (text.startsWith("/start")) {
    const chatId = update.message.chat.id;
    console.log("User chatId:", chatId);

    const parts = text.split(" ");
    const payload = parts[1];
    console.log("Extracted payload:", payload);

    if (!payload) {
      console.log("⚠ No payload found! No OTP will be sent.");
      return res.sendStatus(200);
    }

    userPhoneToChatId[payload] = chatId;
    console.log("Mapped phone → chatId:", userPhoneToChatId);

    await sendTelegramMessage(chatId, "Welcome! Sending your OTP now...");

    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore.set(chatId, otp);

    console.log("Generated OTP:", otp);

    await sendTelegramMessage(chatId, `Your OTP is: ${otp}`);
  }

  res.sendStatus(200);
});

// STEP 2: Verify OTP
app.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  const chatId = userPhoneToChatId[phone];

  if (!chatId)
    return res.status(400).json({ error: "No Chat ID found for phone number" });

  const savedOtp = otpStore.get(chatId);

  if (!savedOtp)
    return res.status(400).json({ error: "No OTP generated for this user" });

  if (savedOtp !== otp)
    return res.status(400).json({ success: false, message: "Invalid OTP" });

  otpStore.delete(chatId);

  res.json({ success: true, message: "OTP verified!" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
