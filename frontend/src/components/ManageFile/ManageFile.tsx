import { useEffect, useState } from "react";
import { getListFileWithArrayPath } from "../../utils/files/handleGetFile";
import UploadDirectorySelector from "./components/UploadDirectorySelector";
import UploadFileSelector from "./components/UploadFileSelector";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { setFoldersAndFiles } from "../../redux/slices/fileSlice";
import UploadZipFile from "./components/UploadZipFile";
import ListFile from "./components/ListFile";
import ListFolder from "./components/ListFolder";
import NavigateFile from "./components/NavigateFile";
import ButtonDownloadFile from "./components/ButtonDownloadFile";
import ButtonDeleteFile from "./components/ButtonDeleteFile";

const ManageFile = () => {
  const dispatch = useAppDispatch();
  const fileData = useAppSelector((state) => state.file);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string[]>([]);

  useEffect(() => {
    const getFiles = async () => {
      try {
        const data = await getListFileWithArrayPath(fileData.currentPathFile);
        dispatch(setFoldersAndFiles(data));
      } catch (err) {
        console.log("Failed to fetch files");
      }
    };
    getFiles();
  }, [dispatch, fileData.currentPathFile]);

  const handleClickSelecting = () => {
    if (isSelecting) {
      setIsSelecting(false);
    } else {
      setIsSelecting(true);
    }
  };

  useEffect(() => {
    if (!isSelecting) {
      setSelectedFolder([]);
      setSelectedFile([]);
    }
  }, [isSelecting]);
  return (
    <div className="h-max min-h-[calc(100vh-85px)] w-screen bg-white">
      <div className="flex gap-2 p-4 flex-wrap">
        <UploadFileSelector />
        <UploadDirectorySelector />

        <button
          className={`py-1 px-4  border md:border-2   rounded-md font-semibold flex justify-center items-center  hover:bg-gnosis-primary-blue-th2 drop-shadow-lg
            ${
              isSelecting
                ? "bg-gnosis-primary-blue-th1 border-gnosis-primary-blue-th1"
                : "bg-gnosis-primary-white border-gnosis-gray-th2"
            }`}
          onClick={handleClickSelecting}
        >
          Select file to Download or Delete
        </button>
        {isSelecting && (
          <>
            <ButtonDownloadFile
              setIsSelecting={setIsSelecting}
              filesToDownload={selectedFile}
              foldersToDownload={selectedFolder}
            />
            <ButtonDeleteFile
              setIsSelecting={setIsSelecting}
              filesToDelete={selectedFile}
              foldersToDelete={selectedFolder}
            />
          </>
        )}

        <UploadZipFile />
      </div>

      <div className="p-6 ">
        <NavigateFile />
        {fileData.folders.length !== 0 && (
          <ListFolder
            folders={fileData.folders}
            isSelecting={isSelecting}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
          />
        )}
        {fileData.files.length !== 0 && (
          <ListFile
            files={fileData.files}
            isSelecting={isSelecting}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        )}
      </div>
    </div>
  );
};

export default ManageFile;
