import React, { useState, useEffect } from 'react';
import Gauge from './components/Gauge';
import TelemetryLog from './components/TelemetryLog';
import MapPlaceholder from './components/MapPlaceholder';
import './index.css';

function App() {
  const [data, setData] = useState({ speed: 0, rpm: 0, fuel: 100, temp: 90, latitude: 0, longitude: 0 });
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('disconnected');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
      setStatus('connected');
      addLog('Connected to Telemetry Server');
    };

    ws.onclose = () => {
      setStatus('disconnected');
      addLog('Disconnected from server');
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setData(parsed);
      } catch (e) {
        console.error('Parse error', e);
      }
    };

    return () => ws.close();
  }, []);

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString().split(' ')[0];
    setLogs(prev => [...prev.slice(-19), { time, message: msg }]); // Keep last 20
  };

  return (
    <div style={{ padding: '2rem', height: '100vh', boxSizing: 'border-box', display: 'grid', gridTemplateRows: 'auto 1fr', gap: '2rem' }}>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', background: 'linear-gradient(to right, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Vortex Telemetry
          </h1>
          <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>Real-time Vehicle Analytics</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: status === 'connected' ? '#00ff88' : '#ff0055',
            boxShadow: `0 0 10px ${status === 'connected' ? '#00ff88' : '#ff0055'}`
          }} />
          <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{status}</span>
        </div>
      </header>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', height: '100%', overflow: 'hidden' }}>

        {/* Left Column: Gauges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-around', padding: '2rem 0' }}>
            <Gauge value={data.speed} max={240} label="Speed" unit="km/h" color="#00f2ff" />
            <Gauge value={data.rpm} max={8000} label="RPM" unit="rev/m" color="#7000ff" />
          </div>

          <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase' }}>Engine Temp</div>
              <div style={{ fontSize: '1.5rem', color: data.temp > 110 ? 'red' : '#fff' }}>{Math.round(data.temp)}°C</div>
              <div style={{ width: '100%', height: '4px', background: '#333', marginTop: '8px', borderRadius: '2px' }}>
                <div style={{ width: `${Math.min(data.temp / 150 * 100, 100)}%`, height: '100%', background: 'var(--primary-color)' }} />
              </div>
            </div>
            <div>
              <div style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase' }}>Fuel Level</div>
              <div style={{ fontSize: '1.5rem', color: '#fff' }}>{Math.round(data.fuel)}%</div>
              <div style={{ width: '100%', height: '4px', background: '#333', marginTop: '8px', borderRadius: '2px' }}>
                <div style={{ width: `${data.fuel}%`, height: '100%', background: 'var(--secondary-color)' }} />
              </div>
            </div>
          </div>

          <TelemetryLog logs={logs} />
        </div>

        {/* Right Column: Map */}
        <MapPlaceholder lat={data.latitude} lng={data.longitude} />

      </div>
    </div>
  );
}

export default App;
