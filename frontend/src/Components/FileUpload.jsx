import React, { useState } from "react";
import AWS from "aws-sdk";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FileUpload = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedOption1, setSelectedOption1] = useState(""); // Dropdown 1
  const [selectedOption2, setSelectedOption2] = useState(""); // Dropdown 2
  const [selectedOption3, setSelectedOption3] = useState(""); // Dropdown 3

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    // Check if file is larger than 25MB
    if (selectedFile && selectedFile.size > 25 * 1024 * 1024) {
      alert("File size must be less than 25MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
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
      .on("httpUploadProgress", (evt) => {
        setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
      })
      .send((err) => {
        if (err) {
          console.error(err);
          toast.error("Upload failed!");
        } else {
          toast.success("File uploaded successfully!");
          onClose(); // Close the component after upload
        }
        setUploading(false);
        setFile(null);
        setUploadProgress(0);
        setSelectedOption1("");
        setSelectedOption2("");
        setSelectedOption3(""); // Reset dropdowns
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative max-w-lg mx-auto p-8 bg-white shadow-2xl rounded-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
          aria-label="Close"
        >
          ✕
        </button>

        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Upload a PDF
        </h1>

        <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg mb-6 transition-all hover:border-blue-500 cursor-pointer">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full text-gray-700 text-sm cursor-pointer file:bg-gray-100 file:border file:border-gray-400 file:rounded-lg file:px-4 file:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-500 text-center mt-3">
            Drag and drop a PDF file, or click to select (Max size 25MB)
          </p>
        </div>

        {/* Dropdowns */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Select Option 1:</label>
          <select
            value={selectedOption1}
            onChange={(e) => setSelectedOption1(e.target.value)}
            className="w-full p-4 text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out hover:border-blue-500"
          >
            <option value="" disabled>Select an option</option>
            <option value="notes">Notes</option>
            <option value="syllabus">Syllabus</option>
            <option value="ppts">PPTs</option>
            <option value="previous_year_paper">Previous Year Paper</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Select Option 2:</label>
          <select
            value={selectedOption2}
            onChange={(e) => setSelectedOption2(e.target.value)}
            className="w-full p-4 text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out hover:border-blue-500"
          >
            <option value="" disabled>Select an option</option>
            <option value="notes">Notes</option>
            <option value="syllabus">Syllabus</option>
            <option value="ppts">PPTs</option>
            <option value="previous_year_paper">Previous Year Paper</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Select Option 3:</label>
          <select
            value={selectedOption3}
            onChange={(e) => setSelectedOption3(e.target.value)}
            className="w-full p-4 text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out hover:border-blue-500"
          >
            <option value="" disabled>Select an option</option>
            <option value="notes">Notes</option>
            <option value="syllabus">Syllabus</option>
            <option value="ppts">PPTs</option>
            <option value="previous_year_paper">Previous Year Paper</option>
          </select>
        </div>

        {/* New Upload Progress Bar */}
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={uploadFile}
          disabled={!file || uploading}
          className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition duration-300 ease-in-out 
            ${!file || uploading ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"}`}
        >
          {uploading ? `Uploading... ${uploadProgress}%` : "Upload File"}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
