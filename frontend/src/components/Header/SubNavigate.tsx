// SubNavigate.tsx
import { Link } from "react-router-dom";

interface ISubNavigate {
  path: string;
  title: string;
}

interface SubNavigateProps {
  listSubNav: ISubNavigate[];
  colorVisit: string;
  colorNoneVisit: string;
  currentPath: string;
}

const SubNavigate: React.FC<SubNavigateProps> = ({
  listSubNav,
  colorVisit,
  colorNoneVisit,
  currentPath,
}) => {
  return (
    <div className="absolute top-6 -left-6 h-max w-max px-6 pb-4 pt-10 flex flex-col gap-3 bg-gnosis-primary-black rounded-b-lg">
      {listSubNav.map((nav) => (
        <div key={nav.path}>
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

export default SubNavigate;
