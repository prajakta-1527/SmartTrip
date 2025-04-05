
---
## **Contents**
- [Purpose](#Purpose)
- [Preview](#Preview)
- [TechStack](#TechStack)
- [APIs Used](#apisused)
- [Features Implemented](#Features-Implemented)
- [Preliminary Setup](#PreliminarySetup)
- [Steps to run](#Steps-to-run)
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

## **Preview**
1. Register and Login
<img width="1470" alt="Screenshot 2025-02-28 at 6 08 28 PM" src="https://github.com/user-attachments/assets/8134489c-caf1-441e-9473-ad48b5d46afb" />


2. Enter a group or personal chat
<img width="1470" alt="Screenshot 2025-02-28 at 6 09 52 PM" src="https://github.com/user-attachments/assets/79a051df-506e-4721-92a0-59c0213e7d38" />

<img width="1470" alt="Screenshot 2025-02-28 at 6 10 29 PM" src="https://github.com/user-attachments/assets/9a145803-87fe-472e-9dd7-feb5e139628d" />
<img width="1470" alt="Screenshot 2025-04-05 at 11 32 53 PM" src="https://github.com/user-attachments/assets/dc17775e-8bf3-4ee4-b5d8-f0368d365674" />
3. Group chat creation pop-up in a trip planning interface.
<img width="1470" alt="Screenshot 2025-04-05 at 11 34 54 PM" src="https://github.com/user-attachments/assets/827584a0-8051-4657-ba7a-365cd6512d53" />

4. Group chat screen discussing trip plans with shared images and location
<img width="1470" alt="Screenshot 2025-02-28 at 6 28 15 PM" src="https://github.com/user-attachments/assets/88c907f3-f280-423e-aa4a-d5c71f1eb491" />


5. Group details screen displaying name, members, creation date and delete options.
<img width="1470" alt="Screenshot 2025-04-05 at 11 33 26 PM" src="https://github.com/user-attachments/assets/543bc733-aae1-4db6-a554-520394cfa269" />


6. Location Map: Once a group is selected, users can view the real-time location of all members in the group who are active. Users can zoom in and out
<img width="1470" alt="Screenshot 2025-04-05 at 11 33 26 PM" src="https://github.com/user-attachments/assets/5186991e-0747-474a-af6f-7652e03a08af" />


7. Searching Nearby Places based on User prompts like radius in kilometers, minimum distance, preferred type - hotels, restaurants etc.
<img width="1470" alt="Screenshot 2025-04-05 at 11 33 26 PM" src="https://github.com/user-attachments/assets/e27edc69-7b6e-4ca1-89b6-408ae8813fca" />


8. The recommended places from the GeoApify API are displayed as cards, each showing detailed address and weather details from the weather API, allowing users to pin their favorite spots for others to view.
<img width="1470" alt="Screenshot 2025-04-05 at 11 33 26 PM" src="https://github.com/user-attachments/assets/4f214443-d347-4e7d-aa8f-64b8dfed9a71" />


9. Users can select a location from the list of recommended places. The pinned location is visible to everyone, along with the distance from each user in the group. The user who pinned it appears in the title.
<img width="1470" alt="Screenshot 2025-04-05 at 11 33 26 PM" src="https://github.com/user-attachments/assets/be535797-67d9-4c63-86bc-45b8f925ca3b" />


10. The live locations of group members are visible in the map along with the pinned location allowing them to visualise the distance from desired destination.
<img width="1470" alt="Screenshot 2025-04-05 at 11 33 26 PM" src="https://github.com/user-attachments/assets/a9e31eac-ea16-4f14-8ae9-24c9c95d41b3" />


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
- Google Maps API - For fetching real time location of user.access
- Geoapify API - For personalized place recommendations that match group preferences
- GoogleAuth API: Secures user login and prevents unauthorized access.
- OpenWeatherMap API: Shows current and forecasted weather for travel planning.


## **Features Implemented** 
- User Authentication: Provides secure registration and login functionality to ensure that only authorized users can access the application.
- Group Creation and Management: Users can create travel groups, add members, and engage in group chats. They can also share files and images within the group, making collaboration and planning easier.
- Real-Time Location Access: Users can view their current location on an interactive map and search for desired destinations or points of interest.
- Live Location Sharing: Users can share their live location with other group members. All members can view each other’s real-time positions on the map, enhancing coordination during trips.
- Group Location Tracking: Users can mark a common meeting point on the map and track the live location of all group members relative to that spot.
- Smart Place Suggestions (Geoapify Integration): Based on group preferences and user prompts, the app suggests recommended places to visit using the Geoapify Places API.
- Weather Information: Integrated with the OpenWeatherMap API, the app displays current weather conditions and forecasts for selected destinations, helping users plan their activities accordingly.

## **Preliminary Setup**

- Install the latest version of Node.JS on your system.
- To run this, you must have access to some API keys. 
- Create the account and generate your own API Key for the following.

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


 ## Steps to Run

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
