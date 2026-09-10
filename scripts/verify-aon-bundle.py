"""Reject unsafe or incomplete public bundles without printing sensitive values."""
import re
import sys
from pathlib import Path


def main() -> int:
    try:
        root = Path(sys.argv[1]).resolve(strict=True)
        # Support and terms live on the information site; this host serves the app and
        # the canonical privacy policy.
        for name in ("index.html", "main.dart.js", "privacy.html", "_headers"):
            if not (root / name).is_file():
                raise ValueError("A required public asset is missing")
        files = [item for item in root.rglob("*") if item.is_file()]
        for item in files:
            if item.stat().st_size > 25 * 1024 * 1024:
                raise ValueError("An asset exceeds the Cloudflare per-file limit")
            if item.name.startswith(".env") or item.suffix in (".map", ".pem", ".key", ".jks"):
                raise ValueError("A private or source-map artifact is in the public bundle")
            # A referrer-restricted Maps browser key is intentionally public in
            # main.dart.js. Private-key material must never be present.
            if item.suffix in (".js", ".json", ".html") and re.search(
                rb"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",
                item.read_bytes(),
            ):
                raise ValueError("Private-key material is in the public bundle")
        print(f"Verified {len(files)} public assets: size limits, required pages and private-key scan passed.")
        return 0
    except (OSError, ValueError, IndexError) as error:
        print(str(error) if isinstance(error, ValueError) else "Could not verify public bundle", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
