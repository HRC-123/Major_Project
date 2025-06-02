import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import {
  Home,
  Upload,
  Link,
  Book,
  File,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Header from "./Header";

const FileUpload = ({ onClose }) => {
  const { googleLoginDetails } = useGlobalContext();
  const { email, name } = googleLoginDetails;
  const navigate = useNavigate();

  const MAX_FILE_SIZE_MB = 50;

  const isNitjEmail = (email) => {
    return email.endsWith("@nitj.ac.in");
  };

  const SERVER_URL = process.env.REACT_APP_SERVER_URL;


  useEffect(() => {
    if (!email || !isNitjEmail(email)) {
      toast.error("Please login with nitj email to upload",{id:"nitj-email-error"});
      navigate("/");
      console.log("The email is not from nitj.ac.in",{id:"nitj-email-error"});
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
  const [authorName, setAuthorName] = useState(name);
  const [authorEmail, setAuthorEmail] = useState(email);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file");
  
  // New states for exam year and exam type
  const [selectedExamYear, setSelectedExamYear] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");

  // New state for step navigation
  const [currentStep, setCurrentStep] = useState(1);

  const [departmentsData, setDepartmentsData] = useState([]);
  const [subjectsData, setSubjectsData] = useState([]);

  const yearData = [1, 2, 3, 4];
  
  // Generate exam years (current year - 10 to current year)
  const currentYear = new Date().getFullYear();
  const examYears = Array.from({ length: 11 }, (_, i) => currentYear - 10 + i);
  
  // Exam types
  const examTypes = ["Mid Term", "End Term"];

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await fetch(`${SERVER_URL}/branches`);
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
          `${SERVER_URL}/subjects?year=${selectedYear}&branch=${selectedBranch}&sem=${selectedSemester}`
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
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const sizeInMB = selectedFile.size / (1024 * 1024);

    if (sizeInMB > MAX_FILE_SIZE_MB) {
      toast.error("File size exceeds 50MB limit.", { id: "file-size-error" });
      setFile(null);
      event.target.value = ""; 
      return;
    }

    setFile(selectedFile);
    setFileUrl("");
  };

  const handleUrlChange = (event) => {
    setFileUrl(event.target.value);
    setFile(null);
  };

  const toggleUploadMethod = () => {
    setUploadMethod(uploadMethod === "file" ? "url" : "file");
    setFile(null);
    setFileUrl("");
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!title || !description) {
        toast.error("Please fill in all the required fields.");
        return;
      }
    } else if (currentStep === 2) {
      if (
        !selectedYear ||
        !selectedBranch ||
        !selectedSemester ||
        !selectedSubject ||
        !selectedType
      ) {
        toast.error("Please complete all selections.");
        return;
      }
      
      // Additional validation for PreviousYearPapers
      if (selectedType === "PreviousYearPapers" && (!selectedExamYear || !selectedExamType)) {
        toast.error("Please select exam year and exam type.");
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const uploadFile = async () => {
    if (!file && !fileUrl) {
      return toast.error("Please select a file or enter a URL to upload.");
    }
    if (
      !selectedYear ||
      !selectedBranch ||
      !selectedSubject ||
      !selectedType ||
      !authorName ||
      !title ||
      !description
    ) {
      return toast.error("Please fill in all the fields.");
    }
    
    // Validate exam year and type for PreviousYearPapers
    if (selectedType === "PreviousYearPapers" && (!selectedExamYear || !selectedExamType)) {
      return toast.error("Please select exam year and exam type.");
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

    const subjectObj = subjectsData.find(
      (sub) => sub.subject === selectedSubject
    );
    const subjectcode = subjectObj ? subjectObj.subjectcode : "";

    formData.append("subject", selectedSubject);
    formData.append("subjectcode", subjectcode);
    formData.append("type", selectedType);
    formData.append("author", authorName);
    formData.append("authorEmail", authorEmail);
    formData.append("title", title);
    formData.append("description", description);
    
    // Add exam year and type for PreviousYearPapers
    if (selectedType === "PreviousYearPapers") {
      formData.append("examYear", selectedExamYear);
      formData.append("examType", selectedExamType);
    }

    try {
      const response = await fetch(`${SERVER_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "File upload failed");
      }

      if (file) {
        toast.success(`File uploaded successfully: ${file.name}`,{id:"file-upload-success"});
      } else {
        toast.success("File imported successfully from URL",{id:"url-import-success"});
      }
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed!",{id:"upload-error"});
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-6">
        <div className="flex items-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${
                    currentStep === step
                      ? "bg-[#2C3E50] text-white"
                      : currentStep > step
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
              >
                {currentStep > step ? "✓" : step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 ${
                    currentStep > step ? "bg-green-500" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header hideContribute={true} />
      {/* Header */}
      <div className="bg-[#2C3E50] text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#2C3E50] rounded-lg hover:bg-gray-100 transition font-medium"
          >
            <Home size={18} />
            Back to Home
          </button>
          <h1 className="text-2xl font-bold">Upload Resource</h1>
          <button
            onClick={() => navigate("/uploaded")}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#2C3E50] rounded-lg hover:bg-gray-100 transition font-medium"
          >
            <Upload size={18} />
            Uploaded Resources
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 border-l-4 border-[#2C3E50]">
          {renderStepIndicator()}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="animation-fade-in">
              <h2 className="text-xl font-bold text-[#2C3E50] mb-6 flex items-center">
                <div className="w-6 h-6 bg-[#2C3E50] rounded-full mr-2"></div>
                Basic Information
              </h2>

              <div className="grid grid-cols-1 gap-y-4">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title*
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C3E50] focus:border-[#2C3E50]"
                    placeholder="Enter document title"
                  />
                </div>

                {/* Author Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                      placeholder="Enter author name"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author Email
                    </label>
                    <input
                      type="email"
                      value={authorEmail}
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                      placeholder="Enter author email"
                      readOnly
                    />
                  </div>
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description*
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C3E50] focus:border-[#2C3E50]"
                    placeholder="Enter a brief description of the document"
                    rows="3"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={nextStep}
                  className="px-6 py-2 rounded-md text-white font-medium flex items-center gap-2 bg-[#2C3E50] hover:bg-[#36597A]"
                >
                  Next Step <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Academic Information */}
          {currentStep === 2 && (
            <div className="animation-fade-in">
              <h2 className="text-xl font-bold text-[#2C3E50] mb-6 flex items-center">
                <div className="w-6 h-6 bg-[#2C3E50] rounded-full mr-2"></div>
                Academic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Year Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year*
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C3E50] focus:border-[#2C3E50]"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch*
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C3E50] focus:border-[#2C3E50]"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester*
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C3E50] focus:border-[#2C3E50]"
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    disabled={!selectedYear || !selectedBranch}
                  >
                    <option value="">Select Semester</option>
                    {selectedYear &&
                      [2 * selectedYear - 1, 2 * selectedYear].map(
                        (sem, index) => (
                          <option key={index} value={sem}>
                            {sem}
                          </option>
                        )
                      )}
                  </select>
                </div>

                {/* Subject Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject*
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C3E50] focus:border-[#2C3E50]"
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
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resource Type*
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      "Notes(or)PPT",
                      "Books",
                      "Assignments",
                      "PreviousYearPapers",
                    ].map((type) => (
                      <div
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`cursor-pointer p-3 border rounded-md flex flex-col items-center justify-center transition
                          ${
                            selectedType === type
                              ? "border-[#2C3E50] bg-[#f0f5fa] text-[#2C3E50]"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        {type === "Notes(or)PPT" && (
                          <Book size={24} className="mb-1" />
                        )}
                        {type === "Books" && (
                          <Book size={24} className="mb-1" />
                        )}
                        {type === "Assignments" && (
                          <File size={24} className="mb-1" />
                        )}
                        {type === "PreviousYearPapers" && (
                          <File size={24} className="mb-1" />
                        )}
                        <span className="text-sm font-medium">
                          {type === "Notes(or)PPT" ? "Notes/PPT" : type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional fields for PreviousYearPapers */}
                {selectedType === "PreviousYearPapers" && (
                  <div className="col-span-2 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Exam Year Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Exam Year*
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C3E50] focus:border-[#2C3E50]"
                          value={selectedExamYear}
                          onChange={(e) => setSelectedExamYear(e.target.value)}
                        >
                          <option value="">Select Exam Year</option>
                          {examYears.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Exam Type Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Exam Type*
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C3E50] focus:border-[#2C3E50]"
                          value={selectedExamType}
                          onChange={(e) => setSelectedExamType(e.target.value)}
                        >
                          <option value="">Select Exam Type</option>
                          {examTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 rounded-md text-[#2C3E50] border border-[#2C3E50] font-medium flex items-center gap-2 hover:bg-gray-50"
                >
                  <ChevronLeft size={18} /> Previous
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 rounded-md text-white font-medium flex items-center gap-2 bg-[#2C3E50] hover:bg-[#36597A]"
                >
                  Next Step <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: File Upload */}
          {currentStep === 3 && (
            <div className="animation-fade-in">
              <h2 className="text-xl font-bold text-[#2C3E50] mb-6 flex items-center">
                <div className="w-6 h-6 bg-[#2C3E50] rounded-full mr-2"></div>
                {uploadMethod === "file"
                  ? "Upload PDF File"
                  : "Import from URL"}
              </h2>

              <div className="flex justify-end mb-4">
                <button
                  onClick={toggleUploadMethod}
                  className="flex items-center gap-1 text-[#2C3E50] hover:text-[#36597A] font-medium text-sm"
                >
                  {uploadMethod === "file" ? (
                    <>
                      <Link size={16} /> Switch to URL import
                    </>
                  ) : (
                    <>
                      <Upload size={16} /> Switch to file upload
                    </>
                  )}
                </button>
              </div>

              {uploadMethod === "file" ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept=".pdf,.pptx,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <File size={36} className="text-[#2C3E50] mb-2" />
                    <span className="text-sm font-medium text-[#2C3E50]">
                      Choose PDF or PPTX or DOCX file
                    </span>
                    
                  </label>
                  {file && (
                    <div className="mt-4 text-sm text-gray-700">
                      Selected: <span className="font-medium">{file.name}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={fileUrl}
                    onChange={handleUrlChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C3E50] focus:border-[#2C3E50]"
                    placeholder="https://example.com/document.pdf"
                  />
                  <p className="text-xs text-gray-500">
                    Enter the direct URL to the PDF document
                  </p>
                </div>
              )}

              {uploading && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#2C3E50] h-2 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-center mt-1 text-gray-600">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 rounded-md text-[#2C3E50] border border-[#2C3E50] font-medium flex items-center gap-2 hover:bg-gray-50"
                >
                  <ChevronLeft size={18} /> Previous
                </button>
                <button
                  onClick={uploadFile}
                  disabled={(!file && !fileUrl) || uploading}
                  className={`px-6 py-2 rounded-md text-white font-medium flex items-center gap-2
                  ${
                    (!file && !fileUrl) || uploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#2C3E50] hover:bg-[#36597A]"
                  }`}
                >
                  <Upload size={18} />
                  {uploading ? "Uploading..." : "Upload Resource"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Note */}
      <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
        <p>
          Only PDF files are accepted. Resources will be reviewed before being
          made public.
        </p>
        <p className="text-xs text-[#2C3E50] mt-1">
          Developed by Students for Students | NITJ Study Resources
        </p>
      </div>
    </div>
  );
};

export default FileUpload;