import { useMemo, useRef, useState, useEffect } from 'react';

const SEGMENT_COLORS = ['#fbbf24', '#38bdf8', '#34d399', '#a78bfa', '#f472b6', '#fb923c'];

function pickTextColor() {
  return '#0a0a12';
}

export default function WheelPage() {
  const [rawInput, setRawInput] = useState('Ali\nAyşe\nMehmet\nZeynep\nCan\nElif');
  const [options, setOptions] = useState<string[]>(() => rawInput.split('\n').map((s) => s.trim()).filter(Boolean));
  const [removeWinner, setRemoveWinner] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const wheelRef = useRef<HTMLDivElement>(null);

  const segAngle = options.length > 0 ? 360 / options.length : 0;

  const [radiusPx, setRadiusPx] = useState(0);
  useEffect(() => {
    function update() {
      const el = wheelRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setRadiusPx(rect.width / 2);
    }
    update();
    const el = wheelRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, [wheelRef]);

  function applyInput() {
    const list = rawInput.split('\n').map((s) => s.trim()).filter(Boolean);
    setOptions(list);
    setWinner(null);
  }

  function spin() {
    if (spinning || options.length < 2) return;
    setSpinning(true);
    setWinner(null);

    const winnerIndex = Math.floor(Math.random() * options.length);
    const targetCenter = winnerIndex * segAngle + segAngle / 2;
    const spins = 6;
    const currentMod = ((rotation % 360) + 360) % 360;
    const desiredMod = ((360 - targetCenter) % 360 + 360) % 360;
    let delta = desiredMod - currentMod;
    if (delta < 0) delta += 360;
    const newRotation = rotation + spins * 360 + delta;

    setRotation(newRotation);

    window.setTimeout(() => {
      const won = options[winnerIndex];
      setWinner(won);
      setHistory((h) => [won, ...h].slice(0, 12));
      setSpinning(false);
      if (removeWinner) {
        setOptions((prev) => prev.filter((_, i) => i !== winnerIndex));
      }
    }, 4200);
  }

  function reset() {
    const list = rawInput.split('\n').map((s) => s.trim()).filter(Boolean);
    setOptions(list);
    setWinner(null);
    setHistory([]);
    setRotation(0);
  }

  const gradient = useMemo(() => {
    if (options.length === 0) return 'conic-gradient(#1e293b 0deg 360deg)';
    const stops: string[] = [];
    options.forEach((_, i) => {
      const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
      stops.push(`${color} ${i * segAngle}deg ${(i + 1) * segAngle}deg`);
    });
    return `conic-gradient(${stops.join(', ')})`;
  }, [options, segAngle]);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1.5rem', background: 'linear-gradient(160deg, #020b2b 0%, #0e0420 55%, #1a0635 100%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg,rgba(250,204,21,0.1),rgba(99,102,241,0.1))', border: '1px solid rgba(250,204,21,0.22)', borderRadius: 9999, padding: '8px 28px', marginBottom: '1.5rem' }}>
            <span style={{ color: '#fbbf24', fontSize: 13 }}>★</span>
            <span style={{ color: '#bfdbfe', fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' }}>kuracek.com</span>
            <span style={{ color: '#fbbf24', fontSize: 13 }}>★</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.6rem)', fontWeight: 900, margin: '0 0 0.5rem', background: 'linear-gradient(135deg,#fff 0%,#bfdbfe 55%,#818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            🎡 Çarkıfelek
          </h1>
          <p style={{ color: '#93c5fd', fontSize: '0.95rem' }}>İsim ya da seçenek listeni gir, çarkı çevir, kazananı gör.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px,1fr) 1.3fr', gap: '1.75rem', alignItems: 'start' }}>

          {/* Left: input + list */}
          <div style={{ borderRadius: 24, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(2,10,40,0.85)', backdropFilter: 'blur(20px)', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
              <h3 style={{ color: '#fff', fontWeight: 900, margin: 0, fontSize: '1.05rem' }}>Seçenekler</h3>
              <p style={{ color: '#475569', fontSize: '0.78rem', margin: '4px 0 0' }}>Her satıra bir isim/seçenek yaz</p>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                rows={8}
                style={{
                  width: '100%', resize: 'vertical', borderRadius: 12, padding: '12px 14px', fontSize: '0.9rem',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button onClick={applyInput} style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.14)', color: '#a5b4fc', fontWeight: 700, cursor: 'pointer' }}>
                  Listeyi Güncelle
                </button>
                <button onClick={reset} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontWeight: 700, cursor: 'pointer' }}>
                  Sıfırla
                </button>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={removeWinner} onChange={(e) => setRemoveWinner(e.target.checked)} />
                Kazananı çarktan çıkar
              </label>

              {history.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{ color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 700, marginBottom: 8 }}>Geçmiş Kazananlar</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {history.map((h, i) => (
                      <span key={i} style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24', padding: '4px 12px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 700 }}>{h}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: wheel */}
          <div style={{ borderRadius: 24, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(2,10,40,0.85)', backdropFilter: 'blur(20px)', padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 'min(420px, 90vw)', height: 'min(420px, 90vw)' }}>
              {/* Pointer */}
              <div style={{
                position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', zIndex: 2,
                width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent',
                borderTop: '26px solid #fbbf24', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
              }} />
              <div
                ref={wheelRef}
                style={{
                  width: '100%', height: '100%', borderRadius: '50%', background: gradient,
                  border: '6px solid #0b1340', boxShadow: '0 0 0 2px rgba(251,191,36,0.35), 0 30px 70px -20px rgba(0,0,0,0.6)',
                  position: 'relative', overflow: 'hidden',
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? 'transform 4.1s cubic-bezier(0.17, 0.67, 0.12, 1)' : 'none',
                }}
              >
                {options.map((opt, i) => {
                  const angle = i * segAngle + segAngle / 2;
                  // distance from center in px where label should sit (responsive)
                  // place label near the middle of the wedge (closer to center)
                  const dist = Math.max(40, Math.round(radiusPx * 0.38));
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%,-50%) rotate(${angle}deg) translate(0, -${dist}px)`,
                         transformOrigin: 'center center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                      }}
                    >
                      <span style={{
                        display: 'inline-block',
                        transform: `rotate(${-angle}deg)`,
                        transformOrigin: 'center',
                        fontSize: options.length > 12 ? 10 : 13,
                        fontWeight: 800,
                        color: pickTextColor(),
                        // limit width so label stays within slice center area
                        maxWidth: Math.max(64, Math.round(radiusPx * 0.5)),
                        padding: '0 4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                      }}>{opt}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                width: 56, height: 56, borderRadius: '50%', background: '#0b1340', border: '3px solid #fbbf24',
                display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px -4px rgba(251,191,36,0.6)', zIndex: 1,
              }}>
                <span style={{ fontSize: 22 }}>🎯</span>
              </div>
            </div>

            <button
              onClick={spin}
              disabled={spinning || options.length < 2}
              style={{
                marginTop: '2rem', padding: '14px 48px', fontSize: '1rem', fontWeight: 900, borderRadius: 14,
                border: (spinning || options.length < 2) ? '1px solid #1e293b' : '1px solid rgba(250,204,21,0.3)',
                background: (spinning || options.length < 2) ? '#1e293b' : 'linear-gradient(135deg,#1d4ed8 0%,#4338ca 100%)',
                color: (spinning || options.length < 2) ? '#475569' : '#fff',
                cursor: (spinning || options.length < 2) ? 'not-allowed' : 'pointer',
                boxShadow: (spinning || options.length < 2) ? 'none' : '0 0 40px -8px rgba(99,102,241,0.65)',
              }}
            >{spinning ? '🎡 Çark Dönüyor...' : '🎡 Çarkı Çevir'}</button>

            {options.length < 2 && (
              <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: 10 }}>Çevirmek için en az 2 seçenek gerekli.</p>
            )}

            {winner && !spinning && (
              <div style={{
                marginTop: '1.75rem', textAlign: 'center', padding: '1rem 2rem', borderRadius: 16,
                background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.35)',
              }}>
                <div style={{ color: '#93c5fd', fontSize: '0.7rem', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>Kazanan</div>
                <div style={{ color: '#fbbf24', fontSize: '1.6rem', fontWeight: 900, marginTop: 4 }}>{winner}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}