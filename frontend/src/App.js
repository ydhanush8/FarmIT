import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import { ToastContainer } from "react-toastify";
import HomePage from "./components/HomePage/HomePage";
import InvestorFeed from "./components/InvestorFeed/InvestorFeed";
import InvestorDashboard from "./components/InvestorDashboard/InvestorDashboard";
import FarmerDashboard from "./components/FarmerDashboard/FarmerDashboard/FarmerDashboard";
import AddFarm from "./components/FarmerDashboard/AddFarm/AddFarm";
import LoanRequest from "./components/FarmerDashboard/LoanRequest/LoanRequest";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/investorFeed" element={<InvestorFeed />} />
          <Route path="/investorDashboard" element={<InvestorDashboard />} />
          <Route path="/farmerDashboard" element={<FarmerDashboard />} />
          <Route path="/addFarm" element={<AddFarm />} />
          <Route path="/loanRequest/:farmId" element={<LoanRequest />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
