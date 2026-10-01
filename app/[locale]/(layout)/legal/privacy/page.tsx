import { createContentPage } from "@feat/contentPage/contentPage";
import { LINKS } from "@feat/navigation/Links";

const page = createContentPage({
  slug: "privacy",
  link: LINKS.Legal.privacy,
});

export const dynamic = "force-static";
export const { generateMetadata, generateStaticParams } = page;
export default page.Page;
