# Astronomy Open Night domain and policy migration

Reviewed 10 September 2026 against app commit `38db096` and the working-tree corrections described here.

## Deployment

- App: `https://aon.syllabus-sync.app/`
- Privacy: `https://aon.syllabus-sync.app/privacy`
- Support: `https://aon.syllabus-sync.app/support`
- Terms: `https://aon.syllabus-sync.app/terms`
- Official event information: `https://event.mq.edu.au/astronomy-open-night/`

The dedicated `astronomy-open-night` Worker serves the Flutter assets, with static HTML taking precedence at the three legal URLs and SPA fallback for app navigation. `wrangler.aon.jsonc` attaches the custom domain and disables public Worker preview hosts. The information-site Worker remains separate. Its legacy app and legal paths return permanent redirects to the new host.

## Sources and policy consistency

The identity comes from the app's `lib/config/app_identity.dart`: Leo Alavi and Mohammad Raouf Abedini developed the independent app for Astronomy Night – FSE Outreach Team. Hosting on this domain does not make the app a Syllabus Sync product. The public privacy contact, `leo@leoalavi.dev`, was already confirmed in `docs/release/play-store-listing.md` and the native policy. Event support uses the official event website.

Reviewed declarations: `ios/Runner/PrivacyInfo.xcprivacy`, iOS location/camera/motion purpose strings, Android permissions, `docs/release/app-store-connect-final-checklist.md` App Privacy answers, `docs/release/play-store-listing.md` Data Safety answers, the English and Persian ARBs, Google Maps and ML Kit disclosures, and local storage/deletion code.

The policy separates native location/Maps, Android ML Kit diagnostics, native backups, web browser storage/manual passport entry and Cloudflare hosting requests. It does not claim no data leaves the device, does not promise erasing Google's data, and does not change the existing store data categories. The iOS app's own privacy manifest declares its direct location collection; the store answer set additionally declares Google's SDK data.

`scripts/export-aon-pages.mjs` refuses to export if the English native policy differs from the typed website policy. Both native locales are bundled; the web route renders the same policy. The static `/privacy` document contains English and Persian without requiring JavaScript, plus clickable Google and Cloudflare policies. The Android policy artifact is regenerated from that same HTML.

## Build and release

From this repository, with the sibling Flutter repository present:

```bash
npm run aon:build
npm run test:aon
npm run check
npm run test:e2e
# CLOUDFLARE_API_TOKEN must already be supplied in the process environment.
npx wrangler deploy --config wrangler.aon.jsonc
npm run cf:deploy
```

The web build intentionally has no Maps keys. It uses the compiled campus map and the app's existing external-Maps fallback. Embedded Google Maps requires a separately reviewed, web-restricted key and corresponding CSP changes; native keys must never enter the web bundle. Flutter rendering assets and the Persian fallback font are self-hosted. The panorama inline script is allowed by its exact SHA-256 CSP hash, generated at build time. The build checks public assets for key patterns, private files and Cloudflare size limits.

The 360° viewer is driven by a two-sided handshake: the iframe announces itself
and the Flutter host also posts on its own load-stop, so whichever arrives second
wins and the tour is never lost to a race. That means `loadTour` normally runs
twice, so it now destroys the previous Pannellum viewer and empties the container
before building the next one. Without that, the second call stacked a second
WebGL canvas and loading box over the first, fetched every panorama image twice
and leaked the first viewer's GL context. `tests/aon/app.spec.ts` asserts exactly
one viewer in Chromium, Firefox and WebKit.

The old and new web origins have separate browser storage. Saved browser plans/stamps cannot be migrated automatically across origins. Installed native app data is unaffected.

Native source and policy fixes need a new signed app build to reach existing installs. Website deployment does not update TestFlight or Google Play binaries, or edit their console metadata automatically. Enter the canonical privacy URL above in both consoles and use the existing App Privacy/Data Safety answer sets; do not replace them with “Data Not Collected.”

## Rollback

Deploy the previous `syllabus-sync-info` version (`2409db27-bffb-4f21-a333-ae9a953ecee2`) to restore the previous information-site behavior. Keep the new legal pages online once store metadata references them. Use Cloudflare's previous asset version to roll back the app; do not remove its domain or policy during rollback.
