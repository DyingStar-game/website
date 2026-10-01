import { Button } from "@components/ui/button";
import { createContentPage } from "@feat/contentPage/contentPage";
import { LINKS } from "@feat/navigation/Links";
import { Link } from "@i18n/navigation";
import { getTranslations } from "next-intl/server";

const DownloadButton = async () => {
  const t = await getTranslations("Play");

  return (
    <div className="grid md:grid-cols-3">
      <Button asChild variant="default" className="md:col-start-2">
        <Link href={LINKS.Project.Launcher.href()}>{t("action")}</Link>
      </Button>
    </div>
  );
};

const page = createContentPage({
  slug: "play",
  link: LINKS.Project.Play,
  children: <DownloadButton />,
});

export const dynamic = "force-static";
export const { generateMetadata, generateStaticParams } = page;
export default page.Page;
