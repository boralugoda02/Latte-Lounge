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

* **Live Website:** (https://cool-dodol-d1bbc7.netlify.app)
* **Admin Dashboard (CMS):** (https://cool-dodol-d1bbc7.netlify.app/dashboard/))


## Project Structure

├── about.html
├── assets
│   ├── css
│   │   └── style.css
│   ├── data
│   │   ├── content.json
│   │   └── offers.json
│   ├── data_menu
│   │   └── menu.json
│   ├── images
│   │   ├── about-illustration.svg
│   │   ├── about-lifestyle.png
│   │   ├── about-placeholder.jpg
│   │   ├── cake-featured.png
│   │   ├── coffee-featured.png
│   │   ├── emblem-crop.png
│   │   ├── favicon.png
│   │   ├── hero-cozy.jpg
│   │   ├── hero-illustration.svg
│   │   ├── hero-placeholder.jpg
│   │   ├── item-cake.svg
│   │   ├── item-cutlets.jpg
│   │   ├── item-cutlets.svg
│   │   ├── item-latte.jpg
│   │   ├── item-latte.svg
│   │   ├── item-lovecake.jpg
│   │   ├── logo-dark.jpeg
│   │   ├── logo-light.jpeg
│   │   ├── logo-mark.png
│   │   ├── logo.png
│   │   ├── snack-featured.png
│   │   ├── story-writing.jpg
│   │   └── texture-beans.png
│   └── js
│       ├── content.js
│       ├── main.js
│       └── theme-engine.js
├── contact.html
├── dashboard
│   ├── admin-theme.css
│   ├── config.yml
│   └── index.html
├── index.html
├── LICENSE
└── README.md

> **Logo:** the real brand mark is in `assets/images/logo.png` (full
> lockup, used in the footer) and `assets/images/logo-mark.png` (cropped
> emblem, used in the nav and as the favicon source). Replace either file
> to update the logo everywhere it appears — no markup changes needed.

## Content Management (Git-based CMS)

This site is integrated with **Decap CMS** (a single-page static admin app) located at `/admin`. There is **no database and no build step** — the admin panel communicates directly with GitHub's REST API using **Netlify Identity** and **Git Gateway** to write changes directly back to your repository. 

Our dynamic client engine (`assets/js/content.js`) fetches these updated JSON files from the repository at runtime and injects them into semantic templates.

**Editable content paths managed by Decap CMS:**

| Collection | Target Path | Formats & Widgets |

| **Landing Page Content** | `assets/data/offers.json` | Section Title (string), Offers Cards (list of cards: heading, description, tag: COFFEE/CAKE/SNACK) |
| **Cafe Menu Items** | `assets/data/menu/*.json` | Individual JSON documents containing Item Name, Price (LKR, integer), Description, Item Category (COFFEE/CAKE/SNACK), and Featured on Home Page (boolean) |
| **Site Settings** | `assets/data/content.json` | Site settings (Hours, Phone display/digits, Address lines, Google Maps iframe embed URL, and Social links) |

---

### One-Time Git & Decap CMS Initialization Flow

To fully initialize the CMS for production, follow this step-by-step pipeline:

#### 1. Push code to GitHub
If you haven't already, push this project to your GitHub repository (see [Pushing to GitHub](#pushing-to-github)). Ensure your repository is **Public** for free GitHub Pages hosting.

#### 2. Create Netlify Project & Link Repository
Decap CMS uses **Netlify Identity** to manage logins. You do not need to host your production assets on Netlify (you can keep using GitHub Pages), but Netlify must act as the authorization gateway.
1. Create a free account at [Netlify.com](https://www.netlify.com/).
2. Click **Add new site** → **Import an existing project**.
3. Connect your Git provider (GitHub) and choose your `latte-lounge` repository.
4. Leave build settings empty (since this is a plain static site, no build command is needed; build directory is root `.`). Click **Deploy**.

#### 3. Configure Netlify Identity & Git Gateway
This handles the secure authentication handshake:
1. In the Netlify dashboard, go to your site settings: **Site configuration → Identity**.
2. Click **Enable Identity**.
3. Under **Registration preferences**, change registration from **Open** to **Invite only** (this prevents random visitors from trying to sign up for your dashboard).
4. Scroll down to **Services → Git Gateway**, and click **Enable Git Gateway**. This authorizes Netlify to make commits directly to your GitHub repository on behalf of logged-in editors.

#### 4. Enable Netlify Identity in the Code
We have pre-configured the Identity widget scripts:
- Netlify's Widget script is loaded in the `<head>` of all HTML pages.
- A redirect script is present at the bottom of `index.html` to listen for logins. When a user accepts an invitation and logs in for the first time, they will be redirected straight to the `/admin/` dashboard.

#### 5. Invite Editors and Log In
1. Go back to Netlify's **Identity** tab and click **Invite users**.
2. Enter your email address (and the emails of any other editors).
3. You will receive an invitation email. Click the link to accept it, create a password, and log in.
4. Visit `https://<your-github-username>.github.io/latte-lounge/admin/` (or your custom domain `/admin`) to open Decap CMS, log in with your credentials, and start publishing!

---

### Custom Domain Configuration & DNS Mapping

To point your custom domain (e.g., `www.lattelounge.lk`) to the site, map the DNS records as follows:

#### For GitHub Pages Deployments:
1. In your GitHub repository, navigate to **Settings → Pages**.
2. Scroll to **Custom domain**, enter your domain, and click **Save**.
3. Log in to your DNS provider (e.g. GoDaddy, Namecheap, Cloudflare) and configure:
   - **A Records**: Point `@` (root) to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **CNAME Record**: Point `www` to your GitHub Pages URL (e.g., `boralugoda02.github.io`).
4. Wait for DNS propagation, then check **Enforce HTTPS** in GitHub Pages.

#### For Netlify Gateway Deployments:
If hosting directly on Netlify:
1. In your Netlify dashboard, go to **Site configuration → Domain management → Custom domains** and click **Add custom domain**.
2. Map your DNS records:
   - **A Record**: Point `@` (root) to Netlify's load balancer IP: `75.2.60.5`
   - **CNAME Record**: Point `www` to your Netlify site URL (e.g. `your-site-name.netlify.app`).

---

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
