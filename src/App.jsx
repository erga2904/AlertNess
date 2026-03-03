import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { fetchLatestQuake } from './utils/api.js';
import Dashboard from './pages/Dashboard.jsx';
import MapPage from './pages/MapPage.jsx';
import Statistics from './pages/Statistics.jsx';
import SafetyGuide from './pages/SafetyGuide.jsx';
import SOS from './pages/SOS.jsx';
import {
    IconHome, IconMap, IconBarChart, IconBook, IconSOS,
    IconLogo, IconAlertTriangle, IconTsunami, IconStorm, IconSatellite, IconSettings, IconMoon, IconZap,
} from './components/Icons.jsx';

const NAV_ITEMS = [
    { path: '/', label: 'Beranda', Icon: IconHome },
    { path: '/peta', label: 'Peta', Icon: IconMap },
    { path: '/statistik', label: 'Statistik', Icon: IconBarChart },
    { path: '/panduan', label: 'Panduan', Icon: IconBook },
    { path: '/sos', label: 'SOS', Icon: IconSOS },
];

const TICKER_MESSAGES = [
    { Icon: IconAlertTriangle, text: 'Pantau selalu informasi resmi dari BMKG untuk peringatan dini.' },
    { Icon: IconTsunami, text: 'Waspada potensi gelombang tinggi di perairan selatan Jawa & barat Sumatera.' },
    { Icon: IconStorm, text: 'Hujan lebat dengan kilat disertai angin kencang berpotensi terjadi di beberapa wilayah.' },
    { Icon: IconSatellite, text: 'Data gempa diperbarui secara real-time dari server BMKG.' },
];

