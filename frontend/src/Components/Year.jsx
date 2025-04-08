import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import data from "../data.json";
import FileUpload from "./FileUpload";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useGlobalContext } from "../context/GlobalContext";
import { toast } from "react-hot-toast";
import {
  LogOut,
  Search,
  Upload,
  Book,
  ExternalLink,
  Download,
} from "lucide-react";

const Year = () => {
  const { googleLoginDetails, setGoogleLoginDetails } = useGlobalContext();
  const { year } = data;
  const navigate = useNavigate();

  const [yearIndex, setYearIndex] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [documentsLength, setDocumentsLength] = useState(0);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const searchContainerRef = useRef(null);

  // Hide search results when clicking outside the search container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch department data on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:5000/branches");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const fetchedData = await response.json();
        setDepartmentsData(fetchedData);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Error fetching documents");
      }


      try {
        const response = await fetch(
          `http://localhost:5000/api/files?year=all`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const fetchedData = await response.json();
        setDocumentsLength(fetchedData.length);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Error fetching documents");
      }
    };
    fetchDepartments();
  }, []);

  // Search functionality
  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const response = await fetch(
        `http://localhost:5000/search?query=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Failed to fetch search results");
      const searchData = await response.json();
      setResults(searchData);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search error");
    }
  };

  // Google login success/failure handlers
  const onLoginSuccess = (res) => {
    const decoded = jwtDecode(res.credential);
    localStorage.setItem("email", decoded?.email);
    localStorage.setItem("name", decoded?.name);
    localStorage.setItem("profilePicture", decoded?.picture);

    setGoogleLoginDetails({
      email: decoded?.email,
      name: decoded?.name,
      profilePicture: decoded?.picture,
    });
    toast.success(`Login Successful: ${decoded?.name}`);
    navigate("/");
  };

  const onLoginFailure = (res) => {
    console.error("Login Failed:", res);
    toast.error("Login failed. Please try again.");
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    setGoogleLoginDetails({ email: "", name: "", profilePicture: "" });
    toast.success("You have successfully logged out.");
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-100 relative">
      {/* NITJ-inspired Header */}
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

          {/* User Authentication Area */}
          <div className="flex items-center space-x-4">
            {!googleLoginDetails?.email ? (
              <GoogleLogin
                onSuccess={onLoginSuccess}
                onFailure={onLoginFailure}
                size="large"
              />
            ) : (
              <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-md">
                {googleLoginDetails.profilePicture && (
                  <img
                    src={googleLoginDetails.profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="text-xs text-gray-700">
                  <p className="font-bold">{googleLoginDetails.name}</p>
                  <p className="text-gray-500">{googleLoginDetails.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                >
                  Logout
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Bar (MyHerupa-inspired) */}
      <div
        ref={searchContainerRef}
        className="w-full bg-[#f3f3f3] border-b border-gray-300 sticky top-0 z-20 shadow-sm"
      >
        <div className="container mx-auto py-3 px-4">
          <div className="flex space-x-2 max-w-2xl mx-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search for notes, papers, documents..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] transition"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-[#800000] text-white px-5 py-3 rounded-lg hover:bg-[#600000] transition shadow-md flex items-center"
            >
              Search
            </button>
          </div>

          {/* Search Results */}
          {showResults && results.length > 0 && (
            <>
              {/* Blur overlay for the background */}
              <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-10"></div>

              <div className="absolute left-0 right-0 mx-auto max-w-2xl bg-white p-4 rounded-lg shadow-lg max-h-[50vh] overflow-y-auto animate-slideDown mt-1 border border-gray-200 z-20">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[#800000] font-semibold text-lg">
                    Search Results
                  </h3>
                  <button
                    onClick={() => setShowResults(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <ul className="space-y-3">
                  {results.map((doc) => (
                    <li
                      key={doc.id}
                      className="cursor-pointer group transition-colors duration-200 p-3 hover:bg-gray-50 rounded-md"
                      onClick={() =>
                        window.open(
                          doc.url.startsWith("http")
                            ? doc.url
                            : `https://${doc.url}`,
                          "_blank"
                        )
                      }
                    >
                      <div className="font-semibold text-[#800000] group-hover:text-[#600000] transition flex items-center">
                        <Book className="w-4 h-4 mr-2" />
                        {doc.title}
                      </div>
                      <div className="text-sm text-gray-600 group-hover:text-gray-800 transition ml-6">
                        {doc.subject} ({doc.subjectcode})
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hero Section with NITJ Background */}
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  NITJ Study Resources Hub
                </h2>
                <p className="text-lg text-yellow-200 max-w-xl">
                  Access course materials, previous year papers, and study
                  resources for all NIT Jalandhar departments
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => navigate("/upload")}
                  className="px-6 py-3 bg-yellow-500 text-[#800000] rounded-md hover:bg-yellow-400 transition font-bold shadow-lg flex items-center"
                >
                  <Upload className="w-5 h-5 mr-2" /> Upload Resources
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto py-8 px-4">
        {/* Quick Links Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-[#800000]">
          <h2 className="text-2xl font-bold text-[#800000] mb-4">
            Quick Links
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="https://www.nitj.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <ExternalLink className="w-5 h-5 mr-2 text-[#800000]" />
              <span>NITJ Website</span>
            </a>
            {/* <a
              href="#"
              className="flex items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <Book className="w-5 h-5 mr-2 text-[#800000]" />
              <span>Syllabus</span>
            </a>
            <a
              href="#"
              className="flex items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <Download className="w-5 h-5 mr-2 text-[#800000]" />
              <span>Past Papers</span>
            </a>
            <a
              href="#"
              className="flex items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <Upload className="w-5 h-5 mr-2 text-[#800000]" />
              <span>Contribute</span>
            </a> */}
          </div>
        </div>

        {/* Year Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
            <div className="w-6 h-6 bg-[#800000] rounded-full mr-2"></div>
            Select Your Year
          </h3>
          <div className="flex flex-wrap gap-3">
            {year.map((yr, index) => (
              <button
                key={index}
                onClick={() => setYearIndex(index)}
                className={`px-8 py-4 text-sm font-semibold rounded-lg shadow-md transition duration-300 ${
                  index === yearIndex
                    ? "bg-[#800000] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Departments - MyHerupa card style with improved design */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
            <div className="w-6 h-6 bg-[#800000] rounded-full mr-2"></div>
            Select Your Department
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {departmentsData.map((dept, index) => (
              <div
                key={index}
                onClick={() => navigate(`/sem/${yearIndex + 1}/${dept.branch}`)}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#800000] group"
              >
                <div className="h-3 bg-[#800000] group-hover:h-5 transition-all duration-300"></div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#800000] transition-all duration-300">
                    <span className="font-bold text-[#800000] group-hover:text-white transition-all duration-300">
                      {dept.branch}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg text-gray-800 mb-2">
                    {dept.abbreviation}
                  </h4>
                  {/* <p className="text-sm text-gray-500">{dept.branch}</p> */}
                  <div className="mt-4 text-[#800000] text-sm font-medium flex items-center">
                    Explore{" "}
                    <span className="ml-1 group-hover:ml-2 transition-all duration-300">
                      →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-[#800000] mb-4">
            Resource Statistics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-4xl font-bold text-[#800000] mb-2">
                {documentsLength}+
              </div>
              <div className="text-gray-600 text-sm">Study Materials</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-4xl font-bold text-[#800000] mb-2">
                {departmentsData.length}
              </div>
              <div className="text-gray-600 text-sm">Departments</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-4xl font-bold text-[#800000] mb-2">5+</div>
              <div className="text-gray-600 text-sm">Past Papers</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-4xl font-bold text-[#800000] mb-2">30+</div>
              <div className="text-gray-600 text-sm">Active Users</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - NITJ inspired with more details */}
      <footer className="bg-[#800000] text-white py-8">
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

      {/* Upload File Popup */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <FileUpload onClose={() => setShowUpload(false)} />
        </div>
      )}
    </div>
  );
};

export default Year;
