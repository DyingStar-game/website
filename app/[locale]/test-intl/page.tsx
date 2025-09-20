import { getTranslations } from "next-intl/server";

import LocaleSwitcher from "@feat/i18n/locale-switcher";

import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@feat/page/layout";

export default async function RoutePage() {
  const t = await getTranslations();
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>{t("HomePage.title")}</LayoutTitle>
      </LayoutHeader>
      <LayoutContent>
        <LocaleSwitcher />
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odio et ab
        odit, minus tempore ut porro eius explicabo doloribus consequatur, qui
        officia dolore placeat fugiat veniam recusandae neque commodi totam.
      </LayoutContent>
    </Layout>
  );
}
