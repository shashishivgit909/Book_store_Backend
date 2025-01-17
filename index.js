import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/route.js";

const app = express()
const port = 3000


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


