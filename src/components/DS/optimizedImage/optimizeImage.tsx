import { cn } from "@lib/utils";
import type { ImageProps } from "next/image";
import Image from "next/image";

export type OptimizedImageProps = Omit<ImageProps, "width" | "height"> & {
  width?: number | string;
  height?: number | string;
  containerSizes?: string;
};

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  quality = 95,
  containerSizes,
  ...props
}: OptimizedImageProps) => {
  const imgWidth = width ? Number(width) : 2560;
  const imgHeight = height ? Number(height) : 1440;

  const defaultSizes = `
    (max-width: 640px) calc(100vw - 4rem), 
    (max-width: 768px) calc(640px - 4rem), 
    (max-width: 1024px) calc(768px - 4rem), 
    (max-width: 1280px) calc(1024px - 4rem), 
    (max-width: 1536px) calc(1280px - 4rem), 
    calc(1536px - 4rem)
  `; // Optimize for tailwind container sizes + container padding (px-4 => 4rem)

  return (
    <Image
      src={src}
      alt={alt}
      width={imgWidth}
      height={imgHeight}
      quality={quality}
      className={cn("aspect-video h-auto w-full object-contain", className)}
      sizes={containerSizes ?? defaultSizes}
      {...props}
    />
  );
};
