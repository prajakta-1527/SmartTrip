import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "Berlin";
  const categories = searchParams.get("categories") || "tourism";
  const radius = searchParams.get("radius") || "10000"; // Default radius in meters
  const limit = searchParams.get("limit") || "5";

  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  try {
    const response = await axios.get("https://api.geoapify.com/v2/places", {
      params: {
        apiKey,
        categories,
        filter: `circle:${75.341},${31.14},${radius}`, // Berlin example coordinates
        limit,
      },
    });
    
    const recommendations = response.data.features.map((feature: any) => ({
        name: feature.properties.name,
        address: feature.properties.formatted,
        category: feature.properties.categories?.[0] || "Unknown",
        coordinates: feature.geometry.coordinates,
    }));
    console.log("Recommendations:", recommendations);

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Geoapify API Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
