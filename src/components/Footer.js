import React from "react";

export default function Footer({ isDarkMode }) {
  return (
    <footer
      className={`text-center p-4 mt-8 border-t transition-all duration-300 ${
        isDarkMode
          ? "bg-gray-800 text-white border-gray-600"
          : "bg-white text-gray-800 border-gray-300"
      }`}
    >
      <p>2024 © Aiman Syakir.</p>
    </footer>
  );
}
