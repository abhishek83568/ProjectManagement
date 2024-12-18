import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmployeePage = () => {
  const [project, setProject] = useState({});
  const [employer, setEmployer] = useState({});
  const [employee, setEmployee] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [marks, setMarks] = useState(0);
  const navigate = useNavigate();
  const [marksStatus, setMarksStatus] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));
  const fetchProject = async () => {
    try {
      const response = await fetch(
        `https://projectmanagement-l4e1.onrender.com/project/get-myEmployeeProject`,
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
        setProject(data.Project);
        setEmployer(data.employer);
        setEmployee(data.employee);
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

  const handleAcceptance = async () => {
    try {
      const response = await fetch(
        "https://projectmanagement-l4e1.onrender.com/project/update-assignProject",
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        fetchProject();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (e) => {
    try {
      const response = await fetch(
        `https://projectmanagement-l4e1.onrender.com/status/change-status`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: e.target.value }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMarks = async () => {
    try {
      const response = await fetch(
        `https://projectmanagement-l4e1.onrender.com/status/get-marks`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.marks !== undefined) {
        console.log(data);
        setMarks(data.marks.marks);
        setMarksStatus(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProject();
  }, []);
  return (
    <div>
      <nav id="navbar">
        <h1>Employee Dashboard</h1>
        <button onClick={fetchProject}>My Project</button>
        {isLoggedIn ? <button onClick={handleLogout}>logout</button> : null}
      </nav>

      {!project || Object.keys(project).length === 0 ? (
        <div>
          <p>No Project Found</p>
        </div>
      ) : employee.isAssigned ? (
        <div>
          <h1>Track Your Project Status and Marks</h1>
          <table>
            <thead>
              <tr>
                <td>Title</td>
                <td>Status</td>
                <td>Assigned By</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              <tr key={project._id}>
                <td>{project.title}</td>
                <td>
                  <select
                    name="status"
                    id="status"
                    onChange={handleStatusChange}
                  >
                    <option value="">Update Your Project Progress</option>
                    <option value="Started">Started</option>
                    <option value="InProgress">In-Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>{employer.userName}</td>
                <td>
                  <button onClick={getMarks}>Get Marks</button>
                </td>
              </tr>
            </tbody>
          </table>

          <div>
            {marks != null && marksStatus ? (
              <h1>Congratulations.You Got {marks}.</h1>
            ) : (
              <h1>
                Please update the status and click on Getmarks to see your
                score.{" "}
              </h1>
            )}
          </div>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <td>Title</td>
              <td>Description</td>
              <td>Assigned By</td>
              <td>Created At</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            <tr key={project._id}>
              <td>{project.title}</td>
              <td>{project.description}</td>
              <td>{employer.userName}</td>
              <td>{project.createdAt}</td>
              <td>
                <button onClick={handleAcceptance}>Accept</button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeePage;
