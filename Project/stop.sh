#!/bin/bash
#Kills the mongod and node index.js process

echo "Stoping mongod..."
sudo systemctl stop mongod
echo "mongod stoped successfully."

echo "Killing node index.js port..."
npx kill-port 5037 
echo "Node script executed successfully."
