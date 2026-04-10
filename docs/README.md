# Roommate Finder

A basic CRUD web application for helping college students find compatible roommates.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express + TypeScript
- **Database**: PostgreSQL (running in Docker)
- **API Testing**: Thunder Client or Postman
- **Database Viewer**: DBeaver (recommended)

## Project Structure

```
roommate-finder/
  client/
  server/
  database/
    init/
  docs/
  docker-compose.yml
  package.json
```

- `client/` contains the React frontend.
- `server/` contains the Express backend.
- `database/init/` contains the SQL files used to initialize the database.
- `docker-compose.yml` starts the PostgreSQL container.

## Required Downloads

Install these before running the project:

- Git
- VS Code
- Node.js LTS
- Docker Desktop

### Recommended VS Code Extensions

Install these extensions in VS Code:

- Thunder Client
- ESLint
- Prettier
- Docker
- SQLTools

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd roommate-finder
code .
```

### 2. Install dependencies

From the project root:

```bash
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
cd ..
```

Install backend dependencies:

```bash
cd server
npm install
npm install -D typescript ts-node-dev @types/node @types/express @types/cors @types/bcrypt @types/pg
cd ..
```

### 3. Create the backend environment file

Create a file at:

```
server/.env
```

Add this content:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=roommate_finder
DB_USER=postgres
DB_PASSWORD=postgres
```

## Starting Docker and PostgreSQL

### 4. Open Docker Desktop

Open Docker Desktop and wait until Docker is fully running.

### 5. Start the PostgreSQL container

From the project root:

```bash
docker compose up -d
```

To confirm the container is running:

```bash
docker ps
```

## Running the Application

### Option A: Start everything from the root

If the root `package.json` includes the combined dev script:

```bash
npm run dev
```

### Option B: Start frontend and backend separately

Backend:

```bash
cd server
npm run dev
```

Frontend in another terminal:

```bash
cd client
npm run dev
```

## Verifying the Backend

Open the following in a browser:

```
http://localhost:5000
```

A JSON response should appear showing that the API is running and connected to the database.

Then test:

```
http://localhost:5000/users
```

This should return the seeded users as JSON.

## Testing API Routes

Use **Thunder Client** in VS Code or Postman.

### Test `GET /users`

- **Method**: `GET`
- **URL**:

```
http://localhost:5000/users
```

### Test `POST /users`

- **Method**: `POST`
- **URL**:

```
http://localhost:5000/users
```

- **Body type**: `JSON`
- **Request body**:

```json
{
  "username": "bwilson",
  "password": "test123",
  "email": "bwilson@example.com",
  "phone_number": "555-777-8888",
  "real_name": "Brian Wilson",
  "grad_year": 2027,
  "is_oncampus": true,
  "gender": "Male",
  "major": "Finance",
  "home_state": "PA"
}
```

After sending the request, test `GET /users` again to confirm the row was inserted.

## Connecting to the Database in DBeaver

Use these connection settings:

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `roommate_finder`
- **Username**: `postgres`
- **Password**: `postgres`

## Important Note About SQL Init Files

The SQL files in `database/init/` only run automatically the first time the Postgres volume is created.

If the schema or seed files change and a fresh rebuild is needed, run:

```bash
docker compose down -v
docker compose up -d
```

This removes the database volume and recreates the database from the SQL files.

## Stopping the Project

To stop the frontend or backend running in a terminal:

```text
Ctrl + C
```

To stop the Docker database container:

```bash
docker compose down
```

To stop Docker and also wipe the database volume:

```bash
docker compose down -v
```

## Files That Should Not Be Committed

Do not commit:

- `.env`
- `node_modules`
- build folders
- temporary local files

## Helpful Commands

### Start database only:

```bash
docker compose up -d
```

### Stop database only:

```bash
docker compose down
```

### Reset database completely:

```bash
docker compose down -v
docker compose up -d
```

### Run backend only:

```bash
cd server
npm run dev
```

### Run frontend only:

```bash
cd client
npm run dev
```

### Run full app from root:

```bash
npm run dev
```