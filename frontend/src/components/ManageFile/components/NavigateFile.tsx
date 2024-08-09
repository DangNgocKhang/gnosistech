import { MdFolder, MdKeyboardArrowRight, MdMoreHoriz } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { setCurrentPath } from "../../../redux/slices/fileSlice";
import { useEffect, useState } from "react";
import usePersistState from "../../../hook/usePersistState";

interface NavigateItem {
  filename: string;
  index: number;
}

const NavigateFile = () => {
  const NUM_DISPLAY_NAVIGATE = 2;
  const dispatch = useAppDispatch();
  const fileData = useAppSelector((state) => state.file);

  const [currentPath, setCurrentPathState] = usePersistState<string[]>(
    "currentpath",
    []
  );

  const handleClickPathNavigate = (index: number) => {
    const pathNavigate = fileData.currentPathFile.slice(0, index + 1);
    dispatch(setCurrentPath(pathNavigate));
    setCurrentPathState(pathNavigate); 
  };

  const [displayNavigate, setDisplayNavigate] = useState<NavigateItem[]>([]);
  const [hiddenNavigate, setHiddenNavigate] = useState<NavigateItem[]>([]);
  const [showHiddenNav, setShowHiddenNav] = useState(false);

  useEffect(() => {
    if (fileData.currentPathFile.length === 0 && currentPath.length > 0) {
      dispatch(setCurrentPath(currentPath));
    }
  }, [dispatch, fileData.currentPathFile.length, currentPath]);

  useEffect(() => {
    const listPathCurrent = fileData.currentPathFile;

    if (listPathCurrent.length > NUM_DISPLAY_NAVIGATE) {
      const newDisplayNavigate = listPathCurrent
        .slice(listPathCurrent.length - NUM_DISPLAY_NAVIGATE)
        .map((filename, index) => ({
          filename,
          index: listPathCurrent.length - NUM_DISPLAY_NAVIGATE + index,
        }));

      const newHiddenNavigate = listPathCurrent
        .slice(0, listPathCurrent.length - NUM_DISPLAY_NAVIGATE)
        .map((filename, index) => ({
          filename,
          index,
        }));

      setDisplayNavigate(newDisplayNavigate);
      setHiddenNavigate(newHiddenNavigate);
    } else {
      const allItems = listPathCurrent.map((filename, index) => ({
        filename,
        index,
      }));
      setDisplayNavigate(allItems);
      setHiddenNavigate([]);
    }

    // Persist the current path whenever it changes
    setCurrentPathState(listPathCurrent);

  }, [fileData.currentPathFile, setCurrentPathState]);

  return (
    <div className="h-10 flex gap-4 text-2xl relative -left-5 mb-4">
      <button
        className="bg-gnosis-primary-white hover:bg-gnosis-primary-blue-th2 rounded-full py-2 px-4 flex justify-center items-center"
        onClick={() => {
          dispatch(setCurrentPath([]));
          setCurrentPathState([]); // Clear persisted state
        }}
      >
        Home
      </button>

      {hiddenNavigate.length > 0 && (
        <div className="flex items-center gap-4 relative">
          <MdKeyboardArrowRight />
          <MdMoreHoriz
            className="cursor-pointer hover:bg-gnosis-primary-blue-th2 p-2 h-full w-auto rounded-full"
            onClick={() => setShowHiddenNav(!showHiddenNav)}
          />

          {showHiddenNav && (
            <div className="w-[300px] max-h-[50vh] overflow-y-auto flex flex-col absolute top-10 left-0 bg-gnosis-primary-white drop-shadow-lg shadow-lg rounded-lg p-2 z-50">
              {hiddenNavigate.map((nav: NavigateItem) => (
                <button
                  key={nav.index}
                  className="text-base bg-gnosis-primary-white hover:bg-gnosis-primary-blue-th2 rounded-lg py-2 px-4 flex justify-start items-center mb-2"
                  onClick={() => {
                    handleClickPathNavigate(nav.index);
                    setShowHiddenNav(false);
                  }}
                >
                  <MdFolder className="h-6 w-auto mr-5 text-gnosis-gray-th2 shrink-0" />

                  <span className="truncate whitespace-nowrap">
                    {nav.filename}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {displayNavigate.map((nav: NavigateItem) => (
        <div key={nav.index} className="flex items-center gap-4">
          <MdKeyboardArrowRight />
          <button
            className="bg-gnosis-primary-white hover:bg-gnosis-primary-blue-th2 rounded-full py-2 px-4 flex justify-center items-center"
            onClick={() => {
              handleClickPathNavigate(nav.index);
            }}
          >
            {nav.filename}
          </button>
        </div>
      ))}
    </div>
  );
};

export default NavigateFile;
