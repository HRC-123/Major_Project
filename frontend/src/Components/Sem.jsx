import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Book, ChevronLeft, Search,ArrowRight,LogOut,Upload } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useGlobalContext } from "../context/GlobalContext";


function SemesterPage() {
  const [subjectsData, setSubjectsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const { year, branch } = useParams();
  const sem = year * 2; // Current semester
  const prevSem = sem - 1; // Previous semester
  const navigate = useNavigate();

    const { googleLoginDetails, setGoogleLoginDetails } = useGlobalContext();

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
        setFilteredSubjects(data);
        toast.success("Subjects fetched successfully");
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Error fetching subjects");
      }
    };

    fetchSubjects();
  }, [year, branch]);

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
      // navigate("/");
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
      // navigate("/");
    };

  // Apply search filter
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSubjects(subjectsData);
      return;
    }

    const filtered = subjectsData.filter(
      (subject) =>
        subject.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (subject.subjectcode &&
          subject.subjectcode.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredSubjects(filtered);
  }, [searchQuery, subjectsData]);

  const handleSubjectClick = (subject) => {
    navigate(`/sem/${year}/${branch}/${subject}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-100 relative">
      {/* Header */}
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

          {/* User Authentication Area */}
          <div className="flex items-center space-x-4">
            {!googleLoginDetails?.email ? (
              <GoogleLogin
                onSuccess={onLoginSuccess}
                onFailure={onLoginFailure}
                size="large"
              />
            ) : (
              <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-md">
                {googleLoginDetails.profilePicture && (
                  <img
                    src={googleLoginDetails.profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="text-xs text-gray-700">
                  <p className="font-bold">{googleLoginDetails.name}</p>
                  <p className="text-gray-500">{googleLoginDetails.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                >
                  Logout
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="mt-4 md:mt-0">
              <button
                onClick={() => navigate("/upload")}
                className="px-6 py-3 bg-yellow-500 text-[#800000] rounded-md hover:bg-yellow-400 transition font-bold shadow-lg flex items-center"
              >
                <Upload className="w-5 h-5 mr-2" /> Contribute
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
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
                <div className="flex items-center mb-2">
                  <Book className="w-6 h-6 mr-2 text-white" />
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    {branch} Department
                  </h2>
                </div>
                <p className="text-lg text-yellow-200 flex items-center">
                  <span className="bg-white text-[#800000] px-2 py-1 rounded-lg text-sm font-bold mr-2">
                    Year {year}
                  </span>
                  <span className="bg-white text-[#800000] px-2 py-1 rounded-lg text-sm font-bold">
                    Semester {prevSem} & {sem}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto py-8 px-4">
        {/* Navigation Bar */}
        <div className="w-full max-w-5xl mx-auto flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#800000] text-white rounded-lg shadow-lg hover:bg-[#600000] transition duration-300 flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Departments
          </button>

          <div className="ml-4 text-gray-600 text-sm flex items-center">
            <span
              onClick={() => navigate("/")}
              className="hover:text-[#800000] cursor-pointer"
            >
              Home
            </span>
            <span className="mx-2">›</span>
            <span
              onClick={() => navigate(-1)}
              className="hover:text-[#800000] cursor-pointer"
            >
              Year {year}
            </span>
            <span className="mx-2">›</span>
            <span className="font-medium text-[#800000]">{branch}</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-5xl mx-auto mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search subjects..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        {/* Subject Count */}
        {filteredSubjects.length > 0 && (
          <div className="w-full max-w-5xl mx-auto mb-6">
            <div className="text-gray-700 bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="font-semibold text-[#800000]">
                {filteredSubjects.length}
              </span>{" "}
              {filteredSubjects.length === 1 ? "subject" : "subjects"} available
            </div>
          </div>
        )}

        {/* No search results */}
        {subjectsData.length > 0 && filteredSubjects.length === 0 && (
          <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto mt-6">
            <p className="text-xl font-semibold text-gray-600">
              No matching subjects found
            </p>
            <p className="text-gray-500 text-center mt-2">
              Try a different search term or clear your search
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Subject Selection Cards */}
        <div className="w-full max-w-5xl mx-auto space-y-6">
          {/* Previous Semester Subjects */}
          {filteredSubjects.filter((subject) => subject.sem === prevSem)
            .length > 0 && (
            <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-[#800000] transition-all hover:shadow-xl">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <div className="w-6 h-6 bg-[#800000] rounded-full flex items-center justify-center text-white text-xs mr-2">
                  {prevSem}
                </div>
                Semester {prevSem} Subjects
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredSubjects
                  .filter((subject) => subject.sem === prevSem)
                  .map((subject, index) => (
                    <button
                      key={index}
                      onClick={() => handleSubjectClick(subject.subject)}
                      className="flex flex-col bg-white border border-[#800000] text-gray-800 py-4 px-4 rounded-lg shadow hover:bg-[#800000] hover:text-white transition-all duration-300 transform hover:-translate-y-1 h-full group relative"
                    >
                      <div className="flex items-center mb-2">
                        <Book className="w-5 h-5 mr-2 text-[#800000] group-hover:text-white transition-colors flex-shrink-0" />
                        <div className="relative w-full max-w-[240px] overflow-visible group">
                          <p className="font-bold text-lg overflow-hidden text-ellipsis whitespace-nowrap">
                            {subject.subject}
                          </p>
                          <span className="absolute left-0 -top-10 bg-gray-800 text-white text-sm py-1 px-3 rounded shadow-lg z-50 max-w-xs whitespace-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            {subject.subject}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 group-hover:text-gray-200 transition-colors">
                        {subject.subjectcode}
                      </p>
                      <div className="mt-2 pt-2 border-t border-gray-200 group-hover:border-gray-400 transition-colors flex justify-end">
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Current Semester Subjects */}
          {filteredSubjects.filter((subject) => subject.sem === sem).length >
            0 && (
            <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-[#800000] transition-all hover:shadow-xl">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <div className="w-6 h-6 bg-[#800000] rounded-full flex items-center justify-center text-white text-xs mr-2">
                  {sem}
                </div>
                Semester {sem} Subjects
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredSubjects
                  .filter((subject) => subject.sem === sem)
                  .map((subject, index) => (
                    <button
                      key={index}
                      onClick={() => handleSubjectClick(subject.subject)}
                      className="flex flex-col bg-white border border-[#800000] text-gray-800 py-4 px-4 rounded-lg shadow hover:bg-[#800000] hover:text-white transition-all duration-300 transform hover:-translate-y-1 h-full group relative"
                    >
                      <div className="flex items-center mb-2">
                        <Book className="w-5 h-5 mr-2 text-[#800000] group-hover:text-white transition-colors flex-shrink-0" />
                        <div className="relative w-full max-w-[240px] overflow-visible group">
                          <p className="font-bold text-lg overflow-hidden text-ellipsis whitespace-nowrap">
                            {subject.subject}
                          </p>
                          <span className="absolute left-0 -top-10 bg-gray-800 text-white text-sm py-1 px-3 rounded shadow-lg z-50 max-w-xs whitespace-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            {subject.subject}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 group-hover:text-gray-200 transition-colors">
                        {subject.subjectcode}
                      </p>
                      <div className="mt-2 pt-2 border-t border-gray-200 group-hover:border-gray-400 transition-colors flex justify-end">
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

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

      {/* Footer */}
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
