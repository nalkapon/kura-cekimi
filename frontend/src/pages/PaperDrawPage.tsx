import { useState } from 'react';

interface Paper {
  id: number;
  name: string;
  drawn: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PaperDrawPage() {
  const [rawInput, setRawInput] = useState('Kırmızı Takım\nMavi Takım\nYeşil Takım\nSarı Takım\nMor Takım\nTuruncu Takım');
  const [papers, setPapers] = useState<Paper[]>(() =>
    shuffle(rawInput.split('\n').map((s) => s.trim()).filter(Boolean)).map((name, i) => ({ id: i, name, drawn: false }))
  );
  const [revealing, setRevealing] = useState<number | null>(null);
  const [lastDrawn, setLastDrawn] = useState<string | null>(null);
  const [order, setOrder] = useState<string[]>([]);

  function applyInput() {
    const names = rawInput.split('\n').map((s) => s.trim()).filter(Boolean);
    setPapers(shuffle(names).map((name, i) => ({ id: i, name, drawn: false })));
    setOrder([]);
    setLastDrawn(null);
    setRevealing(null);
  }

  function drawPaper(paper: Paper) {
    if (paper.drawn || revealing !== null) return;
    setRevealing(paper.id);
    window.setTimeout(() => {
      setPapers((prev) => prev.map((p) => (p.id === paper.id ? { ...p, drawn: true } : p)));
      setOrder((o) => [...o, paper.name]);
      setLastDrawn(paper.name);
      setRevealing(null);
    }, 550);
  }

  const remaining = papers.filter((p) => !p.drawn).length;

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
            🎫 Torbadan Kağıt Çek
          </h1>
          <p style={{ color: '#93c5fd', fontSize: '0.95rem' }}>Katlı kağıtlardan birine tıkla, aç ve gör.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px,1fr) 1.3fr', gap: '1.75rem', alignItems: 'start' }}>

          {/* Left: input + drawn order */}
          <div style={{ borderRadius: 24, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(2,10,40,0.85)', backdropFilter: 'blur(20px)', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
              <h3 style={{ color: '#fff', fontWeight: 900, margin: 0, fontSize: '1.05rem' }}>Kağıtlar</h3>
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
              <button onClick={applyInput} style={{ width: '100%', marginTop: 12, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.14)', color: '#a5b4fc', fontWeight: 700, cursor: 'pointer' }}>
                Torbayı Karıştır ve Doldur
              </button>

              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem', marginBottom: 8 }}>
                  <span>Çekilme Sırası</span>
                  <span style={{ color: '#fbbf24', fontWeight: 700 }}>{remaining} kaldı</span>
                </div>
                {order.length === 0 ? (
                  <p style={{ color: '#334155', fontSize: '0.8rem', fontStyle: 'italic' }}>Henüz kağıt çekilmedi.</p>
                ) : (
                  <ol style={{ margin: 0, paddingLeft: 20 }}>
                    {order.map((n, i) => (
                      <li key={i} style={{ color: '#e2e8f0', fontSize: '0.85rem', marginBottom: 4 }}>{n}</li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </div>

          {/* Right: bag of papers */}
          <div style={{ borderRadius: 24, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(2,10,40,0.85)', backdropFilter: 'blur(20px)', padding: '2rem' }}>
            {lastDrawn && (
              <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '1rem 2rem', borderRadius: 16, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.35)' }}>
                <div style={{ color: '#93c5fd', fontSize: '0.7rem', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>Son Çekilen</div>
                <div style={{ color: '#fbbf24', fontSize: '1.5rem', fontWeight: 900, marginTop: 4 }}>{lastDrawn}</div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '1rem', justifyItems: 'center' }}>
              {papers.map((paper) => {
                const isRevealing = revealing === paper.id;
                if (paper.drawn) {
                  return (
                    <div key={paper.id} style={{
                      width: 80, minHeight: 56, borderRadius: 10, background: 'rgba(255,255,255,0.04)',
                      border: '1px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '6px 8px', textAlign: 'center',
                    }}>
                      <span style={{ color: '#475569', fontSize: '0.62rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>{paper.name}</span>
                    </div>
                  );
                }
                return (
                  <button
                    key={paper.id}
                    onClick={() => drawPaper(paper)}
                    disabled={revealing !== null}
                    style={{
                      width: 64, height: 80, borderRadius: '4px 4px 10px 10px', padding: 0, cursor: revealing !== null ? 'default' : 'pointer',
                      background: 'linear-gradient(160deg,#f1f5f9 0%,#cbd5e1 100%)',
                      border: '1px solid rgba(0,0,0,0.15)',
                      boxShadow: isRevealing ? '0 0 24px -2px rgba(251,191,36,0.7)' : '0 6px 14px -4px rgba(0,0,0,0.5)',
                      position: 'relative', overflow: 'hidden',
                      transform: isRevealing ? 'scale(1.15) rotate(-3deg)' : 'scale(1)',
                      transition: 'transform .35s ease, box-shadow .35s ease',
                    }}
                  >
                    {/* fold lines */}
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.15)' }} />
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(0,0,0,0.1)' }} />
                  </button>
                );
              })}
            </div>

            {remaining === 0 && papers.length > 0 && (
              <p style={{ textAlign: 'center', color: '#34d399', fontSize: '0.85rem', fontWeight: 700, marginTop: '1.5rem' }}>✓ Tüm kağıtlar çekildi</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}