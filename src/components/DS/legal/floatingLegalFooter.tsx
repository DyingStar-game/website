import { LogoSvg } from "@components/svg/logoSvg";
import Link from "next/link";

export const FloatingLegalFooter = () => {
  return (
    <div className="fixed right-2 bottom-2 flex items-center gap-2">
      <Link
        className="text-xs text-muted-foreground hover:underline"
        href="/legal/privacy"
      >
        Privacy
      </Link>
      <Link
        className="text-xs text-muted-foreground hover:underline"
        href="/legal/terms"
      >
        Terms
      </Link>
      <LogoSvg size={12} />
    </div>
  );
};
