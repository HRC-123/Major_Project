
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Year = () => {
  const years = ["First Year", "Second Year", "Third Year", "Fourth Year"];
  const departments = [
    { abbreviation: "CSE", fullForm: "Computer Science and Engineering" },
    {
      abbreviation: "ECE",
      fullForm: "Electronics and Communication Engineering",
    },
    { abbreviation: "IT", fullForm: "Information Technology" },

    { abbreviation: "ME", fullForm: "Mechanical Engineering" },
    { abbreviation: "EE", fullForm: "Electrical Engineering" },
    {
      abbreviation: "ICE",
      fullForm: "Instrumentation and Control Engineering",
    },
    { abbreviation: "IPE", fullForm: "Industrial and Production Engineering" },
    { abbreviation: "BT", fullForm: "Biotechnology" },
    { abbreviation: "Chemistry", fullForm: "Chemistry" },
    { abbreviation: "Chemical", fullForm: "Chemical Engineering" },
    {
      abbreviation: "Mathematics ",
      fullForm: "Mathematics and Computing",
    },
    { abbreviation: "Civil", fullForm: "Civil Engineering" },
    {
      abbreviation: "HM",
      fullForm: "Humanities and Management",
    },

    { abbreviation: "Physics", fullForm: "Physics" },
    { abbreviation: "TT", fullForm: "Textile Technology" },
  ];

  const navigate = useNavigate();
  

  
  const [yearIndex, setYearIndex] = useState(0);
  // const [branch, setBranch] = useState("");

  return (
    <div className="h-screen w-screen flex justify-center items-center ">
      <div className="w-2/3 flex-col items-center justify-center  ">
        <div className="h-auto bg-[#1a2542] w-full text-white flex justify-center items-center p-4 gap-4 text-lg">
          {years.map((year, index) => (
            <button
              key={index}
              className={`p-4 w-40 text-center ${
                index === yearIndex
                  ? "bg-[#7c9aed] rounded-xl text-zinc-900 transition-transform duration-300 transform hover:scale-100"
                  : "text-white transition-all duration-300"
              }`}
              onClick={() => {
                setYearIndex(index);
              }}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="border-black bg-white w-full p-4 flex flex-wrap  gap-6 justify-center text-md">
          {departments.map((dept, index) => (
            <button
              key={index}
              className="relative p-4 border-2 border-black text-center rounded-lg shadow-md overflow-hidden group"
              onClick={() => {
                navigate(
                  `/sem/${yearIndex+1}/${departments[index]?.abbreviation}`
                );
              }}
            >
              <span className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />

              <span className="relative z-10 group-hover:text-white transition-colors duration-500">
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
