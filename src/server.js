require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const server = express();
const cors = require("cors");

server.use(cors({ origin: "*" }));
server.use(express.json());
server.use(morgan("tiny"));
server.use("/api", require("./routes.js"));

const PORT = process.env.PORT || 4000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor backend iniciado em http://localhost:${PORT}`);
});
