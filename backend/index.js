import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/Router.js";
import connectDb from "./connection.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDb();

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is started on port ${PORT}`);
});
