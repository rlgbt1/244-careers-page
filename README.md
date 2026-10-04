# 244 Careers

Standalone React / Vite careers website for **careers.244club.com**, separated from 244club.com.

## Local development

- Node 20.19+ (Node 24 recommended).
- Run `npm ci`, then `npm run dev -- --host 127.0.0.1 --port 5180`.
- `npm run build` checks TypeScript, builds the app and generates crawlable route metadata.
- `npm test` runs data regression checks.

## Pages

Home, Tracker, Programmes, Recruitment, CV 101 and Resources. English and Portuguese share routes; `?lang=pt` or `?lang=en` sets the initial language.

The unified tracker preserves source programme records, removes overlaps and groups by employer. Area filters describe roles, not source collections. Imported research is dated 4 October 2026. A reachable link is not proof of an open vacancy; visitors must confirm dates and eligibility with employers.

## Publishing

The repository includes a GitHub Pages Actions workflow and `public/CNAME`.
Enable **Settings → Pages → Source: GitHub Actions**. Set the custom domain to **careers.244club.com**.

In Cloudflare DNS, add a **CNAME** record:
- Name: `careers`
- Target: `rlgbt1.github.io`
- Use DNS-only while GitHub validates the domain and issues HTTPS.

Do not change the apex `244club.com` record. Enable “Enforce HTTPS” after certificate provisioning.

## Content and assets

Careers content, the original CV 101 PDF and its previews were migrated from the 244 Club project. Internal research CSVs are deliberately not shipped or included in this public repository. The visible tracker is a public curated derivative.

Tesco uses its official SVG wordmark, Boeing its official 300×110 wordmark; see `public/assets/employers/migration-sources.json`. Logos identify employers; no partnership is implied. The student-at-computer visual appears only in HireVue and is labelled illustrative/AI-generated.

The main website links here through its Careers menu and a beige home-page overview. Legacy tracker links are mapped to this site's relevant pages.
