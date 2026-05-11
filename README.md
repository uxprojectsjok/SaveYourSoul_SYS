# SaveYourSoul — Project Info Site

Static Nuxt 4 SSG project info site for **SaveYourSoul (SYS)**, live at [sys.uxprojects-jok.com](https://sys.uxprojects-jok.com).

This site describes the SaveYourSoul project. It contains no app logic and no backend — it is a purely static website.

The actual SaveYourSoul product (node software, Lua API, MCP server, init script) lives in a separate repository:
**[github.com/uxprojectsjok/personal-sys-vps](https://github.com/uxprojectsjok/personal-sys-vps)**

---

## What's on this site

- Landing page — project overview, features, roadmap, FAQ
- API reference — MCP tools, HTTP endpoints, authentication
- Dev docs — installation, configuration, architecture
- Legal pages — imprint, privacy policy, license

---

## Stack

- **Nuxt 4** · SSG · `ssr: false` · fully client-side rendered
- **Deploy**: `npm run generate` → `rsync` to web root
- **Web server**: OpenResty (nginx) with CSP, HSTS, nonce injection
- **Analytics**: self-hosted Plausible (cookieless, consent-based)

---

## Structure

```
app/
├── pages/
│   ├── index.vue          Landing page
│   ├── api-docs.vue       API reference (MCP tools, HTTP endpoints)
│   ├── dev-docs.vue       Dev documentation (installation, configuration)
│   ├── datenschutz.vue    Privacy policy (German, GDPR)
│   ├── impressum.vue      Imprint (German, required by law)
│   └── lizenz.vue         License & terms of use
├── components/
│   ├── ConsentBanner.vue           Plausible consent (GDPR)
│   ├── LegalDatenschutzContent.vue
│   └── LegalImpressumContent.vue
└── assets/css/            Design system tokens

public/
├── ecosystem/             Images (webp)
├── fonts/                 Inter, Noto Serif, Oxanium, JetBrains Mono, Remix Icons
└── icons/                 PWA icons

shared/utils/
├── soulParser.js          sys.md parser
└── soulMaturity.js        Soul maturity scoring

browser-extension/         Chrome MV3 extension (standalone)
```

---

## Development

```bash
npm install
npm run dev
```

## Build & deploy

```bash
npm run generate
rsync -a --delete .output/public/ /var/www/<domain>/
```

---

## Design tokens

| Token | Value |
|-------|-------|
| `--paper` | `#12101a` |
| `--accent` | `#8b5cf6` |
| `--fg` | `#ffffff` |
| `--serif` | Noto Serif |
| `--mono` | Oxanium |
| `--sans` | Inter |

---

## License

Apache License 2.0 — see [LICENSE](LICENSE)

Copyright 2026 Jan-Oliver Karo — UX-Projects, Marburg, Germany
