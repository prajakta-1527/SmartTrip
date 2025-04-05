"use client";

import { useState } from "react";
import axios from "axios";

type Props = {
  onResults: (places: any[]) => void;
};

export default function GeoapifySearch({ onResults }: Props) {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("2000");
  const [category, setCategory] = useState("accommodation.hotel");
  const [minRating, setMinRating] = useState("0");
  const [maxResults, setMaxResults] = useState("20");
  const [sortBy, setSortBy] = useState("distance");
  const [loading, setLoading] = useState(false);
  const [resolvedLocation, setResolvedLocation] = useState("");

  const fetchPlaces = async () => {
    if (!location.trim()) return alert("Enter a location");
    setLoading(true);

    try {
      const res = await axios.post("/api/geoapify", {
        location,
        radius,
        category,
        minRating,
        maxResults,
        sortBy,
      });

      onResults(res.data.features || []);
      setResolvedLocation(res.data.resolvedLocation || location);
    } catch (error) {
      console.error("Geoapify error:", error);
      alert("Error fetching places.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-lg font-bold mb-2">Search Nearby Places</h2>

      {resolvedLocation && (
        <p className="text-sm text-gray-500 mb-2">
          Searching near: <span className="font-medium">{resolvedLocation}</span>
        </p>
      )}

      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Enter a location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="accommodation.hotel">Hotels</option>
          <option value="catering.restaurant">Restaurants</option>
          <option value="tourism.attraction">Attractions</option>
          <option value="commercial.shopping_mall">Shopping Malls</option>
          
          <option value="entertainment.museum">Museums</option>
          {/* <option value="leisure.swimming_pool">Swimming Pools</option> */}
          {/* <option value="entertainment.nightclub">Nightclubs</option> */}
          {/* <option value="entertainment.fitness_centre">Fitness Centres</option> */}
          <option value="sport.sports_centre">Sports Centres</option>
        </select>




        <select
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="1000">1 km</option>
          <option value="2000">2 km</option>
          <option value="5000">5 km</option>
          <option value="10000">10 km</option>
          <option value="20000">20 km</option>
        </select>

        <input
          type="number"
          placeholder="Minimum Rating (0 - 5)"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="border p-2 rounded"
          min={0}
          max={5}
          step={0.1}
        />

        <input
          type="number"
          placeholder="Max Results"
          value={maxResults}
          onChange={(e) => setMaxResults(e.target.value)}
          className="border p-2 rounded"
          min={1}
          max={100}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="distance">Sort by Distance</option>
          <option value="rating">Sort by Rating</option>
        </select>

        <button
          onClick={fetchPlaces}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
}
