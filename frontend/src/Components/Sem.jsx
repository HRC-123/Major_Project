import React, { useEffect, useState,useRef } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SemesterPage() {
  
  const [subjectsData, setSubjectsData] = useState([]);
  const { year, branch } = useParams();
  const sem = year * 2;         // Current semester
  const prevSem = sem - 1;      // Previous semester

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!year || !branch) return;
      

      try {
        // Fetch subjects for both semesters
        const response = await fetch(`http://localhost:5000/subjects?&year=${year}&branch=${branch}`);
      
        if (!response.ok) throw new Error("Failed to fetch subjects");
      
        const data = await response.json();
      
        // Combine both semester subjects
        setSubjectsData(data);
        toast.success("Subjects fetched successfully");
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Error fetching subjects:");
      }
    };

    fetchSubjects();
  }, [year, branch]);
 

  const handleSubjectClick = (subject) => {
    navigate(`/sem/${year}/${branch}/${subject}`);
  };
  

  const navigate = useNavigate();

   return (
     <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-4 flex flex-col items-center">
       <button
         onClick={() => navigate(-1)}
         className="self-start mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
       >
         Back
       </button>

       <h1 className="text-4xl font-bold text-blue-800 mb-10">
         Semester Subjects
       </h1>

       <div className="w-full max-w-4xl space-y-4">
      {subjectsData && (
        <>
          {/* Previous Semester Subjects */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Semester {prevSem}
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {subjectsData
                .filter((subject) => subject.sem === prevSem)
                .map((subject, index) => (
                  <button
                    key={index}
                    onClick={() => handleSubjectClick(subject.subject)}
                    className="flex flex-col bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg shadow-md hover:from-indigo-600 hover:to-blue-600 transition duration-300 transform hover:scale-105"
                  >
                    <p className="font-bold text-lg">{subject.subjectcode}</p>
                    <p className="text-sm text-gray-300">{subject.subject}</p>
                  </button>
                ))}
            </div>
          </div>
              
          {/* Current Semester Subjects */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Semester {sem}
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {subjectsData
                .filter((subject) => subject.sem === sem)
                .map((subject, index) => (
                  <button
                    key={index}
                    onClick={() => handleSubjectClick(subject.subject)}
                    className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg shadow-md hover:from-indigo-600 hover:to-blue-600 transition duration-300 transform hover:scale-105 font-semibold text-lg"
                  >
                    {subject.subjectcode}
                    <h4>{subject.subject}</h4>
                  </button>
                ))}
            </div>
          </div>
        </>
      )}
    </div>

     </div>
   );
}

export default SemesterPage;
