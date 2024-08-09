// Navigate.tsx
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import NavLink from "./NavLink";
import { listSubBlog, listSubSignal, listSubTraderHub } from "./ListNavigate";

interface NavigateProps {
  colorVisit: string;
  colorNoneVisit: string;
}

const Navigate: React.FC<NavigateProps> = ({ colorVisit, colorNoneVisit }) => {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [openSubNavigate, setOpenSubNavigate] = useState<string>("");
  const location = useLocation();

  const handleOpenSub = (type: string) => {
    setOpenSubNavigate(openSubNavigate === type ? "" : type);
  };

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  return (
    <>
      <Link to="/">
        <span
          className={`${currentPath === "/" ? colorVisit : colorNoneVisit}`}
          onClick={() => handleOpenSub("home")}
        >
          HOME
        </span>
      </Link>
      <Link to="/aboutus">
        <span
          className={`${
            currentPath === "/aboutus" ? colorVisit : colorNoneVisit
          }`}
          onClick={() => handleOpenSub("aboutus")}
        >
          ABOUT US
        </span>
      </Link>
      <Link to="/github">
        <span
          className={`${
            currentPath === "/github" ? colorVisit : colorNoneVisit
          }`}
          onClick={() => handleOpenSub("github")}
        >
          GITHUB
        </span>
      </Link>
      <NavLink
        path="signals"
        title="SIGNALS"
        colorVisit={colorVisit}
        colorNoneVisit={colorNoneVisit}
        currentPath={currentPath}
        openSubNavigate={openSubNavigate}
        handleOpenSub={handleOpenSub}
        subNavList={listSubSignal}
      />
      <NavLink
        path="traderhub"
        title="TRADER'S HUB"
        colorVisit={colorVisit}
        colorNoneVisit={colorNoneVisit}
        currentPath={currentPath}
        openSubNavigate={openSubNavigate}
        handleOpenSub={handleOpenSub}
        subNavList={listSubTraderHub}
      />
      <NavLink
        path="blog"
        title="BLOG"
        colorVisit={colorVisit}
        colorNoneVisit={colorNoneVisit}
        currentPath={currentPath}
        openSubNavigate={openSubNavigate}
        handleOpenSub={handleOpenSub}
        subNavList={listSubBlog}
      />
      <Link to="/file-storage">
        <span
          className={`${
            currentPath === "/file-storage" ? colorVisit : colorNoneVisit
          }`}
          onClick={() => handleOpenSub("file-storage")}
        >
          STORAGE
        </span>
      </Link>
    </>
  );
};

export default Navigate;
