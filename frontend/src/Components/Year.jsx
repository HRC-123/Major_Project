// Year.js
import React, { useState } from "react";
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

  const toggleUploadPopup = () => setShowUpload((prev) => !prev);

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
    <div className="h-screen w-full flex justify-center items-center bg-gray-100 relative">
      <div className="absolute top-4 right-4 ">
        <div className="flex items-center space-x-4 justify-center">
          {!googleLoginDetails?.email ? (
            <GoogleLogin
              onSuccess={onLoginSuccess}
              onFailure={onLoginFailure}
              size="large"
            />
          ) : (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <p className="font-bold">{googleLoginDetails.name}</p>
                <p className="text-xs">{googleLoginDetails.email}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate("/upload")}
            className="px-5 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
          >
            Upload File
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl flex-col items-center justify-center">
        <div className="flex justify-center items-center gap-4 mt-6 mb-8">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
          {departments.map((dept, index) => (
            <button
              key={index}
              className="relative p-3 border border-gray-300 bg-white text-gray-700 text-center rounded-lg shadow-lg transition-transform duration-125 hover:scale-105 hover:shadow-xl group overflow-hidden"
              onClick={() =>
                navigate(`/sem/${yearIndex + 1}/${dept.abbreviation}`)
              }
            >
              <span className="absolute inset-0 bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
              <span className="relative z-10 font-medium text-lg group-hover:text-white transition-colors duration-500">
                {dept.fullForm}
              </span>
            </button>
          ))}
        </div>

        {/* Background overlay and FileUpload popup */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 ">
            <FileUpload onClose={toggleUploadPopup} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Year;
