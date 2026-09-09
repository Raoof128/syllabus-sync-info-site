/**
 * Registry of the official Syllabus Sync brand assets.
 *
 * The files in `public/brand` are derived from the originals kept in
 * `brand/source` by `tools/brand/build_brand_assets.py`. Intrinsic dimensions
 * are recorded here so every placement can reserve the correct box ahead of
 * load, which is what keeps the logo free of layout shift and distortion.
 *
 * Sizes must be updated if the generator's output changes.
 */

export type BrandLogoVariant =
  | "primary"
  | "wide"
  | "wideAlt"
  | "wordmark"
  | "wordmarkWide"
  | "icon"
  | "iconCloseCrop";

export type BrandAsset = {
  src: string;
  width: number;
  height: number;
  /** What the artwork contains, used to pick a sensible default alt text. */
  kind: "lockup" | "wordmark" | "logomark";
};

/**
 * `wide` and `wideAlt` intentionally resolve to the same file: the two supplied
 * banner artworks are byte-identical, so shipping both would be a duplicate
 * asset. The variant name is kept so callers can express intent.
 */
export const brandAssets: Record<BrandLogoVariant, BrandAsset> = {
  primary: { src: "/brand/logo-primary-horizontal.png", width: 1447, height: 735, kind: "lockup" },
  wide: { src: "/brand/logo-wide.png", width: 1670, height: 660, kind: "lockup" },
  wideAlt: { src: "/brand/logo-wide.png", width: 1670, height: 660, kind: "lockup" },
  wordmark: { src: "/brand/wordmark-standard.png", width: 1244, height: 266, kind: "wordmark" },
  wordmarkWide: { src: "/brand/wordmark-wide.png", width: 1454, height: 322, kind: "wordmark" },
  icon: { src: "/brand/logomark-square.png", width: 772, height: 972, kind: "logomark" },
  iconCloseCrop: { src: "/brand/logomark-close-crop.png", width: 711, height: 936, kind: "logomark" },
};

/** Square app icons, generated from the logomark on the brand backdrop. */
export const brandIcons = {
  icon192: { src: "/brand/icons/icon-192.png", size: 192 },
  icon512: { src: "/brand/icons/icon-512.png", size: 512 },
  maskable512: { src: "/brand/icons/maskable-512.png", size: 512 },
} as const;

/** Warm off-white carried by the artwork; matches the app icon backdrop. */
export const brandBackdrop = "#f9f0eb";

export const BRAND_NAME = "Syllabus Sync";
