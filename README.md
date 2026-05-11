# SaveYourSoul — Projektinfo-Seite

Statische Nuxt 4 SSG Projektinfo-Seite für **SaveYourSoul (SYS)**, erreichbar unter [sys.uxprojects-jok.com](https://sys.uxprojects-jok.com).

Diese Seite beschreibt das SaveYourSoul-Projekt. Sie enthält keine App-Logik und kein Backend — sie ist eine rein statische Website.

---

## Was diese Seite ist

- Landing Page mit Projekt-Überblick, Features, Roadmap und FAQ
- API-Dokumentation (MCP Tools, HTTP-Endpunkte, Authentifizierung)
- Dev-Dokumentation (Installation, Konfiguration, Architektur)
- Rechtliche Seiten (Impressum, Datenschutz, Lizenz)

Das eigentliche SaveYourSoul-Produkt (Node-Software, Lua-API, MCP-Server) ist ein separates Repository: [github.com/uxprojectsjok/personal-sys-vps](https://github.com/uxprojectsjok/personal-sys-vps)

---

## Stack

- **Nuxt 4** · SSG · `ssr: false` · rein client-seitig
- **Deployment**: `npm run generate` → `rsync` nach `/var/www/sys.uxprojects-jok.com/`
- **Webserver**: OpenResty (nginx) mit CSP, HSTS, Nonce-Injection
- **Analytics**: Plausible (selbst gehostet, cookiefrei, consent-basiert)

---

## Struktur

```
app/
├── pages/
│   ├── index.vue          Landing Page
│   ├── api-docs.vue       API-Referenz (MCP Tools, HTTP-Endpunkte)
│   ├── dev-docs.vue       Dev-Dokumentation (Installation, Konfiguration)
│   ├── datenschutz.vue    Datenschutzerklärung
│   ├── impressum.vue      Impressum
│   └── lizenz.vue         Lizenz & Nutzungsbedingungen
├── components/
│   ├── ConsentBanner.vue          Plausible-Einwilligung (DSGVO)
│   ├── LegalDatenschutzContent.vue
│   └── LegalImpressumContent.vue
└── assets/css/            Design-System

public/
├── ecosystem/             Bilder (webp)
├── fonts/                 Inter, Noto Serif, Oxanium, JetBrains Mono, Remix Icons
└── icons/                 PWA-Icons

shared/utils/
├── soulParser.js          sys.md Parser
└── soulMaturity.js        Soul-Reife-Berechnung

browser-extension/         Chrome MV3 Extension (eigenständig)
```

---

## Lokale Entwicklung

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run generate
rsync -a --delete .output/public/ /var/www/sys.uxprojects-jok.com/
```

---

## Design-System

| Token | Wert |
|-------|------|
| `--paper` | `#12101a` |
| `--accent` | `#8b5cf6` |
| `--fg` | `#ffffff` |
| `--serif` | Noto Serif |
| `--mono` | Oxanium |
| `--sans` | Inter |

---

## Lizenz

Apache License 2.0 — siehe [LICENSE](LICENSE)

Copyright 2026 Jan-Oliver Karo — UX-Projects, Marburg, Germany
