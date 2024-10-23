import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Countries from "./components/Countries";
import SingleCountry from "./components/SingleCountry";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
    document.body.classList.toggle("dark", savedMode);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode);
      document.body.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Pass isDarkMode and toggleDarkMode as props */}
        <Route
          path="/"
          element={
            <Countries
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
        <Route
          path="/country/:name"
          element={
            <SingleCountry
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
