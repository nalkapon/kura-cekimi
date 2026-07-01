import json

teams = [
  # --- TORBA 1 (POT 1) ---
  {"id": 2, "name": "Bayern München", "country": "DE", "pot": 1, "coefficient": 147.5, "path": "champions", "qualified": True},
  {"id": 3, "name": "Real Madrid", "country": "ES", "pot": 1, "coefficient": 144.5, "path": "champions", "qualified": True},
  {"id": 4, "name": "Paris Saint-Germain", "country": "FR", "pot": 1, "coefficient": 132.0, "path": "champions", "qualified": True},
  {"id": 5, "name": "Liverpool", "country": "EN", "pot": 1, "coefficient": 130.0, "path": "champions", "qualified": True},
  {"id": 6, "name": "Internazionale", "country": "IT", "pot": 1, "coefficient": 127.0, "path": "champions", "qualified": True},
  {"id": 1, "name": "Manchester City", "country": "EN", "pot": 1, "coefficient": 125.5, "path": "champions", "qualified": True},
  {"id": 14, "name": "Arsenal", "country": "EN", "pot": 1, "coefficient": 119.0, "path": "champions", "qualified": True},
  {"id": 9, "name": "FC Barcelona", "country": "ES", "pot": 1, "coefficient": 113.25, "path": "champions", "qualified": True},
  {"id": 10, "name": "Atlético Madrid", "country": "ES", "pot": 1, "coefficient": 104.75, "path": "champions", "qualified": True},

  # --- TORBA 2 (POT 2) ---
  {"id": 7, "name": "Borussia Dortmund", "country": "DE", "pot": 2, "coefficient": 100.75, "path": "champions", "qualified": True},
  {"id": 17, "name": "AS Roma", "country": "IT", "pot": 2, "coefficient": 97.75, "path": "champions", "qualified": True},
  {"id": 12, "name": "Benfica", "country": "PT", "pot": 2, "coefficient": 90.0, "path": "league", "qualified": False},
  {"id": 22, "name": "Sporting CP", "country": "PT", "pot": 2, "coefficient": 84.0, "path": "league", "qualified": True},
  {"id": 29, "name": "Aston Villa", "country": "EN", "pot": 2, "coefficient": 83.0, "path": "league", "qualified": True},
  {"id": 13, "name": "FC Porto", "country": "PT", "pot": 2, "coefficient": 80.75, "path": "champions", "qualified": True},
  {"id": 16, "name": "Manchester United", "country": "EN", "pot": 2, "coefficient": 76.5, "path": "champions", "qualified": True},
  {"id": 19, "name": "Club Brugge", "country": "BE", "pot": 2, "coefficient": 75.25, "path": "league", "qualified": True},
  {"id": 31, "name": "Real Betis", "country": "ES", "pot": 2, "coefficient": 74.5, "path": "league", "qualified": True},

  # --- TORBA 3 (POT 3) ---
  {"id": 21, "name": "PSV Eindhoven", "country": "NL", "pot": 3, "coefficient": 71.25, "path": "league", "qualified": True},
  {"id": 24, "name": "Feyenoord", "country": "NL", "pot": 3, "coefficient": 71.0, "path": "league", "qualified": True},
  {"id": 27, "name": "Lille OSC", "country": "FR", "pot": 3, "coefficient": 68.75, "path": "league", "qualified": True},
  {"id": 35, "name": "Bodø/Glimt", "country": "NO", "pot": 3, "coefficient": 64.0, "path": "league", "qualified": False},
  {"id": 11, "name": "Napoli", "country": "IT", "pot": 3, "coefficient": 63.0, "path": "champions", "qualified": True},
  {"id": 8, "name": "RB Leipzig", "country": "DE", "pot": 3, "coefficient": 61.0, "path": "champions", "qualified": True},
  {"id": 15, "name": "Villarreal", "country": "ES", "pot": 3, "coefficient": 59.0, "path": "champions", "qualified": True},
  {"id": 18, "name": "Shakhtar Donetsk", "country": "UA", "pot": 3, "coefficient": 56.25, "path": "champions", "qualified": True},
  {"id": 28, "name": "Galatasaray", "country": "TR", "pot": 3, "coefficient": 53.5, "path": "league", "qualified": True},

  # --- TORBA 4 (POT 4) ---
  {"id": 26, "name": "Kızılyıldız", "country": "RS", "pot": 4, "coefficient": 46.5, "path": "league", "qualified": False},
  {"id": 23, "name": "Dinamo Zagreb", "country": "HR", "pot": 4, "coefficient": 46.5, "path": "league", "qualified": False},
  {"id": 20, "name": "RB Salzburg", "country": "AT", "pot": 4, "coefficient": 45.0, "path": "league", "qualified": False},
  {"id": 25, "name": "Slavia Prague", "country": "CZ", "pot": 4, "coefficient": 44.0, "path": "league", "qualified": True},
  {"id": 34, "name": "Sparta Prag", "country": "CZ", "pot": 4, "coefficient": 38.25, "path": "league", "qualified": False},
  {"id": 33, "name": "Young Boys", "country": "CH", "pot": 4, "coefficient": 29.5, "path": "league", "qualified": False},
  {"id": 30, "name": "VfB Stuttgart", "country": "DE", "pot": 4, "coefficient": 27.5, "path": "league", "qualified": True},
  {"id": 32, "name": "RC Lens", "country": "FR", "pot": 4, "coefficient": 16.699, "path": "league", "qualified": True},
  {"id": 36, "name": "Como", "country": "IT", "pot": 4, "coefficient": 0.0, "path": "league", "qualified": True}
]
with open('c:/Users/yiit_/Desktop/kura/backend/data/teams-36.json', 'w', encoding='utf-8') as f:
    json.dump(teams, f, ensure_ascii=False, indent=2)

kesin_count = sum(1 for t in teams if t['qualified'])
tahmini_count = sum(1 for t in teams if not t['qualified'])
print(f"✓ Güncellendi: {kesin_count} kesin + {tahmini_count} tahmini takım")
