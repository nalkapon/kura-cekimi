import json

with open('draw-result-swiss.json', 'r') as f:
    data = json.load(f)

print(f"Total matches: {len(data['matches'])}")
print(f"\nFirst 5 matches:")
for i, m in enumerate(data['matches'][:5]):
    print(f"{i+1}. {m['team1']['name']} vs {m['team2']['name']} (Home: {m['homeTeamId']}, Away: {m['awayTeamId']})")

# Manchester City maçlarını bul
mc_matches = [m for m in data['matches'] if m['team1']['id'] == 1 or m['team2']['id'] == 1]
print(f"\nManchester City maçları: {len(mc_matches)}")
for i, m in enumerate(mc_matches[:4]):
    print(f"{i+1}. {m['team1']['name']} vs {m['team2']['name']}")
