import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import data from "../data.json";
const { createClient } = require("@supabase/supabase-js");
const FileUpload = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const uploadFile = async () => {
    if (!file) return alert("Please select a file to upload.");

    if (!selectedYear || !selectedBranch || !selectedSubject || !selectedType) {
      return alert("Please select all dropdown options.");
    }

    setUploading(true);

    const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

    // Construct the file path using dropdown selections as folders
    const filePath = `${selectedYear}/${selectedBranch}/${selectedSubject}/${selectedType}/${file.name}`;

    const { data, error } = await supabase.storage.from(process.env.REACT_APP_SUPABASE_BUCKET).upload(filePath, file);

    if (error) {
        console.error(error);
        toast.error("Upload failed!");
    } else {
        toast.success(`File uploaded successfully: ${file.name}`);
        onClose(); // Close the component after upload
    }
    
    setUploading(false);
    setFile(null);
    setUploadProgress(0);
    setSelectedYear("");
    setSelectedBranch("");
    setSelectedSubject("");
    setSelectedType("");
    // Reset dropdowns
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const getSubjects = () => {
    const yearData = data.years.find((y) => y.year === parseInt(selectedYear));
    const branchData = yearData?.branches.find(
      (b) => b.branch === selectedBranch
    );
    return branchData?.semesters[`Semester_${selectedSemester}`] || [];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
      <div className="relative max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg max-h-[90vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 mr-2"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="font-bold p-4 pl-0 text-xl">
          Enter the details of the Document:
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Year</label>
          <select
            className="w-full p-2 border-2 border-black-200 focus:border-blue-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {data.year.map((y, index) => (
              <option key={index} value={index + 1}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Branch</label>
          <select
            className="w-full p-2 border-2 border-black-200 focus:border-blue-500"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            {data.departments.map((d, index) => (
              <option key={index} value={d.abbreviation}>
                {d.fullForm}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Semester</label>
          <select
            className="w-full p-2 border-2 border-black-200 focus:border-blue-500"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            disabled={!selectedYear || !selectedBranch}
          >
            <option value="">Select Semester</option>
            {[2 * selectedYear - 1, 2 * selectedYear].map((sem, index) => (
              <option key={index} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Subject</label>
          <select
            className="w-full p-2 border-2 border-black-200 focus:border-blue-500"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedSemester}
          >
            <option value="">Select Subject</option>
            {getSubjects().map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Type</label>
          <select
            className="w-full p-2 border-2 border-black-200 focus:border-blue-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Select Type</option>
            {["Notes", "PPT", "Assignments", "PreviousYearPapers"].map(
              (type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-gray-700 text-center mb-4">
            Upload a PDF
          </h1>

          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg mb-4">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full text-gray-500 text-sm cursor-pointer focus:outline-none"
            />
            <p className="text-gray-400 text-center mt-2">
              Drag and drop a PDF file, or click to select
            </p>
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
              ${
                !file || uploading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {uploading ? `Uploading... ${uploadProgress}%` : "Upload File"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
