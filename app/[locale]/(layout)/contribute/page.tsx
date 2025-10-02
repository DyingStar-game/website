import { Typography } from "@components/DS/typography";
import { getQueryClient } from "@feat/api/get-query-client";
import { projectCountQueryOptions } from "@feat/api/github/hooks/projectCountQueryOptions";
import { projectIssuesQueryOptions } from "@feat/api/github/hooks/projectIssuesQueryOptions";
import { LayoutMain, LayoutSection } from "@feat/page/layout";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import Tasks from "./tasks";

export default async function ContributePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(projectIssuesQueryOptions());
  await queryClient.prefetchQuery(projectCountQueryOptions());

  return (
    <LayoutMain>
      <LayoutSection className="text-center">
        <Typography variant="h1"> Contribuer au projet Dying Star</Typography>
        <Typography variant="p">
          Rejoignez l'équipage et choisissez les missions qui correspondent à
          vos compétences. Chaque tâche renforce l'univers du MMO narratif et
          rapproche la communauté de la prochaine étape du voyage.
        </Typography>
      </LayoutSection>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Tasks />
      </HydrationBoundary>
    </LayoutMain>
  );
}
