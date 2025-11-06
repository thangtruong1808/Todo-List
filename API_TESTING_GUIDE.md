# API Testing Guide with Postman

## Base URL
```
http://localhost:5000/api/tasks
```

## API Endpoints

### 1. GET All Tasks
**Endpoint:** `GET http://localhost:5000/api/tasks`

**Description:** Retrieve all tasks from the database.

**Request:**
- Method: `GET`
- URL: `http://localhost:5000/api/tasks`
- Headers: None required

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Implement Authentication System",
    "description": "Design and implement user authentication using JWT and OAuth2.",
    "status": "Pending",
    "taskcode": "A0001",
    "due_date": "2025-11-30T15:00:00.000Z",
    "created_at": "2025-11-06T10:00:00.000Z",
    "updated_at": "2025-11-06T10:00:00.000Z"
  },
  ...
]
```

---

### 2. GET Task by ID
**Endpoint:** `GET http://localhost:5000/api/tasks/:id`

**Description:** Retrieve a specific task by its ID.

**Request:**
- Method: `GET`
- URL: `http://localhost:5000/api/tasks/1`
- Headers: None required

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Implement Authentication System",
  "description": "Design and implement user authentication using JWT and OAuth2.",
  "status": "Pending",
  "taskcode": "A0001",
  "due_date": "2025-11-30T15:00:00.000Z",
  "created_at": "2025-11-06T10:00:00.000Z",
  "updated_at": "2025-11-06T10:00:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid task ID"
}
```

---

### 3. CREATE New Task
**Endpoint:** `POST http://localhost:5000/api/tasks`

**Description:** Create a new task.

**Request:**
- Method: `POST`
- URL: `http://localhost:5000/api/tasks`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (raw JSON):
```json
{
  "title": "Test Task",
  "description": "This is a test task description",
  "status": "Pending",
  "taskcode": "T0001",
  "due_date": "2025-12-31T23:59:59"
}
```

**Required Fields:**
- `title` (string, max 100 characters)
- `taskcode` (string, exactly 5 alphanumeric characters)
- `due_date` (string, datetime format: "YYYY-MM-DDTHH:mm:ss")

**Optional Fields:**
- `description` (string, text)
- `status` (enum: "Pending", "In Progress", "Completed", "Archived", "Overdue")
  - Default: "Pending"

**Response (201 Created):**
```json
{
  "id": 41,
  "title": "Test Task",
  "description": "This is a test task description",
  "status": "Pending",
  "taskcode": "T0001",
  "due_date": "2025-12-31T23:59:59.000Z",
  "created_at": "2025-11-06T12:00:00.000Z",
  "updated_at": "2025-11-06T12:00:00.000Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Title and taskcode are required"
}
```

```json
{
  "error": "Taskcode must be exactly 5 characters"
}
```

```json
{
  "error": "Taskcode already exists"
}
```

---

### 4. UPDATE Task
**Endpoint:** `PUT http://localhost:5000/api/tasks/:id`

**Description:** Update an existing task.

**Request:**
- Method: `PUT`
- URL: `http://localhost:5000/api/tasks/1`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (raw JSON) - All fields are optional, only include fields you want to update:
```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "status": "In Progress",
  "taskcode": "A0001",
  "due_date": "2025-12-25T10:00:00"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Updated Task Title",
  "description": "Updated description",
  "status": "In Progress",
  "taskcode": "A0001",
  "due_date": "2025-12-25T10:00:00.000Z",
  "created_at": "2025-11-06T10:00:00.000Z",
  "updated_at": "2025-11-06T12:30:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Taskcode must be exactly 5 characters"
}
```

```json
{
  "error": "Taskcode already exists"
}
```

---

### 5. DELETE Task
**Endpoint:** `DELETE http://localhost:5000/api/tasks/:id`

**Description:** Delete a task by its ID.

**Request:**
- Method: `DELETE`
- URL: `http://localhost:5000/api/tasks/1`
- Headers: None required

