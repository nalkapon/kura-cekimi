import { Link } from 'react-router-dom';
import { COMPETITIONS } from '../data/competitions';

interface ToolCard {
  to: string;
  emoji: string;
  title: string;
  description: string;
  accent: string;
  border: string;
  glow: string;
}

const LEAGUE_TOOLS: ToolCard[] = COMPETITIONS.map((c) => ({
  to: `/${c.slug}`,
  emoji: c.emoji,
  title: c.active ? c.name : `${c.name} (Yakında)`,
  description: c.description,
  accent: c.accent,
  border: c.border,
  glow: c.accentSoft,
}));

const GENERAL_TOOLS: ToolCard[] = [
  {
    to: '/carkifelek',
    emoji: '🎡',
    title: 'Çarkıfelek',
    description: 'İsim listeni yaz, çarkı çevir, kazananı anında öğren.',
    accent: '#a78bfa',
    border: 'rgba(167,139,250,0.3)',
    glow: 'rgba(167,139,250,0.18)',
  },
  {
    to: '/kagit-cek',
    emoji: '🎫',
    title: 'Kağıt Çek',
    description: 'Torbadaki katlı kağıtlardan birine tıkla, aç ve gör.',
    accent: '#34d399',
    border: 'rgba(52,211,153,0.3)',
    glow: 'rgba(52,211,153,0.18)',
  },
  {
    to: '/zar-at',
    emoji: '🎲',
    title: 'Zar At',
    description: '1-6 arası zar seç, at, toplamı ve geçmişi takip et.',
    accent: '#f472b6',
    border: 'rgba(244,114,182,0.3)',
    glow: 'rgba(244,114,182,0.18)',
  },
  {
    to: '/kart-karistir',
    emoji: '🃏',
    title: 'Kart Karıştır',
    description: '52 kartlık desteyi karıştır, üstten tek tek çek.',
    accent: '#fb923c',
    border: 'rgba(251,146,60,0.3)',
    glow: 'rgba(251,146,60,0.18)',
  },
  {
    to: '/tombala',
    emoji: '🎱',
    title: 'Tombala',
    description: 'Keseden numara çek, 1-90 tabloda sırayla işaretlensin.',
    accent: '#facc15',
    border: 'rgba(250,204,21,0.3)',
    glow: 'rgba(250,204,21,0.18)',
  },
  {
    to: '/hali-saha',
    emoji: '👥',
    title: 'Hali Saha Takim Kurucu',
    description: '10, 12 veya 14 kisiyi yildiz gucune gore dengeli iki takima bol.',
    accent: '#22d3ee',
    border: 'rgba(34,211,238,0.3)',
    glow: 'rgba(34,211,238,0.18)',
  },
  {
    to: '/vampir-koylu',
    emoji: '🦇',
    title: 'Vampir Koylu',
    description: 'Rolleri gizli dagit, karti basili tutarak gor ve siradaki kisiye devret.',
    accent: '#c084fc',
    border: 'rgba(192,132,252,0.3)',
    glow: 'rgba(192,132,252,0.18)',
  },
  {
    to: '/kazi-kazan',
    emoji: '🪙',
    title: 'Kazi Kazan',
    description: 'Ust katmani kaziyarak gizli sonucu ac; %60 kaziyinca kart tamamlanir.',
    accent: '#2dd4bf',
    border: 'rgba(45,212,191,0.3)',
    glow: 'rgba(45,212,191,0.18)',
  },
];

function ToolCardItem({ tool }: { tool: ToolCard }) {
  return (
    <Link
      to={tool.to}
      style={{
        display: 'block', borderRadius: 20, padding: '1.75rem',
        background: 'rgba(2,10,40,0.75)', border: `1px solid ${tool.border}`,
        textDecoration: 'none', position: 'relative', overflow: 'hidden',
        transition: 'transform .18s ease, box-shadow .18s ease, border-color .18s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 20px 40px -16px ${tool.glow}`;
        e.currentTarget.style.borderColor = tool.accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = tool.border;
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 14, background: `${tool.accent}1a`,
        border: `1px solid ${tool.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, marginBottom: '1.1rem',
      }}>{tool.emoji}</div>
      <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 900, margin: '0 0 0.4rem' }}>{tool.title}</h3>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{tool.description}</p>
      <div style={{ marginTop: '1.1rem', color: tool.accent, fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
        Kuraya git <span aria-hidden>→</span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', padding: '3rem 1.5rem 4rem', background: 'linear-gradient(160deg, #020b2b 0%, #0e0420 55%, #1a0635 100%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── HERO ── */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: '-40px 0 auto 0', display: 'flex', justifyContent: 'center',
            gap: '2.5rem', fontSize: '1.8rem', opacity: 0.14, pointerEvents: 'none', filter: 'blur(0.5px)',
          }}>
            <span style={{ animation: 'kuracekFloat 5.5s ease-in-out infinite' }}>⚽</span>
            <span style={{ animation: 'kuracekFloat 6.5s ease-in-out infinite .6s' }}>🎡</span>
            <span style={{ animation: 'kuracekFloat 5s ease-in-out infinite 1.2s' }}>🎲</span>
            <span style={{ animation: 'kuracekFloat 7s ease-in-out infinite .3s' }}>🃏</span>
            <span style={{ animation: 'kuracekFloat 6s ease-in-out infinite .9s' }}>🎫</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg,rgba(250,204,21,0.1),rgba(99,102,241,0.1))', border: '1px solid rgba(250,204,21,0.22)', borderRadius: 9999, padding: '8px 28px', marginBottom: '1.5rem', position: 'relative' }}>
            <span style={{ color: '#fbbf24', fontSize: 13 }}>★</span>
            <span style={{ color: '#bfdbfe', fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' }}>kuracek.com</span>
            <span style={{ color: '#fbbf24', fontSize: 13 }}>★</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 6vw, 4.2rem)', fontWeight: 900, lineHeight: 1.08, margin: '0 0 1.1rem', position: 'relative',
            background: 'linear-gradient(135deg,#fff 0%,#bfdbfe 55%,#818cf8 100%)', WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Kurayı Sen Çek
          </h1>
          <p style={{ color: '#93c5fd', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto', position: 'relative' }}>
            Şampiyonlar Ligi'nden çarkıfeleğe, aşağıdan istediğin yöntemi seç ve çekilişi başlat.
          </p>
        </div>

        {/* ── LEAGUE TOOLS ── */}
        <div style={{ marginBottom: '2.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.1rem' }}>
            <span style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>UEFA Kuraları</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(251,191,36,0.15)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.1rem' }}>
            {LEAGUE_TOOLS.map((tool) => <ToolCardItem key={tool.to} tool={tool} />)}
          </div>
        </div>

        {/* ── GENERAL TOOLS ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.1rem' }}>
            <span style={{ color: '#a78bfa', fontSize: '0.75rem', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>Genel Kura Araçları</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(167,139,250,0.15)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.1rem' }}>
            {GENERAL_TOOLS.map((tool) => <ToolCardItem key={tool.to} tool={tool} />)}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes kuracekFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
      `}</style>
    </div>
  );
}