import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const CreateProject = () => {
  const navigate = useNavigate();
  const [isCreate, setIsCreate] = useState(true);
  const [createProject, setCreateProject] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });
  const [employees, setEmployees] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://projectmanagement-l4e1.onrender.com/project/create-project`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearers ${token}`,
          },
          body: JSON.stringify({
            title: createProject.title,
            description: createProject.description,
            assignedTo: createProject.assignedTo,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Project Created successfully");
        setCreateProject({
          title: "",
          description: "",
          assignedTo: "",
        });
        navigate("/employer");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await fetch(
        `https://projectmanagement-l4e1.onrender.com/project/get-unassignedEmployee`,
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
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchEmployee();
  }, []);
  return (
    <div>
      <nav id="navbar">
        <h1>Employer Dashboard</h1>
        <button onClick={() => navigate("/employer")}>ProjectList</button>
        <button onClick={() => setIsCreate(!isCreate)}>
          {isCreate ? "Close Form" : "Create Form"}
        </button>
      </nav>

      {isCreate && (
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                onChange={handleChange}
                value={createProject.title}
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                name="description"
                onChange={handleChange}
                value={createProject.description}
              />
            </div>
            <div>
              <label>AssignedTo:</label>
              <select
                name="assignedTo"
                onChange={handleChange}
                value={createProject.assignedTo}
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
      )}
    </div>
  );
};

export default CreateProject;
