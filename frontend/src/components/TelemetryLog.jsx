import React, { useEffect, useRef } from 'react';

const TelemetryLog = ({ logs }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="glass-panel" style={{ height: '200px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '10px', fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>
                System Logs
            </h3>
            <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                {logs.length === 0 && <div style={{ color: '#555' }}>Waiting for data stream...</div>}
                {logs.map((log, i) => (
                    <div key={i} style={{ marginBottom: '4px', color: i === logs.length - 1 ? '#fff' : '#888' }}>
                        <span style={{ color: '#555', marginRight: '8px' }}>[{log.time}]</span>
                        <span>{log.message}</span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default TelemetryLog;
