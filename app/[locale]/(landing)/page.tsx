import { CtaWithButton } from "@components/DS/CTA/ctaWithButton";
import { LogoDiscordSvg } from "@components/svg/logoDiscord";
import { LayoutMain } from "@feat/page/layout";
import { env } from "@lib/env/server";
import { getTranslations } from "next-intl/server";

import { NewsSection } from "./_components/newsSection";
import { ProjectDescriptionSection } from "./_components/projectDescriptionSection";
import { TaskSection } from "./_components/taskSection";

export default async function HomePage() {
  const t = await getTranslations("Landing");

  return (
    <>
      <CtaWithButton
        title={t("CTA.contribute.title")}
        action={{ label: t("CTA.contribute.action"), href: "#" }} //TODO: href
      />

      <LayoutMain size="full">
        <NewsSection />
        <ProjectDescriptionSection />
        <TaskSection />
        <CtaWithButton
          title={t("CTA.discord.title")}
          action={{
            label: t("CTA.discord.action"),
            icon: <LogoDiscordSvg />,
            href: `https://discord.gg/${env.DISCORD_INVITE_ID}`,
            target: "_blank",
          }}
        />
        {/* <YoutubeSection /> */}
      </LayoutMain>
    </>
  );
}
