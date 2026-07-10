import { useMemo, useState } from 'react';

type Role = 'Vampir' | 'Köylü' | 'Doktor';

interface Participant {
  id: number;
  name: string;
  role: Role;
}

const ROLE_STYLE: Record<Role, { color: string; bg: string; border: string; emoji: string }> = {
  Vampir: { color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.4)', emoji: '🧛' },
  Köylü: { color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.4)', emoji: '🌾' },
  Doktor: { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.4)', emoji: '💉' },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function VampirKoyluPage() {
  const [rawNames, setRawNames] = useState('');
  const [includeDoctor, setIncludeDoctor] = useState(true);
  const [players, setPlayers] = useState<Participant[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const parsedNames = useMemo(
    () => rawNames
      .split(/\r?\n|,/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0),
    [rawNames],
  );

  function startGame() {
    if (parsedNames.length < 5) return;

    const names = [...parsedNames];
    // Vampir oranını ~%25'te sabitliyoruz (klasik sosyal çıkarım oyunlarında dengeli kabul edilen aralık).
    const vampirCount = Math.max(1, Math.floor(names.length / 4));
    // Doktor sayısı da oyuncu sayısıyla birlikte ölçeklenir: her 8 oyuncuya 1 doktor, 6+ oyuncuda en az 1.
    const doktorCount = includeDoctor && names.length >= 6 ? Math.max(1, Math.floor(names.length / 8)) : 0;

    const roleList: Role[] = [
      ...Array.from({ length: vampirCount }, () => 'Vampir' as Role),
      ...Array.from({ length: doktorCount }, () => 'Doktor' as Role),
    ];

    while (roleList.length < names.length) {
      roleList.push('Köylü');
    }

    const mixedRoles = shuffle(roleList);
    const participants: Participant[] = names.map((name, i) => ({ id: i + 1, name, role: mixedRoles[i] }));

    setPlayers(participants);
    setIndex(0);
    setRevealed(false);
    setFinished(false);
  }

  function closeCardAndContinue() {
    setRevealed(false);
    if (index >= players.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
  }

  function replayWithSamePlayers() {
    startGame();
  }

  function startOver() {
    setPlayers([]);
    setIndex(0);
    setRevealed(false);
    setFinished(false);
  }

  const activePlayer = players[index] ?? null;
  const nextPlayer = index + 1 < players.length ? players[index + 1] : null;
  const vampirCount = players.filter((p) => p.role === 'Vampir').length;
  const doktorCount = players.filter((p) => p.role === 'Doktor').length;
  const koyluCount = players.filter((p) => p.role === 'Köylü').length;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1.5rem', background: 'linear-gradient(160deg, #020b2b 0%, #0e0420 55%, #1a0635 100%)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg,rgba(250,204,21,0.1),rgba(99,102,241,0.1))', border: '1px solid rgba(250,204,21,0.22)', borderRadius: 9999, padding: '8px 28px', marginBottom: '1.5rem' }}>
            <span style={{ color: '#fbbf24', fontSize: 13 }}>★</span>
            <span style={{ color: '#bfdbfe', fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' }}>kuracekimi.com</span>
            <span style={{ color: '#fbbf24', fontSize: 13 }}>★</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.6rem)', fontWeight: 900, margin: '0 0 0.5rem', background: 'linear-gradient(135deg,#fff 0%,#e9d5ff 55%,#a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            🧛 Vampir Köylü
          </h1>
          <p style={{ color: '#c4b5fd', fontSize: '0.95rem' }}>İsimleri gir, rolleri gizlice dağıt, telefonu sırayla elden ele dolaştır.</p>
        </div>

        {/* ── SETUP ── */}
        <div style={{ borderRadius: 24, border: '1px solid rgba(167,139,250,0.25)', background: 'rgba(2,10,40,0.85)', backdropFilter: 'blur(20px)', padding: '1.75rem', marginBottom: '1.5rem' }}>
          <label style={{ color: '#e9d5ff', fontWeight: 700, display: 'block', marginBottom: 10, fontSize: '0.9rem' }}>
            İsimler (satır satır veya virgülle ayırarak yaz)
          </label>
          <textarea
            rows={6}
            value={rawNames}
            onChange={(e) => setRawNames(e.target.value)}
            placeholder={'Ali\nVeli\nAyşe\nFatma\nCan'}
            style={{
              width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 12,
              color: '#f5f3ff', padding: '12px 14px',
            }}
          />

          <label style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, color: '#ddd6fe', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={includeDoctor}
              onChange={(e) => setIncludeDoctor(e.target.checked)}
            />
            Doktor eklensin mi? (6+ oyuncuda en az 1, her 8 oyuncuya 1 doktor daha eklenir)
          </label>

          <div style={{ marginTop: 12, color: '#a78bfa', fontSize: '0.85rem', fontWeight: 700 }}>
            Oyuncu sayısı: <span style={{ color: '#e9d5ff' }}>{parsedNames.length}</span>
            <span style={{ color: '#6d28d9' }}> · en az 5 kişi gerekli</span>
          </div>

          <button
            onClick={startGame}
            disabled={parsedNames.length < 5}
            style={{
              marginTop: 14, width: '100%', padding: '13px 20px', fontSize: '0.95rem', fontWeight: 900, borderRadius: 14,
              border: parsedNames.length < 5 ? '1px solid #1e293b' : '1px solid rgba(167,139,250,0.4)',
              background: parsedNames.length < 5 ? '#1e293b' : 'linear-gradient(135deg,#7c3aed 0%,#4338ca 100%)',
              color: parsedNames.length < 5 ? '#475569' : '#fff',
              cursor: parsedNames.length < 5 ? 'not-allowed' : 'pointer',
              boxShadow: parsedNames.length < 5 ? 'none' : '0 0 32px -8px rgba(167,139,250,0.6)',
              transition: 'all .2s',
            }}
          >
            🎭 Rolleri Dağıt
          </button>
        </div>

        {/* ── PASS-THE-PHONE REVEAL ── */}
        {players.length > 0 && !finished && activePlayer && (
          <div style={{ borderRadius: 24, border: '1px solid rgba(167,139,250,0.25)', background: 'rgba(2,10,40,0.85)', backdropFilter: 'blur(20px)', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
              <p style={{ color: '#f5f3ff', margin: 0, fontWeight: 800, fontSize: '1.05rem' }}>Sıra: {activePlayer.name}</p>
              <span style={{ background: 'rgba(99,102,241,0.14)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '5px 14px', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 700 }}>
                {index + 1} / {players.length}
              </span>
            </div>

            <div
              onMouseDown={() => setRevealed(true)}
              onMouseUp={() => setRevealed(false)}
              onMouseLeave={() => setRevealed(false)}
              onTouchStart={() => setRevealed(true)}
              onTouchEnd={() => setRevealed(false)}
              style={{
                userSelect: 'none',
                minHeight: 190,
                borderRadius: 16,
                border: `1px solid ${revealed ? ROLE_STYLE[activePlayer.role].border : 'rgba(192,132,252,0.5)'}`,
                display: 'grid',
                placeItems: 'center',
                background: revealed
                  ? `linear-gradient(135deg, ${ROLE_STYLE[activePlayer.role].bg}, rgba(2,10,40,0.9))`
                  : 'linear-gradient(135deg,#2e1065,#581c87)',
                color: '#fff',
                fontWeight: 900,
                textAlign: 'center',
                padding: 16,
                transition: 'all .15s',
                cursor: 'pointer',
              }}
            >
              {revealed ? (
                <div>
                  <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>{ROLE_STYLE[activePlayer.role].emoji}</div>
                  <div style={{ fontSize: '0.85rem', color: '#c4b5fd', marginBottom: 6 }}>Rolün</div>
                  <div style={{ fontSize: '2rem', color: ROLE_STYLE[activePlayer.role].color }}>{activePlayer.role}</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>🂠</div>
                  <div style={{ color: '#e9d5ff', fontSize: '0.9rem' }}>Kartı basılı tutarak gör</div>
                </div>
              )}
            </div>

            <button
              onClick={closeCardAndContinue}
              style={{
                marginTop: 14, width: '100%', padding: '12px 20px', borderRadius: 12, fontWeight: 800, fontSize: '0.9rem',
                border: '1px solid rgba(148,163,184,0.3)', background: 'rgba(255,255,255,0.04)', color: '#e2e8f0', cursor: 'pointer',
              }}
            >
              {nextPlayer ? `📱 Telefonu ${nextPlayer.name}'e ver` : '✓ Oyunu Bitir'}
            </button>
          </div>
        )}

        {/* ── FINISHED ── */}
        {finished && (
          <div style={{ borderRadius: 24, border: '1px solid rgba(52,211,153,0.35)', background: 'rgba(2,10,40,0.85)', backdropFilter: 'blur(20px)', padding: '1.75rem' }}>
            <h2 style={{ margin: '0 0 0.4rem', color: '#34d399', fontSize: '1.3rem', fontWeight: 900 }}>✓ Rol dağıtımı tamamlandı</h2>
            <p style={{ margin: '0 0 1.25rem', color: '#94a3b8', fontSize: '0.88rem' }}>Herkes rolünü gördü, oyunu başlatabilirsiniz.</p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <span style={{ background: ROLE_STYLE.Vampir.bg, border: `1px solid ${ROLE_STYLE.Vampir.border}`, color: ROLE_STYLE.Vampir.color, padding: '6px 16px', borderRadius: 9999, fontSize: '0.8rem', fontWeight: 700 }}>
                🧛 Vampir: {vampirCount}
              </span>
              {doktorCount > 0 && (
                <span style={{ background: ROLE_STYLE.Doktor.bg, border: `1px solid ${ROLE_STYLE.Doktor.border}`, color: ROLE_STYLE.Doktor.color, padding: '6px 16px', borderRadius: 9999, fontSize: '0.8rem', fontWeight: 700 }}>
                  💉 Doktor: {doktorCount}
                </span>
              )}
              <span style={{ background: ROLE_STYLE.Köylü.bg, border: `1px solid ${ROLE_STYLE.Köylü.border}`, color: ROLE_STYLE.Köylü.color, padding: '6px 16px', borderRadius: 9999, fontSize: '0.8rem', fontWeight: 700 }}>
                🌾 Köylü: {koyluCount}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={replayWithSamePlayers}
                style={{
                  flex: 1, minWidth: 200, padding: '13px 20px', borderRadius: 12, fontWeight: 800, fontSize: '0.88rem',
                  border: '1px solid rgba(167,139,250,0.4)', background: 'linear-gradient(135deg,#7c3aed 0%,#4338ca 100%)',
                  color: '#fff', cursor: 'pointer', boxShadow: '0 0 28px -8px rgba(167,139,250,0.55)',
                }}
              >
                🔁 Aynı Oyuncularla Yeni Tur
              </button>
              <button
                onClick={startOver}
                style={{
                  flex: 1, minWidth: 200, padding: '13px 20px', borderRadius: 12, fontWeight: 800, fontSize: '0.88rem',
                  border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', cursor: 'pointer',
                }}
              >
                ✎ Baştan Başla (İsimleri Değiştir)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}