var Express = require('express');
var MongoClient = require('mongodb').MongoClient;
var cors = require('cors');

var app = Express();
app.use(cors());
app.use(Express.json());

var CONNECTION_URL = 'mongodb://localhost:27017';
var DATABASE_NAME = 'VueLocal';
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




//GET

//Get all the idioms
//Returns an array of all the idioms objects from the db

app.get('/Idioms', (request, response) => {
    database.collection('Idioms').find({}).toArray((error, result) => {
        if (error) {
            console.error('Failed to fetch idioms. Error:', error);
            response.status(500).send('Failed to fetch idioms');
            return;
        }
        else if (result == undefined) {
            response.status(404).send('Idioms not found');
            return
        }
        else {
            // setTimeout(() => {
                response.send(result);
            // }, 1000);
        }
    });
});


//Get an idiom by name
//Returns the whole idiom object from the db
//Ex: {"_id":"65e1f98c20f052db1eeb14ff","name":"pt","vocabulary":{"Home":"Casa","About":"Sobre"}}

app.get('/Idioms/:name', (request, response) => {
    database.collection('Idioms').findOne({ name: request.params.name }, (error, result) => {
        if (error) {
            console.error('Failed to fetch idiom. Error:', error);
            response.status(500).send('Failed to fetch idiom');
            return;
        }
        else if (result == undefined) {
            response.status(404).send('Idiom not found');
            return
        }
        else {
            // setTimeout(() => {
                response.send(result);
            // }, 2000);
        }
    });
});


//Get the vocabulary of an idiom by name
//Returns an object with the key-value pairs of the vocabulary
//Ex: {"Home":"Casa","About":"Sobre"}

app.get('/Idioms/:name/vocabulary', (request, response) => {
    database.collection('Idioms').findOne({ name: request.params.name }, (error, result) => {
        if (error) {
            console.error('Failed to fetch idiom. Error:', error);
            response.status(500).send('Failed to fetch idiom');
            return;
        }
        else if (result == undefined) {
            response.status(404).send('Idiom not found');
            return
        }
        else if (result.vocabulary == undefined || Object.keys(result.vocabulary).length == 0) {
            response.status(404).send('Vocabulary is empty');
            return
        }
        else {
            response.send(result.vocabulary);
        }
    });
});

//Get the vocabulary of an idiom by name
//Returns an object with the key-value pairs of the vocabulary
//Ex: {"Home":"Casa","About":"Sobre"}

app.get('/Idioms/:name/news', (request, response) => {
    database.collection('Idioms').findOne({ name: request.params.name }, (error, result) => {
        if (error) {
            console.error('Failed to fetch idiom. Error:', error);
            response.status(500).send('Failed to fetch idiom');
            return;
        }
        else if (result == undefined) {
            response.status(404).send('Idiom not found');
            return
        }
        else if (result.News == undefined || Object.keys(result.News).length == 0) {
            response.status(404).send('Vocabulary is empty');
            return
        }
        else {
            response.send(result.News);
        }
    });
});


//Get just the names of all the idioms
//Returns an array of Objects like this: [{"name":"ar"},{"name":"pt"},{"name":"en"},{"name":"sp"}]

app.get('/Idioms/get/names', (request, response) => {
    database.collection('Idioms').find({}, { projection: { name: 1, _id: 0 } }).toArray((error, result) => {
        if (error) {
            console.error('Failed to fetch idioms. Error:', error);
            response.status(500).send('Failed to fetch idioms');
            return;
        }
        else if (result == undefined) {
            response.status(404).send('No idioms found');
            return
        }
        else {
            response.send(result);
        }
    });
});



app.get('/mainLanguage', (request, response) => {
    database.collection('configurations').findOne({}, (err, result) => {
        if (err) {
            response.status(500).send(err);
        } else {
            response.json({ main_language: result.main_language });
        }
    });
});

//POST


//Create an idiom
//The idiom is passed in the body of the request like this ex: 
// {
// "name": "pt",
//   "vocabulary": {
//     "Home": "Casa",
//     "About": "Sobre"
//     //Add more key-value pairs here
//   }
// }


