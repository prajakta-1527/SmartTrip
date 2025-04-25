
# SmartTrip
Your intelligent travel planner – find places, plan itineraries, and discover personalized recommendations!

![Next.js](https://img.shields.io/badge/Next.js-13-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Status](https://img.shields.io/badge/status-active-brightgreen)



---

## **Contents**
- [Purpose](#Purpose)
- [Demo](#Demo)
- [Preview](#Preview)
- [TechStack](#TechStack)
- [APIs Used](#apisused)
- [Features Implemented](#Features-Implemented)
- [Preliminary Setup](#PreliminarySetup)
- [Tests](#Tests)
- [Getting Started](#getting-started)
- [Team](#team)


## **Purpose**

The purpose of the SmartTrip group travel application is to provide an efficient plat-
form that simplifies and streamlines group travel coordination. The app is designed
to address the common challenges faced when organizing trips with friends, family, or
colleagues. These challenges include coordinating schedules, deciding on travel destina-
tions, staying connected during the trip, and navigating logistics. SmartTrip aims to
offer features like real-time location sharing, personalized destination recommendations,
voting systems for decision-making, and route planning to enhance group travel experi-
ences. By providing these tools, the app ensures that groups can travel together more
effectively, reducing confusion and miscommunication.

## Demo
Check out the live demo: 
[Link](https://drive.google.com/file/d/1pabayKY-_rb4pk-i19tHdIIrE2v2qQV0/view)

## **Preview**

### **1. Authentication**
<img width="1470" alt="Screenshot 2025-02-28 at 6 08 28 PM" src="https://github.com/user-attachments/assets/8134489c-caf1-441e-9473-ad48b5d46afb" />

--- 
### **2. Real-Time Group Chat**

- Create or join groups or personal chats with your travel companions.
- Each group has its own chat, planning space, and shared map view.

<img width="1470" alt="Screenshot 2025-02-28 at 6 09 52 PM" src="https://github.com/user-attachments/assets/79a051df-506e-4721-92a0-59c0213e7d38" />

<img width="1470" alt="Screenshot 2025-02-28 at 6 10 29 PM" src="https://github.com/user-attachments/assets/9a145803-87fe-472e-9dd7-feb5e139628d" />

<img width="1470" alt="Screenshot 2025-04-05 at 11 32 53 PM" src="https://github.com/user-attachments/assets/dc17775e-8bf3-4ee4-b5d8-f0368d365674" />

--- 
###  **3. Real-Time Group Chat Management**
 
 - Group chat creation pop-up in a trip planning interface.

<img width="1470" alt="Screenshot 2025-04-05 at 11 34 54 PM" src="https://github.com/user-attachments/assets/827584a0-8051-4657-ba7a-365cd6512d53" />

--- 

 - Group chat screen discussing trip plans with shared images and location
<img width="1470" alt="Screenshot 2025-02-28 at 6 28 15 PM" src="https://github.com/user-attachments/assets/88c907f3-f280-423e-aa4a-d5c71f1eb491" />

--- 
- Group details screen displaying name, members, creation date and delete options.
<img width="1470" alt="Screenshot 2025-04-05 at 11 33 26 PM" src="https://github.com/user-attachments/assets/543bc733-aae1-4db6-a554-520394cfa269" />

--- 
### **4. Live Location Sharing**

- Enable location sharing to view real-time positions of all group members on an interactive map.
- Zoom in/out and click on pins to see who is where.

<img width="1470" alt="Screenshot 2025-04-05 at 11 33 26 PM" src="https://github.com/user-attachments/assets/5186991e-0747-474a-af6f-7652e03a08af" />



--- 
###  **5. Discover Places**
-  Users can select a location from the list of recommended places. The pinned location is visible to everyone, along with the distance from each user in the group. The user who pinned it appears in the title.
<img width="1470" alt="Screenshot 2025-04-05 at 11 33 26 PM" src="https://github.com/user-attachments/assets/be535797-67d9-4c63-86bc-45b8f925ca3b" />

--- 
- The live locations of group members are visible in the map along with the pinned location allowing them to visualise the distance from desired destination.
<img width="1470" alt="Screenshot 2025-04-05 at 11 33 26 PM" src="https://github.com/user-attachments/assets/a9e31eac-ea16-4f14-8ae9-24c9c95d41b3" />


--- 

###  **6. Recommendations and Weather Forecasts, Route planning**

- Users can search nearby locations around the input location along with various filters. The recommendation tab includes description of each location, weather at those location. Option to pin the location. The map shows an optimised route to the seleected location along with estimated travel time and distance. 
<img width="1470" alt="Screenshot 2025-04-25 at 6 32 27 PM" src="https://github.com/user-attachments/assets/a9a5d335-bb1e-42cd-b8b0-3f87171f4349" />

--- 

###  **6. Pin & Vote on Locations**

- Location can be pinned using the button 'Pin this place`.
<img width="1470" alt="Screenshot 2025-04-25 at 6 32 38 PM" src="https://github.com/user-attachments/assets/ade78f68-fd02-420f-b428-d9236d9106b7" />

---

- All Pinned locations are shown. Users can upvote or downvote on the locations. All the group users can view the number of votes and choose the destination accordingly. There is an option to delete the pinned place.
<img width="1470" alt="Screenshot 2025-04-25 at 6 31 51 PM" src="https://github.com/user-attachments/assets/4df295ac-a0e9-40b9-8781-57b57621de3f" />

- Users can search recommendations based on their current group location by clicking on `Use current group location to search`. 
<img width="1470" alt="Screenshot 2025-04-25 at 6 29 01 PM" src="https://github.com/user-attachments/assets/f7bd90db-f23d-44c0-93f5-32f765150e95" />



## **Tech stack**

- Next.js
- TypeScript
- MongoDB
- NextAuth
- Prisma
- Pusher
- Cloudinary
- Tailwind CSS



## **APIs Used**
- Pusher API - For enabling chats, uses WebSockets to share messages.
- Google Maps API - Interactive Google Maps integration for fetching real time location of user.access
- Geoapify API - For personalized place recommendations that match group preferences
- GoogleAuth API: Secures user login and prevents unauthorized access.
- OpenWeatherMap API: Shows current and forecasted weather for travel planning.
- Google Directions API: For getting most optimised route to the chosen location from current location. 



## **Features Implemented** 
- User Authentication: Secure login and registration through to ensure that only authorized users access the app.
- Group Creation and Management: Users can create group and chat, share files/images in group.
- Real-Time Location: Users can view current location on Map and can search for desired locations.
- Geoapify Implementation: View recommended places based on group preferences by giving prompt.
- Location Sharing : Users can share their live location with others in the group. Members will be able to see each other’s location on an interactive map.
- Location Tracking: Users can set a common spot on the map and track every group member's location
- Voting for Destinations: Users can suggest destinations and vote on them. The app will highlight the most popular choice for easier decision-making.
- Weather Integration: The app has integrated weather API (OpenWeatherMap) to provide current and forecasted weather conditions for the selected destination.
- Pinned Locations: In a group, users can pin the recommended locations on map and vote on them. 
- Route Planning: The app will display optimized travel routes using the Google Maps Directions API, offering options for walking, driving, or public transportation, along with estimated travel times and distances.


## **Preliminary Setup**

- Install the latest version of Node.JS on your system.
- To run this, you must have access to some API keys. 
- Create the account and generate your own API Key for the following.

## Tests

- Unit testing code is done at `SmartTrip/tests/`

 ### API Generation Links
 1. **Database URL**  
 We are utilizing MongoDB as our database. Create an account and access the URL string for MongoDB connection from this [link](https://www.mongodb.com/cloud/atlas/register?utm_source=google&utm_campaign=search_gs_pl_evergreen_atlas_core-high-int_retarget-brand_gic-null_apac-in_ps-all_desktop_eng_lead&utm_term=mongodb%20atlas&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=22194044124&adgroup=174717503459&cq_cmp=22194044124&gad_source=1&gclid=Cj0KCQiA2oW-BhC2ARIsADSIAWoPu9WDuPD3hf1Ol9YHWwBgx6IrWwOynjlR3vfXOtAGCYxhx4xDO-waAlj3EALw_wcB).
 

 2. **Next Auth Secret**  
 Generate the next-auth secret using the command
 ` openssl rand -base64 32` on your system terminal. Use the output generated as your next-auth secret.


 3. **Google ID and Google Secret**  
 Access the google ID and google secret ID from this [link](https://console.cloud.google.com/).


 4. **Cloudinary**   
 Access the cloudinary cloud name from this [link](https://console.cloudinary.com/).
 
 5. **Pusher**
 Access the Pusher app key, Pusher app id and Pusher secret using this [link](https://pusher.com/docs/channels/pusher_cli/documentation/).

 6. **Google Location API key**
 Access the key from google cloud using this [link](https://developers.google.com/maps/get-started).

7. **Weather API key**
   Access the weather api key from openweathermap using this[link](https://home.openweathermap.org/api_keys).


 ## Getting Started

 1. Clone the github repository `https://github.com/prajakta-1527/SmartTrip.git` in your project directory using the command.

    ``` shell 
    git clone https://github.com/prajakta-1527/SmartTrip.git
    ```

2. In the root directory, create a `.env.local` with the following content and add the acquired API keys and Secrets in the following format.
    ``` Javascript
    DATABASE_URL=mongodb+srv:<YOUR_MONGO_DB_URL>
    NEXTAUTH_SECRET=<YOUR_NEXT_AUTH_SECRET>

    GOOGLE_ID=<YOUR_GOOGLE_ID>
    GOOGLE_SECRET=<YOUR_GOOGLE_SECRET>

    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>

    NEXT_PUBLIC_PUSHER_APP_KEY=<YOUR_PUSHER_APP_KEY>
    PUSHER_APP_ID=<YOUR_PUSHER_APP_ID>
    PUSHER_SECRET=<YOUR_PUSHER_SECRET_KEY>

    NEXT_PUBLIC_LOCATION_KEY=<YOUR_GOOGLE_MAP_API_KEY>
    GEOAPIFY_API_KEY=<YOUR_GEOAPIFY_API_KEY>
    NEXT_PUBLIC_WEATHER_API_KEY=<YOUR_NEXT_PUBLIC_WEATHER_API_KEY>
    ```
3. Next, download the required modules using the command - 

    ```shell
    npm install yarn
    yarn
    ```
4. You are now good to go and run the application using the command - 

    ```shell
    yarn dev
    ```

5. Open the application on `localhost:3000`.

## Team Members - **Team 4**

- Prajakta Darade   - 210001052
- Harsh Rawat       - 210001023
- Vivek Bhojwani    - 210001079
- Sachin Sharma     - 2402101003
- Rupal Shah        - 210002065



---

