"use client";

import { useMemo } from "react";

import { cn } from "@lib/utils";
import type { BadgeProps } from "@ui/badge";
import { Badge } from "@ui/badge";
import Link from "next/link";

import type { DocType } from "../doc-manager";

type DocSidebarProps = {
  docs: DocType[];
  currentSlug: string;
};

export function DocSidebar({ docs, currentSlug }: DocSidebarProps) {
  const groupedDocs = useMemo(() => {
    // Create "General" group for docs without subcategory
    const grouped: Record<string, typeof docs> = {
      General: [],
    };

    for (const doc of docs) {
      const subcategory = doc.attributes.subcategory ?? "General";
      grouped[subcategory] ??= [];
      grouped[subcategory].push(doc);
    }

    // Sort docs within each subcategory by order or title
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => {
        if (
          a.attributes.order !== undefined &&
          b.attributes.order !== undefined
        ) {
          return a.attributes.order - b.attributes.order;
        }
        return a.attributes.title.localeCompare(b.attributes.title);
      });
    });

    return grouped;
  }, [docs]);

  // Sort subcategories alphabetically, but keep "General" at the top
  const sortedSubcategories = useMemo(() => {
    return Object.keys(groupedDocs).sort((a, b) => {
      if (a === "General") return -1;
      if (b === "General") return 1;
      return a.localeCompare(b);
    });
  }, [groupedDocs]);

  return (
    <nav className="flex flex-col gap-6">
      {sortedSubcategories.map((subcategory) => {
        const subcategoryDocs = groupedDocs[subcategory];

        // For the General category, render without collapsible
        if (subcategory === "General" && subcategoryDocs.length > 0) {
          return (
            <div key={subcategory} className="flex flex-col gap-2">
              {subcategoryDocs.map((doc) => (
                <DocLink
                  key={doc.slug}
                  doc={doc}
                  isActive={currentSlug === doc.slug}
                />
              ))}
            </div>
          );
        }

        // Skip empty subcategories
        if (subcategoryDocs.length === 0) return null;

        return (
          <div key={subcategory} className="flex flex-col gap-2">
            <div className="mb-2 text-sm font-medium">
              <span>{subcategory}</span>
            </div>
            <div className="flex flex-col gap-2">
              {subcategoryDocs.map((doc) => (
                <DocLink
                  key={doc.slug}
                  doc={doc}
                  isActive={currentSlug === doc.slug}
                />
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

type DocLinkProps = {
  doc: DocType;
  isActive: boolean;
};

const getBadgeColor = (method: string): BadgeProps["color"] => {
  if (method === "GET") return "blue";
  if (method === "POST") return "green";
  if (method === "PUT") return "yellow";
  if (method === "DELETE") return "red";
  return "zinc";
};

function DocLink({ doc, isActive }: DocLinkProps) {
  return (
    <Link
      href={`/docs/${doc.slug}`}
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-muted-foreground transition hover:text-foreground",
        {
          "text-primary": isActive,
        },
      )}
    >
      {doc.attributes.method ? (
        <Badge color={getBadgeColor(doc.attributes.method)}>
          {doc.attributes.method}
        </Badge>
      ) : null}
      {doc.attributes.title}
    </Link>
  );
}
