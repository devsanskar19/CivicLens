# CivicLens — MERN Political Fact-Checking & Media Literacy Platform

A beginner-friendly MERN starter project for a student-led digital journalism platform.

## Included features

- Public homepage and content browsing
- Fact-checks with verdicts and evidence/source links
- Satire vs News and media-analysis articles
- Research reports
- Politician profiles
- Public-statement archive
- Admin login (no public registration)
- Protected admin dashboard
- Create, edit, publish/unpublish, and delete content
- MongoDB database with Mongoose
- Responsive React interface

## Technology

- React + Vite: frontend
- React Router: page navigation
- Node.js + Express: backend API
- MongoDB Atlas + Mongoose: database
- bcryptjs: password hashing
- JSON Web Token (JWT): admin authentication

## Requirements

Install these before starting:

1. Node.js LTS (includes npm): https://nodejs.org/
2. Visual Studio Code: https://code.visualstudio.com/
3. A MongoDB Atlas account and database: https://www.mongodb.com/atlas

Check Node.js and npm in VS Code Terminal:

```bash
node -v
npm -v
```

## 1. Extract the ZIP

Extract the `CivicLens` folder somewhere convenient, for example:

`D:\CivicLens`

Open that folder in VS Code.

## 2. Configure the backend

Open `backend/.env.example`, make a copy named `.env`, and fill in:

- `MONGO_URI`: your MongoDB Atlas connection string
- `JWT_SECRET`: a long random secret (do not share it)
- `ADMIN_NAME`: the admin display name
- `ADMIN_EMAIL`: the admin email
- `ADMIN_PASSWORD`: a strong admin password

Example format for MongoDB:

`mongodb+srv://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_CLUSTER.mongodb.net/civiclens?retryWrites=true&w=majority`

Replace the placeholders with your own Atlas details. If your database password contains special characters, URL-encode them.

Do not upload `.env` to GitHub. It is ignored by `.gitignore`.

## 3. Install backend packages

Open a VS Code terminal:

```bash
cd backend
npm install
```

## 4. Create the first admin account

Run this once after setting up `.env`:

```bash
npm run seed:admin
```

This creates or updates the admin account using the credentials in `.env`.
There is deliberately no public admin registration route.

## 5. Start the backend

```bash
npm run dev
```

Backend address: `http://localhost:8000`

Test in your browser:

`http://localhost:8000/api/health`

You should see a JSON success response.

Keep this terminal open.

## 6. Install and start the frontend

Open a SECOND VS Code terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite address shown in the terminal, normally:

`http://localhost:5173`

## 7. Open the admin dashboard

Visit:

`http://localhost:5173/admin/login`

Sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your backend `.env`.

The admin dashboard is available at:

`http://localhost:5173/admin`

Only an authenticated admin can use the content-management API. Hiding admin links in the frontend is not the security mechanism; the backend verifies the JWT and admin role on every protected operation.

## Content workflow

1. Sign in to the admin dashboard.
2. Open **New Content**.
3. Choose a content type: Fact Check, Media Analysis, or Research Report.
4. Enter the headline, summary, body, category and (if applicable) verdict.
5. Add source links. For fact-checks, include the original claim and supporting evidence.
6. Save as Draft or Publish.
7. Published content appears on the public website.

For a politician:
1. Open **Politicians** in the admin dashboard.
2. Add the public representative's name, role, area and profile image URL.
3. Open **Statements** and add a public statement with its platform, original post URL, date and analysis.

## Important project notes

- This is a working starter application, not a legal or journalistic certification.
- Verify claims using primary sources and reliable evidence before publishing.
- Clearly distinguish fact, allegation, opinion and satire.
- Keep records of original URLs, publication dates and evidence.
- Do not publish private personal information.
- Obtain informed consent for surveys and follow your institution's research ethics rules.
- Deleted-post claims must be supported by reliable archived evidence; do not infer deletion from a missing link.
- Add backups, HTTPS, rate limiting, monitoring and production hosting configuration before launching publicly.
- The JWT secret and admin password must remain private.
- Change the default frontend API URL in `frontend/.env` only if your backend runs at a different address.

## Troubleshooting

### MongoDB connection fails
- Confirm the Atlas database user and password.
- In Atlas Network Access, allow your development IP address.
- Check that the connection string uses the correct cluster.
- Ensure your internet connection permits MongoDB Atlas connections.

### `npm` is not recognized
Close and reopen VS Code after installing Node.js. Check `node -v` and `npm -v`.

### Port already in use
Stop the other process using port 8000 or 5173, or change the port in the relevant configuration.

### Admin login fails
- Confirm you created `backend/.env` (not just `.env.example`).
- Run `npm run seed:admin` again after checking the credentials.
- Ensure the backend is running.
- Check the browser developer console and backend terminal for errors.

## Suggested next improvements

- Upload images to Cloudinary rather than relying only on image URLs.
- Add pagination and search.
- Add an editorial review / correction history.
- Add survey collection with consent and anonymization.
- Add rate limiting, audit logs and automated backups.
- Deploy frontend and backend with HTTPS and configure production CORS.
