# Darpan - Road Telemetry IoT System

A Java-based IoT signal processing and telemetry system.

## Project Structure
- `simulator/`: Java Console Application to simulate sensor data (GPS, Speed, Vibration).
- `backend/`: Java Spring Boot Service for data ingestion and API.
- `frontend/`: React (Vite) Dashboard for visualization.

## Prerequisites
- Java 17+
- Node.js & npm
- PostgreSQL
- Maven

## Getting Started
### Simulator
```bash
cd simulator
javac Main.java
java Main
```

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
