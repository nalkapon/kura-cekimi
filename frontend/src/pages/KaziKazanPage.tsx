import { useEffect, useMemo, useRef, useState, type MouseEvent, type TouchEvent } from 'react';

const ITEMS = [
  'Galatasaray',
  'Fenerbahce',
  'Besiktas',
  'Trabzonspor',
  'Real Madrid',
  'Manchester City',
  'Bayern Munchen',
  'Paris SG',
  'Sampiyon',
  'Joker',
  'Kazanan Sayi 7',
  'Bedava Tur',
];

function randomItem() {
  return ITEMS[Math.floor(Math.random() * ITEMS.length)];
}

export default function KaziKazanPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [done, setDone] = useState(false);
  const [keySeed, setKeySeed] = useState(1);
  const [text, setText] = useState(randomItem());

  const percent = useMemo(() => (done ? 100 : 0), [done]);

  function initCanvas() {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    const width = card.clientWidth;
    const height = card.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-over';
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#64748b');
    grad.addColorStop(1, '#334155');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(241,245,249,0.85)';
    ctx.font = '700 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('KAZI', width / 2, height / 2);
  }

  useEffect(() => {
    initCanvas();
    setDone(false);
  }, [keySeed]);

  function pointerPosition(e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0] ?? e.changedTouches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }

    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function scratchAt(x: number, y: number) {
    const canvas = canvasRef.current;
    if (!canvas || done) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 20) transparent += 1;
    }
    const ratio = transparent / (canvas.width * canvas.height);
    if (ratio >= 0.6) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setDone(true);
    }
  }

  function newCard() {
    setText(randomItem());
    setKeySeed((s) => s + 1);
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1.25rem', background: 'linear-gradient(160deg,#042f2e 0%,#0f172a 100%)' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 0.4rem', color: '#fff', fontSize: '2rem', fontWeight: 900 }}>Kazi Kazan</h1>
        <p style={{ margin: '0 0 1.3rem', color: '#99f6e4' }}>Kartin ustunu kaziyarak sonucu ortaya cikar.</p>

        <div style={{ background: 'rgba(2,10,40,0.72)', border: '1px solid rgba(45,212,191,0.35)', borderRadius: 16, padding: '1rem' }}>
          <div
            ref={cardRef}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 700,
              height: 260,
              borderRadius: 14,
              overflow: 'hidden',
              border: '1px solid rgba(148,163,184,0.35)',
              background: 'linear-gradient(135deg,#0f766e,#0f172a)',
              margin: '0 auto',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#ecfeff', fontSize: '2rem', fontWeight: 900, textAlign: 'center', padding: 12 }}>
              {text}
            </div>
            <canvas
              key={keySeed}
              ref={canvasRef}
              onMouseDown={(e) => {
                setIsDrawing(true);
                const p = pointerPosition(e);
                scratchAt(p.x, p.y);
              }}
              onMouseMove={(e) => {
                if (!isDrawing) return;
                const p = pointerPosition(e);
                scratchAt(p.x, p.y);
              }}
              onMouseUp={() => setIsDrawing(false)}
              onMouseLeave={() => setIsDrawing(false)}
              onTouchStart={(e) => {
                setIsDrawing(true);
                const p = pointerPosition(e);
                scratchAt(p.x, p.y);
              }}
              onTouchMove={(e) => {
                if (!isDrawing) return;
                const p = pointerPosition(e);
                scratchAt(p.x, p.y);
              }}
              onTouchEnd={() => setIsDrawing(false)}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', touchAction: 'none', cursor: 'crosshair' }}
            />
          </div>

          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ color: '#ccfbf1', fontSize: '0.9rem' }}>{done ? 'Kazima tamamlandi (%60+)' : 'Kazimaya devam et (%60 olunca kart acilir)'}</span>
            {done && (
              <button
                onClick={newCard}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: '1px solid rgba(45,212,191,0.5)',
                  background: 'linear-gradient(135deg,#0d9488,#14b8a6)',
                  color: '#042f2e',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                Yeni Kart
              </button>
            )}
          </div>
          <div style={{ marginTop: 6, color: '#5eead4', fontSize: '0.82rem' }}>Durum: %{percent}</div>
        </div>
      </div>
    </div>
  );
}
