const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const dataPath = path.join(process.cwd(), 'backend', 'data', 'draw-result-swiss.json');
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      return res.status(200).json(data);
    }
    return res.status(200).json(null);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
