import CountInfo from "@components/DS/countInfo/CountInfo";
import { Typography } from "@components/DS/typography";
import { getQueryClient } from "@feat/api/get-query-client";
import { projectIssuesQueryOptions } from "@feat/api/github/hooks/useProjectIssues";
import { LayoutMain, LayoutSection } from "@feat/page/layout";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import Tasks from "./tasks";

export default async function ContributePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(projectIssuesQueryOptions());

  return (
    <LayoutMain>
      <LayoutSection className="text-center">
        <Typography variant="h1"> Contribuer au projet Dying Star</Typography>
        <Typography variant="p">
          Rejoignez l'équipage et choisissez les missions qui correspondent à
          vos compétences. Chaque tâche renforce l'univers du MMO narratif et
          rapproche la communauté de la prochaine étape du voyage.
        </Typography>
        <div className="flex flex-col gap-8 xl:flex-row">
          <CountInfo
            className="flex-1"
            icon="bookmark-check"
            title="Tâches disponibles"
            count={300}
          />
          <CountInfo
            className="flex-1"
            icon="user-star"
            title="Contributeurs actifs"
            count={10}
          />
          <CountInfo
            className="flex-1"
            icon="puzzle"
            title="Domaines couverts"
            count={2}
          />
        </div>
      </LayoutSection>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Tasks />
      </HydrationBoundary>
    </LayoutMain>
  );
}
