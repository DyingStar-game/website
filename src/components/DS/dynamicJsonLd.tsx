import { useEffect } from "react";

import type { Thing, WithContext } from "schema-dts";

type DynamicJsonLdProps<T extends Thing = Thing> = {
  data: WithContext<T>;
  id?: string;
};

export const DynamicJsonLd = <T extends Thing = Thing>({
  data,
  id = "dynamic-jsonld",
}: DynamicJsonLdProps<T>) => {
  useEffect(() => {
    // Remove old script
    const existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }

    // Create new script
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.innerHTML = JSON.stringify(data).replace(/</g, "\\u003c");
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const cleanup = document.getElementById(id);
      if (cleanup) cleanup.remove();
    };
  }, [data, id]);
  return null;
};
