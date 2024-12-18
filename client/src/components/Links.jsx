import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Loginpage from "../pages/Loginpage";
import EmployerPage from "../pages/EmployerPage";
import EmployeePage from "../pages/EmployeePage";
import CreateProject from "../pages/CreateProject";
import EditProject from "./EditProject";
import TrackProject from "./TrackProject";

const Links = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/employer" element={<EmployerPage />} />
        <Route path="/employee" element={<EmployeePage />} />
        <Route path="/employer/projects" element={<CreateProject />} />
        <Route path="/employer/:id" element={<EditProject />} />
        <Route path="/employer/track/:id" element={<TrackProject />} />
      </Routes>
    </div>
  );
};

export default Links;
