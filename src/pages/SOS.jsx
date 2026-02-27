import { useState } from 'react';
import {
    IconShield, IconCheckCircle, IconAlertTriangle, IconPhone,
} from '../components/Icons';

export default function SOS() {
    const [showSafeConfirm, setShowSafeConfirm] = useState(false);

    const handleSafe = () => {
        const message = encodeURIComponent(
            '✅ SAYA AMAN\n\nAssalamu\'alaikum, saya ingin memberitahu bahwa saya dalam keadaan aman setelah kejadian gempa/bencana. Mohon doa-nya.\n\n— Dikirim melalui AlertNess'
        );
        window.open(`https://wa.me/?text=${message}`, '_blank');
        setShowSafeConfirm(true);
        setTimeout(() => setShowSafeConfirm(false), 5000);
    };

    const handleSOS = () => {
        window.location.href = 'tel:112';
    };

    return (
        <div>
            <div className="sos-section">
                {/* Shield Icon */}
                <div style={{ marginBottom: 16 }}><IconShield size={56} /></div>

                <h2 className="section-title" style={{ justifyContent: 'center' }}>
                    Pusat Bantuan Darurat
                </h2>
                <p className="section-description" style={{ textAlign: 'center', maxWidth: 400, margin: '0 auto 32px' }}>
                    Gunakan tombol di bawah untuk memberi kabar kepada keluarga atau menghubungi layanan darurat.
                </p>

                {/* SAYA AMAN Button */}
                <button className="sos-btn sos-btn--safe" onClick={handleSafe}>
                    <IconCheckCircle size={22} />
                    SAYA AMAN — Kirim ke Keluarga
                </button>

                {showSafeConfirm && (
                    <div style={{
                        padding: '12px 16px',
                        background: 'rgba(74, 222, 128, 0.08)',
                        border: '1px solid rgba(74, 222, 128, 0.2)',
                        borderRadius: 12,
                        fontSize: 13,
                        color: '#4ade80',
                        fontWeight: 600,
                        marginBottom: 16,
                        animation: 'fadeSlideUp 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                    }}>
                        <IconCheckCircle size={16} />
                        WhatsApp terbuka. Pilih kontak keluarga untuk mengirim pesan keamanan Anda.
                    </div>
                )}

                <div style={{
                    fontSize: 12,
                    color: '#64748b',
                    marginBottom: 32,
                    lineHeight: 1.6,
                }}>
                    Tombol ini akan membuka WhatsApp dengan pesan terisi otomatis
                    untuk memberi kabar bahwa Anda dalam keadaan aman.
                </div>

                {/* Divider */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    marginBottom: 32,
                }}>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', letterSpacing: 1 }}>
                        DARURAT
                    </span>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
                </div>

                {/* SOS Button */}
                <button className="sos-btn sos-btn--emergency" onClick={handleSOS}>
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    PANGGIL 112 — Layanan Darurat
                </button>

                <div style={{
                    fontSize: 12,
                    color: '#64748b',
                    marginBottom: 32,
                    lineHeight: 1.6,
                }}>
                    Tombol ini akan langsung menghubungi nomor 112 —
                    layanan darurat terpadu Indonesia (Polisi, Ambulans, Pemadam).
                </div>
            </div>

            {/* Emergency Contacts */}
            <div className="sos-contact-card">
                <div className="card-header">
                    <IconPhone size={18} style={{ color: '#60a5fa' }} />
                    <div className="card-title">Kontak Darurat Indonesia</div>
                </div>
                <ul className="sos-contact-list">
                    {[
                        { icon: '🚨', name: 'Darurat Umum', num: '112' },
                        { icon: '🚑', name: 'Ambulans', num: '119' },
                        { icon: '🚒', name: 'Pemadam Kebakaran', num: '113' },
                        { icon: '🔍', name: 'SAR / Basarnas', num: '115' },
                        { icon: '👮', name: 'Kepolisian', num: '110' },
                        { icon: '🏛️', name: 'BNPB', num: '117' },
                        { icon: '☎️', name: 'PLN Gangguan', num: '123' },
                    ].map((c, i) => (
                        <li key={i}>
                            <span className="sos-contact-name">
                                <ContactIcon type={c.name} /> {c.name}
                            </span>
                            <a href={`tel:${c.num}`} className="sos-contact-number">{c.num}</a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Safety Tips */}
            <div style={{
                marginTop: 24,
                padding: 20,
                background: 'rgba(251, 146, 60, 0.08)',
                border: '1px solid rgba(251, 146, 60, 0.2)',
                borderRadius: 16,
                fontSize: 13,
                color: '#fb923c',
                lineHeight: 1.8,
                backdropFilter: 'blur(10px)',
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
            }}>
                <IconAlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                    <strong>Penting:</strong> Hubungi layanan darurat hanya dalam situasi genting yang membutuhkan
                    pertolongan segera. Untuk informasi bencana dan cuaca, pantau situs resmi{' '}
                    <a href="https://www.bmkg.go.id" target="_blank" rel="noopener noreferrer"
                        style={{ fontWeight: 700, textDecoration: 'underline' }}>
                        BMKG
                    </a>{' '}
                    dan{' '}
                    <a href="https://www.bnpb.go.id" target="_blank" rel="noopener noreferrer"
                        style={{ fontWeight: 700, textDecoration: 'underline' }}>
                        BNPB
                    </a>.
                </div>
            </div>
        </div>
    );
}

// Small inline SVG icons for contact list
function ContactIcon({ type }) {
    const s = { width: 16, height: 16, flexShrink: 0 };
    if (type.includes('Darurat')) return (
        <svg viewBox="0 0 24 24" style={s} fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );
    if (type.includes('Ambulans')) return (
        <svg viewBox="0 0 24 24" style={s} fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
    );
    if (type.includes('Pemadam')) return (
        <svg viewBox="0 0 24 24" style={s} fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2c1.6 2.2 4 5.2 4 8a4 4 0 01-8 0c0-2.8 2.4-5.8 4-8z" /><path d="M5 22h14M7 18h10" />
        </svg>
    );
    if (type.includes('SAR')) return (
        <svg viewBox="0 0 24 24" style={s} fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
    if (type.includes('Kepolisian')) return (
        <svg viewBox="0 0 24 24" style={s} fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );
    if (type.includes('BNPB')) return (
        <svg viewBox="0 0 24 24" style={s} fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
        </svg>
    );
    return (
        <svg viewBox="0 0 24 24" style={s} fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
    );
}
