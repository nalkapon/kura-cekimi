import { Link, useParams, Navigate } from 'react-router-dom';
import { getCompetition } from '../data/competitions';

export default function ComingSoonPage() {
  const { slug } = useParams();
  const competition = getCompetition(slug);

  if (!competition) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', padding: '3rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #020b2b 0%, #0e0420 55%, #1a0635 100%)' }}>
      <div style={{ maxWidth: 520, textAlign: 'center' }}>
        <div style={{
          width: 96, height: 96, borderRadius: 26, margin: '0 auto 1.75rem', fontSize: 46,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: competition.accentSoft, border: `1px solid ${competition.border}`,
        }}>{competition.emoji}</div>

        <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem,4vw,2.1rem)', fontWeight: 900, margin: '0 0 0.9rem' }}>
          {competition.name} Kurası Yakında
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 2rem' }}>
          Bu turnuva için kura motorunu hazırlıyoruz. Hazır olduğunda bu sayfa doğrudan aktif hale gelecek —
          şimdilik Şampiyonlar Ligi kurasını deneyebilirsin.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to={`/${competition.slug}`} style={{
            padding: '11px 24px', borderRadius: 12, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none',
            border: `1px solid ${competition.border}`, color: competition.accent, background: competition.accentSoft,
          }}>← {competition.shortName} Sayfasına Dön</Link>
          <Link to="/sampiyonlar-ligi" style={{
            padding: '11px 24px', borderRadius: 12, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none',
            border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24', background: 'rgba(251,191,36,0.1)',
          }}>🏆 Şampiyonlar Ligi'ni Dene</Link>
        </div>
      </div>
    </div>
  );
}