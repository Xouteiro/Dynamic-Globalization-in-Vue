# Dynamic Globalization in Vue

This project investigates how Vue handles globalization, specifically how it supports the implementation of a multilingual application and implements this globalization dynamically, so that users can easily edit and customize the texts displayed in the application.

## Vue.js + Express.js + MongoDB

The application is developed in Vue.js and makes HTTP requests to a server that implements a REST API, developed in Node.js Express. This server communicates with a MongoDB database to fulfill the requests made by the application.

## Screenshots
### Edit Pop-up
![popUpOpen](https://github.com/Xouteiro/Projeto_Integrador_VUE/assets/93874205/8f0d6c0a-7694-4fa0-9801-9b14a4ce7e4f)

### Table
![Table](https://github.com/Xouteiro/Projeto_Integrador_VUE/assets/93874205/7bb0e239-abe4-4725-b6b3-b109d2a7ed01)

## Instructions

In order to run this project run this command from the root of the project in the terminal:

```bash
cd Project
./run.sh
```

Or you can run the following commands:

```bash
cd Project
sudo systemctl start mongod
node API/index.js 
cd VueApp
npm run dev
``` 

And to stop the project run this command from the project folder in the terminal:

```bash
./stop.sh
```






