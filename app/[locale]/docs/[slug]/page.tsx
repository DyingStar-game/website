import { Typography } from "@components/DS/typography";
import { ServerMdx } from "@feat/markdown/server-mdx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentDoc, getDocs } from "../doc-manager";

export const dynamic = "force-static";

export async function generateMetadata(
  props: PageProps<"/[locale]/docs/[slug]">,
): Promise<Metadata> {
  const params = await props.params;
  const doc = await getCurrentDoc(params.slug);

  if (!doc) {
    notFound();
  }

  return {
    title: doc.attributes.title,
    description: doc.attributes.description,
    keywords: doc.attributes.keywords,
  };
}

export async function generateStaticParams() {
  const docs = await getDocs();

  return docs.map((doc) => ({
    slug: doc.slug,
  }));
}

export default async function RoutePage(
  props: PageProps<"/[locale]/docs/[slug]">,
) {
  const params = await props.params;
  const doc = await getCurrentDoc(params.slug);

  if (!doc) {
    notFound();
  }

  // Get all example languages from the frontmatter
  const exampleLanguages = doc.attributes.examples
    ? Object.keys(doc.attributes.examples)
    : [];

  const resultsLanguages = doc.attributes.results
    ? Object.keys(doc.attributes.results)
    : [];

  return (
    <div className="flex max-w-full flex-1 flex-row gap-4 lg:gap-12">
      <ServerMdx
        className="prose dark:prose-invert lg:prose-lg mx-auto flex-2"
        source={doc.content}
      />

      {doc.attributes.examples && exampleLanguages.length > 0 ? (
        <div className="sticky top-8 flex h-fit w-full max-w-md flex-1 flex-col gap-2 overflow-auto">
          <Typography variant="h3">Request</Typography>
          <Tabs defaultValue={exampleLanguages[0]}>
            <TabsList>
              {exampleLanguages.map((lang) => (
                <TabsTrigger key={lang} value={lang} className="capitalize">
                  {lang}
                </TabsTrigger>
              ))}
            </TabsList>

            {exampleLanguages.map((lang) => {
              // Get the code example for this language
              const code = doc.attributes.examples?.[lang] ?? "";

              return (
                <TabsContent
                  key={lang}
                  value={lang}
                  className="code-example rounded-md"
                >
                  <div className="bg-muted/20 rounded-md p-1">
                    <ServerMdx
                      source={`\`\`\`${lang}\n${code}\n\`\`\``}
                      className="prose dark:prose-invert prose-sm"
                    />
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>

          <Typography variant="h3">Results</Typography>
          <Tabs defaultValue={resultsLanguages[0] || "success"}>
            <TabsList>
              {resultsLanguages.length > 0 ? (
                resultsLanguages.map((lang) => (
                  <TabsTrigger key={lang} value={lang} className="capitalize">
                    {lang}
                  </TabsTrigger>
                ))
              ) : (
                <TabsTrigger value="success">Results</TabsTrigger>
              )}
            </TabsList>

            {resultsLanguages.length > 0 ? (
              resultsLanguages.map((lang) => {
                const result = doc.attributes.results?.[lang] ?? "";
                return (
                  <TabsContent
                    key={lang}
                    value={lang}
                    className="code-example rounded-md"
                  >
                    <div className="bg-muted/20 rounded-md p-1">
                      <ServerMdx
                        source={`\`\`\`json\n${result}\n\`\`\``}
                        className="prose prose-sm"
                      />
                    </div>
                  </TabsContent>
                );
              })
            ) : (
              <TabsContent value="success">
                <div className="bg-muted/20 rounded-md p-1">
                  <ServerMdx source="No results available" className="pros" />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      ) : null}
    </div>
  );
}
