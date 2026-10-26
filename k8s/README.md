# DevTrack — Kubernetes Deployment Guide

This directory contains the production-ready Kubernetes manifests for deploying the DevTrack full-stack application (PostgreSQL + Express/Prisma Backend + React/Vite/Nginx Frontend).

---

## 1. Directory Structure

```text
k8s/
├── 01-secrets.yaml       # Database credentials & JWT secret
├── 02-configmap.yaml     # Application configuration & ports
├── 03-postgres.yaml      # PersistentVolumeClaim, Deployment & ClusterIP Service
├── 04-backend.yaml       # Backend API Deployment & ClusterIP Service
├── 05-frontend.yaml      # Frontend Deployment & NodePort Service (Port 30080)
├── 06-ingress.yaml       # Ingress rules (for Ingress-Nginx or Cloud LoadBalancers)
├── kustomization.yaml    # Kustomize bundle
└── README.md             # This guide
```

---

## 2. Prerequisites (100% Free)

You only need **Docker Desktop** installed on Windows:
1. Open **Docker Desktop**.
2. Click the **Gear / Settings** icon in the top right.
3. Select **Kubernetes** from the left sidebar.
4. Check **"Enable Kubernetes"** and click **"Apply & restart"**.
5. Wait until the Kubernetes status icon in the bottom left turns green.

Verify your setup in your terminal:
```bash
docker --version
kubectl version --client
kubectl cluster-info
```

---

## 3. Step-by-Step Deployment

### Step 3.1: Build the Local Docker Images
Before deploying, build the backend and frontend images into your local Docker daemon so Kubernetes can find them:

```bash
# In the root repository directory (d:\DevTrack)
docker build -t devtrack-backend:latest ./backend
docker build -t devtrack-frontend:latest ./frontend
```

---

### Step 3.2: Apply the Kubernetes Manifests
Deploy all services with a single command:

```bash
kubectl apply -f k8s/
```
*(Or alternatively: `kubectl apply -k k8s/`)*

---

### Step 3.3: Verify Pods and Services
Watch the pods starting:

```bash
kubectl get pods -w
```

You should see 3 pods running:
- `postgres-...` (`1/1 Running`)
- `backend-...` (`1/1 Running`)
- `frontend-...` (`1/1 Running`)

Check the services:
```bash
kubectl get svc
```

---

### Step 3.4: Access DevTrack in your Browser

* **Frontend UI**: Open [http://localhost:30080](http://localhost:30080) in your web browser (via NodePort).
* **Direct Backend API Port-Forward (optional)**:
  ```bash
  kubectl port-forward svc/backend 5000:5000
  ```
  Then visit [http://localhost:5000/api/health](http://localhost:5000/api/health).

---

## 4. Useful Debugging Commands

* **Check pod logs**:
  ```bash
  kubectl logs -l app=backend --tail=100 -f
  kubectl logs -l app=postgres --tail=100
  kubectl logs -l app=frontend --tail=100
  ```
* **Describe a pod** (if a pod is in `CrashLoopBackOff` or `Pending`):
  ```bash
  kubectl describe pod <pod-name>
  ```
* **Run migrations manually** (if needed):
  ```bash
  kubectl exec -it deployment/backend -- npx prisma db push
  ```

---

## 5. Teardown / Cleanup

To delete all resources when you are finished:

```bash
kubectl delete -f k8s/
```
*(Note: If you wish to also delete the persistent database storage, run `kubectl delete pvc postgres-pvc`)*
