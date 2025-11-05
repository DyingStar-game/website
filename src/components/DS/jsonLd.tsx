import type { Thing, WithContext } from "schema-dts";

type JsonLdProps<T extends Thing = Thing> = {
  data: WithContext<T>;
};

export const JsonLd = <T extends Thing = Thing>({ data }: JsonLdProps<T>) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
};
