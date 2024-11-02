import React, { useState } from 'react';

// Sample subjects data for semesters
const semesters = [
  {
    name: 'Semester 1',
    subjects: ['Math', 'Physics', 'Chemistry', 'English', 'Computer Science', 'Biology']
  },
  {
    name: 'Semester 2',
    subjects: ['Calculus', 'Mechanics', 'Organic Chemistry', 'Literature', 'Algorithms', 'Environmental Science']
  }
];

// Dropdown options
const options = ['Notes', 'Syllabus', 'PPTs', 'Previous Year Paper'];

function SemesterPage() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setShowOptions(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 p-10 flex flex-col items-center">
      <h1 className="text-5xl font-bold text-blue-700 mb-10">Semester Subjects</h1>
      
      <div className="w-full max-w-4xl space-y-8">
        {semesters.map((semester, semesterIndex) => (
          <div key={semesterIndex} className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">{semester.name}</h2>
            <div className="grid grid-cols-3 gap-6">
              {semester.subjects.map((subject, subjectIndex) => (
                <button
                  key={subjectIndex}
                  onClick={() => handleSubjectClick(subject)}
                  className="bg-gradient-to-br from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg shadow-md hover:from-purple-500 hover:to-blue-500 transition duration-300 transform hover:scale-105 font-semibold text-lg"
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showOptions && (
        <div className="w-full max-w-md mt-12 p-8 bg-white bg-opacity-90 rounded-xl shadow-2xl transition duration-500 transform hover:scale-105">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Options for {selectedSubject}</h3>
          <ul className="space-y-3">
            {options.map((option, index) => (
              <li key={index}>
                <button className="w-full bg-gradient-to-r from-pink-400 to-red-400 text-white py-3 rounded-lg shadow-md hover:from-red-400 hover:to-pink-400 transition duration-300 transform hover:scale-105 font-medium">
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SemesterPage;
