"use client";
import {
    //CircleF,
    GoogleMap,
    MarkerF,
    useLoadScript,
} from "@react-google-maps/api";
import { useMemo, useState } from "react";
import { PlacesAutocomplete } from "../components/PlacesAutoComplete";
import { getGeocode, getLatLng } from "use-places-autocomplete";

const DEFAULT_LOCATION = { lat: 37.98, lng: 23.72 };

export default function Location() {
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



    var locations = [

        { lat: 37.783333, lng: -122.416667, title: "Location 1" },
        { lat: 40.7128, lng: -74.0060, title: "Location 2" },
        { lat: curlat, lng: curlng, title: "Current Location" },

        // Add more locations here

    ];



    const markers = useMemo(() =>
        locations.map(location => ({
            position: { lat: location.lat, lng: location.lng },
            title: location.title
        })), [locations]
    );



    // This loads the google maps script into our application
    const { isLoaded } = useLoadScript({
        // your API key will be publicly exposed, so be sure to apply HTTP restrictions on the Google Cloud console
        googleMapsApiKey: process.env.LOCATION_API_KEY as string,
        // This specifies the google maps libraries that we want to load (e.g. we could add drawing, geometry, places etc)
        libraries: libraries as any,
    });

    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <main className="flex justify-center align-center">
                <div className="border border-r-gray-400 w-1/4 h-screen bg-gray-200">
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
                    mapContainerClassName="w-3/4"
                    //mapContainerStyle={{ width: "800px", height: "800px" }}
                    onLoad={() => console.log("Map component loaded")}
                >
                    {/* This draws a marker over the map
          position prop specifies the lat + long of where to place ther marker
        */}
                    <MarkerF
                        position={mapCenter}
                        onLoad={() => console.log("Marker loaded")}
                    /* you can also change the icon of the marker 
                    icon="https://picsum.photos/64"*/
                    />

                    {markers.map((marker, idx) => {
                        return (
                            <MarkerF
                                key={idx}
                                position={marker.position}
                                onLoad={() => console.log("Marker loaded")}
                                title={marker.title}
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
        </>
    );
}
