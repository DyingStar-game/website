import { Footer } from "@components/DS/layout/footer";
import { Header } from "@components/DS/layout/header";

const RouteLayout = async ({ children }: LayoutProps<"/">) => {
  return (
    <>
      <Header />
      <div className="min-h-full flex-1">{children}</div>
      <Footer />
    </>
  );
};

export default RouteLayout;
