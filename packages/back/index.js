const express = require("express");

const app = express();

app.get("/success", (req, res) => {
  res.status(200).send({ data: "success" });
});

app.post("/auth-error", (req, res) => {
  res.status(401).send({ message: "Check your credentials" });
});

app.get("/server-error", (req, res) => {
  res.status(500).send({ message: "i obosralsya" });
});

app.listen(3001);
console.log(`🚀 server is up on http://localhost:3001`);
