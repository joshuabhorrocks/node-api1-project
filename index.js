const express = require("express");

const server = express();

server.use(express.json());
const {v4: uuidv4} = require("uuid");

let users = [
    {
        id: "1",
        name: "James T Kirk",
        bio: "Captain of the USS Enterprise NCC-1701"
    },
    {
        id: "2",
        name: "Jean-Luc Picard",
        bio: "Captain of the USS Enterprise NCC-1701-D"
    },
]

server.get("/", (req, res) => {
    res.json({api: "Up and running"})
})

server.get("/api/users", (req, res) => {
    try {
    res.json(users) 
    } catch {
        res.status(500).json("The users information could not be retrieved")
    }
})

server.post("/api/users", (req, res) => {
    const thisUser = {
        id: uuidv4(),
        ...req.body
    } 
    if (!thisUser.name || !thisUser.bio) {
        res.status(400).json({errorMessage: "Please provide a name and bio for the user."})
    } else if (!thisUser.id) {
        res.status(500).json({errorMessage: "There was an error while saving the user to the database"})
    } else {
        users.push(thisUser)
        res.status(201).json(thisUser)
    }
})

server.get("/api/users/:id", (req, res) => {
    const thisUser = {
        id: String(req.params.id),
        ...req.body
    } 
    if (thisUser.id === undefined) {
        res.status(404).json({message: "The user with the specified ID does not exist."})
    } else if (thisUser.id == users.id ) {
        res.status(500).json({errorMessage: "The user information could not be retrieved."})
    } else {
        users = users.filter(user => user.id === thisUser.id)
        res.status(200).json(users);
    }
})

server.delete("/api/users/:id", (req, res) => {
    const thisUser = {
        id: String(req.params.id),
        ...req.body
    } 
    if (thisUser.id === undefined) {
        res.status(404).json({message: "The user with the specificed ID was not found."})
    } else if (thisUser.id == users.id) {
        res.status(500).json({errorMessage: "The user could not be removed"})
    }
    else {
        users = users.filter(user => user.id !== thisUser.id)
        res.status(200).json(users)
    }   
})

server.put("/api/users/:id", (req, res) => {
    const thisUser = {
        id: String(req.params.id),
        ...req.body
    } 
    if (thisUser.id === undefined) {
        res.status(404).json({message: "The user with the specified ID does not exist."})
    } else if (!thisUser.name || !thisUser.bio) {
        res.status(400).json({errorMessage: "Please provide name and bio for the user."})
        } else if (thisUser.id == users.id) {
            res.status(500).json({errorMessage: "The user information could not be modified"})
        } else {
            thisUser.name = req.body.name;
            thisUser.bio = req.body.bio;
            users = users.filter(user => user.id !== thisUser.id);
            users.push(thisUser)
            res.status(204).json(users);
        }
})

server.listen(8000, () => console.log("\nApi is running\n"))