import React from "react";
import { useNavigate } from "react-router-dom";
import Year from '../Components/Year.jsx'

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col">
      {/* 
        1) TOP SECTION with background image.
      */}
      {/* <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundImage: "url('/backgroundImage.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      > */}
        {/* <header className="flex-grow flex flex-col items-center justify-center bg-transparent px-4 py-8"> */}
          {/* Place any top content here (logo, text, etc.) */}
        {/* </header> */}

        {/* Triangular Footer Section */}
        {/* <footer className="w-full">
          <div className="flex w-full" style={{ height: "10rem" }}> */}
            {/* First Column */}
            {/* <div className="relative w-1/3 bg-green-400 clip-polygon-left flex items-center justify-center px-4">
              <span className="text-white font-semibold text-lg">
                Upload &amp; Share: <br></br>Users can upload PDFs, DOCs, PPTs, or handwritten scanned notes.
              </span>
            </div> */}

            {/* Second Column */}
            {/* <div className="relative w-1/3 bg-purple-400 clip-polygon-mid flex items-center justify-center px-4">
              <a 
                onClick={() => navigate("/year")}
                className="cursor-pointer hover:text-red-600"
              >
                <span className="text-white font-semibold text-lg">
                  Search &amp; Filter: <br></br> Find relevant study materials by subject, topic, semester, or popularity.
                </span>
              </a> */}
            {/* </div> */}

            {/* Third Column */}
            {/* <div className="relative w-1/3 bg-yellow-400 clip-polygon-right flex items-center justify-center px-4">
              <span className="text-white font-semibold text-lg">
                Like &amp; Dislike System:<br></br> Rate notes to help others find high-quality content.
              </span>
            </div>
          </div>
        </footer>
      </div> */}

      {/* 
        2) ADDITIONAL COMPONENTS (PLAIN BACKGROUND)
      */}
      {/* <div className="bg-white px-4 py-16"> */}
        {/* Heading & Subheading */}
        {/* <h2 className="text-4xl font-bold text-black mb-2">More Stuff</h2>
        <p className="text-lg text-gray-700 mb-8">
          Additional stuff that we really could not put anywhere else.
        </p> */}

        {/* GPA Calculator */}
        {/* <div className="bg-gray-100 p-4 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between">
          <h3 className="text-2xl font-semibold mb-2 md:mb-0">GPA Calculator</h3>
          <p className="text-gray-600">
            Just enter your grades, we give you your GPA. Simple.
          </p>
        </div> */}

        {/* myTimeTable */}
        {/* <div className="bg-gray-100 p-4 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between">
          <h3 className="text-2xl font-semibold mb-2 md:mb-0">myTimeTable</h3>
          <p className="text-gray-600">
            The most intuitive and amazing time-table for you.
          </p>
        </div> */}

        {/* Academic Calendar */}
        {/* <div className="bg-gray-100 p-4 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between">
          <h3 className="text-2xl font-semibold mb-2 md:mb-0">Academic Calendar</h3>
          <p className="text-gray-600">
            Plan your semester with all important dates in one place.
          </p>
        </div> */}

        {/* WiFi & passwords */}
        {/* <div className="bg-gray-100 p-4 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between">
          <h3 className="text-2xl font-semibold mb-2 md:mb-0">WiFi &amp; passwords</h3>
          <p className="text-gray-600">
            All network credentials easily accessible here.
          </p>
        </div> */}

        {/* Holiday Calendar */}
        {/* <div className="bg-gray-100 p-4 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between">
          <h3 className="text-2xl font-semibold mb-2 md:mb-0">Holiday Calendar</h3>
          <p className="text-gray-600">
            Never miss a holiday or long weekend again.
          </p>
        </div> */}

        {/* Societies & Fests */}
        {/* <div className="bg-gray-100 p-4 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between">
          <h3 className="text-2xl font-semibold mb-2 md:mb-0">Societies &amp; Fests</h3>
          <p className="text-gray-600">
            All societies from Thapar Institute of Engineering &amp; Technology in one place.
          </p>
        </div> */}

        {/* Food & Restros */}
        {/* <div className="bg-gray-100 p-4 flex flex-col md:flex-row items-start md:items-center justify-between">
          <h3 className="text-2xl font-semibold mb-2 md:mb-0">Food &amp; Restros</h3>
          <p className="text-gray-600">
            From getting tipsy to getting sober, discover the best places to eat.
          </p>
        </div> */}
      {/* </div> */}

      <Year/>
      {/* 
        3) FINAL FOOTER AT THE BOTTOM 
      */}

{/* 
      <footer className="w-full bg-gray-900 text-white py-10 flex items-center mt-24 justify-center text-lg font-semibold flex-col">
        <div className="text-2xl"   >
        Made by
        </div>
        <div className="text-xl flex-col">
        <div>Gujjula Chola Naga Sri Chaitanya Reddy ( 21103050)</div>
        <div>Manya Singh (21103085)</div>
        <div>Ramcharan Hanumanthu (21103123)</div>
        </div>
        
    </footer> */}

    </div>
  );
}
