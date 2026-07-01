import { useMemo, useState } from 'react';

type Role = 'Vampir' | 'Koylu' | 'Doktor';

interface Participant {
  id: number;
  name: string;
  role: Role;
}

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
    const vampirCount = Math.floor(names.length / 3);
    const doktorActive = includeDoctor && names.length > 7;

    const roleList: Role[] = [
      ...Array.from({ length: vampirCount }, () => 'Vampir' as Role),
      ...(doktorActive ? ['Doktor' as Role] : []),
    ];

    while (roleList.length < names.length) {
      roleList.push('Koylu');
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

  const activePlayer = players[index] ?? null;
  const nextPlayer = index + 1 < players.length ? players[index + 1] : null;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1.25rem', background: 'linear-gradient(160deg,#140b22 0%, #220b2f 50%, #0b1028 100%)' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 0.4rem', color: '#fff', fontSize: '2rem', fontWeight: 900 }}>Vampir Koylu</h1>
        <p style={{ margin: '0 0 1.3rem', color: '#c4b5fd' }}>Isimleri gir, rolleri gizli dagit, telefonu siradaki kisiye ver.</p>

        <div style={{ background: 'rgba(10,8,28,0.75)', border: '1px solid rgba(168,85,247,0.28)', borderRadius: 16, padding: '1rem', marginBottom: '1rem' }}>
          <label style={{ color: '#e9d5ff', fontWeight: 700, display: 'block', marginBottom: 8 }}>Isimler (satir satir veya virgul ile)</label>
          <textarea
            rows={6}
            value={rawNames}
            onChange={(e) => setRawNames(e.target.value)}
            placeholder={'Ali\nVeli\nAyse\nFatma\nCan'}
            style={{
              width: '100%',
              background: 'rgba(24,24,46,0.8)',
              border: '1px solid rgba(167,139,250,0.35)',
              borderRadius: 10,
              color: '#f5f3ff',
              padding: '10px 12px',
              resize: 'vertical',
            }}
          />

          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              id="doktorToggle"
              type="checkbox"
              checked={includeDoctor}
              onChange={(e) => setIncludeDoctor(e.target.checked)}
            />
            <label htmlFor="doktorToggle" style={{ color: '#ddd6fe' }}>Doktor eklensin mi? (oyuncu {'>'} 7 ise 1 Doktor)</label>
          </div>

          <div style={{ marginTop: 10, color: '#c4b5fd', fontSize: '0.9rem' }}>Oyuncu sayisi: {parsedNames.length} (Min. 5)</div>

          <button
            onClick={startGame}
            disabled={parsedNames.length < 5}
            style={{
              marginTop: 12,
              padding: '10px 16px',
              borderRadius: 10,
              border: parsedNames.length < 5 ? '1px solid rgba(71,85,105,0.7)' : '1px solid rgba(167,139,250,0.45)',
              background: parsedNames.length < 5 ? '#334155' : 'linear-gradient(135deg,#7c3aed,#4338ca)',
              color: '#fff',
              cursor: parsedNames.length < 5 ? 'not-allowed' : 'pointer',
              fontWeight: 800,
            }}
          >
            Rolleri Dagit
          </button>
        </div>

        {players.length > 0 && !finished && activePlayer && (
          <div style={{ background: 'rgba(10,8,28,0.75)', border: '1px solid rgba(167,139,250,0.28)', borderRadius: 16, padding: '1rem' }}>
            <p style={{ color: '#f5f3ff', margin: '0 0 0.8rem', fontWeight: 800 }}>Sira: {activePlayer.name}</p>

            <div
              onMouseDown={() => setRevealed(true)}
              onMouseUp={() => setRevealed(false)}
              onMouseLeave={() => setRevealed(false)}
              onTouchStart={() => setRevealed(true)}
              onTouchEnd={() => setRevealed(false)}
              style={{
                userSelect: 'none',
                minHeight: 180,
                borderRadius: 14,
                border: '1px solid rgba(192,132,252,0.5)',
                display: 'grid',
                placeItems: 'center',
                background: revealed ? 'linear-gradient(135deg,#111827,#312e81)' : 'linear-gradient(135deg,#2e1065,#581c87)',
                color: '#fff',
                fontWeight: 900,
                textAlign: 'center',
                padding: 12,
              }}
            >
              {revealed ? (
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#c4b5fd', marginBottom: 6 }}>Rolun</div>
                    <div style={{ fontSize: '2rem' }}>{activePlayer.role}</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: 6 }}>🂠</div>
                  <div style={{ color: '#e9d5ff' }}>Karti basili tutarak gor</div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 10 }}>
              <button
                onClick={closeCardAndContinue}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: '1px solid rgba(148,163,184,0.4)',
                  background: 'rgba(30,41,59,0.8)',
                  color: '#e2e8f0',
                  cursor: 'pointer',
                  fontWeight: 800,
                }}
              >
                {nextPlayer ? `Telefonu ${nextPlayer.name} kisiye ver` : 'Oyunu Bitir'}
              </button>
            </div>
          </div>
        )}

        {finished && (
          <div style={{ marginTop: 12, background: 'rgba(10,8,28,0.75)', border: '1px solid rgba(52,211,153,0.4)', borderRadius: 16, padding: '1rem' }}>
            <h2 style={{ margin: '0 0 0.5rem', color: '#34d399' }}>Rol dagitimi tamamlandi</h2>
            <p style={{ margin: 0, color: '#d1fae5' }}>Artik oyunu baslatabilirsiniz.</p>
          </div>
        )}
      </div>
    </div>
  );
}
