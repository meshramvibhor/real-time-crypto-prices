For Backend: 

Pre-requisites: 
  1. node v21
  2. A mongoDb server running locally on port 27017

How to start backend server: 
  1. npm i
  2. npx ts-node src/server.ts

Note : Backend server will run on port 5000. Used cron job to fetch data every 5 seconds. And used socket.io to send data in real time. Real time update will pause for a minute in between due to rate limiter of crypto price fetch apis.


For frontens:


Pre requisutes : 
  1. node v21

How to start the frontend server: 
  1. npm i
  2. npm run dev

Note: App will be accessible on port 3000, used redux and localstorage for global state management, and use useState for component level state management. Redux is used to manage data coming from servers.
