import { useState, useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Bar, Scatter, Doughnut } from 'react-chartjs-2';
import {
    fetchRecentQuakes,
    generateMonthlyStats,
    generateRegionStats,
} from '../utils/api';
import { IconBarChart, IconScatter, IconGlobe } from '../components/Icons';
import { 
    WeeklySeismicChart, 
    MagnitudeDistributionChart, 
    DepthHorizontalChart, 
    DailyTimeline 
} from '../components/CustomCharts';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
);

// Chart color palette
const CHART_COLORS = [
    '#60a5fa', '#818cf8', '#a78bfa', '#c084fc',
    '#fb923c', '#f87171', '#4ade80', '#fbbf24',
];

const SEVERITY_PALETTE = {
    danger: 'rgba(248, 113, 113, 0.8)',
    warning: 'rgba(251, 146, 60, 0.8)',
    safe: 'rgba(74, 222, 128, 0.8)',
};

function ChartSkeleton() {
    return (
        <div>
            <div className="skeleton skeleton-card" style={{ height: 340 }}></div>
            <div className="skeleton skeleton-card" style={{ height: 340 }}></div>
            <div className="skeleton skeleton-card" style={{ height: 340 }}></div>
        </div>
    );
}

// Intersection Observer hook for chart reveal animation
function useInView(ref) {
    const [inView, setInView] = useState(false);
    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold: 0.15 }
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref]);
    return inView;
}

function ChartCard({ icon, title, description, insight, children, wrapperStyle }) {
    const ref = useRef(null);
    const inView = useInView(ref);

    return (
        <div ref={ref} className={`chart-card ${inView ? 'fade-in' : ''}`} style={{ opacity: inView ? 1 : 0 }}>
            <h3 className="chart-title">
                {icon} {title}
            </h3>
            <p className="chart-desc">{description}</p>
            <div className="chart-wrapper" style={wrapperStyle}>
                {inView && children}
            </div>
            {insight && (
                <div className="insight-box">
                    <div className="insight-box-title">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-2px', marginRight: 4 }}>
                            <path d="M9 18h6M10 22h4M12 2a7 7 0 015 11.9V17H7v-3.1A7 7 0 0112 2z" />
                        </svg>
                        Kesimpulan & Analisis
                    </div>
                    <p className="insight-box-text">{insight}</p>
                </div>
            )}
        </div>
    );
}

