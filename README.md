# DALFAM COMPANY LTD — Pig Breeding & Tourism Management System

A full-stack management system for DALFAM Company Ltd, covering both business divisions:
- **Pig Breeding**: breeding stock, litters/farrowing records, health & vaccination logs
- **Tourism**: travel packages/itineraries and customer bookings

Built with:
- **Frontend**: Vite + React + Tailwind CSS
- **Backend**: Node.js + Express + Sequelize
- **Database**: MySQL

---

## 1. Project Structure

```
dalfam-system/
├── backend/          Node.js + Express + Sequelize API
│   ├── config/       Database config
│   ├── models/       Sequelize models (User, BreedingStock, Litter, HealthRecord, TourismPackage, Booking)
│   ├── controllers/  Business logic
│   ├── routes/       API route definitions
│   ├── middleware/   JWT auth + role-based access control
│   ├── seeders/      Seed script (default admin + sample data)
│   └── server.js     App entry point
└── frontend/         Vite + React + Tailwind SPA (feature-sliced architecture)
    └── src/
        ├── api/          Shared Axios instance (JWT-aware)
        ├── assets/       Static assets (images, icons)
        ├── components/   Shared UI (Modal, StatCard, ProtectedRoute)
        ├── context/      AuthContext (login/register/logout)
        ├── features/     One folder per business module — each holds that module's
        │   ├── auth/          full page component and logic
        │   ├── dashboard/
        │   ├── breedingStock/
        │   ├── litters/
        │   ├── healthRecords/
        │   ├── packages/
        │   ├── bookings/
        │   └── users/         (User Management — admin only)
        ├── layouts/      MainLayout (sidebar + header shell)
        ├── pages/        Thin route-level wrappers, one per route, each just
        │                 re-exporting its matching feature (e.g. pages/Users.jsx
        │                 → features/users/UsersPage.jsx). This is what App.jsx
        │                 routes to — keeps routing decoupled from feature internals.
        ├── utils/        Shared helpers (e.g. formatCurrency, formatDate)
        ├── App.jsx / App.css
        └── main.jsx / index.css
```

**Why this structure:** each `features/<module>/` folder is self-contained (its own page logic, forms, table), while `pages/` stays a stable, thin routing layer. To add a new module, create `features/<newModule>/<Name>Page.jsx`, a one-line re-export in `pages/`, and a route in `App.jsx`.

---

## 2. Prerequisites

- Node.js 18+ and npm
- MySQL 8+ (or MariaDB) running locally or remotely

---

## 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=dalfam_db
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=change_this_to_a_long_random_secret
```

Create the database (Sequelize will create the tables automatically):

```sql
CREATE DATABASE dalfam_db;
```

Run the seed script (creates a default admin + sample records):

```bash
npm run seed
```

This creates:
- **Admin login:** `admin@dalfam.co.tz` / `Admin@12345` (⚠️ change this password after first login)
- Sample breeding stock and tourism packages

Start the API server:

```bash
npm run dev      # with nodemon, auto-restarts
# or
npm start
```

The API runs at `http://localhost:5000/api`. Health check: `GET /api/health`.

---

## 4. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` if your backend runs on a different URL:

```
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173`. Log in with the seeded admin account, or visit `/register` on a brand-new database to create the first admin account yourself.

---

## 5. Roles & Permissions

- **Admin**: full access — create/edit/delete all records, manage staff/admin user accounts.
- **Staff**: can view and create/edit records (breeding stock, litters, health records, packages, bookings) but cannot delete records or manage users.

Registration (`POST /api/auth/register`) is only open to the public when the database has **zero users** (used once, to bootstrap the first admin). After that, only a logged-in admin can create new accounts — via the **User Management** page in the app.

---

## 6. Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register (first user only, or admin) |
| GET | /api/auth/users | List users (admin) |
| GET/POST | /api/breeding-stock | List / create breeding animals |
| PUT/DELETE | /api/breeding-stock/:id | Update / delete (delete = admin only) |
| GET | /api/breeding-stock/stats | Herd summary stats |
| GET/POST | /api/litters | List / create litter records |
| GET/POST | /api/health-records | List / create health & vaccination records |
| GET/POST | /api/packages | List / create tourism packages |
| GET/POST | /api/bookings | List / create bookings |
| GET | /api/bookings/stats | Booking summary stats |

All endpoints except `/api/auth/login` and the first-time `/api/auth/register` require a `Bearer <token>` Authorization header.

---

## 7. Production Notes

- Change `JWT_SECRET` and the default admin password before deploying.
- Set `sequelize.sync({ alter: true })` to proper migrations for production use (currently auto-syncs schema, fine for development).
- Update `CLIENT_URL` in the backend `.env` to your deployed frontend domain for CORS.
- Build the frontend for production with `npm run build` (outputs to `frontend/dist`), and serve it via any static host or behind the same reverse proxy as the API.

---

**DALFAM COMPANY LTD** — *Together for a Greater Tomorrow*
