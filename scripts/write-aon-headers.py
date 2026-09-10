"""Permit only the exact bundled panorama script alongside the Flutter loader."""
from pathlib import Path
import base64
import hashlib
import re
import sys

try:
    root = Path(sys.argv[1]).resolve(strict=True)
    viewer = (root / "assets/assets/web/indoor_viewer.html").read_text()
    # Hash the exact inline bytes including surrounding whitespace.
    scripts = re.findall(r"<script>([\s\S]*?)</script>", viewer)
    if len(scripts) != 1:
        raise ValueError("Unexpected panorama script layout")
    digest = base64.b64encode(hashlib.sha256(scripts[0].encode()).digest()).decode()
    template = (Path(__file__).parent / "aon-headers").read_text()
    (root / "_headers").write_text(template.replace("AON_VIEWER_SCRIPT_HASH", f"'sha256-{digest}'"))
except (OSError, ValueError, IndexError):
    print("Could not generate the panorama CSP", file=sys.stderr)
    sys.exit(1)
