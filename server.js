import "dotenv/config";
import express from "express";

import cors from "cors";
import connectDB from "./config/db.js";
import { userRoutes } from "./routes/user.routes.js";

const app = express();
await connectDB();
const port = process.env.PORT || 4000;
// middleware
app.use(cors());
app.use(express.json());
// api routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user", userRoutes);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
