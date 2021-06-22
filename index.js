const express = require("express");
const WebSocket = require("ws");
const API = require("indian-stock-exchange");
const app = express();
const server = require("http").createServer(app);

const wss = new WebSocket.Server({ server: server });

const NSEAPI = API.NSE;
const BSEAPI = API.BSE;

const getData = (ws) => {
  BSEAPI.getIndices()
    .then(function (response) {
      //console.log("got response");
      //console.log(response.data);
      const data = JSON.stringify(response.data);
      ws.send(data);
    })
    .catch((err) => {
      console.log("Error fetching data!!!");
    });
};

wss.on("connection", function connection(ws) {
  console.log("A new client Connected");
  ws.send("Welcome new client");

  var broadcast = function () {
    getData(ws);
  };
  setInterval(broadcast, 3000);

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);

    //send msg to connected client
    //ws.send("Got your message its " + message);

    //send msg to every connected client except the one who sent a message
    //   wss.clients.forEach(function each(client) {
    //     if (client !== ws && client.readyState === WebSocket.OPEN) {
    //       client.send(message);
    //     }
    //   });
  });
});

app.get("/", (req, res) => res.send("Hello World"));

server.listen(3000, () => console.log("Listening on Port: 3000"));
