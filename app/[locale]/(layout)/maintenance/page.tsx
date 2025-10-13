import React from "react";

import { LayoutMain } from "@feat/page/layout";
import ReactPlayer from "react-player";

export default function Maintenance() {
  return (
    <LayoutMain>
      <ReactPlayer
        src="/assets/videos/DS_site_maintenance_1080p.mp4"
        autoPlay
        loop
        muted
        style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
      />
    </LayoutMain>
  );
}
