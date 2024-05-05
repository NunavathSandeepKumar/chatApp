require('dotenv').config();

const  cors = require('cors')
const express = require('express');
const jwt = require('jsonwebtoken');
const { connectDb } = require('./config/mongoConnection');
const userRoutes = require("./routes/userRoutes")
const authRouter = require('./routes/authRoutes');
const chatRouter = require('./routes/chatRoutes')
const app = express();
app.use(cors())
app.use(express.json());
async function startServer() {
    try {
        const client = await connectDb();
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process if MongoDB connection fails
    }
}
startServer();


app.get('/',(req,res)=>{
    res.send("API is Running Successfully");
})

app.use('/api/user',userRoutes)
app.use('/api/auth', authRouter);
app.use('/api/chat',chatRouter)
