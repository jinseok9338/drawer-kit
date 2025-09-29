/**
 * Manual Test UI Application
 * Interactive testing interface for drawer-kit functionality
 */

import React, { useState } from "react";
import { DrawerProvider } from "./drawer-kit";
import BasicDrawer from "./test-ui/examples/BasicDrawer";
import AdvancedDrawer from "./test-ui/examples/AdvancedDrawer";
import TestScenarios from "./test-ui/components/TestScenarios";

import SimpleDrawerOptionsTest from "./test-ui/examples/SimpleDrawerOptionsTest";
import "./App.css";

type TestPage = "basic" | "advanced" | "scenarios" | "simple-options";

export default function App() {
  const [currentPage, setCurrentPage] = useState<TestPage>("basic");

  const renderPage = () => {
    switch (currentPage) {
      case "basic":
        return <BasicDrawer />;
      case "advanced":
        return <AdvancedDrawer />;
      case "scenarios":
        return <TestScenarios />;
      case "simple-options":
        return <SimpleDrawerOptionsTest />;
      default:
        return <BasicDrawer />;
    }
  };

  return (
    <DrawerProvider>
      <div style={{ fontFamily: "system-ui, sans-serif", padding: "20px" }}>
        <header style={{ marginBottom: "30px" }}>
          <h1 style={{ margin: 0, color: "#333" }}>drawer-kit Manual Test UI</h1>
          <p style={{ margin: "10px 0 0 0", color: "#666" }}>
            Interactive testing interface for drawer-kit functionality
          </p>
        </header>

        <nav style={{ marginBottom: "30px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => setCurrentPage("basic")}
              style={{
                padding: "10px 20px",
                border: "2px solid #007acc",
                background: currentPage === "basic" ? "#007acc" : "white",
                color: currentPage === "basic" ? "white" : "#007acc",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Basic Examples
            </button>
            <button
              onClick={() => setCurrentPage("advanced")}
              style={{
                padding: "10px 20px",
                border: "2px solid #007acc",
                background: currentPage === "advanced" ? "#007acc" : "white",
                color: currentPage === "advanced" ? "white" : "#007acc",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Advanced Examples
            </button>
            <button
              onClick={() => setCurrentPage("scenarios")}
              style={{
                padding: "10px 20px",
                border: "2px solid #007acc",
                background: currentPage === "scenarios" ? "#007acc" : "white",
                color: currentPage === "scenarios" ? "white" : "#007acc",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Test Scenarios
            </button>

            <button
              onClick={() => setCurrentPage("simple-options")}
              style={{
                padding: "10px 20px",
                border: "2px solid #007acc",
                background: currentPage === "simple-options" ? "#007acc" : "white",
                color: currentPage === "simple-options" ? "white" : "#007acc",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Simple Options
            </button>
          </div>
        </nav>

        <main>{renderPage()}</main>

        <footer style={{ marginTop: "50px", padding: "20px 0", borderTop: "1px solid #eee" }}>
          <p style={{ margin: 0, color: "#999", fontSize: "14px" }}>
            drawer-kit v1.0.0 - Manual Test UI
          </p>
        </footer>
      </div>
    </DrawerProvider>
  );
}
