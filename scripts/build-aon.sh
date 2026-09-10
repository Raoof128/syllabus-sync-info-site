#!/usr/bin/env bash
# Build without native API keys; add security headers and verify the bundle.
set -euo pipefail
site_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
aon_dir="$(cd -- "$site_dir/../MQ-Astronomy-Open-Night-2026" && pwd)"
cd "$aon_dir"
flutter build web --release --base-href / --no-web-resources-cdn --no-source-maps
cd "$site_dir"
# The privacy page is generated in the app repository, from its own ARB strings,
# by tool/privacy/gen_privacy_html.py and held in sync by privacy_html_sync_test.
# The Flutter build copies it out of web/ for us, so there is nothing to export
# here — only the security headers and the bundle checks.
python3 scripts/write-aon-headers.py "$aon_dir/build/web"
python3 scripts/verify-aon-bundle.py "$aon_dir/build/web"
