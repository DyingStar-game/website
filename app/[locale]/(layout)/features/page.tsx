import { createContentPage } from "@feat/contentPage/contentPage";
import { LINKS } from "@feat/navigation/Links";

const page = createContentPage({
  slug: "features",
  link: LINKS.Project.Features,
});

export const dynamic = "force-static";
export const { generateMetadata, generateStaticParams } = page;
export default page.Page;
