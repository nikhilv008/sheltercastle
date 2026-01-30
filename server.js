const express = require("express");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();

/* ✅ Init Resend */
const resend = new Resend(process.env.RESEND_API_KEY);

/* ✅ CORS */
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://sheltercastle.com",
    "https://www.sheltercastle.com",
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/* Body parser */
app.use(express.json());

/* Health check */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* ✅ Contact route (RESEND EMAIL) */
app.post("/send-message", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false });
  }

  try {
    const result = await resend.emails.send({
      from: "Shelter Castle <onboarding@resend.dev>", // works instantly
      to: process.env.RECEIVER_EMAIL,
      reply_to: email,
      subject: "New Contact Form Message",
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    console.log("RESEND EMAIL SENT:", result.id);

    return res.json({ success: true });
  } catch (error) {
    console.error("RESEND ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Email service unavailable",
    });
  }
});

/* Railway port */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});