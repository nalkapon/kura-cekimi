import { useState } from 'react';

const TOTAL_NUMBERS = 90;
const COLS = 10;
const ROWS = TOTAL_NUMBERS / COLS;

function BagIcon({ pulsing, remaining }: { pulsing: boolean; remaining: number }) {
  const fullness = Math.max(0.15, remaining / TOTAL_NUMBERS);
  return (
    <svg viewBox="0 0 200 220" width="180" height="198" style={{ filter: pulsing ? 'drop-shadow(0 0 26px rgba(251,191,36,0.55))' : 'drop-shadow(0 12px 24px rgba(0,0,0,0.5))', transition: 'filter .25s' }}>
      {/* Drawstring ties */}
      <path d="M78 30 Q100 10 122 30" stroke="#fbbf24" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="78" cy="30" r="4" fill="#fbbf24" />
      <circle cx="122" cy="30" r="4" fill="#fbbf24" />
      {/* Gathered neck */}
      <path d="M72 34 Q100 46 128 34 L124 54 Q100 64 76 54 Z" fill="#4338ca" stroke="#312e81" strokeWidth="2" />
      {/* Body */}
      <path
        d="M76 54 Q30 70 26 130 Q24 190 100 200 Q176 190 174 130 Q170 70 124 54 Q100 66 76 54 Z"
        fill="url(#bagGradient)"
        stroke="#312e81"
        strokeWidth="2"
      />
      {/* Fill level indicator (subtle inner shading) */}
      <path
        d={`M40 ${200 - fullness * 120} Q100 ${210 - fullness * 120} 160 ${200 - fullness * 120} L160 190 Q100 202 40 190 Z`}
        fill="rgba(251,191,36,0.12)"
      />
      <defs>
        <linearGradient id="bagGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function TombalaPage() {
  const [remaining, setRemaining] = useState<number[]>(() => Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1));
  const [drawn, setDrawn] = useState<number[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const [drawing, setDrawing] = useState(false);

  function drawNumber() {
    if (drawing || remaining.length === 0) return;
    setDrawing(true);

    // Kısa bir "karıştırma" hissi için rastgele sayılar gösterip sonra gerçek çekilişi yap.
    const tumble = window.setInterval(() => {
      setCurrent(1 + Math.floor(Math.random() * TOTAL_NUMBERS));
    }, 70);

    window.setTimeout(() => {
      window.clearInterval(tumble);
      const idx = Math.floor(Math.random() * remaining.length);
      const picked = remaining[idx];
      setRemaining((prev) => prev.filter((_, i) => i !== idx));
      setDrawn((prev) => [...prev, picked]);
      setCurrent(picked);
      setDrawing(false);
    }, 550);
  }

  function reset() {
    setRemaining(Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1));
    setDrawn([]);
    setCurrent(null);
    setDrawing(false);
  }

  const drawnSet = new Set(drawn);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1.5rem', background: 'linear-gradient(160deg, #020b2b 0%, #0e0420 55%, #1a0635 100%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg,rgba(250,204,21,0.1),rgba(99,102,241,0.1))', border: '1px solid rgba(250,204,21,0.22)', borderRadius: 9999, padding: '8px 28px', marginBottom: '1.5rem' }}>
            <span style={{ color: '#fbbf24', fontSize: 13 }}>★</span>
            <span style={{ color: '#bfdbfe', fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' }}>kuracekimi.com</span>
            <span style={{ color: '#fbbf24', fontSize: 13 }}>★</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.6rem)', fontWeight: 900, margin: '0 0 0.5rem', background: 'linear-gradient(135deg,#fff 0%,#bfdbfe 55%,#818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            🎱 Tombala
          </h1>
          <p style={{ color: '#93c5fd', fontSize: '0.95rem' }}>Keseden sayıyı çek, tahtaya işlensin.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 340px) 1fr', gap: '1.75rem', alignItems: 'start' }}>

          {/* Left: bag + draw button */}
          <div style={{ borderRadius: 24, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(2,10,40,0.85)', backdropFilter: 'blur(20px)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <BagIcon pulsing={drawing} remaining={remaining.length} />

            <div style={{ marginTop: '1rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
              Kesede <span style={{ color: '#fbbf24' }}>{remaining.length}</span> sayı kaldı
            </div>

            <div style={{
              marginTop: '1.5rem', width: 108, height: 108, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: current !== null ? 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.5), transparent 45%), radial-gradient(circle at 55% 60%, #fbbf24aa, #fbbf2422 75%)' : 'rgba(255,255,255,0.04)',
              border: current !== null ? '2px solid #fbbf24' : '1px dashed rgba(255,255,255,0.15)',
              boxShadow: drawing ? '0 0 30px -4px rgba(251,191,36,0.7)' : 'none',
              transition: 'all .2s',
            }}>
              <span style={{ fontSize: '2.1rem', fontWeight: 900, color: current !== null ? '#1a0f00' : '#334155' }}>
                {current ?? '?'}
              </span>
            </div>

            <button
              onClick={drawNumber}
              disabled={drawing || remaining.length === 0}
              style={{
                marginTop: '1.75rem', width: '100%', padding: '13px 20px', fontSize: '0.95rem', fontWeight: 900, borderRadius: 14,
                border: (drawing || remaining.length === 0) ? '1px solid #1e293b' : '1px solid rgba(250,204,21,0.3)',
                background: (drawing || remaining.length === 0) ? '#1e293b' : 'linear-gradient(135deg,#1d4ed8 0%,#4338ca 100%)',
                color: (drawing || remaining.length === 0) ? '#475569' : '#fff',
                cursor: (drawing || remaining.length === 0) ? 'not-allowed' : 'pointer',
                boxShadow: (drawing || remaining.length === 0) ? 'none' : '0 0 32px -8px rgba(99,102,241,0.65)',
              }}
            >
              {remaining.length === 0 ? '✓ Kese Boşaldı' : drawing ? '🎱 Çekiliyor...' : '🎱 Sayı Çek'}
            </button>

            <button onClick={reset} style={{ marginTop: 10, width: '100%', padding: '10px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontWeight: 700, cursor: 'pointer' }}>
              Sıfırla
            </button>

            {drawn.length > 0 && (
              <div style={{ marginTop: '1.5rem', width: '100%' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, marginBottom: 8 }}>Çekiliş Sırası</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, maxHeight: 130, overflowY: 'auto' }}>
                  {drawn.map((n, i) => (
                    <span key={i} style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800 }}>{n}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: 1-90 board */}
          <div style={{ borderRadius: 24, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(2,10,40,0.85)', backdropFilter: 'blur(20px)', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ color: '#fff', fontWeight: 900, margin: 0, fontSize: '1.05rem' }}>Tombala Tahtası</h3>
              <span style={{ background: 'rgba(99,102,241,0.14)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '5px 16px', borderRadius: 9999, fontSize: '0.78rem', fontWeight: 700 }}>
                <span style={{ color: '#fbbf24' }}>{drawn.length}</span> / {TOTAL_NUMBERS}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 8 }}>
              {Array.from({ length: ROWS * COLS }, (_, i) => i + 1).map((n) => {
                const isDrawn = drawnSet.has(n);
                const isCurrent = isDrawn && drawn[drawn.length - 1] === n && !drawing;
                return (
                  <div
                    key={n}
                    style={{
                      aspectRatio: '1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 800,
                      background: isDrawn ? 'linear-gradient(135deg,#fbbf24,#f59e0b)' : 'rgba(255,255,255,0.03)',
                      color: isDrawn ? '#1a0f00' : '#475569',
                      border: isDrawn ? '1px solid rgba(251,191,36,0.6)' : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: isCurrent ? '0 0 16px -2px rgba(251,191,36,0.8)' : 'none',
                      transition: 'all .2s',
                    }}
                  >
                    {n}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}