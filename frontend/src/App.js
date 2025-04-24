import React from "react";
import ReactDOM from "react-dom";
import './App.css';
import "98.css";

const App = () => {
  return (
    <div style={{ width: 300 }} className="window">
      <div className="title-bar">
        <div className="title-bar-text">LastFM Stats</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" />
          <button aria-label="Maximize" />
          <button aria-label="Close" />
        </div>
      </div>

      <div className="window-body">

      </div>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div style={{ width: 350 }}>
        <App />
      </div>
    </div>
  </React.StrictMode>,
  rootElement
);
