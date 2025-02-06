import React from 'react';
import ReactDOM from 'react-dom/client';
import Year from "./Components/Year.jsx"
import "./index.css"; 
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Sem from './Components/Sem.jsx';
import FileUpload from './Components/FileUpload.jsx';
import ViewFiles from './Components/ViewFiles.jsx';

import { ToastContainer } from "react-toastify";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    {/* ToastContainer added here to be globally accessible */}
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Routes>
        <Route path="/" element={<Year />} />
        <Route path="/upload" element={<FileUpload/>} />
        <Route path="/sem/:year/:branch" element={<Sem />} />
        <Route path="/sem/:year/:branch/:subject" element={<ViewFiles/>} />
        <Route path='/FileUpload' element={<FileUpload/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
