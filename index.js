const express = require("express");
const server = express();

server.use(express.json());

server.listen(5000, ()=>{ console.log("server is running on port 5000"); });