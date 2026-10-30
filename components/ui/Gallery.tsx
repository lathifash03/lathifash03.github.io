import { Picture } from "@/components/ui/Picture";
import type { Asset } from "@/lib/content";

/**
 * A project's extra screenshots, shown as thumbnails (decision E). Any project
 * may carry one (decision 7); `object-contain` keeps a chart's axes inside the
 * frame instead of cropping them.
 */
export function Gallery({ images }: { images?: Asset[] }) {
  if (!images?.length) return null;
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {images.map((image) => (
        <li key={image.src}>
          <Picture
            asset={image}
            className="aspect-[16/10] w-full rounded-image bg-surface object-contain"
          />
        </li>
      ))}
    </ul>
  );
}
