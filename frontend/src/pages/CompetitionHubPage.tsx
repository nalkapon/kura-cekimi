import { Link, useParams, Navigate } from 'react-router-dom';
import { getCompetition } from '../data/competitions';

export default function CompetitionHubPage() {
  const { slug } = useParams();
  const competition = getCompetition(slug);

  if (!competition) {
    return <Navigate to="/" replace />;
  }

  const modes = [
    {
      to: `/${competition.slug}/takim`,
      emoji: '🎯',
      title: 'Takımını Seç',
      description: 'İstediğin takımı seç, kurada çıkacak 8 rakibini sırayla gör.',
    },
    {
      to: `/${competition.slug}/tum-kura`,
      emoji: '🎬',
      title: 'Tüm Kurayı İzle',
      description: 'Torbadan gerçek toplarla tüm turnuvanın kurasını canlı çek.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '3rem 1.5rem 4rem', background: 'linear-gradient(160deg, #020b2b 0%, #0e0420 55%, #1a0635 100%)' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', marginBottom: '2rem' }}>
          ← Ana Sayfa
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            width: 84, height: 84, borderRadius: 22, margin: '0 auto 1.5rem', fontSize: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: competition.accentSoft, border: `1px solid ${competition.border}`,
            boxShadow: `0 0 40px -8px ${competition.accentSoft}`,
          }}>{competition.emoji}</div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: competition.accentSoft, border: `1px solid ${competition.border}`, borderRadius: 9999, padding: '6px 20px', marginBottom: '1.25rem' }}>
            <span style={{ color: competition.accent, fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' }}>{competition.shortName}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.9rem, 5vw, 3.2rem)', fontWeight: 900, color: '#fff', margin: '0 0 0.9rem', lineHeight: 1.15 }}>
            {competition.name}
          </h1>
          <p style={{ color: '#93c5fd', fontSize: '1rem', maxWidth: 520, margin: '0 auto' }}>
            {competition.description}
          </p>

          {!competition.active && (
            <div style={{ marginTop: '1.25rem', display: 'inline-block', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, padding: '6px 18px', borderRadius: 9999 }}>
              ⚠ Bu turnuva için kura motoru yakında aktif olacak
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {modes.map((mode) => (
            <Link
              key={mode.to}
              to={mode.to}
              style={{
                display: 'block', borderRadius: 22, padding: '2rem', textDecoration: 'none',
                background: 'rgba(2,10,40,0.75)', border: `1px solid ${competition.border}`,
                position: 'relative', transition: 'transform .18s ease, box-shadow .18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 24px 48px -16px ${competition.accentSoft}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: competition.accentSoft,
                border: `1px solid ${competition.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, marginBottom: '1.25rem',
              }}>{mode.emoji}</div>
              <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 900, margin: '0 0 0.5rem' }}>{mode.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.55, margin: 0 }}>{mode.description}</p>
              <div style={{ marginTop: '1.25rem', color: competition.accent, fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                {competition.active ? 'Başlat' : 'Önizle'} <span aria-hidden>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}