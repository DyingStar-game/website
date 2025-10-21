import { LogoSvg } from "@components/svg/logoSvg";
import { LINKS } from "@feat/navigation/Links";
import { Link } from "@i18n/navigation";
import { getTranslations } from "next-intl/server";

export const FloatingLegalFooter = async () => {
  const t = await getTranslations("Links");
  return (
    <div className="fixed right-2 bottom-2 flex items-center gap-2">
      <Link
        className="text-xs text-muted-foreground hover:underline"
        href={LINKS.Legal.privacy.href()}
      >
        {t("Legal.privacy")}
      </Link>
      <Link
        className="text-xs text-muted-foreground hover:underline"
        href={LINKS.Legal.terms.href()}
      >
        {t("Legal.terms")}
      </Link>
      <LogoSvg size={12} />
    </div>
  );
};
