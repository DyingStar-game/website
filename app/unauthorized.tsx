import type { PropsWithChildren } from "react";

import GridBackground from "@components/DS/grid-background";
import { Error401 } from "@feat/page/error-401";

const SQUARE_SIZE = 20;
const SQUARE_COLOR = "color-mix(in srgb, var(--muted) 50%, transparent)";

export default function RouteLayout(props: PropsWithChildren) {
  return (
    <div className="flex min-h-full items-center justify-center">
      <GridBackground color={SQUARE_COLOR} size={SQUARE_SIZE} />
      <Error401 />
    </div>
  );
}
