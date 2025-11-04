import express from "express";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
const app = express();

dotenv.config();
app.on("error", (err, req, res, next) => {
    console.log(err);
    res.status(500).send(err);
});

const PORT = process.env.PORT || 5000;
(async function () {
    try {
        const db_connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(db_connection.connection.host, "DB Connected");
        app.listen(PORT,() => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("Error Connecting DB: ", error);
        process.exit(1);
    }
})();

app.get("/test", (req, res) => {
    res.json({ message: "Test Route: Server is up and running" });
})
