/**
 * UEFA Şampiyonlar Ligi İsviçre Sistemi Kura Algoritması
 * Tarayıcıda çalışan pure JavaScript — backend bağımlılığı yok
 *
 * Kurallar:
 * 1. 36 takım, 4 torba (her biri 9 takım)
 * 2. Her takım tam 8 farklı rakiple eşleşir
 * 3. Her torbadan tam 2 rakip (kendi torbasından da 2)
 * 4. Her torbadan 1 ev + 1 deplasman → toplamda 4 ev + 4 deplasman
 * 5. Aynı ülkeden takımlar eşleşemez
 * 6. Aynı yabancı ülkeden en fazla 2 rakip
 * 7. Simetri: A→B ev ise B→A deplasman (çift yönlü atama)
 */

interface Team {
  id: number;
  name: string;
  country: string;
  pot: number;
  coefficient: number;
  color?: string;
  path?: string;
  qualified: boolean;
}

interface OpponentEntry {
  opponentId: number;
  isHome: boolean;
}

interface TeamState {
  opponents: OpponentEntry[];
  oppByPot: Record<number, number[]>;
  homeByPot: Record<number, number>;
  homeCount: number;
  awayCount: number;
}

interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeTeamId: number;
  awayTeamId: number;
  result: null;
  round?: number;
}

interface DrawResult {
  timestamp: string;
  system: string;
  totalTeams: number;
  teams: Team[];
  teamSchedules: Record<number, Record<number, Array<{ opponent: Team; isHome: boolean }>>>;
  matches: Match[];
  schedule: Record<number, Match[]>;
  totalMatches: number;
  totalRounds: number;
}

