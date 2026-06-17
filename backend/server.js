import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import todoRoutes from './routes/todo.route.js'
import authRoutes from './routes/auth.route.js'
import { connectDB } from './config/db.js'

dotenv.config()

const PORT = process.env.PORT || 5001
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/todos", todoRoutes)

const __dirname = path.resolve()

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}

app.listen(PORT, () => {
    connectDB()
    console.log(`Server started at http://localhost:${PORT}`)
})
