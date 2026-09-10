# Astronomy Open Night domain and policy migration

Reviewed 10 September 2026 against app commit `38db096` and the working-tree corrections described here.

## Deployment

- App: `https://aon.syllabus-sync.app/`
- Privacy: `https://aon.syllabus-sync.app/privacy`
- Support: `https://info.syllabus-sync.app/astronomy-open-night/support`
- Terms: `https://info.syllabus-sync.app/astronomy-open-night/terms`
- Official event information: `https://event.mq.edu.au/astronomy-open-night/`

The dedicated `astronomy-open-night` Worker is configured to serve the Flutter assets, with static HTML taking precedence at `/privacy` and SPA fallback for app navigation. `wrangler.aon.jsonc` attaches the custom domain and disables public Worker preview hosts. The information-site Worker remains separate and serves the AON support and terms pages. Its old app and privacy paths are configured to redirect to the dedicated host.

## Sources and policy consistency

The identity comes from the app's `lib/config/app_identity.dart`: Leo Alavi and Mohammad Raouf Abedini developed the independent app for Astronomy Night – FSE Outreach Team. Hosting on this domain does not make the app a Syllabus Sync product. The public privacy contact, `leo@leoalavi.dev`, was already confirmed in `docs/release/play-store-listing.md` and the native policy. Event support uses the official event website.

Reviewed declarations: `ios/Runner/PrivacyInfo.xcprivacy`, iOS location/camera/motion purpose strings, Android permissions, `docs/release/app-store-connect-final-checklist.md` App Privacy answers, `docs/release/play-store-listing.md` Data Safety answers, the English and Persian ARBs, Google Maps and ML Kit disclosures, and local storage/deletion code.

The policy separates native location and Maps, Android ML Kit diagnostics, native backups, and web browser storage and manual passport entry. It does not claim no data leaves the device, does not promise erasing Google's data, and does not change the existing store data categories. The iOS app's own privacy manifest declares its direct location collection; the store answer set additionally declares Google's SDK data.

The privacy policy is owned by the app repository. `tool/privacy/gen_privacy_html.py` generates `web/privacy.html` from the app's own `webPrivacy*` ARB strings, and `test/unit/privacy_html_sync_test.dart` fails if the two drift. The Flutter build copies that file into the bundle, so the information site exports nothing and holds no second copy to drift.

The canonical store-facing page is English. The in-app privacy presentation is localised into English and Persian from the same section structure.

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

The web build reads only `MAPS_API_KEY`; conditional imports exclude native key defines. A production key must be HTTP-referrer restricted to the AON host and API-restricted to Maps JavaScript API and Routes API. Flutter rendering assets and the Persian fallback font are self-hosted. The panorama inline script is allowed by its exact SHA-256 CSP hash, generated at build time. The build checks public assets for private files, source maps and Cloudflare size limits.

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
