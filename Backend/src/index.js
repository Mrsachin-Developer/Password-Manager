import express from "express";
import connectDB from "./db/db.js";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import bookMarkRouter from "./routes/bookMark.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/api/v1/bookMarks", bookMarkRouter);
app.use("/api/v1/user", userRouter);

const port = process.env.PORT || 8000;

connectDB();

app.listen(port, () => {
  console.log(`Server is running at port: ${port} 🚀`);
});
