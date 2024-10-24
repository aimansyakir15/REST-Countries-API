import { useState, useEffect } from "react";
import Article from "./Article";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";

export default function Countries({ isDarkMode, toggleDarkMode }) {
  const [countries, setCountries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(null);
  const regions = [
    { name: "All" },
    { name: "Africa" },
    { name: "Americas" },
    { name: "Asia" },
    { name: "Europe" },
    { name: "Oceania" },
  ];

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const url = searchText.trim()
          ? `https://restcountries.com/v3.1/name/${searchText}?fullText=true`
          : "https://restcountries.com/v3.1/all";
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch data.");
        }
        const data = await res.json();
        const filteredCountries = data.filter(
          (country) => country.name.common !== "Israel"
        );
        const sortedCountries = filteredCountries.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries.slice(0, 250));
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCountries();
  }, [searchText]);

  async function filterByRegion(region) {
    try {
      const res = await fetch(
        region === "All"
          ? "https://restcountries.com/v3.1/all"
          : `https://restcountries.com/v3.1/region/${region}`
      );
      const data = await res.json();
      const filteredCountries = data.filter(
        (country) => country.name.common !== "Israel"
      );
      const sortedCountries = filteredCountries.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
      setCountries(sortedCountries);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {error ? (
        <h1 className="text-red-500 text-center text-2xl font-bold">{error}</h1>
      ) : !countries.length ? (
        <h1 className="text-gray-900 font-bold uppercase tracking-wide flex items-center justify-center text-center h-screen text-4xl">
          Loading...
        </h1>
      ) : (
        <section>
          {/* Header with Dark Mode Button */}
          <header
            className={`flex items-center justify-between p-4 mb-8 shadow-md transition-background-color duration-1000 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
            style={{ boxShadow: "0 2px 8px rgba(99,99,99,.2)" }}
          >
            <h1
              className="p-1 text-[14px] font-bold"
              style={{ fontWeight: 800 }}
            >
              Where in the world?
            </h1>
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 rounded transition-all duration-300 flex items-center gap-2"
            >
              <FontAwesomeIcon
                icon={isDarkMode ? faSun : faMoon}
                className="transition-all duration-300"
              />
              <span className="text-[14px] transition-all duration-300">
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
          </header>

          {/* Search Bar and Region Filter aligned */}
          <div className="container mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            {/* Search Bar */}
            <form
              onSubmit={(e) => e.preventDefault()}
              autoComplete="off"
              className="relative w-full md:w-1/4"
            >
              <span
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                  isDarkMode ? "text-white" : "text-gray-400"
                }`}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </span>
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search for a country..."
                required
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className={`py-2 px-10 text-gray-500 placeholder-gray-400 w-full border rounded outline-none transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-900"
                }`}
              />
            </form>

            {/* Region Filter */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="w-full md:w-1/6"
            >
              <select
                name="filter-by-region"
                id="filter-by-region"
                className={`w-full py-3 px-4 outline-none shadow rounded transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-[#FFFFFF] text-gray-900"
                }`}
                onChange={(e) => filterByRegion(e.target.value)}
              >
                {regions.map((region, index) => (
                  <option key={index} value={region.name}>
                    {region.name}
                  </option>
                ))}
              </select>
            </form>
          </div>

          {/* Country Cards */}
          <div className="container mx-auto px-6 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {countries.map((country) => (
              <Article
                key={country.name.common}
                {...country}
                isDarkMode={isDarkMode}
                className="transition-all duration-300 hover:scale-105"
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
