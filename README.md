
---
## **Contents**
- [Purpose](#Purpose)
- [Preview](#Preview)
- [TechStack](#TechStack)
- [APIs Used](#apisused)
- [Features Currently Implemented](#Features-Currently-Implemented)
- [Features to be Implemented](#Features-to-be-Implemented)
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
<img width="1470" alt="Screenshot 2025-02-28 at 6 28 15 PM" src="https://github.com/user-attachments/assets/88c907f3-f280-423e-aa4a-d5c71f1eb491" />


3. Location Map
<img width="1268" alt="Screenshot 2025-02-28 at 6 39 16 PM" src="https://github.com/user-attachments/assets/d5494129-9cc1-489f-ad66-8a172ae0278b" />
<img width="1470" alt="Screenshot 2025-02-28 at 6 15 00 PM" src="https://github.com/user-attachments/assets/70ea55e0-6238-4772-8b36-6ce0709ff9d3" />


## **Tech stack**

- Next.js
- React.js
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


## **Features Currently Implemented** 
- User Authentication: Secure login and registration through to ensure that only authorized users access the app.
- Group Creation and Management: Users can create group and chat, share files/images in group.
- Real-Time Location: Users can view current location on Map and can search for desired locations.
- Geoapify Implementation: View recommended places based on group preferences by giving prompt.
- Location Sharing : Users can share their live location with others in the group. Members will be able to see each other’s location on an interactive map.
- Location Tracking: Users can set a common spot on the map and track every group member's location
- Voting for Destinations: Users can suggest destinations and vote on them. The app will highlight the most popular choice for easier decision-making.
- Weather Integration: The app will integrate weather APIs (OpenWeatherMap or Weatherstack) to provide current and forecasted weather conditions for the selected destination.
- Route Planning: The app will display optimized travel routes using the Google Maps Directions API, offering options for walking, driving, or public transportation, along with estimated travel times and distances.


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
