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
          aria-label={isDarkMode ? "Activate Light Mode" : "Activate Dark Mode"}
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
          <div className="text-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
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
      <footer
        className={`p-5 mt-44 text-center transition-background-color duration-1000 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"
        }`}
        style={{ boxShadow: "0 -2px 8px rgba(99,99,99,.2)" }}
      >
        <p>2024 © Aiman Syakir.</p>
      </footer>
    </>
  );
}
