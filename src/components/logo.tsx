import Link from "next/link";

import { BrandLogo } from "./brand-logo";

type LogoProps = {
  /**
   * The header renders the full lockup on wide viewports and the wordmark on
   * narrow ones: at header size the lockup's wordmark becomes illegible below
   * roughly 40px tall. Both are emitted and toggled in CSS so the choice needs
   * no client-side JavaScript, and `next/image` serves each at its display
   * size, so the hidden one costs a few kilobytes rather than a full asset.
   */
  responsive?: boolean;
  /** Set on the header instance so the above-the-fold logo is preloaded. */
  priority?: boolean;
};

export function Logo({ responsive = false, priority = false }: LogoProps) {
  return (
    <Link aria-label="Syllabus Sync home" className="brand" href="/">
      <BrandLogo
        className={responsive ? "brand-logo-lockup" : undefined}
        decorative
        height={46}
        priority={priority}
        variant="wide"
      />
      {responsive && (
        <BrandLogo className="brand-logo-wordmark" decorative height={24} variant="wordmark" />
      )}
    </Link>
  );
}
