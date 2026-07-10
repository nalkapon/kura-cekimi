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
    <div
      className="min-h-screen bg-[#020b2b] px-3 py-4 sm:px-6 sm:py-8"
      style={{ background: 'linear-gradient(160deg, #020b2b 0%, #0e0420 55%, #1a0635 100%)' }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 text-center sm:mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-gradient-to-r from-amber-300/10 to-indigo-400/10 px-4 py-1.5 sm:mb-6 sm:px-7 sm:py-2">
            <span className="text-xs text-amber-300">★</span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-blue-200 sm:text-xs">kuracek.com</span>
            <span className="text-xs text-amber-300">★</span>
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-white via-blue-200 to-indigo-300 bg-clip-text text-4xl font-black leading-tight text-transparent sm:text-6xl">
            🎡 Çarkıfelek
          </h1>
          <p className="mx-auto max-w-xl text-sm text-blue-300 sm:text-base">
            İsim ya da seçenek listeni gir, çarkı çevir, kazananı gör.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(300px,1fr)_minmax(360px,1.3fr)] lg:items-start lg:gap-7">
          <div className="order-2 overflow-hidden rounded-2xl border border-indigo-400/20 bg-[#020a28]/85 backdrop-blur-xl lg:order-1">
            <div className="border-b border-indigo-400/20 px-4 py-4 sm:px-6 sm:py-5">
              <h3 className="text-base font-black text-white sm:text-lg">Seçenekler</h3>
              <p className="mt-1 text-xs text-slate-500">Her satıra bir isim/seçenek yaz</p>
            </div>
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                rows={8}
                className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-200 outline-none ring-0 placeholder:text-slate-400 focus:border-indigo-300/60"
              />

              <div className="mt-3 flex gap-2">
                <button
                  onClick={applyInput}
                  className="flex-1 rounded-xl border border-indigo-300/40 bg-indigo-400/20 px-3 py-2.5 text-sm font-bold text-indigo-200 transition hover:bg-indigo-400/30"
                >
                  Listeyi Güncelle
                </button>
                <button
                  onClick={reset}
                  className="rounded-xl border border-white/15 px-3 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/10"
                >
                  Sıfırla
                </button>
              </div>

              <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={removeWinner}
                  onChange={(e) => setRemoveWinner(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-indigo-400"
                />
                Kazananı çarktan çıkar
              </label>

              {history.length > 0 && (
                <div className="mt-6">
                  <div className="mb-2 text-xs font-bold text-slate-200">Geçmiş Kazananlar</div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {history.map((h, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-amber-300/35 bg-amber-300/10 px-2.5 py-1 text-[11px] font-bold text-amber-300 sm:px-3 sm:text-xs"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="order-1 flex flex-col items-center rounded-2xl border border-indigo-400/20 bg-[#020a28]/85 px-3 py-4 backdrop-blur-xl sm:px-6 sm:py-8 lg:order-2">
            <div className="relative h-[min(88vw,420px)] w-[min(88vw,420px)]">
              <div
                className="pointer-events-none absolute left-1/2 top-0 z-20 h-0 w-0 -translate-x-1/2 -translate-y-1 border-x-[12px] border-x-transparent border-t-[22px] border-t-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] sm:border-x-[14px] sm:border-t-[26px]"
              />

              <div
                ref={wheelRef}
                className="relative h-full w-full overflow-hidden rounded-full border-[5px] border-[#0b1340] shadow-[0_0_0_2px_rgba(251,191,36,0.35),0_20px_50px_-20px_rgba(0,0,0,0.6)] sm:border-[6px]"
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

              <div className="absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-amber-300 bg-[#0b1340] shadow-[0_0_18px_-4px_rgba(251,191,36,0.6)] sm:h-14 sm:w-14 sm:border-[3px]">
                <span className="text-xl sm:text-2xl">🎯</span>
              </div>
            </div>

            <button
              onClick={spin}
              disabled={spinning || options.length < 2}
              className="mt-6 rounded-xl px-6 py-3 text-sm font-black text-white transition sm:mt-8 sm:px-10 sm:text-base"
              style={{
                border: (spinning || options.length < 2) ? '1px solid #1e293b' : '1px solid rgba(250,204,21,0.3)',
                background: (spinning || options.length < 2) ? '#1e293b' : 'linear-gradient(135deg,#1d4ed8 0%,#4338ca 100%)',
                color: (spinning || options.length < 2) ? '#475569' : '#fff',
                cursor: (spinning || options.length < 2) ? 'not-allowed' : 'pointer',
                boxShadow: (spinning || options.length < 2) ? 'none' : '0 0 40px -8px rgba(99,102,241,0.65)',
              }}
            >
              {spinning ? '🎡 Çark Dönüyor...' : '🎡 Çarkı Çevir'}
            </button>

            {options.length < 2 && (
              <p className="mt-2 text-center text-xs text-red-400 sm:text-sm">Çevirmek için en az 2 seçenek gerekli.</p>
            )}

            {winner && !spinning && (
              <div className="mt-6 rounded-2xl border border-amber-300/40 bg-amber-300/10 px-5 py-4 text-center sm:mt-7 sm:px-8">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-300 sm:text-xs">Kazanan</div>
                <div className="mt-1 text-2xl font-black text-amber-300 sm:text-3xl">{winner}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}