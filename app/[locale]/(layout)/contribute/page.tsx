import { Typography } from "@components/DS/typography";
import { getQueryClient } from "@feat/api/get-query-client";
import { Layout, LayoutMain, LayoutSection } from "@feat/page/layout";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import Tasks from "./tasks";

export default async function ContributePage() {
  const queryClient = getQueryClient();

  return (
    <LayoutMain>
      <LayoutSection>
        <Layout asChild padding="default">
          <div className="flex max-w-4xl flex-col justify-center text-center">
            <Typography variant="h1">
              Contribuer au projet Dying Star
            </Typography>
            <Typography variant="p">
              Rejoignez l'équipage et choisissez les missions qui correspondent
              à vos compétences. Chaque tâche renforce l'univers du MMO narratif
              et rapproche la communauté de la prochaine étape du voyage.
            </Typography>
          </div>
        </Layout>
      </LayoutSection>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Tasks />
      </HydrationBoundary>
    </LayoutMain>
  );
}
