"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { projectFacts } from "@/content/project-facts";
import { primaryNavigation } from "@/content/site";

import { Icon } from "./icons";
import { Logo } from "./logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <nav aria-label="Primary" className="desktop-nav">
          {primaryNavigation.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <a className="text-link desktop-action" href={projectFacts.mainApplicationUrl}>Sign in</a>
          <a className="button button-small desktop-action" href={projectFacts.mainApplicationUrl}>
            Open Syllabus Sync <Icon name="arrow" size={17} />
          </a>
          <button
            aria-controls="mobile-navigation"
            aria-expanded={open}
            aria-label="Open navigation"
            className="menu-button"
            onClick={() => setOpen(true)}
            ref={menuButton}
            type="button"
          >
            <Icon name="menu" />
          </button>
        </div>
      </div>
      {open && (
        <div aria-label="Mobile navigation" aria-modal="true" className="mobile-menu" id="mobile-navigation" role="dialog">
          <div className="mobile-menu-top">
            <Logo />
            <button
              aria-label="Close navigation"
              className="menu-button"
              onClick={() => {
                setOpen(false);
                menuButton.current?.focus();
              }}
              ref={closeButton}
              type="button"
            >
              <Icon name="x" />
            </button>
          </div>
          <nav aria-label="Mobile primary">
            {primaryNavigation.map((item) => (
              <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
            ))}
          </nav>
          <a className="button" href={projectFacts.mainApplicationUrl}>Open Syllabus Sync <Icon name="arrow" /></a>
          <a className="mobile-sign-in" href={projectFacts.mainApplicationUrl}>Sign in to the main app</a>
        </div>
      )}
    </header>
  );
}
