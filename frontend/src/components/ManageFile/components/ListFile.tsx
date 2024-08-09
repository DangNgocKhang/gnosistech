import { BsFillFileEarmarkFill } from "react-icons/bs";
import { IoIosCheckbox } from "react-icons/io";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";

interface ListFileProps {
  files: string[];
  isSelecting: boolean;
  selectedFile: string[];
  setSelectedFile: (selectedFile: string[]) => void;
}

const ListFile: React.FC<ListFileProps> = ({
  files,
  isSelecting,
  selectedFile,
  setSelectedFile,
}) => {
  const handleClickFile = (fileName: string) => {
    if (isSelecting) {
      if (selectedFile.includes(fileName)) {
        const newList: string[] = selectedFile.filter(
          (fileName) => fileName !== fileName
        );
        setSelectedFile(newList);
      } else {
        const newList: string[] = [...selectedFile, fileName];
        setSelectedFile(newList);
      }
    }
  };
  return (
    <div>
      <h2 className="font-semibold mb-2">Files</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {files.map((fileName: string) => {
          return (
            <li key={fileName} className="border rounded-lg overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-4 text-left font-semibold bg-gnosis-primary-blue-th2 hover:bg-gnosis-primary-blue-th1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => handleClickFile(fileName)}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <BsFillFileEarmarkFill className="h-6 w-auto mr-5 text-gnosis-gray-th2 shrink-0" />
                  <span className="truncate whitespace-nowrap">{fileName}</span>
                </div>
                {isSelecting &&
                  (selectedFile.includes(fileName) ? (
                    <IoIosCheckbox className="h-5 w-auto text-gnosis-gray-th2 shrink-0" />
                  ) : (
                    <MdOutlineCheckBoxOutlineBlank className="h-5 w-auto text-gnosis-gray-th2 shrink-0" />
                  ))}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ListFile;