app.post('/Idioms', async (request, response) => {
    try {
        const count = await database.collection('Idioms').countDocuments({ name: request.body.name });
        if (count == 0) {
            database.collection('Idioms').insertOne(request.body);
            return response.status(201).send('Idiom inserted');
        }
        else {
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


//PUT

//Update an idiom vocabulary
//If the idiom doesn't have a vocabulary, it will be created
//If the idiom has a vocabulary, the new key-value pair will be added
//The key value pair is passed in the body of the request like this: {"key":"Home","value":"casa"}

app.put('/Idioms/:name/vocabulary/', async (request, response) => {
    let result = await database.collection('Idioms').findOne({ name: request.params.name });
    let newVocabulary = result.vocabulary;
    let key = request.body.key;
    let keys = [];
    if (key.includes('.')) {
        keys = key.split('.');
        let current = newVocabulary;
        for (let i = 0; i < keys.length; i++) {
            if (i === keys.length - 1) {
                current[keys[i]] = request.body.value;
            } else {
                if (current[keys[i]] == undefined) {
                    console.log('error in current[keys[i]]');
                }
                else{
                current = current[keys[i]];
                }
            }
        }
    }

    else if (newVocabulary == undefined) {
        newVocabulary = {};
        newVocabulary[request.body.key] = request.body.value;
    }
    else {
        newVocabulary[request.body.key] = request.body.value;
    }



    database.collection('Idioms').updateOne({ name: request.params.name }, { $set: { vocabulary: newVocabulary } }, (error, result) => {
        if (error) {
            console.error('Failed to update idiom. Error:', error);
            response.status(500).send('Failed to update idiom');
            return;
        }
        response.send(result);
    });
});


//Update an idiom vocabulary
//If the idiom doesn't have a vocabulary, it will be created
//If the idiom has a vocabulary, the new key-value pair will be added
//The key value pair is passed in the body of the request like this: {"key":"Home","value":"casa"}

app.put('/Idioms/:name/news/', async (request, response) => {
    let result = await database.collection('Idioms').findOne({ name: request.params.name });
    let newNews = result.News;
    let key = request.body.key;
    let keys = [];
    if (key.includes('.')) {
        keys = key.split('.');
        let current = newNews;
        for (let i = 0; i < keys.length; i++) {
            if (i === keys.length - 1) {
                current[keys[i]] = request.body.value;
            } else {
                if (current[keys[i]] == undefined) {
                    console.log('error in current[keys[i]]');
                }
                else{
                current = current[keys[i]];
                }
            }
        }
    }

    else if (newNews == undefined) {
        newNews = {};
        newNews[request.body.key] = request.body.value;
    }
    else {
        newNews[request.body.key] = request.body.value;
    }



    database.collection('Idioms').updateOne({ name: request.params.name }, { $set: { News: newNews } }, (error, result) => {
        if (error) {
            console.error('Failed to update idiom. Error:', error);
            response.status(500).send('Failed to update idiom');
            return;
        }
        response.send(result);
    });
});



//Update the main language

app.put('/mainLanguage', async (request, response) => {

    idiom_names = null;

    try{
    idiom_names = await database.collection('Idioms').find({}, { projection: { name: 1, _id: 0 } }).toArray();
        if (idiom_names == undefined) {
            response.status(404).send('No idioms found');
            return;
        }
        else {
            idiom_names = idiom_names.map((idiom) => idiom.name);
        }

    }catch(error){
        console.error('Failed to fetch idioms. Error:', error);
        response.status(500).send('Failed to fetch idiommms'); 
        return;
    }

    if (request.body.main_language == undefined) {
        response.status(400).send('Main language not provided');
        return;
    }
    if(idiom_names == null){
        response.status(500).send('Failed to fetch idioms');
        return;
    }
    if(!request.body.main_language in idiom_names){
        response.status(400).send('Main language not found');
        return;
    }

    database.collection('configurations').updateOne({}, { $set: { main_language: request.body.main_language } }, (error, result) => {
        if (error) {
            console.error('Failed to update main language. Error:', error);
            response.status(500).send('Failed to update main language');
            return;
        }
        response.send(result);
    });
});


//DELETE


//Delete an idiom by name ---- is missing security and error handling
app.delete('/Idioms/:name', (request, response) => {
    database.collection('Idioms').deleteOne({ name: request.params.name }, (error, result) => {
        if (error) {
            console.error('Failed to delete idiom. Error:', error);
            response.status(500).send('Failed to delete idiom');
            return;
        }
        response.send(result);
    });
});

//Delete a key from the vocabulary of an idiom ---- is missing security and error handling
app.delete('/Idioms/:name/vocabulary/:key', async (request, response) => {
    let result = await database.collection('Idioms').findOne({ name: request.params.name });
    let newVocabulary = result.vocabulary;
    delete newVocabulary[request.params.key];

    database.collection('Idioms').updateOne({ name: request.params.name }, { $set: { vocabulary: newVocabulary } }, (error, result) => {
        if (error) {
            console.error('Failed to delete vocabulary key. Error:', error);
            response.status(500).send('Failed to delete vocabulary');
            return;
        }
        response.send(result);
    });
});
