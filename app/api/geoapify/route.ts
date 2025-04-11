import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { format } from "path";

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const {
      latitude:latitude ,
      longitude: longitude,
      location,
      radius = "2000",
      category = "accommodation.hotel",
      minRating = "0",
      maxResults = "20",
      sortBy = "distance",
    } = await req.json();

    if (!GEOAPIFY_API_KEY) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    if(!latitude || !longitude) {
    const geocodeRes = await axios.get(
      `https://api.geoapify.com/v1/geocode/search`,
      {
        params: {
          text: location,
          lang: "en",
          limit: 5,
          format: "json",
          apiKey: GEOAPIFY_API_KEY,
        },
      }
    );

    const results = geocodeRes.data?.results || [];

    let result = results.find((r: any) =>
      (
        `${r.city ?? ""} ${r.county ?? ""} ${r.state ?? ""} ${r.formatted ?? ""}`
      ).toLowerCase().includes("indore")
    );

    if (!result && results.length > 0) {
      result = results[0];
    }

    if (!result) {
      console.warn("Invalid location format received:", location);
      return NextResponse.json({ error: "Invalid location" }, { status: 400 });
    }

    const { lat, lon } = result;
    const resolvedLocation = result.formatted || location;

    const placesRes = await axios.get(`https://api.geoapify.com/v2/places`, {
      params: {
        categories: category,
        filter: `circle:${lon},${lat},${radius}`,
        bias: `proximity:${lon},${lat}`,
        limit: maxResults,
        apiKey: GEOAPIFY_API_KEY,
        sort: sortBy === "distance" ? undefined : sortBy,
      },
    });

    const features = placesRes.data?.features || [];
    const filtered = features.filter((place: any) => {
      const rating = place.properties.rating || 0;
      return rating >= parseFloat(minRating);
    });

    return NextResponse.json({ features: filtered, resolvedLocation });
    }
    else{

      const { lat, lon } = {
        lat: parseFloat(latitude),
        lon: parseFloat(longitude),};

        const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse`, {
          params: {
            lat: lat,
            lon: lon,
            lang: "en",
            format : "json",
            apiKey: GEOAPIFY_API_KEY,
            type: "street",
          },
        });
      const resolvedLocation = result.data.results[0].formatted || location;
  
      const placesRes = await axios.get(`https://api.geoapify.com/v2/places`, {
        params: {
          categories: category,
          filter: `circle:${lon},${lat},${radius}`,
          bias: `proximity:${lon},${lat}`,
          limit: maxResults,
          apiKey: GEOAPIFY_API_KEY,
          sort: sortBy === "distance" ? undefined : sortBy,
        },
      });
  
      const features = placesRes.data?.features || [];
      const filtered = features.filter((place: any) => {
        const rating = place.properties.rating || 0;
        return rating >= parseFloat(minRating);
      });
  
      return NextResponse.json({ features: filtered, resolvedLocation });
    }
  } catch (error: any) {
    console.error("Geoapify API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch places" },
      { status: 500 }
    );
  }
}
