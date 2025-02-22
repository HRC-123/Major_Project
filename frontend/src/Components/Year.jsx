// Year.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import data from "../data.json";
import FileUpload from "./FileUpload";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useGlobalContext } from "../context/GlobalContext";

import {

  LogOut,
 
} from "lucide-react";


const Year = () => {

  const { googleLoginDetails, setGoogleLoginDetails } = useGlobalContext();

  const year = data.year;
  const departments = data.departments;
  const navigate = useNavigate();
  const [yearIndex, setYearIndex] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const toggleUploadPopup = () => setShowUpload((prev) => !prev);

  useEffect(() => {
    async function fetchDepartments() {
        try {
            const response = await fetch("http://localhost:5000/branches"); // Fix typo in endpoint
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setDepartmentsData(data); // Update state with fetched data
        } catch (err) {
            console.error("Error fetching departments:", err);
        }
    }

    fetchDepartments();
  }, []);
  
  const handleSearch = async () => {
    if (!query.trim()) return; // Prevent empty searches

    try {
      const response = await fetch(`http://localhost:5000/search?query=${query}`);
      if (!response.ok) throw new Error("Failed to fetch search results");

      const data = await response.json();
      setResults(data); // Store search results
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const onLoginSuccess = (res) => {
    const decoded = jwtDecode(res.credential);
    // console.log("Login Success! Current user: ", decoded);

    // console.log("Login Success! Current user: ", decoded);

    localStorage.setItem("email", decoded?.email);
    localStorage.setItem("name", decoded?.name);
    localStorage.setItem("profilePicture", decoded?.picture);

    setGoogleLoginDetails({
      email: decoded?.email,
      name: decoded?.name,
      profilePicture: decoded?.profilePicture,
    });

    // toast.success(`Successfully LoggedIn : ${decoded?.name}`);

    navigate("/");
  };

  const onLoginFailure = (res) => {
    console.error("Login Failed: ", res);
    // toast.error("Login failed. Please try again.");
  };

    const handleLogout = () => {
      localStorage.clear();
      setGoogleLoginDetails({
        email: "",
        name: "",
        profilePicture: "",
      });
      // toast.success("You have successfully logged out.");
      navigate("/");
    };

    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-50 relative px-6">
        
        {/* Top Right: User & Upload Buttons */}
        <div className="absolute top-4 right-4 flex items-center space-x-4">
          {!googleLoginDetails?.email ? (
            <GoogleLogin onSuccess={onLoginSuccess} onFailure={onLoginFailure} size="large" />
          ) : (
            <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-md max-w-96">
              <div className="text-xs text-gray-700 w-40 overflow-hidden whitespace-nowrap text-ellipsis">
                <p className="font-bold">{googleLoginDetails.name}</p>
                <p className="text-xs text-gray-500">{googleLoginDetails.email}</p>
              </div>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center"
                onClick={handleLogout}
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
  
        {/* Search Bar */}
        <div className="absolute top-4 w-full max-w-lg mx-auto z-20">
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Search documents..."
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
  
          {/* Search Results */}
          {results.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-lg max-h-60 overflow-auto">
              <h3 className="text-lg font-semibold mb-2">Results:</h3>
              <ul>
                {results.map((doc) => (
                  <li
                    key={doc.id}
                    className="p-2 border-b cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => window.open(doc.url.startsWith("http") ? doc.url : `https://${doc.url}`, "_blank")}
                  >
                    <strong>{doc.title}</strong> - {doc.subject} ({doc.subjectcode})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
  
        {/* Year Selection */}
        <div className="w-full max-w-4xl flex flex-col items-center mt-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            {year.map((year, index) => (
              <button
                key={index}
                className={`px-5 py-3 text-sm font-semibold rounded-lg shadow-md transition-all duration-300 
                  ${
                    index === yearIndex
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                  }`}
                onClick={() => setYearIndex(index)}
              >
                {year}
              </button>
            ))}
          </div>
  
          {/* Department Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
            {departmentsData.map((dept, index) => (
              <button
                key={index}
                className="relative p-4 border border-gray-300 bg-white text-gray-700 text-center rounded-lg shadow-lg transition-transform duration-150 hover:scale-105 hover:shadow-xl group overflow-hidden"
                onClick={() => navigate(`/sem/${yearIndex + 1}/${dept.branch}`)}
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
