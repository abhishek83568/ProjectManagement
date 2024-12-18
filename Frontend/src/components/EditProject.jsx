import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editProject, setEditProject] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });
  const [employees, setEmployees] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:7453/project/update-projectDesc/${id}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editProject.title,
            description: editProject.description,
            assignedTo: editProject.assignedTo,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        navigate("/employer");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await fetch(
        `http://localhost:7453/project/get-unassignedEmployee`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setEmployees(data.employeeList);
        navigate("/employer");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <nav id="navbar">
        <h1>Employer Dashboard</h1>
        <button onClick={fetchEmployee}>ProjectList</button>
      </nav>
      <h1 id="loginTitle">Edit Project</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            value={editProject.title}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            onChange={handleChange}
            value={editProject.description}
          />
        </div>
        <div>
          <label>AssignedTo:</label>
          <select
            name="assignedTo"
            onChange={handleChange}
            value={editProject.assignedTo}
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.userName}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default EditProject;
