import React, { useState, useEffect, useRef } from 'react';
import Gauge from './components/Gauge';
import TelemetryLog from './components/TelemetryLog';
import CityMap from './components/CityMap';
import './index.css';

function App() {
  const [fleet, setFleet] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('disconnected');
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:3000');
    const ws = wsRef.current;

    ws.onopen = () => {
      setStatus('connected');
      addLog({ id: 'SYSTEM', msg: 'Connected to Central Command' });
    };

    ws.onclose = () => {
      setStatus('disconnected');
      addLog({ id: 'SYSTEM', msg: 'Disconnected' });
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'FLEET_UPDATE') {
          setFleet(payload.vehicles);
          // Check for accidents to log
          payload.vehicles.forEach(v => {
            if (v.status === 'CRITICAL') {
              // Ideally we debounce this, but for now simple check
              // addLog({ id: v.id, msg: 'CRITICAL ALERT: ACCIDENT DETECTED' });
            }
          });
        }
      } catch (e) {
        console.error('Parse error', e);
      }
    };

    return () => ws.close();
  }, []);

  const addLog = (entry) => {
    const time = new Date().toLocaleTimeString().split(' ')[0];
    setLogs(prev => [...prev.slice(-49), { time, ...entry }]);
  };

  const sendCommand = (type, targetId = null) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, id: targetId }));
      addLog({ id: 'CMD', msg: `SENT: ${type} ${targetId || 'ALL'}` });
    }
  };

  const selectedVehicle = fleet.find(v => v.id === selectedId) || fleet[0];

  return (
    <div style={{ padding: '1.5rem', height: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', background: 'linear-gradient(to right, #fff, #bbb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            VORTEX CITY COMMAND
          </h1>
          <div style={{ fontSize: '0.8rem', color: '#666', letterSpacing: '2px' }}>AUTONOMOUS FLEET CONTROL</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-danger" onClick={() => sendCommand('EMERGENCY_STOP')}>⚠️ EMER. STOP ALL</button>
          <div style={{
            padding: '5px 15px', borderRadius: '20px',
            background: status === 'connected' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 0, 85, 0.1)',
            border: `1px solid ${status === 'connected' ? '#00ff88' : '#ff0055'}`,
            color: status === 'connected' ? '#00ff88' : '#ff0055',
            fontSize: '0.8rem', fontWeight: 'bold'
          }}>
            {status}
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr 350px', gap: '1.5rem', flex: 1, minHeight: 0 }}>

        {/* Left Col: Fleet List */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Fleet Status</h3>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {fleet.map(v => (
              <div key={v.id}
                onClick={() => setSelectedId(v.id)}
                style={{
                  padding: '10px', marginBottom: '5px', borderRadius: '8px', cursor: 'pointer',
                  background: selectedId === v.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                  borderLeft: `3px solid ${v.status === 'CRITICAL' ? 'var(--alert-color)' : v.status === 'STOPPED' ? '#666' : 'var(--primary-color)'}`,
                  fontSize: '0.85rem'
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ color: '#fff' }}>{v.id}</strong>
                  <span style={{ color: v.status === 'NORMAL' ? '#aaa' : v.status === 'CRITICAL' ? 'var(--alert-color)' : '#888' }}>{v.status}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>
                  {Math.round(v.speed)} km/h • {Math.round(v.fuel)}% Fuel
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Map */}
        <div style={{ minHeight: 0 }}>
          <CityMap vehicles={fleet} onSelect={(v) => setSelectedId(v.id)} selectedId={selectedId} />
        </div>

        {/* Right Col: Details (Reusing Gauge Code) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>
          {selectedVehicle ? (
            <>
              <div className="glass-panel" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ color: 'var(--primary-color)' }}>{selectedVehicle.id}</h3>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button className="btn-small" onClick={() => sendCommand('STOP_VEHICLE', selectedVehicle.id)}>STOP</button>
                    <button className="btn-small" onClick={() => sendCommand('RESET_VEHICLE', selectedVehicle.id)}>RST</button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1rem' }}>
                  <Gauge value={selectedVehicle.speed} max={220} label="Speed" unit="km/h" color="#00f2ff" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8rem' }}>
                  <div>
                    <div style={{ color: '#666' }}>RPM</div>
                    <div style={{ fontSize: '1.2rem' }}>{Math.round(selectedVehicle.rpm)}</div>
                  </div>
                  <div>
                    <div style={{ color: '#666' }}>TEMP</div>
                    <div style={{ fontSize: '1.2rem', color: selectedVehicle.temp > 100 ? 'red' : '#fff' }}>{Math.round(selectedVehicle.temp)}°C</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="glass-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
              Select a vehicle
            </div>
          )}

          <div style={{ flex: 1, minHeight: 0 }}>
            <TelemetryLog logs={logs} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
