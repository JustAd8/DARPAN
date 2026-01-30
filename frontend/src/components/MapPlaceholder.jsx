import React from 'react';

const MapPlaceholder = ({ lat, lng }) => {
    return (
        <div className="glass-panel" style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(20,20,30,0.8) 0%, rgba(10,10,15,0.9) 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Grid Lines */}
            <div style={{
                position: 'absolute', width: '200%', height: '200%',
                backgroundImage: 'linear-gradient(rgba(0, 242, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 255, 0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-100px)',
                opacity: 0.3
            }} />

            <div style={{ zIndex: 2, textAlign: 'center' }}>
                <div style={{ color: 'var(--primary-color)', fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
                <h3 style={{ color: '#fff' }}>GPS Location</h3>
                <div style={{ fontFamily: 'monospace', color: '#aaa', marginTop: '0.5rem' }}>
                    LAT: {lat.toFixed(6)} <br />
                    LNG: {lng.toFixed(6)}
                </div>
            </div>
        </div>
    );
};

export default MapPlaceholder;
