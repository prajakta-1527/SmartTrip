"use client";

import { useState, useEffect } from "react";

export default function WeatherWidget() {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [detailed, setDetailed] = useState(false);

  // Fetch weather data based on current location and view mode
  const fetchWeather = async () => {
    if (!location.trim()) {
      setError("Please enter at least one city.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `/api/weather?locations=${encodeURIComponent(location)}&detailed=${detailed}`
      );
      const data = await response.json();

      if (response.ok) {
        if (!data.results || data.results.length === 0) {
          setError("Weather data not found for the entered locations.");
          setWeatherData([]);
        } else {
          setWeatherData(data.results);
        }
      } else {
        setError(data.error || "Could not fetch weather data.");
        setWeatherData([]);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  // When the user toggles the detailed view, re-fetch data if we already have results.
  useEffect(() => {
    if (weatherData.length > 0) {
      // If switching view, re-fetch to update the data structure accordingly.
      fetchWeather();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailed]);

  return (
    <div className="p-4 bg-white shadow-md rounded-xl w-80 mx-auto">
      <h2 className="text-lg font-semibold mb-3">Check Weather</h2>
      <input
        type="text"
        placeholder="Enter City Names"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full p-2 border rounded-md"
      />

      <div className="mt-2 flex items-center">
        <input
          type="checkbox"
          id="detailedToggle"
          checked={detailed}
          onChange={() => setDetailed(!detailed)}
          className="mr-2"
        />
        <label htmlFor="detailedToggle">Detailed view</label>
      </div>

      <button
        onClick={fetchWeather}
        className="w-full mt-2 p-2 bg-blue-500 text-white rounded-md"
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Weather"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {weatherData.length > 0 && (
        <div className="mt-4 text-center">
          {weatherData.map((cityWeather: any, index: number) => (
            <div key={index} className="border-b pb-2 mb-2 last:border-b-0">
              <h3 className="text-xl font-semibold">{cityWeather.location}</h3>

              {detailed ? (
                <>
                  {cityWeather.severeAlert && (
                    <p className="text-red-500 font-bold">
                      Alert: {cityWeather.severeAlert}
                    </p>
                  )}
                  {/* Horizontal scrollable container */}
                  <div className="flex space-x-4 overflow-x-auto py-2">
                    {cityWeather.forecast && cityWeather.forecast.map((item: any, idx: number) => (
                      <div key={idx} className="min-w-[120px] border p-2 rounded bg-gray-50">
                        <p className="text-xs">{item.datetime}</p>
                        <p className="text-xs capitalize">{item.weather}</p>
                        <p className="text-sm font-bold">{item.temperature}°C</p>
                        <p className="text-xs">Humidity: {item.humidity}%</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg capitalize">{cityWeather.weather}</p>
                  <p className="text-2xl font-bold">{cityWeather.temperature}°C</p>
                  <p>Humidity: {cityWeather.humidity}%</p>
                  <p>Wind Speed: {cityWeather.wind_speed} m/s</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}