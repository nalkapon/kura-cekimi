'use strict';
/**
 * UEFA Şampiyonlar Ligi İsviçre Sistemi Kura Algoritması
 *
 * Kurallar:
 * 1. 36 takım, 4 torba (her biri 9 takım)
 * 2. Her takım tam 8 farklı rakiple eşleşir
 * 3. Her torbadan tam 2 rakip (kendi torbasından da 2)
 * 4. Her torbadan 1 ev + 1 deplasman → toplamda 4 ev + 4 deplasman
 * 5. Aynı ülkeden takımlar eşleşemez
 * 6. Aynı yabancı ülkeden en fazla 2 rakip
 * 7. Simetri: A→B ev ise B→A deplasman (çift yönlü atama)
 *
 * Yaklaşım:
 * - Aynı torba içi: yönlü döngü → her takım tam 1 ev + 1 deplasman (kendi torbasından)
 * - Çapraz torba: 2 permütasyon; perm1'de listA ev, perm2'de listB ev
 *   → her torba çifti için tam 1 ev + 1 deplasman garantisi
 */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(t) {
  return {
    id: t.id, name: t.name, color: t.color, pot: t.pot,
    country: t.country, coefficient: t.coefficient,
    path: t.path, qualified: t.qualified,
  };
}

const swissSystemDraw = (teams) => {
  if (!teams || teams.length !== 36) {
    throw new Error('İsviçre Sistemi için tam 36 takım gereklidir.');
  }

  const pots = { 1: [], 2: [], 3: [], 4: [] };
  const teamById = {};
  for (const t of teams) {
    pots[t.pot].push(t);
    teamById[t.id] = t;
  }

  const OUTER_MAX = 500;

  for (let outerAttempt = 0; outerAttempt < OUTER_MAX; outerAttempt++) {

    // Per-team state
    const st = {};
    for (const t of teams) {
      st[t.id] = {
        opponents: [],          // [{ opponentId, isHome }]
        oppByPot: { 1:[], 2:[], 3:[], 4:[] },
        homeByPot: { 1:0, 2:0, 3:0, 4:0 },
        homeCount: 0,
        awayCount: 0,
      };
    }

    // Count existing opponents from a given country
    function countryCount(teamId, country) {
      return st[teamId].opponents.filter(o => teamById[o.opponentId].country === country).length;
    }

    // Can a and b be matched? (checks constraints only — home/away handled externally)
    function canMatch(a, b, aPot, bPot) {
      if (a.id === b.id) return false;
      if (st[a.id].opponents.some(o => o.opponentId === b.id)) return false; // already matched
      if (a.country === b.country) return false;                              // Rule 5
      if (st[a.id].oppByPot[bPot].length >= 2) return false;                 // pot quota a
      if (st[b.id].oppByPot[aPot].length >= 2) return false;                 // pot quota b
      if (countryCount(a.id, b.country) >= 2) return false;                  // Rule 6
      if (countryCount(b.id, a.country) >= 2) return false;                  // Rule 6 (symmetric)
      return true;
    }

    // Add a match with explicit home/away — Rule 7 (simetri) built in
    function addMatch(a, b, aPot, bPot, aIsHome) {
      st[a.id].opponents.push({ opponentId: b.id, isHome: aIsHome });
      st[a.id].oppByPot[bPot].push(b.id);
      if (aIsHome) { st[a.id].homeByPot[bPot]++; st[a.id].homeCount++; }
      else           st[a.id].awayCount++;

      st[b.id].opponents.push({ opponentId: a.id, isHome: !aIsHome }); // symmetric
      st[b.id].oppByPot[aPot].push(a.id);
      if (!aIsHome) { st[b.id].homeByPot[aPot]++; st[b.id].homeCount++; }
      else           st[b.id].awayCount++;
    }

    function removeMatch(a, b, aPot, bPot) {
      const oA = st[a.id].opponents.find(o => o.opponentId === b.id);
      if (!oA) return;
      const aIsHome = oA.isHome;

      st[a.id].opponents = st[a.id].opponents.filter(o => o.opponentId !== b.id);
      st[a.id].oppByPot[bPot] = st[a.id].oppByPot[bPot].filter(id => id !== b.id);
      if (aIsHome) { st[a.id].homeByPot[bPot]--; st[a.id].homeCount--; }
      else           st[a.id].awayCount--;

      st[b.id].opponents = st[b.id].opponents.filter(o => o.opponentId !== a.id);
      st[b.id].oppByPot[aPot] = st[b.id].oppByPot[aPot].filter(id => id !== a.id);
      if (!aIsHome) { st[b.id].homeByPot[aPot]--; st[b.id].homeCount--; }
      else           st[b.id].awayCount--;
    }

    // Try to find a valid random permutation of listB paired with listA
    function findPerm(listA, listB, pPot, qPot, maxTries = 400) {
      for (let i = 0; i < maxTries; i++) {
        const perm = shuffle(listB);
        let valid = true;
        for (let j = 0; j < listA.length; j++) {
          if (!canMatch(listA[j], perm[j], pPot, qPot)) { valid = false; break; }
        }
        if (valid) return perm;
      }
      return null;
    }

    /**
     * Within-pot (p == q): yönlü döngü
     * perm[0]→perm[1]→...→perm[8]→perm[0]
     * Her kenar (perm[i], perm[i+1]): perm[i] = EV (home)
     * Sonuç: her takım tam 1 ev (kendi "sol" kenarı) + 1 deplasman ("sağ" kenar)
     */
    function assignWithinPot(potTeams, potNum) {
      for (let att = 0; att < 600; att++) {
        const perm = shuffle(potTeams);
        let valid = true;
        for (let j = 0; j < perm.length; j++) {
          if (!canMatch(perm[j], perm[(j + 1) % perm.length], potNum, potNum)) {
            valid = false; break;
          }
        }
        if (!valid) continue;
        for (let j = 0; j < perm.length; j++) {
          addMatch(perm[j], perm[(j + 1) % perm.length], potNum, potNum, true); // perm[j] = ev
        }
        return true;
      }
      return false;
    }

    /**
     * Cross-pot (p < q): 2 permütasyon
     * perm1: listA[i] = EV → listA takımı ev, listB takımı deplasman
     * perm2: listA[i] = DEPLASMAN → listA takımı dep., listB takımı ev
     * Sonuç: hem listA hem listB takımları tam 1 ev + 1 deplasman bu torba çifti için
     */
    function assignCrossPot(listA, listB, pPot, qPot) {
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

    // Step 1: Within-pot matches (4 pots × 9 matches each = 36 matches)
    for (let p = 1; p <= 4 && !failed; p++) {
      if (!assignWithinPot(pots[p], p)) failed = true;
    }

    // Step 2: Cross-pot matches (6 cross-pot pairs × 18 matches each = 108 matches)
    for (let p = 1; p <= 4 && !failed; p++) {
      for (let q = p + 1; q <= 4 && !failed; q++) {
        if (!assignCrossPot(pots[p], pots[q], p, q)) failed = true;
      }
    }

    if (failed) continue;

    // Validate all constraints
    const valid = teams.every(t => {
      const s = st[t.id];
      return (
        s.opponents.length === 8 &&
        [1,2,3,4].every(pot => s.oppByPot[pot].length === 2) &&
        s.homeCount === 4 && s.awayCount === 4 &&
        [1,2,3,4].every(pot => s.homeByPot[pot] === 1)
      );
    });

    if (!valid) continue;

    // Build teamSchedules (frontend per-team view)
    const teamSchedules = {};
    for (const t of teams) {
      teamSchedules[t.id] = { 1:[], 2:[], 3:[], 4:[] };
      for (const { opponentId, isHome } of st[t.id].opponents) {
        const opp = teamById[opponentId];
        teamSchedules[t.id][opp.pot].push({ opponent: pick(opp), isHome });
      }
    }

    // Build flat match list (144 unique matches, from home team's perspective)
    const seen = new Set();
    const matches = [];
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

    // Group matches into 8 rounds (18 matches per round)
    const schedule = {};
    matches.forEach((m, idx) => {
      const r = (idx % 8) + 1;
      m.round = r;
      if (!schedule[r]) schedule[r] = [];
      schedule[r].push(m);
    });

    return {
      teams,
      teamSchedules,
      matches,
      schedule,
      totalMatches: matches.length,
      totalRounds: 8,
    };
  }

  throw new Error(`Kura çekimi ${OUTER_MAX} denemede başarısız oldu. Lütfen tekrar deneyin.`);
};

module.exports = { swissSystemDraw };
