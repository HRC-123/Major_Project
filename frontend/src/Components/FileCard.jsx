import { useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { toast } from "react-hot-toast";
import { ThumbsUp, ThumbsDown, X } from "lucide-react";

const FileCard = ({ file }) => {
  const [upvotes, setUpvotes] = useState(file.upvote ? file.upvote.length : 0);
  const [downvotes, setDownvotes] = useState(
    file.downvote ? file.downvote.length : 0
  );
  const [reportActive, setReportActive] = useState(false);
  const [reportReason, setReportReason] = useState("");

  console.log("File:", file);

  const { googleLoginDetails } = useGlobalContext();
  const { email,name } = googleLoginDetails;

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
          url: file.url, // hidden but included
          reporterEmail: email,
          reporterName: name,
          reportReason,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Report submitted successfully!");
        setReportReason(""); // reset reason
        setReportActive(false); // close sidebar
      } else {
        toast.error(data.error || "Failed to submit report");
      }
    } catch (err) {
      console.error("Report submission error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };


  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform cursor-pointer relative">
        <div className="flex justify-between">
          <div
            onClick={() =>
              window.open(
                file.url.startsWith("http") ? file.url : `https://${file.url}`,
                "_blank"
              )
            }
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {file.title}
            </h2>
            <h3 className="text-md font-medium text-gray-600 mb-2">
              {file.description}
            </h3>
            <p className="text-sm text-gray-500">By {file.author}</p>
          </div>

          <div
            className="text-sm text-red-500 font-semibold cursor-pointer hover:underline"
            onClick={() =>
              !email || !name
                ? toast.error("Please login to report.")
                : setReportActive(true)
            }
          >
            Report
          </div>
        </div>

        <div className="mt-4 flex items-center justify-start space-x-4">
          <button
            onClick={handleUpvote}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold 
              hover:bg-blue-600 transition duration-200 transform hover:scale-105 active:scale-95"
          >
            <ThumbsUp className="w-5 h-5" />
            <span>{upvotes}</span>
          </button>

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

      {/* Backdrop Blur and Sidebar */}
      {reportActive && (
        <div className="fixed inset-0 z-50 flex">
          {/* Blurred Backdrop */}
          <div
            className="flex-1 backdrop-blur-sm bg-black/20"
            onClick={() => setReportActive(false)}
          ></div>

          {/* Sidebar */}
          <div className="w-[34rem] h-screen bg-white shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out translate-x-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Report Document
              </h2>
              <X
                className="w-6 h-6 text-gray-600 cursor-pointer hover:text-red-600"
                onClick={() => setReportActive(false)}
              />
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-6">
              {/* Two Column Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={file.title}
                    readOnly
                    className="mt-1 w-full p-2 border rounded bg-gray-100 text-gray-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Author
                  </label>
                  <input
                    type="email"
                    value={file.author}
                    readOnly
                    className="mt-1 w-full p-2 border rounded bg-gray-100 text-gray-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Author Email
                  </label>
                  <input
                    type="email"
                    value={file.authorEmail}
                    readOnly
                    className="mt-1 w-full p-2 border rounded bg-gray-100 text-gray-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <input
                    type="text"
                    value={file.type}
                    readOnly
                    className="mt-1 w-full p-2 border rounded bg-gray-100 text-gray-600"
                  />
                </div>

                <div className="col-span-2 grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Year
                    </label>
                    <input
                      type="text"
                      value={file.year}
                      readOnly
                      className="mt-1 w-full p-2 border rounded bg-gray-100 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Semester
                    </label>
                    <input
                      type="text"
                      value={file.semester}
                      readOnly
                      className="mt-1 w-full p-2 border rounded bg-gray-100 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Branch
                    </label>
                    <input
                      type="text"
                      value={file.branch}
                      readOnly
                      className="mt-1 w-full p-2 border rounded bg-gray-100 text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={file.subject}
                    readOnly
                    className="mt-1 w-full p-2 border rounded bg-gray-100 text-gray-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    value={file.subjectcode}
                    readOnly
                    className="mt-1 w-full p-2 border rounded bg-gray-100 text-gray-600"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 hidden">
                    URL
                  </label>
                  <input
                    type="hidden"
                    value={file.url}
                    readOnly
                    className="mt-1 w-full p-2 border rounded bg-gray-100 text-gray-600"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={file.description}
                    readOnly
                    className="mt-1 w-full p-3 border rounded h-28 bg-gray-100 text-gray-600 resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Reporter Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="mt-1 w-full p-2 border rounded bg-gray-100 text-gray-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Reporter Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    readOnly
                    className="mt-1 w-full p-2 border rounded bg-gray-100 text-gray-600"
                  />
                </div>
              </div>

              {/* Reason Field */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Reason for Reporting <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Enter your reason here..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="mt-1 w-full p-3 border rounded h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition font-semibold"
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
