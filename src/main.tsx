// Importing React core and rendering functions
import React from "react";
import ReactDOM from "react-dom/client";

// Importing the main App component and global styles
import App from "./App.tsx";
import "./index.css";

// Importing DnD (Drag and Drop) providers and backends
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

// Function to detect if the current device is a touch device
const isTouchDevice = () => {
  // Check if 'ontouchstart' is present in the window object
  if ("ontouchstart" in window) {
    return true;
  }
  // Fallback to media query check for coarse pointer (used in touch devices)
  return window.matchMedia("(pointer: coarse)").matches;
};

// Based on the device type, choose the correct backend for drag-and-drop
const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

// For touch devices, we enable mouse events to allow better interaction
const optionsForDND = isTouchDevice() ? { enableMouseEvents: true } : {};

// Rendering the app inside the root element
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Wrap the entire app with DndProvider to enable drag-and-drop functionality */}
    <DndProvider backend={backendForDND} options={optionsForDND}>
      <App />
    </DndProvider>
  </React.StrictMode>
);
