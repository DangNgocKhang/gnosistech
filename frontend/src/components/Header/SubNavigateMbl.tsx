import { Link } from "react-router-dom";

interface ISubNavigate {
  path: string;
  title: string;
}

interface SubNavigateMblProps {
  listSubNav: ISubNavigate[];
  colorVisit: string;
  colorNoneVisit: string;
  currentPath: string;
}

const SubNavigateMbl: React.FC<SubNavigateMblProps> = ({
  listSubNav,
  colorVisit,
  colorNoneVisit,
  currentPath,
}) => {
  return (
    <div className="h-max w-max px-6 pt-3 flex flex-col gap-3 ">
      {listSubNav.map((nav) => (
        <div key={nav.path} onClick={(event)=>{event.stopPropagation()}}>
          <Link to={`/${nav.path}`}>
            <span
              className={`${
                currentPath === `/${nav.path}` ? colorVisit : colorNoneVisit
              } `}
            >
              {nav.title}
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SubNavigateMbl;
