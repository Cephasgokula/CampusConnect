# Campus Event Management System (CEMS)

Full-stack Campus Event Management System built with 2024 MERN stack and shadcn/ui.

## Tech Stack
- Backend: Node.js 20, Express 4, MongoDB 7, Mongoose 8, JWT, bcryptjs, Nodemailer, Multer, Cloudinary
- Frontend: React 18, Vite 5, TypeScript, Tailwind CSS, shadcn/ui, React Router 6, Axios, Formik + Yup

## Project Structure
- `backend` - REST API and business logic
- `frontend` - React client app

## Setup
1. Install dependencies:
```bash
npm --prefix backend install
npm --prefix frontend install
```
2. Create env files:
- `backend/.env` from `backend/.env.example`
- `frontend/.env` from `frontend/.env.example`
3. Run apps:
```bash
npm run dev:backend
npm run dev:frontend
```

Backend: `http://localhost:5000`  
Frontend: `http://localhost:5173`

## Environment
- Backend variables: `backend/.env.example`
- Frontend variables: `frontend/.env.example`

## API Base
- Health: `GET /api/health`
- Auth: `/api/auth/*`
- Events: `/api/events/*`
- Registrations: `/api/registrations/*`
- Public signup always creates `student` role.
- Admin role is seeded or assigned via admin-only promotion endpoint (`PUT /api/auth/promote/:userId`).

## Default Accounts (Seed)
Run:
```bash
npm run seed
```
Seeded admin credentials:
- Email: `admin@cems.local`
- Password: `Admin@123`

Important: rotate/remove default credentials in production.

## Deployment
- Backend: Render (root: `backend`)
- Frontend: Vercel (root: `frontend`)
- Set backend CORS `CLIENT_URL` to deployed frontend URL.

## Production Security Notes
1. Change `DEFAULT_ADMIN_PASSWORD` and remove default credentials.
2. Rotate `JWT_SECRET`.
3. Restrict CORS to production frontend domain only.
