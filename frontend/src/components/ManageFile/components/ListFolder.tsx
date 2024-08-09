import { MdFolder, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { IoIosCheckbox } from "react-icons/io"; // Import IoIosCheckbox
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { setCurrentPath } from "../../../redux/slices/fileSlice";

interface ListFolderProps {
  folders: string[];
  isSelecting: boolean;
  selectedFolder: string[];
  setSelectedFolder: (selectedFolder: string[]) => void;
}

const ListFolder: React.FC<ListFolderProps> = ({
  folders,
  isSelecting,
  selectedFolder,
  setSelectedFolder,
}) => {
  const dispatch = useAppDispatch();
  const fileData = useAppSelector((state) => state.file);

  const handleClickFolder = (folderName: string) => {
    if (!isSelecting) {
      const newPath = [...fileData.currentPathFile, folderName];
      dispatch(setCurrentPath(newPath));
    } else {
      if (selectedFolder.includes(folderName)) {
        const newList: string[] = selectedFolder.filter(
          (folder) => folder !== folderName
        );
        setSelectedFolder(newList);
      } else {
        const newList: string[] = [...selectedFolder, folderName];
        setSelectedFolder(newList);
      }
    }
  };

  return (
    <div>
      <h2 className="font-semibold mb-2">Folders</h2>
      <ul className="grid grid-cols- sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {folders.map((folderName: string) => (
          <li key={folderName} className="border rounded-lg overflow-hidden">
            <button
              className="w-full flex justify-between items-center p-4 text-left font-semibold bg-gnosis-primary-blue-th2 hover:bg-gnosis-primary-blue-th1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => handleClickFolder(folderName)}
            >
              <div className="flex items-center flex-1 min-w-0">
                <MdFolder className="h-6 w-auto mr-5 text-gnosis-gray-th2 shrink-0" />
                <span className="truncate whitespace-nowrap">{folderName}</span>
              </div>
              {isSelecting &&
                (selectedFolder.includes(folderName) ? (
                  <IoIosCheckbox className="h-5 w-auto text-gnosis-gray-th2 shrink-0" />
                ) : (
                  <MdOutlineCheckBoxOutlineBlank className="h-5 w-auto text-gnosis-gray-th2 shrink-0" />
                ))}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListFolder;
