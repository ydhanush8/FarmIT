import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar/Navbar";
import API from "../../../API";
import "./AdminIssuesDashboard.css";

const AdminIssuesDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const response = await API.get("/issue/all-issues");
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar UserType={"admin"} />
      <div className="admin-dashboard">
        <div className="dashboard-content">
          <h1>Admin Issues Dashboard</h1>
          {loading ? (
            <p className="loading-message">
              <strong>Loading issues...</strong>
            </p>
          ) : issues.length > 0 ? (
            <div className="issue-list">
              {issues.map((issue) => (
                <div key={issue._id} className="issue-card">
                  <h2>{issue.issueTitle}</h2>
                  <p>
                    <strong>Reported By:</strong> {issue.user.firstName}{" "}
                    {issue.user.lastName}
                  </p>
                  <p>
                    <strong>Description:</strong> {issue.issueDiscription}
                  </p>
                  <p>
                    <strong>Reported On:</strong>{" "}
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-issues">No issues reported.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminIssuesDashboard;