export default function Statistics() {
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

    if (loading) return <ChartSkeleton />;

    const monthlyStats = generateMonthlyStats(quakes);
    const regionStats = generateRegionStats(quakes);

    // Scatter data: depth vs magnitude
    const scatterData = quakes.map(q => ({
        x: q.kedalamanKm,
        y: q.magnitude,
        r: Math.max(5, (q.magnitude - 4) * 6),
        color: q.magnitude >= 6 ? SEVERITY_PALETTE.danger :
            q.magnitude >= 5 ? SEVERITY_PALETTE.warning :
                SEVERITY_PALETTE.safe,
    }));

    // Insight texts
    const totalQuakes = quakes.length;
    const avgMag = (quakes.reduce((s, q) => s + q.magnitude, 0) / totalQuakes).toFixed(1).replace('.', ',');
    const maxQuake = quakes.reduce((max, q) => q.magnitude > max.magnitude ? q : max, quakes[0]);

    const monthInsight = `Dalam periode terbaru, tercatat ${totalQuakes} gempa signifikan (M ≥ 5,0). Rata-rata magnitudo ${avgMag} SR. Gempa terkuat tercatat M ${maxQuake.magnitude.toFixed(1).replace('.', ',')} di wilayah ${maxQuake.wilayah}.`;

    const depthShallow = quakes.filter(q => q.kedalamanKm <= 30).length;
    const depthPercent = Math.round((depthShallow / totalQuakes) * 100);
    const scatterInsight = `Sebanyak ${depthPercent}% gempa terjadi pada kedalaman dangkal (≤30 km). Semakin dangkal dan besar magnitudo, dampak kerusakan yang dirasakan di permukaan bisa semakin parah.`;

    const topRegion = regionStats.labels[0] || 'Tidak diketahui';
    const regionInsight = `Wilayah dengan aktivitas seismik tertinggi dalam periode ini adalah ${topRegion}. Sebaran gempa menunjukkan zona subduksi aktif di wilayah timur Indonesia masih menjadi penyumbang utama aktivitas tektonik.`;

    const chartTooltip = {
        backgroundColor: 'rgba(15,23,42,0.9)',
        titleFont: { family: 'Figtree', weight: '600' },
        bodyFont: { family: 'Figtree' },
        cornerRadius: 8,
        padding: 12,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
    };

    return (
        <div>
            <h2 className="section-title">
                <IconBarChart size={22} /> Pusat Statistik & Analitik
            </h2>
            <p className="section-description">
                Visualisasi data seismik dari BMKG untuk memahami pola dan tren aktivitas
                gempa bumi di Indonesia. Setiap grafik dilengkapi analisis profesional.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                <WeeklySeismicChart quakes={quakes} />
                <MagnitudeDistributionChart quakes={quakes} />
                <DepthHorizontalChart quakes={quakes} />
                <DailyTimeline quakes={quakes} />
            </div>

            {/* Bar Chart — Monthly Trend */}
            <ChartCard
                icon={<IconBarChart size={18} style={{ color: '#60a5fa' }} />}
                title="Tren Gempa Bumi Bulanan"
                description="Grafik ini menunjukkan fluktuasi aktivitas tektonik bulanan. Anomali tinggi biasanya terjadi pasca gempa utama."
                insight={monthInsight}
            >
                <Bar
                    data={{
                        labels: monthlyStats.labels,
                        datasets: [{
                            label: 'Jumlah Gempa (M ≥ 5,0)',
                            data: monthlyStats.data,
                            backgroundColor: monthlyStats.data.map((_, i) =>
                                i === monthlyStats.data.length - 1 ? '#60a5fa' : 'rgba(96, 165, 250, 0.4)'
                            ),
                            borderRadius: 6,
                            borderSkipped: false,
                        }],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        animation: { duration: 1200, easing: 'easeOutQuart' },
                        plugins: {
                            legend: { display: false },
                            tooltip: chartTooltip,
                        },
                        scales: {
                            x: {
                                grid: { display: false },
                                ticks: { font: { family: 'Figtree', weight: '600', size: 12 }, color: '#94a3b8' },
                            },
                            y: {
                                beginAtZero: true,
                                grid: { color: 'rgba(255,255,255,0.06)' },
                                ticks: {
                                    font: { family: 'Figtree', size: 11 },
                                    color: '#94a3b8',
                                    stepSize: 1,
                                },
                            },
                        },
                    }}
                />
            </ChartCard>

            {/* Scatter/Bubble Chart — Depth vs Magnitude */}
            <ChartCard
                icon={<IconScatter size={18} style={{ color: '#fb923c' }} />}
                title="Hubungan Kedalaman & Magnitudo"
                description="Semakin dangkal dan besar magnitudo (bulatan besar merah di area bawah), dampak kerusakan yang dirasakan di permukaan bisa semakin parah."
                insight={scatterInsight}
            >
                <Scatter
                    data={{
                        datasets: [{
                            label: 'Gempa',
                            data: scatterData.map(d => ({ x: d.x, y: d.y })),
                            backgroundColor: scatterData.map(d => d.color),
                            pointRadius: scatterData.map(d => d.r),
                            pointHoverRadius: scatterData.map(d => d.r + 3),
                        }],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        animation: { duration: 1200, easing: 'easeOutQuart' },
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                ...chartTooltip,
                                callbacks: {
                                    label: (ctx) => {
                                        const q = quakes[ctx.dataIndex];
                                        return [
                                            `Magnitudo: ${q.magnitude.toFixed(1).replace('.', ',')} SR`,
                                            `Kedalaman: ${q.kedalaman}`,
                                            `Wilayah: ${q.wilayah}`,
                                        ];
                                    },
                                },
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Kedalaman (km)', color: '#94a3b8',
                                    font: { family: 'Figtree', weight: '600', size: 12 },
                                },
                                grid: { color: 'rgba(255,255,255,0.06)' },
                                ticks: { font: { family: 'Figtree', size: 11 }, color: '#94a3b8' },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Magnitudo (SR)', color: '#94a3b8',
                                    font: { family: 'Figtree', weight: '600', size: 12 },
                                },
                                grid: { color: 'rgba(255,255,255,0.06)' },
                                ticks: { font: { family: 'Figtree', size: 11 }, color: '#94a3b8' },
                            },
                        },
                    }}
                />
            </ChartCard>

            {/* Doughnut Chart — Regions */}
            <ChartCard
                icon={<IconGlobe size={18} style={{ color: '#a78bfa' }} />}
                title="Wilayah Seismik Tertinggi"
                description="Distribusi gempa berdasarkan wilayah dalam periode terbaru."
                insight={regionInsight}
                wrapperStyle={{ maxHeight: 'none' }}
            >
                <div style={{ maxWidth: 320, margin: '0 auto', paddingBottom: '30px' }}>
                    <Doughnut
                        data={{
                            labels: regionStats.labels,
                            datasets: [{
                                data: regionStats.data,
                                backgroundColor: CHART_COLORS.slice(0, regionStats.labels.length),
                                borderWidth: 2,
                                borderColor: 'rgba(255,255,255,0.1)',
                                hoverOffset: 8,
                            }],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            animation: { duration: 1200, easing: 'easeOutQuart', animateRotate: true },
                            cutout: '65%',
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        font: { family: 'Figtree', size: 11, weight: '500' },
                                        color: '#94a3b8',
                                        padding: 16,
                                        usePointStyle: true,
                                        pointStyleWidth: 10,
                                    },
                                },
                                tooltip: chartTooltip,
                            },
                        }}
                    />
                </div>
            </ChartCard>
        </div>
    );
}
