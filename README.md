<div align="center">

# 📚 My Assignments

**A single GitHub repo — one live page per assignment, auto-synced.**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?style=flat-square&logo=github)](https://sayedrisat.github.io/my-assignments/)
[![Auto Sync](https://img.shields.io/badge/Auto%20Sync-Enabled-blue?style=flat-square&logo=github-actions)](https://github.com/sayedrisat/my-assignments/actions)
[![Assignments](https://img.shields.io/badge/Assignments-Growing-orange?style=flat-square)](#-live-assignments)

<br/>

> Add a folder → push → done. The home page updates itself and a new live URL appears.

</div>

---

## 🗂️ Repo Structure

Every assignment lives in its own subfolder with its own files, completely independent of the others.

```
my-assignments/
│
├── index.html                  ← Home page (auto-updated, don't edit manually)
├── style.css                   ← Home page styles
├── README.md                   ← This file
│
├── .github/
│   └── workflows/
│       └── sync-assignments.yml   ← GitHub Actions automation
│
├── assignment-1/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── assignment-2/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── assignment-3/               ← Push this → live URL appears in ~30 sec
    ├── index.html
    └── ...
```

> **Rule:** Every `assignment-*/` folder **must** have its own `index.html` — otherwise GitHub Pages shows a 404.

---

## ⚙️ How the Automation Works

Push any change → GitHub Actions wakes up, scans all folders, rewrites `index.html`, and commits back — automatically.

```mermaid
flowchart TD
    A([👨‍💻 You add assignment-N/ in VS Code]) --> B[git push to main]
    B --> C{GitHub detects push}
    C --> D[🤖 Actions runner starts\nubuntu-latest]
    D --> E[Python script scans repo\nfinds all assignment-*/ folders]
    E --> F[Generates card HTML\nfor each folder found]
    F --> G{Did index.html change?}
    G -- Yes --> H[Bot commits & pushes\nupdated index.html]
    G -- No --> I([✅ Nothing to do. Skip.])
    H --> J([🌐 GitHub Pages redeploys\nNew card visible live])

    style A fill:#1e1e2e,color:#cdd6f4,stroke:#89b4fa
    style J fill:#1e1e2e,color:#cdd6f4,stroke:#a6e3a1
    style I fill:#1e1e2e,color:#cdd6f4,stroke:#6c7086
    style D fill:#1e1e2e,color:#cdd6f4,stroke:#cba6f7
    style E fill:#1e1e2e,color:#cdd6f4,stroke:#94e2d5
    style F fill:#1e1e2e,color:#cdd6f4,stroke:#94e2d5
    style H fill:#1e1e2e,color:#cdd6f4,stroke:#f9e2af
```

---

## 🌐 How Each Assignment Gets Its Own Live URL

GitHub Pages mirrors the repo folder structure directly into live URLs — no config needed.

```mermaid
graph LR
    subgraph REPO["📁 GitHub Repo"]
        ROOT["index.html\n(home)"]
        A1["assignment-1/\nindex.html"]
        A2["assignment-2/\nindex.html"]
        A3["assignment-3/\nindex.html"]
    end

    subgraph PAGES["🌐 GitHub Pages — Live URLs"]
        U0["sayedrisat.github.io\n/my-assignments/"]
        U1["sayedrisat.github.io\n/my-assignments/assignment-1/"]
        U2["sayedrisat.github.io\n/my-assignments/assignment-2/"]
        U3["sayedrisat.github.io\n/my-assignments/assignment-3/"]
    end

    ROOT -->|"serves as"| U0
    A1   -->|"serves as"| U1
    A2   -->|"serves as"| U2
    A3   -->|"serves as"| U3

    style REPO fill:#1e1e2e,stroke:#89b4fa,color:#cdd6f4
    style PAGES fill:#1e1e2e,stroke:#a6e3a1,color:#cdd6f4
```

---

## ➕ How to Add a New Assignment

Three steps. No HTML editing. No config changes.

```mermaid
sequenceDiagram
    actor You
    participant VS Code
    participant GitHub
    participant Actions
    participant Pages

    You->>VS Code: Create assignment-4/ folder
    You->>VS Code: Add index.html inside it
    You->>GitHub: git add . → git commit → git push
    GitHub->>Actions: Trigger sync-assignments.yml
    Actions->>Actions: Scan folders, build card HTML
    Actions->>GitHub: Commit updated index.html
    GitHub->>Pages: Auto-redeploy
    Pages-->>You: 🎉 New card live at /assignment-4/
```

In short:

```bash
# 1. Create the folder and add your work
mkdir assignment-4
# ... add your index.html, style.css, etc.

# 2. Push it
git add .
git commit -m "add assignment 4"
git push

# 3. Wait ~30 seconds — done ✅
```

---

## 🔗 Live Assignments

| # | Assignment | Live URL |
|---|-----------|----------|
| 01 | Assignment 1 | [View Live →](https://sayedrisat.github.io/my-assignments/assignment-1/) |
| 02 | Assignment 2 | [View Live →](https://sayedrisat.github.io/my-assignments/assignment-2/) |
| 03 | Assignment 3 | [View Live →](https://sayedrisat.github.io/my-assignments/assignment-3/) |

> This table is updated manually. The home page cards update automatically.

---

## 🛠️ Setup (One-time)

If you fork this repo or set it up fresh:

**1. Enable GitHub Pages**
> Repo → Settings → Pages → Source: `Deploy from a branch` → Branch: `main` → Folder: `/ (root)`

**2. Allow Actions to push**
> Repo → Settings → Actions → General → Workflow permissions → **Read and write permissions** ✅

That's it. Everything else is automatic.

---

## 🎓 For Students — Use This as Your Own Assignment Hub

Want the same setup for your own coursework? You can copy this entire system in under 5 minutes.

### Step 1 — Fork this repo

Click the **Fork** button at the top-right of this page. This copies everything — the automation, the home page, the styles — into your own GitHub account.

```
github.com/sayedrisat/my-assignments  →  (Fork)  →  github.com/YOUR-USERNAME/my-assignments
```

### Step 2 — Enable GitHub Pages on your fork

> Your forked repo → **Settings** → **Pages**
> → Source: `Deploy from a branch`
> → Branch: `main` → Folder: `/ (root)`
> → Click **Save**

### Step 3 — Allow the bot to write to your repo

> Your forked repo → **Settings** → **Actions** → **General**
> → Workflow permissions → select **Read and write permissions** → **Save**

### Step 4 — Delete the existing assignment folders

The forked repo has `assignment-1/`, `assignment-2/` etc. from this repo. Delete them and start fresh with your own work.

```bash
git clone https://github.com/YOUR-USERNAME/my-assignments.git
cd my-assignments

# Remove sample assignments
rm -rf assignment-1 assignment-2 assignment-3

git add .
git commit -m "start fresh"
git push
```

### Step 5 — Submit your first assignment

```bash
# Create your assignment folder
mkdir assignment-1
cd assignment-1

# Add your HTML, CSS, JS files
# (Must have at least an index.html)

cd ..
git add .
git commit -m "add assignment 1"
git push
```

The home page card appears automatically. Your live URL will be:

```
https://YOUR-USERNAME.github.io/my-assignments/assignment-1/
```

---

### 🗺️ Student Workflow at a Glance

```mermaid
flowchart LR
    A([🍴 Fork the repo]) --> B[Enable GitHub Pages\nin your fork settings]
    B --> C[Allow Actions\nwrite permission]
    C --> D[Delete sample\nassignment folders]
    D --> E[Create assignment-1/\nwith your index.html]
    E --> F[git push]
    F --> G([✅ Live at\nyour-username.github.io\n/my-assignments/assignment-1/])

    style A fill:#1e1e2e,color:#cdd6f4,stroke:#89b4fa
    style G fill:#1e1e2e,color:#cdd6f4,stroke:#a6e3a1
    style F fill:#1e1e2e,color:#cdd6f4,stroke:#f9e2af
```

---

### ❓ Common Questions

**Q: Do I need to know GitHub Actions to use this?**
No. The automation is already set up. You just add folders and push.

**Q: Can I rename the assignment folders?**
The folders must start with `assignment-` (e.g. `assignment-1`, `assignment-2`). The number at the end determines the order on the home page.

**Q: What files do I need inside each assignment folder?**
At minimum, one `index.html`. You can also add `style.css`, `script.js`, images, or any other files your assignment needs.

**Q: My live page shows a 404. What's wrong?**
Make sure your assignment folder has an `index.html` directly inside it — not in a subfolder. GitHub Pages specifically looks for `index.html` to serve the page.

**Q: How long until my page goes live after pushing?**
Usually 20–40 seconds. You can watch the progress under the **Actions** tab of your repo.

**Q: Can I share my assignment link with my teacher?**
Yes — just share `https://YOUR-USERNAME.github.io/my-assignments/assignment-N/` directly. No login required to view it.

---

<div align="center">

Made with 🖤 by [Sayed Risat](https://github.com/sayedrisat)

</div>
