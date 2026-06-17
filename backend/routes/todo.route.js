import express from 'express'
import Todo from '../models/todo.model.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(protect)

// GET all todos for the authenticated user
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 })
        res.json(todos)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Create new todo
router.post('/', async (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        user: req.user.id
    })
    try {
        const newTodo = await todo.save()
        res.status(201).json(newTodo)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Update a todo (text and/or completed)
router.patch('/:id', async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id })
        if (!todo) return res.status(404).json({ message: "Todo not found" })

        if (req.body.text !== undefined) {
            todo.text = req.body.text
        }
        if (req.body.completed !== undefined) {
            todo.completed = req.body.completed
        }
        const updatedTodo = await todo.save()
        res.json(updatedTodo)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Delete a todo
router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id })
        if (!todo) return res.status(404).json({ message: "Todo not found" })
        res.json({ message: "Todo deleted" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router
