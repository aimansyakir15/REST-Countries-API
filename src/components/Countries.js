import { useState, useEffect } from "react";
import Article from "./Article";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "./Footer";

export default function Countries({ isDarkMode, toggleDarkMode }) {
  const [countries, setCountries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      try {
        const url = searchText.trim()
          ? `https://restcountries.com/v3.1/name/${searchText}`
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
      } finally {
        setLoading(false);
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
        <h1>{error}</h1>
      ) : loading ? ( // Check if loading !countries.length ? (
        <div className="flex items-center justify-center min-h-screen">
          {/* Use min-h-screen to take full height */}
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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

          <Footer isDarkMode={isDarkMode} />
        </section>
      )}
    </>
  );
}
