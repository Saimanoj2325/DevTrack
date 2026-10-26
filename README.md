# DevTrack — Full-Stack Issue Tracker

**DevTrack** is a lightweight, full-stack issue tracking system built for software development teams. It enables users to create projects, track issues, assign tasks to developers, manage issue states (To Do, In Progress, Done), and view high-level metrics on an interactive dashboard. The repository is pre-configured with Docker Compose and a Jenkins CI/CD automation pipeline.

---

## 1. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, React Router v6, Axios, Tailwind CSS, Lucide Icons, Vitest.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, JWT Authentication, bcryptjs, Zod, Jest, Supertest.
- **Database**: PostgreSQL.
- **DevOps**: Docker, Docker Compose, Kubernetes, Jenkinsfile Pipeline.

---

## 2. Folder Structure

```text
devtrack/
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, StatCard, Modal, IssueBadge)
│   │   ├── context/          # React AuthContext state provider
│   │   ├── pages/            # Application views (Login, Register, Dashboard, Projects, ProjectDetail, IssueDetail)
│   │   ├── services/         # Axios API HTTP client configuration
│   │   ├── tests/            # Vitest unit test suite
│   │   ├── types/            # TypeScript interfaces
│   │   ├── App.tsx           # Router configuration
│   │   ├── main.tsx          # Vite React entry point
│   │   └── index.css         # Tailwind & custom CSS styles
│   ├── nginx.conf            # Production Nginx reverse proxy configuration
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route handler controllers (Auth, User, Project, Issue, Health)
│   │   ├── middleware/       # JWT Auth and error handling middlewares
│   │   ├── routes/           # Express REST API endpoints
│   │   ├── tests/            # Jest unit & integration API tests
│   │   ├── utils/            # Prisma instance, JWT, and bcrypt helper utilities
│   │   ├── app.ts            # Express application middleware setup
│   │   └── server.ts         # Backend server entry point
│   ├── prisma/
│   │   └── schema.prisma     # Prisma ORM PostgreSQL models (User, Project, Issue)
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── Dockerfile
│
├── k8s/                      # Kubernetes manifests (Deployments, Services, ConfigMap, Secrets, Ingress)
│   ├── 01-secrets.yaml
│   ├── 02-configmap.yaml
│   ├── 03-postgres.yaml
│   ├── 04-backend.yaml
│   ├── 05-frontend.yaml
│   ├── 06-ingress.yaml
│   ├── kustomization.yaml
│   └── README.md
│
├── docker-compose.yml        # Orchestration for PostgreSQL, Backend, and Frontend containers
├── Jenkinsfile               # Declarative Jenkins CI/CD pipeline
├── .gitignore
└── README.md
```

---

## 3. Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL="postgresql://devtrack:devtrack_password@localhost:5432/devtrack_db?schema=public"
JWT_SECRET="super-secret-jwt-key-devtrack"
PORT=5000
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL="/api"
```

*Note: Environment example templates are provided as `backend/.env.example` and `frontend/.env.example`.*

---

## 4. Local Development

### Prerequisites
- Node.js (v18 or v20)
- PostgreSQL running locally (or via Docker)

### Running Backend Locally
```bash
cd backend
npm install
npx prisma generate
npm run dev
```
Backend server starts on `http://localhost:5000`.

### Running Frontend Locally
```bash
cd frontend
npm install
npm run dev
```
Frontend app starts on `http://localhost:3000`.

---

## 5. Docker Deployment

Launch the complete stack (PostgreSQL + Backend API + Frontend Nginx) using Docker Compose:

```bash
docker compose up --build
```

Access the application in your browser:
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api`
- **Health Endpoint**: `http://localhost:5000/api/health`

To stop and remove containers:
```bash
docker compose down -v
```

---

## 6. Kubernetes Deployment

Production-ready Kubernetes manifests are provided under the `k8s/` directory.

### Prerequisites
- Enable Kubernetes in **Docker Desktop** (Settings $\to$ Kubernetes $\to$ Enable Kubernetes) or start **Minikube**.

### Deploying to Kubernetes
```bash
# 1. Build images locally
docker build -t devtrack-backend:latest ./backend
docker build -t devtrack-frontend:latest ./frontend

# 2. Apply all Kubernetes manifests
kubectl apply -f k8s/

# 3. Verify status
kubectl get pods
kubectl get svc
```

Access the application:
- **Frontend UI (NodePort)**: `http://localhost:30080`
- **Or via Port Forward**:
  ```bash
  kubectl port-forward svc/frontend 3000:80
  ```
  Then visit `http://localhost:3000`.

To teardown the cluster deployment:
```bash
kubectl delete -f k8s/
```

---

## 7. Automated Testing

### Backend Unit & Integration Tests
Runs automated API tests covering `/api/health`, registration, login, and issue creation:
```bash
cd backend
npm test
```

### Frontend Component Tests
Runs Vitest unit tests verifying badge and dashboard component rendering:
```bash
cd frontend
npm test
```

---

## 8. Jenkins CI/CD Pipeline

The repository includes a declarative `Jenkinsfile` that defines a strict CI pipeline with 7 sequential stages:

1. **Checkout**: Pulls latest repository commit.
2. **Install Dependencies**: Runs `npm ci` in both `backend/` and `frontend/`.
3. **Backend Tests**: Executes `npm test` inside `backend/`.
4. **Frontend Tests**: Executes `npm test` inside `frontend/`.
5. **Backend Build**: Compiles TypeScript files (`npm run build`).
6. **Frontend Build**: Builds optimized Vite static assets (`npm run build`).
7. **Docker Build**: Verifies container build with `docker compose build`.

If any test or compilation stage fails, the pipeline immediately halts and flags the build as failed.
