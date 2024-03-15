const WebSocket = require("ws");
const Imap = require("node-imap");
const { json } = require("express");
const mongoose = require("mongoose");
const db = mongoose.connection;

// WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Define MongoDB connection URI
const mongoURI = "mongodb://127.0.0.1:27017/mydatabase";

// Connect to MongoDB
console.log("begin");
mongoose.connect(mongoURI);
db.on("error", (error) => console.log(error));
db.once("open", () => console.log(`connected to database with`));

// Define a schema for crtl emails
const crtlEmailsSchema = new mongoose.Schema({
  subject: String,
  sender: String,
});

// Create a Mongoose model based on the schema
const Model = mongoose.model("crtl_emails", crtlEmailsSchema);

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("message", function incoming(message) {
    // console.log("received: %s", message);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        // Insert multiple documents into the collection
        Model.insertMany(JSON.parse(message).payload)
          .then((result) => {
            console.log("Documents inserted successfully:", result);
          })
          .catch((error) => {
            console.error("Error inserting documents:", error);
          });
        client.send(JSON.stringify(JSON.parse(message)));
      }
    });
  });
});
