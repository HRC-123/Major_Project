import React, { useState, useEffect } from "react";
import { ApiClient, useRecord } from "adminjs";

const SubjectManager = ({ record }) => {
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [newSubject, setNewSubject] = useState("");
  const api = new ApiClient();

  // Fetch branches when the component mounts
  useEffect(() => {
    if (record && record.params.branches) {
      setBranches(record.params.branches);
    }
  }, [record]);

  // Update semesters when a branch is selected
  useEffect(() => {
    if (selectedBranch) {
      const branch = branches.find((b) => b.branch === selectedBranch);
      setSemesters(branch.semesters || []);
    } else {
      setSemesters([]);
    }
  }, [selectedBranch]);

  // Update subjects when a semester is selected
  useEffect(() => {
    if (selectedSemester) {
      const semester = semesters.find(
        (s) => s.semester === parseInt(selectedSemester, 10)
      );
      setSubjects(semester?.subjects || []);
    } else {
      setSubjects([]);
    }
  }, [selectedSemester]);

  // Handle adding a new subject
  const handleAddSubject = async () => {
    if (!newSubject) return;

    const branchIndex = branches.findIndex((b) => b.branch === selectedBranch);
    const semesterIndex = semesters.findIndex(
      (s) => s.semester === parseInt(selectedSemester, 10)
    );

    if (branchIndex === -1 || semesterIndex === -1) return;

    const updatedBranches = [...branches];
    updatedBranches[branchIndex].semesters[semesterIndex].subjects.push({
      name: newSubject,
    });

    const response = await api.recordAction({
      resourceId: "Year",
      recordId: record.id,
      actionName: "edit",
      payload: { branches: updatedBranches },
    });

    if (response.notice.type === "success") {
      setNewSubject("");
      setBranches(updatedBranches);
      setSubjects(
        updatedBranches[branchIndex].semesters[semesterIndex].subjects
      );
    }
  };

  // Handle deleting a subject
  const handleDeleteSubject = async (subjectName) => {
    const branchIndex = branches.findIndex((b) => b.branch === selectedBranch);
    const semesterIndex = semesters.findIndex(
      (s) => s.semester === parseInt(selectedSemester, 10)
    );

    if (branchIndex === -1 || semesterIndex === -1) return;

    const updatedBranches = [...branches];
    updatedBranches[branchIndex].semesters[semesterIndex].subjects =
      subjects.filter((sub) => sub.name !== subjectName);

    const response = await api.recordAction({
      resourceId: "Year",
      recordId: record.id,
      actionName: "edit",
      payload: { branches: updatedBranches },
    });

    if (response.notice.type === "success") {
      setBranches(updatedBranches);
      setSubjects(
        updatedBranches[branchIndex].semesters[semesterIndex].subjects
      );
    }
  };

  return (
    <div>
      <h1>Manage Subjects</h1>
      <div>
        <label>Branch:</label>
        <select
          onChange={(e) => setSelectedBranch(e.target.value)}
          value={selectedBranch || ""}
        >
          <option value="" disabled>
            Select a Branch
          </option>
          {branches.map((b) => (
            <option key={b.branch} value={b.branch}>
              {b.branch}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Semester:</label>
        <select
          onChange={(e) => setSelectedSemester(e.target.value)}
          value={selectedSemester || ""}
        >
          <option value="" disabled>
            Select a Semester
          </option>
          {semesters.map((s) => (
            <option key={s.semester} value={s.semester}>
              {s.semester}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Subjects:</label>
        <ul>
          {subjects.map((subject, index) => (
            <li key={index}>
              {subject.name}
              <button onClick={() => handleDeleteSubject(subject.name)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label>Add Subject:</label>
        <input
          type="text"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
        />
        <button onClick={handleAddSubject}>Add</button>
      </div>
    </div>
  );
};

export default SubjectManager;
