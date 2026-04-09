# Roommate Finder Project Scope

A simple planning guide for keeping the project realistic, organized, and finishable within the time available.

The goal is to build a **clean, believable roommate-finder CRUD app** that meets the class requirements without turning into something too large to finish.

---

## 1. Core idea

The app should stay focused on one simple purpose:

**Help college students create roommate profiles, browse other students, and manage roommate requests.**

That is enough to make the app feel real while still keeping the implementation manageable.

---

## 2. Recommended app flow

Keep the main user flow simple:

1. A student creates a profile
2. The student adds habits and preferences
3. The student adds or selects a preferred location
4. The student browses other roommate profiles
5. The student sends a roommate request
6. The receiving student accepts or rejects the request
7. The app shows pending requests and accepted matches

This gives the project a clear purpose and an easy demo flow.

---

## 3. What the app should include

The simplest strong version of the app should include:

- a home or landing page
- a page to view all users
- a profile page for one user
- a page to browse roommate candidates
- a page to view pending roommate requests
- a page to view accepted matches

### Main actions

- create a user
- read user data
- update a user
- delete a user
- add or update habits
- add or update location preferences
- browse other users
- send a roommate request
- accept or reject a request
- view current matches

---

## 4. Best MVP scope

If the main goal is to get a passing project with solid functionality, the MVP should focus on these four main areas:

1. **Users**
2. **Habits**
3. **Locations**
4. **Matches**

That covers the main database entities and keeps the project aligned with the original roommate-finder idea.

---

## 5. Best build order

Build the project in this order:

1. finish `users` CRUD
2. build `habits` table and routes
3. build `locations` table and routes
4. build `matches` logic and routes
5. connect the first frontend pages
6. add views, functions, triggers, and indexes
7. clean up styling and final documentation

This keeps dependencies manageable and prevents the project from feeling scattered.

---

## 6. Easy goals that should be finished early

These are the most important goals to knock out first:

- finalize the project scope and keep it small
- finalize the schema and seed data
- complete full `users` CRUD
- complete habits-related CRUD or user-habit logic
- complete locations-related CRUD
- complete match request and status update logic
- add one useful view
- add one function or trigger
- add one transaction
- add indexes and performance notes
- connect simple frontend pages to the API
- test the full app flow end to end

If these are done well, the project should be in a strong position.

---

## 7. Easiest ways to satisfy the database requirements

To keep things practical, the database-specific requirements should be handled in simple, useful ways.

### View

Create a view for browsing roommate profiles, such as:

- `available_roommate_profiles`

This view can combine user information, habits, and location preferences into one easy-to-query structure for the frontend.

### Function or trigger

Pick one simple and useful option, such as:

- a trigger that prevents a user from matching with themselves
- a trigger that updates a timestamp when a match changes
- a function that counts how many habits two users have in common

### Transaction

Use a transaction when creating a full roommate profile, for example:

- insert the user
- insert the user’s habits
- insert the location preference
- commit only if all steps succeed

### Indexes

Create indexes based on real queries the app will use, such as:

- pending requests by receiving user
- sent requests by sending user
- common browse/filter fields
- foreign keys in bridge tables

Then compare query performance with and without the index.

---

## 8. What to avoid

Do **not** let the project grow into something much larger than a CRUD app.

Avoid features like:

- real-time chat
- AI matching
- recommendation engines
- image upload
- maps
- notifications
- email verification
- password reset systems
- anything requiring complicated external services

These features add a lot of work without helping much with the actual assignment.

---

## 9. Keep authentication simple

Do not let login or authentication become the main project.

A simple approach is enough:

- allow profile creation
- optionally allow selecting an active user for testing and demo purposes

If login is added at all, it should stay basic.

---

## 10. Best demo flow

A clean final demo could look like this:

1. open the app
2. show all users
3. create a new roommate profile
4. add habits and location information
5. browse other profiles
6. send a roommate request
7. switch to another user
8. accept the request
9. show the accepted match list
10. briefly show the related SQL features such as the view, trigger, transaction, and index work

That tells a complete story without needing anything overly complicated.

---

## 11. Practical definition of success

The project does **not** need to be overly advanced.

A successful version of this app is:

- simple
- working
- organized
- testable
- aligned with the project proposal
- complete enough to meet the assignment requirements

A smaller app that is finished and clearly demonstrated is much better than a larger app that only half works.

---

## 12. Final rule

Keep the project focused on this:

**A simple roommate request and matching platform for college students.**

If a feature does not directly help that goal, it probably does not belong in the MVP.
