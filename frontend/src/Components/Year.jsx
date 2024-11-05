import { useState } from "react";
import { useNavigate } from "react-router-dom";
import data from "../data.json";

const Year = () => {

  const year = data.year;
  const departments = data.departments;

  // const year = ["First Year", "Second Year", "Third Year", "Fourth Year"];
  //  const departments = [
  //    { abbreviation: "CSE", fullForm: "Computer Science and Engineering" },
  //    {
  //      abbreviation: "ECE",
  //      fullForm: "Electronics and Communication Engineering",
  //    },
  //    { abbreviation: "IT", fullForm: "Information Technology" },
  //    { abbreviation: "ME", fullForm: "Mechanical Engineering" },
  //    { abbreviation: "EE", fullForm: "Electrical Engineering" },
  //    {
  //      abbreviation: "ICE",
  //      fullForm: "Instrumentation and Control Engineering",
  //    },
  //    { abbreviation: "IPE", fullForm: "Industrial and Production Engineering" },
  //    { abbreviation: "BT", fullForm: "Biotechnology" },
  //    { abbreviation: "Chemistry", fullForm: "Chemistry" },
  //    { abbreviation: "Chemical", fullForm: "Chemical Engineering" },
  //    { abbreviation: "Mathematics", fullForm: "Mathematics and Computing" },
  //    { abbreviation: "Civil", fullForm: "Civil Engineering" },
  //    { abbreviation: "HM", fullForm: "Humanities and Management" },
  //    { abbreviation: "Physics", fullForm: "Physics" },
  //    { abbreviation: "TT", fullForm: "Textile Technology" },
  //  ];

  const navigate = useNavigate();
  const [yearIndex, setYearIndex] = useState(0);

  return (
    <div className="h-screen w-full flex justify-center items-center bg-gray-100">
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
      </div>
    </div>
  );
};

export default Year;
