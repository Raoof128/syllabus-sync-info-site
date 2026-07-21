import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link aria-label="Syllabus Sync information site home" className="brand" href="/">
      <span className="brand-mark" aria-hidden="true">
        <Image
          alt=""
          height={48}
          priority
          src="/brand/syllabus-sync-mark.png"
          width={48}
        />
      </span>
      {!compact && <span className="brand-name">Syllabus Sync</span>}
    </Link>
  );
}
