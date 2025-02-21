import React, { useState, useEffect } from "react";
import Navbar from ".././Navbar/Navbar";
import API from "../../API";
import { Link } from "react-router-dom";
import "./UserIssuesPage.css";

const UserIssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    fetchUserIssues();
  }, []);

  const fetchUserIssues = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/issue/user-issues");
      setIssues(data.issues);
      setUserType(data.role);
    } catch (error) {
      console.error("Error fetching user issues:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar UserType={userType} />
      <div className="user-issues-container">
        <div className="user-issues-content">
          <h1>Your Reported Issues</h1>
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
            <p className="no-issues">No issues reported yet.</p>
          )}
        </div>
      </div>
      <Link to={`/issue/investor`}>
        <button className="add-issue-btn">Issue?</button>
      </Link>
    </>
  );
};

export default UserIssuesPage;
