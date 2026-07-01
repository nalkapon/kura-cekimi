// Pot sistemine göre kura çekimi algoritması
// UEFA kuralları: Aynı ülkeden 2+ takım aynı grupta olmasın

const drawAlgorithm = (teams) => {
  if (!teams || teams.length === 0) {
    throw new Error('Takım listesi boş olamaz.');
  }

  // Determine number of groups by dividing teams into 4 pots per group
  if (teams.length % 4 !== 0) {
    throw new Error('Takım sayısı 4\'ün katı olmalıdır.');
  }

  const groupsCount = teams.length / 4;
  const groups = Array(groupsCount).fill(null).map(() => []);
  const maxAttempts = 1000;
  let attempts = 0;

  // Her groupta pot1, pot2, pot3, pot4'ten birer takım olacak
  const draw = () => {
    // Potları oluştur
    const pots = {
      1: teams.filter(t => t.pot === 1).slice(),
      2: teams.filter(t => t.pot === 2).slice(),
      3: teams.filter(t => t.pot === 3).slice(),
      4: teams.filter(t => t.pot === 4).slice(),
    };

    // Grupları resetle
    for (let i = 0; i < 8; i++) {
      groups[i] = [];
    }

    // Her pot'tan 8 grup için takım seç
    for (let pot = 1; pot <= 4; pot++) {
      const potTeams = pots[pot].slice(); // Copy

      for (let groupIdx = 0; groupIdx < 8; groupIdx++) {
        let placed = false;
        let innerAttempts = 0;

        while (!placed && innerAttempts < 50) {
          if (potTeams.length === 0) {
            return null; // Başarısız
          }

          const teamIdx = Math.floor(Math.random() * potTeams.length);
          const team = potTeams[teamIdx];

          if (!team) {
            innerAttempts++;
            continue;
          }

          // Constraint: Aynı ülkeden takım var mı?
          const countryExists = groups[groupIdx].some(t => t.country === team.country);

          if (!countryExists) {
            groups[groupIdx].push(team);
            potTeams.splice(teamIdx, 1);
            placed = true;
          }

          innerAttempts++;
        }

        if (!placed) {
          return null; // Başarısız
        }
      }
    }

    return groups;
  };

  // Retry loop
  let result = null;
  while (!result && attempts < maxAttempts) {
    result = draw();
    attempts++;
  }

  if (!result) {
    throw new Error('Kura çekimi başarısız oldu. Lütfen tekrar deneyin.');
  }

  return result;
};

module.exports = { drawAlgorithm };
