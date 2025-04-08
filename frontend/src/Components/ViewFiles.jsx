import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FileCard from "./FileCard";
import { toast } from "react-hot-toast";
import { ChevronLeft, Filter, Search, Book, Download } from "lucide-react";

const options = ["Notes(or)PPT", "Books", "Assignments", "PreviousYearPapers"];
const filters = ["More Upvotes", "Less Downvotes", "Alphabetical Title"];

function ViewFiles() {
  const { year, branch, subject } = useParams();
  const [files, setFiles] = useState([]);
  const [option, setOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      if (!option) return;

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/files?year=${year}&branch=${branch}&subject=${subject}&type=${option}`
        );
        const data = await response.json();

        if (response.ok) {
          setFiles(data);
          setFilteredFiles(data);
          toast.success(`${option} fetched successfully`);
        } else {
          console.error("Error fetching files:", data.error);
          toast.error("Error fetching files");
        }
      } catch (error) {
        toast.error("Error fetching files");
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [option, year, branch, subject]);

  // Apply search filter
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFiles(files);
      return;
    }

    const filtered = files.filter(
      (file) =>
        file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (file.description &&
          file.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredFiles(filtered);
  }, [searchQuery, files]);

  // Apply sorting based on selected filter
  useEffect(() => {
    if (!selectedFilter) return;

    const sorted = [...filteredFiles].sort((a, b) => {
      if (selectedFilter === "More Upvotes")
        return b.upvote.length - a.upvote.length;
      if (selectedFilter === "Less Downvotes")
        return a.downvote.length - b.downvote.length;
      if (selectedFilter === "Alphabetical Title")
        return a.title.localeCompare(b.title);
      return 0;
    });

    setFilteredFiles(sorted);
    toast.success(`${selectedFilter} filter applied`);
  }, [selectedFilter]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-100 relative">
      {/* Header */}
      <header className="w-full bg-[#800000] text-white shadow-md">
        <div className="container mx-auto py-3 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
              <img
                src="/nitjlogo.png"
                alt="NITJ Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">NITJ Study Resources</h1>
              <p className="text-xs text-yellow-200">
                National Institute of Technology, Jalandhar
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Subject Info */}
      <div className="relative">
        <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
        <div
          className="relative h-48 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url('/api/placeholder/1920/500')`,
            backgroundPosition: "center 30%",
          }}
        >
          <div className="absolute inset-0 bg-[#800000] opacity-50"></div>
          <div className="container mx-auto px-4 py-12 relative z-10 h-full flex flex-col justify-center">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="flex items-center mb-2">
                  <Book className="w-6 h-6 mr-2 text-white" />
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    {subject}
                  </h2>
                </div>
                <p className="text-lg text-yellow-200 flex items-center">
                  <span className="bg-white text-[#800000] px-2 py-1 rounded-lg text-sm font-bold mr-2">
                    {branch}
                  </span>
                  <span className="bg-white text-[#800000] px-2 py-1 rounded-lg text-sm font-bold">
                    Year {year}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto py-8 px-4">
        {/* Navigation Bar */}
        <div className="w-full max-w-5xl mx-auto flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#800000] text-white rounded-lg shadow-lg hover:bg-[#600000] transition duration-300 flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Subjects
          </button>

          <div className="ml-4 text-gray-600 text-sm flex items-center">
            <span
              onClick={() => navigate("/")}
              className="hover:text-[#800000] cursor-pointer"
            >
              Home
            </span>
            <span className="mx-2">›</span>
            <span
              onClick={() => navigate(-2)}
              className="hover:text-[#800000] cursor-pointer"
            >
              Year {year}
            </span>
            <span className="mx-2">›</span>
            <span
              onClick={() => navigate(-1)}
              className="hover:text-[#800000] cursor-pointer"
            >
              {branch}
            </span>
            <span className="mx-2">›</span>
            <span className="font-medium text-[#800000]">{subject}</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-5xl mx-auto mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search in files..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        {/* Option Selector */}
        <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg border-l-4 border-[#800000] mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <div className="w-6 h-6 bg-[#800000] rounded-full mr-2"></div>
            Select Resource Type
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {options.map((opt, index) => (
              <button
                key={index}
                className={`py-3 rounded-lg shadow-md font-medium transition duration-300 flex items-center justify-center
                  ${
                    option === opt
                      ? "bg-[#800000] text-white"
                      : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300 hover:from-gray-200 hover:to-gray-300"
                  }
                `}
                onClick={() => setOption(opt)}
              >
                {opt === "Notes(or)PPT" && <Book className="w-5 h-5 mr-2" />}
                {opt === "PreviousYearPapers" && (
                  <Download className="w-5 h-5 mr-2" />
                )}
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Section with Dropdown */}
        {filteredFiles.length > 0 && (
          <div className="w-full max-w-5xl mx-auto mb-6 flex justify-between items-center">
            <div className="text-gray-700 bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="font-semibold text-[#800000]">
                {filteredFiles.length}
              </span>{" "}
              {filteredFiles.length === 1 ? "resource" : "resources"} available
            </div>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-white px-4 py-2 rounded-lg text-gray-700 font-medium flex items-center gap-2 shadow-sm hover:bg-gray-50 transition"
              >
                <Filter className="w-4 h-4" />
                {selectedFilter || "Sort By"}
                <span className="ml-1">{dropdownOpen ? "▲" : "▼"}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-48 z-10">
                  {filters.map((filter, index) => (
                    <button
                      key={index}
                      className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                        selectedFilter === filter
                          ? "font-bold text-[#800000]"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedFilter(filter);
                        setDropdownOpen(false);
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-10 max-w-lg mx-auto mt-8">
            <div className="w-16 h-16 border-4 border-[#800000] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">
              Fetching resources...
            </p>
            <p className="text-gray-500 mt-2">
              Loading {option} for {subject}
            </p>
          </div>
        )}

        {/* No Files Available */}
        {!loading && files.length === 0 && option && (
          <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-10 max-w-lg mx-auto mt-8">
            <img
              src="/api/placeholder/100/100"
              alt="No files"
              className="w-24 h-24 opacity-50 mb-4"
            />
            <p className="text-2xl font-semibold text-gray-600">
              No resources available
            </p>
            <p className="text-gray-500 text-center mt-2">
              No {option} materials found for {subject}.
            </p>
            {/* <button
              onClick={() => navigate("/upload")}
              className="mt-6 px-6 py-2 bg-[#800000] text-white rounded-md hover:bg-[#600000] transition flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Contribute Resources
            </button> */}
          </div>
        )}

        {/* No search results */}
        {!loading && files.length > 0 && filteredFiles.length === 0 && (
          <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto mt-6">
            <p className="text-xl font-semibold text-gray-600">
              No matching resources found
            </p>
            <p className="text-gray-500 text-center mt-2">
              Try a different search term or clear your search
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Files Display */}
        {!loading && filteredFiles.length > 0 && (
          <div className="w-full max-w-5xl mx-auto space-y-4">
            {filteredFiles.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#800000] text-white py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-6 md:mb-0">
              <h4 className="font-bold text-lg mb-3">NITJ Study Resources</h4>
              <p className="text-sm text-gray-300 max-w-md">
                A platform dedicated to students of NIT Jalandhar to access and
                share study materials, past papers, and resources.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h5 className="font-bold mb-3 text-yellow-200">Quick Links</h5>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-yellow-200 transition">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-yellow-200 transition">
                      Upload
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-yellow-200 transition">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-yellow-200 transition">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold mb-3 text-yellow-200">Resources</h5>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-yellow-200 transition">
                      Notes
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-yellow-200 transition">
                      Past Papers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-yellow-200 transition">
                      Syllabus
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-yellow-200 transition">
                      References
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-700 text-center text-sm">
            <p>
              © {new Date().getFullYear()} NITJ Study Resources | National
              Institute of Technology, Jalandhar
            </p>
            <p className="text-xs text-yellow-200 mt-1">
              Developed by Students for Students
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ViewFiles;
