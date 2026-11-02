import type { CSSProperties } from "react";
import type { Asset } from "@/lib/content";

/**
 * Local images only, with their measured intrinsic size so the space is
 * reserved before they load (DESIGN.md §9). `images.unoptimized` is on, so
 * next/image would emit the same tag with more machinery.
 */
export function Picture({
  asset,
  className = "",
  priority = false,
  style,
}: {
  asset: Asset;
  className?: string;
  priority?: boolean;
  /** For the one thing a class cannot carry: an object-position from content. */
  style?: CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      className={className}
      style={style}
    />
  );
}
