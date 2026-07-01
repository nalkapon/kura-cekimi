import json

with open('draw-result-swiss.json', 'r') as f:
    data = json.load(f)

# Bayern Munich (team 2) maçlarından birini kontrol et
bm_matches = [m for m in data['matches'] if m['team1']['id'] == 2 or m['team2']['id'] == 2]
if bm_matches:
    m = bm_matches[0]
    print(f"Bayern Munich match:")
    print(f"Team 1 keys: {m['team1'].keys()}")
    print(f"Team 2 keys: {m['team2'].keys()}")
    print(f"\nTeam 1: {m['team1']}")
    print(f"Team 2: {m['team2']}")
