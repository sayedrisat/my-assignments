import os, re

# ── helpers ──────────────────────────────────────────

def sort_key(name):
    return [int(n) for n in re.findall(r'\d+', name)]

def make_card(href, num_label, title, badge=''):
    return (
        '      <a href="./' + href + '/" class="card">\n'
        '        <span class="num">' + num_label + '</span>\n'
        '        <span class="title">' + title + '</span>\n'
        + ('        <span class="parts-badge">' + badge + '</span>\n' if badge else '')
        + '        <span class="arrow">&#8599;</span>\n'
        '      </a>'
    )

# ── templates ─────────────────────────────────────────

ROOT_HTML = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Assignments</title>
  <link rel="stylesheet" href="style.css"/>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap" rel="stylesheet"/>
</head>
<body>
  <div class="bg-grid"></div>
  <header>
    <div class="header-inner">
      <div class="badge">Portfolio</div>
      <h1>Assignments</h1>
      <p class="subtitle">A collection of coursework &amp; submitted work</p>
    </div>
  </header>
  <main>
    <div class="grid" id="assignments">
{cards}
    </div>
    <div class="empty-state" id="empty-state">
      <span class="empty-icon">&#128193;</span>
      <p>No assignments yet. Add a folder like <code>assignment-1/</code> and push.</p>
    </div>
  </main>
  <footer>
    <span>Auto-synced with GitHub</span>
    <span class="dot">&middot;</span>
    <span id="count">0 assignments</span>
  </footer>
  <script>
    var cards = document.querySelectorAll('.card');
    document.getElementById('count').textContent = cards.length + ' assignment' + (cards.length !== 1 ? 's' : '');
    if (cards.length === 0) {{
      document.getElementById('assignments').style.display = 'none';
      document.getElementById('empty-state').style.display = 'flex';
    }} else {{
      document.getElementById('empty-state').style.display = 'none';
    }}
    cards.forEach(function(c, i) {{ c.style.animationDelay = (i * 80) + 'ms'; }});
  </script>
</body>
</html>'''

SUB_HTML = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Assignment {num}</title>
  <link rel="stylesheet" href="../style.css"/>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap" rel="stylesheet"/>
</head>
<body>
  <div class="bg-grid"></div>
  <header>
    <div class="header-inner">
      <a href="../" class="back-link">&#8592; All Assignments</a>
      <div class="badge">Assignment {num}</div>
      <h1>Assignment {num}</h1>
      <p class="subtitle">Select a part to open</p>
    </div>
  </header>
  <main>
    <div class="grid" id="assignments">
{cards}
    </div>
  </main>
  <footer>
    <span>Auto-synced with GitHub</span>
    <span class="dot">&middot;</span>
    <span id="count">0 parts</span>
  </footer>
  <script>
    var c = document.querySelectorAll('.card');
    document.getElementById('count').textContent = c.length + ' part' + (c.length !== 1 ? 's' : '');
    c.forEach(function(el, i) {{ el.style.animationDelay = (i * 80) + 'ms'; }});
  </script>
</body>
</html>'''

# ── step 1: root index.html ────────────────────────────

root_folders = sorted(
    [d for d in os.listdir('.') if os.path.isdir(d) and re.match(r'^assignment-\d+$', d)],
    key=sort_key
)
print('Folders found: ' + str(root_folders))

root_cards = []
for folder in root_folders:
    num = re.search(r'\d+', folder).group()
    subs = [s for s in os.listdir(folder) if os.path.isdir(os.path.join(folder, s))]
    badge = '&#8595; ' + str(len(subs)) + ' parts' if subs else ''
    root_cards.append(make_card(folder, '#' + num.zfill(2), 'Assignment ' + num, badge))

with open('index.html', 'w') as f:
    f.write(ROOT_HTML.format(cards='\n'.join(root_cards)))
print('Written: index.html (' + str(len(root_folders)) + ' cards)')

# ── step 2: sub-folder pages ───────────────────────────

for folder in root_folders:
    subs = sorted(
        [s for s in os.listdir(folder) if os.path.isdir(os.path.join(folder, s))],
        key=sort_key
    )
    if not subs:
        continue
    num = re.search(r'\d+', folder).group()
    sub_cards = [make_card(s, 'Part ' + str(i), s.replace('-', ' ').title()) for i, s in enumerate(subs, 1)]
    sub_index = os.path.join(folder, 'index.html')
    with open(sub_index, 'w') as f:
        f.write(SUB_HTML.format(num=num.zfill(2), cards='\n'.join(sub_cards)))
    print('Written: ' + sub_index + ' (' + str(len(subs)) + ' parts)')
