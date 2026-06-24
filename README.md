# DevNotes 📝

A full-stack Notes application built with the MERN stack and Tailwind CSS, containerized with Docker and deployed via an automated Jenkins CI/CD pipeline on AWS EC2.

---

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Axios, React Router DOM

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt

**DevOps:** Docker, Docker Compose, Jenkins, AWS EC2, Docker Hub, Nginx

---

## Features

- User authentication (Register / Login) with JWT
- Create, read, update, delete notes
- Tag-based organization
- Real-time search and tag filtering
- Fully containerized with Docker
- Automated CI/CD pipeline with Jenkins
- Auto-deploy to AWS EC2 on every `git push`
- Health check and rollback on failed deployments

---

## Project Structure

```
devnotes/
├── backend/
│   ├── src/
│   │   ├── config/         # MongoDB connection
│   │   ├── controllers/    # Auth + Note logic
│   │   ├── middleware/     # JWT auth middleware
│   │   ├── models/         # User + Note schemas
│   │   ├── routes/         # API routes
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── components/     # Navbar, NoteCard, NoteForm
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Login, Register, Dashboard
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml        # Local development
├── docker-compose.prod.yml   # Production (EC2)
├── Jenkinsfile               # CI/CD pipeline
└── README.md
```

---

## Local Development Setup

### Prerequisites

- Node.js v20+
- MongoDB running locally
- Docker + Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/Poorviraj/DevNotes---docker-jenkins-Project
cd DevNotes---docker-jenkins-Project
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/devnotes
JWT_SECRET=your_jwt_secret_here
```

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Run with Docker Compose (recommended)

```bash
docker compose up --build
```

Visit `http://localhost:3000`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Notes (Protected — requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes (supports `?search=` and `?tag=`) |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check (used by Jenkins) |

---

## CI/CD Pipeline

The Jenkins pipeline runs automatically on every push to `main`:

```
Checkout → Build Backend Image → Build Frontend Image
→ Push to Docker Hub → Deploy to App Server → Health Check
```

If the health check fails, the pipeline automatically rolls back to the previous deployment.

### Infrastructure

| Server | Purpose | Type |
|--------|---------|------|
| Jenkins EC2 | Runs pipeline, builds images | t2.medium |
| App EC2 | Runs the application containers | t2.micro |

### Pipeline Flow

1. Jenkins pulls latest code from GitHub
2. Builds backend Docker image, tags with build number + `latest`
3. Builds frontend Docker image with `VITE_API_URL` baked in
4. Pushes both images to Docker Hub
5. SSHes into App server, pulls new images, restarts containers
6. Hits `/api/health` endpoint — if `200`, deployment is successful

---

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT signing |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (baked in at build time) |

---

## Docker Images

- `poorviraj/devnotes-backend`
- `poorviraj/devnotes-frontend`

---

## Author

**Poorviraj** — [GitHub](https://github.com/Poorviraj)
