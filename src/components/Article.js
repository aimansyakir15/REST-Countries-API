import React from "react";
import { Link } from "react-router-dom";

export default function Article({
  flags,
  name,
  population,
  region,
  capital,
  isDarkMode,
}) {
  return (
    <>
      <Link to={`/country/${name.common}`}>
        <article
          className={`rounded-lg shadow overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <img
            src={flags?.svg || ""}
            alt={`${name.common} flag`}
            className="md:h-52 w-full object-cover"
          />
          <div className="p-4">
            <h2
              className={`font-bold text-lg mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {name.common}
            </h2>
            <ul className="flex flex-col items-start justify-start gap-2">
              <li className={`${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Population: {population.toLocaleString()}
              </li>
              <li className={`${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Region: {region}
              </li>
              <li className={`${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Capital: {capital || "No capital"}
              </li>
            </ul>
          </div>
        </article>
      </Link>
    </>
  );
}
