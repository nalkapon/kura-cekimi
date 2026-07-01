import { useState } from 'react';

const PIP_LAYOUTS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
};

function Die({ value, rolling }: { value: number; rolling: boolean }) {
  return (
    <div style={{
      width: 84, height: 84, borderRadius: 16,
      background: 'linear-gradient(160deg,#f8fafc 0%,#cbd5e1 100%)',
      border: '1px solid rgba(0,0,0,0.12)',
      boxShadow: rolling ? '0 0 30px -4px rgba(251,191,36,0.7)' : '0 10px 24px -8px rgba(0,0,0,0.5)',
      position: 'relative',
      transform: rolling ? 'rotate(15deg) scale(0.94)' : 'rotate(0deg) scale(1)',
      transition: 'transform .12s ease',
    }}>
      {!rolling && PIP_LAYOUTS[value]?.map(([x, y], i) => (
        <div key={i} style={{
          position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)',
          width: 12, height: 12, borderRadius: '50%', background: '#0f172a',
        }} />
      ))}
    </div>
  );
}

export default function DicePage() {
  const [diceCount, setDiceCount] = useState(2);
  const [values, setValues] = useState<number[]>([1, 1]);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<{ values: number[]; sum: number }[]>([]);

  function changeDiceCount(n: number) {
    setDiceCount(n);
    setValues(Array.from({ length: n }, () => 1));
  }

  function roll() {
    if (rolling) return;
    setRolling(true);
    const tumble = window.setInterval(() => {
      setValues(Array.from({ length: diceCount }, () => Math.ceil(Math.random() * 6)));
    }, 80);

    window.setTimeout(() => {
      window.clearInterval(tumble);
      const finalValues = Array.from({ length: diceCount }, () => Math.ceil(Math.random() * 6));
      setValues(finalValues);
      setRolling(false);
      const sum = finalValues.reduce((a, b) => a + b, 0);
      setHistory((h) => [{ values: finalValues, sum }, ...h].slice(0, 8));
    }, 900);
  }

  const currentSum = values.reduce((a, b) => a + b, 0);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1.5rem', background: 'linear-gradient(160deg, #020b2b 0%, #0e0420 55%, #1a0635 100%)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg,rgba(250,204,21,0.1),rgba(99,102,241,0.1))', border: '1px solid rgba(250,204,21,0.22)', borderRadius: 9999, padding: '8px 28px', marginBottom: '1.5rem' }}>
            <span style={{ color: '#fbbf24', fontSize: 13 }}>★</span>
            <span style={{ color: '#bfdbfe', fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' }}>kuracek.com</span>
            <span style={{ color: '#fbbf24', fontSize: 13 }}>★</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.6rem)', fontWeight: 900, margin: '0 0 0.5rem', background: 'linear-gradient(135deg,#fff 0%,#bfdbfe 55%,#818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            🎲 Zar At
          </h1>
          <p style={{ color: '#93c5fd', fontSize: '0.95rem' }}>Zar sayısını seç, at ve sonucu gör.</p>
        </div>

        <div style={{ borderRadius: 24, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(2,10,40,0.85)', backdropFilter: 'blur(20px)', padding: '2.5rem' }}>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: '2rem' }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => changeDiceCount(n)}
                style={{
                  width: 40, height: 40, borderRadius: 10, fontWeight: 800, cursor: 'pointer',
                  border: diceCount === n ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                  background: diceCount === n ? 'rgba(251,191,36,0.14)' : 'rgba(255,255,255,0.03)',
                  color: diceCount === n ? '#fbbf24' : '#94a3b8',
                }}
              >{n}</button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', minHeight: 84 }}>
            {values.map((v, i) => <Die key={i} value={v} rolling={rolling} />)}
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span style={{ background: 'rgba(99,102,241,0.14)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '8px 24px', borderRadius: 9999, fontSize: '0.9rem', fontWeight: 700 }}>
              Toplam: <span style={{ color: '#fbbf24' }}>{currentSum}</span>
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={roll}
              disabled={rolling}
              style={{
                padding: '14px 48px', fontSize: '1rem', fontWeight: 900, borderRadius: 14,
                border: rolling ? '1px solid #1e293b' : '1px solid rgba(250,204,21,0.3)',
                background: rolling ? '#1e293b' : 'linear-gradient(135deg,#1d4ed8 0%,#4338ca 100%)',
                color: rolling ? '#475569' : '#fff', cursor: rolling ? 'not-allowed' : 'pointer',
                boxShadow: rolling ? 'none' : '0 0 40px -8px rgba(99,102,241,0.65)',
              }}
            >{rolling ? '🎲 Zarlar Atılıyor...' : '🎲 Zarları At'}</button>
          </div>

          {history.length > 0 && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, marginBottom: 10 }}>Geçmiş Atışlar</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {history.map((h, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)' }}>
                    <span style={{ color: '#e2e8f0', fontSize: '0.82rem' }}>{h.values.join(' + ')}</span>
                    <span style={{ color: '#fbbf24', fontSize: '0.82rem', fontWeight: 800 }}>= {h.sum}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}