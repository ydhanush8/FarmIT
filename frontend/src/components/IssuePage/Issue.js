import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../API";
import { toast } from "react-toastify";
import Navbar from "../Navbar/Navbar";
import "./Issue.css";

const Issue = () => {
  const { userType } = useParams();
  const [issueData, setIssueData] = useState({
    issueTitle: "",
    issueDiscription: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setIssueData({ ...issueData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/issue/add-issue", {
        ...issueData,
      });
      toast.success("Issue submitted successfully!");
      navigate("/userIssuesPage");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error submitting the issue"
      );
    }
  };

  return (
    <>
      <Navbar UserType={userType} />
      <div className="issue-container">
        <h2 className="issue-title">Report an Issue</h2>
        <form className="issue-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="issueTitle"
            placeholder="Issue Title"
            value={issueData.issueTitle}
            onChange={handleChange}
            required
            className="issue-input"
          />
          <textarea
            name="issueDiscription"
            placeholder="Describe your issue"
            value={issueData.issueDiscription}
            onChange={handleChange}
            required
            className="issue-textarea"
          />
          <button type="submit" className="issue-submit-button">
            Submit Issue
          </button>
        </form>
      </div>
    </>
  );
};

export default Issue;
