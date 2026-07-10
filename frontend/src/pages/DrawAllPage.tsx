import { useEffect, useRef, useState } from 'react';
import { drawAPI } from '../services/api';
import { GB, DE, ES, FR, IT, PT, TR, BE, NL, HR, CZ, RS, NO, UA, AT, CH, PL, SK} from 'country-flag-icons/react/3x2';

const COUNTRY_FLAGS: Record<string, any> = {
  EN: GB, DE: DE, ES: ES, FR: FR, IT: IT,
  PT: PT, TR: TR, BE: BE, NL: NL,
  HR: HR, CZ: CZ, RS: RS, NO: NO,
  UA: UA, AT: AT, CH: CH, PL:PL, GB:GB , SK:SK
};
interface Team {
  id: number;
  name: string;
  country: string;
  pot: number;
  coefficient?: number;
  qualified?: boolean;
}

interface ScheduleEntry { opponent: Team; isHome: boolean }
interface DrawResult {
  teams: Team[];
  teamSchedules: Record<string, Record<string, ScheduleEntry[]>>;
  matches: any[];
}

const POT_COLORS = [
  null,
  { accent: '#fbbf24', border: 'rgba(251,191,36,0.25)', bg: 'rgba(251,191,36,0.05)', strip: 'linear-gradient(90deg,#f59e0b,#fcd34d)', hover: '251,191,36' },
  { accent: '#38bdf8', border: 'rgba(56,189,248,0.25)', bg: 'rgba(56,189,248,0.05)', strip: 'linear-gradient(90deg,#0ea5e9,#7dd3fc)', hover: '56,189,248' },
  { accent: '#34d399', border: 'rgba(52,211,153,0.25)', bg: 'rgba(52,211,153,0.05)', strip: 'linear-gradient(90deg,#10b981,#6ee7b7)', hover: '52,211,153' },
  { accent: '#a78bfa', border: 'rgba(167,139,250,0.25)', bg: 'rgba(167,139,250,0.05)', strip: 'linear-gradient(90deg,#8b5cf6,#c4b5fd)', hover: '167,139,250' },
] as any[];

function flattenSchedule(schedule?: Record<string, ScheduleEntry[]>): ScheduleEntry[] {
  if (!schedule) return [];
  const out: ScheduleEntry[] = [];
  [1, 2, 3, 4].forEach((p) => out.push(...(schedule[String(p)] || [])));
  return out;
}

