import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

//Health check
app.get("/", (req, res) => {
   res.json({ message: "Job Tracker API is running" });
});

//Start server
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
