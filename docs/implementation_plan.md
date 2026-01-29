# Darpan (Road Telemetry Software) - Implementation Plan

## Goal Description
Create a software system to collect, process, and visualize road telemetry data for an IoT project. The system will simulate IoT sensors (or connect to real ones), ingest data, store it, and provide a dashboard for real-time monitoring.

## User Review Required
> [!IMPORTANT]
> **Architecture Decisions Needed:**
> 1.  **Data Source**: Do you have physical hardware (Raspberry Pi/ESP32) or should we build a simulator first?
> 2.  **Scale**: Is this for a single device prototype or a scaled deployment?
> 3.  **Visualization**: Do you prefer a web-based dashboard (React/Vue) or a desktop application?

## Proposed Architecture
We will likely follow a standard IoT data pipeline:
`Sensor -> Transport (MQTT/HTTP) -> Broker/API -> Storage -> Backend -> Frontend`

### 1. Data Producer (Sensor/Simulator)
- **Language**: Java
- **Function**: A Java console application that generates mock telemetry data (GPS, Speed, Vibration).
- **Transport**: Sends data via HTTP POST (RestTemplate/WebClient) or MQTT (Eclipse Paho).

### 2. Data Ingestion & Storage
- **Backend API**: **Java (Spring Boot 3)**
- **Dependencies**: Spring Web, Spring Data JPA, Lombok.
- **Database**: 
    - **PostgreSQL**: Robust relational database, good for structured IoT data.
    - **InfluxDB**: (Optional) If high-frequency sensor data is the primary focus.

### 3. Visualization (Frontend)
- **Framework**: **React.js (Vite)**
- **Why**: Best for scalability and "on-the-go" access via mobile/tablet browsers.
- **Features**: Live map interface (Leaflet/Mapbox), speed graphs, alert logs.

## Proposed Changes

### Project Structure (New)
#### [NEW] [README.md]
- Project documentation and setup instructions.

#### [NEW] [producer/]
- Scripts for simulating sensor data.

#### [NEW] [backend/]
- FastAPI application for data ingestion.

#### [NEW] [frontend/]
- React application for the dashboard.

## Verification Plan
### Automated Tests
- Unit tests for the data generator to ensure valid JSON output.
- API tests for the backend (check if data is received and stored).

### Manual Verification
- Run the simulator and observe logs.
- Open the dashboard and verify real-time updates.
