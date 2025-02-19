import React, { useState } from "react";
import API from "../../API";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Register.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", formData);
      localStorage.setItem("token", data.token);
      toast.success("Login successful!");
      if (data.role === "investor") navigate("/investorFeed");
      else if (data.role === "farmer") navigate("/farmerDashboard");
      else if (data.role === "admin") navigate("/adminUsersDashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error during login");
    }
  };

  return (
    <div className="main-container">
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <h4>
          If you have't Registered,{" "}
          <Link to="/register" className="link">
            Register
          </Link>{" "}
        </h4>
        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
