# Roommate Finder Workflow

This file is a practical guide for how to move through the project without getting lost in the folders, files, and moving parts. The goal is simple: make changes in a predictable order, test each layer before moving on, and avoid breaking working code.

## 1. Project map

```
roommate-finder/
  client/                 # React + TypeScript frontend
    src/

  server/                 # Express + TypeScript backend
    src/
      routes/             # One route file per resource/table
      db.ts               # PostgreSQL connection
      index.ts            # Main Express app

  database/
    init/
      schema.sql          # Tables
      seed.sql            # Example data
      views.sql           # Views
      functions.sql       # Stored functions/procedures if used
      triggers.sql        # Triggers
      indexes.sql         # Non-primary indexes

  docs/                   # Setup notes, assignment docs, misc docs
  docker-compose.yml      # PostgreSQL container setup
  package.json            # Root scripts
```

## 2. Main rule for building features

When adding or changing a feature, work from the database outward:

- Database structure
- Backend route / SQL query
- API testing
- Frontend UI
- Final end-to-end testing

Do not start with the frontend if the schema and route do not exist yet.

## 3. Recommended build order for this project

Work in this order unless there is a strong reason not to:

- Users
- Habits
- Locations
- Matches
- Any bridge/reference table logic
- Views, functions, triggers, indexes, and performance cleanup
- UI polish and final testing

This keeps dependencies manageable. Matches depend on users and locations, so those should exist first.

## 4. Standard workflow for adding a new resource

Use this same order every time a new table/resource is added.

### Step 1: Update the database files

Add or update the relevant SQL in:

- `database/init/schema.sql`
- `database/init/seed.sql`

Optionally `views.sql`, `functions.sql`, `triggers.sql`, or `indexes.sql`.

Examples:

- New table
- Altered columns
- Foreign keys
- Seed rows
- Indexes for expected queries

### Step 2: Reset or refresh the database if needed

If the schema changed and a clean rebuild is acceptable:

```bash
npm run db:down
npm run db
```

or:

```bash
docker compose down -v
docker compose up -d
```

Important: init SQL files only auto-run when the database volume is first created.

### Step 3: Verify the table/data in PostgreSQL

Before touching the backend, confirm the database actually contains what is expected.

Useful checks:

```bash
docker compose exec db psql -U postgres -d roommate_finder -c "SELECT * FROM users;"
```

Swap `users` for the table being worked on.

### Step 4: Add or update the backend route file

Create or update one route file per resource:

- `server/src/routes/users.ts`
- `server/src/routes/habits.ts`
- `server/src/routes/locations.ts`
- `server/src/routes/matches.ts`

Keep that resource's CRUD routes together in the same file.

### Step 5: Mount the route in `server/src/index.ts`

Example:

```ts
import usersRouter from "./routes/users";
app.use("/users", usersRouter);
```

### Step 6: Test the route before building UI

Use Thunder Client or Postman to test:

- `GET`
- `GET by id`
- `POST`
- `PUT`
- `DELETE`

Do not move on until the route works correctly.

### Step 7: Build the frontend after the API works

Once the route is proven to work:

- Make the page/component
- Call the API
- Render the data
- Add forms/buttons for CRUD actions

### Step 8: Test the whole flow end to end

Confirm that:

- Frontend sends the request
- Backend receives it
- SQL runs correctly
- Database changes are real
- Frontend updates correctly after the change

## 5. Backend workflow rules

### One file per resource

Use one route file per main resource/table. Example:

```
server/src/routes/
  users.ts
  habits.ts
  locations.ts
  matches.ts
```

Do not make a separate file for each `GET`, `POST`, `PUT`, or `DELETE` unless the file becomes too large later.

### Keep SQL safe

Use parameterized queries:

```ts
pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
```

Do not build SQL by concatenating user input directly into strings.

### Return clean data

Do not return fields that should stay private, such as `hashed_password`.

## 6. Frontend workflow rules

### When building a frontend feature, use this order:

- Display existing data first
- Add create form
- Add update form/button
- Add delete action
- Improve styling last

That helps keep functionality ahead of appearance.

### Good frontend pattern

For each major resource, aim for:

- One page or section to list records
- One form to create records
- One way to edit records
- One way to delete records

Keep things simple before trying to polish layout.

## 7. API testing checklist

Before considering a backend feature done, test all of these.

### 1. Read tests

- Can all rows be retrieved?
- Can one row be retrieved by ID?
- Does a missing ID return a proper error?

### 2. Create tests

- Can a valid record be inserted?
- Are required fields enforced?
- Are unique constraints working?

### 3. Update tests

- Can an existing record be updated?
- Does a missing ID fail correctly?
- Are invalid values rejected?

### 4. Delete tests

- Can an existing record be deleted?
- Does deleting a missing record fail correctly?

### Data checks

After POST, PUT, or DELETE, confirm the result in PostgreSQL or by re-running a GET route.

## 8. How to test during development

### Start the database

```bash
docker compose up -d
```

### Start the backend

```bash
cd server
npm run dev
```

### Start the frontend

```bash
cd client
npm run dev
```

### Test backend in browser

Quick checks:

- `http://localhost:5000`
- `http://localhost:5000/users`

### Test API routes with Thunder Client

Use Thunder Client for:

- POST
- PUT
- DELETE
- More detailed GET testing

### Test database directly when needed

Use DBBeaver or `psql` commands inside Docker to verify table contents.

## 9. Suggested team workflow for changes

Use a simple pattern:

- Pull latest changes
- Start Docker and app
- Create a branch for the change
- Make the change in the correct order
- Test it locally
- Commit with a clear message
- Push branch
- Merge only after it is working

### Good commit message examples

- `Add users CRUD routes`
- `Create locations table and seed data`
- `Connect users page to API`
- `Add match status update route`

Avoid vague commits like:

- `stuff`
- `fixes`
- `changes`

## 10. Common mistake checklist

Before spending a long time debugging, check these first.

### Database problems

- Docker Desktop is not running
- Container is not started
- `.env` values do not match the DB container
- Schema changed but DB volume was not rebuilt
- Seed file did not rerun after changes

### Backend problems

- Route file exists but is not mounted in `index.ts`
- Wrong endpoint path is being tested
- Bad JSON body sent in POST/PUT
- Route returns sensitive fields by mistake
- SQL column names do not match schema names

### Frontend problems

- Frontend calling wrong port or URL
- Backend not running
- Trying to use a route that has not been built yet
- Assuming DB data exists when seed file did not run

## 11. Practical definition of done

A feature is not done just because the code compiles.

A feature is done when:

- Schema supports it
- Seed data exists if needed
- Backend route works
- Route has been tested
- Frontend can use it if applicable
- Result is visible in the DB or the UI

## 12. Short version to remember

For any new feature:

Schema -> Seed -> Route -> Test API -> Build UI -> Test everything

If something breaks, debug in the reverse direction:

UI -> Route -> SQL -> Database

## 13. Current recommended priorities

At the current stage of the project, the most useful order is:

- Finish `users` CRUD
- Build `habits` table + routes
- Build `locations` table + routes
- Build `matches` logic + routes
- Connect the first frontend pages
- Add views/functions/triggers/indexes
- Clean up styling and final documentation

## 14. Final note

Keep the project boring, predictable, and testable.

A simple working CRUD app with a clean folder structure, tested routes, and a clear database design is much better than a complicated app that is hard to debug.