**Response (200 OK):**
```json
{
  "message": "Task deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid task ID"
}
```

---

## Postman Setup Instructions

### Step 1: Create a New Collection
1. Open Postman
2. Click "New" → "Collection"
3. Name it "Todo List API"

### Step 2: Create Requests

#### Request 1: GET All Tasks
1. Click "Add Request" in your collection
2. Name: "Get All Tasks"
3. Method: `GET`
4. URL: `http://localhost:5000/api/tasks`
5. Click "Send"

#### Request 2: GET Task by ID
1. Add Request
2. Name: "Get Task by ID"
3. Method: `GET`
4. URL: `http://localhost:5000/api/tasks/1` (replace 1 with actual task ID)
5. Click "Send"

#### Request 3: CREATE Task
1. Add Request
2. Name: "Create Task"
3. Method: `POST`
4. URL: `http://localhost:5000/api/tasks`
5. Go to "Headers" tab:
   - Key: `Content-Type`
   - Value: `application/json`
6. Go to "Body" tab:
   - Select "raw"
   - Select "JSON" from dropdown
   - Paste the JSON body:
   ```json
   {
     "title": "Test Task from Postman",
     "description": "Testing API with Postman",
     "status": "Pending",
     "taskcode": "P0001",
     "due_date": "2025-12-31T23:59:59"
   }
   ```
7. Click "Send"

#### Request 4: UPDATE Task
1. Add Request
2. Name: "Update Task"
3. Method: `PUT`
4. URL: `http://localhost:5000/api/tasks/1` (replace 1 with actual task ID)
5. Go to "Headers" tab:
   - Key: `Content-Type`
   - Value: `application/json`
6. Go to "Body" tab:
   - Select "raw"
   - Select "JSON" from dropdown
   - Paste the JSON body:
   ```json
   {
     "status": "In Progress",
     "title": "Updated Title"
   }
   ```
7. Click "Send"

#### Request 5: DELETE Task
1. Add Request
2. Name: "Delete Task"
3. Method: `DELETE`
4. URL: `http://localhost:5000/api/tasks/1` (replace 1 with actual task ID)
5. Click "Send"

---

## Status Values
Valid status values:
- `"Pending"`
- `"In Progress"`
- `"Completed"`
- `"Archived"`
- `"Overdue"`

---

## Date Format
Use ISO 8601 format for dates:
```
YYYY-MM-DDTHH:mm:ss
```

Example: `"2025-12-31T23:59:59"`

---

## Common Error Responses

### 400 Bad Request
- Missing required fields
- Invalid taskcode length (must be exactly 5 characters)
- Duplicate taskcode

### 404 Not Found
- Task ID doesn't exist

### 500 Internal Server Error
- Database connection issues
- Server errors

---

## Testing Tips

1. **Test GET All Tasks first** to see existing tasks and get valid IDs
2. **Use unique taskcodes** when creating tasks (e.g., "T0001", "T0002", etc.)
3. **Test error cases**:
   - Create task without required fields
   - Create task with invalid taskcode length
   - Create task with duplicate taskcode
   - Update/Delete non-existent task ID
4. **Check response status codes**:
   - 200: Success (GET, PUT, DELETE)
   - 201: Created (POST)
   - 400: Bad Request
   - 404: Not Found
   - 500: Internal Server Error

---

## Quick Test Sequence

1. **GET All Tasks** → Verify server is running
2. **CREATE Task** → Create a new test task
3. **GET Task by ID** → Retrieve the created task (use ID from step 2)
4. **UPDATE Task** → Update the task (use ID from step 2)
5. **GET All Tasks** → Verify the update
6. **DELETE Task** → Delete the test task (use ID from step 2)
7. **GET All Tasks** → Verify deletion

---

## Notes

- Make sure your backend server is running on port 5000
- The API uses CORS, so it accepts requests from any origin
- All date fields are stored in UTC and returned in ISO 8601 format
- Taskcode must be unique and exactly 5 alphanumeric characters

