import { useEffect, useState } from 'react';
import { drawAPI } from '../services/api';
import { GB, DE, ES, FR, IT, PT, TR, BE, NL, HR, CZ, RS, NO, UA, AT, CH, PL, SK} from 'country-flag-icons/react/3x2';


const COUNTRY_FLAGS: Record<string, any> = {
  EN: GB, DE: DE, ES: ES, FR: FR, IT: IT,
  PT: PT, TR: TR, BE: BE, NL: NL,
  HR: HR, CZ: CZ, RS: RS, NO: NO,
  UA: UA, AT: AT, CH: CH, PL:PL, GB:GB , SK:SK
};
function resolveFlag(countryName?: string, width = 24, height = 16) {
  if (!countryName || !COUNTRY_FLAGS[countryName]) return null;
  const FlagComponent = COUNTRY_FLAGS[countryName];
  return <FlagComponent style={{ width, height, borderRadius: '3px', objectFit: 'cover', flexShrink: 0 }} />;
}
interface Team {
  id?: number;
  name?: string;
  country?: string;
  pot?: number;
  coefficient?: number;
  color?: string;
  path?: string;
  qualified?: boolean;
}

interface DrawResult {
  timestamp: string;
  teams: Team[];
  matches: any[];
  teamSchedules?: Record<string, Record<string, { opponent: Team; isHome: boolean }[]>>;
  totalMatches: number;
}

