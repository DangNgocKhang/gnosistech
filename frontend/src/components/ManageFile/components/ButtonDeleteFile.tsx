import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";

import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { handleDelete } from "../../../utils/files/handleDeleteFile";
import { getListFileWithArrayPath } from "../../../utils/files/handleGetFile";
import { setFoldersAndFiles } from "../../../redux/slices/fileSlice";

interface ButtonDeleteFileProps {
  setIsSelecting: (isSelecting: boolean) => void;
  filesToDelete: string[];
  foldersToDelete: string[];
}

const ButtonDeleteFile: React.FC<ButtonDeleteFileProps> = ({
  setIsSelecting,
  filesToDelete,
  foldersToDelete,
}) => {
  const fileData = useAppSelector((state) => state.file);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (filesToDelete.length === 0 && foldersToDelete.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [filesToDelete, foldersToDelete]);

  const handleClickDelete = async () => {
    if (filesToDelete.length === 0 && foldersToDelete.length === 0) {
      toast.info("Please select file to delete");
      return;
    }
    try {
      const result = await handleDelete(
        filesToDelete,
        foldersToDelete,
        fileData.currentPathFile
      );

      if (result.status === 200) {
        // After upload delete → update list folder
        const data = await getListFileWithArrayPath(fileData.currentPathFile);
        dispatch(setFoldersAndFiles(data));
        setIsSelecting(false);
        toast.success("Delete completed!");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <button
      className={`py-1 px-4 border md:border-2  rounded-md font-semibold flex justify-between items-center drop-shadow-lg
        ${
          !isEmpty
            ? "border-red-500 text-white hover:bg-opacity-90 bg-red-500"
            : "border-gnosis-gray-th2"
        }`}
      onClick={handleClickDelete}
    >
      <span>Delete</span>
      <MdDelete className=" h-[90%] w-auto shrink-0" />
    </button>
  );
};

export default ButtonDeleteFile;
