// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React from "react";
import { handleUpload } from "../../../utils/files/handleUploadFile";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { toast } from "react-toastify";
import { setFoldersAndFiles } from "../../../redux/slices/fileSlice";
import { getListFileWithArrayPath } from "../../../utils/files/handleGetFile";

const UploadDirectorySelector: React.FC = () => {
  const fetchDirectoryContents = async (
    dirHandle: FileSystemDirectoryHandle,
    parentPath: string = ""
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contents: any[] = [];

    // Include the directory itself in the contents
    contents.push({ handle: dirHandle, type: "directory", path: parentPath });

    for await (const entry of dirHandle.values()) {
      const entryPath = `${parentPath}${entry.name}${
        entry.kind === "directory" ? "/" : ""
      }`;

      if (entry.kind === "file") {
        contents.push({ handle: entry, type: "file", path: entryPath });
      } else if (entry.kind === "directory") {
        contents.push({ handle: entry, type: "directory", path: entryPath });

        // Recursively fetch contents of the subdirectory
        const subDirectoryContents = await fetchDirectoryContents(
          entry,
          entryPath
        );
        contents.push(...subDirectoryContents);
      }
    }

    return contents;
  };

  const fileData = useAppSelector((state) => state.file);
  const dispatch = useAppDispatch();

  const handleDirectorySelection = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      let directoryName = directoryHandle.name;

      // Check if directory name exists in fileData.folders
      if (fileData.folders.includes(directoryName)) {
        let newDirectoryName = directoryName + " - copy";
        let counter = 1;

        // Find a unique name by appending a counter
        while (fileData.folders.includes(newDirectoryName)) {
          counter += 1;
          newDirectoryName = `${directoryName} - copy ${counter}`;
        }

        directoryName = newDirectoryName;
      }

      const directoryContents = await fetchDirectoryContents(
        directoryHandle,
        directoryName + "/"
      );
      await handleUpload(directoryContents, fileData.currentPathFile);

      // After upload success → update list folder
      const data = await getListFileWithArrayPath(fileData.currentPathFile);
      dispatch(setFoldersAndFiles(data));
      toast.success("Upload successful");
    } catch (err) {
      console.error("Failed to select directory", err);
    }
  };

  return (
    <button
      className="py-1 px-4 border md:border-2 border-gnosis-gray-th2 rounded-md font-semibold flex justify-center items-center bg-gnosis-primary-white hover:bg-gnosis-primary-blue-th2 drop-shadow-lg"
      onClick={handleDirectorySelection}
    >
      Folder upload
    </button>
  );
};

export default UploadDirectorySelector;
