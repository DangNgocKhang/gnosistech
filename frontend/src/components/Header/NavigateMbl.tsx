import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import NavLinkMbl from "./NavLinkMbl";
import { listSubSignal, listSubTraderHub, listSubBlog } from "./ListNavigate";

interface NavigateMblProps {
  colorVisit: string;
  colorNoneVisit: string;
}

const NavigateMbl: React.FC<NavigateMblProps> = ({
  colorVisit,
  colorNoneVisit,
}) => {
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
      <NavLinkMbl
        path="signals"
        title="SIGNALS"
        colorVisit={colorVisit}
        colorNoneVisit={colorNoneVisit}
        currentPath={currentPath}
        openSubNavigate={openSubNavigate}
        handleOpenSub={handleOpenSub}
        subNavList={listSubSignal}
      />
      <NavLinkMbl
        path="traderhub"
        title="TRADER'S HUB"
        colorVisit={colorVisit}
        colorNoneVisit={colorNoneVisit}
        currentPath={currentPath}
        openSubNavigate={openSubNavigate}
        handleOpenSub={handleOpenSub}
        subNavList={listSubTraderHub}
      />
      <NavLinkMbl
        path="blog"
        title="BLOG"
        colorVisit={colorVisit}
        colorNoneVisit={colorNoneVisit}
        currentPath={currentPath}
        openSubNavigate={openSubNavigate}
        handleOpenSub={handleOpenSub}
        subNavList={listSubBlog}
      />
      <Link to="/upload">
        <span
          className={`${
            currentPath === "/upload" ? colorVisit : colorNoneVisit
          }`}
          onClick={() => handleOpenSub("upload")}
        >
          UPLOAD
        </span>
      </Link>
    </>
  );
};

export default NavigateMbl;
