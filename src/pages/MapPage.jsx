import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
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

    useEffect(() => {
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
                <IconMap size={22} /> Peta Kebencanaan Interaktif
            </h2>
            <p className="section-description">
                Peta ini menampilkan lokasi seluruh gempa bumi signifikan (M ≥ 5,0) dalam periode terbaru.
                Ukuran dan warna lingkaran menunjukkan magnitudo dan tingkat bahaya gempa.
            </p>

            <div className="map-container">
                <MapContainer
                    center={[-2.5, 118]}
                    zoom={5}
                    style={{ width: '100%', height: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    {quakes.map((q, i) => {
                        const sev = getSeverity(q.magnitude);
                        const color = SEVERITY_COLORS[sev];
                        const radius = Math.max(6, (q.magnitude - 4) * 8);
                        return (
                            <CircleMarker
                                key={i}
                                center={[q.lat, q.lon]}
                                radius={radius}
                                pathOptions={{
                                    color: color,
                                    fillColor: color,
                                    fillOpacity: 0.35,
                                    weight: 2,
                                }}
                            >
                                <Popup className="custom-popup">
                                    <div style={{ fontFamily: 'Figtree, sans-serif' }}>
                                        <div style={{ fontWeight: 800, fontSize: 24, color }}>
                                            M {formatMagnitude(q.magnitude)}
                                        </div>
                                        <div style={{ fontWeight: 600, fontSize: 13, marginTop: 4, color: '#f1f5f9' }}>
                                            {q.wilayah}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
                                            <div>Kedalaman: {q.kedalaman}</div>
                                            <div>{q.tanggal}, {q.jam}</div>
                                            <div>{q.lintang}, {q.bujur}</div>
                                        </div>
                                        <div style={{
                                            marginTop: 8,
                                            padding: '4px 8px',
                                            background: q.potensi?.toLowerCase().includes('tidak')
                                                ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                                            color: q.potensi?.toLowerCase().includes('tidak')
                                                ? '#4ade80' : '#f87171',
                                            borderRadius: 6,
                                            fontSize: 11,
                                            fontWeight: 700,
                                            textAlign: 'center',
                                        }}>
                                            {q.potensi}
                                        </div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        );
                    })}
                </MapContainer>
            </div>

            {/* Legend */}
            <div className="map-legend">
                <div className="legend-item">
                    <span className="legend-dot legend-dot--danger"></span>
                    Bahaya (M ≥ 6,0)
                </div>
                <div className="legend-item">
                    <span className="legend-dot legend-dot--warning"></span>
                    Waspada (M 5,0–5,9)
                </div>
                <div className="legend-item">
                    <span className="legend-dot legend-dot--safe"></span>
                    Aman (M &lt; 5,0)
                </div>
            </div>
        </div>
    );
}