export default function App() {
    const location = useLocation();
    const [tickerIdx, setTickerIdx] = useState(0);
    const [headerStep, setHeaderStep] = useState(0);
    const [lastUpdate, setLastUpdate] = useState('');
    
    // Settings state
    const [showSettings, setShowSettings] = useState(false);
    const [autoDarkMode, setAutoDarkMode] = useState(() => localStorage.getItem('autoDarkMode') !== 'false');
    const [minimalAnimation, setMinimalAnimation] = useState(() => localStorage.getItem('minimalAnimation') === 'true');

    useEffect(() => {
        if (minimalAnimation) {
            document.body.classList.add('minimal-animation');
        } else {
            document.body.classList.remove('minimal-animation');
        }
        localStorage.setItem('minimalAnimation', minimalAnimation);
    }, [minimalAnimation]);
    
    useEffect(() => {
        if (!autoDarkMode) {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
        localStorage.setItem('autoDarkMode', autoDarkMode);
    }, [autoDarkMode]);

        useEffect(() => {
        let mounted = true;
        
        // Sequence: Logo -> Title -> Title & Last Update toggling
        const t1 = setTimeout(() => {
            if (mounted) setHeaderStep(1);
        }, 1000);
        
        const interval = setInterval(() => {
            if (mounted) {
                setHeaderStep(prev => prev === 1 || prev === 0 ? 2 : 1);
            }
        }, 6000);

        return () => {
            mounted = false;
            clearTimeout(t1);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        let mounted = true;
        const fetchUpdate = () => {
            fetchLatestQuake()
                .then(data => {
                    if (mounted && data?.tanggal && data?.jam) {
                        setLastUpdate(`${data.tanggal} ${data.jam}`);
                    }
                })
                .catch(err => {
                    if (mounted) setLastUpdate('Data Gagal Dimuat');
                    console.error(err);
                });
        };

        fetchUpdate();
        const liveInterval = setInterval(fetchUpdate, 30_000);

        return () => {
            mounted = false;
            clearInterval(liveInterval);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTickerIdx(prev => (prev + 1) % TICKER_MESSAGES.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const ticker = TICKER_MESSAGES[tickerIdx];

    return (
        <div className="app">
            {/* Header */}
            <header className="header">
                <div className="header-inner">
                    <div className="header-brand">
                          <div className="header-text-wrapper" style={{ width: headerStep === 0 ? '32px' : '235px', maxWidth: '65vw',
                              
                              flex: headerStep === 0 ? 'none' : undefined,
                              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}>
                              
                              {/* Step 0: Logo Only */}
                              <div style={{
                                  position: 'absolute',
                                  left: '50%',
                                  top: '50%',
                                  transform: `translate(-50%, -50%) translateY(${headerStep === 0 ? '0px' : '-20px'})`,
                                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                  opacity: headerStep === 0 ? 1 : 0,
                                  pointerEvents: headerStep === 0 ? 'auto' : 'none'
                              }}>
                                  <IconLogo size={32} />
                              </div>

                              {/* Step 1: App Title */}
                              <div style={{
                                  position: 'absolute',
                                  left: 0,
                                  top: '50%',
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  transform: `translateY(-50%) translateY(${headerStep < 1 ? '20px' : headerStep > 1 ? '-20px' : '0px'})`,
                                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                  opacity: headerStep === 1 ? 1 : 0,
                                  pointerEvents: headerStep === 1 ? 'auto' : 'none'
                              }}>
                                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', marginTop: '2px' }}><IconLogo size={26} /></div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                      <h1 className="header-title">AlertNess</h1>
                                      <p className="header-subtitle" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Peringatan Dini Bencana</p>
                                  </div>
                              </div>

                              {/* Step 2: Last Update */}
                              <div style={{
                                  position: 'absolute',
                                  left: 0,
                                  top: '50%',
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  transform: `translateY(-50%) translateY(${headerStep < 2 ? '20px' : headerStep > 2 ? '-20px' : '0px'})`,
                                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                  opacity: headerStep === 2 ? 1 : 0,
                                  pointerEvents: headerStep === 2 ? 'auto' : 'none'
                              }}>
                                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', marginTop: '2px' }}><IconLogo size={26} /></div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                      <h1 style={{ fontSize: 'clamp(11px, 3vw, 13px)', fontWeight: '700', margin: 0, marginBottom: '2px', color: '#60a5fa' }}>Update Terakhir</h1>
                                      <p style={{ fontSize: 'clamp(9px, 2.5vw, 10.5px)', fontWeight: '500', margin: 0, color: '#94a3b8', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                          {lastUpdate ? lastUpdate : 'Memuat...'} <span style={{ color: '#e2e8f0' }}>&bull; BMKG</span>
                                      </p>
                                  </div>
                              </div>

                          </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="header-live">
                            <span className="live-dot"></span>
                            <span>LIVE</span>
                        </div>
                        <button 
                            onClick={() => setShowSettings(true)}
                            style={{ 
                                background: 'rgba(15, 23, 42, 0.6)', 
                                border: '1px solid var(--glass-border)', 
                                borderRadius: '50%', 
                                width: '36px', 
                                height: '36px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                color: '#94a3b8', 
                                cursor: 'pointer',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <IconSettings size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Ticker Bar */}
            <div className="ticker-bar">
                <div className="ticker-content" key={tickerIdx}>
                    <ticker.Icon size={16} />
                    <span>{ticker.text}</span>
                </div>
            </div>

            {/* Main Content */}
            <main className="main-content">
                <div className="page-transition" key={location.pathname}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/peta" element={<MapPage />} />
                        <Route path="/statistik" element={<Statistics />} />
                        <Route path="/panduan" element={<SafetyGuide />} />
                        <Route path="/sos" element={<SOS />} />
                    </Routes>
                </div>
            </main>

            {/* Settings Modal */}
            {showSettings && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 20
                }} onClick={() => setShowSettings(false)}>
                    <div style={{
                        background: 'var(--glass-bg-card)', border: '1px solid var(--glass-border)',
                        borderRadius: 16, width: '90%', maxWidth: 400, padding: 24, paddingBottom: 30,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h2 style={{ margin: 0, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <IconSettings size={20} /> Pengaturan
                            </h2>
                            <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 24, cursor: 'pointer', lineHeight: 1 }}>&times;</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}><IconMoon size={16} /> Dark mode otomatis</div>
                                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, paddingLeft: 24 }}>Untuk kondisi malam atau hemat baterai</div>
                                </div>
                                <div className="ui-switch"><input type="checkbox" checked={autoDarkMode} onChange={(e) => setAutoDarkMode(e.target.checked)} /><span className="ui-slider"></span></div>
                            </label>
                            
                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20 }}>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}><IconZap size={16} /> Animasi minimal</div>
                                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, paddingLeft: 24 }}>Hindari lambat di perangkat low-end (daerah terpencil)</div>
                                </div>
                                <div className="ui-switch"><input type="checkbox" checked={minimalAnimation} onChange={(e) => setMinimalAnimation(e.target.checked)} /><span className="ui-slider"></span></div>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                {NAV_ITEMS.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'nav-item--active' : ''}`
                        }
                    >
                        <span className="nav-icon"><item.Icon size={20} /></span>
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}


