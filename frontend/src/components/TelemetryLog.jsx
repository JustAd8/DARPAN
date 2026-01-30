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
            <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'Consolas, monospace', fontSize: '0.8rem' }}>
                {logs.length === 0 && <div style={{ color: '#555', padding: '10px' }}>System Ready. Waiting for events...</div>}
                {logs.map((log, i) => (
                    <div key={i} style={{
                        display: 'grid', gridTemplateColumns: '60px 40px 1fr', gap: '10px',
                        padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                        color: i === logs.length - 1 ? '#fff' : '#aaa'
                    }}>
                        <span style={{ color: '#666' }}>{log.time}</span>
                        <span style={{ color: 'var(--primary-color)', textAlign: 'right' }}>{log.id}</span>
                        <span>{log.message || log.msg}</span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default TelemetryLog;
