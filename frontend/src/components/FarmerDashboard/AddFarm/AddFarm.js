import React, { useState } from "react";
import "./AddFarm.css";
import Navbar from "../../Navbar/Navbar";
import API from "../../../API";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddFarm = () => {
  const [farmData, setFarmData] = useState({
    name: "",
    description: "",
    location: "",
    farmType: "",
    size: "",
    productionCapacity: "",
    images: [],
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFarmData({ ...farmData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFarmData({ ...farmData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in farmData) {
      if (key === "images") {
        for (let i = 0; i < farmData.images.length; i++) {
          formData.append("images", farmData.images[i]);
        }
      } else {
        formData.append(key, farmData[key]);
      }
    }

    try {
      await API.post("/farms/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Farm added successfully!");
      navigate("/farmerDashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error during adding farm land"
      );
    }
  };

  return (
    <>
      <Navbar UserType={"farmer"} />
      <div className="add-farm-container">
        <h2>Add Farm Land</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={farmData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={farmData.description}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={farmData.location}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="farmType"
            placeholder="Farm Type"
            value={farmData.farmType}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="size"
            placeholder="Size (acres)"
            value={farmData.size}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="productionCapacity"
            placeholder="Production Capacity"
            value={farmData.productionCapacity}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="images"
            multiple
            onChange={handleImageChange}
          />
          <button type="submit">Add Farm</button>
        </form>
      </div>
    </>
  );
};

export default AddFarm;
