import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RealTimeIntensityGauge } from './CustomCharts';

// SECTION 3 - EARLY WARNING PANEL
export function EarlyWarningPanel({ latest }) {
    const [state, setState] = useState('AMAN');
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);
    const [userLoc, setUserLoc] = useState(null);
    const [distance, setDistance] = useState(null);
    const [notifSent, setNotifSent] = useState(false);

    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => setUserLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                err => console.log('Location error', err)
            );
        }
    }, []);

    const sendPushNotif = (title, body) => {
        if ('Notification' in window && Notification.permission === 'granted' && !notifSent) {
            new Notification(title, { body, icon: 'https://cdn-icons-png.flaticon.com/512/2000/2000492.png' });
            setNotifSent(true);
        }
    };

    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; 
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    // Calculate real-time state based on the latest earthquake
    useEffect(() => {
        if (!latest || !latest.dateTime || isSimulating) return;

        let dist = 0;
        if (userLoc && latest.lat && latest.lon) {
            dist = getDistance(userLoc.lat, userLoc.lon, latest.lat, latest.lon);
            setDistance(Math.round(dist));
        }

        const quakeTime = new Date(latest.dateTime).getTime();
        const now = Date.now();
        const diffSeconds = (now - quakeTime) / 1000;
        
        let estimatedSecondsLeft = 0;
        if (dist > 0) {
            estimatedSecondsLeft = Math.max(0, Math.floor((dist / 4) - diffSeconds));
        } else {
            estimatedSecondsLeft = diffSeconds < 60 ? 15 : 0; 
        }

        if (diffSeconds < 3600) { 
            if (latest.magnitude >= 5.0 && (dist < 300 || dist === 0)) {
                setState('BAHAYA');
                setTimeLeft(estimatedSecondsLeft);
                if (estimatedSecondsLeft > 0) {
                    sendPushNotif('⚠️ GEMPA MERUSAK!', 'M' + latest.magnitude + ' berjarak ' + Math.round(dist) + 'km. Estimasi tiba ' + estimatedSecondsLeft + 's!');
                }
            } else if (latest.magnitude >= 4.0) {
                setState('WASPADA');
                setTimeLeft(estimatedSecondsLeft);
                if (diffSeconds < 300 && dist > 0) sendPushNotif('Peringatan', 'Gempa M' + latest.magnitude + ' berjarak ' + Math.round(dist) + 'km.');
            } else {
                setState('AMAN');
                setTimeLeft(0);
            }
        } else {
            setState('AMAN');
            setTimeLeft(0);
        }
    }, [latest, isSimulating, userLoc]);

    // Handle manual simulation trigger
    const startSimulation = () => {
        setIsSimulating(true);
        setState('WASPADA');
        setTimeLeft(0);
        sendPushNotif('TEST SIMULASI', 'Ini adalah simulasi peringatan dini gempa bumi.');

        setTimeout(() => {
            setState('BAHAYA');
            setTimeLeft(15);
        }, 3000);

        setTimeout(() => {
            setIsSimulating(false);
        }, 20000);
    };

    useEffect(() => {
        if (state === 'BAHAYA' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(l => l - 1), 1000);
            return () => clearTimeout(timer);
        } else if (state === 'BAHAYA' && timeLeft === 0 && isSimulating) {
            setIsSimulating(false);
            setState('AMAN');
        }
    }, [state, timeLeft, isSimulating]);

    const stateClasses = {
        AMAN: 'state-aman',
        WASPADA: 'state-waspada',
        BAHAYA: 'state-bahaya'
    };

    const circ = 2 * Math.PI * 40;
    const progress = state === 'BAHAYA' ? (timeLeft / 15) * circ : circ;

    return (
        <div className={'card mt-md ' + stateClasses[state]} style={{ transition: 'all 0.5s' }}>
            <div className="card-header" style={{ justifyContent: 'space-between', display: 'flex', width: '100%', alignItems: 'center' }}>
                <div className="card-title">EEWS & Lokasi Terkini</div>
                {!isSimulating && state === 'AMAN' && (
                    <button onClick={startSimulation} title="Jalankan Simulasi" style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}>
                        Test Simulasi
                    </button>
                )}
            </div>
            {distance !== null && <div style={{fontSize: 12, marginBottom: 12, color: '#94a3b8'}}>Jarak gempa dari Anda: <strong style={{color:'#fff'}}>{distance} km</strong></div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto' }}>
                    <svg viewBox="0 0 100 100" width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
                        <circle cx="50" cy="50" r="40" fill="none" 
                            stroke={state === 'BAHAYA' ? '#f87171' : state === 'WASPADA' ? '#fbbf24' : '#4ade80'} 
                            strokeWidth="8" strokeDasharray={circ} strokeDashoffset={circ - progress} 
                            style={{ transition: 'stroke-dashoffset 1s linear' }} />
                    </svg>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        {state === 'BAHAYA' ? (
                            <>
                                <span style={{ fontSize: 24, fontWeight: 'bold', lineHeight: 1 }}>{timeLeft}s</span>
                                <span style={{ fontSize: 10 }}>ETA Gelombang</span>
                            </>
                        ) : (
                            <span style={{ fontSize: 16, fontWeight: 'bold' }}>{state}</span>
                        )}
                    </div>
                </div>
                <div style={{ flex: 1, minWidth: 150 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 'bold', color: state === 'BAHAYA' ? '#f87171' : state === 'WASPADA' ? '#fbbf24' : '#4ade80' }}>
                        {state === 'BAHAYA' ? 'LINDUNGI KEPALA!' : state === 'WASPADA' ? 'WASPADA GETARAN' : 'SITUASI AMAN'}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#e2e8f0', lineHeight: 1.5 }}>
                        {state === 'BAHAYA' 
                            ? 'Gelombang destruktif diprediksi mendekati lokasi Anda. Segera berlindung di bawah meja!' 
                            : state === 'WASPADA'
                            ? 'Terdeteksi gempa di wilayah sekitar. Bersiap untuk kemungkinan guncangan atau gempa susulan.'
                            : 'Tidak ada ancaman gelombang gempa merusak di lokasi Anda saat ini. Selalu siaga.'}
                    </p>
                </div>
            </div>
        </div>
    );
}

