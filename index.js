require("dotenv").config();

const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs").promises;

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;

const routes = {
  "/": async (req, res) => {
    try {
      const data = await fs.readFile(
        path.join(__dirname, "template", "index.html"),
        "utf-8"
      );
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(data);
    } catch (error) {
      console.error(`Error occurred while reading index.html: ${error}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  },
  "/books": async (req, res) => {
    try {
      const data = await fs.readFile(
        path.join(__dirname, "json", "book.json"),
        "utf-8"
      );
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(data);
    } catch (error) {
      console.error(`Error occurred while reading book.json: ${error}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  },
  "/authors": async (req, res) => {
    try {
      const data = await fs.readFile(
        path.join(__dirname, "json", "author.json"),
        "utf-8"
      );
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(data);
    } catch (error) {
      console.error(`Error occurred while reading author.json: ${error}`);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  },
};

const requestListener = async function (req, res) {
  try {
    const parsedUrl = url.parse(req.url);
    const handler = routes[parsedUrl.pathname];

    if (handler) {
      await handler(req, res);
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not Found" }));
    }
  } catch (error) {
    console.error(`Error occurred while handling request: ${error}`);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Library system currently running on http://${host}:${port}`);
});

