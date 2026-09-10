#!/usr/bin/env bash
# Build without native API keys; export and verify the reviewed legal pages.
set -euo pipefail
site_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
aon_dir="$(cd -- "$site_dir/../MQ-Astronomy-Open-Night-2026" && pwd)"
cd "$aon_dir"
flutter build web --release --base-href / --no-web-resources-cdn --no-source-maps
cd "$site_dir"
node scripts/export-aon-pages.mjs "$aon_dir" "$aon_dir/build/web"
python3 scripts/write-aon-headers.py "$aon_dir/build/web"
python3 scripts/verify-aon-bundle.py "$aon_dir/build/web"
# The Play listing artifact IS the exported page; copying it here stops the
# two from drifting apart between releases.
cp "$aon_dir/build/web/privacy.html" "$aon_dir/docs/release/android-privacy-policy.html"