export default function DrawPage() {
  const [result, setResult] = useState<DrawResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);
  const [visibleOpponentCount, setVisibleOpponentCount] = useState(0);

  const handleSwissSystemDraw = async () => {
    setLoading(true);
    setError('');
    setSimulationMode(false);
    setSelectedTeamId(null);

    try {
      const data = await drawAPI.swiss();
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'İsviçre Sistemi kura çekimi başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSimulation = (teamId: number) => {
    setSelectedTeamId(teamId);
    setSimulationMode(true);
  };



  const qualifiedTeams = result?.teams.filter((t: Team) => t.qualified) || [];
  const qualifyingTeams = result?.teams.filter((t: Team) => !t.qualified) || [];
  const teamsByPot = [1, 2, 3, 4].map((potNum) => ({
    potNum,
    teams: result?.teams.filter((team: Team) => team.pot === potNum) || [],
  }));

  const selectedTeam = result?.teams.find((t: Team) => t.id === selectedTeamId);
  const selectedTeamSchedule = selectedTeamId && result?.teamSchedules
    ? result.teamSchedules[String(selectedTeamId)]
    : null;

  const selectedTeamMatches = [] as Array<{ pot: number; opponent: Team; isHome: boolean }>;

  if (selectedTeamSchedule) {
    [1, 2, 3, 4].forEach((potNum) => {
      (selectedTeamSchedule[String(potNum)] || []).forEach((entry: any) => {
        selectedTeamMatches.push({
          pot: potNum,
          opponent: entry.opponent,
          isHome: entry.isHome,
        });
      });
    });
  }

  useEffect(() => {
    if (!simulationMode || !selectedTeamMatches.length) {
      setVisibleOpponentCount(0);
      return;
    }

    setVisibleOpponentCount(0);
    const timer = window.setInterval(() => {
      setVisibleOpponentCount((current) => {
        if (current >= selectedTeamMatches.length) {
          window.clearInterval(timer);
          return current;
        }

        return current + 1;
      });
    }, 250);

    return () => window.clearInterval(timer);
  }, [simulationMode, selectedTeamId, selectedTeamMatches.length]);

  const POT_COLORS = [
    null,
    { accent: '#fbbf24', border: 'rgba(251,191,36,0.25)', bg: 'rgba(251,191,36,0.05)', strip: 'linear-gradient(90deg,#f59e0b,#fcd34d)', hover: '251,191,36' },
    { accent: '#38bdf8', border: 'rgba(56,189,248,0.25)',  bg: 'rgba(56,189,248,0.05)',  strip: 'linear-gradient(90deg,#0ea5e9,#7dd3fc)', hover: '56,189,248' },
    { accent: '#34d399', border: 'rgba(52,211,153,0.25)',  bg: 'rgba(52,211,153,0.05)',  strip: 'linear-gradient(90deg,#10b981,#6ee7b7)', hover: '52,211,153' },
    { accent: '#a78bfa', border: 'rgba(167,139,250,0.25)', bg: 'rgba(167,139,250,0.05)', strip: 'linear-gradient(90deg,#8b5cf6,#c4b5fd)', hover: '167,139,250' },
  ] as any[];

  return (
    <div style={{ minHeight: '100vh', padding: 'clamp(0.75rem, 2.5vw, 2rem) clamp(0.5rem, 2.5vw, 1.5rem)', background: 'linear-gradient(160deg, #020b2b 0%, #0e0420 55%, #1a0635 100%)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg,rgba(250,204,21,0.1),rgba(99,102,241,0.1))', border: '1px solid rgba(250,204,21,0.22)', borderRadius: '9999px', padding: '8px 28px', marginBottom: '1.5rem' }}>
            <span style={{ color: '#fbbf24', fontSize: '13px' }}>★</span>
            <span style={{ color: '#bfdbfe', fontSize: '11px', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase' }}>UEFA Şampiyonlar Ligi</span>
            <span style={{ color: '#fbbf24', fontSize: '13px' }}>★</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 1.5rem', background: 'linear-gradient(135deg,#fff 0%,#bfdbfe 55%,#818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            ⚽ İsviçre Sistemi Kurası
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {[['36', 'Takım'], ['144', 'Toplam Maç'], ['2', 'Torba Başına Rakip']].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center', minWidth: '72px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: '0.65rem', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '5px' }}>{lbl}</div>
              </div>
            ))}
          </div>
          {result && (
            <p style={{ color: '#64748b', fontSize: '0.82rem' }}>
              Kesin: <span style={{ color: '#fcd34d', fontWeight: 700 }}>{qualifiedTeams.length}</span>
              &nbsp;·&nbsp;Qualifying: <span style={{ color: '#fcd34d', fontWeight: 700 }}>{qualifyingTeams.length}</span>
            </p>
          )}
        </div>

        {/* ── DRAW BUTTON ── */}
        {!result && (
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <button
              onClick={handleSwissSystemDraw}
              disabled={loading}
              style={{
                padding: '18px 60px', fontSize: '1.15rem', fontWeight: 900, letterSpacing: '1px',
                borderRadius: '14px', border: loading ? '1px solid #1e293b' : '1px solid rgba(250,204,21,0.3)',
                background: loading ? '#1e293b' : 'linear-gradient(135deg,#1d4ed8 0%,#4338ca 100%)',
                color: loading ? '#475569' : '#fff', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 52px -8px rgba(99,102,241,0.65),0 16px 32px -8px rgba(0,0,0,0.5)',
                transition: 'all .2s',
              }}
            >{loading ? '🔄 Kura Çekiliyor...' : '🎯 Kurası Başlat'}</button>
          </div>
        )}

        {/* ── ERROR ── */}
        {error && (
          <div style={{ background: 'rgba(127,29,29,0.4)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', padding: '16px 28px', borderRadius: '12px', marginBottom: '2.5rem' }}>
            {error}
          </div>
        )}

        {/* ── SIMULATION VIEW ── */}
        {simulationMode && selectedTeam && result ? (
          <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(2,10,40,0.9)', backdropFilter: 'blur(20px)', boxShadow: '0 32px 80px -24px rgba(59,130,246,0.4)' }}>

            {/* Hero header */}
            <div style={{ background: 'linear-gradient(135deg,#0f1f6e 0%,#0c0a2e 100%)', padding: 'clamp(1rem, 3.5vw, 2.5rem)', borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
              <button
                onClick={() => setSimulationMode(false)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0', padding: '10px 22px', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem', transition: 'all .15s' }}
              >← Geri Dön</button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ width: 112, height: 112, borderRadius: '16px', overflow: 'hidden', background: selectedTeam.color || '#1e3a8a', border: '2px solid rgba(255,255,255,0.15)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px -4px rgba(0,0,0,0.5)' }}>
                  {resolveFlag(selectedTeam.country, 84, 56)}
                </div>
                <div>
                  <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3.25rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: '0 0 0.5rem' }}>{selectedTeam.name}</h2>
                  <p style={{ color: '#93c5fd', fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.75rem' }}>
                    {selectedTeam.country}&nbsp;·&nbsp;<span style={{ color: '#fbbf24' }}>Torba {selectedTeam.pot}</span>&nbsp;·&nbsp;Katsayı: {selectedTeam.coefficient}
                  </p>
                  <span style={{ display: 'inline-block', background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.3)', color: '#fcd34d', fontSize: '0.78rem', fontWeight: 700, padding: '5px 16px', borderRadius: '9999px' }}>
                    {selectedTeam.qualified ? '✓ Kesin Katılımcı' : '⚠ Qualifying Yolu'}
                  </span>
                </div>
              </div>
            </div>

            {/* Match plan */}
            <div style={{ padding: 'clamp(0.75rem, 3vw, 2rem) clamp(0.75rem, 3vw, 2.5rem) clamp(1rem, 3vw, 2.5rem)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 900, color: '#fff', margin: 0 }}>Maç Planı</h3>
                <span style={{ background: 'rgba(99,102,241,0.14)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '8px 20px', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 700 }}>
                  <span style={{ color: '#fbbf24' }}>{Math.min(visibleOpponentCount, selectedTeamMatches.length)}</span> / {selectedTeamMatches.length} Rakip
                </span>
              </div>

              <div className="drawpage-match-grid" style={{ gap: '0.8rem' }}>
                {[1, 2, 3, 4].map((potNum) => {
                  const pc = POT_COLORS[potNum];
                  const potOpponents = selectedTeamMatches.slice(0, visibleOpponentCount).filter((m: any) => m.pot === potNum);
                  return (
                    <div key={potNum} style={{ borderRadius: '16px', border: `1px solid ${pc.border}`, background: pc.bg, overflow: 'hidden' }}>
                      <div style={{ height: '3px', background: pc.strip }} />
                      <div style={{ padding: '0.9rem 1rem 0.75rem', borderBottom: `1px solid ${pc.border}`, display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: pc.accent, boxShadow: `0 0 6px ${pc.accent}` }} />
                        <span style={{ color: pc.accent, fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Torba {potNum}</span>
                      </div>
                      <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {potOpponents.length > 0 ? potOpponents.map((match: any, idx: number) => (
                          <div key={idx} style={{ borderRadius: '10px', padding: '9px 11px', background: 'rgba(255,255,255,0.04)', borderLeft: `3px solid ${match.isHome ? '#38bdf8' : '#f472b6'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                              <span style={{ fontSize: '0.63rem', color: match.isHome ? '#7dd3fc' : '#f9a8d4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{match.isHome ? 'Ev' : 'Dep.'}</span>
                              <span style={{ fontSize: '0.63rem', color: '#475569' }}>C:{match.opponent?.coefficient}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {resolveFlag(match.opponent?.country, 22, 15) || <div style={{ width: 22, height: 15, borderRadius: '3px', background: '#1e293b', flexShrink: 0 }} />}
                              <div style={{ minWidth: 0 }}>
                                <div style={{ color: '#e2e8f0', fontSize: '0.83rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.opponent?.name}</div>
                                <div style={{ color: '#475569', fontSize: '0.68rem' }}>{match.opponent?.country}</div>
                              </div>
                            </div>
                          </div>
                        )) : (
                          <p style={{ color: '#1e293b', fontSize: '0.78rem', textAlign: 'center', padding: '2rem 0', fontStyle: 'italic' }}>Henüz rakip atanmadı</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        ) : result && !simulationMode ? (
          /* ── TEAM SELECTION ── */
          <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(2,10,40,0.85)', backdropFilter: 'blur(20px)', boxShadow: '0 24px 64px -16px rgba(59,130,246,0.22)' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', margin: '0 0 0.3rem' }}>Takım Seçimi</h3>
                <p style={{ color: '#475569', fontSize: '0.82rem', margin: 0 }}>Maçlarını görmek için bir takım seçin</p>
              </div>
              <span style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', color: '#000', fontWeight: 900, fontSize: '0.72rem', padding: '6px 18px', borderRadius: '9999px', letterSpacing: '1px', textTransform: 'uppercase' }}>36 Takım</span>
            </div>

            <div className="drawpage-team-grid" style={{ padding: 'clamp(0.75rem, 2.5vw, 1.5rem) clamp(0.75rem, 2.5vw, 2rem) clamp(1rem, 2.5vw, 2rem)', gap: '0.8rem' }}>
              {teamsByPot.map(({ potNum, teams }) => {
                const pc = POT_COLORS[potNum];
                return (
                  <div key={potNum} style={{ borderRadius: '16px', border: `1px solid ${pc.border}`, background: pc.bg, overflow: 'hidden' }}>
                    <div style={{ height: '3px', background: pc.strip }} />
                    <div style={{ padding: '0.9rem 1rem 0.75rem', borderBottom: `1px solid ${pc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: pc.accent }} />
                      <span style={{ color: pc.accent, fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Torba {potNum}</span>
                    </div>
                    <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {teams.map((team: Team) => (
                        <button
                          key={team.id}
                          onClick={() => handleStartSimulation(team.id!)}
                          style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '9px', padding: '9px 11px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#fff', transition: 'all .15s' }}
                          onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = `rgba(${pc.hover},0.13)`; el.style.borderColor = pc.border; }}
                          onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                        >
                           {resolveFlag(team.country, 24, 16) || <div style={{ width: 24, height: 16, borderRadius: '3px', background: '#1e293b', flexShrink: 0 }} />}
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ color: '#f1f5f9', fontSize: '0.82rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{team.name}</div>
                            <div style={{ fontSize: '0.67rem', marginTop: '2px' }}>
                              {team.qualified
                                ? <span style={{ color: '#34d399' }}>✓ Kesin</span>
                                : <span style={{ color: '#fb923c' }}>⚠ Qualifying</span>}
                              <span style={{ color: '#334155' }}>&nbsp;·&nbsp;</span>
                              <span style={{ color: '#475569' }}>C:{team.coefficient}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
