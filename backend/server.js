const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3000;

// Simulation State
let vehicleState = {
    speed: 0,          // km/h
    rpm: 800,          // revs
    fuel: 100,         // %
    temp: 90,          // Celsius
    latitude: 37.7749, // Example Start
    longitude: -122.4194
};

// Simulation Logic
function updateSimulation() {
    // Simulate Speed (accelerate/decelerate randomly)
    const speedChange = (Math.random() - 0.5) * 5;
    vehicleState.speed = Math.max(0, Math.min(220, vehicleState.speed + speedChange));

    // Simulate RPM based on speed
    // Idle 800 + (Speed factor) + noise
    vehicleState.rpm = 800 + (vehicleState.speed * 30) + (Math.random() * 50);

    // Fuel consumption
    if (vehicleState.speed > 0) {
        vehicleState.fuel = Math.max(0, vehicleState.fuel - 0.005);
    }

    // Engine Temp (rises with speed, cools when slow)
    const targetTemp = 90 + (vehicleState.speed / 10);
    vehicleState.temp = vehicleState.temp + (targetTemp - vehicleState.temp) * 0.05;

    // Simulate GPS movement (very roughly)
    if (vehicleState.speed > 0) {
        vehicleState.latitude += (Math.random() - 0.5) * 0.0001;
        vehicleState.longitude += (Math.random() - 0.5) * 0.0001;
    }
}

// Broadcast loop
setInterval(() => {
    updateSimulation();
    const data = JSON.stringify(vehicleState);

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}, 100); // 10Hz update rate

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.send(JSON.stringify(vehicleState)); // Send immediate state

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

app.get('/status', (req, res) => {
    res.json({ status: 'running', clients: wss.clients.size });
});

server.listen(PORT, () => {
    console.log(`Telemetry Simulation Server running on http://localhost:${PORT}`);
    console.log(`WebSocket Simulation stream available at ws://localhost:${PORT}`);
});
