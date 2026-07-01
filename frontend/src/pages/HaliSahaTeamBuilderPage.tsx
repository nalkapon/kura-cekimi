import { useMemo, useState } from 'react';

interface PlayerInput {
  id: number;
  name: string;
  stars: number;
}

interface TeamResult {
  name: string;
  players: PlayerInput[];
  totalStars: number;
}

function buildBalancedTeams(players: PlayerInput[]): TeamResult[] {
  const sorted = [...players].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
  const teams: TeamResult[] = [
    { name: 'Takim A', players: [], totalStars: 0 },
    { name: 'Takim B', players: [], totalStars: 0 },
  ];

  let tieToggle = 0;

  sorted.forEach((player) => {
    let target = teams[0];

    for (let i = 1; i < teams.length; i += 1) {
      const candidate = teams[i];
      if (candidate.totalStars < target.totalStars) {
        target = candidate;
      } else if (candidate.totalStars === target.totalStars) {
        if (candidate.players.length < target.players.length) {
          target = candidate;
        }
      }
    }

    if (teams[0].totalStars === teams[1].totalStars && teams[0].players.length === teams[1].players.length) {
      target = teams[tieToggle % 2];
      tieToggle += 1;
    }

    target.players.push(player);
    target.totalStars += player.stars;
  });

  return teams;
}

export default function HaliSahaTeamBuilderPage() {
  const [playerCount, setPlayerCount] = useState<10 | 12 | 14>(10);
  const [players, setPlayers] = useState<PlayerInput[]>(
    Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: '', stars: 1 })),
  );
  const [showResult, setShowResult] = useState(false);

  function resizePlayers(count: 10 | 12 | 14) {
    setPlayerCount(count);
    setShowResult(false);
    setPlayers((prev) => {
      const next = Array.from({ length: count }, (_, i) => {
        const old = prev[i];
        return old ?? { id: i + 1, name: '', stars: 1 };
      });
      return next;
    });
  }

  function updatePlayerName(id: number, name: string) {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  }

  function updatePlayerStars(id: number, stars: number) {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, stars } : p)));
  }

  const validPlayers = useMemo(
    () => players
      .map((p) => ({ ...p, name: p.name.trim() }))
      .filter((p) => p.name.length > 0),
    [players],
  );

  const canBuild = validPlayers.length === playerCount;
  const teams = showResult && canBuild ? buildBalancedTeams(validPlayers) : [];

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1.25rem', background: 'linear-gradient(160deg, #06102a 0%, #1b0a30 100%)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 0.5rem', color: '#fff', fontSize: '2rem', fontWeight: 900 }}>Hali Saha Takim Kurucu</h1>
        <p style={{ margin: '0 0 1.5rem', color: '#93c5fd' }}>Yildizlara gore dengeli iki takim olustur.</p>

        <div style={{ background: 'rgba(2,10,40,0.75)', border: '1px solid rgba(148,163,184,0.25)', borderRadius: 16, padding: '1rem', marginBottom: '1rem' }}>
          <label style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}>Oyuncu sayisi</label>
          <div style={{ marginTop: '0.6rem', display: 'flex', gap: 8 }}>
            {[10, 12, 14].map((count) => (
              <button
                key={count}
                onClick={() => resizePlayers(count as 10 | 12 | 14)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 10,
                  border: playerCount === count ? '1px solid #fbbf24' : '1px solid rgba(148,163,184,0.25)',
                  background: playerCount === count ? 'rgba(251,191,36,0.12)' : 'rgba(15,23,42,0.6)',
                  color: '#e2e8f0',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(2,10,40,0.75)', border: '1px solid rgba(148,163,184,0.25)', borderRadius: 16, padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px', gap: 10, marginBottom: 10 }}>
            <strong style={{ color: '#bfdbfe' }}>Oyuncu Ismi</strong>
            <strong style={{ color: '#bfdbfe' }}>Yildiz</strong>
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            {players.map((player) => (
              <div key={player.id} style={{ display: 'grid', gridTemplateColumns: '1fr 170px', gap: 10 }}>
                <input
                  value={player.name}
                  onChange={(e) => updatePlayerName(player.id, e.target.value)}
                  placeholder={`Oyuncu ${player.id}`}
                  style={{
                    background: 'rgba(15,23,42,0.7)',
                    border: '1px solid rgba(148,163,184,0.3)',
                    borderRadius: 10,
                    color: '#e2e8f0',
                    padding: '10px 12px',
                  }}
                />
                <div
                  style={{
                    background: 'rgba(15,23,42,0.7)',
                    border: '1px solid rgba(148,163,184,0.3)',
                    borderRadius: 10,
                    color: '#e2e8f0',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updatePlayerStars(player.id, s)}
                      aria-label={`${s} yildiz sec`}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '1.05rem',
                        lineHeight: 1,
                        color: s <= player.stars ? '#fbbf24' : '#475569',
                        padding: 0,
                      }}
                    >
                      {s <= player.stars ? '★' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowResult(true)}
              disabled={!canBuild}
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                border: canBuild ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(71,85,105,0.6)',
                background: canBuild ? 'linear-gradient(135deg,#1d4ed8,#4338ca)' : '#334155',
                color: '#fff',
                cursor: canBuild ? 'pointer' : 'not-allowed',
                fontWeight: 800,
              }}
            >
              Dengeli Dagit
            </button>
            {!canBuild && (
              <span style={{ color: '#fca5a5', fontSize: '0.85rem', alignSelf: 'center' }}>
                Tum oyuncularin ismini doldur.
              </span>
            )}
          </div>
        </div>

        {showResult && canBuild && (
          <div style={{ marginTop: '1.2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 12 }}>
            {teams.map((team) => (
              <div key={team.name} style={{ background: 'rgba(2,10,40,0.8)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: 14, padding: '1rem' }}>
                <h2 style={{ margin: '0 0 0.4rem', color: '#f8fafc', fontSize: '1.1rem' }}>{team.name}</h2>
                <p style={{ margin: '0 0 0.8rem', color: '#93c5fd', fontWeight: 700 }}>Toplam Yildiz: {team.totalStars}</p>
                <div style={{ display: 'grid', gap: 6 }}>
                  {team.players.map((p) => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(148,163,184,0.2)', paddingBottom: 4 }}>
                      <span style={{ color: '#e2e8f0' }}>{p.name}</span>
                      <span style={{ color: '#fbbf24', fontWeight: 700 }}>{'★'.repeat(p.stars)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
