import Link from "next/link";

import { projectFacts } from "@/content/project-facts";
import { footerNavigation } from "@/content/site";

import { BrandLogo } from "./brand-logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          {/*
            The wordmark rather than the full lockup: the symbol already anchors
            the header and the hero, and repeating it here would work against
            keeping the mark a premium, sparingly used asset.
          */}
          <Link aria-label="Syllabus Sync — home" className="brand footer-brand-link" href="/">
            <BrandLogo className="brand-logo-footer" decorative height={26} variant="wordmarkWide" />
          </Link>
          <p>{projectFacts.independenceStatement}</p>
          <p>© 2026 Syllabus Sync.</p>
        </div>
        <nav aria-label="Footer">
          {footerNavigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          <Link href="/security#responsible-disclosure">Responsible disclosure</Link>
          <a href={projectFacts.mainApplicationUrl}>Main app <span aria-hidden="true">↗</span></a>
        </nav>
        <nav aria-label="Elsewhere">
          {projectFacts.socialLinks.map((link) => (
            <a href={link.href} key={link.href} rel="noreferrer" target="_blank">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
