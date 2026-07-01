import json

with open('draw-result-swiss.json', 'r') as f:
    data = json.load(f)

# Manchester City'nin ilk maçını kontrol et
mc_first_match = data['matches'][0]
print("First match details:")
print(f"Team 1: {mc_first_match['team1']}")
print(f"Team 2: {mc_first_match['team2']}")
print(f"\nTeam 2 (opponent) pot: {mc_first_match['team2'].get('pot', 'POT MISSING')}")
