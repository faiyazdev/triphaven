import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});
