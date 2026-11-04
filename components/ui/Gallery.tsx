import { Picture } from "@/components/ui/Picture";
import type { Asset } from "@/lib/content";

/**
 * A project's screenshots, shown as thumbnails (decision E); `object-contain`
 * keeps a chart's axes inside the frame instead of cropping them.
 *
 * Each thumbnail is a link to the file itself, so a reader who wants to read
 * the axes of a word cloud or a scatter can open it at full size. The image's
 * own alt text names the link, which is what the reader is choosing between.
 */
export function Gallery({ images }: { images?: Asset[] }) {
  if (!images?.length) return null;
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {images.map((image) => (
        <li key={image.src}>
          <a
            href={image.src}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-image transition-opacity duration-200 hover:opacity-90"
          >
            <Picture
              asset={image}
              className="aspect-[16/10] w-full rounded-image bg-surface object-contain"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
