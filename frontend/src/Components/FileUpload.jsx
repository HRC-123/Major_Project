import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

const FileUpload = ({ onClose }) => {
  const { googleLoginDetails } = useGlobalContext();
  const { email } = googleLoginDetails;
  const navigate = useNavigate();
  
  const isNitjEmail = (email) => {
    return email.endsWith("@nitj.ac.in");
  }
  
  useEffect(() => {
    if (!email || !isNitjEmail(email)) {
      navigate('/');
      console.log("The email is not from nitj.ac.in")
    }
  }, []);
  
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file"); // New state for tracking upload method

  const [departmentsData, setDepartmentsData] = useState([]);
  const [subjectsData, setSubjectsData] = useState([]);

  const yearData=[1,2,3,4]
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await fetch("http://localhost:5000/branches");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDepartmentsData(data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    }
    fetchDepartments();
  }, []);
  
  useEffect(() => {
    async function getSubjects() {
      if (!selectedYear || !selectedBranch || !selectedSemester) return;
      try {
        const response = await fetch(
          `http://localhost:5000/subjects?year=${selectedYear}&branch=${selectedBranch}&sem=${selectedSemester}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSubjectsData(data);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    }
    getSubjects();
  }, [selectedYear, selectedBranch, selectedSemester]);
    
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileUrl("");
  };
  
  const handleUrlChange = (event) => {
    setFileUrl(event.target.value);
    setFile(null);
  };

  const toggleUploadMethod = () => {
    setUploadMethod(uploadMethod === "file" ? "url" : "file");
    // Clear both file and URL when switching
    setFile(null);
    setFileUrl("");
  };

  const uploadFile = async () => {
    if (!file && !fileUrl) {
      return alert("Please select a file or enter a URL to upload.");
    }
    if (!selectedYear || !selectedBranch || !selectedSubject || !selectedType || !authorName || !title || !description) {
      return alert("Please fill in all the fields.");
    }
  
    setUploading(true);
  
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else {
      formData.append("fileUrl", fileUrl);
    }
    formData.append("year", selectedYear);
    formData.append("branch", selectedBranch);
    formData.append("semester", selectedSemester);
  
    const subjectObj = subjectsData.find((sub) => sub.subject === selectedSubject);
    const subjectcode = subjectObj ? subjectObj.subjectcode : "";
  
    formData.append("subject", selectedSubject);
    formData.append("subjectcode", subjectcode);
    formData.append("type", selectedType);
    formData.append("author", authorName);
    formData.append("title", title);
    formData.append("description", description);
  
    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "File upload failed");
      }
  
      if (file) {
        toast.success(`File uploaded successfully: ${file.name}`);
      } else {
        toast.success("File imported successfully from URL");
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed!");
    } finally {
      setUploading(false);
      setFile(null);
      navigate("/");
    }
  };
  
  return (
    <div className="flex flex-col px-36 py-16 gap-4">
      
      <div className="font-bold p-4 pl-0 text-xl">
          Enter the details of the Document:
        </div>

        {/* Title Input */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border-2 border-black-200 focus:border-blue-500"
            placeholder="Enter document title"
          />
        </div>

        {/* Author Name Input */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Author Name</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full p-2 border-2 border-black-200 focus:border-blue-500"
            placeholder="Enter author name"
          />
        </div>

        {/* Description Input */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border-2 border-black-200 focus:border-blue-500"
            placeholder="Enter a brief description of the document"
          />
        </div>

        {/* Year Selection */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Year</label>
          <select
            className="w-full p-2 border-2 border-black-200 focus:border-blue-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Select Year</option>
             {yearData.map((y, index) => (
               <option key={index} value={index + 1}>
                 {y}
               </option>
            ))}
          </select>
        </div>

        {/* Branch Selection */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Branch</label>
          <select
            className="w-full p-2 border-2 border-black-200 focus:border-blue-500"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            {departmentsData.map((d, index) => (
              <option key={index} value={d.branch}>
                {d.abbreviation}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Selection */}
        <div className="flex flex-col gap-1">
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

        {/* Subject Selection */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Subject</label>
          <select
            className="w-full p-2 border-2 border-black-200 focus:border-blue-500"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedSemester}
          >
            <option value="">Select Subject</option>
            {subjectsData.map((sub, index) => (
              <option key={index} value={sub.subject}>
                {sub.subject} ({sub.subjectcode})
              </option>
            ))}
          </select>

        </div>

        {/* Type Selection */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Type</label>
          <select
            className="w-full p-2 border-2 border-black-200 focus:border-blue-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Select Type</option>
            {["Notes(or)PPT", "Books", "Assignments", "PreviousYearPapers"].map(
              (type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              )
            )}
          </select>
        </div>
      
      {/* File Upload Section with Toggle */}
      <div>
        <div className="flex flex-col mb-4">
          <button
            onClick={toggleUploadMethod}
            className="text-blue-500 hover:text-blue-600 font-medium max-w-40"
          >
            Switch to {uploadMethod === "file" ? "URL import" : "file upload"}
          </button>
          <h1 className="text-2xl font-semibold text-gray-700">
            {uploadMethod === "file" ? "Upload a PDF" : "Import via URL"}
          </h1>
        </div>

        {uploadMethod === "file" ? (
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
        ) : (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={fileUrl}
              onChange={handleUrlChange}
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
              placeholder="Enter URL of the document"
            />
          </div>
        )}

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
          disabled={(!file && !fileUrl) || uploading}
          className={`w-full py-2 px-4 mt-4 rounded-lg text-white font-semibold 
          ${(!file && !fileUrl) || uploading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {uploading ? `Uploading... ${uploadProgress}%` : "Upload File"}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;