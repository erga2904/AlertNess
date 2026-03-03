import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    fetchRecentQuakes,
    formatMagnitude,
    getSeverity,
    getSeverityLabel,
    timeAgo,
} from '../utils/api';
import { IconMap } from '../components/Icons';

const SEVERITY_COLORS = {
    danger: '#f87171',
    warning: '#fb923c',
    safe: '#4ade80',
};

// Create custom icons for Evakuasi and Posko
const poskoIcon = L.divIcon({
    html: '<div style="font-size:24px; background:#fff; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">🏥</div>',
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});
const evakuasiIcon = L.divIcon({
    html: '<div style="font-size:24px; background:#fff; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(0,0,0,0.3);">🏃</div>',
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});
const userIcon = L.divIcon({
    html: '<div style="width:16px; height:16px; background:#3b82f6; border:3px solid #fff; border-radius:50%; box-shadow:0 0 10px rgba(59,130,246,0.8);"></div>',
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

function MapSkeleton() {
    return (
        <div>
            <div className="skeleton" style={{ height: 'calc(100vh - 200px)', minHeight: 400, borderRadius: 16 }}></div>
        </div>
    );
}

export default function MapPage() {
    const [quakes, setQuakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initLayer = queryParams.get('layer') || 'gempa';
    
    const [activeLayer, setActiveLayer] = useState(initLayer);
    const [userLoc, setUserLoc] = useState(null);
    const [facilities, setFacilities] = useState([]);

    useEffect(() => {
        // Try getting user location
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                setUserLoc({ lat, lon });
                
                // Generate mock facilities around user location
                const mocks = [];
                for(let i=0; i<5; i++) {
                    mocks.push({
                        type: 'posko',
                        lat: lat + (Math.random() - 0.5) * 0.1,
                        lon: lon + (Math.random() - 0.5) * 0.1,
                        name: 'Posko Darurat ' + (i+1)
                    });
                    mocks.push({
                        type: 'evakuasi',
                        lat: lat + (Math.random() - 0.5) * 0.1,
                        lon: lon + (Math.random() - 0.5) * 0.1,
                        name: 'Titik Evakuasi ' + (i+1)
                    });
                }
                setFacilities(mocks);
            },
            (err) => console.log('Location error', err)
        );

        async function load() {
            try {
                const data = await fetchRecentQuakes();
                setQuakes(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <MapSkeleton />;

    return (
        <div>
            <h2 className="section-title">
                <IconMap size={22} /> Peta Interaktif Bencana
            </h2>
            <p className="section-description">
                Visualisasi titik gempa, lokasi posko darurat, dan jalur evakuasi.
            </p>

            {/* Layer Toggles */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }} className="hide-scrollbar">
                <button onClick={() => setActiveLayer('gempa')} style={{ padding:'8px 16px', borderRadius:20, border:'none', background: activeLayer === 'gempa' ? '#3b82f6' : 'rgba(255,255,255,0.1)', color:'#fff', cursor:'pointer' }}>🔴 Titik Gempa</button>
                <button onClick={() => setActiveLayer('evakuasi')} style={{ padding:'8px 16px', borderRadius:20, border:'none', background: activeLayer === 'evakuasi' ? '#10b981' : 'rgba(255,255,255,0.1)', color:'#fff', cursor:'pointer' }}>🏃 Titik Evakuasi</button>
                <button onClick={() => setActiveLayer('posko')} style={{ padding:'8px 16px', borderRadius:20, border:'none', background: activeLayer === 'posko' ? '#f59e0b' : 'rgba(255,255,255,0.1)', color:'#fff', cursor:'pointer' }}>🏥 Posko Darurat</button>
            </div>

            <div className="map-container">
                <MapContainer
                    center={userLoc ? [userLoc.lat, userLoc.lon] : [-2.5, 118]}
                    zoom={userLoc ? 11 : 5}
                    style={{ width: '100%', height: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; CARTO'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    
                    {/* User Location */}
                    {userLoc && (
                        <Marker position={[userLoc.lat, userLoc.lon]} icon={userIcon}>
                            <Popup>
                                <div style={{ fontWeight: 'bold' }}>Lokasi Anda</div>
                            </Popup>
                        </Marker>
                    )}

                    {/* Quakes Layer */}
                    {(activeLayer === 'gempa' || activeLayer === 'all') && quakes.map((q, i) => {
                        const sev = getSeverity(q.magnitude);
                        const color = SEVERITY_COLORS[sev];
                        const radius = Math.max(6, (q.magnitude - 4) * 8);
                        return (
                            <CircleMarker key={i} center={[q.lat, q.lon]} radius={radius} pathOptions={{ color, fillColor: color, fillOpacity: 0.35, weight: 2 }}>
                                <Popup className="custom-popup">
                                    <div style={{ fontFamily: 'Figtree, sans-serif' }}>
                                        <div style={{ fontWeight: 800, fontSize: 24, color }}>M {formatMagnitude(q.magnitude)}</div>
                                        <div style={{ fontWeight: 600, fontSize: 13, marginTop: 4, color: '#f1f5f9' }}>{q.wilayah}</div>
                                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
                                            <div>Kedalaman: {q.kedalaman}</div>
                                            <div>{q.tanggal}, {q.jam}</div>
                                        </div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        );
                    })}

                    {/* Facilities Layer */}
                    {(activeLayer === 'evakuasi' || activeLayer === 'posko') && facilities.filter(f => f.type === activeLayer).map((f, i) => (
                        <Marker key={'fac'+i} position={[f.lat, f.lon]} icon={f.type === 'evakuasi' ? evakuasiIcon : poskoIcon}>
                            <Popup>
                                <div style={{ fontWeight:'bold', fontSize:14 }}>{f.name}</div>
                                <div style={{ fontSize:12, marginTop:4, color:'#666' }}>{f.type === 'evakuasi' ? 'Zana aman sementara' : 'Tenda medis & bantuan'}</div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
            
            {activeLayer === 'gempa' && (
                <div className="map-legend">
                    <div className="legend-item"><span className="legend-dot legend-dot--danger"></span>Bahaya (M ≥ 6,0)</div>
                    <div className="legend-item"><span className="legend-dot legend-dot--warning"></span>Waspada (M 5,0–5,9)</div>
                    <div className="legend-item"><span className="legend-dot legend-dot--safe"></span>Aman (M &lt; 5,0)</div>
                </div>
            )}
        </div>
    );
}


