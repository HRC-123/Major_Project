import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FileCard from "./FileCard";

const options = ["Notes(or)PPT", "Books", "Assignments", "PreviousYearPapers"];

function ViewFiles() {
  const { year, branch, subject } = useParams();
  const [files, setFiles] = useState([]);
  const [option, setOption] = useState(null);
  const [loading, setLoading] = useState(false);

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
        } else {
          console.error("Error fetching files:", data.error);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [option, year, branch, subject]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-800 mb-1">{subject}</h1>
      <h4 className="text-xl text-blue-400 mb-10">
        Year-{year}, {branch}
      </h4>

      <div className="w-full max-w-4xl mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
          Options for {subject}
        </h3>
        <ul className="flex flex-wrap gap-4 justify-between w-full">
          {options.map((opt, index) => (
            <li key={index}>
              <button
                className="w-52 bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-lg shadow-md hover:from-blue-500 hover:to-teal-500 transition duration-300 transform hover:scale-105 font-medium"
                onClick={() => setOption(opt)}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {loading ? (
        <p className="text-2xl font-bold text-center">Loading...</p>
      ) : files.length > 0 ? (
        <div className="w-full max-w-4xl space-y-4">
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      ) : (
        <p className="p-4 text-2xl font-bold text-center">
          No Files available currently...
        </p>
      )}
    </div>
  );
}

export default ViewFiles;