function shuffle(arr: Team[]): Team[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(t: Team): Team {
  return {
    id: t.id,
    name: t.name,
    color: t.color,
    pot: t.pot,
    country: t.country,
    coefficient: t.coefficient,
    path: t.path,
    qualified: t.qualified,
  };
}

export function swissSystemDraw(teams: Team[]): DrawResult {
  if (!teams || teams.length !== 36) {
    throw new Error('İsviçre Sistemi için tam 36 takım gereklidir.');
  }

  const pots: Record<number, Team[]> = { 1: [], 2: [], 3: [], 4: [] };
  const teamById: Record<number, Team> = {};

  for (const t of teams) {
    pots[t.pot].push(t);
    teamById[t.id] = t;
  }

  const OUTER_MAX = 500;

  for (let outerAttempt = 0; outerAttempt < OUTER_MAX; outerAttempt++) {
    // Per-team state
    const st: Record<number, TeamState> = {};
    for (const t of teams) {
      st[t.id] = {
        opponents: [],
        oppByPot: { 1: [], 2: [], 3: [], 4: [] },
        homeByPot: { 1: 0, 2: 0, 3: 0, 4: 0 },
        homeCount: 0,
        awayCount: 0,
      };
    }

    // Count existing opponents from a given country
    function countryCount(teamId: number, country: string): number {
      return st[teamId].opponents.filter(
        (o) => teamById[o.opponentId].country === country
      ).length;
    }

    // Can a and b be matched? (checks constraints only — home/away handled externally)
    function canMatch(a: Team, b: Team, aPot: number, bPot: number): boolean {
      if (a.id === b.id) return false;
      if (st[a.id].opponents.some((o) => o.opponentId === b.id)) return false;
      if (a.country === b.country) return false;
      if (st[a.id].oppByPot[bPot].length >= 2) return false;
      if (st[b.id].oppByPot[aPot].length >= 2) return false;
      if (countryCount(a.id, b.country) >= 2) return false;
      if (countryCount(b.id, a.country) >= 2) return false;
      return true;
    }

    // Add a match with explicit home/away
    function addMatch(
      a: Team,
      b: Team,
      aPot: number,
      bPot: number,
      aIsHome: boolean
    ): void {
      st[a.id].opponents.push({ opponentId: b.id, isHome: aIsHome });
      st[a.id].oppByPot[bPot].push(b.id);
      if (aIsHome) {
        st[a.id].homeByPot[bPot]++;
        st[a.id].homeCount++;
      } else {
        st[a.id].awayCount++;
      }

      st[b.id].opponents.push({ opponentId: a.id, isHome: !aIsHome });
      st[b.id].oppByPot[aPot].push(a.id);
      if (!aIsHome) {
        st[b.id].homeByPot[aPot]++;
        st[b.id].homeCount++;
      } else {
        st[b.id].awayCount++;
      }
    }

    function removeMatch(
      a: Team,
      b: Team,
      aPot: number,
      bPot: number
    ): void {
      const oA = st[a.id].opponents.find((o) => o.opponentId === b.id);
      if (!oA) return;
      const aIsHome = oA.isHome;

      st[a.id].opponents = st[a.id].opponents.filter(
        (o) => o.opponentId !== b.id
      );
      st[a.id].oppByPot[bPot] = st[a.id].oppByPot[bPot].filter((id) => id !== b.id);
      if (aIsHome) {
        st[a.id].homeByPot[bPot]--;
        st[a.id].homeCount--;
      } else {
        st[a.id].awayCount--;
      }

      st[b.id].opponents = st[b.id].opponents.filter(
        (o) => o.opponentId !== a.id
      );
      st[b.id].oppByPot[aPot] = st[b.id].oppByPot[aPot].filter((id) => id !== a.id);
      if (!aIsHome) {
        st[b.id].homeByPot[aPot]--;
        st[b.id].homeCount--;
      } else {
        st[b.id].awayCount--;
      }
    }

    // Try to find a valid random permutation of listB paired with listA
    function findPerm(
      listA: Team[],
      listB: Team[],
      pPot: number,
      qPot: number,
      maxTries = 400
    ): Team[] | null {
      for (let i = 0; i < maxTries; i++) {
        const perm = shuffle(listB);
        let valid = true;
        for (let j = 0; j < listA.length; j++) {
          if (!canMatch(listA[j], perm[j], pPot, qPot)) {
            valid = false;
            break;
          }
        }
        if (valid) return perm;
      }
      return null;
    }

    // Within-pot (p == q): yönlü döngü
    function assignWithinPot(potTeams: Team[], potNum: number): boolean {
      for (let att = 0; att < 600; att++) {
        const perm = shuffle(potTeams);
        let valid = true;
        for (let j = 0; j < perm.length; j++) {
          if (!canMatch(perm[j], perm[(j + 1) % perm.length], potNum, potNum)) {
            valid = false;
            break;
          }
        }
        if (!valid) continue;
        for (let j = 0; j < perm.length; j++) {
          addMatch(perm[j], perm[(j + 1) % perm.length], potNum, potNum, true);
        }
        return true;
      }
      return false;
    }

    // Cross-pot (p < q): 2 permütasyon
    function assignCrossPot(
      listA: Team[],
      listB: Team[],
      pPot: number,
      qPot: number
    ): boolean {
      for (let outer = 0; outer < 200; outer++) {
        const perm1 = findPerm(listA, listB, pPot, qPot);
        if (!perm1) continue;

        for (let i = 0; i < listA.length; i++) addMatch(listA[i], perm1[i], pPot, qPot, true);

        const perm2 = findPerm(listA, listB, pPot, qPot);
        if (perm2) {
          for (let i = 0; i < listA.length; i++) addMatch(listA[i], perm2[i], pPot, qPot, false);
          return true;
        }

        // Rollback perm1 and retry
        for (let i = 0; i < listA.length; i++) removeMatch(listA[i], perm1[i], pPot, qPot);
      }
      return false;
    }

    let failed = false;

    // Step 1: Within-pot matches
    for (let p = 1; p <= 4 && !failed; p++) {
      if (!assignWithinPot(pots[p], p)) failed = true;
    }

    // Step 2: Cross-pot matches
    for (let p = 1; p <= 4 && !failed; p++) {
      for (let q = p + 1; q <= 4 && !failed; q++) {
        if (!assignCrossPot(pots[p], pots[q], p, q)) failed = true;
      }
    }

    if (failed) continue;

    // Validate all constraints
    const valid = teams.every((t) => {
      const s = st[t.id];
      return (
        s.opponents.length === 8 &&
        [1, 2, 3, 4].every((pot) => s.oppByPot[pot].length === 2) &&
        s.homeCount === 4 &&
        s.awayCount === 4 &&
        [1, 2, 3, 4].every((pot) => s.homeByPot[pot] === 1)
      );
    });

    if (!valid) continue;

    // Build teamSchedules
    const teamSchedules: Record<number, Record<number, Array<{ opponent: Team; isHome: boolean }>>> = {};
    for (const t of teams) {
      teamSchedules[t.id] = { 1: [], 2: [], 3: [], 4: [] };
      for (const { opponentId, isHome } of st[t.id].opponents) {
        const opp = teamById[opponentId];
        teamSchedules[t.id][opp.pot].push({ opponent: pick(opp), isHome });
      }
    }

    // Build flat match list
    const seen = new Set<string>();
    const matches: Match[] = [];
    for (const t of teams) {
      for (const { opponentId, isHome } of st[t.id].opponents) {
        if (!isHome) continue;
        const key = `${t.id}_${opponentId}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const opp = teamById[opponentId];
        matches.push({
          id: `match_${key}`,
          homeTeam: pick(t),
          awayTeam: pick(opp),
          homeTeamId: t.id,
          awayTeamId: opp.id,
          result: null,
        });
      }
    }

    // Group matches into 8 rounds
    const schedule: Record<number, Match[]> = {};
    matches.forEach((m, idx) => {
      const r = (idx % 8) + 1;
      m.round = r;
      if (!schedule[r]) schedule[r] = [];
      schedule[r].push(m);
    });

    return {
      timestamp: new Date().toISOString(),
      system: 'Swiss System',
      totalTeams: 36,
      teams,
      teamSchedules,
      matches,
      schedule,
      totalMatches: matches.length,
      totalRounds: 8,
    };
  }

  throw new Error(`Kura çekimi ${OUTER_MAX} denemede başarısız oldu. Lütfen tekrar deneyin.`);
}
