import React from 'react';

const CityMap = ({ vehicles, onSelect, selectedId }) => {
    // Map bounds to scale points to percentage
    // Based on server bounds: lat: 37.77, lng: -122.42, range: 0.05
    const centerLat = 37.77;
    const centerLng = -122.42;
    const range = 0.05;

    const toPercentX = (lng) => {
        return ((lng - (centerLng - range / 2)) / range) * 100;
    };

    // Y is inverted (Lat increases up, CSS top increases down)
    const toPercentY = (lat) => {
        return 100 - ((lat - (centerLat - range / 2)) / range) * 100;
    };

    return (
        <div className="glass-panel" style={{
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: `
                linear-gradient(rgba(0, 242, 255, 0.05) 1px, transparent 1px), 
                linear-gradient(90deg, rgba(0, 242, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
        }}>
            <h3 style={{ position: 'absolute', top: '10px', left: '15px', zIndex: 10 }}>San Francisco Sector 7</h3>

            {/* Center Hub */}
            <div style={{
                position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                width: '20px', height: '20px', background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid var(--primary-color)', borderRadius: '50%',
                boxShadow: '0 0 20px var(--primary-color)'
            }} />

            {/* Vehicles */}
            {vehicles.map(v => (
                <div
                    key={v.id}
                    onClick={() => onSelect(v)}
                    style={{
                        position: 'absolute',
                        left: `${toPercentX(v.longitude)}%`,
                        top: `${toPercentY(v.latitude)}%`,
                        width: '12px', height: '12px',
                        backgroundColor: v.status === 'CRITICAL' ? 'var(--alert-color)' :
                            v.status === 'STOPPED' ? '#555' :
                                v.id === selectedId ? '#fff' : 'var(--primary-color)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        boxShadow: v.status === 'CRITICAL' ? '0 0 15px var(--alert-color)' :
                            v.id === selectedId ? '0 0 15px #fff' : '0 0 5px var(--primary-color)',
                        border: v.id === selectedId ? '2px solid #fff' : 'none',
                        transition: 'all 0.3s ease'
                    }}
                    title={`${v.id} - ${Math.round(v.speed)}km/h`}
                >
                    {/* Ring animation for moving cars */}
                    {v.speed > 5 && <div className="ping-ring" />}
                </div>
            ))}
        </div>
    );
};

export default CityMap;
