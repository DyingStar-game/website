import type { News } from "@feat/news/news-manager";
import { SiteConfig } from "site-config";

type MetadataImageProps = {
  post: News;
};

export const NewsSlugMetadataImage = ({ post }: MetadataImageProps) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        gap: 16,
        fontFamily: "Geist",
        color: "white",
        opacity: "1",
        backgroundColor: "#090910",
      }}
    >
      <img
        src={post.attributes.coverUrl}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 12,
          filter: "blur(2px)",
          position: "absolute",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          height: "100%",
          paddingBottom: 64,
          paddingLeft: 54,
          gap: 16,
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <p
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          {SiteConfig.title}
        </p>
        <p
          style={{
            fontSize: "3.5rem",
            fontWeight: "bold",
            margin: 0,
            marginRight: 40,
          }}
        >
          {post.attributes.title}
        </p>
      </div>
    </div>
  );
};
