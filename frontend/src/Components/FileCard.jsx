import { useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { toast } from "react-hot-toast";
import {
  ThumbsUp,
  ThumbsDown,
  X,
  ExternalLink,
  Flag,
  FileText,
} from "lucide-react";

const FileCard = ({ file }) => {
  const [upvotes, setUpvotes] = useState(file.upvote ? file.upvote.length : 0);
  const [downvotes, setDownvotes] = useState(
    file.downvote ? file.downvote.length : 0
  );
  const [reportActive, setReportActive] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const { googleLoginDetails } = useGlobalContext();
  const { email, name } = googleLoginDetails;

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

  const handleReportSubmit = async (e) => {
    e.preventDefault();

    if (!reportReason.trim()) {
      toast.error("Please provide a reason for reporting");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.title,
          author: file.author,
          type: file.type,
          year: file.year,
          semester: file.semester,
          branch: file.branch,
          subject: file.subject,
          subjectcode: file.subjectcode,
          description: file.description,
          url: file.url,
          reporterEmail: email,
          reporterName: name,
          reportReason,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Report submitted successfully!");
        setReportReason("");
        setReportActive(false);
      } else {
        toast.error(data.error || "Failed to submit report");
      }
    } catch (err) {
      console.error("Report submission error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const openFile = () => {
    window.open(
      file.url.startsWith("http") ? file.url : `https://${file.url}`,
      "_blank"
    );
  };

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition duration-300 border-l-4 border-[#800000]">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-grow">
            <div className="flex items-start mb-1">
              <FileText className="w-5 h-5 text-[#800000] mr-2 mt-1 flex-shrink-0" />
              <h2
                className="text-xl font-semibold text-gray-800 hover:text-[#800000] cursor-pointer transition"
                onClick={openFile}
              >
                {file.title}
              </h2>
            </div>

            {file.description && (
              <p className="text-md text-gray-600 mb-2 ml-7">
                {file.description}
              </p>
            )}

            <div className="flex flex-wrap items-center ml-7 mb-3">
              <span className="text-sm text-gray-500 mr-4">
                By <span className="font-medium">{file.author}</span>
              </span>

              {file.type && (
                <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                  {file.type}
                </span>
              )}
              {file.subject && (
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded">
                  {file.subject}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end justify-between">
            <button
              onClick={() =>
                !email || !name
                  ? toast.error("Please login to report.")
                  : setReportActive(true)
              }
              className="text-sm text-red-500 font-medium hover:underline flex items-center"
            >
              <Flag className="w-4 h-4 mr-1" />
              Report
            </button>

            <button
              onClick={openFile}
              className="mt-4 px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#600000] transition flex items-center text-sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Resource
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleUpvote}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-500 text-white font-medium 
                hover:bg-blue-600 transition duration-200 transform hover:scale-105 active:scale-95 text-sm"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{upvotes}</span>
            </button>

            <button
              onClick={handleDownvote}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-500 text-white font-medium 
                hover:bg-gray-600 transition duration-200 transform hover:scale-105 active:scale-95 text-sm"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{downvotes}</span>
            </button>
          </div>

          <div className="flex flex-wrap justify-end">
            {file.year && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                Year {file.year}
              </span>
            )}
            {file.semester && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                Semester {file.semester}
              </span>
            )}
            {file.branch && (
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {file.branch}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Report Overlay */}
      {reportActive && (
        <div className="fixed inset-0 z-50 flex">
          {/* Blurred Backdrop */}
          <div
            className="flex-1 backdrop-blur-sm bg-black/20"
            onClick={() => setReportActive(false)}
          ></div>

          {/* Sidebar */}
          <div className="w-full max-w-2xl h-screen bg-white shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out translate-x-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#800000] flex items-center">
                <Flag className="w-5 h-5 mr-2" />
                Report Document
              </h2>
              <button
                onClick={() => setReportActive(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-6">
              {/* Document Info Section */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                <h3 className="font-medium text-gray-700 mb-3">
                  Document Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">
                      Title
                    </label>
                    <div className="p-2 bg-white border border-gray-200 rounded text-sm text-gray-800">
                      {file.title}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">
                      Author
                    </label>
                    <div className="p-2 bg-white border border-gray-200 rounded text-sm text-gray-800">
                      {file.author}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">
                      Type
                    </label>
                    <div className="p-2 bg-white border border-gray-200 rounded text-sm text-gray-800">
                      {file.type}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">
                      Subject
                    </label>
                    <div className="p-2 bg-white border border-gray-200 rounded text-sm text-gray-800">
                      {file.subject} ({file.subjectcode})
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-gray-500 block mb-1">
                      Details
                    </label>
                    <div className="p-2 bg-white border border-gray-200 rounded text-sm text-gray-800">
                      Year {file.year}, Semester {file.semester}, {file.branch}
                    </div>
                  </div>

                  {file.description && (
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-gray-500 block mb-1">
                        Description
                      </label>
                      <div className="p-2 bg-white border border-gray-200 rounded text-sm text-gray-800 max-h-24 overflow-y-auto">
                        {file.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reporter Info */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                <h3 className="font-medium text-gray-700 mb-3">
                  Reporter Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">
                      Reporter Name
                    </label>
                    <div className="p-2 bg-white border border-gray-200 rounded text-sm text-gray-800">
                      {name}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">
                      Reporter Email
                    </label>
                    <div className="p-2 bg-white border border-gray-200 rounded text-sm text-gray-800">
                      {email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Reason */}
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                  <span className="text-red-500 mr-1">*</span>
                  Reason for Reporting
                </label>
                <textarea
                  placeholder="Please explain why you are reporting this document..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] transition h-32 resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific about the issue with this document.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setReportActive(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-3 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#800000] text-white rounded-md hover:bg-[#600000] transition font-medium"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FileCard;
