import { useEffect, useState } from "react"
import { MdOutlineDone } from "react-icons/md"
import { IoClose } from "react-icons/io5"
import { MdModeEditOutline } from "react-icons/md"
import { FaTrash } from "react-icons/fa6"
import { IoLogOutOutline } from "react-icons/io5"
import api from "./api/axios"
import { useAuth } from "./context/AuthContext"
import AuthForm from "./components/AuthForm"

function App() {
  const { user, loading, logout } = useAuth()
  const [newTodo, setNewTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [editingTodo, setEditingTodo] = useState(null)
  const [editedText, setEditedText] = useState("")
  const [error, setError] = useState("")

  const fetchTodos = async () => {
    try {
      const response = await api.get("/todos")
      setTodos(response.data)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load todos")
    }
  }

  useEffect(() => {
    if (user) {
      fetchTodos()
    }
  }, [user])

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    try {
      const response = await api.post("/todos", { text: newTodo })
      setTodos([response.data, ...todos])
      setNewTodo("")
      setError("")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add todo")
    }
  }

  const startEditing = (todo) => {
    setEditingTodo(todo._id)
    setEditedText(todo.text)
  }

  const saveEdit = async (id) => {
    try {
      const response = await api.patch(`/todos/${id}`, { text: editedText })
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)))
      setEditingTodo(null)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update todo")
    }
  }

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`)
      setTodos(todos.filter((todo) => todo._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete todo")
    }
  }

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id)
      const response = await api.patch(`/todos/${id}`, { completed: !todo.completed })
      setTodos(todos.map((t) => (t._id === id ? response.data : t)))
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update todo")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Task Manager</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome, {user.name}</p>
          </div>
          <button
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            onClick={logout}
            title="Sign out"
          >
            <IoLogOutOutline className="text-xl" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={addTodo}
          className="flex items-center gap-2 shadow-sm border border-gray-200 p-2 rounded-lg"
        >
          <input
            className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            required
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
            type="submit"
          >
            Add Task
          </button>
        </form>

        <div className="mt-4">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No todos yet. Add one above!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {todos.map((todo) => (
                <div key={todo._id}>
                  {editingTodo === todo._id ? (
                    <div className="flex items-center gap-x-3">
                      <input
                        className="flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner"
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                      <div className="flex gap-x-2">
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
                          onClick={() => saveEdit(todo._id)}
                        >
                          <MdOutlineDone />
                        </button>
                        <button
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer"
                          onClick={() => setEditingTodo(null)}
                        >
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-4 overflow-hidden">
                        <button
                          className={`shrink-0 h-6 w-6 border rounded-full flex items-center justify-center cursor-pointer ${todo.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-500 hover:border-blue-400"}`}
                          onClick={() => toggleTodo(todo._id)}
                        >
                          {todo.completed && <MdOutlineDone />}
                        </button>
                        <span
                          className={`font-medium truncate ${todo.completed ? "text-gray-400 line-through" : "text-gray-800"}`}
                        >
                          {todo.text}
                        </span>
                      </div>
                      <div className="flex gap-x-2">
                        <button
                          className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200 cursor-pointer"
                          onClick={() => startEditing(todo)}
                        >
                          <MdModeEditOutline />
                        </button>
                        <button
                          className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200 cursor-pointer"
                          onClick={() => deleteTodo(todo._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
