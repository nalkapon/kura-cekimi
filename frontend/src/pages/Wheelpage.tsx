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
    <div className="wheel-page">
      <div className="wheel-shell">
        <div className="wheel-hero">
          <div className="wheel-pill">
            <span>★</span>
            <span>kuracekimi.com</span>
            <span>★</span>
          </div>
          <h1>🎡 Çarkıfelek</h1>
          <p>İsim ya da seçenek listeni gir, çarkı çevir, kazananı gör.</p>
        </div>

        <div className="wheel-layout">
          <section className="wheel-card wheel-canvas-card">
            <div className="wheel-canvas-wrap">
              <div className="wheel-pointer" />

              <div
                ref={wheelRef}
                className="wheel-canvas"
                style={{
                  background: gradient,
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? 'transform 4.1s cubic-bezier(0.17, 0.67, 0.12, 1)' : 'none',
                }}
              >
                {options.map((opt, i) => {
                  const angle = i * segAngle + segAngle / 2;
                  const segAngleRad = (segAngle * Math.PI) / 180 || 0.0001;
                  const centroidRatio = (4 * Math.sin(segAngleRad / 2)) / (3 * segAngleRad);
                  const dist = Math.max(22, Math.round(radiusPx * Math.max(0.32, Math.min(centroidRatio, 0.8))));
                  const labelWidth = Math.max(52, Math.round(2 * dist * Math.sin(segAngleRad / 2) * 0.86));
                  const labelFont = `${Math.max(10, Math.min(16, Math.round(radiusPx * 0.055)))}px`;

                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translate(0, -${dist}px)`,
                        transformOrigin: 'center center',
                        pointerEvents: 'none',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          width: `${labelWidth}px`,
                          transform: `translateX(-50%) rotate(${-angle}deg)`,
                          transformOrigin: 'center',
                          fontSize: labelFont,
                          fontWeight: 800,
                          color: pickTextColor(),
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textShadow: '0 1px 0 rgba(255,255,255,0.2)',
                        }}
                      >
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="wheel-center-dot">
                <span>🎯</span>
              </div>
            </div>

            <button
              onClick={spin}
              disabled={spinning || options.length < 2}
              className="wheel-spin-btn"
            >
              {spinning ? '🎡 Çark Dönüyor...' : '🎡 Çarkı Çevir'}
            </button>

            {options.length < 2 && (
              <p className="wheel-help-danger">Çevirmek için en az 2 seçenek gerekli.</p>
            )}

            {winner && !spinning && (
              <div className="wheel-winner-box">
                <div className="wheel-winner-label">Kazanan</div>
                <div className="wheel-winner-name">{winner}</div>
              </div>
            )}
          </section>

          <section className="wheel-card wheel-input-card">
            <div className="wheel-card-head">
              <h3>Seçenekler</h3>
              <p>Her satıra bir isim/seçenek yaz</p>
            </div>

            <div className="wheel-card-body">
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                rows={8}
                className="wheel-textarea"
              />

              <div className="wheel-actions">
                <button onClick={applyInput} className="wheel-btn wheel-btn-primary">Listeyi Güncelle</button>
                <button onClick={reset} className="wheel-btn wheel-btn-ghost">Sıfırla</button>
              </div>

              <label className="wheel-checkbox">
                <input
                  type="checkbox"
                  checked={removeWinner}
                  onChange={(e) => setRemoveWinner(e.target.checked)}
                />
                Kazananı çarktan çıkar
              </label>

              {history.length > 0 && (
                <div className="wheel-history-wrap">
                  <div className="wheel-history-title">Geçmiş Kazananlar</div>
                  <div className="wheel-history-list">
                    {history.map((h, i) => (
                      <span key={i} className="wheel-history-item">{h}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .wheel-page {
          min-height: 100vh;
          padding: 1rem 0.75rem 1.5rem;
          background: linear-gradient(160deg, #020b2b 0%, #0e0420 55%, #1a0635 100%);
        }
        .wheel-shell {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }
        .wheel-hero {
          text-align: center;
          margin-bottom: 1rem;
        }
        .wheel-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
          border: 1px solid rgba(250, 204, 21, 0.32);
          background: linear-gradient(135deg, rgba(250, 204, 21, 0.1), rgba(99, 102, 241, 0.1));
          color: #fbbf24;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .wheel-hero h1 {
          margin: 0;
          line-height: 1.08;
          font-size: clamp(1.8rem, 6vw, 3.5rem);
          font-weight: 900;
          background: linear-gradient(135deg, #fff 0%, #bfdbfe 55%, #818cf8 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .wheel-hero p {
          margin: 0.55rem auto 0;
          max-width: 620px;
          color: #93c5fd;
          font-size: 0.95rem;
        }
        .wheel-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          align-items: start;
        }
        .wheel-card {
          border-radius: 20px;
          border: 1px solid rgba(99, 102, 241, 0.22);
          background: rgba(2, 10, 40, 0.85);
          backdrop-filter: blur(18px);
          overflow: hidden;
        }
        .wheel-canvas-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem 0.75rem 1.15rem;
        }
        .wheel-canvas-wrap {
          position: relative;
          width: min(90vw, 430px);
          height: min(90vw, 430px);
        }
        .wheel-pointer {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          width: 0;
          height: 0;
          border-left: 13px solid transparent;
          border-right: 13px solid transparent;
          border-top: 24px solid #fbbf24;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
        }
        .wheel-canvas {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          border: 6px solid #0b1340;
          box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.35), 0 24px 55px -20px rgba(0, 0, 0, 0.6);
        }
        .wheel-center-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 3px solid #fbbf24;
          background: #0b1340;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px -4px rgba(251, 191, 36, 0.6);
          font-size: 1.3rem;
        }
        .wheel-spin-btn {
          margin-top: 1rem;
          padding: 0.8rem 1.55rem;
          font-size: 0.95rem;
          font-weight: 900;
          border-radius: 13px;
          border: 1px solid rgba(250, 204, 21, 0.3);
          color: #fff;
          background: linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%);
          box-shadow: 0 0 40px -10px rgba(99, 102, 241, 0.65);
          cursor: pointer;
        }
        .wheel-spin-btn:disabled {
          border-color: #1e293b;
          background: #1e293b;
          color: #475569;
          box-shadow: none;
          cursor: not-allowed;
        }
        .wheel-help-danger {
          margin-top: 0.5rem;
          font-size: 0.78rem;
          color: #f87171;
          text-align: center;
        }
        .wheel-winner-box {
          margin-top: 1rem;
          text-align: center;
          padding: 0.9rem 1.1rem;
          border-radius: 14px;
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.35);
          min-width: min(88vw, 310px);
        }
        .wheel-winner-label {
          color: #93c5fd;
          font-size: 0.67rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .wheel-winner-name {
          color: #fbbf24;
          font-size: clamp(1.2rem, 4vw, 1.85rem);
          font-weight: 900;
          margin-top: 0.2rem;
        }
        .wheel-input-card {
          order: 2;
        }
        .wheel-card-head {
          padding: 1rem 1rem 0.8rem;
          border-bottom: 1px solid rgba(99, 102, 241, 0.2);
        }
        .wheel-card-head h3 {
          margin: 0;
          color: #fff;
          font-size: 1.03rem;
          font-weight: 900;
        }
        .wheel-card-head p {
          margin: 0.3rem 0 0;
          color: #64748b;
          font-size: 0.8rem;
        }
        .wheel-card-body {
          padding: 1rem;
        }
        .wheel-textarea {
          width: 100%;
          box-sizing: border-box;
          resize: vertical;
          border-radius: 12px;
          padding: 0.75rem 0.85rem;
          font-size: 0.92rem;
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.05);
          outline: none;
        }
        .wheel-textarea:focus {
          border-color: rgba(165, 180, 252, 0.72);
        }
        .wheel-actions {
          display: flex;
          gap: 0.55rem;
          margin-top: 0.7rem;
        }
        .wheel-btn {
          border-radius: 10px;
          padding: 0.62rem 0.82rem;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
        }
        .wheel-btn-primary {
          flex: 1;
          border: 1px solid rgba(99, 102, 241, 0.42);
          color: #c7d2fe;
          background: rgba(99, 102, 241, 0.2);
        }
        .wheel-btn-ghost {
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #94a3b8;
          background: transparent;
        }
        .wheel-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.8rem;
          color: #94a3b8;
          font-size: 0.86rem;
          cursor: pointer;
        }
        .wheel-history-wrap {
          margin-top: 1rem;
        }
        .wheel-history-title {
          color: #e2e8f0;
          font-size: 0.82rem;
          font-weight: 700;
          margin-bottom: 0.45rem;
        }
        .wheel-history-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.38rem;
        }
        .wheel-history-item {
          background: rgba(251, 191, 36, 0.12);
          border: 1px solid rgba(251, 191, 36, 0.3);
          color: #fbbf24;
          padding: 0.24rem 0.62rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        @media (min-width: 1024px) {
          .wheel-page {
            padding: 1.75rem 1.5rem 2.5rem;
          }
          .wheel-hero {
            margin-bottom: 1.5rem;
          }
          .wheel-layout {
            grid-template-columns: minmax(320px, 1fr) minmax(360px, 1.2fr);
            gap: 1.35rem;
          }
          .wheel-canvas-card {
            order: 2;
            padding: 1.6rem;
          }
          .wheel-input-card {
            order: 1;
          }
          .wheel-canvas-wrap {
            width: min(74vh, 450px);
            height: min(74vh, 450px);
          }
          .wheel-pointer {
            border-left-width: 14px;
            border-right-width: 14px;
            border-top-width: 26px;
          }
          .wheel-spin-btn {
            margin-top: 1.4rem;
            padding: 0.85rem 2rem;
            font-size: 1rem;
          }
          .wheel-card-head,
          .wheel-card-body {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}