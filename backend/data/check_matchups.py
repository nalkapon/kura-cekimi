import json

with open('draw-result-swiss.json', 'r') as f:
    data = json.load(f)

matchups = data.get('matchups', {})
print("Team Matchup Summary:")
print("-" * 30)

less_than_8 = []
for team_id in range(1, 37):
    str_id = str(team_id)
    opponents = matchups.get(str_id, [])
    count = len(opponents)
    team_name = next((t['name'] for t in data['teams'] if t['id'] == team_id), f"Team {team_id}")
    
    if count < 8:
        less_than_8.append((team_id, team_name, count))
        print(f"❌ Team {team_id:2d} ({team_name:20s}): {count} opponents")
    else:
        print(f"✓ Team {team_id:2d} ({team_name:20s}): {count} opponents")

print("-" * 30)
print(f"\nTeams with less than 8 opponents: {len(less_than_8)}")
if less_than_8:
    for team_id, name, count in less_than_8:
        print(f"  - Team {team_id} ({name}): {count} opponents")
