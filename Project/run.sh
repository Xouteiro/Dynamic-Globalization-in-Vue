#!/bin/bash
#Starts the mongod, node API and the VueApp

echo "Starting mongod..."
sudo systemctl start mongod
echo "mongod started successfully."

echo "Running node index.js..."
node API/index.js &
echo "Node script executed successfully."

echo "Running npm script on Vue..."
cd VueApp
npm run dev
echo "npm script executed successfully."
