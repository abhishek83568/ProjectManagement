import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TrackProject = () => {
  const { id } = useParams();
  const [project, setProject] = useState({});
  const [status, setStatus] = useState(null);
  const [employee, setEmployee] = useState({});
  const [marksUpdate, setMarksUpdate] = useState(0);
  const [marksStatus, setMarksStatus] = useState(false);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  console.log(id);

  const fetchProject = async () => {
    try {
      const response = await fetch(
        `http://localhost:7453/project/get-trackProject/${id}`,
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
        setEmployee(data.employee);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:7453/status/get-status/${id}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setStatus(data.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarksChange = (e) => {
    const value = e.target.value;
    const intValue = parseInt(value, 10);
    setMarksUpdate(isNaN(intValue) ? 0 : intValue);
  };

  const giveMarks = async () => {
    try {
      const response = await fetch(
        `http://localhost:7453/status/update-marks/${id}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            marks: marksUpdate,
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

  useEffect(() => {
    fetchProject();
    fetchStatus();
  }, []);

  return (
    <div>
      <nav id="navbar">
        <h1>Employer Dashboard</h1>
        <button onClick={fetchProject}>My Project</button>
      </nav>

      {!project || Object.keys(project).length === 0 ? (
        <div>
          <p>No Project Found</p>
        </div>
      ) : employee.isAssigned ? (
        <div>
          <h1>Track Project Status and Assign Marks</h1>
          <table>
            <thead>
              <tr>
                <td>Title</td>
                <td>Status</td>
                <td>Assigned To</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              <tr key={project._id}>
                <td>{project.title}</td>
                <td>
                  <button onClick={fetchStatus}>
                    {status === null
                      ? "Project not started"
                      : status === undefined
                      ? "No Status Available"
                      : status.status}
                  </button>
                </td>
                <td>{employee.userName}</td>
                <td>
                  {!marksStatus && (
                    <button onClick={() => setMarksStatus(true)}>Marks</button>
                  )}
                  {marksStatus && (
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="number"
                        placeholder="Enter marks"
                        style={{ marginRight: "8px" }}
                        onChange={handleMarksChange}
                        value={marksUpdate === 0 ? "" : marksUpdate}
                      />
                      <button onClick={giveMarks}>Assign Marks</button>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        "EMPLOYEE HAS NOT YET ACCEPTED THE PROJECT."
      )}
    </div>
  );
};

export default TrackProject;
