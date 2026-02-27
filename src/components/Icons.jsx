/**
 * AlertNess — Animated SVG Icon System
 * All icons are inline SVG with CSS animations for topic-specific effects.
 */

// Base wrapper for consistent sizing
const I = ({ children, size = 20, className = '', style = {} }) => (
    <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{ flexShrink: 0, ...style }}
    >
        {children}
    </svg>
);

/* ====== Navigation Icons ====== */

export function IconHome({ size = 20, className }) {
    return (
        <I size={size} className={className}>
            <path d="M3 9.5L12 2l9 7.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9.5z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </I>
    );
}

export function IconMap({ size = 20, className }) {
    return (
        <I size={size} className={className}>
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
        </I>
    );
}

export function IconBarChart({ size = 20, className }) {
    return (
        <I size={size} className={className}>
            <line x1="12" y1="20" x2="12" y2="10" />
            <line x1="18" y1="20" x2="18" y2="4" />
            <line x1="6" y1="20" x2="6" y2="16" />
        </I>
    );
}

export function IconBook({ size = 20, className }) {
    return (
        <I size={size} className={className}>
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            <line x1="9" y1="7" x2="17" y2="7" />
            <line x1="9" y1="11" x2="14" y2="11" />
        </I>
    );
}

export function IconSOS({ size = 20, className }) {
    return (
        <I size={size} className={`icon-sos-pulse ${className || ''}`}>
            <circle cx="12" cy="12" r="10" fill="rgba(248,113,113,0.15)" stroke="#f87171" />
            <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="800" fill="#f87171" stroke="none">SOS</text>
        </I>
    );
}

/* ====== Seismic / Earthquake Icons ====== */

export function IconSeismic({ size = 24, className }) {
    return (
        <I size={size} className={`icon-shake ${className || ''}`}>
            <polyline points="2 12 5 12 7 6 10 18 13 8 16 16 19 12 22 12" stroke="currentColor" />
        </I>
    );
}

export function IconEpicenter({ size = 20, className }) {
    return (
        <I size={size} className={`icon-pulse ${className || ''}`}>
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <circle cx="12" cy="12" r="7" strokeDasharray="2 2" opacity="0.5" />
            <circle cx="12" cy="12" r="11" strokeDasharray="3 3" opacity="0.3" />
        </I>
    );
}

export function IconLocation({ size = 16, className }) {
    return (
        <I size={size} className={className}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
        </I>
    );
}

export function IconDepth({ size = 16, className }) {
    return (
        <I size={size} className={className}>
            <line x1="12" y1="2" x2="12" y2="22" />
            <polyline points="8 18 12 22 16 18" />
            <line x1="6" y1="4" x2="18" y2="4" />
        </I>
    );
}

export function IconClock({ size = 16, className }) {
    return (
        <I size={size} className={className}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </I>
    );
}

export function IconCoordinates({ size = 16, className }) {
    return (
        <I size={size} className={className}>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </I>
    );
}

/* ====== Tsunami — Animated Wave ====== */

export function IconTsunami({ size = 24, className }) {
    return (
        <I size={size} className={`icon-wave ${className || ''}`}>
            <path d="M2 16c1.5-2 3-3 5-3s3.5 2 5 2 3.5-2 5-2 3.5 1 5 3" className="wave-path wave-1" />
            <path d="M2 20c1.5-2 3-3 5-3s3.5 2 5 2 3.5-2 5-2 3.5 1 5 3" className="wave-path wave-2" />
            <path d="M2 12c1.5-2 3-3 5-3s3.5 2 5 2 3.5-2 5-2 3.5 1 5 3" className="wave-path wave-3" opacity="0.4" />
            <line x1="5" y1="4" x2="5" y2="9" strokeWidth="2" />
            <polyline points="3 6 5 4 7 6" />
        </I>
    );
}

/* ====== Weather — Storm with Rain & Lightning ====== */

export function IconStorm({ size = 24, className }) {
    return (
        <I size={size} className={`icon-storm ${className || ''}`}>
            {/* Dark Cloud */}
            <path d="M18 10h1a4 4 0 010 8H6a5 5 0 01-.5-9.96A7 7 0 0118 10z" fill="rgba(100,116,139,0.3)" />
            {/* Lightning bolt */}
            <polyline points="13 11 11 15 14 15 12 19" stroke="#fbbf24" strokeWidth="2" fill="none" className="lightning-bolt" />
            {/* Rain drops */}
            <line x1="7" y1="20" x2="7" y2="23" className="raindrop r1" strokeWidth="2" opacity="0.6" />
            <line x1="11" y1="21" x2="11" y2="24" className="raindrop r2" strokeWidth="2" opacity="0.6" />
            <line x1="15" y1="20" x2="15" y2="23" className="raindrop r3" strokeWidth="2" opacity="0.6" />
        </I>
    );
}