function resolveFlag(countryName?: string, width = 24, height = 16) {
  if (!countryName || !COUNTRY_FLAGS[countryName]) return null;
  const FlagComponent = COUNTRY_FLAGS[countryName];
  return <FlagComponent style={{ width, height, borderRadius: '3px', objectFit: 'cover', flexShrink: 0 }} />;
}
// Fisher-Yates: torba içindeki topların DİZİLİŞİNİ (pozisyonunu) gerçek kura gibi karıştırır,
// böylece "1. pozisyon hep Bayern" gibi ezbere bilinen bir sıra oluşmaz.
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DrawAllPage() {
  const [result, setResult] = useState<DrawResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stage, setStage] = useState<'idle' | 'drawing' | 'results'>('idle');
  const [currentPot, setCurrentPot] = useState(1); // o an tıklanabilir olan torba
  const [potBallOrder, setPotBallOrder] = useState<Record<number, Team[]>>({}); // her torbadaki topların karışık dizilişi
  const [drawnIds, setDrawnIds] = useState<number[]>([]); // çekilme sırasına göre takım id'leri
  const [visibleOpponentCount, setVisibleOpponentCount] = useState(0);
  const [revealing, setRevealing] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [drawingViewedTeamId, setDrawingViewedTeamId] = useState<number | null>(null);
  const advanceLockRef = useRef(false);
  const lastAnimatedTeamIdRef = useRef<number | null>(null);

  async function fetchAndStart() {
    setLoading(true);
    setError('');
    try {
      const data = await drawAPI.swiss();
      setResult(data);
      const order: Record<number, Team[]> = {};
      [1, 2, 3, 4].forEach((p) => {
        order[p] = shuffle(data.teams.filter((t: Team) => t.pot === p));
      });
      setPotBallOrder(order);
      setCurrentPot(1);
      setDrawnIds([]);
      setVisibleOpponentCount(0);
      setSelectedTeamId(null);
      setDrawingViewedTeamId(null);
      setStage('drawing');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Kura çekimi başarısız oldu.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  // Bir topa tıklanınca o takım açılır ve rakipleri büyük ekranda sırayla ortaya çıkar.
  function drawBall(team: Team) {
    if (revealing) return;
    if (team.pot !== currentPot) return;
    if (drawnIds.includes(team.id)) return;
    setDrawingViewedTeamId(team.id);
    setDrawnIds((prev) => [...prev, team.id]);
  }

  useEffect(() => {
    if (stage !== 'drawing' || drawnIds.length === 0 || !result) return;

    const latestDrawnTeamId = drawnIds[drawnIds.length - 1];
    if (lastAnimatedTeamIdRef.current === latestDrawnTeamId) return;
    lastAnimatedTeamIdRef.current = latestDrawnTeamId;

    advanceLockRef.current = false;
    setRevealing(true);
    setVisibleOpponentCount(0);
    let advanceTimer: number | null = null;
    const timer = window.setInterval(() => {
      setVisibleOpponentCount((v) => {
        if (v >= 8 && !advanceLockRef.current) {
          advanceLockRef.current = true;
          window.clearInterval(timer);
          setRevealing(false);

          const potTeamIds = result.teams.filter((t) => t.pot === currentPot).map((t) => t.id);
          const potDone = potTeamIds.every((id) => drawnIds.includes(id));
          if (potDone) {
            if (currentPot < 4) {
              const nextPot = currentPot + 1;
              advanceTimer = window.setTimeout(() => setCurrentPot(nextPot), 700);
            } else {
              advanceTimer = window.setTimeout(() => {
                setStage('results');
                setSelectedTeamId(drawnIds[0] ?? null);
              }, 900);
            }
          }
          return v;
        }
        return v + 1;
      });
    }, 150);
    return () => {
      window.clearInterval(timer);
      if (advanceTimer) window.clearTimeout(advanceTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawnIds, stage, result]);

  const teamsByPot = [1, 2, 3, 4].map((potNum) => ({
    potNum,
    teams: result?.teams.filter((t) => t.pot === potNum) || [],
  }));

  // Çekiliş ekranındaki toplar bu karışık dizilişle gösterilir (pozisyon hiçbir şey ele vermesin).
  const ballsByPot = [1, 2, 3, 4].map((potNum) => ({
    potNum,
    teams: potBallOrder[potNum] || [],
  }));

  const totalTeams = result?.teams.length || 36;
  const latestDrawnTeamId = drawnIds.length > 0 ? drawnIds[drawnIds.length - 1] : null;
  const drawingDisplayTeamId = drawingViewedTeamId ?? latestDrawnTeamId;
  const activeTeam = result?.teams.find((t) => t.id === drawingDisplayTeamId);
  const activeMatches = flattenSchedule(result?.teamSchedules[String(drawingDisplayTeamId)]);

  const selectedTeam = result?.teams.find((t) => t.id === selectedTeamId);
  const selectedMatches = flattenSchedule(result?.teamSchedules[String(selectedTeamId)]);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1.5rem', background: 'linear-gradient(160deg, #020b2b 0%, #0e0420 55%, #1a0635 100%)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg,rgba(250,204,21,0.1),rgba(99,102,241,0.1))', border: '1px solid rgba(250,204,21,0.22)', borderRadius: '9999px', padding: '8px 28px', marginBottom: '1.5rem' }}>
            <span style={{ color: '#fbbf24', fontSize: '13px' }}>★</span>
            <span style={{ color: '#bfdbfe', fontSize: '11px', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase' }}>UEFA Şampiyonlar Ligi</span>
            <span style={{ color: '#fbbf24', fontSize: '13px' }}>★</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 1.5rem', background: 'linear-gradient(135deg,#fff 0%,#bfdbfe 55%,#818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            ⚽ Tüm Takımlar Canlı Kurası
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[['36', 'Takım'], ['144', 'Toplam Maç'], ['2', 'Torba Başına Rakip']].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center', minWidth: '72px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: '0.65rem', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '5px' }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── DRAW BUTTON ── */}
        {stage === 'idle' && (
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <button
              onClick={fetchAndStart}
              disabled={loading}
              style={{
                padding: '18px 60px', fontSize: '1.15rem', fontWeight: 900, letterSpacing: '1px',
                borderRadius: '14px', border: loading ? '1px solid #1e293b' : '1px solid rgba(250,204,21,0.3)',
                background: loading ? '#1e293b' : 'linear-gradient(135deg,#1d4ed8 0%,#4338ca 100%)',
                color: loading ? '#475569' : '#fff', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 52px -8px rgba(99,102,241,0.65),0 16px 32px -8px rgba(0,0,0,0.5)',
                transition: 'all .2s',
              }}
            >{loading ? '🔄 Torbalar Hazırlanıyor...' : '🎯 Kura Çekilişini Başlat'}</button>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(127,29,29,0.4)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', padding: '16px 28px', borderRadius: '12px', marginBottom: '2.5rem' }}>
            {error}
          </div>
        )}

        {/* ── DRAWING: click a ball in the active pot to draw it ── */}
        {stage === 'drawing' && result && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <span style={{ background: 'rgba(99,102,241,0.14)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '8px 22px', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700 }}>
                {revealing
                  ? '🎱 Top açılıyor...'
                  : <>Torba <span style={{ color: '#fbbf24' }}>{currentPot}</span>'den bir topa tıklayın · <span style={{ color: '#fbbf24' }}>{drawnIds.length}</span> / {totalTeams} çekildi</>}
              </span>
            </div>

            <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden', marginBottom: '2rem' }}>
              <div style={{ width: `${Math.round((drawnIds.length / totalTeams) * 100)}%`, height: '100%', background: 'linear-gradient(90deg,#fbbf24,#8b5cf6)', transition: 'width .3s' }} />
            </div>

            <div className="drawall-drawing-grid">

              {/* Pot bowls with clickable balls */}
              <div className="drawall-pot-grid">
                {ballsByPot.map(({ potNum, teams }) => {
                  const pc = POT_COLORS[potNum];
                  const isActivePot = potNum === currentPot;
                  return (
                    <div key={potNum} style={{
                      borderRadius: '18px', border: `1px solid ${isActivePot ? pc.accent : pc.border}`,
                      background: `radial-gradient(circle at 50% 0%, ${pc.bg}, rgba(2,10,40,0.6))`, overflow: 'hidden',
                      boxShadow: isActivePot ? `0 0 24px -8px ${pc.accent}` : 'none',
                      opacity: potNum < currentPot || isActivePot ? 1 : 0.4,
                      transition: 'all .25s',
                    }}>
                      <div style={{ height: '3px', background: pc.strip }} />
                      <div style={{ padding: '0.8rem 1rem 0.7rem', borderBottom: `1px solid ${pc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: pc.accent }} />
                        <span style={{ color: pc.accent, fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Torba {potNum}</span>
                      </div>
                      <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', justifyItems: 'center' }}>
                        {teams.map((team) => {
                          const isDrawn = drawnIds.includes(team.id);
                          const isActive = team.id === drawingDisplayTeamId;
                          const isClickable = isActivePot && !isDrawn && !revealing;
                          if (isDrawn) {
                            return (
                              <button
                                key={team.id}
                                title={team.name}
                                onClick={() => setDrawingViewedTeamId(team.id)}
                                style={{
                                width: '100%', minHeight: 64, borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                                background: '#0b1340', border: `2px solid ${isActive ? pc.accent : 'rgba(255,255,255,0.12)'}`,
                                boxShadow: isActive ? `0 0 18px -2px ${pc.accent}` : 'inset 0 0 0 1px rgba(255,255,255,0.03)',
                                transition: 'all .25s',
                                cursor: 'pointer',
                                padding: '6px 4px',
                              }}
                              >
                                {resolveFlag(team.country, 28, 19) || <div style={{ width: 28, height: 19, borderRadius: '3px', background: '#1e293b' }} />}
                                <span style={{ color: '#e2e8f0', fontSize: '0.58rem', fontWeight: 700, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', lineHeight: 1.2 }}>
                                  {team.name}
                                </span>
                              </button>
                            );
                          }
                          // Boş kura topu — üzerinde isim/logo yok, tıklanana kadar takım gizli.
                          return (
                            <button
                              key={team.id}
                              onClick={() => drawBall(team)}
                              disabled={!isClickable}
                              aria-label="Kura topu"
                              style={{
                                width: 60, height: 60, borderRadius: '50%', padding: 0,
                                background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55), transparent 42%), radial-gradient(circle at 55% 60%, ${pc.accent}aa, ${pc.accent}22 75%)`,
                                border: `1px solid ${pc.border}`,
                                boxShadow: isClickable ? `0 4px 14px -2px ${pc.accent}` : '0 4px 10px -2px rgba(0,0,0,0.5)',
                                cursor: isClickable ? 'pointer' : 'default',
                                transform: 'scale(1)',
                                transition: 'transform .15s, box-shadow .15s',
                              }}
                              onMouseEnter={(e) => { if (isClickable) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Big screen */}
              <div style={{
                borderRadius: '24px', border: '10px solid #0a0a12', background: '#000',
                boxShadow: '0 32px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.25)',
                overflow: 'hidden', minHeight: 480,
              }}>
                <div style={{ background: 'linear-gradient(160deg,#020b2b 0%,#0e0420 100%)', padding: '2rem 2.25rem', minHeight: 480, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ textAlign: 'center', color: '#475569', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    ● CANLI KURA EKRANI
                  </div>

                  {!activeTeam ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <p style={{ color: '#475569', fontSize: '1rem' }}>Soldaki torbalardan bir topa tıklayarak başlayın 🎱</p>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.75rem' }}>
                        <div style={{ width: 96, height: 96, borderRadius: '20px', overflow: 'hidden', background: '#0b1340', border: '2px solid rgba(251,191,36,0.4)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px -6px rgba(251,191,36,0.45)' }}>
                          {resolveFlag(activeTeam.country, 72, 48)}
                        </div>
                        <div>
                          <div style={{ color: '#93c5fd', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.3rem' }}>
                            TAKIM {drawnIds.length} / {totalTeams}
                          </div>
                          <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 900, color: '#fff', margin: '0 0 0.3rem' }}>{activeTeam.name}</h2>
                          <p style={{ color: '#93c5fd', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>
                            {activeTeam.country}&nbsp;·&nbsp;<span style={{ color: '#fbbf24' }}>Torba {activeTeam.pot}</span>
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 700 }}>Eşleşmeler</span>
                        <span style={{ background: 'rgba(99,102,241,0.14)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '5px 16px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700 }}>
                          <span style={{ color: '#fbbf24' }}>{Math.min(visibleOpponentCount, 8)}</span> / 8
                        </span>
                      </div>

                      <div className="drawall-bigscreen-matches-grid">
                        {activeMatches.slice(0, visibleOpponentCount).map((m, i) => (
                          <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px',
                            background: 'rgba(255,255,255,0.05)', borderLeft: `3px solid ${m.isHome ? '#38bdf8' : '#f472b6'}`,
                          }}>
                            {resolveFlag(m.opponent.country, 28, 19) || <div style={{ width: 28, height: 19, borderRadius: '3px', background: '#1e293b', flexShrink: 0 }} />}
                            <div style={{ minWidth: 0 }}>
                              <div style={{ color: '#e2e8f0', fontSize: '0.82rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.opponent.name}</div>
                              <div style={{ fontSize: '0.65rem', color: m.isHome ? '#7dd3fc' : '#f9a8d4', fontWeight: 700 }}>{m.isHome ? 'EV SAHİBİ' : 'DEPLASMAN'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {stage === 'results' && result && (
          <div className="drawall-results-grid">

            {/* Team selector grid */}
            <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(2,10,40,0.85)', backdropFilter: 'blur(20px)' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', margin: '0 0 0.2rem' }}>Takım Seçimi</h3>
                <p style={{ color: '#475569', fontSize: '0.78rem', margin: 0 }}>Maçlarını görmek için bir takım seçin</p>
              </div>
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: 720, overflowY: 'auto' }}>
                {teamsByPot.map(({ potNum, teams }) => {
                  const pc = POT_COLORS[potNum];
                  return (
                    <div key={potNum} style={{ borderRadius: '14px', border: `1px solid ${pc.border}`, background: pc.bg, overflow: 'hidden' }}>
                      <div style={{ height: '3px', background: pc.strip }} />
                      <div style={{ padding: '0.6rem 0.9rem', borderBottom: `1px solid ${pc.border}`, display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: pc.accent }} />
                        <span style={{ color: pc.accent, fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Torba {potNum}</span>
                      </div>
                      <div style={{ padding: '0.6rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {teams.map((team) => (
                          <button
                            key={team.id}
                            onClick={() => setSelectedTeamId(team.id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '9px', width: '100%', textAlign: 'left',
                              padding: '8px 10px', borderRadius: '10px', cursor: 'pointer',
                              background: selectedTeamId === team.id ? `rgba(${pc.hover},0.16)` : 'rgba(255,255,255,0.03)',
                              border: selectedTeamId === team.id ? `1px solid ${pc.accent}` : '1px solid rgba(255,255,255,0.06)',
                              color: '#fff',
                            }}
                          >
                            {resolveFlag(team.country, 24, 16) || <div style={{ width: 24, height: 16, borderRadius: '3px', background: '#1e293b', flexShrink: 0 }} />}
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{team.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: selected team's plan + full match list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(2,10,40,0.9)', backdropFilter: 'blur(20px)' }}>
                <div style={{ background: 'linear-gradient(135deg,#0f1f6e 0%,#0c0a2e 100%)', padding: '1.75rem 2rem', borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
                  {selectedTeam ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                      <div style={{ width: 64, height: 64, borderRadius: '14px', overflow: 'hidden', background: '#1e3a8a', border: '2px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {resolveFlag(selectedTeam.country, 48, 32)}
                      </div>
                      <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '0 0 0.25rem' }}>{selectedTeam.name}</h2>
                        <p style={{ color: '#93c5fd', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>
                          {selectedTeam.country}&nbsp;·&nbsp;<span style={{ color: '#fbbf24' }}>Torba {selectedTeam.pot}</span>
                        </p>
                      </div>
                    </div>
                  ) : <p style={{ color: '#94a3b8' }}>Bir takım seçin</p>}
                </div>
                <div className="drawall-pot-detail-grid" style={{ padding: '1.75rem 2rem' }}>
                  {[1, 2, 3, 4].map((potNum) => {
                    const pc = POT_COLORS[potNum];
                    const opponents = selectedMatches.filter((m) => m.opponent.pot === potNum);
                    return (
                      <div key={potNum} style={{ borderRadius: '14px', border: `1px solid ${pc.border}`, background: pc.bg, overflow: 'hidden' }}>
                        <div style={{ height: '3px', background: pc.strip }} />
                        <div style={{ padding: '0.7rem 0.85rem', borderBottom: `1px solid ${pc.border}` }}>
                          <span style={{ color: pc.accent, fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Torba {potNum}</span>
                        </div>
                        <div style={{ padding: '0.65rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {opponents.length > 0 ? opponents.map((m, i) => (
                            <div key={i} style={{ borderRadius: '9px', padding: '7px 9px', background: 'rgba(255,255,255,0.04)', borderLeft: `3px solid ${m.isHome ? '#38bdf8' : '#f472b6'}` }}>
                              <div style={{ fontSize: '0.6rem', color: m.isHome ? '#7dd3fc' : '#f9a8d4', fontWeight: 700, marginBottom: '3px' }}>{m.isHome ? 'EV' : 'DEPLASMAN'}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {resolveFlag(m.opponent.country, 20, 14) || <div style={{ width: 20, height: 14, borderRadius: '3px', background: '#1e293b' }} />}
                                <span style={{ color: '#e2e8f0', fontSize: '0.74rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.opponent.name}</span>
                              </div>
                            </div>
                          )) : <p style={{ color: '#1e293b', fontSize: '0.7rem', textAlign: 'center', padding: '1rem 0', fontStyle: 'italic' }}>Rakip yok</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(2,10,40,0.85)', backdropFilter: 'blur(20px)' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', margin: 0 }}>Tüm Maçlar</h3>
                  <span style={{ background: 'rgba(99,102,241,0.14)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '5px 14px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>{result.matches.length}</span>
                </div>
                <div style={{ maxHeight: 360, overflowY: 'auto', padding: '0.5rem 0.5rem' }}>
                  {result.matches.map((m: any) => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ color: '#e2e8f0', fontSize: '0.82rem' }}>
                        <strong>{m.homeTeam.name}</strong> <span style={{ color: '#475569' }}>vs</span> {m.awayTeam.name}
                      </span>
                      <span style={{ color: '#64748b', fontSize: '0.7rem' }}>{m.round}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}