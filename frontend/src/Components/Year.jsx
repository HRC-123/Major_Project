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
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-50 relative px-6">
      {/* Overlay for search results */}
      {showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 animate-fadeIn" />
      )}

      {/* Top Right: User Info and Upload Button */}
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        {!googleLoginDetails?.email ? (
          <GoogleLogin
            onSuccess={onLoginSuccess}
            onFailure={onLoginFailure}
            size="large"
          />
        ) : (
          <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-md">
            <div className="text-xs text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis pr-6">
              <p className="font-bold">{googleLoginDetails.name}</p>
              <p className="text-gray-500">{googleLoginDetails.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center"
            >
              <LogOut className="mr-2 w-4 h-4" /> Logout
            </button>
          </div>
        )}
        <button
          onClick={() => navigate("/upload")}
          className="px-5 py-4 w-32 bg-green-500 text-white font-semibold text-sm rounded-lg hover:bg-green-600 transition shadow-md"
        >
          Upload File
        </button>
      </div>

      {/* Top Left: Search Bar and Results */}
      <div
        ref={searchContainerRef}
        className="absolute top-4 left-4 w-full max-w-lg z-20"
      >
        <div className="flex space-x-2 mb-4">
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
          <div className="bg-white p-4 rounded-lg shadow-lg max-h-[50vh] overflow-y-auto animate-slideDown">
            <ul className="space-y-3">
              {results.map((doc) => (
                <li
                  key={doc.id}
                  className="cursor-pointer group transition-colors duration-200"
                  onClick={() =>
                    window.open(
                      doc.url.startsWith("http")
                        ? doc.url
                        : `https://${doc.url}`,
                      "_blank"
                    )
                  }
                >
                  <div className="font-semibold text-blue-600 group-hover:text-blue-800 transition">
                    {doc.title}
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-gray-800 transition">
                    {doc.subject} ({doc.subjectcode})
                  </div>
                  <hr className="border-t-2 my-2" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main Content: Year Selection and Department Grid */}
      <div className="w-full max-w-4xl flex flex-col items-center mt-32 z-0">
        {/* Year Buttons */}
        <div className="flex justify-center items-center gap-4 mb-6">
          {year.map((yr, index) => (
            <button
              key={index}
              onClick={() => setYearIndex(index)}
              className={`px-5 py-3 text-sm font-semibold rounded-lg shadow-md transition duration-300 ${
                index === yearIndex
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
        {/* Department Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
          {departmentsData.map((dept, index) => (
            <button
              key={index}
              onClick={() => navigate(`/sem/${yearIndex + 1}/${dept.branch}`)}
              className="relative p-4 border border-gray-300 bg-white text-gray-700 text-center rounded-lg shadow-lg transition-transform duration-150 hover:scale-105 hover:shadow-xl group overflow-hidden"
            >
              <span className="absolute inset-0 bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
              <span className="relative z-10 font-medium text-lg group-hover:text-white transition-colors duration-500">
                {dept.abbreviation}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload File Popup */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <FileUpload onClose={() => setShowUpload(false)} />
        </div>
      )}
    </div>
  );
};

export default Year;
