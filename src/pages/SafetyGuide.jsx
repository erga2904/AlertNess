import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    IconHouse, IconLightning, IconWrench, IconTsunami, IconStorm, IconPhone,
} from '../components/Icons';

const GUIDES = [
    {
        Icon: IconHouse,
        title: 'Sebelum Gempa Bumi',
        subtitle: 'Persiapan & mitigasi bencana',
        items: [
            'Kenali jalur evakuasi di rumah, kantor, dan sekolah Anda.',
            'Siapkan tas siaga bencana berisi air minum, makanan kering, obat-obatan, senter, dan dokumen penting.',
            'Pastikan struktur bangunan Anda tahan gempa, periksa secara berkala.',
            'Pelajari cara mematikan aliran listrik, gas, dan air di rumah.',
            'Simpan nomor darurat: 112 (Darurat), 115 (Basarnas), 119 (Ambulans).',
            'Ikuti simulasi evakuasi gempa di lingkungan tempat tinggal Anda.',
            'Amankan perabotan berat (lemari, rak buku) ke dinding menggunakan pengikat.',
            'Tentukan titik kumpul keluarga jika terjadi bencana.',
        ],
    },
    {
        Icon: IconLightning,
        title: 'Saat Gempa Bumi Terjadi',
        subtitle: 'Langkah perlindungan diri',
        items: [
            'TETAP TENANG. Jangan panik dan jangan berlari keluar saat guncangan.',
            'Berlindung di bawah meja kokoh atau di sudut ruangan (DROP, COVER, HOLD ON).',
            'Jauhi jendela, kaca, cermin, dan benda yang bisa jatuh.',
            'Jika di luar ruangan, jauhi gedung, tiang listrik, dan pohon besar.',
            'Jika sedang mengemudi, tepikan kendaraan di area terbuka dan tetap di dalam.',
            'Hindari menggunakan lift saat terjadi gempa. Gunakan tangga darurat.',
            'Jika terjebak di reruntuhan, jangan nyalakan api. Tutupi mulut dan ketuk dinding agar tim penyelamat bisa mendengar.',
        ],
    },
    {
        Icon: IconWrench,
        title: 'Setelah Gempa Bumi',
        subtitle: 'Tindakan pasca-bencana',
        items: [
            'Waspada terhadap gempa susulan (aftershock) yang bisa terjadi setelah gempa utama.',
            'Periksa kerusakan bangunan sebelum masuk kembali. Jangan masuk jika terlihat retak parah.',
            'Matikan aliran gas dan listrik jika ada kerusakan instalasi.',
            'Pantau informasi resmi dari BMKG dan BNPB melalui media terpercaya.',
            'Hindari menyebarkan informasi yang belum terverifikasi (hoaks).',
            'Laporkan kondisi Anda kepada keluarga menggunakan fitur "Saya Aman".',
            'Jika mengungsi, bawa tas siaga dan ikuti instruksi petugas evakuasi.',
        ],
    },
    {
        Icon: IconTsunami,
        title: 'Kesiapsiagaan Tsunami',
        subtitle: 'Peringatan khusus wilayah pesisir',
        items: [
            'Jika merasakan gempa kuat di wilayah pantai, SEGERA mengungsi ke tempat tinggi tanpa menunggu peringatan.',
            'Tanda alami tsunami: air laut surut drastis, suara gemuruh dari laut.',
            'Jauhi pantai, sungai, dan area rendah setelah gempa besar.',
            'Ikuti jalur evakuasi tsunami yang tersedia di wilayah Anda.',
            'Tetap di tempat tinggi minimal 2 jam atau sampai ada informasi resmi bahwa kondisi aman.',
            'Tsunami bisa datang dalam beberapa gelombang. Gelombang pertama belum tentu yang terbesar.',
        ],
    },
    {
        Icon: IconStorm,
        title: 'Cuaca Ekstrem & Banjir',
        subtitle: 'Menghadapi bencana hidrometeorologi',
        items: [
            'Pantau prakiraan cuaca harian dari BMKG sebelum beraktivitas.',
            'Siapkan jas hujan, payung, dan pastikan saluran air di sekitar rumah tidak tersumbat.',
            'Jika terjadi banjir, matikan listrik dari meteran utama untuk mencegah tersetrum.',
            'Hindari berjalan atau mengemudi menerjang genangan air atau arus deras.',
            'Pindahkan barang berharga ke tempat yang lebih tinggi.',
        ],
    },
    {
        Icon: IconPhone,
        title: 'Panduan P3K Darurat',
        subtitle: 'Pertolongan pertama pada korban',
        items: [
            'Pastikan lingkungan aman sebelum menolong korban (jangan masuk ke gedung runtuh).',
            'Cek kesadaran korban. Panggil namanya atau tepuk bahunya.',
            'Cek pernapasan. Jika tidak bernapas, lakukan CPR (RJP) jika Anda terlatih.',
            'Hentikan pendarahan aktif dengan menekan luka menggunakan kain bersih yang tebal.',
            'Jangan pindahkan korban cedera tulang belakang (leher/punggung) kecuali ada ancaman mematikan (seperti api atau reruntuhan).',
            'Bilas luka bakar dengan air mengalir selama 10-15 menit. Jangan pecahkan lepuhan.',
            'Baringkan korban yang syok, tinggikan kakinya, dan selimuti.',
            'Hubungi fasilitas medis atau bawa ke posko terdekat.'
        ],
    }
];

