import connectdb from "./db/db.js";
import { userRouter } from "./routes/user.route.js";
import express from "express";
import bodyParser from "body-parser";
import path, { dirname } from "path";
// import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;
userRouter.get("/h", (req, res) => {
  res.send("hello world");
});
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // Specify the headers you want to allow
  })
);
app.options("*", cors());

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
