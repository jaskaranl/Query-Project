# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### TechStack of the Project

Nodejs
React
MongoDB Cloud
Express
Nginx

### `Working of the Project`

I have exposed the endpoint POST http://localhost:3000/ for log ingestion in out Cloud database Which solves our problem of handling high loads of logs. I have Used Nginx to handle high volumes of logs efficiently which routes out requests to one of the several server instances reducing the overall load on a single server.

To overcome the obstacles of bottlenecks such as I/O operations i have implemented asynchronous programming in server-side so that server doesn't wait over a single request and divide the requests to both servers equally we can add more servers as per our needs

Since we are using MongoDB cloud solution the scalabilty of our application is in good hands we can scale as per our needs but because of currently being using free-tier of mongodb we are limited to 100 operations per/s



### `Frontend Working of the Project`

To start Frontend create a .env file and put PORT=4200 and CONNECTION_URL=mongodb+srv://kambojjaskaran321:jaanu123@cluster0.ph3pvhp.mongodb.net/?retryWrites=true

run start:frontend is the command for launching frontend
The frontend is hosted at http://localhost:4200/

## `How to Ingest Log`

You can ingest log by making a POST request to http://localhost:3000/ and body in format as specified and data fetch data from mongodb cloud by making a POST request to http://localhost:3000/query which routes the request to each server for the sake of project i have made 2 server instances

## `Search Result`
Data is stored in BSON format for occupying less storage in the cloud for Efficient storage.Data is Indexed in for faster search results and sharding in case of failure of primary database

## Available Scripts

In the project directory, you can run:

### `npm start:frontend`

Runs the app in the development mode.\
Open [http://localhost:4200](http://localhost:4200) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm start:backend:node1`

Runs the Backend server instance 1 in the development mode.\
(http://localhost:8080) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
### `npm start:backend:node2`

Runs the Backend server instance 1 in the development mode.\
(http://localhost:8081) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