function AccordionItem({ guide, isOpen, toggle }) {
    return (<div className={'accordion-item ' + (isOpen ? 'accordion-item--open' : '')}>
            <div className="accordion-header" onClick={toggle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="accordion-icon">
                        <guide.Icon size={18} />
                    </div>
                    <div>
                        <div className="accordion-title">{guide.title}</div>
                        <div className="accordion-subtitle">{guide.subtitle}</div>
                    </div>
                </div>
                <div className="accordion-chevron">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </div>
            <div className="accordion-body" style={{ maxHeight: isOpen ? '500px' : '0' }}>
                <div className="accordion-content">
                    <ul className="guide-list">
                        {guide.items.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default function SafetyGuide() {
    const location = useLocation();
    const [openIndex, setOpenIndex] = useState(0);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        if (query.get('layer') === 'p3k') {
            setOpenIndex(GUIDES.length - 1);
        }
    }, [location.search]);

    return (
        <div>
            <h2 className="section-title">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                    <line x1="9" y1="7" x2="17" y2="7" />
                    <line x1="9" y1="11" x2="14" y2="11" />
                </svg>
                Ensiklopedia Keselamatan
            </h2>
            <p className="section-description">
                Panduan lengkap yang disusun berdasarkan standar BNPB & PMI. Pelajari langkah perlindungan diri sebelum, saat, dan setelah bencana.
            </p>

            <div className="card mb-lg" style={{ background: 'rgba(248, 113, 113, 0.08)', borderColor: 'rgba(248, 113, 113, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <IconPhone size={24} className="" style={{ color: '#f87171' }} />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#f87171' }}>Nomor Darurat Indonesia</div>
                        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                            <strong>112</strong> (Darurat) • <strong>115</strong> (Basarnas) • <strong>119</strong> (Ambulans)
                        </div>
                    </div>
                </div>
            </div>

            <div className="accordion">
                {GUIDES.map((guide, i) => (
                    <AccordionItem
                        key={i}
                        guide={guide}
                        isOpen={openIndex === i}
                        toggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                    />
                ))}
            </div>

            <div style={{ marginTop: 24, padding: 16, background: 'rgba(96, 165, 250, 0.06)', backdropFilter: 'blur(10px)', border: '1px solid rgba(96, 165, 250, 0.15)', borderRadius: 12, fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>
                <strong>Sumber referensi:</strong> BNPB, BMKG, serta PMI. Panduan umum.
            </div>
        </div>
    );
}
