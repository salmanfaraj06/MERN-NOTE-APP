// api methods, importing npm packages which we downloaded
var Express = require('express'); // express is a web application framework for Node.js
var Mongoclient = require('mongodb').MongoClient; // mongodb is a NoSQL database program, and it is used to store data
var cors = require('cors');  // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const multer = require('multer'); // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum

// creating an instance of the express app
var app = Express(); 
app.use(cors(
    {
        origin: ['https://mern-note-app-alpha.vercel.app'], // This is the port number where the react app is running
        methods: ['GET,POST,DELETE'], // These are the methods that are allowed
        credentials: true
    
    }
)); 

// connecting to the database
var CONNECTION_STRING = 'mongodb+srv://salmanfaraj06:pKiYtVTLcdCvtAyx@cluster0.hylt9m6.mongodb.net/?retryWrites=true&w=majority';

// Writing db name for mongodb connection
var DATABASENAME = 'TODOAPP';
// instantiate mongodb connection
var database;

// express app will listen to the activity on port 
const PORT = process.env.PORT || 5038; // Use the PORT environment variable if it's set, otherwise use 5038

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    Mongoclient.connect(CONNECTION_STRING, (error, client) => { // connecting to the database
        if (error) {
            console.error('Failed to connect to the database. Error:', error);
        } else {
            database = client.db(DATABASENAME);
            console.log("Mongodb connection was successful");
        }
    });
});

// api methods to get all data from mongodb
//THE PATHWAY:It's not a file or directory path on your local machine, but a path in the URL that clients use to access your server.
app.get('/api/todoapp/GetNotes', (request, response) => { // get method to retrieve data from mongodb
    database.collection('TODOCOLLECTION').find({}).toArray((error, result) => {
        if (error) {
            console.error('Failed to retrieve data. Error:', error);
            response.status(500).send('Failed to retrieve data'); // 500 is an HTTP status code that means that there was an error on the server
        } else {
            response.send(result);
        }
    });
})

// method to add and delete 

app.post('/api/todoapp/AddNotes',multer().none(), (request, response) => { // post method to add data to mongodb
    database.collection('TODOCOLLECTION').count({},function(error,numOfDocs){ // count method to count the number of documents in the collection
        database.collection('TODOCOLLECTION').insertOne({ // insert method to insert data into the collection
            id:(numOfDocs + 1).toString(),
            description:request.body.description
        });
        response.json('added successfully');
            
    })
});

app.delete('/api/todoapp/DeleteNotes',(request, response) => { // delete method to delete data from mongodb
    database.collection('TODOCOLLECTION').deleteOne({ // delete method to delete data from the collection
        id:request.query.id // query method to get the id of the document to be deleted
    });
    response.json({message:'Deleted Successfully!'});
})