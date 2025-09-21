import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { buttonVariants } from "@ui/button";
import { LogoNameSvg } from "@components/svg/logoNameSvg";
import { HEADER_LINKS, LINKS } from "@feat/navigation/Links";
import { HeaderBase } from "./header-base";

export async function Header() {
  const t = await getTranslations();
  return (
    <HeaderBase>
      {HEADER_LINKS.left.map((link) => (
        <Link
          key={link.href()}
          href={link.href()}
          className={buttonVariants({ variant: "ghost", size: "lg" })}
        >
          {t(link.label)}
        </Link>
      ))}
      <Link href={LINKS.Landing.Landing.href()}>
        <LogoNameSvg className="h-10 w-auto" />
      </Link>
      {HEADER_LINKS.right.map((link) => (
        <Link
          key={link.href()}
          href={link.href()}
          className={buttonVariants({ variant: "ghost", size: "lg" })}
        >
          {t(link.label)}
        </Link>
      ))}
    </HeaderBase>
  );
}
