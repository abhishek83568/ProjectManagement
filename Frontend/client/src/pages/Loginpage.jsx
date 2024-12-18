import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(
        "https://projectmanagement-l4e1.onrender.com/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: login.email,
            password: login.password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        console.log("Login successful", data);
        localStorage.setItem("token", JSON.stringify(data.token));
        if (data.user.role === "employer") {
          navigate("/employer");
        } else {
          navigate("/employee");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div>
      <h1 id="loginTitle">Login </h1>
      <div id="project-container">
        <form onSubmit={handleSubmit}>
          <div className="form_input">
            <label htmlFor="email">Enter your Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              value={login.email}
            />
          </div>
          <div className="form_input">
            <label htmlFor="password">Enter your password:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              value={login.password}
            />
          </div>

          <input type="submit" value="Login" id="submit" />
          <p>
            User not registered ? <a href="/">Register Now</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
