import React, { useEffect, useState,useRef } from "react";
import { useParams,useNavigate } from "react-router-dom";
import AWS from 'aws-sdk';
// const semesters = [
//   {
//     name: "Semester 1",
//     subjects: [
//       "Math",
//       "Physics",
//       "Chemistry",
//       "English",
//       "Computer Science",
//       "Biology",
//     ],
//   },
//   {
//     name: "Semester 2",
//     subjects: [
//       "Calculus",
//       "Mechanics",
//       "Organic Chemistry",
//       "Literature",
//       "Algorithms",
//       "Environmental Science",
//     ],
//   },
// ];

import data from "../data.json";
const options = ["Notes", "Syllabus", "PPTs", "Previous Year Paper"];

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();
function SemesterPage() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {

    const fetchFiles = async () => {
      try {
        const params = {
          Bucket: process.env.REACT_APP_BUCKET_NAME,
        };
        console.log(process.env.REACT_APP_AWS_SECRET_ACCESS_KEY);
        const data = await s3.listObjectsV2(params).promise();
        console.log(data);
        const fileList = data.Contents.map(file => ({
          key: file.Key,
          url: `https://${params.Bucket}.s3.${AWS.config.region}.amazonaws.com/${file.Key}`,
        }));
        setFiles(fileList);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  const openFile = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };


  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setShowOptions(true);
    setTimeout(() => {
      optionsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const optionsRef = useRef(null);

  const { year, branch } = useParams();

  const navigate = useNavigate();
 const yearData = data.years.find((y) => y.year === parseInt(year));
 const branchData = yearData?.branches.find((b) => b.branch === branch);
 const semesters = branchData?.semesters;

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
         {semesters &&
           Object.entries(semesters).map(
             ([semesterName, subjects], semesterIndex) => (
               <div
                 key={semesterIndex}
                 className="p-6 bg-white rounded-lg shadow-lg"
               >
                 <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                   {semesterName.replace("_", " ")}
                 </h2>
                 <div className="grid grid-cols-3 gap-6">
                   {subjects.map((subject, subjectIndex) => (
                     <button
                       key={subjectIndex}
                       onClick={() => handleSubjectClick(subject)}
                       className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg shadow-md hover:from-indigo-600 hover:to-blue-600 transition duration-300 transform hover:scale-105 font-semibold text-lg"
                     >
                       {subject}
                     </button>
                   ))}
                 </div>
               </div>
             )
           )}
       </div>

       {showOptions && (
         <div
           ref={optionsRef}
            className="w-full max-w-md mt-8 p-8 bg-white bg-opacity-90 rounded-xl shadow-2xl"
         >
           <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
             Options for {selectedSubject}
           </h3>
           <ul className="space-y-3">
             {options.map((option, index) => (
               <li key={index}>
                 <button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-lg shadow-md hover:from-blue-500 hover:to-teal-500 transition duration-300 transform hover:scale-105 font-medium">
                   {option}
                 </button>
               </li>
             ))}
           </ul>
         </div>
       )}

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Available Files</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {files.map(file => (
          <button
            key={file.key}
            onClick={() => openFile(file.url)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
          >
            {file.key}
          </button>
          ))}
        </div>
      </div>
     </div>
   );
}

export default SemesterPage;
