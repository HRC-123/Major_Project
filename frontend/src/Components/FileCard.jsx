import { useState } from "react";

const FileCard = ({ file }) => {
  const [upvotes, setUpvotes] = useState(file.upvote);
  const [downvotes, setDownvotes] = useState(file.downvote);

  // Function to handle upvote
  const handleUpvote = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: file.title, count: upvotes+1 }),
      });

      const data = await response.json();
      if (data.success) {
        setUpvotes(upvotes + 1);
      }
    } catch (error) {
      console.error("Error upvoting the document:", error);
    }
  };

  // Function to handle downvote
  const handleDownvote = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/downvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: file.url,count: downvotes+1 }),
      });

      const data = await response.json();
      if (data.success) {
        setDownvotes(downvotes + 1);
      }
    } catch (error) {
      console.error("Error downvoting the document:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 cursor-pointer">
      <div onClick={() => window.open(file.url, "_blank")}>
        <h2 className="text-xl font-semibold text-gray-800">{file.title}</h2>
        <h3 className="text-md font-medium text-gray-600 mb-2">{file.description}</h3>
        <p className="text-sm text-gray-500">By {file.author}</p>
      </div>

      <div className="mt-4 flex items-center justify-start space-x-4">
        {/* Upvote Button */}
        <button
          onClick={handleUpvote}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition duration-200"
        >
          <span role="img" aria-label="upvote">👍</span>
          <span>{upvotes}</span>
        </button>

        {/* Downvote Button */}
        <button
          onClick={handleDownvote}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition duration-200"
        >
          <span role="img" aria-label="downvote">👎</span>
          <span>{downvotes}</span>
        </button>
      </div>
    </div>
  );
};

export default FileCard;
