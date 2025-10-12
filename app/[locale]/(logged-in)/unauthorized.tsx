import { Error401 } from "@feat/page/error-401";
import { Layout } from "@feat/page/layout";

export default async function RoutePage() {
  return (
    <Layout>
      <Error401 />
    </Layout>
  );
}
