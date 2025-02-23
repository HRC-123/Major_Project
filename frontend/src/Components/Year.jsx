import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import data from "../data.json";
import FileUpload from "./FileUpload";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useGlobalContext } from "../context/GlobalContext";
import { toast } from "react-hot-toast";
import { LogOut } from "lucide-react";

const Year = () => {
  const { googleLoginDetails, setGoogleLoginDetails } = useGlobalContext();
  const { year } = data;
  const navigate = useNavigate();

  const [yearIndex, setYearIndex] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [departmentsData, setDepartmentsData] = useState([]);
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
    <div className="min-h-screen w-full bg-gray-50 relative flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 shadow-md bg-white z-30">
        {/* Left: Search Bar */}
        <div ref={searchContainerRef} className="w-full max-w-md relative">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              Search
            </button>
          </div>
          {showResults && results.length > 0 && (
            <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto animate-slideDown">
              <ul className="divide-y divide-gray-200">
                {results.map((doc) => (
                  <li
                    key={doc.id}
                    className="p-3 hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() =>
                      window.open(
                        doc.url.startsWith("http")
                          ? doc.url
                          : `https://${doc.url}`,
                        "_blank"
                      )
                    }
                  >
                    <div className="font-semibold text-blue-600">
                      {doc.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {doc.subject} ({doc.subjectcode})
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center space-x-4">
          {!googleLoginDetails?.email ? (
            <GoogleLogin
              onSuccess={onLoginSuccess}
              onFailure={onLoginFailure}
              size="medium"
            />
          ) : (
            <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg shadow">
              <div className="text-xs text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis pr-4">
                <p className="font-bold">{googleLoginDetails.name}</p>
                <p className="text-gray-500">{googleLoginDetails.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition flex items-center"
              >
                <LogOut className="mr-1 w-4 h-4" /> Logout
              </button>
            </div>
          )}
          <button
            onClick={() => navigate("/upload")}
            className="bg-green-500 text-white px-5 py-3 rounded-lg shadow hover:bg-green-600 transition"
          >
            Upload File
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center pt-16 pb-8 px-4">
        {/* Year Selection */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {year.map((yr, index) => (
            <button
              key={index}
              onClick={() => setYearIndex(index)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                index === yearIndex
                  ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {yr}
            </button>
          ))}
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {departmentsData.map((dept, index) => (
            <button
              key={index}
              onClick={() => navigate(`/sem/${yearIndex + 1}/${dept.branch}`)}
              className="relative p-6 bg-white border border-gray-300 rounded-lg shadow hover:shadow-xl transition-transform transform hover:scale-105 group overflow-hidden"
            >
              <span className="absolute inset-0 bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
              <span className="relative z-10 font-medium text-xl text-gray-800 group-hover:text-white transition-colors duration-500">
                {dept.abbreviation}
              </span>
            </button>
          ))}
        </div>
      </main>

      {/* Optional Upload File Popup */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <FileUpload onClose={() => setShowUpload(false)} />
        </div>
      )}
    </div>
  );
};

export default Year;
