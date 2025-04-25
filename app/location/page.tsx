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
import { Button } from "@/components/ui/button";

import GeoapifySearch from "./components/GeoapifySearch";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header2 from "./components/Header2";

import { useLiveLocations } from "@/app/hooks/useLiveLocation";
import useCurrentUser from "../hooks/useCurrentUser";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
const DEFAULT_LOCATION = { lat: 22.5, lng: 75.9 };

import { DirectionsRenderer } from "@react-google-maps/api";


export default function Location() {
  const user_email = useCurrentUser();
  console.log("User email:", user_email);
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const [placeCoords, setPlaceCoords] = useState<{ name: string; lat: number; lng: number }[]>([]);
  const [weatherData, setWeatherData] = useState<Record<string, any>>({});
  const [weatherDataPinned, setWeatherDataPinned] = useState<Record<string, any>>({});
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
  const [pinnedLocations, setPinnedLocations] = useState<{ name: string; lat: number; lng: number }[]>([]);
  const [showPinned, setShowPinned] = useState(false);
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);


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
  const getRoute = async (destinationLat: number, destinationLng: number) => {
    if (!curlat || !curlng || !destinationLat || !destinationLng) {
      console.error("Missing coordinates for route");
      toast.error("Invalid coordinates for route!");
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: { lat: curlat, lng: curlng },
        destination: { lat: destinationLat, lng: destinationLng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);

          const leg = result.routes[0].legs[0];
          setRouteInfo({
            distance: leg.distance.text,
            duration: leg.duration.text,
          });
          toast.success(`ETA: ${leg.duration.text}, Distance: ${leg.distance.text}`);

        } else {
          toast.error("Unable to get directions");
          console.error("Directions error:", status, result);
        }
      }
    );
  };



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

    const avgLat = updated.reduce((sum, loc) => sum + loc.lat, 0) / updated.length;
    const avgLng = updated.reduce((sum, loc) => sum + loc.lng, 0) / updated.length;
    if (avgLat && avgLng) {

      setLat(avgLat);
      setLng(avgLng);
    }
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
  // const val = {dine};

  const handleVote = async (pinId: string, type: "upvote" | "downvote") => {
    try {
      const res = await axios.post("/api/pins/vote", {
        pinId,
        voteType: type,
        userEmail: user_email,
      });

      toast.success("Vote registered!");

      // Update UI
      setPinnedLocations((prev) =>
        prev.map((loc) =>
          loc.id === pinId ? { ...loc, ...res.data.updatedPin } : loc
        )
      );
    } catch (err) {
      toast.error("Vote failed!");
      console.error("Vote error:", err);
    }
  };

  const handlePin = async (place: any) => {
    console.log("Pinning place:", place);
    console.log("Conversation ID:", conversationId);
    console.log("User email:", user_email);

    try {
      await axios.post("/api/pins", {
        name: place.properties.name,
        address: place.properties.formatted,
        userEmail: user_email,
        lat: parseFloat(place.properties.lat),
        lon: parseFloat(place.properties.lon),
        conversationId: conversationId, // Make sure you have this available
      });

      toast.success("Location pinned successfully!");
    } catch (err) {
      console.error("Error pinning location:", err);
      toast.error("Failed to pin location.");
    }
  };

  const handlePinLocation = async () => {
    // If already showing, hide and reset everything
    // if (showPinned) {
    //   setPinnedLocations([]);
    //   setWeatherDataPinned({});
    //   setShowPinned(false);
    //   return;
    // }

    try {
      const res = await axios.get("/api/pins", {
        params: {
          conversationId,
        },
      });

      const data = res.data.pins || [];
      setPinnedLocations(data);

      const locs = data.map((pin: any) => ({
        lat: pin.lat,
        lon: pin.lon,
      }));

      if (locs.length !== 0) {
        const weatherRes = await axios.get("/api/weather", {
          params: {
            locations: JSON.stringify(locs),
            detailed: false,
          },
        });
        setWeatherDataPinned(weatherRes.data.results);
        setShowPinned(true); // only show pins if we have any
        toast.success("Fetched pinned locations!");
      } else {
        setWeatherDataPinned({});
        toast("No pinned locations found.");
      }

    } catch (err) {
      console.error("Error fetching pinned locations:", err);
      toast.error("Failed to load pinned locations");
    }
  }

  const handleDelete = async (id: string) => {
    await fetch("/api/pins", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    // Update local state after delete
    setPinnedLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

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
          {routeInfo && (
            <div className="w-full text-center mb-4 border border-blue-800 shadow-md rounded py-2">
              {/* <div className="inline-block bg-white border border-blue-400 shadow-md rounded px-4 py-2"> */}
              <p className="text-md">
                You are <span className="text-blue-800 text-lg font-bold"> 🚗 {routeInfo.distance} and ⏱ {routeInfo.duration} </span> away from your pinned location ! Reach faster, your friends are waiting for you
              </p>
              {/* </div> */}
            </div>
          )}
          <main className="flex justify-center align-
          center m-2 h-[620px] rounded-md shadow-md">

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
                title="📌 Pinned Location"
              />

              <MarkerF
                position={{ lat: curlat, lng: curlng }}
                title="Your Location"
                visible={true}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                }}
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
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{

                    // suppressMarkers: true,
                    polylineOptions: {
                      strokeColor: "#0000ff", // pitch blue
                      strokeOpacity: 0.8,
                      strokeWeight: 6,
                    },
                  }}
                />
              )}
            </GoogleMap>
          </main>
        </div>
        <hr className="border-l-2 border-gray-300 h-[650px] mx-4" />
        <Tabs defaultValue="recommend" className="w-[400px] mx-2" >
          <TabsList className="rounded-md p-1">
            <TabsTrigger
              value="recommend"
              className="p-2 px-4 text-black bg-white hover:bg-gray-700 data-[state=active]:bg-black data-[state=active]:text-white rounded-md transition shadow-lg"
            >
              Recommended places
            </TabsTrigger>
            <TabsTrigger
              value="pinned"
              onClick={handlePinLocation}
              className="p-2 px-4 text-black bg-white hover:bg-gray-700 data-[state=active]:bg-black data-[state=active]:text-white rounded-md transition shadow-lg"
            >
              Pinned Locations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommend"> {places.length > 0 ? <>

            <div className="w-full mr-5 flex flex-col justify-center h-[620px]">
              {/* <h1 className="text-2xl font-bold text-center m-6">
                Recommended Places
              </h1> */}
              <ScrollArea className="h-[600px] w-full rounded-md border p-3 bg-gray-30">
                <div className="flex flex-col gap-4">
                  {places.map((place, index) => {
                    const locationKey = place.properties.city || place.properties.name;
                    const weather = weatherData[locationKey];

                    const handleSelect = async () => {
                      const lat = parseFloat(place.properties.lat);
                      const lon = parseFloat(place.properties.lon);

                      if (lat && lon) {
                        setLat(lat);
                        setLng(lon);
                        await getRoute(lat, lon);
                      } else {
                        const results = await getGeocode({ address: place.properties.name });
                        const { lat, lng } = await getLatLng(results[0]);
                        setLat(lat);
                        setLng(lng);
                        await getRoute(lat, lng);
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
                        <Button
                          className="mt-3 text-sm px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-600 transition"
                          onClick={() => {
                            handlePin(place);
                          }}
                        >
                          📍 Pin this place
                        </Button>
                      </div>

                    );
                  })}

                </div>
              </ScrollArea>
            </div>

          </> : <> <div className="w-full flex flex-col justify-center items-center h-[620px]">

            No recommendations!

          </div> </>}</TabsContent>
          <TabsContent value="pinned">
            {pinnedLocations.length > 0 ? <>

              <div className="w-full flex flex-col justify-center">

                <ScrollArea className="h-[600px] w-full rounded-md border p-3 bg-gray-30">
                  <div className="flex flex-col gap-4">
                    {pinnedLocations.map((loc, index) => {
                      const weather = weatherDataPinned[index];

                      const handleSelect = async () => {
                        const lat = loc.lat;
                        const lon = loc.lon;

                        if (lat && lon) {
                          setLat(lat);
                          setLng(lon);
                          await getRoute(lat, lon); // ✅ this line is essential!
                        } else {
                          const results = await getGeocode({ address: loc.name });
                          const { lat, lng } = await getLatLng(results[0]);
                          setLat(lat);
                          setLng(lng);
                          await getRoute(lat, lng);
                        }
                      };


                      return (
                        <div
                          key={index}
                          onClick={handleSelect}
                          className="w-full p-6 rounded-md shadow-md bg-white cursor-pointer hover:bg-blue-50 transition"
                        >
                          <h2 className="text-lg font-semibold">{loc.name}</h2>
                          <p className="text-sm text-gray-600">
                            {loc.address || "No address available"}
                          </p>
                          {weather ? (
                            <div className="mt-2 text-sm text-blue-800">
                              🌡 Temp: {weather.temperature}°C <br />
                              💧 Humidity: {weather.humidity}% <br />
                              💨 Wind: {weather.wind_speed} m/s <br />
                              🌤 {weather.description[0]?.main}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400">Fetching weather...</p>
                          )}
                          <p>{loc.name}</p>

                          <div className="flex items-center space-x-2 justify-between gap-2 mt-3">

                            <button
                              onClick={() => handleVote(loc.id, "upvote")}
                              disabled={loc.upvotedBy?.includes(user_email)}
                              className="text-green-600 text-2xl"
                            >
                              👍 {loc.upvotes}
                            </button>

                            <button
                              onClick={() => handleVote(loc.id, "downvote")}
                              disabled={loc.downvotedBy?.includes(user_email)}
                              className="text-red-600 text-2xl"
                            >
                              👎 {loc.downvotes}
                            </button>


                            <Button
                              className=" text-sm px-3 py-1 bg-gray-500 text-white rounded transition"
                              onClick={() => {
                                handleDelete(loc.id);
                              }}
                            >
                              Delete location
                            </Button>

                          </div>

                        </div>

                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

            </> : <></>}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
