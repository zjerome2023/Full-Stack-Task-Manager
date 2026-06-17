import express from 'express'
import Todo from '../models/todo.model.js'

const router = express.Router()

// GET all todos
router.get('/', async (req, res) => {
    try{
        const todos = await Todo.find() // Finds all todos from the Todo model, returns as a JSON
        res.json(todos)        
    } catch(error){
        res.status(500).json({message: error.message}) // http code 500: Internal server error
    }
})

// Create new todo
router.post('/', async (req, res) => {
    const todo = new Todo({
        text: req.body.text // Takes text from client request's body
    })
    try {
        const newTodo = await todo.save() // wait to save new todo
        res.status(201).json(newTodo) // http code 201: Created successfully
    } catch(error) {
        res.status(400).json({message: error.message}) // http code 400: bad request
    }
})

// Update a todo (text and/or completed)
 
router.patch('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id) // Client requests a specific ID, await to find the Todo by id
        if (!todo) return res.status(404).json({message: "Todo not found"}) // return not found if there is no Todo with that ID
        if (req.body.text !== undefined ) { // Checks if request is undefined
            todo.text = req.body.text
        }
        if (req.body.completed !== undefined) { // Checks if request is undefined
            todo.completed = req.body.completed
        }
        const updatedTodo = await todo.save() // Saves the new todo in this variable
        res.json(updatedTodo)
    } catch(error) {
        res.status(400).json({message: error.message})
    }
})

// Delete a todo
router.delete('/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id)
        res.json({message: "Todo deleted"})
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

export default router