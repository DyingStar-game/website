import type { OptimizedImageProps } from "@components/DS/optimizedImage/optimizeImage";
import { OptimizedImage } from "@components/DS/optimizedImage/optimizeImage";
import { rehypePlugins, remarkPlugins } from "@feat/markdown/markdown.config";
import { cn } from "@lib/utils";
import type { MDXComponents } from "next-mdx-remote-client/rsc";
import { MDXRemote } from "next-mdx-remote-client/rsc";

type ServerMdxProps = {
  source: string;
  className?: string;
};

const MdxComponent: MDXComponents = {
  img: ({ ...props }: OptimizedImageProps) => {
    if (!props.src) return null;

    return <OptimizedImage {...props} />;
  },
};

export const ServerMdx = (props: ServerMdxProps) => {
  return (
    <div
      className={cn(
        "prose max-w-full prose-dyingstar",
        // "prose-p:text-lg md:prose-p:text-xl lg:prose-p:text-2xl",
        // "prose-ul:text-lg md:prose-ul:text-xl lg:prose-ul:text-2xl",
        // "prose-ol:text-lg md:prose-ol:text-xl lg:prose-ol:text-2xl",
        // "prose-h1:text-5xl prose-h1:font-normal md:prose-h1:text-6xl lg:prose-h1:text-7xl",
        // "prose-h2:text-4xl prose-h2:font-normal md:prose-h2:text-5xl lg:prose-h2:text-6xl",
        // "prose-h3:text-xl prose-h3:font-normal md:prose-h3:text-2xl lg:prose-h3:text-3xl",
        // "prose-h4:text-xl prose-h4:font-normal",
        "prose-figure:flex prose-figure:flex-col prose-figure:items-center",
        "prose-p:has-[img]:flex prose-p:has-[img]:flex-col prose-p:has-[img]:items-center",
        props.className,
      )}
    >
      <RenderMdx {...props} />
    </div>
  );
};

const RenderMdx = (props: ServerMdxProps) => {
  return (
    <MDXRemote
      source={props.source}
      components={MdxComponent}
      options={{
        mdxOptions: {
          remarkPlugins: remarkPlugins,
          rehypePlugins: rehypePlugins,
          format: "mdx",
        },
      }}
    />
  );
};
