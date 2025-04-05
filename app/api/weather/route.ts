import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const locationsParam = searchParams.get("locations"); // Expecting comma-separated locations
  const detailedParam = searchParams.get("detailed"); // "true" for detailed view

  if (!locationsParam) {
    return NextResponse.json({ error: "At least one location is required" }, { status: 400 });
  }

  // Convert the comma-separated list into an array
  const locations = locationsParam.split(",").map(loc => loc.trim()).filter(Boolean);
  if (locations.length === 0) {
    return NextResponse.json({ error: "Invalid locations format" }, { status: 400 });
  }

  // Load API key from environment variables
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  if (!apiKey) {
    console.error("🚨 Missing API Key! Check your .env.local file.");
    return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
  }

  try {
    const weatherResults = await Promise.all(
      locations.map(async (location) => {
        // Check if we need a detailed forecast view
        if (detailedParam === "true") {
          // Call forecast endpoint (returns 5 day / 3-hour forecast)
          const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
          console.log(`🔗 Fetching forecast for: ${location}`);
          const response = await fetch(url);
          const data = await response.json();

          if (!response.ok) {
            console.error(`❌ Error fetching forecast for ${location}:`, data);
            return { location, error: "Failed to fetch forecast data", details: data };
          }

          // Extract a simple forecast: group by day or simply return the list
          // (For simplicity, here we return the full list)
          const forecast = data.list.map((item: any) => ({
            datetime: item.dt_txt,
            temperature: item.main.temp,
            humidity: item.main.humidity,
            weather: item.weather[0].description,
            weatherMain: item.weather[0].main,
          }));

          // Check if any forecast item indicates severe weather (e.g., Thunderstorm)
          const severeForecast = forecast.find((item: any) =>
            item.weatherMain === "Thunderstorm" // adjust this condition as needed
          );
          const severeAlert = severeForecast
            ? `Severe weather expected at ${severeForecast.datetime}`
            : null;

          return {
            location,
            forecast,
            severeAlert,
          };
        } else {
          // Simple view: current weather endpoint
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
          console.log(`🔗 Fetching current weather for: ${location}`);
          const response = await fetch(url);
          const data = await response.json();

          if (!response.ok) {
            console.error(`❌ Error fetching weather for ${location}:`, data);
            return { location, error: "Failed to fetch weather data", details: data };
          }

          return {
            location,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            weather: data.weather[0].description,
            wind_speed: data.wind.speed,
          };
        }
      })
    );

    return NextResponse.json({ results: weatherResults }, { status: 200 });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return NextResponse.json({ error: "Error fetching weather data" }, { status: 500 });
  }
};