# marleydacat.site Frontend

This folder contains the code for the ReactJS frontend application for marleydacat.site. All commands in this document should be executed inside this "frontend" directory unless noted otherwise.

## Installation

Before starting up the application for the first time, you must install the `node_modules`.
To do so, run `npm install -i`

## Configuarion

Currently there is only one variable to configure, `REACT_APP_BACKEND_HOST` stores the URL for the backend host which the frontend should make requests to.
Configuration details are stored in the `.env` file. This currently defaults to the live production backend, `http://marleydacat.site:8080`, but you can change it to connect to your local machine for development by changing it to `http://localhost:8080`.

## Deployment

Once the required packages have been installed, you can start a development server and serve the application via the command `npm start`.
This will startup the application on `http://localhost:3000`.