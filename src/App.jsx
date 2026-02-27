import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import MapPage from './pages/MapPage.jsx';
import Statistics from './pages/Statistics.jsx';
import SafetyGuide from './pages/SafetyGuide.jsx';
import SOS from './pages/SOS.jsx';
import {
    IconHome, IconMap, IconBarChart, IconBook, IconSOS,
    IconLogo, IconAlertTriangle, IconTsunami, IconStorm, IconSatellite,
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
                        <IconLogo size={32} />
                        <div>
                            <h1 className="header-title">AlertNess</h1>
                            <p className="header-subtitle">Peringatan Dini Gempa & Bencana</p>
                        </div>
                    </div>
                    <div className="header-live">
                        <span className="live-dot"></span>
                        <span>LIVE</span>
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
