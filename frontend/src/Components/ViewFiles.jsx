// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import FileCard from "./FileCard";

// const options = ["Notes(or)PPT", "Books", "Assignments", "PreviousYearPapers"];

// function ViewFiles() {
//   const { year, branch, subject } = useParams();
//   const [files, setFiles] = useState([]);
//   const [option, setOption] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchFiles = async () => {
//       if (!option) return;

//       setLoading(true);
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/files?year=${year}&branch=${branch}&subject=${subject}&type=${option}`
//         );
//         const data = await response.json();

//         if (response.ok) {
//           setFiles(data);
//         } else {
//           console.error("Error fetching files:", data.error);
//         }
//       } catch (error) {
//         console.error("Error fetching files:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFiles();
//   }, [option, year, branch, subject]);

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-4 flex flex-col items-center">
//       <h1 className="text-4xl font-bold text-blue-800 mb-1">{subject}</h1>
//       <h4 className="text-xl text-blue-400 mb-10">
//         Year-{year}, {branch}
//       </h4>

//       <div className="w-full max-w-4xl mb-8">
//         <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
//           Options for {subject}
//         </h3>
//         <ul className="flex flex-wrap gap-4 justify-between w-full">
//           {options.map((opt, index) => (
//             <li key={index}>
//               <button
//                 className="w-52 bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-lg shadow-md hover:from-blue-500 hover:to-teal-500 transition duration-300 transform hover:scale-105 font-medium"
//                 onClick={() => setOption(opt)}
//               >
//                 {opt}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {loading ? (
//         <p className="text-2xl font-bold text-center">Loading...</p>
//       ) : files.length > 0 ? (
//         <div className="w-full max-w-4xl space-y-4">
//           {files.map((file) => (
//             <FileCard key={file.id} file={file} />
//           ))}
//         </div>
//       ) : (
//         <p className="p-4 text-2xl font-bold text-center">
//           No Files available currently...
//         </p>
//       )}
//     </div>
//   );
// }

// export default ViewFiles;

import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import FileCard from "./FileCard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const options = ["Notes(or)PPT", "Books", "Assignments", "PreviousYearPapers"];
const filters = ["More Upvotes", "Less Downvotes", "Alphabetical Title"];

function ViewFiles() {
  const { year, branch, subject } = useParams();
  const [files, setFiles] = useState([]);
  const [option, setOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      if (!option) return;

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/files?year=${year}&branch=${branch}&subject=${subject}&type=${option}`
        );
        const data = await response.json();

        if (response.ok) {
          setFiles(data);
          toast.success(`${option} fetched successfully`);
        } else {
          console.error("Error fetching files:", data.error);
          toast.error("Error fetching files");
        }
      } catch (error) {
         toast.error("Error fetching files");
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [option, year, branch, subject]);

  // Function to apply sorting based on selected filter
  useEffect(() => {
    
  })
  const sortedFiles = () => {
    if (!selectedFilter) return files;
  

    
    
    return [...files].sort((a, b) => {
      
      if (selectedFilter === "More Upvotes") return b.upvote - a.upvote;
      if (selectedFilter === "Less Downvotes") return a.downvote - b.downvote;
      if (selectedFilter === "Alphabetical Title") return a.title.localeCompare(b.title);
      
      return 0;
    });
  };

  useEffect(() => {
    if (selectedFilter == null) return;
    toast.success(`${selectedFilter} files fetched`);
  }, [selectedFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6 flex flex-col items-center">
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
      >
        Back
      </button>
      <h1 className="text-4xl font-bold text-blue-800 mb-1">{subject}</h1>
      <h4 className="text-xl text-blue-400 mb-10">
        Year-{year}, {branch}
      </h4>

      {/* Option Selector */}
      <div className="w-full max-w-4xl mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
          Options for {subject}
        </h3>
        <ul className="flex flex-wrap gap-4 justify-between w-full">
          {options.map((opt, index) => (
            <li key={index}>
              <button
                className={`w-52 py-3 rounded-lg shadow-md font-medium transition duration-300 transform 
                  ${
                    option === opt
                      ? "bg-blue-700 text-white"
                      : "bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-blue-500 hover:to-teal-500 hover:scale-105"
                  }
                `}
                onClick={() => setOption(opt)}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Filters Section with Dropdown */}
      {files.length > 0 && (
        <div className="relative w-full max-w-4xl mb-6">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-medium flex justify-between items-center w-48"
          >
            {selectedFilter || "Sort By"}
            <span className="ml-2">{dropdownOpen ? "▲" : "▼"}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-48 z-10">
              {filters.map((filter, index) => (
                <button
                  key={index}
                  className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                    selectedFilter === filter ? "font-bold text-blue-600" : ""
                  }`}
                  onClick={() => {
                    setSelectedFilter(filter);
                    setDropdownOpen(false);
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex flex-col items-center mt-10">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl text-gray-700 mt-4">Fetching files...</p>
        </div>
      )}

      {/* No Files Available */}
      {!loading && files.length === 0 && (
        <div className="flex flex-col items-center mt-10">
          <img
            src="https://img.icons8.com/ios/100/empty-box.png"
            alt="No files"
            className="w-24 h-24 opacity-50"
          />
          <p className="text-2xl font-semibold text-gray-600 mt-4">
            No files available currently...
          </p>
          <p className="text-gray-500">
            Try selecting a different category or check back later.
          </p>
        </div>
      )}

      {/* Files Display */}
      {!loading && files.length > 0 && (
        <div className="w-full max-w-4xl space-y-4">
       
          {sortedFiles().map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewFiles;
