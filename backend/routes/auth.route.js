import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

const formatUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email
})

// POST /api/auth/register
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body

    if (!name?.trim() || !email?.trim() || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" })
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() })
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" })
        }

        const user = await User.create({ name: name.trim(), email, password })
        const token = createToken(user._id)

        res.status(201).json({ token, user: formatUser(user) })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// POST /api/auth/login
router.post("/login", async (req, res) => {
    const { email, password } = req.body

    if (!email?.trim() || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        const token = createToken(user._id)
        res.json({ token, user: formatUser(user) })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// GET /api/auth/me
router.get("/me", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json({ user: formatUser(user) })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router
