"""Recompute this read-only Vercel snapshot; no live requests or credentials."""
import json
from pathlib import Path
from collections import Counter

root = Path(__file__).resolve().parent
evidence = json.loads((root / 'evidence.json').read_text(encoding='utf-8'))
counts = {q['project']['id']: q['response']['data'] for q in evidence['core'] if q['kind'] == 'count'}
checks = []
for query in evidence['core'] + evidence['dimensions']:
    if query['kind'] == 'count':
        continue
    expected = counts[query['project']['id']]['pageviews']
    actual = sum(row['pageviews'] for row in query['response']['data'])
    assert actual == expected, (query['project']['name'], query['kind'], actual, expected)
    checks.append({'project': query['project']['name'], 'dimension': query['kind'], 'pageviews': actual})
total_pv = sum(row['pageviews'] for row in counts.values())
sources = Counter()
devices = Counter()
countries = Counter()
daily = Counter()
for query in evidence['dimensions']:
    target = {'referrerHostname': sources, 'deviceType': devices, 'country': countries}.get(query['kind'])
    if target is not None:
        for row in query['response']['data']:
            target[row[query['kind']]] += row['pageviews']
for query in evidence['core']:
    if query['kind'] == 'day':
        for row in query['response']['data']:
            if row['pageviews']:
                daily[row['timestamp']] += row['pageviews']
hourly_drifts = []
for query in evidence['detail']:
    if query['kind'] == 'hour':
        hourly_pv = sum(row['pageviews'] for row in query['response']['data'])
        if hourly_pv != counts[query['project']['id']]['pageviews']:
            hourly_drifts.append({'project': query['project']['name'], 'earlier_pv': counts[query['project']['id']]['pageviews'], 'later_hourly_pv': hourly_pv})
result = {'pageviews': total_pv, 'visitor_metric_sum_not_unique_people': sum(x['visitors'] for x in counts.values()), 'sources_pv': dict(sources), 'devices_pv': dict(devices), 'countries_pv': dict(countries), 'daily_pv_utc': dict(daily), 'google_related_pv': sources['google.com'] + sources['com.google.android.googlequicksearchbox'], 'unknown_source_share': sources[''] / total_pv, 'mobile_pv_share': devices['mobile'] / total_pv, 'reconciled_checks': len(checks), 'later_hourly_snapshot_differences': hourly_drifts}
(root / 'checked-summary.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps(result, ensure_ascii=False, indent=2))
