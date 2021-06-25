const express = require("express");
const WebSocket = require("ws");

const app = express();
const server = require("http").createServer(app);

const wss = new WebSocket.Server({ server: server });
const API = require("indian-stock-exchange");

const NSEAPI = API.NSE;
const BSEAPI = API.BSE;

NSEAPI.getMarketStatus()
  .then((res) => {
    console.log("market status=", res);
  })
  .catch((err) => {
    console.log("Error in market status");
  });

let getAPI = BSEAPI;
let data = "";

var curTime = new Date();
var day = curTime.getDay();
curTime = parseInt(
  curTime.getHours() +
    "" +
    ("0" + curTime.getMinutes()).substr(-2) +
    "" +
    ("0" + curTime.getSeconds()).substr(-2)
);

const getData = () => {
  getAPI
    .getIndices()
    .then(function (response) {
      //console.log("got response");
      //console.log(response.data);
      data = JSON.stringify(response.data);
      // ws.send(data);
    })
    .catch((err) => {
      console.log("Error fetching data!!!");
    });
};

if (curTime > 60000 && curTime < 173000 && day > 0 && day < 6) {
  console.log("It's a good time Market is open!");
  setInterval(getData, 5000);
} else console.log("It's not a good time Market closed!");

wss.on("connection", function connection(ws) {
  console.log("A new client Connected");
  ws.send("Welcome new client");

  var broadcast = function () {
    ws.send(data);
  };
  setInterval(broadcast, 3000);

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    if (message == "BSE") getAPI = BSEAPI;
    else getAPI = NSEAPI;

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
