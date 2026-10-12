# Frontend security and launch notes

Reviewed 11 October 2026. This is a scoped source review, not a penetration test or legal certification.

## Current frontend

- No application API, database, accounts, uploads, payment service, AI features, or admin routes exist. SQL injection, backend access control, password resets, JWTs, CSRF for authenticated mutations, webhooks, database permissions, and tenant isolation require assessment when those systems are implemented.
- React renders text normally; no raw HTML injection, dynamic code evaluation, or external tracking SDK was found in the application source.
- No credentials are required by the frontend. Environment files are ignored. Ignore rules are not proof that Git history is secret-free.
- Optional email demo requires an unchecked consent box and explicitly states the local-only behaviour. A failed browser-storage write now reports failure. Data deletion removes only the application's own localStorage key.
- No cookie-based tracking exists. The informational storage notice does not pretend to manage nonexistent analytics services. Add real opt-in controls before introducing optional tracking.
- Product claims, prices, reviews, fees, and live subscription claims are not fabricated. Board artwork is labelled as conceptual.
- Fonts are served locally. The supplied reference MIT notice is preserved, but font-specific redistribution licence provenance still needs confirmation before public launch.
- Skip links, visible focus, labelled dialogs, native dialog Escape behaviour, consent labels, and reduced-motion support are implemented. Manual browser/screen-reader and full contrast verification remain outstanding.
- Vite development/preview applies nosniff, frame blocking, referrer, and restricted browser-feature headers. Production hosting must configure equivalent headers; Vite configuration does not set hosting response headers. Production source maps are explicitly disabled.

## Before public sales or collecting live data

Confirm business address, legal entity/registration information where applicable, customer-support/grievance contacts, actual shipping/returns/warranty terms, and jurisdiction-appropriate notices. Have policies reviewed against real operations and applicable Indian requirements. References: https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa and https://consumeraffairs.gov.in/pages/consumer-protection-acts . Do not assume all provisions have the same commencement date.

Choose hosting and establish log retention, access controls, monitoring, backups and restore verification, HTTPS, a production CSP, and production security headers. Keep development servers off the public internet.

For a backend, validate inputs server-side, enforce per-resource authorisation, use least-privilege credentials and secret storage, verify payment/webhook events server-side, rate-limit sensitive endpoints, and review dependencies. Add verifiable deletion and unsubscribe workflows. Do not replace these controls with client-side checks.

## Routes

/privacy, /terms, /refunds, /cookies, /business, /accessibility, /data-deletion

Configure production hosting to serve index.html for these SPA routes. Unknown routes display a not-found view (the hosting status code must be configured separately).
