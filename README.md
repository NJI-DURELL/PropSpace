# PropSpace — Property Listing App

A full-stack web app for listing, browsing, and managing properties for rent or sale in Cameroon. Built with React, Node/Express, and MongoDB.

---

## What it does

- Anyone can browse all property listings and filter by city or price range — no account needed
- Registered users can create, edit, and delete their own listings
- Each user has a dashboard showing only their properties
- Profile page lets you update your name, phone, and avatar, or change your password
- JWT handles authentication — tokens are stored client-side and attached automatically to every request

---

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6, Tailwind CSS, Axios |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Build tool | Vite |

---

## Project structure

```
final-js-exam/
├── backend/
│   └── src/
│       ├── config/         # MongoDB connection
│       ├── models/         # Mongoose schemas (User, Property)
│       ├── repositories/   # All direct DB queries live here
│       ├── controllers/    # Business logic (auth, users, properties)
│       ├── middleware/      # JWT verification
│       └── routes/         # Express route definitions
└── frontend/
    └── src/
        ├── api/            # Axios instance with request interceptor
        ├── context/        # Auth state (AuthContext)
        ├── components/     # PropertyCard, FilterSidebar, InputField, Navbar
        ├── pages/          # All page-level components
        └── routes/         # ProtectedRoute guard
```

The backend follows a 3-layer pattern: routes delegate to controllers, controllers handle validation and logic, repositories talk to the database. Nothing skips a layer.

---

## Getting started

### Prerequisites

- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd final-js-exam
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your values:

```
MONGO_URI=mongodb://localhost:27017/propspace
JWT_SECRET=pick_any_long_random_string
PORT=5000
```

Then install and start:

```bash
npm install
npm run dev
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`. The Vite dev server proxies all `/api` requests to the backend on port 5000, so no CORS headaches during development.

---

## API endpoints

### Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login, returns JWT |

### Users
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/users/profile` | Protected | Get own profile |
| PUT | `/api/users/profile` | Protected | Update name/phone/avatar |
| PUT | `/api/users/password` | Protected | Change password (requires old password) |

### Properties
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/properties` | Public | Get all listings (supports `?city=&minPrice=&maxPrice=`) |
| GET | `/api/properties/mine` | Protected | Get only your listings |
| GET | `/api/properties/:id` | Public | Get single listing |
| POST | `/api/properties` | Protected | Create a listing |
| PUT | `/api/properties/:id` | Protected (owner only) | Update a listing |
| DELETE | `/api/properties/:id` | Protected (owner only) | Delete a listing |

Non-owners trying to edit or delete someone else's property get a `403 Forbidden` — enforced at the server level, not just hidden on the frontend.

---

## Data models

### User
```js
{
  username: String (unique),
  email: String (unique),
  password: String (hashed with bcrypt, salt rounds: 10),
  name: String,
  phone: String,
  avatar: String (URL)
}
```

### Property
```js
{
  title: String,
  description: String,
  price: Number,        // in XAF
  city: String,
  country: String,
  type: 'Apartment' | 'House' | 'Studio',
  images: [String],    // array of image URLs
  owner: ObjectId      // ref → User
}
```

---

## Frontend pages

| Route | Page | Auth required |
|-------|------|---------------|
| `/` | Home — public property feed with filters | No |
| `/register` | Registration form | No |
| `/login` | Login form | No |
| `/properties/:id` | Property detail view | No |
| `/dashboard` | My Listings | Yes |
| `/create` | Add new property | Yes |
| `/edit/:id` | Edit a property | Yes |
| `/profile` | Profile & password settings | Yes |

Unauthenticated users hitting a protected route are redirected to `/login` automatically.

---

## A few implementation notes

**Password hashing** happens in a Mongoose `pre('save')` hook on the User model — the plain text password never touches the database.

**Token attachment** is handled by a single Axios request interceptor in `src/api/axios.js`. Every outgoing request gets the `Authorization: Bearer <token>` header without any component having to think about it.

**Memory cleanup** — every `useEffect` that fires a network request uses a `cancelled` flag and returns a cleanup function, so components that unmount before a request finishes don't try to update state on an unmounted component.

**Ownership checks** happen on the backend before any database write. The frontend hides edit/delete buttons from non-owners as a UX decision, but the API enforces it regardless of what the client sends.

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing tokens — keep this private |
| `PORT` | Port for the Express server (default: 5000) |

The `.env` file is gitignored. Never commit it. Use `.env.example` as a reference.
