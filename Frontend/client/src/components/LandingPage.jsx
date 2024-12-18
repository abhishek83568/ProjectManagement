import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [register, setRegister] = useState({
    userName: "",
    email: "",
    password: "",
    role: "employee",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await fetch(
      "https://projectmanagement-l4e1.onrender.com/user/register",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userName: register.userName,
          email: register.email,
          password: register.password,
          role: register.role,
        }),
      }
    );
    const data = await res.json();
    console.log(data);
    if (data) {
      navigate("/login");
    } else {
      alert(data.message);
    }
  };
  return (
    <div>
      <h1 id="loginTitle">Project Management System</h1>
      <div id="project-container">
        <form onSubmit={handleSubmit}>
          <div className="form_input">
            <label htmlFor="userName">Enter your Name:</label>
            <input
              type="text"
              id="name"
              name="userName"
              value={register.userName}
              onChange={handleChange}
            />
          </div>
          <div className="form_input">
            <label htmlFor="role">Enter your Role:</label>
            <select
              name="role"
              id="role"
              onChange={handleChange}
              value={register.role}
            >
              <option value="">Please choose role</option>
              <option value="employer">Employer</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          <div className="form_input">
            <label htmlFor="email">Enter your Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              value={register.email}
            />
          </div>
          <div className="form_input">
            <label htmlFor="password">Enter your password:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              value={register.password}
            />
          </div>

          <input type="submit" value="Register" id="submit" />
          <p>
            Already Registered ? <a href="/login">Login Now</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
