import { Footer } from "@components/DS/layout/footer";
import { Header } from "@components/DS/layout/header";

const RouteLayout = async ({ children }: LayoutProps<"/">) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default RouteLayout;
