import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { pusherClient } from "@/app/libs/pusher";
interface LocationData {
  [userId: string]: { lat: number; lng: number };
}

export function useLiveLocations() {
  const [locations, setLocations] = useState<LocationData>({});

  useEffect(() => {
    // const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    //   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    // });

    const channel = pusherClient.subscribe("location");
    
    channel.bind("update", (data: { userId: string; location: { lat: number; lng: number; image: string };}) => {
      setLocations((prev) => ({ ...prev, [data.userId]: data.location }));
    });
    console.log("Subscribed to location channel", channel);
    return () => {
      pusherClient.unsubscribe("location");
    };
    console.log(locations)
  }, []);

  return locations;
}
