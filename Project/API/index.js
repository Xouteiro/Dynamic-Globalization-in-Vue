var Express = require('express');
var MongoClient = require('mongodb').MongoClient;
var cors = require('cors');
const multer = require('multer');

var app = Express();
app.use(cors());
app.use(Express.json());

var CONNECTION_URL = 'mongodb://localhost:27017';
var DATABASE_NAME = 'VueAppLocal';
var database;


app.listen(5037, () => {
    MongoClient.connect(CONNECTION_URL, (error, client) => {
        if (error) {
            console.error('Failed to connect to the database. Error:', error);
            return;
        }
        database = client.db(DATABASE_NAME);
        console.log('Connected to the database');
    });
});


app.get('/Idioms', (request, response) => {
    database.collection('Idioms').find({}).toArray((error,result) => {
        if (error) {
            console.error('Failed to fetch idioms. Error:', error);
            response.status(500).send('Failed to fetch idioms');
            return;
        }
        response.send(result);
    });
});



app.get('/Idioms/:name', (request, response) => {
    database.collection('Idioms').findOne({ name: request.params.name }, (error,result) => {
        if (error) {
            console.error('Failed to fetch idiom. Error:', error);
            response.status(500).send('Failed to fetch idiom');
            return;
        }
        response.send(result);
    });
});

app.get('/Idioms/:name/vocabulary', (request, response) => {
    database.collection('Idioms').findOne({ name: request.params.name }, (error,result) => {
        if (error) {
            console.error('Failed to fetch idiom. Error:', error);
            response.status(500).send('Failed to fetch idiom');
            return;
        }
        response.send(result.vocabulary);
    });
});

app.get('/Idioms/get/names', (request, response) => {
    console.log("Starting to fetch all idioms");
    database.collection('Idioms').find({}, { projection: { name: 1, _id: 0} }).toArray((error,result) => {
        console.log("Inside the find() callback");
        if (error) {
            console.error('Failed to fetch idioms. Error:', error);
            response.status(500).send('Failed to fetch idioms');
            return;
        }
        console.log("Result: ");
        console.log(result);
        response.send(result);
    });
});

app.post('/Idioms', async (request, response) => {
    try {
        const count = await database.collection('Idioms').countDocuments({ name: request.body.name });
        if(count == 0){
            database.collection('Idioms').insertOne(request.body);
            return response.status(201).send('Idiom inserted');
        }
        else{
            console.error('Idiom already exists');
            response.status(400).send('Idiom already exists');
            return;
        }
     } catch (error) {
        console.error('Failed to insert idiom. Error:', error);
        response.status(500).send('Failed to insert idiom');
        return;
    }
});


app.put('/Idioms/:name/vocabulary/', async (request, response) => {
    let result = await database.collection('Idioms').findOne({ name: request.params.name });
    let newVocabulary = result.vocabulary;

    if(newVocabulary == undefined){
        newVocabulary = {};
        newVocabulary[request.body.key] = request.body.value;
    }

    else if(newVocabulary[request.body.key] != request.body.value){
        newVocabulary[request.body.key] = request.body.value;
    }

    database.collection('Idioms').updateOne({ name: request.params.name }, { $set: { vocabulary: newVocabulary} }, (error,result) => {
        if (error) {
            console.error('Failed to update idiom. Error:', error);
            response.status(500).send('Failed to update idiom');
            return;
        }
        response.send(result);
    });
});
