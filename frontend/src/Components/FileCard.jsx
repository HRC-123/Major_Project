import { useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { toast } from "react-toastify";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const FileCard = ({ file }) => {
  const [upvotes, setUpvotes] = useState(file.upvote ? file.upvote.length : 0);
  const [downvotes, setDownvotes] = useState(
    file.downvote ? file.downvote.length : 0
  );

  const { googleLoginDetails } = useGlobalContext();
  const { email } = googleLoginDetails;

  // Function to handle upvote
  const handleUpvote = async () => {
    if (!email) {
      toast.error("Please login to vote.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: file.title, email }),
      });

      const data = await response.json();
      if (data.success) {
        if (upvotes === data.upvoteCount) {
          toast.success("Already Upvoted");
        } else {
          toast.success("Upvoted Successfully");
        }
        setDownvotes(data.downvoteCount);
        setUpvotes(data.upvoteCount);
      }
    } catch (error) {
      console.error("Error upvoting the document:", error);
      toast.error("Error upvoting the document.");
    }
  };

  // Function to handle downvote
  const handleDownvote = async () => {
    if (!email) {
      toast.error("Please login to vote.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/downvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: file.title, email }),
      });

      const data = await response.json();
      if (data.success) {
        if (upvotes === data.upvoteCount) {
          toast.success("Already Downvoted");
        } else {
          toast.success("Downvoted Successfully");
        }
        setDownvotes(data.downvoteCount);
        setUpvotes(data.upvoteCount);
      }
    } catch (error) {
      console.error("Error downvoting the document:", error);
      toast.error("Error downvoting the document.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform cursor-pointer">
      <div
        onClick={() =>
          window.open(
            file.url.startsWith("http") ? file.url : `https://${file.url}`,
            "_blank"
          )
        }
      >
        <h2 className="text-xl font-semibold text-gray-800">{file.title}</h2>
        <h3 className="text-md font-medium text-gray-600 mb-2">
          {file.description}
        </h3>
        <p className="text-sm text-gray-500">By {file.author}</p>
      </div>

      <div className="mt-4 flex items-center justify-start space-x-4">
        {/* Upvote Button */}
        <button
          onClick={handleUpvote}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold 
                    hover:bg-blue-600 transition duration-200 transform hover:scale-105 active:scale-95"
        >
          <ThumbsUp className="w-5 h-5" />
          <span>{upvotes}</span>
        </button>

        {/* Downvote Button */}
        <button
          onClick={handleDownvote}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-500 text-white font-semibold 
                    hover:bg-gray-600 transition duration-200 transform hover:scale-105 active:scale-95"
        >
          <ThumbsDown className="w-5 h-5" />
          <span>{downvotes}</span>
        </button>
      </div>
    </div>
  );
};

export default FileCard;
