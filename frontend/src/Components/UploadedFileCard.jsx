import { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { toast } from "react-hot-toast";
import {
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  X,
  ExternalLink,
  Flag,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";

const UploadedFileCard = ({ file, onFileDeleted }) => {
  const [upvotes, setUpvotes] = useState(file.upvote ? file.upvote.length : 0);
  const [downvotes, setDownvotes] = useState(
    file.downvote ? file.downvote.length : 0
  );
  const [reportActive, setReportActive] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [editActive, setEditActive] = useState(false);
  const [editForm, setEditForm] = useState({
    title: file.title,
    description: file.description || "",
    year: file.year || "",
    semester: file.semester || "",
    branch: file.branch || "",
    subject: file.subject || "",
    subjectcode: file.subjectcode || "",
    type: file.type || ""
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false); // New state to track if this card has been deleted
  
  const { googleLoginDetails } = useGlobalContext();
  const { email, name } = googleLoginDetails;
  const [bookmarked, setBookmarked] = useState(() =>
    email ? file.savedUsers?.includes(email): false
  );

  const isAuthor = email === file.authorEmail;

  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;


useEffect(() => {
  async function fetchDepartments() {
    try {
      const response = await fetch(`${SERVER_URL}/branches`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setBranches(data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  }
  fetchDepartments();
}, []);

useEffect(() => {
  async function getSubjects() {
    if (!editForm.year || !editForm.branch || !editForm.semester) return;
    try {
      const response = await fetch(
        `${SERVER_URL}/subjects?year=${editForm.year}&branch=${editForm.branch}&sem=${editForm.semester}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSubjects(data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  }
  getSubjects();
}, [editForm.year, editForm.branch, editForm.semester]);

  const handleUpvote = async () => {
    if (!email) {
      toast.error("Please login to vote.");
      return;
    }
    try {
      const response = await fetch(`${SERVER_URL}/api/upvote`, {
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

  const handleBookmark = async () => {
    if (!email) {
      toast.error("Please login to bookmark.");
      return;
    }
    
    try {
      const response = await fetch(`${SERVER_URL}/api/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: file.title, email }),
      });
      
      const data = await response.json();
      if (data.success) {
        if (data.isBookmarked) {
          toast.success("Bookmarked Successfully");
        } else {
          toast.success("Bookmark Removed");
        }
        setBookmarked(data.isBookmarked);
      }
    } catch (error) {
      console.error("Error bookmarking the document:", error);
      toast.error("Error bookmarking the document.");
    }
  };

  const handleDownvote = async () => {
    if (!email) {
      toast.error("Please login to vote.");
      return;
    }
    try {
      const response = await fetch(`${SERVER_URL}/api/downvote`, {
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
      const res = await fetch(`${SERVER_URL}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.title,
          author: file.author,
          authorEmail:file.authorEmail,
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

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editForm.title.trim()) {
      toast.error("Title is required");
      return;
    }
    // Compare old and new values
  const changes = {};
  Object.keys(editForm).forEach((key) => {
    if (editForm[key] !== file[key]) {
      changes[key] = { from: file[key], to: editForm[key] };
    }
  });

  if (Object.keys(changes).length === 0) {
    toast.info("No changes detected.");
    return;
  }

  console.log("Changes made:", changes);
    try {
      const response = await fetch(`${SERVER_URL}/api/edit-resource`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalTitle: file.title,
          authorEmail: email,
          url: file.url, // Keep the original URL
          ...editForm
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Resource updated successfully!");
        setEditActive(false);
        
        // Update the card with new information
        // In a real app, you might want to reload the data or update the parent component
        Object.assign(file, editForm);
      } else {
        toast.error(data.error || "Failed to update resource");
      }
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const initiateDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setShowDeleteConfirm(false);
  
    try {
      const response = await fetch(`${SERVER_URL}/api/delete-resource`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: file.url,
          authorEmail: email
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success("Resource deleted successfully!");
        // Mark this card as deleted
        setIsDeleted(true);
        // Notify parent component that this file was deleted
        if (onFileDeleted) {
          onFileDeleted(file.title);
        }
      } else {
        toast.error(data.error || "Failed to delete resource");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Something went wrong. Please try again.");
      setIsDeleting(false);
    }
  };

  const openFile = () => {
    window.open(
      file.url.startsWith("http") ? file.url : `https://${file.url}`,
      "_blank"
    );
  };

  // If this card is deleted, don't render anything
  if (isDeleted) {
    return null;
  }

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition duration-300 border-l-4 border-[#2C3E50]">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-grow">
            <div className="flex items-start mb-1">
              <FileText className="w-5 h-5 text-[#2C3E50] mr-2 mt-1 flex-shrink-0" />
              <h2
                className="text-xl font-semibold text-gray-800 hover:text-[#2C3E50] cursor-pointer transition"
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
            <div className="flex space-x-3">
              {isAuthor && (
                <>
                  <button
                    onClick={() => setEditActive(true)}
                    className="text-sm text-blue-600 font-medium hover:underline flex items-center"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={initiateDelete}
                    disabled={isDeleting}
                    className="text-sm text-red-600 font-medium hover:underline flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </>
              )}
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
            </div>

            <button
              onClick={openFile}
              className="mt-4 px-4 py-2 bg-[#2C3E50] text-white rounded-md hover:bg-[#36597A] transition flex items-center text-sm"
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
            <button
              onClick={handleBookmark}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium 
                transition duration-200 transform hover:scale-105 active:scale-95 text-sm
                ${
                  bookmarked
                    ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                    : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
                }`}
            >
              <Bookmark
                className={`w-4 h-4 ${bookmarked ? "fill-green-500" : ""}`}
              />
              <span>{bookmarked ? "Saved" : "Save"}</span>
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
              <h2 className="text-xl font-bold text-[#2C3E50] flex items-center">
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

                  <div className="md:col-span-2 space-y-4">
                    {/* Details Section */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Details
                      </label>
                      <div className="p-2 bg-white border border-gray-200 rounded text-sm text-gray-800">
                        Year {file.year}, Semester {file.semester},{" "}
                        {file.branch}
                      </div>
                    </div>

                    {/* Author Email Section */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Author Email
                      </label>
                      <div className="p-2 bg-white border border-gray-200 rounded text-sm text-gray-800">
                        {file.authorEmail}
                      </div>
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50] transition h-32 resize-none"
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
                  className="px-6 py-2 bg-[#2C3E50] text-white rounded-md hover:bg-[#36597A] transition font-medium"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred Backdrop */}
          <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>
          
          {/* Modal */}
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 z-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Resource</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "{file.title}"? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editActive && (
        <div className="fixed inset-0 z-50 flex">
          {/* Blurred Backdrop */}
          <div
            className="flex-1 backdrop-blur-sm bg-black/20"
            onClick={() => setEditActive(false)}
          ></div>

          {/* Sidebar */}
          <div className="w-full max-w-2xl h-screen bg-white shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out translate-x-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#2C3E50] flex items-center">
                <Pencil className="w-5 h-5 mr-2" />
                Edit Resource
              </h2>
              <button
                onClick={() => setEditActive(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                <h3 className="font-medium text-gray-700 mb-3">
                  Basic Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                      <span className="text-red-500 mr-1">*</span>
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditFormChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50] transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditFormChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50] transition h-32 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Resource URL
                    </label>
                    <div className="w-full p-3 border border-gray-200 bg-gray-100 rounded-lg text-gray-700">
                      {file.url}
                      <p className="text-xs text-gray-500 mt-1">
                        Resource URL cannot be edited
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                <h3 className="font-medium text-gray-700 mb-3">
                  Academic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Year</label>
                <select
                  name="year"
                  value={editForm.year}
                  onChange={(e) => {
                    handleEditFormChange(e);
                    setEditForm((prev) => ({
                      ...prev,
                      semester: "", // reset semester on year change
                    }));
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50] transition"
                >
                  <option value="">Select Year</option>
                  {[1, 2, 3, 4].map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
                
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Semester</label>
                <select
                  name="semester"
                  value={editForm.semester}
                  onChange={handleEditFormChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50] transition"
                  disabled={!editForm.year}
                >
                  <option value="">Select Semester</option>
                  {editForm.year && [
                    editForm.year * 2 - 1,
                    editForm.year * 2,
                  ].map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>
                
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Branch</label>
                <select
                  name="branch"
                  value={editForm.branch}
                  onChange={handleEditFormChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50] transition"
                >
                  <option value="">Select Branch</option>
                  {branches.map((br) => (
                    <option key={br.id} value={br.branch}>
                      {br.abbreviation}
                    </option>
                  ))}
                </select>
              </div>
                
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Subject</label>
                <select
                  name="subject"
                  value={editForm.subject}
                  onChange={handleEditFormChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50] transition"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((sub, index) => (
                      <option key={index} value={sub.subject}>
                        {sub.subject} ({sub.subjectcode})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Resource Type</label>
                <select
                  name="type"
                  value={editForm.type}
                  onChange={handleEditFormChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50] transition"
                >
                  <option value="">Select Resource Type</option>
                  {["Notes(or)PPT",
                      "Books",
                      "Assignments",
                      "PreviousYearPapers"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
                
              </div>
            </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditActive(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-3 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2C3E50] text-white rounded-md hover:bg-[#36597A] transition font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadedFileCard;