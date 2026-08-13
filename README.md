# 🚨 DEVRP V2 — Dynamic Emergency Vehicle Route Planner

> A real-time emergency route planning and dispatch platform designed to help emergency vehicles reach critical destinations through optimized routing, live map visualization, SOS dispatch, and nearby emergency-service discovery.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Flask](https://img.shields.io/badge/Flask-Backend-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Mappls](https://img.shields.io/badge/Maps-Mappls-FF3B30)](https://www.mappls.com/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel%20%7C%20Render-success)](https://vercel.com/)

## 🌐 Live Application

**Frontend:**  
https://devrp-v2-dynamic-emergency-vehicle.vercel.app

**Backend API:**  
https://devrp-v2-backend.onrender.com

**Repository:**  
https://github.com/GitWithKomal/DEVRP-V2-Dynamic-Emergency-Vehicle-Route-Planner

---

## 📌 Overview

The **Dynamic Emergency Vehicle Route Planner (DEVRP V2)** is a full-stack web application built for emergency transportation scenarios such as ambulance dispatch, fire response, and police assistance.

The system combines interactive maps, route optimization, emergency dispatch workflows, nearby-service discovery, and a responsive command-center interface into a single application.

The goal is to reduce the complexity of emergency route planning by providing a centralized interface where an operator can:

- Select an emergency vehicle.
- Determine the current location.
- Select a destination.
- Generate an optimized route.
- Initiate an emergency SOS workflow.
- Discover nearby hospitals and emergency services.
- Generate an emergency route to a selected nearby facility.
- Access emergency contacts.
- Switch between light and dark themes.

---

## ✨ Key Features

### 🚑 Emergency Vehicle Selection
Supports emergency response units such as:

- Ambulance
- Fire Truck
- Police

The selected vehicle is used as part of the emergency dispatch workflow.

### 🗺️ Interactive Map & Routing

- Mappls-powered interactive map.
- Current-location support.
- Destination search.
- Location/geocoding services.
- Route generation and visualization.
- Route information and live route overview.
- Emergency routing workflow.

### 🚨 SOS Emergency Dispatch

The SOS workflow provides a dedicated emergency-response interface with:

- Emergency activation confirmation.
- Active emergency state.
- Dispatch status.
- Emergency call workflow.
- Emergency cancellation.
- Visual emergency-mode indicators.

### 🏥 Nearby Emergency Services

Users can discover nearby emergency facilities such as hospitals and other relevant services and initiate routing to a selected facility.

### 📍 Location Services

The application integrates location-related APIs for:

- Geocoding.
- Reverse geocoding.
- Place suggestions.
- Place details.
- Current-location handling.

### 📞 Emergency Contacts

Provides quick access to emergency contact information from the command-center interface.

### 🌙 Theme Support

Responsive light/dark theme switching with UI styling adapted to the active application state.

### 📱 Responsive UI

The command center is designed to work across:

- Desktop
- Tablet
- Mobile

---

## 🏗️ Architecture

```text
                         ┌─────────────────────────┐
                         │       User / Recruiter  │
                         └────────────┬────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────┐
                    │        React + Vite Frontend    │
                    │                                 │
                    │  Command Center                 │
                    │  Vehicle Selection              │
                    │  Map & Route Visualization      │
                    │  SOS Dispatch                   │
                    │  Nearby Services                │
                    │  Emergency Contacts             │
                    └───────────────┬─────────────────┘
                                    │ HTTPS / REST
                                    ▼
                    ┌─────────────────────────────────┐
                    │        Flask REST Backend       │
                    │                                 │
                    │  /api/autosuggest               │
                    │  /api/geocode                   │
                    │  /api/place-details             │
                    │  /api/route                     │
                    │  /api/sos                       │
                    │  /api/location/reverse          │
                    │  /api/nearby-services           │
                    └───────────────┬─────────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Mappls APIs    │
                         │ Geocoding / Routing  │
                         │ Places / Maps        │
                         └──────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

- React 19
- Vite
- JavaScript / JSX
- CSS
- Mappls Maps
- Responsive UI
- Component-based architecture

### Backend

- Python
- Flask
- Flask-CORS
- Requests
- python-dotenv
- Gunicorn for production serving

### APIs & Services

- Mappls Maps
- Mappls routing services
- Mappls geocoding services
- Mappls place/search services
- REST API communication

### Development & Deployment

- Git
- GitHub
- Vercel
- Render
- npm
- Python virtual environments

---

## 🚀 DevOps & CI/CD

The backend is containerized and supported with a lightweight CI/CD workflow to provide consistent builds, automated validation, and reliable deployment.

### Docker

- Created a dedicated `Dockerfile` for the Flask backend using `python:3.13-slim`.
- Used `WORKDIR`, dependency-first `COPY`, and `pip install --no-cache-dir` for a clean and efficient image.
- Used Gunicorn as the production WSGI server.
- Added `.dockerignore` to exclude `.env`, `__pycache__`, `.git`, and unnecessary files from the Docker build context.

### Docker Compose

Docker Compose is used to simplify local container orchestration and provide a reproducible backend environment.

```text
docker-compose.yml
        │
        ▼
Build backend image
        │
        ▼
Create container
        │
        ▼
Expose port 5000
        │
        ▼
Run Flask application with Gunicorn

## 📂 Project Structure

```text
DEVRP-V2/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ai/
│   │   │   ├── emergency/
│   │   │   ├── layout/
│   │   │   ├── map/
│   │   │   ├── route/
│   │   │   ├── system/
│   │   │   └── vehicle/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── docs/
└── README.md
```

---

## ⚙️ Local Development

### Prerequisites

Install:

- Node.js
- npm
- Python 3.x
- Git

### 1. Clone the repository

```bash
git clone https://github.com/GitWithKomal/DEVRP-V2-Dynamic-Emergency-Vehicle-Route-Planner.git
cd DEVRP-V2
```

### 2. Backend setup

```bash
cd backend

python -m venv venv
```

#### Windows

```powershell
.\venv\Scripts\Activate.ps1
```

#### Install dependencies

```bash
pip install -r requirements.txt
```

Create:

```text
backend/.env
```

Add the backend environment variables required by the application and your Mappls API credentials.

Run the Flask server:

```bash
python app.py
```

The backend will normally run on:

```text
http://127.0.0.1:5000
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

Configure:

```env
VITE_API_URL=http://127.0.0.1:5000
VITE_MAPPLS_TOKEN=YOUR_MAPPLS_TOKEN
```

Start the development server:

```bash
npm run dev
```

Open the URL displayed by Vite, usually:

```text
http://localhost:5173
```

---

## 🔐 Environment & Security

Environment variables are intentionally excluded from Git.

The repository ignores:

```text
.env
.env.*
```

Never commit:

- Mappls secrets
- API credentials
- private keys
- production-only environment variables

The frontend uses Vite's `VITE_` convention for values that must be available to browser code.

> **Important:** Anything exposed through a `VITE_` variable is client-side data. Never place a private server secret in a `VITE_` variable.

---

## 🚀 Production Deployment

The application is deployed as a single GitHub repository containing separate frontend and backend applications.

### Frontend — Vercel

The Vercel project uses:

```text
Root Directory: frontend
Framework: Vite
```

Production environment variables include:

```env
VITE_API_URL=https://devrp-v2-backend.onrender.com
VITE_MAPPLS_TOKEN=YOUR_MAPPLS_TOKEN
```

### Backend — Render

The Render service uses:

```text
Root Directory: backend
Build Command:
pip install -r requirements.txt

Start Command:
gunicorn app:app
```

The production backend is available at:

```text
https://devrp-v2-backend.onrender.com
```

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Backend health/home response |
| GET | `/api/autosuggest` | Location/place suggestions |
| GET | `/api/geocode` | Convert location text to coordinates |
| GET | `/api/place-details` | Retrieve place information |
| POST | `/api/route` | Generate route information |
| POST | `/api/sos` | Process emergency SOS workflow |
| POST | `/api/location/reverse` | Reverse-geocode coordinates |
| POST | `/api/nearby-services` | Discover nearby emergency services |

---

## 🧪 Production Testing Checklist

The production application has been tested through the primary emergency workflow:

```text
Open Application
      ↓
Select Emergency Vehicle
      ↓
Current Location
      ↓
Select Destination
      ↓
Generate Fastest Route
      ↓
SOS Emergency Workflow
      ↓
Nearby Emergency Services
      ↓
Select Hospital / Facility
      ↓
Generate Emergency Route
      ↓
Emergency Contacts
      ↓
Theme Toggle
```

The deployed frontend and backend communicate successfully in production.

---

## 🎯 Use Cases

DEVRP can be adapted for scenarios such as:

- Ambulance dispatch
- Fire-response routing
- Police emergency routing
- Hospital emergency navigation
- Roadside emergency coordination
- Emergency control-room dashboards
- Real-time vehicle dispatch systems

---

## 🔮 Future Enhancements

Potential future improvements include:

- Real-time vehicle tracking.
- WebSocket-based live dispatch updates.
- Traffic-aware dynamic rerouting.
- ETA prediction.
- Route history and analytics.
- Dispatcher authentication and role-based access.
- Persistent emergency incidents.
- Multiple emergency vehicles on the same map.
- Admin dashboard.
- Real-time incident monitoring.
- AI-assisted emergency response recommendations.

---

## 🧠 Engineering Highlights

This project demonstrates practical experience with:

- Full-stack application architecture.
- React component architecture.
- REST API development with Flask.
- Third-party API integration.
- Interactive map development.
- Geocoding and routing workflows.
- Emergency-state UI design.
- Responsive frontend development.
- Environment-variable management.
- CORS configuration.
- Git/GitHub workflow.
- Production deployment.
- Vercel frontend deployment.
- Render backend deployment.

---

## 👩‍💻 Author

**Komal Nimje**

Software Engineer specializing in:

**Full Stack Development • AI/GenAI • DevOps**

GitHub:  
https://github.com/GitWithKomal

---

## 📄 License

This project is intended for educational, portfolio, and demonstration purposes.

---

## ⭐ Acknowledgements

- Mappls for mapping, geocoding, routing, and location services.
- React and Vite for the frontend ecosystem.
- Flask for the backend API.
- Vercel for frontend deployment.
- Render for backend deployment.
