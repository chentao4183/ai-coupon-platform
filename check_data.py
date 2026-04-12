import json

with open('src/data/models.json') as f:
    data = json.load(f)

rows = []
for m in data.get('models', []):
    for v in m.get('versions', []):
        for p in v.get('pricingPlans', []):
            if p.get('planType') == 'api':
                inp_obj = p.get('inputPrice', {})
                out_obj = p.get('outputPrice', {})
                inp = inp_obj.get('value', 0)
                out = out_obj.get('value', 0)
                rows.append({
                    'model': m['modelName'],
                    'plan': p.get('planName', ''),
                    'input': inp,
                    'output': out,
                    'currency': inp_obj.get('currency', 'USD'),
                    'features': p.get('features', []),
                    'restrictions': p.get('restrictions', []),
                    'description': p.get('description', ''),
                })

print(f"Total API rows: {len(rows)}")
print()

# Show free rows
free = [r for r in rows if r['input'] == 0 and r['output'] == 0]
print(f"Free rows (both 0): {len(free)}")
for r in free:
    print(f"  {r['model']} - {r['plan']}")

# Show cheapest paid rows
paid = [r for r in rows if r['input'] > 0 or r['output'] > 0]
print(f"\nPaid rows: {len(paid)}")

# Show min prices
min_inp = min(r['input'] for r in paid if r['input'] > 0)
min_out = min(r['output'] for r in paid if r['output'] > 0)
print(f"Min input (paid): {min_inp}")
print(f"Min output (paid): {min_out}")

# Show rows with features
feat_rows = [r for r in rows if r['features']]
print(f"\nRows with features: {len(feat_rows)}")
for r in feat_rows[:5]:
    print(f"  {r['model']} - {r['plan']}: {r['features'][:3]}")

# Show rows with restrictions
rest_rows = [r for r in rows if r['restrictions']]
print(f"\nRows with restrictions: {len(rest_rows)}")
for r in rest_rows[:5]:
    print(f"  {r['model']} - {r['plan']}: {r['restrictions'][:3]}")

# Show rows with description
desc_rows = [r for r in rows if r['description']]
print(f"\nRows with description: {len(desc_rows)}")
for r in desc_rows[:5]:
    print(f"  {r['model']} - {r['plan']}: {r['description'][:60]}")
