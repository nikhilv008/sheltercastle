const express = require("express");
const cors = require("cors");

const app = express();

/* ✅ CORS – MUST BE FIRST */
app.use(cors({
  origin: "https://sheltercastle.com",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

/* ✅ Handle preflight explicitly */
app.options("*", cors());

/* ✅ Body parser */
app.use(express.json());

/* ✅ Health check */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* ✅ Contact route */
app.post("/send-message", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log(name, email, message);

    // send email / save logic here

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ✅ Railway PORT */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});