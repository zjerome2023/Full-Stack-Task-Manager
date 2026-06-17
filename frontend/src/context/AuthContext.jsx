import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/axios"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user")
        return stored ? JSON.parse(stored) : null
    })
    const [loading, setLoading] = useState(true)

    const persistAuth = (token, userData) => {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
    }

    const clearAuth = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
    }

    const register = async (name, email, password) => {
        const response = await api.post("/auth/register", { name, email, password })
        persistAuth(response.data.token, response.data.user)
        return response.data.user
    }

    const login = async (email, password) => {
        const response = await api.post("/auth/login", { email, password })
        persistAuth(response.data.token, response.data.user)
        return response.data.user
    }

    const logout = () => {
        clearAuth()
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            setLoading(false)
            return
        }

        api.get("/auth/me")
            .then((response) => {
                setUser(response.data.user)
                localStorage.setItem("user", JSON.stringify(response.data.user))
            })
            .catch(() => {
                clearAuth()
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        const handleLogout = () => clearAuth()
        window.addEventListener("auth:logout", handleLogout)
        return () => window.removeEventListener("auth:logout", handleLogout)
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
