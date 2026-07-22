import Link from "next/link";

import { projectFacts } from "@/content/project-facts";
import { footerNavigation } from "@/content/site";

import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Logo />
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
