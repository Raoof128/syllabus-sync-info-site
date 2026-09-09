import Image from "next/image";

import { BRAND_NAME, brandAssets, type BrandLogoVariant } from "@/lib/brand";

type BrandLogoProps = {
  /** Which official artwork to render. */
  variant?: BrandLogoVariant;
  /**
   * Rendered height in CSS pixels. The width is derived from the artwork's
   * intrinsic ratio, so the logo can never be stretched. Stylesheets may
   * override the height responsively via `className`; because the width/height
   * attributes are always in the artwork's own ratio, the box stays correct.
   */
  height?: number;
  /**
   * Decorative placements (for example, next to a link that already carries an
   * accessible name) render with an empty alt so the logo is not announced
   * twice.
   */
  decorative?: boolean;
  /** Overrides the default "Syllabus Sync" alt text. */
  alt?: string;
  /** Set on the single above-the-fold logo only. */
  priority?: boolean;
  loading?: "eager" | "lazy";
  sizes?: string;
  className?: string;
};

/**
 * The single entry point for rendering the Syllabus Sync identity.
 *
 * Placements should go through this component rather than raw <img>/<Image>
 * tags so that asset paths, intrinsic ratios and alt-text conventions stay in
 * one place.
 */
export function BrandLogo({
  variant = "wide",
  height = 44,
  decorative = false,
  alt,
  priority = false,
  loading,
  sizes,
  className,
}: BrandLogoProps) {
  const asset = brandAssets[variant];
  const width = Math.round((height * asset.width) / asset.height);

  return (
    <Image
      alt={decorative ? "" : (alt ?? BRAND_NAME)}
      className={className ? `brand-logo ${className}` : "brand-logo"}
      height={height}
      // `priority` already implies eager loading; passing both is invalid.
      {...(priority ? { priority: true } : { loading: loading ?? "lazy" })}
      sizes={sizes}
      src={asset.src}
      width={width}
    />
  );
}
