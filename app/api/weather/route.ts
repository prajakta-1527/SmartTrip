import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const locationsParam = searchParams.get("locations"); // Expecting comma-separated locations
  const detailedParam = searchParams.get("detailed"); // "true" for detailed view

  console.log("🔍 Query Params:", { locationsParam, detailedParam });
  if (!locationsParam) {
    return NextResponse.json({ error: "At least one location is required" }, { status: 400 });
  }
  const locations = JSON.parse(locationsParam);
  if (locations.length === 0) {
    return NextResponse.json({ error: "Invalid locations format" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  if (!apiKey) {
    console.error("🚨 Missing API Key! Check your .env.local file.");
    return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
  }

  try {
    let weatherResults = []
    await Promise.all(
      locations.map(async (location) => {
        // Check if we need a detailed forecast view
        console.log(location);
        const lat = location['lat']
        console.log(location['lat'])
        const lon = location['lon']
        // if (detailedParam === "true") {
        // Call forecast endpoint (returns 5 day / 3-hour forecast)
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        console.log("url", url)
        const response = await fetch(url);
        const data = await response.json();
        console.log(data)
        if (!response.ok) {
          return { location, error: "Failed to fetch forecast data", details: data };
        }

        // Extract a simple forecast: group by day or simply return the list
        // (For simplicity, here we return the full list)
        const forecast = {
          coords: data.coord,
          description: data.weather,
          temperature: data.main.temp,
          humidity: data.main.humidity,
          wind_speed: data.wind.speed
        }
        weatherResults.push(forecast);
      })
    );

    return NextResponse.json({ results: weatherResults }, { status: 200 });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return NextResponse.json({ error: "Error fetching weather data" }, { status: 500 });
  }
};