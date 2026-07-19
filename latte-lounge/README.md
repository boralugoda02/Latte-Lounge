# Latte Lounge by 7's — Website

A cozy rest-stop for road travelers on the Beragala–Hali Ela highway. This repository contains the marketing website for **Latte Lounge by 7's**, a coffee, cake and snack counter in Bandarawela, in Sri Lanka's hill country.

The site is a hand-built, dependency-free static site — vanilla HTML, CSS and JavaScript, with no build step and no frameworks — designed to be deployed straight to GitHub Pages.

## Live Site

> 🔗 **Live deployment:** `https://<your-github-username>.github.io/latte-lounge/`
> _(Update this link once GitHub Pages is enabled for this repository.)_

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero, current offers, and three signature menu items |
| About | `about.html` | Brand story and core values |
| Contact | `contact.html` | Hours, phone, address, map, and a contact form |

## Tech Stack

- **HTML5** — semantic markup (`<header>`, `<nav>`, `<main>`, `<article>`, `<address>`, `<footer>`)
- **CSS3** — custom properties (`:root` design tokens), CSS Grid + Flexbox, `clamp()` for fluid type, no utility frameworks
- **Vanilla JavaScript (ES6)** — mobile nav toggle, active-link state, dynamic footer year, and a simulated contact-form submission with a toast notification

## Project Structure

```
latte-lounge/
├── index.html
├── about.html
├── contact.html
├── README.md
├── logo.jpg
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── images/
        ├── emblem-crop.png
        ├── coffee-featured.png
        ├── cake-featured.png
        ├── snack-featured.png
        ├── texture-beans.png
        └── about-lifestyle.png
```

## Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/boralugoda02/latte-lounge.git
   cd latte-lounge
   ```
2. No dependencies to install — this is a static site.

## Local Development

Because the site uses relative paths only, any static file server works. From the project root:

```bash
# Option A — Python (no install required on most systems)
python3 -m http.server 8000

# Option B — Node (if you have it installed)
npx serve .

# Option C — VS Code
# Right-click index.html → "Open with Live Server"
```

Then open `http://localhost:8000` in your browser.

## Deploying to GitHub Pages

1. Push this repository to GitHub (root directory deployment — no `/docs` folder needed).
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Choose the `main` branch and the `/ (root)` folder, then **Save**.
5. GitHub will publish the site at `https://<your-github-username>.github.io/latte-lounge/` within a few minutes.

## Git Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/). Structure every commit message as:

```
<type>(<optional scope>): <short summary>

<optional body>
<optional footer>
```

**Types used in this project:**

| Type | When to use it |
|---|---|
| `feat` | A new page, section, or feature |
| `fix` | A bug fix (broken link, layout issue, JS error) |
| `style` | Formatting, whitespace, or visual tweaks with no logic change |
| `refactor` | Restructuring code without changing behavior |
| `docs` | Changes to README or other documentation |
| `chore` | Maintenance tasks (asset optimization, `.gitignore`, etc.) |
| `perf` | Performance improvements |

**Examples:**

```
feat(contact): add contact form with native HTML5 validation
fix(nav): correct active-link state on about page
style(hero): adjust hero heading scale on tablet breakpoint
docs(readme): add GitHub Pages deployment steps
```

## Accessibility & Code Quality

- Semantic HTML5 landmarks throughout
- `aria-label` on interactive controls (nav toggle, social icons)
- Descriptive `alt` text on all images
- Native HTML5 form validation (`required`, `type="email"`)
- Visible keyboard focus states (`:focus-visible`)
- Mobile-first, fluid layouts — no fixed pixel positioning

## Notes on Placeholder Content

Several values in this mockup are intentionally placeholders and should be replaced before launch:

- `DUMMY_PHONE` → real contact number (currently `+94 77 000 0000`)
- `DUMMY_STREET` → exact street address for the map and `<address>` blocks
- `DUMMY_PRICE` → confirmed menu pricing (currently `LKR 1,250` across all three featured items)
- Google Maps iframe → replace the placeholder query with the exact pinned location
- Social links (`#`) → real Facebook and TikTok profile URLs

## License

All brand assets (logo, name, and imagery) belong to Latte Lounge by 7's. Code structure may be reused as a starting point for similar static-site projects.
