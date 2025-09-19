import { buttonVariants } from "@ui/button";
import Link from "next/link";
import { HeaderBase } from "./header-base";

export function Header() {
  return (
    <HeaderBase>
      <Link
        href="/docs"
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        Docs
      </Link>
      <Link
        href="/about"
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        About
      </Link>
      <Link
        href="/contact"
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        Contact
      </Link>
    </HeaderBase>
  );
}
