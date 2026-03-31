# Campus Pulse — Campus Event Management System

Full-stack Campus Event Management System with an editorial-grade UI.

## Tech Stack
- **Backend:** Java 17, Spring Boot 3, Spring Security, MongoDB, JWT, Cloudinary, Mailtrap SMTP
- **Frontend:** React 18, Vite 5, TypeScript, Tailwind CSS, React Router 6, Axios, Formik + Yup, Lucide Icons

## Project Structure
- `backend-spring` — Spring Boot REST API
- `frontend` — React client app

## Setup

### 1. Backend

#### Create `application.properties`

Create the file at `backend-spring/src/main/resources/application.properties` with the following content and fill in your own values:

```properties
# Server
server.port=5000

# MongoDB
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?appName=<appName>

# JWT
app.jwt.secret=<your-base64-encoded-secret>
app.jwt.expiration-ms=604800000

# Cloudinary
app.cloudinary.cloud-name=<your-cloud-name>
app.cloudinary.api-key=<your-api-key>
app.cloudinary.api-secret=<your-api-secret>

# SMTP (e.g. Mailtrap for dev)
spring.mail.host=sandbox.smtp.mailtrap.io
spring.mail.port=2525
spring.mail.username=<your-smtp-username>
spring.mail.password=<your-smtp-password>
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# File upload limits
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB

# CORS
app.client-url=http://localhost:5173

# Seed admin account
app.seed.admin-email=admin@cems.local
app.seed.admin-password=Admin@123

# Jackson
spring.jackson.serialization.write-dates-as-timestamps=false
```

> **Note:** Never commit real credentials. The `application.properties` file should be in `.gitignore`.

#### Run the backend

```bash
cd backend-spring
./mvnw spring-boot:run
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Optionally create `frontend/.env` to override the API URL:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### URLs
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## API Base
- Health: `GET /api/health`
- Auth: `/api/auth/*`
- Events: `/api/events/*`
- Registrations: `/api/registrations/*`
- Public signup always creates `student` role.
- Admin role is seeded or assigned via admin-only promotion endpoint (`PUT /api/auth/promote/:userId`).

## Default Accounts (Seed)

The backend automatically seeds a default admin account and **21 sample events** on first startup (when no admin user exists). Uses values from `application.properties`:

- **Admin Email:** `admin@cems.local`
- **Admin Password:** `Admin@123`

### Seed Events (21 total)

| # | Event | Category | Capacity |
|---|-------|----------|----------|
| 1 | Yoga & Mindfulness Morning | Sports | 100 |
| 2 | Quantum Computing 101 | Technical | 60 |
| 3 | AI Hackathon Sprint | Technical | 150 |
| 4 | Global Fusion Fest | Cultural | 400 |
| 5 | Open Source Contribution Workshop | Workshop | 100 |
| 6 | Inter-College Basketball Finals | Sports | 500 |
| 7 | Cybersecurity Awareness Bootcamp | Technical | 180 |
| 8 | Startup Pitch Night | Seminar | 120 |
| 9 | Cloud Computing Fundamentals | Seminar | 220 |
| 10 | Future Tech Symposium | Seminar | 250 |
| 11 | UI/UX Design Jam | Workshop | 90 |
| 12 | Acoustic Sunset Sessions | Cultural | 150 |
| 13 | Leadership Seminar 2026 | Seminar | 200 |
| 14 | Data Science Masterclass | Workshop | 80 |
| 15 | Annual Sports Fest | Sports | 500 |
| 16 | Sustainable Design Hackathon | Technical | 200 |
| 17 | Photography Walk & Exhibition | Cultural | 50 |
| 18 | Blockchain & Web3 Workshop | Workshop | 70 |
| 19 | Code Challenge: Algorithms Arena | Technical | 120 |
| 20 | Contemporary Art Workshop | Cultural | 40 |

All seed events include banner images (via picsum.photos), realistic registered counts, end dates, registration deadlines, and descriptive tags.

To re-seed, drop the `users` and `events` collections in MongoDB and restart the backend.

> **Important:** Rotate or remove default credentials in production.

## Deployment
- **Backend:** Any Java 17+ host (Render, Railway, AWS, etc.) — root: `backend-spring`
- **Frontend:** Vercel or Netlify — root: `frontend`
- Set `app.client-url` in backend properties to the deployed frontend URL for CORS.

## Production Security Notes
1. Change `app.seed.admin-password` and remove default credentials.
2. Use a strong, unique `app.jwt.secret`.
3. Restrict CORS to production frontend domain only.
4. Ensure `application.properties` is never committed to version control.
