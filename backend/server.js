import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import todoRoutes from './routes/todo.route.js'
import { connectDB } from './config/db.js'
const PORT = process.env.PORT || 5001;
dotenv.config()

const app = express()

app.use(express.json())

app.use("/api/todos", todoRoutes) // api/todos means the path will show up as link.com/api/todos. Can change based on needs

const __dirname = path.resolve()

if (process.env.NODE_ENV === "production") {
    app.use(epxpress.static(path.join(__dirname, "/frontend/dist")))
    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}

app.listen(PORT, () => {
    connectDB()
    console.log('Server started at http://localhost:5001')
})