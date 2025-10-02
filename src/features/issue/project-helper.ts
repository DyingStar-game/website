import type { IconName } from "lucide-react/dynamic";
import type { StaticImageData } from "next/image";

import illustration2D from "./assets/im_2d_illustration.png";
import ui2D from "./assets/im_2d_ui.png";
import ux2D from "./assets/im_2d_ux.png";
import archi3D from "./assets/im_3d_archi.png";
import vfx3D from "./assets/im_3d_vfx.png";
import audio from "./assets/im_audio.png";
import dev from "./assets/im_dev.png";
import devArchi from "./assets/im_dev_architech.png";
import devBis from "./assets/im_dev_bis.png";
import devServer from "./assets/im_dev_server.png";

const projectImageMap: Record<number, StaticImageData> = {
  1: devArchi, // Development of the godot engine
  3: ux2D, // Game Design
  8: audio, // Audio
  9: illustration2D, // Narration & Lore
  11: devServer, // Développement Réseau & service
  13: dev, // Web site
  14: ui2D, // UI/UX
  15: devBis, // Development infra & Ci/CD
  16: archi3D, // Modeling 3D & 2D
};

const projectIconMap: Record<number, IconName> = {
  1: "file-code", // Development of the godot engine
  3: "palette", // Game Design
  8: "audio-lines", // Audio
  9: "speech", // Narration & Lore
  11: "network", // Développement Réseau & service
  13: "globe", // Web site
  14: "pencil-ruler", // UI/UX
  15: "unplug", // Development infra & Ci/CD
  16: "container", // Modeling 3D & 2D
};

export const colorKeys = [
  "art-2d",
  "art-3d",
  "audio",
  "dev-website",
  "dev-network",
  "dev-infra",
  "dev-engine",
  "lore",
  "uxui",
] as const;

export type ColorKey = (typeof colorKeys)[number];

export type BgColorClass = `bg-${ColorKey}`;

const projectBgColorMap: Record<number, BgColorClass> = {
  1: "bg-dev-engine", // Development of the godot engine
  3: "bg-art-2d", // Game Design
  8: "bg-audio", // Audio
  9: "bg-lore", // Narration & Lore
  11: "bg-dev-network", // Développement Réseau & service
  13: "bg-dev-website", // Web site
  14: "bg-uxui", // UI/UX
  15: "bg-dev-infra", // Development infra & Ci/CD
  16: "bg-art-3d", // Modeling 3D & 2D
};

export const getProjectImage = (projectNumber: number): StaticImageData => {
  return projectImageMap[projectNumber] ?? vfx3D;
};

export const getProjectIcon = (projectNumber: number): IconName => {
  return projectIconMap[projectNumber] ?? "angry";
};

export const getProjectBgColor = (projectNumber: number): BgColorClass => {
  return projectBgColorMap[projectNumber] ?? "bg-audio";
};
