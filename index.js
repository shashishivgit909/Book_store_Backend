import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/route.js";
import cors from "cors";

const app = express()
const port = 4000;
// app.use(cors({
//     origin:""
// }));

// Enhanced CORS configuration
app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

// Middleware to parse JSON bodies
app.use(express.json());

async function main() {
    await mongoose.connect(process.env.MONGOURL);
}

main().then(() => console.log("mongoose datbase connected success")).catch((err) => console.log(err));


app.use("/api", router);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`server running on: http://localhost:${port}`)
})


