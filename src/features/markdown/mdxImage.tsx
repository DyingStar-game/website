import type { OptimizedImageProps } from "@components/DS/optimizedImage/optimizeImage";
import { OptimizedImage } from "@components/DS/optimizedImage/optimizeImage";
import { cn } from "@lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

// Images keep their own ratio instead of the aspect-video of OptimizedImage,
// 16:9 is only reserved while loading to limit layout shifts.
// They always take the full width on mobile.
// Widths subtract the paragraph gap-4 (1rem), so that 3 sm or 1 md + 1 sm fit on one line
const mdxImageVariants = cva("aspect-[auto_16/9]", {
  variants: {
    size: {
      lg: "w-full",
      md: "w-full md:w-[calc((100%-1rem)*2/3)]",
      sm: "w-full md:w-[calc((100%-2rem)/3)]",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

type MdxImageSize = NonNullable<VariantProps<typeof mdxImageVariants>["size"]>;

type ImageModifiers = {
  size: MdxImageSize;
};

// Keeps next/image from downloading a larger file than displayed
const MDX_IMAGE_CONTAINER_SIZES: Record<MdxImageSize, string | undefined> = {
  lg: undefined,
  md: "(max-width: 768px) 100vw, 66vw",
  sm: "(max-width: 768px) 100vw, 33vw",
};

const isMdxImageSize = (value: string): value is MdxImageSize =>
  Object.hasOwn(MDX_IMAGE_CONTAINER_SIZES, value);

/**
 * Extracts the modifiers at the end of the alt text, in any order:
 * "Truck|md" -> ["Truck", { size: "md" }]
 *
 * Parsing stops at the first unknown modifier, which is kept in the alt text.
 */
const parseImageModifiers = (alt: string): [string, ImageModifiers] => {
  const modifiers: Partial<ImageModifiers> = {};
  const parts = alt.split("|");

  // Read from the end, so the last modifier of a category wins
  while (parts.length > 1) {
    const modifier = parts[parts.length - 1].trim();

    if (isMdxImageSize(modifier)) modifiers.size ??= modifier;
    else break;

    parts.pop();
  }

  return [parts.join("|").trim(), { size: modifiers.size ?? "lg" }];
};

/**
 * Image of the markdown content, configured with modifiers at the end of the alt text:
 * - size: lg (full width, default), md (2/3 width), sm (1/3 width)
 *
 * @example
 * ```md
 * ![Star map|md](/assets/images/features/star-map.png)
 * ![Teleporter|sm](/assets/images/features/teleporter.png)
 * ```
 */
export const MdxImage = ({
  alt,
  className,
  containerSizes,
  ...props
}: OptimizedImageProps) => {
  if (!props.src) return null;

  const [cleanAlt, { size }] = parseImageModifiers(alt);

  return (
    <OptimizedImage
      {...props}
      alt={cleanAlt}
      className={cn(mdxImageVariants({ size }), className)}
      containerSizes={containerSizes ?? MDX_IMAGE_CONTAINER_SIZES[size]}
    />
  );
};
