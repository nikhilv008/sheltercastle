const express = require("express");

const app = express();

/* ✅ CORS – SINGLE SOURCE OF TRUTH */
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

/* Contact route */
app.post("/send-message", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log(name, email, message);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* Railway port */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});