const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const dataPath = path.join(process.cwd(), 'backend', 'data', 'draw-result-swiss.json');
    if (!fs.existsSync(dataPath)) return res.status(404).json({ error: 'Henüz kura çekilmedi.' });
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    return res.status(200).json({ matches: data.matches, schedule: data.schedule, totalMatches: data.totalMatches });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
