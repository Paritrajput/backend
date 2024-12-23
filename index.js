import connectdb from "./db/db.js";
import { userRouter } from "./routes/user.route.js";
import express from "express";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import fetch from "node-fetch";
// import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;
console.log("Port: ", process.env.PORT);
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // Specify the headers you want to allow
  })
);
app.options("*", cors());

app.get("/api/news", async (req, res) => {
  const { q, language = "en", sortBy = "publishedAt" } = req.query; // Get query parameters
  const apiKey = "5b7cb32913d34adc947e946a1bbc8743";

  try {
    const url = `https://newsapi.org/v2/everything?q=${q}&language=${language}&sortBy=${sortBy}&apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "ok") {
      res.json(data); // Send the data to the frontend
    } else {
      res.status(400).json({ error: data.message || "Failed to fetch news" });
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.get("/h", (req, res) => {
  res.send("hello world");
});

// Setting up __dirname for ES6 modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// console.log(__dirname);

app.use("/uploads", express.static(path.join("uploads")));

// Serve static files from the 'frontend' directory

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", userRouter);

// app.use(express.static(path.join(__dirname, "../frontend")));

connectdb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on: http://localhost:${PORT}`);
    });
  })
  .catch((err) =>
    console.error("Something went wrong during DB connection:", err)
  );
