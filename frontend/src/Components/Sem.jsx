import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Book, ChevronLeft } from "lucide-react";

function SemesterPage() {
  const [subjectsData, setSubjectsData] = useState([]);
  const { year, branch } = useParams();
  const sem = year * 2; // Current semester
  const prevSem = sem - 1; // Previous semester
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!year || !branch) return;

      try {
        // Fetch subjects for both semesters
        const response = await fetch(
          `http://localhost:5000/subjects?&year=${year}&branch=${branch}`
        );

        if (!response.ok) throw new Error("Failed to fetch subjects");

        const data = await response.json();

        // Combine both semester subjects
        setSubjectsData(data);
        toast.success("Subjects fetched successfully");
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Error fetching subjects");
      }
    };

    fetchSubjects();
  }, [year, branch]);

  const handleSubjectClick = (subject) => {
    navigate(`/sem/${year}/${branch}/${subject}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-100 relative">
      {/* Header - Same as Year page */}
      <header className="w-full bg-[#800000] text-white shadow-md">
        <div className="container mx-auto py-3 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
              <img
                src="/nitjlogo.png"
                alt="NITJ Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">NITJ Study Resources</h1>
              <p className="text-xs text-yellow-200">
                National Institute of Technology, Jalandhar
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Similar to Year page but with semester info */}
      <div className="relative">
        <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
        <div
          className="relative h-48 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url('/api/placeholder/1920/500')`,
            backgroundPosition: "center 30%",
          }}
        >
          <div className="absolute inset-0 bg-[#800000] opacity-50"></div>
          <div className="container mx-auto px-4 py-12 relative z-10 h-full flex flex-col justify-center">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {branch} Department - Year {year}
                </h2>
                <p className="text-lg text-yellow-200 max-w-xl">
                  Select a subject to access study materials and resources
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto py-8 px-4">
        {/* Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-[#800000] text-white rounded-lg shadow-lg hover:bg-[#600000] transition duration-300 flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Departments
        </button>

        {/* Subject Selection Cards */}
        <div className="w-full max-w-5xl mx-auto space-y-6">
          {/* Previous Semester Subjects */}
          <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-[#800000]">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
              <div className="w-6 h-6 bg-[#800000] rounded-full mr-2"></div>
              Semester {prevSem} Subjects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {subjectsData
                .filter((subject) => subject.sem === prevSem)
                .map((subject, index) => (
                  <button
                    key={index}
                    onClick={() => handleSubjectClick(subject.subject)}
                    className="flex flex-col bg-gradient-to-br from-[#800000] to-[#600000] text-white py-4 px-4 rounded-lg shadow-md hover:from-[#700000] hover:to-[#500000] transition duration-300 transform hover:scale-105 h-full"
                  >
                    <div className="flex items-center mb-2">
                      <Book className="w-5 h-5 mr-2" />
                      <p className="font-bold text-lg">{subject.subject}</p>
                    </div>
                    <p className="text-sm text-gray-300">
                      {subject.subjectcode}
                    </p>
                  </button>
                ))}
            </div>
          </div>

          {/* Current Semester Subjects */}
          <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-[#800000]">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
              <div className="w-6 h-6 bg-[#800000] rounded-full mr-2"></div>
              Semester {sem} Subjects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {subjectsData
                .filter((subject) => subject.sem === sem)
                .map((subject, index) => (
                  <button
                    key={index}
                    onClick={() => handleSubjectClick(subject.subject)}
                    className="flex flex-col bg-gradient-to-br from-[#800000] to-[#600000] text-white py-4 px-4 rounded-lg shadow-md hover:from-[#700000] hover:to-[#500000] transition duration-300 transform hover:scale-105 h-full"
                  >
                    <div className="flex items-center mb-2">
                      <Book className="w-5 h-5 mr-2" />
                      <p className="font-bold text-lg">{subject.subject}</p>
                    </div>
                    <p className="text-sm text-gray-300">
                      {subject.subjectcode}
                    </p>
                  </button>
                ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="p-6 bg-white rounded-lg shadow-md mt-8">
            <h3 className="text-xl font-bold text-[#800000] mb-4">
              Department Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700">
                The {branch} department at NIT Jalandhar offers a comprehensive
                curriculum with varied subjects across semesters. Click on any
                subject above to access study materials, notes, previous year
                papers, and other resources.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Same as Year page */}
      <footer className="bg-[#800000] text-white py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-6 md:mb-0">
              <h4 className="font-bold text-lg mb-3">NITJ Study Resources</h4>
              <p className="text-sm text-gray-300 max-w-md">
                A platform dedicated to students of NIT Jalandhar to access and
                share study materials, past papers, and resources.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h5 className="font-bold mb-3 text-yellow-200">Quick Links</h5>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-yellow-200 transition">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-yellow-200 transition">
                      Upload
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-yellow-200 transition">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-yellow-200 transition">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold mb-3 text-yellow-200">Resources</h5>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-yellow-200 transition">
                      Notes
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-yellow-200 transition">
                      Past Papers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-yellow-200 transition">
                      Syllabus
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-yellow-200 transition">
                      References
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-700 text-center text-sm">
            <p>
              © {new Date().getFullYear()} NITJ Study Resources | National
              Institute of Technology, Jalandhar
            </p>
            <p className="text-xs text-yellow-200 mt-1">
              Developed by Students for Students
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SemesterPage;
