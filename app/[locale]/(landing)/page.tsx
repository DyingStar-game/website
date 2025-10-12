import { NewsSection } from "@app/[locale]/(landing)/_components/newsSection";
import { CtaWithButton } from "@components/DS/CTA/ctaWithButton";
import { LogoDiscordSvg } from "@components/svg/logoDiscord";
import { LINKS } from "@feat/navigation/Links";
import { LayoutMain } from "@feat/page/layout";
// This is necessary because NEXT_PUBLIC_DISCORD_INVITE_ID is a variable that can be used in both the front and back ends.
import { env } from "@lib/env/client";
import { getTranslations } from "next-intl/server";

const HomePage = async () => {
  const t = await getTranslations("Landing");

  return (
    <>
      <CtaWithButton
        title={t("CTA.contribute.title")}
        action={{
          label: t("CTA.contribute.action"),
          href: LINKS.Project.Contribute.href(),
        }}
      />

      <LayoutMain size="full">
        <NewsSection />
        {/* <ProjectDescriptionSection /> */}
        {/* <TaskSection /> */}
        <CtaWithButton
          title={t("CTA.discord.title")}
          action={{
            label: t("CTA.discord.action"),
            icon: <LogoDiscordSvg />,
            href: `https://discord.gg/${env.NEXT_PUBLIC_DISCORD_INVITE_ID}`,
            target: "_blank",
          }}
        />
        {/* <YoutubeSection /> */}
      </LayoutMain>
    </>
  );
};

export default HomePage;
