import React, { useState } from 'react';
import AWS from 'aws-sdk';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return alert("Please select a file to upload.");

    setUploading(true);

    const s3 = new AWS.S3({
      accessKeyId: process.env.REACT_APP_UPLOAD_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_UPLOAD_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_REGION,
    });

    const params = {
      Bucket: process.env.REACT_APP_BUCKET_NAME,
      Key: file.name,
      Body: file,
      ContentType: file.type,
    };

    s3.upload(params)
      .on('httpUploadProgress', (evt) => {
        setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
      })
      .send((err) => {
        if (err) console.error(err);
        setUploading(false);
        setFile(null);
        setUploadProgress(0);
      });
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-semibold text-gray-700 text-center mb-4">Upload a PDF</h1>
      
      <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg mb-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full text-gray-500 text-sm cursor-pointer focus:outline-none"
        />
        <p className="text-gray-400 text-center mt-2">Drag and drop a PDF file, or click to select</p>
      </div>

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <button
        onClick={uploadFile}
        disabled={!file || uploading}
        className={`w-full py-2 px-4 mt-4 rounded-lg text-white font-semibold 
          ${!file || uploading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
      >
        {uploading ? `Uploading... ${uploadProgress}%` : "Upload File"}
      </button>
    </div>
  );
};

export default FileUpload;
