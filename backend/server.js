const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3000;

// System Constants
const VEHICLE_COUNT = 20;
const CITY_BOUNDS = { lat: 37.77, lng: -122.42, range: 0.05 }; // ~5km box

// Fleet State
const fleet = new Map();

// Helper: Create a single vehicle
function createVehicle(id) {
    return {
        id: `VH-${id.toString().padStart(3, '0')}`,
        status: 'NORMAL', // NORMAL, WARNING, CRITICAL, STOPPED
        speed: 0,
        rpm: 800,
        fuel: Math.random() * 50 + 50, // 50-100%
        temp: 85 + Math.random() * 10,
        latitude: CITY_BOUNDS.lat + (Math.random() - 0.5) * CITY_BOUNDS.range,
        longitude: CITY_BOUNDS.lng + (Math.random() - 0.5) * CITY_BOUNDS.range,
        targetSpeed: Math.random() * 60 + 20, // Each car has a "driver's desired speed"
        lastUpdate: Date.now()
    };
}

// Initialize Fleet
for (let i = 1; i <= VEHICLE_COUNT; i++) {
    fleet.set(i, createVehicle(i));
}

// Simulation Logic
function updateSimulation() {
    fleet.forEach(car => {
        if (car.status === 'STOPPED') {
            car.speed = Math.max(0, car.speed - 2); // Rapid braking
            car.rpm = 800; // Idle
            return; // Don't move
        }

        // Random Accident / Incident Injection (1 in 1000 chance per tick)
        if (Math.random() < 0.001 && car.status === 'NORMAL') {
            car.status = 'CRITICAL'; // Accident!
            car.speed = 0;
            // Broadcast alert later
        }

        // Speed Logic
        const acceleration = (car.targetSpeed - car.speed) * 0.05;
        // Add some noise
        car.speed += acceleration + (Math.random() - 0.5);
        car.speed = Math.max(0, car.speed);

        // RPM Logic
        const targetRPM = 800 + (car.speed * 40);
        car.rpm += (targetRPM - car.rpm) * 0.1;

        // GPS Logic (Move in random smooth curves)
        // Ideally we'd have vectors, but let's just jitter drift for now
        if (car.speed > 0) {
            car.latitude += (Math.random() - 0.5) * 0.0001 * (car.speed / 50);
            car.longitude += (Math.random() - 0.5) * 0.0001 * (car.speed / 50);
        }

        // Fuel
        if (car.speed > 0) car.fuel -= 0.001;

        // Auto-recover warning states
        if (car.status === 'WARNING' && Math.random() > 0.99) car.status = 'NORMAL';
    });
}

// Broadcast loop
setInterval(() => {
    updateSimulation();
    const data = JSON.stringify({
        type: 'FLEET_UPDATE',
        timestamp: Date.now(),
        vehicles: Array.from(fleet.values())
    });

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}, 100);

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.send(JSON.stringify({ type: 'WELCOME', count: fleet.size }));

    ws.on('message', (message) => {
        try {
            const command = JSON.parse(message);
            console.log('Received command:', command);

            if (command.type === 'EMERGENCY_STOP') {
                fleet.forEach(car => car.status = 'STOPPED');
            } else if (command.type === 'STOP_VEHICLE') {
                const target = Array.from(fleet.values()).find(v => v.id === command.id);
                if (target) target.status = 'STOPPED';
            } else if (command.type === 'RESET_VEHICLE') {
                const target = Array.from(fleet.values()).find(v => v.id === command.id);
                if (target) {
                    target.status = 'NORMAL';
                    target.targetSpeed = Math.random() * 60 + 20;
                }
            }
        } catch (e) {
            console.error('Command invalid', e);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`City fleet simulation running on http://localhost:${PORT}`);
});
