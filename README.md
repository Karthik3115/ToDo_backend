# ToDo Backend API

A robust Express/Node.js backend for the Todo App, featuring JWT authentication and MongoDB integration.

## 🚀 Deployment Instructions (e.g., Render)

When deploying to **Render**, you MUST set the following **Environment Variables**:

| Key | Description |
| :--- | :--- |
| **`MONGO_URI`** | Your MongoDB Atlas connection string (e.g., `mongodb+srv://...`) |
| **`JWT_SECRET`** | A long secret string for JWT signing |
| **`NODE_ENV`** | Set to `production` |
| **`CLIENT_URL`** | The URL of your deployed frontend (to allow CORS) |

## 🛠 Local Setup
1. `npm install`
2. Create a `.env` file with the above variables.
3. `npm run dev`
