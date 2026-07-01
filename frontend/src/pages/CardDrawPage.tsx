import { useState } from 'react';

const SUITS = [
  { symbol: '♠', color: '#0f172a', name: 'Maça' },
  { symbol: '♥', color: '#dc2626', name: 'Kupa' },
  { symbol: '♦', color: '#dc2626', name: 'Karo' },
  { symbol: '♣', color: '#0f172a', name: 'Sinek' },
];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

interface Card { id: string; rank: string; suit: number }

function buildDeck(): Card[] {
  const deck: Card[] = [];
  SUITS.forEach((_, si) => {
    RANKS.forEach((rank) => deck.push({ id: `${rank}-${si}`, rank, suit: si }));
  });
  return deck;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function CardFace({ card, small }: { card: Card; small?: boolean }) {
  const suit = SUITS[card.suit];
  const w = small ? 56 : 90;
  const h = small ? 78 : 126;
  return (
    <div style={{
      width: w, height: h, borderRadius: 8, background: '#fefefe', border: '1px solid rgba(0,0,0,0.15)',
      boxShadow: '0 8px 18px -6px rgba(0,0,0,0.5)', position: 'relative', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <div style={{ position: 'absolute', top: 5, left: 6, color: suit.color, fontSize: small ? 10 : 13, fontWeight: 800, lineHeight: 1 }}>
        {card.rank}<br />{suit.symbol}
      </div>
      <span style={{ color: suit.color, fontSize: small ? 24 : 36 }}>{suit.symbol}</span>
      <div style={{ position: 'absolute', bottom: 5, right: 6, color: suit.color, fontSize: small ? 10 : 13, fontWeight: 800, lineHeight: 1, transform: 'rotate(180deg)' }}>
        {card.rank}<br />{suit.symbol}
      </div>
    </div>
  );
}

function CardBack({ w = 90, h = 126, style = {} }: { w?: number; h?: number; style?: React.CSSProperties }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 8,
      background: 'repeating-linear-gradient(45deg, #4338ca, #4338ca 6px, #3730a3 6px, #3730a3 12px)',
      border: '2px solid #fbbf24', boxShadow: '0 8px 18px -6px rgba(0,0,0,0.5)', flexShrink: 0,
      ...style,
    }} />
  );
}

export default function CardDrawPage() {
  const [deck, setDeck] = useState<Card[]>(() => shuffle(buildDeck()));
  const [drawn, setDrawn] = useState<Card[]>([]);
  const [shuffling, setShuffling] = useState(false);
  const [flipping, setFlipping] = useState(false);

  function reshuffle() {
    setShuffling(true);
    window.setTimeout(() => {
      setDeck(shuffle(buildDeck()));
      setDrawn([]);
      setShuffling(false);
    }, 650);
  }

  function drawCard() {
    if (deck.length === 0 || flipping || shuffling) return;
    setFlipping(true);
    window.setTimeout(() => {
      const [top, ...rest] = deck;
      setDeck(rest);
      setDrawn((d) => [...d, top]);
      setFlipping(false);
    }, 350);
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1.5rem', background: 'linear-gradient(160deg, #020b2b 0%, #0e0420 55%, #1a0635 100%)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg,rgba(250,204,21,0.1),rgba(99,102,241,0.1))', border: '1px solid rgba(250,204,21,0.22)', borderRadius: 9999, padding: '8px 28px', marginBottom: '1.5rem' }}>
            <span style={{ color: '#fbbf24', fontSize: 13 }}>★</span>
            <span style={{ color: '#bfdbfe', fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' }}>kuracek.com</span>
            <span style={{ color: '#fbbf24', fontSize: 13 }}>★</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.6rem)', fontWeight: 900, margin: '0 0 0.5rem', background: 'linear-gradient(135deg,#fff 0%,#bfdbfe 55%,#818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            🃏 Kart Karıştır
          </h1>
          <p style={{ color: '#93c5fd', fontSize: '0.95rem' }}>52 kartlık desteyi karıştır, üstten çek.</p>
        </div>

        <div style={{ borderRadius: 24, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(2,10,40,0.85)', backdropFilter: 'blur(20px)', padding: '2.5rem' }}>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', marginBottom: '2.25rem' }}>

            {/* Deck stack */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 90, height: 126, margin: '0 auto' }}>
                {deck.length === 0 ? (
                  <div style={{ width: 90, height: 126, borderRadius: 8, border: '2px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#334155', fontSize: '0.7rem', fontWeight: 700 }}>Boş</span>
                  </div>
                ) : (
                  Array.from({ length: Math.min(5, deck.length) }).map((_, i) => (
                    <CardBack key={i} style={{
                      position: 'absolute', top: -i * 2, left: -i * 2,
                      transform: shuffling ? `rotate(${(i % 2 === 0 ? 1 : -1) * (6 + i * 3)}deg)` : 'none',
                      transition: 'transform .3s ease',
                    }} />
                  ))
                )}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: 10, fontWeight: 700 }}>Destede {deck.length} kart</div>
            </div>

            {/* Last drawn card, flipping */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ perspective: 600 }}>
                {drawn.length === 0 ? (
                  <div style={{ width: 90, height: 126, borderRadius: 8, border: '2px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#334155', fontSize: '0.65rem', fontWeight: 700, padding: 4, textAlign: 'center' }}>Henüz kart yok</span>
                  </div>
                ) : (
                  <div style={{
                    width: 90, height: 126, position: 'relative', transformStyle: 'preserve-3d',
                    transform: flipping ? 'rotateY(90deg)' : 'rotateY(0deg)',
                    transition: 'transform .35s ease',
                  }}>
                    <CardFace card={drawn[drawn.length - 1]} />
                  </div>
                )}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: 10, fontWeight: 700 }}>Son Çekilen</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: drawn.length > 0 ? '2rem' : 0 }}>
            <button
              onClick={reshuffle}
              disabled={shuffling}
              style={{
                padding: '12px 28px', borderRadius: 12, fontWeight: 800, cursor: shuffling ? 'not-allowed' : 'pointer',
                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#94a3b8',
              }}
            >{shuffling ? '🔀 Karıştırılıyor...' : '🔀 Desteyi Karıştır'}</button>
            <button
              onClick={drawCard}
              disabled={deck.length === 0 || flipping || shuffling}
              style={{
                padding: '12px 32px', borderRadius: 12, fontWeight: 900, cursor: (deck.length === 0 || flipping || shuffling) ? 'not-allowed' : 'pointer',
                border: (deck.length === 0 || flipping || shuffling) ? '1px solid #1e293b' : '1px solid rgba(250,204,21,0.3)',
                background: (deck.length === 0 || flipping || shuffling) ? '#1e293b' : 'linear-gradient(135deg,#1d4ed8 0%,#4338ca 100%)',
                color: (deck.length === 0 || flipping || shuffling) ? '#475569' : '#fff',
                boxShadow: (deck.length === 0 || flipping || shuffling) ? 'none' : '0 0 32px -8px rgba(99,102,241,0.65)',
              }}
            >🃏 Kart Çek</button>
          </div>

          {drawn.length > 0 && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, marginBottom: 12 }}>Çekilen Kartlar ({drawn.length})</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {drawn.map((c) => <CardFace key={c.id} card={c} small />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}