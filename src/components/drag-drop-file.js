import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["FDV", "R"];

export default function DragDropFileUpload({extractAndSaveData}) {

  const handleChange = (file) => {
    extractAndSaveData(file)
  };

  return (
    <div>
      {/* <h1>Hello To Drag & Drop Files</h1> */}
      <FileUploader
        multiple={true}
        handleChange={handleChange}
        name="file"
        types={fileTypes}
      />
      {/* <p>{file ? `File name: ${file[0].name}` : "no files uploaded yet"}</p> */}
    </div>
  );
}
