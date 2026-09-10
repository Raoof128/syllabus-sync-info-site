"""Reject unsafe or incomplete public bundles without printing sensitive values."""
from pathlib import Path
import re
import sys


def main() -> int:
    try:
        root = Path(sys.argv[1]).resolve(strict=True)
        for name in ("index.html", "main.dart.js", "privacy.html", "support.html", "terms.html", "_headers"):
            if not (root / name).is_file():
                raise ValueError("A required public asset is missing")
        files = [item for item in root.rglob("*") if item.is_file()]
        for item in files:
            if item.stat().st_size > 25 * 1024 * 1024:
                raise ValueError("An asset exceeds the Cloudflare per-file limit")
            if item.name.startswith(".env") or item.suffix in (".map", ".pem", ".key", ".jks"):
                raise ValueError("A private or source-map artifact is in the public bundle")
            if item.suffix in (".js", ".json", ".html") and re.search(
                rb"AIza[0-9A-Za-z_-]{35}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",
                item.read_bytes(),
            ):
                raise ValueError("A credential pattern is in the keyless public bundle")
        print(f"Verified {len(files)} public assets: size limits, required pages and credential-pattern scan passed.")
        return 0
    except (OSError, ValueError, IndexError) as error:
        print(str(error) if isinstance(error, ValueError) else "Could not verify public bundle", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
