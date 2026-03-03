const BMKG_BASE = 'https://data.bmkg.go.id/DataMKG/TEWS';
const PROXY = 'https://api.allorigins.win/raw?url=';

async function fetchWithFallback(endpoint) {
    const url = `${BMKG_BASE}/${endpoint}`;
    try {
        const res = await fetch(url);
        if (res.ok) return await res.json();
        throw new Error('Direct fetch failed');
    } catch {
        const res = await fetch(`${PROXY}${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error('Proxy fetch failed');
        return await res.json();
    }
}

export async function fetchLatestQuake() {
    const data = await fetchWithFallback('autogempa.json');
    return parseQuake(data.Infogempa.gempa);
}

export async function fetchRecentQuakes() {
    const data = await fetchWithFallback('gempaterkini.json');
    return data.Infogempa.gempa.map(parseQuake);
}

function parseQuake(g) {
    const [lat, lon] = (g.Coordinates || '').split(',').map(Number);
    return {
        tanggal: g.Tanggal,
        jam: g.Jam,
        dateTime: g.DateTime,
        lat,
        lon,
        lintang: g.Lintang,
        bujur: g.Bujur,
        magnitude: parseFloat(g.Magnitude),
        kedalaman: g.Kedalaman,
        kedalamanKm: parseInt(g.Kedalaman),
        wilayah: g.Wilayah,
        potensi: g.Potensi,
        dirasakan: g.Dirasakan || '-',
        shakemap: g.Shakemap
            ? `https://data.bmkg.go.id/DataMKG/TEWS/${g.Shakemap}`
            : null,
    };
}

export function formatMagnitude(m) {
    return m.toFixed(1).replace('.', ',');
}

export function getSeverity(magnitude) {
    if (magnitude >= 6.0) return 'danger';
    if (magnitude >= 5.0) return 'warning';
    return 'safe';
}

export function getSeverityLabel(magnitude) {
    if (magnitude >= 7.0) return 'Bahaya Besar';
    if (magnitude >= 6.0) return 'Bahaya';
    if (magnitude >= 5.0) return 'Waspada';
    return 'Aman';
}

export function timeAgo(dateTimeStr) {
    const now = new Date();
    const then = new Date(dateTimeStr);
    const diffMs = now - then;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit lalu`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} jam lalu`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} hari lalu`;
}

// Generate real monthly aggregated data for statistics
export function generateMonthlyStats(quakes) {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Inisialisasi array bulan sampai bulan ini dengan 0
    const counts = new Array(currentMonth + 1).fill(0);

    // Iterasi 15/60 gempa real BMKG dan hitung sesuai indeks bulannya
    quakes.forEach(q => {
        const d = new Date(q.dateTime);
        if (d.getFullYear() === currentYear && d.getMonth() <= currentMonth) {
            counts[d.getMonth()] += 1;
        }
    });

    return { 
        labels: months.slice(0, currentMonth + 1), 
        data: counts 
    };
}

// Generate region statistics
export function generateRegionStats(quakes) {
    const regionMap = {};
    quakes.forEach(q => {
        // Extract region name (last part after dash)
        const parts = q.wilayah.split(' ');
        const region = parts[parts.length - 1] || 'Lainnya';
        regionMap[region] = (regionMap[region] || 0) + 1;
    });
    const sorted = Object.entries(regionMap).sort((a, b) => b[1] - a[1]).slice(0, 6);
    return {
        labels: sorted.map(s => s[0]),
        data: sorted.map(s => s[1]),
    };
}
