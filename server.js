const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;
let db = require('./db/db.json')
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, writeToFile } = require('./helpers/fsUtils');
const fs = require('fs')


app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//route to the api
app.get("/api/notes", (req, res) => {
	var data = fs.readFileSync('./db/db.json')
	var updatedDB = JSON.parse(data)
	console.log(updatedDB)
	res.json(updatedDB)
	
	
});
//Takes you to homepage
app.get("/notetaker", (req, res) => {
	res.sendFile(path.join(__dirname, "public/index.html"))
});
//Takes you to the notetaking application
app.get("/notes", (req, res) => {
	res.sendFile(path.join(__dirname, "public/notes.html"))
});
//post route to add a new note to db.json as well as give it a unique id.
app.post("/api/notes",(req, res)=> {

const newNote = {
	title: req.body.title,
	text: req.body.text,
	id: uuidv4(),
};

db = readAndAppend(newNote, './db/db.json')
res.json(`Info added successfully 🚀`);
console.log(newNote)

});




//create a delete route that has a variable parameter based on what's given searches for
//matching object in our database, and deletes that object. 
app.delete("/api/notes/:id", (req, res) => {
	const id = req.params.id;
	var data = fs.readFileSync('./db/db.json')
	var db = JSON.parse(data)
	for (let i = 0; i < db.length; i++){
	if (db[i].id == id){
	
	res.json(db[i]);
	db = db.filter(note => note.id !== id)
	console.log(db)
	writeToFile('./db/db.json', db)
	}
	}

});

//function for server to listen upon invoking this file
app.listen(PORT, function() {
	console.log("we are listening")
});


