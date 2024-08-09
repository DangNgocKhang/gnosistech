import { useState, useRef } from "react";
import { GrDocumentZip } from "react-icons/gr";
import { toast } from "react-toastify";
import { assets } from "../../../assets/assets";
import { handleUploadCheckZipFiles } from "../../../utils/files/handleUploadFile";

const UploadZipFile = () => {
  const [isCheckingZipFile, setIsCheckingZipFile] = useState<boolean>(false);

  const fileZipInputRef = useRef<HTMLInputElement>(null);

  const handleZipFileUpload = () => {
    fileZipInputRef.current?.click();
  };

  const handleSelectZipFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    try {
      if (file) {
        toast.info(
          "Your file is being checked. The system will alert you when it is done.",
          { autoClose: 5000 }
        );
        setIsCheckingZipFile(true);
        const result = await handleUploadCheckZipFiles(file);
        if (result.status === 200) {
          toast.success("Files check successfully!");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      event.target.value = "";
      setIsCheckingZipFile(false);
    }
  };
  return (
    <div className="flex items-center justify-center">
      <button
        disabled={isCheckingZipFile}
        type="button"
        className={`py-1 px-4  flex items-center font-semibold border md:border-2 border-purple-500 bg-white text-purple-500 rounded-md drop-shadow-lg ${
          !isCheckingZipFile
            ? "hover:bg-purple-500 hover:text-white transition-colors"
            : ""
        } `}
        onClick={handleZipFileUpload}
      >
        {!isCheckingZipFile ? (
          <>
            Upload ZIP File To Check <GrDocumentZip className="ml-2" />
          </>
        ) : (
          <>
            Checking ZIP File...
            <img
              loading="lazy"
              src={assets.loadingDoubleRing}
              alt="loadingDoubleRing"
              title="loadingDoubleRing"
              className="h-12 ml-2"
            />
          </>
        )}
      </button>
      <input
        type="file"
        ref={fileZipInputRef}
        style={{ display: "none" }}
        accept=".zip"
        onChange={handleSelectZipFileChange}
      />
    </div>
  );
};

export default UploadZipFile;
