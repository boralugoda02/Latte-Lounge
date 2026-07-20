# Latte Lounge by 7's — Site Mockup

![Status](https://img.shields.io/badge/status-active-3A503C)
![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-000000)
![No framework](https://img.shields.io/badge/framework-none-E05D8E)
![License](https://img.shields.io/badge/license-MIT-000000)

> **Repository description (GitHub "About" field):**
> Cozy hill-country coffee shop site for Latte Lounge by 7's, Bandarawela — a dependency-free, multi-page static site (HTML/CSS/JS) deployed on GitHub Pages.

A cozy rest stop for road travelers on the Beragala–Hali Ela highway. This
repository holds the marketing site for **Latte Lounge by 7's**: a hill-country
coffee shop in Bandarawela, Sri Lanka, built as a hand-rolled, dependency-free
multi-page static site.

## Table of Contents

- [Pitch](#pitch)
- [Live Site](#live-site)
- [Project Structure](#project-structure)
- [Local Installation](#local-installation)
- [Local Development](#local-development)
- [Content Management (Git-based CMS)](#content-management-git-based-cms)
- [Pushing to GitHub](#pushing-to-github)
- [Deploying to GitHub Pages](#deploying-to-github-pages)
- [Git Commit Message Convention](#git-commit-message-convention)
- [Design System Notes](#design-system-notes)
- [Placeholder Content](#placeholder-content)
- [License](#license)

## Pitch

Every hairpin bend on the road up to Bandarawela earns a traveler a break.
This site introduces that break before anyone arrives: what's brewing this
week, the values behind the menu, and exactly where to pull over. No
frameworks, no build step — just semantic HTML, hand-written CSS with design
tokens, and small vanilla JS modules that keep the interface honest.

## Live Site

[https://\<your-github-username\>.github.io/\<your-repo-name\>/](https://your-github-username.github.io/your-repo-name/)

_(Replace with the real GitHub Pages URL once the repository is deployed.)_

## Project Structure

```
.
├── index.html            # Home — hero, current happenings, signature items
├── about.html             # Our Story — brand story and values
├── contact.html            # Visit & Contact — hours, map, contact form
├── admin/
│   ├── index.html          # CMS admin dashboard (Sveltia CMS)
│   └── config.yml           # CMS collections — maps to the /data files
├── data/
│   ├── offers.json          # Homepage "Current Happenings" cards
│   ├── items.json           # Homepage signature menu items
│   └── settings.json        # Hours, phone, address, map, social links
├── assets/
│   ├── css/
│   │   └── style.css       # Design tokens + all component styles
│   ├── js/
│   │   ├── main.js          # Nav toggle, active-link state, form handling
│   │   └── content.js        # Fetches /data JSON and renders it into the page
│   └── images/
│       ├── logo.png          # Full logo (footer)
│       ├── logo-mark.png      # Cropped emblem (nav, favicon source)
│       ├── favicon.png
│       ├── hero-cozy.jpg
│       ├── story-writing.jpg
│       ├── item-latte.jpg
│       ├── item-lovecake.jpg
│       └── item-cutlets.jpg
├── .nojekyll               # Tells GitHub Pages to serve files as-is
├── LICENSE
└── README.md
```

> **Logo:** the real brand mark is in `assets/images/logo.png` (full
> lockup, used in the footer) and `assets/images/logo-mark.png` (cropped
> emblem, used in the nav and as the favicon source). Replace either file
> to update the logo everywhere it appears — no markup changes needed.

## Content Management (Git-based CMS)

This site ships with a Git-based CMS admin dashboard at **`/admin`**, built
on [Sveltia CMS](https://github.com/sveltia/sveltia-cms) (a modern,
actively-maintained fork of Decap/Netlify CMS). There is **no database and
no build step** — the admin panel edits JSON files under `/data` and
commits them straight to this GitHub repository. `assets/js/content.js`
fetches those JSON files at runtime and renders them into the page, so a
saved edit is live the moment the commit lands (a minute or two, once
GitHub Pages redeploys).

**What's editable through the dashboard:**

| Collection | File | Controls |
|---|---|---|
| Homepage Offers | `data/offers.json` | The 3 "Current Happenings" cards |
| Signature Items | `data/items.json` | The 3 featured menu items + photos |
| Site Settings | `data/settings.json` | Hours, phone, address, map, social links |

Content that isn't in `/data` (page copy, the About page story, values,
overall layout) still lives directly in the HTML — that's intentional, to
keep the CMS focused on things that change often.

### One-time setup (do this after pushing to GitHub)

You have two ways to log into the CMS. **Start with Option A** — it takes two
minutes and needs no extra accounts. Option B is only worth the extra setup
if more than one person will use the dashboard.

#### Option A — Sign in with a Personal Access Token (recommended solo setup)

This works immediately, with nothing to deploy:

1. Push this project to GitHub (see [Pushing to GitHub](#pushing-to-github) below).
2. Go to **GitHub → Settings → Developer settings → Personal access tokens
   → Fine-grained tokens → Generate new token**
   (direct link: [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new))
3. Fill it in:
   - **Token name:** `Latte Lounge CMS`
   - **Expiration:** whatever you're comfortable with (90 days, 1 year, etc. — you can always generate a new one later)
   - **Repository access:** *Only select repositories* → choose `latte-lounge`
   - **Permissions → Repository permissions → Contents:** set to **Read and write**
4. Click **Generate token** and copy it immediately (GitHub only shows it once).
5. Visit `https://boralugoda02.github.io/latte-lounge/admin/`
6. Click **Sign In with Token**, paste the token, and you're in.

Keep the token private — anyone with it can edit and commit to the repo.
If it ever leaks, revoke it from the same GitHub settings page and generate
a new one.

#### Option B — GitHub OAuth login (better if multiple people will edit)

This needs a small OAuth step that can't be done from inside the code — a
few clicks on GitHub and a free OAuth helper:

**1. Create a GitHub OAuth App**

- Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
  (direct link: [github.com/settings/applications/new](https://github.com/settings/applications/new))
- **Application name:** `Latte Lounge CMS`
- **Homepage URL:** `https://boralugoda02.github.io/latte-lounge/`
- **Authorization callback URL:** `https://boralugoda02.github.io/latte-lounge/admin/`
- Click **Register application**, then generate a **Client Secret** and
  copy both the **Client ID** and **Client Secret** somewhere safe.

**2. Deploy the free auth helper (Sveltia's OAuth proxy)**

Sveltia CMS needs a tiny serverless function to complete the GitHub login
handshake (GitHub Pages alone can't do this — it's a static host). The
easiest option is Cloudflare Workers (free tier is enough):

- Follow Sveltia's guide: [github.com/sveltia/sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)
  — it's a one-click "Deploy to Cloudflare Workers" button.
- When deploying, paste in the **Client ID** and **Client Secret** from
  step 1 as environment variables.
- You'll get a Worker URL like `https://sveltia-cms-auth.<you>.workers.dev`.

**3. Add that Worker URL to `admin/config.yml`**

Open `admin/config.yml` and add a `base_url` line under `backend:`:

```yaml
backend:
  name: github
  repo: boralugoda02/latte-lounge
  branch: main
  base_url: https://sveltia-cms-auth.<you>.workers.dev
```

**4. Log in and start editing**

- Visit `https://boralugoda02.github.io/latte-lounge/admin/`
- Click **Login with GitHub**, authorize the OAuth app
- Edit an offer, an item, or a setting, and click **Publish** — this
  creates a real commit on `main` and the live site updates shortly after

**Who can edit:** anyone who is a **collaborator on the GitHub repo** (add
them under **Settings → Collaborators**). The CMS doesn't have its own
user system — GitHub access *is* the access control.

## Local Installation

This is a static site with zero build dependencies. All you need is the
repository and a way to serve plain files.

```bash
# 1. Clone the repository
git clone https://github.com/<your-github-username>/<your-repo-name>.git

# 2. Move into the project
cd <your-repo-name>
```

## Local Development

Because the pages use relative asset paths, open them through a local
server rather than double-clicking the file (this avoids CORS issues with
`fetch`-based features and keeps behavior consistent with production).

Pick whichever tool is already on your machine:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (no install required)
npx serve .

# VS Code
# Use the "Live Server" extension and click "Go Live"
```

Then visit `http://localhost:8000` (or whichever port your tool prints).

There is no build/compile step — edit `assets/css/style.css`,
`assets/js/main.js`, or any `.html` file and refresh the browser to see
changes.

## Pushing to GitHub

This folder isn't a git repository yet, so start from scratch:

**1. Create the repository on GitHub**

Go to [github.com/new](https://github.com/new) and create a new repository.

- **Repository name:** `latte-lounge` (or whatever you'd like the URL to be)
- **Description:** paste the one-liner from the top of this README
- **Visibility:** Public (required for free GitHub Pages)
- Leave "Add a README", ".gitignore" and "license" **unchecked** — this project already has its own

Click **Create repository**, then copy the repository URL it shows you
(e.g. `https://github.com/<your-github-username>/latte-lounge.git`).

**2. Push this project from your machine**

Open a terminal inside this project folder and run:

```bash
git init
git add .
git commit -m "feat: initial commit of Latte Lounge site"
git branch -M main
git remote add origin https://github.com/<your-github-username>/latte-lounge.git
git push -u origin main
```

That's it — refresh the GitHub repository page and every file should be
there.

**Prefer the GitHub CLI?** Skip step 1 entirely:

```bash
git init
git add .
git commit -m "feat: initial commit of Latte Lounge site"
gh repo create latte-lounge --public --source=. --remote=origin --push
```

## Deploying to GitHub Pages

1. Push this repository to GitHub.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Choose the `main` branch and the `/ (root)` folder, then save.
5. GitHub will publish the site at
   `https://<your-github-username>.github.io/<your-repo-name>/` within a few
   minutes.

## Git Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>[optional scope]: <short summary>

[optional body]

[optional footer(s)]
```

**Types used in this project:**

| Type       | Use for                                                        |
|------------|-----------------------------------------------------------------|
| `feat`     | A new page, section, or user-facing capability                 |
| `fix`      | A bug fix (broken layout, invalid markup, JS error)             |
| `style`    | Formatting, whitespace, or visual tweaks with no logic change   |
| `refactor` | Restructuring code without changing behavior                   |
| `docs`     | README or in-code documentation changes                         |
| `chore`    | Tooling, config, or maintenance work                             |
| `perf`     | Performance improvements (image optimization, etc.)             |
| `a11y`     | Accessibility-specific fixes (ARIA, focus order, contrast)      |

**Examples:**

```
feat(contact): add validated contact form with success toast
fix(nav): correct aria-expanded state on mobile toggle
style(cards): tighten offer card spacing on small screens
docs(readme): add GitHub Pages deployment steps
a11y(footer): add descriptive aria-labels to social icons
```

Keep the summary line under 72 characters, written in the imperative mood
("add", not "added" or "adds"). Use the body to explain *why* a change was
made when it isn't obvious from the summary alone.

## Design System Notes

- **Colors** are declared once as CSS custom properties in `:root` inside
  `assets/css/style.css` — update the palette there and it propagates
  everywhere.
- **Typography** pairs `Playfair Display` (headings) with `Inter` (body/UI),
  loaded via Google Fonts and scaled fluidly with `clamp()`.
- **No frameworks**: no Tailwind, no Bootstrap, no bundler. This keeps the
  site auditable, fast, and trivial to host on GitHub Pages.

## Placeholder Content

Real photography and the real logo are already in place. What's still worth
a look before launch:

- `data/settings.json` phone number, address, and map embed URL are sample
  values — edit them via **`/admin`** (see [Content Management](#content-management-git-based-cms))
  or directly in the file.
- `admin/config.yml` has `repo: boralugoda02/latte-lounge` hardcoded — update
  this if the repository is ever renamed or transferred.

Photography, offers, and menu items in `data/` and `assets/images/` can be
updated any time — either by editing the files directly, or through the
CMS dashboard once it's set up.

## License

Released under the [MIT License](LICENSE) — free to use, modify and deploy
for this business or as a starting point for another one.
