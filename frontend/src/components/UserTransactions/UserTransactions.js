import React, { useState, useEffect } from "react";
import "./UserTransactions.css";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";
import API from "../../API";

const UserTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/transactions/my-transactions");
      setTransactions(data.transactions);
      setUserType(data.role);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <>
      <Navbar UserType={userType} />
      <div className="user-transactions">
        <div className="dashboard-content">
          <div className="transactions-title">
            <h1>My Transactions</h1>
          </div>
          {loading ? (
            <p className="loading-message">Loading transactions...</p>
          ) : (
            <div className="transactions-list">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div key={transaction._id} className="transaction-card">
                    <h2>Type: {transaction.type}</h2>
                    <p>
                      <strong>Amount:</strong> Rs{" "}
                      {transaction.amount.toFixed(2)}
                    </p>
                    <p>
                      <strong>From:</strong> {transaction.from.firstName}{" "}
                      {transaction.from.lastName}
                    </p>
                    <p>
                      <strong>To:</strong> {transaction.to.firstName}{" "}
                      {transaction.to.lastName}
                    </p>
                    <p>
                      <strong>Status:</strong> {transaction.status}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="no-transactions">No transactions found.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Link to={`/issue/${userType}`}>
        <button className="add-issue-btn">Issue?</button>
      </Link>
    </>
  );
};

export default UserTransactions;