/* ====== Status Icons ====== */

export function IconShield({ size = 48, className }) {
    return (
        <I size={size} className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(96,165,250,0.15)" stroke="#60a5fa" />
            <polyline points="9 12 11 14 15 10" stroke="#60a5fa" strokeWidth="2" />
        </I>
    );
}

export function IconCheckCircle({ size = 16, className }) {
    return (
        <I size={size} className={className} style={{ color: '#4ade80' }}>
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </I>
    );
}

export function IconAlertTriangle({ size = 16, className }) {
    return (
        <I size={size} className={`icon-alert-flash ${className || ''}`} style={{ color: '#fb923c' }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </I>
    );
}

export function IconAlertCircle({ size = 16, className }) {
    return (
        <I size={size} className={className} style={{ color: '#f87171' }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </I>
    );
}

export function IconSatellite({ size = 16, className }) {
    return (
        <I size={size} className={className}>
            <path d="M2 12L7 2" />
            <path d="M12 22l5-10" />
            <path d="M7 2l5 10 5-10" />
            <circle cx="12" cy="12" r="3" />
            <path d="M4.93 4.93a10 10 0 000 14.14" opacity="0.4" />
            <path d="M19.07 4.93a10 10 0 010 14.14" opacity="0.4" />
        </I>
    );
}

/* ====== Safety Guide Icons ====== */

export function IconHouse({ size = 22, className }) {
    return (
        <I size={size} className={`icon-prepare ${className || ''}`}>
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </I>
    );
}

export function IconLightning({ size = 22, className }) {
    return (
        <I size={size} className={`icon-shake ${className || ''}`} style={{ color: '#fbbf24' }}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" />
        </I>
    );
}

export function IconWrench({ size = 22, className }) {
    return (
        <I size={size} className={className}>
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </I>
    );
}

/* ====== Misc / Contact Icons ====== */

export function IconPhone({ size = 18, className }) {
    return (
        <I size={size} className={className}>
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
        </I>
    );
}

export function IconList({ size = 18, className }) {
    return (
        <I size={size} className={className}>
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
        </I>
    );
}

export function IconMegaphone({ size = 18, className }) {
    return (
        <I size={size} className={className}>
            <path d="M3 11l18-5v12L3 13v-2z" />
            <path d="M11.6 16.8a3 3 0 11-5.8-1.6" />
        </I>
    );
}

export function IconScatter({ size = 18, className }) {
    return (
        <I size={size} className={className}>
            <circle cx="7" cy="15" r="2" fill="currentColor" />
            <circle cx="12" cy="9" r="2.5" fill="currentColor" />
            <circle cx="18" cy="13" r="1.5" fill="currentColor" />
            <circle cx="5" cy="7" r="1" fill="currentColor" opacity="0.5" />
            <circle cx="16" cy="5" r="1.5" fill="currentColor" opacity="0.5" />
        </I>
    );
}

export function IconGlobe({ size = 18, className }) {
    return (
        <I size={size} className={className}>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </I>
    );
}

/* ====== Logo Icon ====== */

export function IconLogo({ size = 28, className }) {
    return (
        <svg viewBox="0 0 32 32" width={size} height={size} className={`icon-logo ${className || ''}`} fill="none">
            {/* Shield base */}
            <path
                d="M16 2L4 7v9c0 8.5 12 14 12 14s12-5.5 12-14V7L16 2z"
                fill="rgba(96,165,250,0.15)"
                stroke="#60a5fa"
                strokeWidth="1.5"
            />
            {/* Seismic line inside shield */}
            <polyline
                points="8 17 11 17 13 12 16 22 19 14 21 17 24 17"
                stroke="#60a5fa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="seismic-line"
            />
            {/* Pulse rings */}
            <circle cx="16" cy="17" r="5" stroke="#60a5fa" strokeWidth="0.5" opacity="0.3" className="logo-ring r1" />
            <circle cx="16" cy="17" r="9" stroke="#60a5fa" strokeWidth="0.5" opacity="0.15" className="logo-ring r2" />
        </svg>
    );
}
