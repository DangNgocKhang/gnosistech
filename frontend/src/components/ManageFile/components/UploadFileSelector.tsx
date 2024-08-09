// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React from "react";
import { handleUpload } from "../../../utils/files/handleUploadFile";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { toast } from "react-toastify";
import { setFoldersAndFiles } from "../../../redux/slices/fileSlice";
import { getListFileWithArrayPath } from "../../../utils/files/handleGetFile";

const UploadFileSelector: React.FC = () => {
  const fileData = useAppSelector((state) => state.file);
  const dispatch = useAppDispatch();

  const handleFileSelection = async () => {
    try {
      // Type assertion to bypass TypeScript error
      const fileHandles = await window.showOpenFilePicker({
        multiple: true, // Allow multiple file selections
      });

      // Specify a type for the files array
      const files: {
        handle: FileSystemFileHandle;
        type: string;
        path: string;
      }[] = [];

      // Function to generate a unique file name
      const generateUniqueFileName = (name: string, existingNames: string[]): string => {
        let uniqueName = name;
        let counter = 1;
        while (existingNames.includes(uniqueName)) {
          uniqueName = `${name} - copy ${counter}`;
          counter++;
        }
        return uniqueName;
      };

      // Collect selected files and handle naming conflicts
      for (const fileHandle of fileHandles) {
        const file = await fileHandle.getFile();
        const originalName = file.name;

        // Check for duplicates and generate a unique name if needed
        const uniqueName = generateUniqueFileName(originalName, fileData.files.map(file => file));

        files.push({ handle: fileHandle, type: "file", path: uniqueName });
      }

      // Perform the file upload
      await handleUpload(files, fileData.currentPathFile);

      // After upload success → update list folder
      const data = await getListFileWithArrayPath(fileData.currentPathFile);
      dispatch(setFoldersAndFiles(data));
      toast.success("Upload successful");
    } catch (err) {
      console.error("Failed to select files", err);
    }
  };

  return (
    <button
      className="py-1 px-4 border md:border-2 border-gnosis-gray-th2 rounded-md font-semibold flex justify-center items-center bg-gnosis-primary-white hover:bg-gnosis-primary-blue-th2 drop-shadow-lg"
      onClick={handleFileSelection}
    >
      File upload
    </button>
  );
};

export default UploadFileSelector;
