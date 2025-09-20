import { LogoNameSvg } from "@components/svg/logoNameSvg";
import { LINKS } from "@feat/navigation/Links";
import { buttonVariants } from "@ui/button";
import Link from "next/link";
import { HeaderBase } from "./header-base";
import { getTranslations } from "next-intl/server";

export async function Header() {
  const t = await getTranslations();
  return (
    <HeaderBase>
      <Link
        href={LINKS.Project.Tickets.href()}
        className={buttonVariants({ variant: "ghost", size: "lg" })}
      >
        {t("project")}
      </Link>
      <Link
        href={LINKS.Lore.History.href()}
        className={buttonVariants({ variant: "ghost", size: "lg" })}
      >
        {t("lore")}
      </Link>
      <Link href={LINKS.Landing.Landing.href()}>
        <LogoNameSvg className="h-10 w-auto" />
      </Link>
      <Link
        href={LINKS.Community.Forums.href()}
        className={buttonVariants({ variant: "ghost", size: "lg" })}
      >
        {t("forum")}
      </Link>
      <Link
        href={LINKS.Project.Launcher.href()}
        className={buttonVariants({ variant: "ghost", size: "lg" })}
      >
        {t("playNow")}
      </Link>
    </HeaderBase>
  );
}
