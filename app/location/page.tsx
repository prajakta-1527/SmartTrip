"use client";
import {
  // CircleF,
  GoogleMap,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";
import { PlacesAutocomplete } from "../components/PlacesAutoComplete";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import getSession from "../actions/getSession";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import GeoapifySearch from "./components/GeoapifySearch";

import { SendLocation } from "@/app/hooks/useLocation";
import { useLiveLocations } from "@/app/hooks/useLiveLocation";
import useCurrentUser from "../hooks/useCurrentUser";
import prisma from "@/app/libs/prismadb";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "./components/Header";
const DEFAULT_LOCATION = { lat: 22.5, lng: 75.9 };


export default function Location() {
  const [user, setUser] = useState(null);
  const [locationUpdates, setLocationUpdates] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const user_email = useCurrentUser();

  //params
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");

//   console.log(conversationId);
  const [lat, setLat] = useState(DEFAULT_LOCATION.lat);
  const [lng, setLng] = useState(DEFAULT_LOCATION.lng);
  const [curlat, setCurlat] = useState(0);
  const [curlng, setCurlng] = useState(0);
  const libraries = useMemo(() => ["places"], []);


  //to get user email ids of selected group
//   import { useEffect, useState } from "react";

  

  const [emails, setEmails] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [conv, setConv] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any>(null);
  useEffect(() => {
    if (!conversationId) return;

    axios
      .get(`/api/conversations/${conversationId}`)
      .then((response) => {
        console.log("MyRes", response.data);
        console.log("MyRes", response.data.Conversation.name);
        //set only if not null
        if (response.data.Conversation.name) {
          setUser(response.data.Conversation.name);

          setEmails(response.data.Conversation.users.map((user: any) => user.email));
          setImages(response.data.Conversation.users.map((user: any) => user.image));
          setConv(response.data.Conversation);
          setUsers(response.data.Conversation.users.map((user: any) => user.name));
          console.log("UserNames", users);
          console.log(conv);
          // toast.success("Emails fetched successfully!");
        }
      })
      .catch((error) => {
        console.error("Error fetching conversation emails:", error);
        toast.error("Failed to fetch emails!");
        setEmails([]);
      })
      .finally(() => setLoading(false));
  }, [conversationId]);

  console.log("Emails", emails);
  
  // This gives coordinates for the center of the map
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

  const navigator = typeof window !== "undefined" ? window.navigator : null;
  if (!navigator) {
    return <p>Loading...</p>;
  }

  // Get current location of the device
  navigator.geolocation.getCurrentPosition((position) => {
    setCurlat(position.coords.latitude);
    setCurlng(position.coords.longitude);
  });
  console.log("Current Location", curlat, curlng);
  // const a = SendLocation("67b5f568e34e2d7904a7859d", curlat, curlng);

  const locationUpdate = async (curlat: number, curlng: number, user: any) => {
    try {
      await fetch("/api/location", {
        method: "POST",
        body: JSON.stringify({
          userId: user,
          location: { lat: curlat, lng: curlng },
        }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error updating admin controls:", error);
    }
  };

  useEffect(() => {
    if (user_email !== null) {
      locationUpdate(curlat, curlng, user_email);
    }
  });

  // const loc = useLiveLocations();
  // console.log(loc);


  // const locations = Object.keys(loc)
  // .map((key) => {
  //   const title = key;
  //   const lat = loc[key]["lat"];
  //   const lng = loc[key]["lng"];
  //   const image = loc[key]["image"];
  //   return { lat, lng, title, image };
  // })
  // .filter((location) => emails.includes(location.title)); 

  const loc = useLiveLocations();
  const [filteredLocations, setFilteredLocations] = useState([{}]);
  
  useEffect(() => {
    if (!loc) return; // Ensure loc is available before processing
  
    const updatedLocations = Object.keys(loc)
      .map((key) => {
        const title = key;
        const lat = loc[key]["lat"];
        const lng = loc[key]["lng"];
        const image = loc[key]["image"];
        return { lat, lng, title, image };
      })
      .filter((location) => emails.includes(location.title)); // 🔥 Filtering Step
  
    setFilteredLocations(updatedLocations);
  }, [loc, emails]); // ✅ Depend on loc & emails
  
  console.log("Filtered Locations:", filteredLocations);
  const locations = filteredLocations;
  
  console.log(curlat, curlng);
  const markers = useMemo(
    () =>
      locations.map((location) => ({
        position: { lat: location.lat, lng: location.lng },
        title: location.title,
        image: location.image,
      })),
    [locations]
  );

  // This loads the google maps script into our application
  const { isLoaded } = useLoadScript({
    // your API key will be publicly exposed, so be sure to apply HTTP restrictions on the Google Cloud console
    googleMapsApiKey: process.env.NEXT_PUBLIC_LOCATION_KEY as string,
    // This specifies the google maps libraries that we want to load (e.g. we could add drawing, geometry, places etc)
    libraries: libraries as any,
  });

  const places = ["place1", "place2", "place3", "place4","place1", "place2", "place3", "place4", "place5"];

  if (!isLoaded) {
    return <p>Loading...</p>;
  }


  return (
    <>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between p-4 m-12">
            {/* <h1 className="font-bold"> Where do you want to go?</h1>  */}
            { conv && users && <Header groupName={conv?.name} userNames={users} />}

          {/* <Header users={users} />  */}

          {/* <Header conv={conv} emails={emails} avatars={images} />  ✅ Show Header */}

          </div>
        </div>
<GeoapifySearch />
        <div className="flex flex-row">
          <div className="w-3/4">
            <main className="flex justify-center align-center m-12 h-[600px] rounded-md shadow-md">
              <div
                className="border border-r-gray-400 w-1/4 h-full"
                style={{ display: "none" }}
              >
                <PlacesAutocomplete
                  onAddressSelect={(address) => {
                    getGeocode({ address }).then((results) => {
                      const { lat, lng } = getLatLng(results[0]);
                      setLat(lat);
                      setLng(lng);
                    });
                  }}
                />
              </div>
              <GoogleMap
                options={mapOptions}
                zoom={14}
                center={mapCenter}
                mapTypeId={google.maps.MapTypeId.ROADMAP}
                mapContainerClassName="w-full"
                //mapContainerStyle={{ width: "800px", height: "800px" }}
                onLoad={() => console.log("Map component loaded")}
              >
                {/* This draws a marker over the map
          position prop specifies the lat + long of where to place ther marker
        */}
                <MarkerF
                  position={mapCenter}
                  onLoad={() => console.log("Marker loaded")}
                  title="Location"
                />

                {markers.map((marker, idx) => {
                  return (
                    <MarkerF
                      key={idx}
                      position={marker.position}
                      onLoad={() => console.log("Marker loaded")}
                      title={marker.title}
                      icon={{
                        url: marker.image,
                        scaledSize: new google.maps.Size(40, 40), // Adjust size as needed
                        origin: new google.maps.Point(0, 0), // Optional: Adjust origin
                        anchor: new google.maps.Point(20, 40), //
                      }}
                      // icon={}
                    />
                  );
                })}

                {/* we can also draw circles around the map */}
                {/* {[1000, 2500].map((radius, idx) => {
                            return (
                                <CircleF
                                    key={idx}
                                    center={mapCenter}
                                    radius={radius}
                                    onLoad={() => console.log("Circle Load...")}
                                    options={{
                                        fillColor: radius > 1000 ? "red" : "green",
                                        strokeColor: radius > 1000 ? "red" : "green",
                                        strokeOpacity: 0.8,
                                    }}
                                />
                            );
                        })} */}
              </GoogleMap>
            </main>
          </div>
          <div className="w-1/4 p-12 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-center m-6"> Recommended Places </h1>
            <ScrollArea className="h-[500px] w-full rounded-md border p-3 bg-gray-30">
           
            <div className="flex flex-col gap-4">
              {places.map((place, index) => {
                return (
                  <div key={index} className="w-full p-6 rounded-md shadow-md bg-white">
                    {place}
                  </div>
                );
              })}
            </div>
            </ScrollArea>
          </div>
        </div>
      
    </>
  );
}
