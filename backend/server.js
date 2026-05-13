import dotenv from 'dotenv'
import express from 'express'
import todoRoutes from './routes/todo.route.js'
import { connectDB } from './config/db.js'

dotenv.config()

const app = express()

app.use(express.json())

app.use("/api/todos", todoRoutes) // api/todos means the path will show up as link.com/api/todos. Can change based on needs

app.listen(5001, () => {
    connectDB()
    console.log('Server started at http://localhost:5001')
})