// import { useEffect } from "react";
// import { pusherServer } from '@/app/libs/pusher';

// export function SendLocation(userId: string, curlat: number, curlng: number) {
//   console.log("Current location:", curlat, curlng, userId);
//   const location = { lat: curlat, lng: curlng };
//   // await pusherServer.trigger("location", "update", { userId, location });

//   useEffect(()=>{
//     const res = async()=>{
//       await pusherServer.trigger("location", "update", { userId, location });
//     }
//     res()
//   },[curlat, curlng])

//   return location;
import { useEffect } from "react";

export function SendLocation(userId: string, curlat: number, curlng: number, pusherServer: any) {
  useEffect(() => {
    const sendLocationUpdate = async () => {
      try {
        await pusherServer.trigger("location", "update", { 
          userId, 
          location: { lat: curlat, lng: curlng } 
        });
      } catch (error) {
        console.error("Error sending location update:", error);
      }
    };

    sendLocationUpdate(); // Call the function

  }, [userId, curlat, curlng, pusherServer]); // Added pusherServer as a dependency

  return null; // Hooks typically don't return values unless exposing a function
}

  // const locationFetch = async () => {
  //   try {
  //     const response = await fetch("/api/location", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ userId, location: { lat: curlat, lng: curlng } }),
  //     });

  //     const data = await response.json();
  //     console.log("Server Response:", data);
  //   } catch (error) {
  //     console.error("Error sending location:", error);
  //   }
  // };

  // useEffect(() => {
  //   console.log("useEffect triggered - Sending location...");
  //   locationFetch();
  // }, [userId, curlat, curlng]); // Dependencies added to update when these change

  // return locationFetch; // Expose the function if needed for manual calls
// }
