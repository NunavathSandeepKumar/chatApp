require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const { connectDb } = require('./config/mongoConnection');
const userRoutes = require("./routes/userRoutes")
const app = express();
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

app.use('/api',userRoutes)

// app.get('/posts', authenticateToken, (req, res) => {
//     res.json(posts.filter(post => post.username === req.user.name))
// });

// async function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (token == null) return res.sendStatus(401);
//     try {
//         const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         req.user = user;
//         next();
//     } catch (err) {
//         console.error("Error verifying JWT:", err);
//         return res.sendStatus(401); // Return 401 for invalid tokens
//     }
// }
