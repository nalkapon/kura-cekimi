import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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

function ToolCardItem({ tool, cta }: { tool: ToolCard; cta: string }) {
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
        {cta} <span aria-hidden>→</span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { t } = useTranslation();

  const leagueTools: ToolCard[] = useMemo(() => COMPETITIONS.map((c) => ({
    to: `/${c.slug}`,
    emoji: c.emoji,
    title: c.active
      ? t(`home.leagues.${c.slug}.title`, { defaultValue: c.name })
      : `${t(`home.leagues.${c.slug}.title`, { defaultValue: c.name })} ${t('home.comingSoon')}`,
    description: t(`home.leagues.${c.slug}.description`, { defaultValue: c.description }),
    accent: c.accent,
    border: c.border,
    glow: c.accentSoft,
  })), [t]);

  const generalTools: ToolCard[] = useMemo(() => [
    {
      to: '/carkifelek', emoji: '🎡',
      title: t('tools.wheel.title'), description: t('tools.wheel.description'),
      accent: '#a78bfa', border: 'rgba(167,139,250,0.3)', glow: 'rgba(167,139,250,0.18)',
    },
    {
      to: '/kagit-cek', emoji: '🎫',
      title: t('tools.paperDraw.title'), description: t('tools.paperDraw.description'),
      accent: '#34d399', border: 'rgba(52,211,153,0.3)', glow: 'rgba(52,211,153,0.18)',
    },
    {
      to: '/zar-at', emoji: '🎲',
      title: t('tools.dice.title'), description: t('tools.dice.description'),
      accent: '#f472b6', border: 'rgba(244,114,182,0.3)', glow: 'rgba(244,114,182,0.18)',
    },
    {
      to: '/kart-karistir', emoji: '🃏',
      title: t('tools.cards.title'), description: t('tools.cards.description'),
      accent: '#fb923c', border: 'rgba(251,146,60,0.3)', glow: 'rgba(251,146,60,0.18)',
    },
    {
      to: '/tombala', emoji: '🎱',
      title: t('tools.tombala.title'), description: t('tools.tombala.description'),
      accent: '#facc15', border: 'rgba(250,204,21,0.3)', glow: 'rgba(250,204,21,0.18)',
    },
    {
      to: '/hali-saha', emoji: '👥',
      title: t('tools.haliSaha.title'), description: t('tools.haliSaha.description'),
      accent: '#22d3ee', border: 'rgba(34,211,238,0.3)', glow: 'rgba(34,211,238,0.18)',
    },
    {
      to: '/vampir-koylu', emoji: '🦇',
      title: t('tools.vampirKoylu.title'), description: t('tools.vampirKoylu.description'),
      accent: '#c084fc', border: 'rgba(192,132,252,0.3)', glow: 'rgba(192,132,252,0.18)',
    },
  ], [t]);

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
            <span style={{ color: '#bfdbfe', fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' }}>kuracekimi.com</span>
            <span style={{ color: '#fbbf24', fontSize: 13 }}>★</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 6vw, 4.2rem)', fontWeight: 900, lineHeight: 1.08, margin: '0 0 1.1rem', position: 'relative',
            background: 'linear-gradient(135deg,#fff 0%,#bfdbfe 55%,#818cf8 100%)', WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {t('home.title')}
          </h1>
          <p style={{ color: '#93c5fd', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto', position: 'relative' }}>
            {t('home.subtitle')}
          </p>
        </div>

        {/* ── LEAGUE TOOLS ── */}
        <div style={{ marginBottom: '2.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.1rem' }}>
            <span style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>{t('home.leagueTools')}</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(251,191,36,0.15)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.1rem' }}>
            {leagueTools.map((tool) => <ToolCardItem key={tool.to} tool={tool} cta={t('common.goToDraw')} />)}
          </div>
        </div>

        {/* ── GENERAL TOOLS ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.1rem' }}>
            <span style={{ color: '#a78bfa', fontSize: '0.75rem', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>{t('home.generalTools')}</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(167,139,250,0.15)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.1rem' }}>
            {generalTools.map((tool) => <ToolCardItem key={tool.to} tool={tool} cta={t('common.goToDraw')} />)}
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