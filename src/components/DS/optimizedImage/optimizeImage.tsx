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
  quality = 80,
  containerSizes,
  ...props
}: OptimizedImageProps) => {
  const imgWidth = width ? Number(width) : 2560;
  const imgHeight = height ? Number(height) : 1440;

  const defaultSizes = `
    (max-width: 320px) 100vw,
    (max-width: 480px) 320px,
    (max-width: 640px) 480px, 
    (max-width: 768px) 640px, 
    (max-width: 1024px) 768px, 
    (max-width: 1280px) 1024px, 
    (max-width: 1536px) 1280px, 
    1536px
  `; // Optimize for tailwind container sizes

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
