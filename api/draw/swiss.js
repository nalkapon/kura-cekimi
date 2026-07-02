const fs = require('fs');
const path = require('path');
const { swissSystemDraw } = require('../../backend/logic/swissSystemDraw');

module.exports = async (req, res) => {
  try {
    // Read teams
    const teamsPath = path.join(process.cwd(), 'backend', 'data', 'teams-36.json');
    if (!fs.existsSync(teamsPath)) return res.status(400).json({ error: 'teams-36.json bulunamadı' });
    const teams = JSON.parse(fs.readFileSync(teamsPath, 'utf-8'));

    const result = swissSystemDraw(teams);

    const drawResult = {
      timestamp: new Date().toISOString(),
      system: 'Swiss System',
      totalTeams: 36,
      ...result,
    };

    // Persist result to backend/data
    const outPath = path.join(process.cwd(), 'backend', 'data', 'draw-result-swiss.json');
    fs.writeFileSync(outPath, JSON.stringify(drawResult, null, 2));

    return res.status(200).json(drawResult);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
