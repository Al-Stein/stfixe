const express = require("express");
const cors = require("cors");
const path = require("path");
const WebSocket = require("ws");
const mongoose = require("mongoose");
var ObjectId = require("mongodb").ObjectId;

// Connect to MongoDB ===========================================================================================
const mongoURI = "mongodb://127.0.0.1:27017/mydatabase";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("Connected to MongoDB"));

// WebSocket server ====================================================================================
const wss = new WebSocket.Server({ port: 8080 });
wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("message", function incoming(res) {
    try {
      const message = JSON.parse(res);
      if (message.type === "new_crtl") {
        // // Insert documents into the collection
        // const CrtlEmailModel = require("./models/CrtlEmailModel");
        // CrtlEmailModel.insertMany(
        //   data.payload.map((ele) => ({ ...ele, seen: false }))
        // )
        //   .then((result) => {
        //     console.log("Documents inserted successfully:", result);
        //   })
        //   .catch((error) => {
        //     console.error("Error inserting documents:", error);
        //   });

        // Forward message to all connected clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "alert", message: "new_crtl" }));
          }
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });
});

// Express Server =============================================================================================
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

// // Serve index.html on all routes
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/public", "index.html"));
// });

const DbBriseModel = require("./models/DbBrise");
const CrtlEmailModel = require("./models/CrtlEmailModel");
app.get("/Taux-cloture", async (req, res) => {
  try {
    const data = await DbBriseModel.aggregate([
      { $match: { "Week Cloture": { $ne: NaN } } },
      { $group: { _id: "$Week Cloture", some: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/Taux-ouverture", async (req, res) => {
  try {
    const data = await DbBriseModel.aggregate([
      { $match: { "Week Creation": { $ne: NaN } } },
      { $group: { _id: "$Week Creation", some: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/crtl-mails", async (req, res) => {
  try {
    const data = await CrtlEmailModel.find();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.put("/see-mail/:id", async (req, res) => {
  try {
    await CrtlEmailModel.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { seen: true } }
    );
    res.status(200).json({ message: "Email seen status updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Start the Express server-------------------------------------------------------------------------------------------
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
