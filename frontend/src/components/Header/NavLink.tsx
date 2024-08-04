// NavLink.tsx
import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa6";
import SubNavigate from "./SubNavigate";
interface ISubNavigate {
  path: string;
  title: string;
}

interface NavLinkProps {
  path: string;
  title: string;
  colorVisit: string;
  colorNoneVisit: string;
  currentPath: string;
  openSubNavigate: string;
  handleOpenSub: (type: string) => void;
  subNavList?: ISubNavigate[];
}

const NavLink: React.FC<NavLinkProps> = ({
  path,
  title,
  colorVisit,
  colorNoneVisit,
  currentPath,
  openSubNavigate,
  handleOpenSub,
  subNavList,
}) => {
  const isCurrentPath = currentPath.startsWith(`/${path}`);

  return (
    <span
      className={`${
        isCurrentPath ? colorVisit : colorNoneVisit
      } hover:cursor-pointer relative`}
      onClick={() => handleOpenSub(path)}
      onMouseEnter={() => handleOpenSub(path)}
      onMouseLeave={() => handleOpenSub("")}
    >
      {subNavList ? (
        <>
          {title} <FaAngleDown className="inline font-normal" />
          {openSubNavigate === path && subNavList && (
            <SubNavigate
              listSubNav={subNavList}
              colorVisit={colorVisit}
              colorNoneVisit={colorNoneVisit}
              currentPath={currentPath}
            />
          )}
        </>
      ) : (
        <Link to={`/${path}`}>{title}</Link>
      )}
    </span>
  );
};

export default NavLink;
