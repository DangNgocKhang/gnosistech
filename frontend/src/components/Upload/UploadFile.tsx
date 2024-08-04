import React, { useState, useEffect } from "react";
import { GNOSIS_API_URL } from "../../config";
import { toast } from "react-toastify";
import {
  downloadFileWithUrl,
  handleFileDownload,
  handleZipFileDownload,
} from "../../utils/files/handleDownloadFile";
import { handleDeleteFile } from "../../utils/files/handleDeleteFile";
import { handleUploadFiles } from "../../utils/files/handleUploadFile";
import { useAppSelector } from "../../redux/hook";
import UploadZipFile from "./components/UploadZipFile";
import getAxiosClient from "../../utils/axios/axiosClient";

const UploadFile: React.FC = () => {
  const [fileList, setFileList] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const userData = useAppSelector((state) => state.user);

  /*----------------------------------------------------- 
  ---------- Get all files uploaded by user with user id
  ----------------------------------------------------- */
  const fetchUserFiles = async () => {
    try {
      const axiosClient = getAxiosClient();
      const response = await axiosClient.get(
        `${GNOSIS_API_URL}/upload/list_files/`
      );
      if (response.status === 200) {
        setFileList(response.data.files);
      }
    } catch (error) {
      setFileList([]);
    }
  };

  /*----------------------------------------------------- 
  ---------- Reset seclect after download/delete
  ----------------------------------------------------- */
  const resetSelectedFile = () => {
    setSelectedFiles([]);
  };

  /*----------------------------------------------------- 
  ---------- Select file or multiple files to download
  ----------------------------------------------------- */
  const handleFileSelect = (filename: string) => {
    setSelectedFiles((prevSelectedFiles) => {
      const newSelectedFiles = [...prevSelectedFiles];
      if (newSelectedFiles.includes(filename)) {
        return newSelectedFiles.filter((file) => file !== filename);
      } else {
        return [...newSelectedFiles, filename];
      }
    });
  };
  /*----------------------------------------------------- 
  ---------- Select file or multiple files to upload/delete
  ----------------------------------------------------- */
  const handleSelectFileToUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFiles(event.target.files);
  };
  /*----------------------------------------------------- 
  --------------- DELETE FILE ---------------
  ------------------------------------------
  ---------- Delete file selected
  ----------------------------------------------------- */
  const handleDelete = async () => {
    if (selectedFiles.length === 0) {
      toast.info("Please select a file to delete.");
      return;
    }
    try {
      const result = await handleDeleteFile(userData.id, selectedFiles);
      if (result === 200) {
        toast.success("Files deleted successfully!");
        resetSelectedFile();
        fetchUserFiles();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  /*----------------------------------------------------- 
  --------------- DOWNLOAD FILE ---------------
  ------------------------------------------
  ---------- If only one file → download file.
  ---------- If multiple files → download zip file.
  ----------------------------------------------------- */
  const handleDownloadSelected = async () => {
    if (selectedFiles.length === 0) {
      toast.info("Please select a file to download.");
      return;
    }
    let urlDownload = "";
    let result;
    try {
      if (selectedFiles.length === 1) {
        result = await handleFileDownload(selectedFiles[0]);
      } else {
        result = await handleZipFileDownload(selectedFiles);
      }
      if (result.response.status === 200) {
        urlDownload = result.response.data;
        downloadFileWithUrl(urlDownload, result.fileName);
        toast.success("Download completed!");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
    resetSelectedFile();
  };
  /*----------------------------------------------------- 
  --------------- UPLOAD FILE ---------------
  ------------------------------------------
  ---------- Upload file or multiple files
  ----------------------------------------------------- */

  const handleUpload = async () => {
    if (!files || !userData.id) {
      toast.error("Please select files.");
      return;
    }

    try {
      const result = await handleUploadFiles(files);
      if (result === 200) {
        setFiles(null);
        fetchUserFiles();
        toast.success("Files uploaded successfully!");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (userData.status) {
      fetchUserFiles();
    } else {
      setFileList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">File Upload and Download</h1>
        <input
          type="file"
          multiple
          onChange={handleSelectFileToUpload}
          className="mb-4"
        />
        <button
          onClick={handleUpload}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Upload
        </button>
        <h2 className="text-xl font-semibold mb-2">User Files</h2>
        {fileList.length > 0 ? (
          <ul className="list-disc mb-4">
            {fileList.map((file) => (
              <li key={file} className="mb-1 font-semibold text-2xl">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file)}
                    onChange={() => handleFileSelect(file)}
                    className="mr-2"
                  />
                  {file}
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-red-500">No files found for this user.</p>
        )}
        <div className="h-max w-full flex justify-center items-center gap-4">
          <button
            onClick={handleDownloadSelected}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Download Selected Files
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete Selected Files
          </button>
        </div>
      </div>
      <UploadZipFile />
    </div>
  );
};

export default UploadFile;
