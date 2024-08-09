import { toast } from "react-toastify";
import { useAppSelector } from "../../../redux/hook";
import {
  downloadFileWithUrl,
  handleDownload,
} from "../../../utils/files/handleDownloadFile";
import { useEffect, useState } from "react";
import { IoMdDownload } from "react-icons/io";

interface ButtonDownloadFileProps {
  setIsSelecting: (isSelecting: boolean) => void;
  filesToDownload: string[];
  foldersToDownload: string[];
}

const ButtonDownloadFile: React.FC<ButtonDownloadFileProps> = ({
  setIsSelecting,
  filesToDownload,
  foldersToDownload,
}) => {
  const fileData = useAppSelector((state) => state.file);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  useEffect(() => {
    if (filesToDownload.length === 0 && foldersToDownload.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [filesToDownload, foldersToDownload]);
  const handleClickDownload = async () => {
    if (filesToDownload.length === 0 && foldersToDownload.length === 0) {
      toast.info("Please select file to download");
      return;
    }
    let urlDownload = "";
    let result;
    try {
      result = await handleDownload(
        filesToDownload,
        foldersToDownload,
        fileData.currentPathFile
      );

      if (result.response.status === 200) {
        urlDownload = result.response.data;
        downloadFileWithUrl(urlDownload, result.fileName);
        setIsSelecting(false)
        toast.success("Download completed!");
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
            ? "border-blue-500 text-white hover:bg-opacity-90 bg-blue-500"
            : "border-gnosis-gray-th2"
        }`}
      onClick={handleClickDownload}
    >
      <span>Download</span>
      <IoMdDownload className="h-[90%] w-auto shrink-0" />
    </button>
  );
};

export default ButtonDownloadFile;
