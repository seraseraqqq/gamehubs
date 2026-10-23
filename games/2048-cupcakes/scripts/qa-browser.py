"""Exercise the actual local UI through agent-browser, in an isolated QA session."""
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output'
OUT.mkdir(exist_ok=True)
CLI = ['agent-browser', '--session', 'cupcakes-qa', '--json']
results = []

def run(*args, source=None):
    proc = subprocess.run(CLI + list(args), input=source, text=True, capture_output=True, timeout=30)
    if proc.returncode:
        raise RuntimeError(proc.stdout + proc.stderr)
    result = json.loads(proc.stdout)
    if not result.get('success'):
        raise RuntimeError(str(result))
    return result.get('data')

def js(source):
    return run('eval', '--stdin', source=source)['result']

def ready():
    run('wait', '--fn', 'document.querySelectorAll(".tile").length > 0 && document.getElementById("board").getAttribute("aria-busy") !== "true"')

def check(name, condition, evidence):
    results.append({'check': name, 'passed': bool(condition), 'evidence': evidence})
    (OUT / 'browser-checks.json').write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n')
    assert condition, (name, evidence)
    print('PASS', name, flush=True)

def fixture(rows, score=0, moves=0):
    grid = [[None for _ in range(4)] for _ in range(4)]
    next_id = 1
    for y, row in enumerate(rows):
        for x, value in enumerate(row):
            if value:
                grid[y][x] = {'id': next_id, 'value': value}
                next_id += 1
    return {'grid': grid, 'score': score, 'moves': moves, 'nextId': next_id, 'won': False, 'keepPlaying': False}

def load(state):
    saved = {'version': 1, 'state': state, 'history': [], 'best': state['score'],
             'highestSeen': 2, 'preferences': {'numbers': True, 'sound': False}}
    js('localStorage.setItem("crumb.cupcakes.v1", ' + json.dumps(json.dumps(saved)) + ')')
    run('reload'); ready()

def current():
    return js('JSON.parse(localStorage.getItem("crumb.cupcakes.v1"))')

run('open', 'http://127.0.0.1:4180/'); ready()
run('set', 'viewport', '1280', '900')
js('localStorage.removeItem("crumb.cupcakes.v1")'); run('reload'); ready()
data = js('({tiles:document.querySelectorAll(".tile").length,h1:document.querySelectorAll("h1").length,remote:performance.getEntriesByType("resource").filter(x=>!x.name.startsWith(location.origin)).map(x=>x.name)})')
check('Fresh board, one H1, local resources', data['tiles'] == 2 and data['h1'] == 1 and not data['remote'], data)

load(fixture([[2, 4, 8, 16]])); before = current()
run('focus', '#board'); run('press', 'ArrowLeft'); ready(); after = current()
check('Invalid move does not spawn or create undo history', before == after, {'before':before['state'], 'after':after['state'], 'history':len(after['history'])})

original = fixture([[2, 2]])
load(original); run('focus', '#board'); run('press', 'ArrowLeft'); ready(); saved = current()
check('Keyboard merge scores 4 and adds one new tile', saved['state']['score'] == 4 and len([t for row in saved['state']['grid'] for t in row if t]) == 2 and len(saved['history']) == 1, saved['state'])
run('click', '#undo'); ready(); saved = current()
check('Undo restores board, score, move count and spawn sequence', saved['state'] == original and saved['best'] == 4, saved)

run('focus', '#board'); run('press', 'ArrowLeft'); ready(); saved = current(); run('reload'); ready()
check('Refresh restores the exact game state and undo history', current() == saved, current())
run('click', '#numbers-toggle'); run('reload'); ready()
data = js('({hidden:document.getElementById("board").classList.contains("hide-numbers"),pressed:document.getElementById("numbers-toggle").getAttribute("aria-pressed")})')
check('Number preference survives refresh', data['hidden'] and data['pressed'] == 'false', data)
run('click', '#settings-open'); run('check', '#numbers-setting'); run('press', 'Escape')
check('Settings checkbox updates numbers and Escape closes dialog', js('!document.querySelector("dialog[open]") && !document.getElementById("board").classList.contains("hide-numbers")'), 'Native dialog and preference synchronized')

