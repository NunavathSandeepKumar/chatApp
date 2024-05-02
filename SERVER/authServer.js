require('dotenv').config()

const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

app.use(cors())
app.use(express.json())

// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// const db = mongoose.connection

// db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshTokens: [{ type: String }]
})


async function startServer() {
  try {
      const client = await connectToMongo();
      const databasesList = await client.db().admin().listDatabases();
      console.log("Databases:");
      databasesList.databases.forEach(db => console.log(` - ${db.name}`));

      const port = process.env.PORT || 4000;
      app.listen(port, () => {
          console.log(`Server is running on port ${port}`);
      });
  } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1); // Exit the process if MongoDB connection fails
  }
}
startServer();

const User = mongoose.model('User', userSchema)

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (!refreshToken) return res.status(401).json({ message: "Token is missing", result: "failure" })

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token verification failed", result: "failure" })
    const accessToken = generateAccessToken({ username: decoded.username })
    res.json({ message: "Access token generated successfully", result: "success", data: { accessToken: accessToken } })
  })
})

app.delete('/logout', async (req, res) => {
  const refreshToken = req.body.token
  if (!refreshToken) return res.status(401).json({ message: "Token is missing", result: "failure" })

  try {
    const user = await User.findOne({ refreshTokens: refreshToken })
    if (!user) return res.status(404).json({ message: "User not found", result: "failure" })

    user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken)
    await user.save()

    res.status(204).json({ message: "Logged out successfully", result: "success" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal server error", result: "failure" })
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username: username })
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials", result: "failure" })
    }

    const accessToken = generateAccessToken({ username: user.username })
    const refreshToken = jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN_SECRET)
    user.refreshTokens.push(refreshToken)
    await user.save()

    res.json({ message: "Login successful", result: "success", data: { accessToken: accessToken, refreshToken: refreshToken } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal server error", result: "failure" })
  }
})

app.post('/signup', async (req, res) => {
  const { username, password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username: username, password: hashedPassword, refreshTokens: [] })
    await newUser.save()

    res.status(201).json({ message: "User created successfully", result: "success" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal server error", result: "failure" })
  }
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '600s' })
}

app.listen(4000, () => {
  console.log('Server is running on port 4000')
})