// SECTION 4 - FAMILY TRACKER
export function FamilyTracker() {
    const [family, setFamily] = useState(() => {
        try {
            const saved = localStorage.getItem('alertness-family');
            return saved ? JSON.parse(saved) : [];
        } catch (e) { return []; }
    });

    useEffect(() => {
        localStorage.setItem('alertness-family', JSON.stringify(family));
    }, [family]);

    const [clicks, setClicks] = useState({});
    const [newName, setNewName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleClick = (i) => {
        setClicks({ ...clicks, [i]: true });
        // Update status to Aman when signal is sent
        const updated = [...family];
        updated[i].status = 'Aman';
        updated[i].time = 'Baru saja';
        updated[i].color = '#4ade80';
        setFamily(updated);
        
        setTimeout(() => setClicks(c => ({ ...c, [i]: false })), 500);
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        const init = newName.substring(0, 2).toUpperCase();
        setFamily([...family, { id: Date.now(), name: newName, init, status: 'Menunggu', time: '-', color: '#fbbf24' }]);
        setNewName('');
        setIsAdding(false);
    };

    const handleRemove = (i) => {
        const updated = [...family];
        updated.splice(i, 1);
        setFamily(updated);
    };

    return (
        <div className="card mt-md">
            <div className="card-header" style={{ justifyContent: 'space-between', display: 'flex', width: '100%', alignItems: 'center' }}>
                <div className="card-title">Pemantauan Keluarga</div>
                <button onClick={() => setIsAdding(!isAdding)} style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: 18, cursor: 'pointer' }}>+</button>
            </div>
            
            {isAdding && (
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <input 
                        type="text" 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)} 
                        placeholder="Nama Keluarga (Cth: Ibu)" 
                        style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
                        autoFocus
                    />
                    <button type="submit" style={{ padding: '8px 12px', borderRadius: 8, background: '#60a5fa', color: '#fff', border: 'none', fontWeight: 'bold' }}>Tambah</button>
                </form>
            )}

            <div>
                {family.length === 0 && !isAdding && (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: 12 }}>
                        Belum ada data keluarga. Klik tombol + untuk menambahkan.
                    </div>
                )}
                {family.map((f, i) => (
                    <div key={f.id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < family.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div 
                                onDoubleClick={() => handleRemove(i)}
                                title="Klik ganda untuk menghapus"
                                style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                {f.init}
                            </div>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 'bold' }}>{f.name}</div>
                                <div style={{ fontSize: 11, color: f.color, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: f.color }}></span>
                                    {f.status} &bull; <span style={{ color: '#64748b' }}>{f.time}</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleClick(i)}
                            style={{ 
                                padding: '6px 12px', background: 'rgba(96,165,250,0.1)', color: '#60a5fa', 
                                border: '1px solid rgba(96,165,250,0.3)', borderRadius: 16, fontSize: 11,
                                transform: clicks[i] ? 'scale(0.95)' : 'scale(1)', transition: 'transform 0.1s'
                            }}>
                            Sinyal Aman
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// SECTION 5 - SOS & QUICK ACTION PANEL
export function QuickActions() {
    const navigate = useNavigate();

    return (
        <div className="card mt-md" style={{ textAlign: 'center' }}>
            <button className="sos-btn-ripple" onClick={() => navigate('/sos')} style={{ 
                width: '100%', padding: '16px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
                color: '#fff', borderRadius: 12, fontSize: 18, fontWeight: 'bold', border: 'none',
                boxShadow: '0 4px 12px rgba(248,113,113,0.4)', marginBottom: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer'
            }}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 22h20L12 2z" />
                    <line x1="12" y1="16" x2="12" y2="16" />
                    <line x1="12" y1="10" x2="12" y2="14" />
                </svg>
                SOS DARURAT
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 8 }}>
                {[
                    { icon: '🏃', label: 'Evakuasi', path: '/peta?layer=evakuasi' },
                    { icon: '🏥', label: 'Posko', path: '/peta?layer=posko' },
                    { icon: '🩹', label: 'P3K', path: '/panduan' }
                ].map((a, i) => (
                    <button key={i} className="quick-action-btn" onClick={() => navigate(a.path)} style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        padding: '12px 8px', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center',
                        color: '#94a3b8', fontSize: 11, gap: 6, transition: 'all 0.3s', cursor: 'pointer'
                    }}>
                        <span style={{ fontSize: 20 }}>{a.icon}</span>
                        {a.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

// SECTION 6 - LIVE FEED SIDEBAR
export function LiveFeed({ quakes }) {
    const [filter, setFilter] = useState('Semua');
    const tabs = ['Semua', 'Gempa', 'Tsunami', 'Banjir', 'Gunung Api'];
    
    // Simulate feed with some delays for animation
    const [visibleItems, setVisibleItems] = useState([]);
    
    useEffect(() => {
        if (!quakes || quakes.length === 0) return;
        setVisibleItems([]);
        
        let filtered = [];
        if (filter === 'Semua') {
            filtered = quakes;
        } else if (filter === 'Gempa') {
            filtered = quakes; // Assuming BMKG data here is all earthquakes
        } else if (filter === 'Tsunami') {
            filtered = quakes.filter(q => q.potensi && !q.potensi.toLowerCase().includes('tidak'));
        } else {
            // For Banjir and Gunung Api we simulate empty or specific external data
            // Since BMKG earthquake list doesn't have these, we return empty so it functions logically
            filtered = [];
        }
        
        filtered.slice(0, 10).forEach((q, i) => {
            setTimeout(() => {
                setVisibleItems(prev => [...prev, q]);
            }, i * 150);
        });
    }, [quakes, filter]);

    return (
        <div className="card mt-md" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="card-header">
                <div className="card-title">Live Feed Bencana</div>
            </div>
            <div className="hide-scrollbar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(65px, 1fr))', gap: 8, marginBottom: 16, paddingBottom: 4 }}>
                {tabs.map(t => (
                    <button key={t} onClick={() => setFilter(t)} style={{
                        padding: '4px 12px', borderRadius: 16, fontSize: 11, border: 'none',
                        background: filter === t ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.05)',
                        color: filter === t ? '#60a5fa' : '#94a3b8', transition: 'all 0.2s', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        {t}
                    </button>
                ))}
            </div>
            <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', maxHeight: 400, paddingRight: 4 }}>
                {visibleItems.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: 13 }}>
                        Tidak ada laporan terkait {filter !== 'Semua' ? filter : 'kejadian'} saat ini.
                    </div>
                )}
                {visibleItems.map((q, i) => {
                    const sev = q.magnitude > 5 ? 'danger' : q.magnitude > 4 ? 'warning' : 'safe';
                    const color = sev === 'danger' ? '#f87171' : sev === 'warning' ? '#fbbf24' : '#4ade80';
                    return (
                        <div key={q.jam + i} className="live-feed-item" style={{
                            padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 8,
                            borderLeft: `4px solid ${color}`
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontSize: 12, fontWeight: 'bold', color: '#fff' }}>{q.wilayah.split(' ')[0]}</span>
                                <span style={{ fontSize: 10, color: '#94a3b8' }}>{q.jam.split(' ')[0]}</span>
                            </div>
                            <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', gap: 8 }}>
                                <span style={{ background: color+'33', color: color, padding: '2px 6px', borderRadius: 4 }}>M{q.magnitude}</span>
                                <span>Kedalaman: {q.kedalaman}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}







