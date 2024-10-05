import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const databaseURL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: process.env.ORIGIN, 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, 
  })
);

// This fixed the Access-Control-Allow-Origin error that I was getting
app.options('*', cors()); // Allow preflight requests on all routes



app.use("/uploads/profiles", express.static("uploads/profiles"))
app.use("/uploads/files", express.static("uploads/files"))

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes)
app.use("/api/contacts", contactsRoutes)
app.use("/api/messages", messagesRoutes)

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


setupSocket(server)

const connectToDB = async () => {
  try {
    await mongoose.connect(databaseURL);
    console.log("DB Connection established");
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
    console.error(400);
  }
};

connectToDB();
