import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import { Home, Upload, Link, Book, File } from "lucide-react";

const FileUpload = ({ onClose }) => {
  const { googleLoginDetails } = useGlobalContext();
  const { email, name } = googleLoginDetails;
  const navigate = useNavigate();

  const isNitjEmail = (email) => {
    return email.endsWith("@nitj.ac.in");
  };

  useEffect(() => {
    if (!email || !isNitjEmail(email)) {
      toast.error("Please login with nitj email to upload");
      navigate("/");
      console.log("The email is not from nitj.ac.in");
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

  const [departmentsData, setDepartmentsData] = useState([]);
  const [subjectsData, setSubjectsData] = useState([]);

  const yearData = [1, 2, 3, 4];

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
    setFile(null);
    setFileUrl("");
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
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed!");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#800000] text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#800000] rounded-lg hover:bg-gray-100 transition font-medium"
          >
            <Home size={18} />
            Back to Home
          </button>
          <h1 className="text-2xl font-bold">Upload Resource</h1>
          <div className="w-32"></div> {/* Empty div for spacing */}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 border-l-4 border-[#800000]">
          <h2 className="text-xl font-bold text-[#800000] mb-6 flex items-center">
            <div className="w-6 h-6 bg-[#800000] rounded-full mr-2"></div>
            Resource Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Title Input */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title*
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#800000] focus:border-[#800000]"
                placeholder="Enter document title"
              />
            </div>

            {/* Author Name Input */}
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

            {/* Author Email Input */}
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

            {/* Description Input */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#800000] focus:border-[#800000]"
                placeholder="Enter a brief description of the document"
                rows="3"
              />
            </div>

            {/* Year Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year*
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#800000] focus:border-[#800000]"
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
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#800000] focus:border-[#800000]"
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
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#800000] focus:border-[#800000]"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                disabled={!selectedYear || !selectedBranch}
              >
                <option value="">Select Semester</option>
                {selectedYear &&
                  [2 * selectedYear - 1, 2 * selectedYear].map((sem, index) => (
                    <option key={index} value={sem}>
                      {sem}
                    </option>
                  ))}
              </select>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject*
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#800000] focus:border-[#800000]"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resource Type*
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#800000] focus:border-[#800000]"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Select Type</option>
                {[
                  "Notes(or)PPT",
                  "Books",
                  "Assignments",
                  "PreviousYearPapers",
                ].map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Upload Method Toggle */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#800000] flex items-center">
                <div className="w-5 h-5 bg-[#800000] rounded-full mr-2"></div>
                {uploadMethod === "file"
                  ? "Upload PDF File"
                  : "Import from URL"}
              </h3>
              <button
                onClick={toggleUploadMethod}
                className="flex items-center gap-1 text-[#800000] hover:text-[#600000] font-medium text-sm"
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
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <File size={36} className="text-[#800000] mb-2" />
                  <span className="text-sm font-medium text-[#800000]">
                    Choose PDF file
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    or drag and drop here
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000]"
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
                    className="bg-[#800000] h-2 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-center mt-1 text-gray-600">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={uploadFile}
              disabled={(!file && !fileUrl) || uploading}
              className={`px-6 py-2 rounded-md text-white font-medium flex items-center gap-2
              ${
                (!file && !fileUrl) || uploading
                  ? "bg-[#cc9999] cursor-not-allowed"
                  : "bg-[#800000] hover:bg-[#600000]"
              }`}
            >
              <Upload size={18} />
              {uploading ? "Uploading..." : "Upload Resource"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
        <p>
          Only PDF files are accepted. Resources will be reviewed before being
          made public.
        </p>
        <p className="text-xs text-[#800000] mt-1">
          Developed by Students for Students | NITJ Study Resources
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
