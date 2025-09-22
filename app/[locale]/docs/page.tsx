import { buttonVariants } from "@ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { getDocs } from "./doc-manager";

export const metadata = {
  title: "Documentation | Lumail",
  description:
    "Everything you need to know about using Lumail for your email marketing",
};

export default async function DocsPage(props: PageProps<"/[locale]/docs">) {
  const docs = await getDocs();

  const sortedDocs = [...docs].sort((a, b) => {
    // Sort by order if available
    if (a.attributes.order !== undefined && b.attributes.order !== undefined) {
      return a.attributes.order - b.attributes.order;
    }

    // Otherwise sort by title
    return a.attributes.title.localeCompare(b.attributes.title);
  });

  return (
    <div className="grid flex-1 gap-6 sm:grid-cols-2">
      {sortedDocs.map((doc) => (
        <Card key={doc.slug} className="h-fit overflow-hidden pt-0">
          {doc.attributes.coverUrl && (
            <div
              className="h-36 bg-cover bg-center"
              style={{ backgroundImage: `url(${doc.attributes.coverUrl})` }}
            />
          )}
          <CardHeader>
            <CardTitle>{doc.attributes.title}</CardTitle>
            <CardDescription>{doc.attributes.description}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link
              href={`/docs/${doc.slug}`}
              className={buttonVariants({ variant: "outline" })}
            >
              Read More <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
