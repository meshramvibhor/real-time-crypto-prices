Pre-requisites:
    1. node v21
    2. A mongoDb server running locally on port 27017;

How to start backend server:
    1. npm i
    2. npx ts-node src/server.ts

Note : Backend server will run on port 5000. Used cron job to fetch data every 5 seconds. And used socket.io to send data in real time.