"use client";

import {
  GoogleMap,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

import GeoapifySearch from "./components/GeoapifySearch";
import { PlacesAutocomplete } from "../components/PlacesAutoComplete";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header2 from "./components/Header2";

import { useLiveLocations } from "@/app/hooks/useLiveLocation";
import useCurrentUser from "../hooks/useCurrentUser";

const DEFAULT_LOCATION = { lat: 22.5, lng: 75.9 };


export default function Location() {
  const user_email = useCurrentUser();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const [placeCoords, setPlaceCoords] = useState<{ name: string; lat: number; lng: number }[]>([]);
  const [weatherData, setWeatherData] = useState<Record<string, any>>({});
  const [lat, setLat] = useState(DEFAULT_LOCATION.lat);
  const [lng, setLng] = useState(DEFAULT_LOCATION.lng);
  const [curlat, setCurlat] = useState(0);
  const [curlng, setCurlng] = useState(0);

  const [emails, setEmails] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [conv, setConv] = useState<any>(null);
  const [users, setUsers] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<string[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<any[]>([]);


  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(() => ({ lat, lng }), [lat, lng]);
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
      language: "en",
      zoomControl: true,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_LOCATION_KEY as string,
    libraries: libraries as any,
  });

  const loc = useLiveLocations();

  useEffect(() => {
    if (!conversationId) return;

    axios
      .get(`/api/conversations/${conversationId}`)
      .then((response) => {
        const data = response.data.Conversation;
        if (data?.name) {
          setConv(data);
          setEmails(data.users.map((user: any) => user.email));
          setImages(data.users.map((user: any) => user.image));
          setUsers(data.users.map((user: any) => user.name));
        }
      })
      .catch((error) => {
        console.error("Error fetching conversation emails:", error);
        toast.error("Failed to fetch emails!");
        setEmails([]);
      })
      .finally(() => setLoading(false));
  }, [conversationId]);

  // Get current user location
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurlat(position.coords.latitude);
        setCurlng(position.coords.longitude);
      });
    }
  }, []);

  // Send live location update
  useEffect(() => {
    if (user_email) {
      const updateLocation = async () => {
        try {
          await fetch("/api/location", {
            method: "POST",
            body: JSON.stringify({
              userId: user_email,
              location: { lat: curlat, lng: curlng },
            }),
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Error updating location:", error);
        }
      };
      updateLocation();
    }
  }, [curlat, curlng, user_email]);

  // Filter live locations for current conversation
  useEffect(() => {
    if (!loc || emails.length === 0) return;

    const updated = Object.entries(loc)
      .map(([key, value]: any) => ({
        title: key,
        lat: value.lat,
        lng: value.lng,
        image: value.image,
      }))
      .filter((loc) => emails.includes(loc.title));

    setFilteredLocations(updated);
  }, [loc, emails]);

  const markers = useMemo(
    () =>
      filteredLocations.map((location) => ({
        position: { lat: location.lat, lng: location.lng },
        title: location.title,
        image: location.image,
      })),
    [filteredLocations]
  );

  useEffect(() => {
    const fetchWeather = async () => {
      if (places.length === 0) return;

      // Get city names or fallback to name
      const locationNames = places.map((p) => ({
        lat: p.properties.lat,
        lon: p.properties.lon,
      }));


      try {
        const response = await axios.get("/api/weather", {
          params: {
            locations: JSON.stringify(locationNames),
            detailed: false, // or true if you want 5-day forecast
          },
        });

        // Store data using the original location names as keys
        const results = response.data.results;
        setWeatherData(results);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    fetchWeather();
  }, [places]);
  if (!isLoaded) return <p>Loading...</p>;

  return (
    <>
      {conv && users && (
        <Header2 conversation={conv} />
      )}

      <div className="my-6 mx-12">
        {/* Header placed at the very top */}


        <GeoapifySearch
        groupLat={curlat}
        groupLng={curlng}
          onResults={(results) => {
            setPlaces(results);

            const coords = results.map((place: any) => ({
              name: place.properties.name || "Unnamed Place",
              lat: place.geometry.coordinates[1],
              lng: place.geometry.coordinates[0],
            }));
            setPlaceCoords(coords);
          }}
        />
      </div>


      <div className="flex flex-row m-12">
        <div className="w-full">
          <main className="flex justify-center align-center m-2 h-[620px] rounded-md shadow-md">
            <GoogleMap
              options={mapOptions}
              zoom={14}
              center={mapCenter}
              mapTypeId={google.maps.MapTypeId.ROADMAP}
              mapContainerClassName="w-full"
              onLoad={() => console.log("Map loaded")}
            >
              <MarkerF
                position={mapCenter}
                title="Pinned Location"
              />

              {markers.map((marker, idx) => (
                <MarkerF
                  key={idx}
                  position={marker.position}
                  title={marker.title}
                  icon={{
                    url: marker.image,
                    scaledSize: new google.maps.Size(40, 40),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(20, 40),
                  }}
                />
              ))}
            </GoogleMap>
          </main>
        </div>

        {places.length > 0 ? <>

          <div className="w-1/4 p-12 mr-5 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-center m-6">
              Recommended Places
            </h1>
            <ScrollArea className="h-[500px] w-full rounded-md border p-3 bg-gray-30">
              <div className="flex flex-col gap-4">
                {places.map((place, index) => {
                  const locationKey = place.properties.city || place.properties.name;
                  const weather = weatherData[locationKey];

                  const handleSelect = async () => {
                    const lat = place.properties.lat;
                    const lon = place.properties.lon;

                    if (lat && lon) {
                      setLat(parseFloat(lat));
                      setLng(parseFloat(lon));
                    } else {
                      // Fallback: try geocoding the name
                      const results = await getGeocode({ address: place.properties.name });
                      const { lat, lng } = await getLatLng(results[0]);
                      setLat(lat);
                      setLng(lng);
                    }
                  };

                  return (
                    <div
                      key={index}
                      onClick={handleSelect}
                      className="w-full p-6 rounded-md shadow-md bg-white cursor-pointer hover:bg-blue-50 transition"
                    >
                      <h2 className="text-lg font-semibold">
                        {place.properties.name || "Unnamed Place"}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {place.properties.formatted || "No address available"}
                      </p>
                      {weatherData[index] ? (
                        <div className="mt-2 text-sm text-blue-800">
                          🌡 Temp: {weatherData[index].temperature}°C <br />
                          💧 Humidity: {weatherData[index].humidity}% <br />
                          💨 Wind: {weatherData[index].wind_speed} m/s <br />
                          🌤 {weatherData[index].description[0].main}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">Fetching weather...</p>
                      )}
                    </div>
                  );
                })}

              </div>
            </ScrollArea>
          </div>

        </> : <></>}
      </div>
    </>
  );
}
