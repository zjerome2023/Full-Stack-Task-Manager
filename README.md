# To-Do App

A full-stack task manager for creating, editing, completing, and deleting todos. Data is stored in MongoDB and served through a REST API.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose

## Features

- Add new tasks
- Mark tasks as complete or incomplete
- Edit task text
- Delete tasks
- Persistent storage in MongoDB

## Project Structure

```
To-Do-App/
├── backend/
│   ├── config/       # Database connection
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── server.js     # Express server
└── frontend/
    └── src/          # React application
```

## Prerequisites

- [Node.js](https://nodejs.org/)
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/zjerome2023/To-Do-App.git
   cd To-Do-App
   ```

2. Install dependencies:

   ```bash
   npm install
   npm install --prefix frontend
   ```

3. Create a `.env` file in the project root:

   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5001
   ```

## Development

Run the backend and frontend in separate terminals.

**Backend** (from the project root):

```bash
npm run dev
```

**Frontend** (from the `frontend` directory):

```bash
npm run dev
```

The Vite dev server proxies `/api` requests to the backend at `http://127.0.0.1:5001`.

## Production

Build the frontend and start the server:

```bash
npm run build
NODE_ENV=production npm start
```

The app is served from a single server on the port defined in `PORT` (default `5001`).

## API Endpoints

| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| GET    | `/api/todos`    | Get all todos            |
| POST   | `/api/todos`    | Create a new todo        |
| PATCH  | `/api/todos/:id`| Update a todo            |
| DELETE | `/api/todos/:id`| Delete a todo            |

## License

ISC
