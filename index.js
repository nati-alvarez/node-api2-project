const express = require("express");
const server = express();

const postRoutes = require("./posts/postRoutes");

server.use(express.json());

server.use("/api/posts", postRoutes);

server.listen(5000, ()=>{ console.log("server is running on port 5000"); });