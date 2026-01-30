import React from 'react';

const Gauge = ({ value, max = 220, label, unit, color = '#00f2ff' }) => {
    const radius = 80;
    const stroke = 12;
    const normalizedValue = Math.min(Math.max(value, 0), max);
    const circumference = normalizedValue / max * 180; // 180 degree arc

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <svg width="200" height="120" viewBox="0 0 200 120">
                {/* Background Arc */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                />
                {/* Value Arc */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke={color}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={`${Math.PI * 80}`}
                    strokeDashoffset={`${Math.PI * 80 * (1 - normalizedValue / max)}`}
                    style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
                />
            </svg>
            <div style={{ position: 'absolute', bottom: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', textShadow: `0 0 20px ${color}66` }}>
                    {Math.round(value)}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {unit}
                </div>
            </div>
            <div style={{ marginTop: '0px', fontSize: '1rem', color: '#fff' }}>{label}</div>
        </div>
    );
};

export default Gauge;
