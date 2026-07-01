const express = require('express');
const fs = require('fs');
const path = require('path');
const { swissSystemDraw } = require('../logic/swissSystemDraw');

const router = express.Router();
const dataPath = path.join(__dirname, '../data');

// GET /api/draw/result - Son kura sonuçlarını getir
router.get('/result', (req, res) => {
  try {
    const filePath = path.join(dataPath, 'draw-result-swiss.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      res.json(data);
    } else {
      res.json(null);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/draw/all-matches - Tüm 144 maçı getir (son kura sonucundan)
router.get('/all-matches', (req, res) => {
  try {
    const filePath = path.join(dataPath, 'draw-result-swiss.json');
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Henüz kura çekilmedi.' });
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json({ matches: data.matches, schedule: data.schedule, totalMatches: data.totalMatches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/draw/swiss - İsviçre Sistemi Kura Çekimi (36 takım)
router.post('/swiss', (req, res) => {
  try {
    const teamsPath = path.join(dataPath, 'teams-36.json');
    const teams = JSON.parse(fs.readFileSync(teamsPath, 'utf-8'));

    // İsviçre Sistemi kura çekimi
    const result = swissSystemDraw(teams);

    // Sonuçları kaydet
    const drawResult = {
      timestamp: new Date().toISOString(),
      system: 'Swiss System',
      totalTeams: 36,
      ...result,
    };

    fs.writeFileSync(
      path.join(dataPath, 'draw-result-swiss.json'),
      JSON.stringify(drawResult, null, 2)
    );

    res.json(drawResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
