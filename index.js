const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");
const yahooStockPrices = require("yahoo-stock-prices");
const wss = new WebSocket.Server({ server: server });

var unirest = require("unirest");

const getData = async (ws) => {
  //   const data = await yahooStockPrices.getCurrentData("AAPL");
  //   console.log("data=", data); // { currency: 'USD', price: 132.05 }
  var req = unirest("GET", "https://twelve-data1.p.rapidapi.com/quote");

  req.query({
    symbol: "AMZN",
    interval: "1day",
    outputsize: "30",
    format: "json",
  });

  req.headers({
    "x-rapidapi-key": "442b7a388emshc9f9d9690c9d95fp1b0fe3jsnfcf24d770bb7",
    "x-rapidapi-host": "twelve-data1.p.rapidapi.com",
    useQueryString: true,
  });

  req.end(function (res) {
    if (res.error) {
      console.log("res.error");
    } else {
      let data = res.body;
      data = JSON.stringify(data);
      ws.send(data);
    }
  });
};

wss.on("connection", function connection(ws) {
  //console.log("ws=", ws);
  console.log("A new client Connected");
  ws.send("Welcome new client");
  //while (true) {
  //setTimeout(getData(ws),3000);
  getData(ws);
  //}

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
