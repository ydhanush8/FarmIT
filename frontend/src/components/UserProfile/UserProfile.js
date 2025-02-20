import React, { useEffect, useState } from "react";
import API from "../../API";
import { toast } from "react-toastify";
import "./UserProfile.css";
import Navbar from "../Navbar/Navbar";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await API.get("/users/profile");
        setUserProfile(response.data.user);
        setUserType(response.data.role);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <>
      <Navbar UserType={userType} />
      <div className="profile-container">
        <div>
          <h1>User Profile</h1>
          {loading ? (
            <p className="loading-message">Loading profile...</p>
          ) : userProfile ? (
            <div className="profile-card">
              <h2>
                <strong>First Name :</strong> {userProfile.firstName}
              </h2>
              <h2>
                <strong>Last Name :</strong> {userProfile.lastName}
              </h2>
              <h2>
                <strong>Email :</strong> {userProfile.email}
              </h2>
              <h2>
                <strong>Role :</strong> {userProfile.role}
              </h2>
              <h2>
                <strong>Verified :</strong>{" "}
                {userProfile.isVerified ? "Yes" : "No"}
              </h2>
              <h2>
                <strong>Joined :</strong>{" "}
                {new Date(userProfile.createdAt).toLocaleDateString()}
              </h2>
            </div>
          ) : (
            <p className="error-message">User profile not found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
