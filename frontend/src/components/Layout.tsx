import { Outlet } from "react-router-dom";
import Footer from "./Footer/Footer";
import useWindowDimensions from "../hook/useWindowDimension";
import { lazy, Suspense } from "react";
import LoadingPage from "./PagesState/LoadingPage";
const Header = lazy(() => import("./Header/Header"));
const HeaderMbl = lazy(() => import("./Header/HeaderMbl"));

const Layout = () => {
  const { width } = useWindowDimensions();

  return (
    <>
      <Suspense fallback={<LoadingPage />}>
        {width >= 1024 ? <Header /> : <HeaderMbl />}
      </Suspense>

      <div className="relative mt-[85px]">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
