# Todo List Full-Stack Application

A full-stack Todo List application built with React, TypeScript, Express.js, and MySQL.

## Tech Stack

### Frontend
- **React** 18.x.x
- **TypeScript** 4.9.x
- **Tailwind CSS** 3.x.x
- **React Hook Form** 7.x.x
- **Axios** for HTTP requests
- **Vite** as build tool

### Backend
- **Express.js** 4.18.x
- **TypeScript** 4.9.x
- **MySQL** (mysql2)
- **CORS** for cross-origin requests
- **dotenv** for environment variables
- **Nodemon** for auto-reload

## Project Structure

```
Todo-List/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service layer
│   │   ├── types/        # TypeScript type definitions
│   │   ├── utils/        # Utility functions
│   │   ├── App.tsx       # Main App component
│   │   ├── main.tsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── package.json
│   └── vite.config.ts
│
├── backend/               # Express backend server
│   ├── src/
│   │   ├── config/       # Configuration files (database, etc.)
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # TypeScript models/interfaces
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic layer
│   │   └── server.ts     # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── package.json          # Root package.json for managing both projects
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm or yarn

### Installation

1. **Install dependencies for all projects:**
   ```bash
   npm run install:all
   ```

   Or install individually:
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

2. **Set up MySQL database:**
   
   You can use either a **local MySQL database** or a **live/remote MySQL database** (hosted on any MySQL hosting provider).
   
   **Option 1: Using MySQL Workbench (Recommended)**
   
   1. Download and install MySQL Workbench from: https://dev.mysql.com/downloads/workbench/
   2. Open MySQL Workbench and create a new connection:
      - Click **+** to add a new connection
      - Enter your connection details:
        - **Connection Name**: Any name you prefer
        - **Hostname**: Your database host (e.g., `localhost` for local, or your remote host)
        - **Username**: Your MySQL username
        - **Password**: Click **Store in Vault** and enter your password
        - **Default Schema**: Your database name (e.g., `todoList_db`)
      - Click **Test Connection** to verify, then **OK**
   3. Connect to your database by double-clicking the connection you just created
   4. Go to **File → Open SQL Script**
   5. Navigate to and select `backend/src/database/schema.sql` from this project
   6. Make sure the correct database is selected in the dropdown (top right)
   7. Click the **Execute** button (lightning bolt icon) or press `Ctrl+Shift+Enter` to run the script
   8. This will create the `tasks` table with all required columns
   
   **Option 2: Using phpMyAdmin**
   
   1. Log into your MySQL database management interface (phpMyAdmin, cPanel, or your hosting provider's database manager)
   2. Select your database (or create a new one if needed)
   3. Click on the **SQL** tab
   4. Open the `backend/src/database/schema.sql` file from this project
   5. Copy all the SQL commands from the file
   6. Paste them into the SQL query window
   7. Click **Go** or **Execute** to run the SQL commands
   8. This will create the `tasks` table with all required columns
   
   **Option 3: Using MySQL Command Line**
   
   If you have MySQL client installed locally and command line access:
   ```bash
   mysql -h your_host -u your_username -p your_database_name < backend/src/database/schema.sql
   ```
   After pressing Enter, MySQL will prompt you to enter your password.
   
   **Note:** Make sure you're in the project root directory when running this command, or use the full path to the schema.sql file.
   
   After running the schema, update the database configuration in `backend/.env` with your database credentials.

3. **Configure environment variables:**
   
   Create a `backend/.env` file (you can use `backend/env.example` as a template):
   ```env
   PORT=5000
   DB_HOST=localhost                    # Use your database host (localhost for local, or remote host for live)
   DB_USER=your_username                # Your MySQL username
   DB_PASSWORD=your_password            # Your MySQL password
   DB_NAME=todo_db                      # Your database name (or the name you created)
   NODE_ENV=development
   ```
   
   **Note:** For live/remote databases, use your hosting provider's database credentials. The `.env` file is already in `.gitignore` to keep your credentials secure.

### Running the Application

**Option 1: Run both frontend and backend together (recommended):**
```bash
npm run dev
```

**Option 2: Run separately:**

Terminal 1 - Backend:
```bash
npm run dev:backend
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/

## Available Scripts

### Root Level
- `npm run dev` - Run both frontend and backend in development mode
- `npm run dev:frontend` - Run only frontend
- `npm run dev:backend` - Run only backend
- `npm run build` - Build both frontend and backend for production
- `npm run install:all` - Install dependencies for all projects

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start server with nodemon (auto-reload)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

## Development

The project structure follows best practices with separation of concerns:

- **Frontend**: Component-based architecture with services for API calls
- **Backend**: MVC-like structure with controllers, services, and models
- **TypeScript**: Full type safety across the stack
- **Environment Variables**: Secure configuration management

## Next Steps

1. Implement database queries in backend services
2. Connect frontend components to API
3. Add form validation using React Hook Form
4. Style components with Tailwind CSS

## License

MIT

