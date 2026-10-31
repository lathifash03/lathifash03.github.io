import { Picture } from "@/components/ui/Picture";
import type { Asset, Project } from "@/lib/content";

/**
 * DESIGN.md §4: screenshots are framed in CSS, never in a photographic mockup.
 * Which frame a project gets is declared in content (`frame`), never guessed
 * from the image. Without one the screenshot keeps the plain 16:10 crop.
 *
 * The frame is decoration around a real screenshot, so every part of it is
 * aria-hidden; the picture itself carries the alt text.
 */
export function DeviceFrame({
  asset,
  frame,
}: {
  asset: Asset;
  frame?: Project["frame"];
}) {
  if (frame === "phone") {
    // The bezel takes the screenshot's own proportions rather than forcing a
    // 9:16 crop: several of these shots are a pair of screens side by side, or
    // a landscape game, and cropping them to one phone's shape cut them in
    // half. The notch only belongs on a portrait screen, so it follows the
    // measured size (width/height are filled in at build time).
    const portrait = !asset.width || !asset.height || asset.height >= asset.width;
    return (
      <div className="flex justify-center">
        <div
          className={`w-full rounded-[36px] bg-ink p-2.5 ${
            portrait ? "max-w-[240px]" : "max-w-[320px]"
          }`}
        >
          <div className="relative overflow-hidden rounded-[26px] bg-surface-2">
            {portrait ? (
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-2 z-10 h-[5px] w-14 -translate-x-1/2 rounded-full bg-ink/30"
              />
            ) : null}
            <Picture asset={asset} className="w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (frame === "browser") {
    return (
      <div className="overflow-hidden rounded-image border border-line">
        <div
          aria-hidden="true"
          className="flex h-9 items-center gap-1.5 bg-surface-2 px-3.5"
        >
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="ml-2 h-4 grow rounded-full bg-white" />
        </div>
        <Picture
          asset={asset}
          className="aspect-[16/10] w-full bg-surface-2 object-cover object-top"
        />
      </div>
    );
  }

  return (
    <Picture
      asset={asset}
      className="aspect-[16/10] w-full rounded-image bg-surface-2 object-cover"
    />
  );
}