saved = current(); run('click', '#new-game'); run('click', '#restart-cancel')
check('New batch cancellation preserves the game', current() == saved, current()['state'])
run('click', '#new-game'); run('click', '#restart-confirm'); ready(); saved = current()
check('Confirmed restart resets board but preserves best score', saved['state']['score'] == 0 and saved['state']['moves'] == 0 and len(saved['history']) == 0 and saved['best'] >= 4, saved['state'])

load(fixture([[1024, 1024]], score=100, moves=12)); run('focus', '#board'); run('press', 'ArrowLeft'); ready()
data = js('({title:document.getElementById("end-title").textContent,open:!document.getElementById("game-overlay").hidden,score:document.getElementById("score").textContent,values:[...document.querySelectorAll(".tile")].map(t=>+t.dataset.value)})')
check('2048 victory renders the rainbow and continuation controls', data['open'] and 2048 in data['values'] and current()['state']['score'] == 2148, data)
run('click', '#end-primary'); ready()
check('Keep baking continues the existing winning board', current()['state']['keepPlaying'] and js('document.getElementById("game-overlay").hidden'), current()['state'])

load(fixture([[2,4,2,4],[4,2,4,2],[2,4,2,4],[4,2,4,2]], score=120, moves=20))
check('Terminal board shows game over', js('!document.getElementById("game-overlay").hidden && document.getElementById("end-title").textContent === "Fresh out of room."'), js('document.getElementById("end-description").textContent'))
run('click', '#end-primary'); ready()
check('Game-over restart creates a playable new batch', current()['state']['moves'] == 0 and js('document.getElementById("game-overlay").hidden'), current()['state'])

js('localStorage.setItem("crumb.cupcakes.v1", "{broken json")'); run('reload'); ready()
check('Corrupt local save recovers without blocking play', js('document.querySelectorAll(".tile").length === 2 && document.getElementById("game-status").textContent.includes("couldn")'), js('document.getElementById("game-status").textContent'))

run('set', 'viewport', '390', '844'); load(fixture([[2,2]]))
js('scrollTo({top:0,behavior:"instant"})')
rect = js('document.getElementById("board").getBoundingClientRect().toJSON()')
x1 = round(rect['left'] + rect['width'] * .76); x2 = round(rect['left'] + rect['width'] * .24); y = round(rect['top'] + rect['height'] * .5)
run('mouse', 'move', str(x1), str(y)); run('mouse', 'down', 'left'); run('mouse', 'move', str(x2), str(y)); run('mouse', 'up', 'left'); ready()
check('Narrow-screen pointer swipe triggers a merge', current()['state']['score'] == 4, {'viewport':'390×844','state':current()['state']})

for width in [320, 390, 768, 1024, 1440]:
    run('set', 'viewport', str(width), '900')
    js('scrollTo({top:0,behavior:"instant"})')
    data = js('({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,board:document.getElementById("board").getBoundingClientRect().toJSON()})')
    check('Layout width ' + str(width), not data['overflow'] and data['board']['width'] > 0, data)

run('set', 'media', 'light', 'reduced-motion')
load(fixture([[2,2]])); run('focus', '#board'); run('press', 'ArrowLeft'); ready()
data = js('({score:document.getElementById("score").textContent,animation:getComputedStyle(document.querySelector(".tile-face")).animationName,transition:getComputedStyle(document.querySelector(".tile")).transitionDuration})')
check('Reduced motion preserves gameplay without animation', current()['state']['score'] == 4 and data['animation'] == 'none' and data['transition'] == '0s', data)
run('set', 'media', 'light')
data = run('errors')
check('No page JavaScript errors in UI flows', not data.get('errors'), data)

# Leave the isolated QA browser in a fresh state, without artificial scores.
js('localStorage.removeItem("crumb.cupcakes.v1")'); run('reload'); ready()
print('Completed',len(results),'browser checks.', flush=True)
