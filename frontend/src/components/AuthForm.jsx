import { useState } from "react"
import { useAuth } from "../context/AuthContext"

function AuthForm() {
    const { login, register } = useAuth()
    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSubmitting(true)

        try {
            if (isLogin) {
                await login(email, password)
            } else {
                await register(name, email, password)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    const toggleMode = () => {
        setIsLogin(!isLogin)
        setError("")
        setName("")
        setEmail("")
        setPassword("")
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Task Manager</h1>
                <p className="text-gray-500 text-center mb-8">
                    {isLogin ? "Sign in to your account" : "Create a new account"}
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {!isLogin && (
                        <input
                            className="outline-none px-3 py-2 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-300"
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    )}
                    <input
                        className="outline-none px-3 py-2 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-300"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="outline-none px-3 py-2 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-300"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        required
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium cursor-pointer disabled:opacity-50"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        className="text-blue-500 hover:text-blue-700 font-medium cursor-pointer"
                        onClick={toggleMode}
                        type="button"
                    >
                        {isLogin ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </div>
        </div>
    )
}

export default AuthForm
