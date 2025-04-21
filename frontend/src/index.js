import React,{useState,useEffect} from "react";
import ReactDOM from "react-dom/client";
import Year from "./Components/Year.jsx";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Sem from "./Components/Sem.jsx";
import FileUpload from "./Components/FileUpload.jsx";
import ViewFiles from "./Components/ViewFiles.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GlobalProvider, useGlobalContext } from "./context/GlobalContext";
import { ToastContainer } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import LandingPage from "./context/landingpage.jsx";
import Savedfiles from "./Components/Savedfiles.jsx";
import UploadedFiles from "./Components/UploadedFiles.jsx";
const root = ReactDOM.createRoot(document.getElementById("root"));

const AppRoutes = () => {
  // console.log(process.env.REACT_APP_CLIENT_ID);

  const { googleLoginDetails, setGoogleLoginDetails } = useGlobalContext();
  const email = localStorage.getItem("email") || null;
  const name = localStorage.getItem("name") || null;
  const profilePicture = localStorage.getItem("profilePicture") || null;

  useEffect(() => {
    setGoogleLoginDetails({
      email: email,
      name: name,
      profilePicture: profilePicture,
    });
  }, []);

  return (
    <BrowserRouter>
      {/* ToastContainer added here to be globally accessible */}
      {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar /> */}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/sem/:year/:branch" element={<Sem />} />
        <Route path="/sem/:year/:branch/:subject" element={<ViewFiles />} />
        <Route path="/FileUpload" element={<FileUpload />} />
        <Route path="/saved" element={<Savedfiles />} />
        <Route path="/uploaded" element={<UploadedFiles />} />
      </Routes>
    </BrowserRouter>
  );
};

root.render(
  <React.StrictMode>
    <GlobalProvider>
      <GoogleOAuthProvider clientId='426193552342-pls4uoetteemv4lenn6saepf0sh0drhr.apps.googleusercontent.com'>
        <AppRoutes />
      </GoogleOAuthProvider>
    </GlobalProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
