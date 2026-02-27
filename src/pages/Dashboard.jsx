import { useState, useEffect } from 'react';
import {
    fetchLatestQuake,
    fetchRecentQuakes,
    formatMagnitude,
    getSeverity,
    getSeverityLabel,
    timeAgo,
} from '../utils/api';
import {
    IconSeismic, IconEpicenter, IconLocation, IconDepth,
    IconClock, IconCoordinates, IconCheckCircle, IconAlertCircle,
    IconMegaphone, IconList,
} from '../components/Icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createPulseIcon(severity) {
    const colors = {
        danger: '#f87171',
        warning: '#fb923c',
        safe: '#4ade80',
    };
    const color = colors[severity] || colors.warning;
    return L.divIcon({
        className: '',
        html: `
      <div style="
        width: 18px; height: 18px;
        background: ${color};
        border-radius: 50%;
        border: 3px solid rgba(255,255,255,0.3);
        box-shadow: 0 0 0 0 ${color}80;
        animation: pulse-epicenter 2s infinite;
      "></div>
    `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
    });
}

// Loading skeleton
function DashboardSkeleton() {
    return (
        <div>
            <div className="skeleton skeleton-card" style={{ height: 280 }}></div>
            <div style={{ marginTop: 24 }}>
                <div className="skeleton skeleton-text w-40"></div>
                <div className="skeleton skeleton-row"></div>
                <div className="skeleton skeleton-row"></div>
                <div className="skeleton skeleton-row"></div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [latest, setLatest] = useState(null);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const [latestData, recentData] = await Promise.all([
                    fetchLatestQuake(),
                    fetchRecentQuakes(),
                ]);
                setLatest(latestData);
                setRecent(recentData);
            } catch (err) {
                setError('Gagal memuat data dari BMKG. Silakan coba lagi.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
        const interval = setInterval(load, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <DashboardSkeleton />;

    if (error) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon"><IconAlertCircle size={48} /></div>
                <p className="empty-state-text">{error}</p>
            </div>
        );
    }

    const severity = getSeverity(latest.magnitude);
    const isTsunamiSafe = latest.potensi?.toLowerCase().includes('tidak');

    return (
        <div>
            {/* Hero Card */}
            <div className="quake-hero">
                <div className="quake-hero-label">
                    <IconEpicenter size={16} className="icon-pulse" style={{ color: '#f87171' }} />
                    GEMPA TERKINI
                </div>

                <div className="quake-hero-mag">
                    {formatMagnitude(latest.magnitude)}
                </div>
                <div className="quake-hero-scale">Skala Magnitudo (M)</div>

                <div className="quake-hero-details">
                    <div className="quake-detail-item">
                        <span className="quake-detail-label">
                            <IconLocation size={13} /> Lokasi
                        </span>
                        <span className="quake-detail-value">{latest.wilayah}</span>
                    </div>
                    <div className="quake-detail-item">
                        <span className="quake-detail-label">
                            <IconDepth size={13} /> Kedalaman
                        </span>
                        <span className="quake-detail-value">{latest.kedalaman}</span>
                    </div>
                    <div className="quake-detail-item">
                        <span className="quake-detail-label">
                            <IconClock size={13} /> Waktu
                        </span>
                        <span className="quake-detail-value">
                            {latest.tanggal}, {latest.jam}
                        </span>
                    </div>
                    <div className="quake-detail-item">
                        <span className="quake-detail-label">
                            <IconCoordinates size={13} /> Koordinat
                        </span>
                        <span className="quake-detail-value">
                            {latest.lintang}, {latest.bujur}
                        </span>
                    </div>
                </div>

                {/* Tsunami Status */}
                <div className={`tsunami-badge ${isTsunamiSafe ? 'tsunami-badge--safe' : 'tsunami-badge--danger'}`}>
                    {isTsunamiSafe
                        ? <IconCheckCircle size={16} />
                        : <IconAlertCircle size={16} />
                    }
                    <span>{latest.potensi || 'Status tidak tersedia'}</span>
                </div>

                {/* Mini Map */}
                {latest.lat && latest.lon && (
                    <div className="mini-map-container">
                        <MapContainer
                            center={[latest.lat, latest.lon]}
                            zoom={6}
                            style={{ width: '100%', height: '100%' }}
                            zoomControl={false}
                            dragging={false}
                            scrollWheelZoom={false}
                            attributionControl={false}
                        >
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                            <Marker
                                position={[latest.lat, latest.lon]}
                                icon={createPulseIcon(severity)}
                            />
                        </MapContainer>
                    </div>
                )}
            </div>

            {/* Dirasakan */}
            {latest.dirasakan && latest.dirasakan !== '-' && (
                <div className="card mt-md">
                    <div className="card-header">
                        <IconMegaphone size={18} style={{ color: '#60a5fa' }} />
                        <div>
                            <div className="card-title">Dirasakan</div>
                            <div className="card-subtitle">Laporan warga</div>
                        </div>
                    </div>
                    <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>
                        {latest.dirasakan}
                    </p>
                </div>
            )}

            {/* Recent Quakes List */}
            <div className="mt-lg">
                <h2 className="section-title">
                    <IconList size={20} /> Gempa Terkini (M ≥ 5,0)
                </h2>
                <p className="section-description">
                    Data gempa bumi signifikan terbaru dari BMKG yang memiliki magnitudo 5,0 atau lebih.
                </p>

                <div className="quake-list">
                    {recent.map((q, i) => {
                        const sev = getSeverity(q.magnitude);
                        return (
                            <div
                                className="quake-list-item"
                                key={i}
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <div className={`quake-list-mag quake-list-mag--${sev}`}>
                                    {formatMagnitude(q.magnitude)}
                                </div>
                                <div className="quake-list-info">
                                    <div className="quake-list-location">{q.wilayah}</div>
                                    <div className="quake-list-meta">
                                        <span><IconDepth size={12} /> {q.kedalaman}</span>
                                        <span>•</span>
                                        <span className={`severity-chip severity-chip--${sev}`}>
                                            {getSeverityLabel(q.magnitude)}
                                        </span>
                                    </div>
                                </div>
                                <div className="quake-list-time">{timeAgo(q.dateTime)}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
