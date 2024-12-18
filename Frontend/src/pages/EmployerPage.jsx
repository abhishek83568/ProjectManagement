import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmployerPage = () => {
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));

  const handleClick = () => {
    setIsCreate(!isCreate);
    navigate("/employer/projects");
  };

  const fetchEmployee = async () => {
    try {
      const response = await fetch(
        `https://projectmanagement-l4e1.onrender.com/project/get-myProject`,
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
        console.log(data);
        setProjectList(data.projectList);
        setEmployeeList(data.employeeList);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteProject = async (id) => {
    try {
      const response = await fetch(
        `https://projectmanagement-l4e1.onrender.com/project/delete-project/${id}`,
        {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        fetchEmployee();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `https://projectmanagement-l4e1.onrender.com/user/logout`,
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
        alert(data.message);
        setIsLoggedIn(false);
        navigate("/login");
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
        <button onClick={fetchEmployee}>ProjectList</button>
        <button onClick={handleClick}>
          {isCreate ? "Close Form" : "Create Form"}
        </button>

        {isLoggedIn ? <button onClick={handleLogout}>logout</button> : null}
      </nav>

      {projectList.length === 0 ? (
        <div>
          <p>No Project Found</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <td>Title</td>
              <td>Description</td>
              <td>Assigned To</td>
              <td>Created At</td>
              <td>Edit</td>
              <td>Delete</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {projectList.map((project, index) => (
              <tr key={project._id}>
                <td>{project.title}</td>
                <td>{project.description}</td>
                <td>
                  {employeeList.find((ele) => ele._id === project.assignedTo)
                    ?.userName || "N/A"}
                </td>
                <td>{project.createdAt}</td>
                <td>
                  <button onClick={() => navigate(`/employer/${project._id}`)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button onClick={() => deleteProject(project._id)}>
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/employer/track/${project._id}`)}
                  >
                    Track Progress
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployerPage;
