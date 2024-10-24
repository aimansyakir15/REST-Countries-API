import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function SingleCountry({ isDarkMode, toggleDarkMode }) {
  const [country, setCountry] = useState([]);
  const [borderCountries, setBorderCountries] = useState([]);
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getSingleCountry = async (countryName) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        `https://restcountries.com/v3.1/name/${countryName}?fullText=true`
      );
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setCountry(data);

        if (data[0].borders?.length) {
          const borderRes = await fetch(
            `https://restcountries.com/v3.1/alpha?codes=${data[0].borders.join(
              ","
            )}`
          );
          const borderData = await borderRes.json();
          setBorderCountries(borderData);
        } else {
          setBorderCountries([]);
        }
      } else {
        setError(true);
      }
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSingleCountry(decodedName);
  }, [decodedName]);

  return (
    <>
      {/* Header */}
      <header
        className={`flex items-center justify-between p-4 mb-8 shadow-md transition-background-color duration-1000 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
        style={{ boxShadow: "0 2px 8px rgba(99,99,99,.2)" }}
      >
        <h1
          className={`text-[14px] font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Where in the world?
        </h1>
        <button
          onClick={toggleDarkMode}
          className="text-[14px] px-4 py-2 rounded transition-transform duration-1000 hover:scale-105"
          style={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}
        >
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          {isDarkMode ? " Light Mode" : " Dark Mode"}
        </button>
      </header>

      <Link
        to="/"
        className={`inline-block py-1 px-4 rounded-[4px] shadow transition-all duration-200 mb-4 ml-4 ${
          isDarkMode
            ? "bg-[#2b3945] text-white hover:bg-gray-700"
            : "bg-white text-gray-700 hover:bg-gray-200"
        }`}
        style={{
          boxShadow: "0 3px 8px rgba(0,0,0,.24)",
        }}
      >
        <span className={`${isDarkMode ? "text-white" : "text-gray-700"}`}>
          &larr;
        </span>{" "}
        Back
      </Link>

      {/* Country details */}
      <section className="flex flex-col md:flex-row justify-between items-start gap-8 max-w-7xl p-4 mx-auto">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Failed to load country data. Please try again.</p>
        ) : country.length > 0 ? (
          country.map((item) => {
            const nativeName = item.name?.nativeName
              ? Object.values(item.name.nativeName)[0]?.common
              : "N/A";

            const currencies = item.currencies
              ? Object.values(item.currencies)
                  .map((currency) => currency.name)
                  .join(", ")
              : "N/A";

            const languages = item.languages
              ? Object.values(item.languages).join(", ")
              : "N/A";

            const capital =
              item.capital &&
              Array.isArray(item.capital) &&
              item.capital.length > 0
                ? item.capital[0]
                : "No capital";

            return (
              <div
                key={item.cca3}
                className="grid grid-cols-1 gap-8 md:grid-cols-2 md:place-items-center w-full"
              >
                <article className="flex justify-center items-center w-full">
                  <img
                    src={item.flags.svg}
                    alt={item.name.common}
                    className="w-full h-auto max-w-[400px] max-h-[300px] object-cover shadow-md"
                    onError={(e) =>
                      (e.target.src = "/path-to-placeholder-image.png")
                    }
                  />
                </article>

                <article className="w-full">
                  <h1
                    className={`mb-6 font-bold ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    } text-2xl lg:text-4xl`}
                  >
                    {item.name.common}
                  </h1>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ul className="flex flex-col gap-2">
                      <li>
                        <span
                          className={`font-bold ${
                            isDarkMode ? "text-gray-200" : "text-black"
                          }`}
                          style={{
                            color: isDarkMode ? "#FFFFFF" : "#111517",
                            fontSize: "14px",
                          }}
                        >
                          Native Name:
                        </span>{" "}
                        <span
                          className={`${
                            isDarkMode ? "text-white-400" : "text-gray-500"
                          }`}
                          style={{
                            color: isDarkMode ? "#FFFFFF" : "#111517",
                            fontSize: "14px",
                          }}
                        >
                          {nativeName || "N/A"}
                        </span>
                      </li>
                      <li>
                        <span
                          className={`font-bold ${
                            isDarkMode ? "text-gray-200" : "text-black"
                          }`}
                          style={{
                            color: isDarkMode ? "#FFFFFF" : "#111517",
                            fontSize: "14px",
                          }}
                        >
                          Capital:
                        </span>{" "}
                        <span
                          className={`${
                            isDarkMode ? "text-white-400" : "text-gray-500"
                          }`}
                          style={{
                            color: isDarkMode ? "#FFFFFF" : "#111517",
                            fontSize: "14px",
                          }}
                        >
                          {capital}
                        </span>
                      </li>
                      <li>
                        <span
                          className={`font-bold ${
                            isDarkMode ? "text-gray-200" : "text-black"
                          }`}
                          style={{
                            color: isDarkMode ? "#FFFFFF" : "#111517",
                            fontSize: "14px",
                          }}
                        >
                          Population:
                        </span>{" "}
                        <span
                          className={`${
                            isDarkMode ? "text-white-400" : "text-gray-500"
                          }`}
                          style={{
                            color: isDarkMode ? "#FFFFFF" : "#111517",
                            fontSize: "14px",
                          }}
                        >
                          {item.population?.toLocaleString() || "N/A"}
                        </span>
                      </li>
                      <li>
                        <span
                          className={`font-bold ${
                            isDarkMode ? "text-gray-200" : "text-black"
                          }`}
                          style={{
                            color: isDarkMode ? "#FFFFFF" : "#111517",
                            fontSize: "14px",
                          }}
                        >
                          Region:
                        </span>{" "}
                        <span
                          className={`${
                            isDarkMode ? "text-white-400" : "text-gray-500"
                          }`}
                          style={{
                            color: isDarkMode ? "#FFFFFF" : "#111517",
                            fontSize: "14px",
                          }}
                        >
                          {item.region || "N/A"}
                        </span>
                      </li>
                      {item.subregion && (
                        <li>
                          <span
                            className={`font-bold ${
                              isDarkMode ? "text-gray-200" : "text-black"
                            }`}
                            style={{
                              color: isDarkMode ? "#FFFFFF" : "#111517",
                              fontSize: "14px",
                            }}
                          >
                            Subregion:
                          </span>{" "}
                          <span
                            className={`${
                              isDarkMode ? "text-white-400" : "text-gray-500"
                            }`}
                            style={{
                              color: isDarkMode ? "#FFFFFF" : "#111517",
                              fontSize: "14px",
                            }}
                          >
                            {item.subregion}
                          </span>
                        </li>
                      )}
                    </ul>

                    <ul className="flex flex-col gap-2">
                      <li>
                        <span
                          className={`font-bold ${
                            isDarkMode ? "text-gray-200" : "text-black"
                          }`}
                          style={{
                            color: isDarkMode ? "#FFFFFF" : "#111517",
                            fontSize: "14px",
                          }}
                        >
                          Top Level Domain:
                        </span>{" "}
                        <span
                          className={`${
                            isDarkMode ? "text-white-400" : "text-gray-500"
                          }`}
                          style={{
                            color: isDarkMode ? "#FFFFFF" : "#111517",
                            fontSize: "14px",
                          }}
                        >
                          {item.tld ? item.tld[0] : "N/A"}
                        </span>
                      </li>
                      <li>
                        <span
                          className={`font-bold ${
                            isDarkMode ? "text-gray-200" : "text-black"
                          }`}
                          style={{
                            color: isDarkMode ? "#FFFFFF" : "#111517",
                            fontSize: "14px",
                          }}
                        >
                          Currency:
                        </span>{" "}
                        <span
                          className={`${
                            isDarkMode ? "text-white-400" : "text-gray-500"
                          }`}
                          style={{
                            color: isDarkMode ? "#FFFFFF" : "#111517",
                            fontSize: "14px",
                          }}
                        >
                          {currencies || "N/A"}
                        </span>
                      </li>
                      <li>
                        <span
                          className={`font-bold ${
                            isDarkMode ? "text-gray-200" : "text-black"
                          }`}
                          style={{
                            color: isDarkMode ? "#FFFFFF" : "#111517",
                            fontSize: "14px",
                          }}
                        >
                          Languages:
                        </span>{" "}
                        <span
                          className={`${
                            isDarkMode ? "text-white-400" : "text-gray-500"
                          }`}
                          style={{
                            color: isDarkMode ? "#FFFFFF" : "#111517",
                            fontSize: "14px",
                          }}
                        >
                          {languages || "N/A"}
                        </span>
                      </li>
                    </ul>
                  </div>
                  {/* Border Countries */}
                  <div className="mt-8">
                    <h3
                      className={`text-lg mb-2 ${
                        isDarkMode ? "text-gray-200" : "text-black"
                      }`}
                      style={{
                        color: isDarkMode ? "#FFFFFF" : "#111517",
                        fontSize: "14px",
                      }}
                    >
                      Border Countries:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {borderCountries.length > 0 ? (
                        borderCountries.map((border) => (
                          <Link
                            key={border.cca3}
                            to={`/country/${border.name.common}`}
                            className={`block px-2 py-1 rounded shadow text-[14px] transition-all hover:scale-105 ${
                              isDarkMode
                                ? "bg-[#2b3945] text-white hover:bg-gray-700"
                                : "bg-white text-gray-700 hover:bg-gray-200"
                            }`}
                            style={{
                              boxShadow: "0 3px 8px rgba(0,0,0,.24)",
                            }}
                          >
                            {border.name.common}
                          </Link>
                        ))
                      ) : (
                        <p
                          className={`mt-2 ${
                            isDarkMode ? "text-gray-200" : "text-black"
                          }`}
                          style={{
                            color: isDarkMode ? "#FFFFFF" : "#111517",
                            fontSize: "14px",
                          }}
                        >
                          No border countries
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            );
          })
        ) : (
          <p>Failed to load country data. Please try again.</p>
        )}
      </section>
    </>
  );
}
