import React, { useState, useEffect } from "react";
import RecipeList from "./components/RecipeList";
import Login from "./components/Login";
import Register from "./components/Register";
import axios from "./api";
import "./App.css"; // Import our custom CSS

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Recipes App</h1>

      {token ? (
        <div>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
          <RecipeList />
        </div>
      ) : (
        <div className="auth-container">
          <Login setToken={setToken} />
          <Register />
        </div>
      )}
    </div>
  );
}

export default App;
