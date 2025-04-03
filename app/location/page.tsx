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

import { SendLocation } from "@/app/hooks/useLocation";
import { useLiveLocations } from "@/app/hooks/useLiveLocation";
import useCurrentUser from "../hooks/useCurrentUser";
import prisma from "@/app/libs/prismadb";



const DEFAULT_LOCATION = { lat: 37.98, lng: 23.72 };

export default function Location() {
    const [user, setUser] = useState(null);
    const [locationUpdates, setLocationUpdates] = useState(null);
    const [currentUser, setCurrentUser] = useState("");
    const user_email = useCurrentUser()
    // setCurrentUser(user_email || "")
    // console.log(useCurrentUser());
    
    // console.log(useLiveLocations());
    // console.log("User ID:", user);
    // // Replace with dynamic user ID


    // useEffect(()=>{
    //     if (user) {
    //         console.log("User ID:", user);
    //     }
    //     const fetchLocationUpdates = () => {
    //         const location_updates =  useLiveLocations();
    //         console.log("Location updates:", location_updates);
    //         // setLocationUpdates(location_updates);

    //     } // Get real-time locations
    //     fetchLocationUpdates();
    //     const interval = setInterval(() => {
    //         fetchLocationUpdates();
    //     }
    //     , 10000); // Fetch every 10 seconds
    //     return () => clearInterval(interval);
    // },[user])
    // // useSendLocation(user); // Send location updates


    // console.log("Live locations:", location_updates);
    const [lat, setLat] = useState(DEFAULT_LOCATION.lat);
    const [lng, setLng] = useState(DEFAULT_LOCATION.lng);
    const [curlat, setCurlat] = useState(0);
    const [curlng, setCurlng] = useState(0);
    const libraries = useMemo(() => ["places"], []);
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

    // const a = SendLocation("67b5f568e34e2d7904a7859d", curlat, curlng);

    const locationUpdate = async (curlat: number, curlng: number, user: any) => {
        try {
          await fetch("/api/location", {
            method: "POST",
            body: JSON.stringify({ 
               userId: user,
               location: { lat: curlat, lng: curlng }
            }),
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Error updating admin controls:", error);
        }
      };

    useEffect(()=>{
        if (user_email !== null){
        locationUpdate(curlat, curlng, user_email);}
    })


    const loc = useLiveLocations();
    console.log(loc)

    const locations = Object.keys(loc).map((key, index)=>{
        const title = key;
        const lat = loc[key]['lat']
        const lng = loc[key]['lng']
        const image = loc[key]['image']
        return {lat:lat, lng:lng, title:title, image:image}
    })

    


    // var locations = [

    //     { lat: 37.783333, lng: -122.416667, title: "Location 1" },
    //     { lat: 40.7128, lng: -74.0060, title: "Location 2" },
    //     { lat: curlat, lng: curlng, title: "Current Location" },
    //     // Add more locations here
    // ];

    console.log(curlat, curlng)
    const markers = useMemo(() =>
        locations.map(location => ({
            position: { lat: location.lat, lng: location.lng },
            title: location.title,  
            image: location.image
        })), [locations]
    );



    // This loads the google maps script into our application
    const { isLoaded } = useLoadScript({
        // your API key will be publicly exposed, so be sure to apply HTTP restrictions on the Google Cloud console
        googleMapsApiKey: process.env.NEXT_PUBLIC_LOCATION_KEY as string,
        // This specifies the google maps libraries that we want to load (e.g. we could add drawing, geometry, places etc)
        libraries: libraries as any,
    });

    const places = [
        "place1",
        "place2",
        "place3",
        "place4",
    ];

    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <>
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between p-4">
                        {places.map((place, index) => {
                            return (
                                <div key={index} className="p-6 m-8 rounded-sm shadow-md">
                                    {place}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="w-3/4">
                        <main className="flex justify-center align-center m-12 h-[800px] rounded-md shadow-md">
                            <div className="border border-r-gray-400 w-1/4 h-full" style={{ display: "none" }}>
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
                    <div className="w-1/4">
                    </div>
                </div>
            </>

        </>
    );
}
