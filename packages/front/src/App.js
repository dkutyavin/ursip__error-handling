import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import APIService from "./api-service";

const request = new APIService();

const success = () => request.get("/success");
const badLogin = () => request.post("/auth-error");
const crashServer = () => request.get("/server-error");

function App() {
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          <button
            onClick={async () => {
              await success();
              setError("");
              setInfo("You get success");
            }}
          >
            OK request
          </button>
          <button
            onClick={async () => {
              try {
                await badLogin({
                  login: "loh",
                  password: "pidr",
                });
              } catch (error) {
                setError(error.message);
                setInfo("You fucked up");
              }
            }}
          >
            Client error request
          </button>
          <button
            onClick={async () => {
              try {
                await crashServer();
              } catch (err) {
                setError("Server error: please try again later");
                setInfo("Server is broken");
              }
            }}
          >
            Server error request
          </button>
        </div>

        <div style={{ color: "green" }}>Result: {info}</div>

        {error && <div style={{ color: "red" }}>{error}</div>}
      </header>
    </div>
  );
}

export default App;
