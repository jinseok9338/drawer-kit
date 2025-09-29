/**
 * Simple Drawer Options Test UI
 * Testing interface for simplified DrawerOptions
 */

import React, { useState } from "react";
import { drawer } from "../../drawer-kit";
import type { DrawerOptions } from "../../drawer-kit/types";

export default function SimpleDrawerOptionsTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [currentOptions, setCurrentOptions] = useState<DrawerOptions>({});

  const addResult = (message: string) => {
    setTestResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // ===== Basic Options Tests =====
  const testDirection = (direction: "top" | "bottom" | "left" | "right") => {
    const options: DrawerOptions = { direction };
    setCurrentOptions(options);

    drawer.open(
      ({ close, unmount }) => (
        <div style={drawerStyle}>
          <h3>Direction Test: {direction}</h3>
          <p>This drawer opens from the {direction} direction.</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button onClick={close} style={buttonStyle("#007acc")}>
              Close
            </button>
            <button onClick={unmount} style={buttonStyle("#dc3545")}>
              Unmount
            </button>
          </div>
        </div>
      ),
      options
    );

    addResult(`Opened ${direction} drawer`);
  };

  const testModal = (modal: boolean) => {
    const options: DrawerOptions = { modal };
    setCurrentOptions(options);

    drawer.open(
      ({ close, unmount }) => (
        <div style={drawerStyle}>
          <h3>Modal Test: {modal ? "Modal" : "Non-Modal"}</h3>
          <p>
            Modal: {modal ? "Background interaction disabled" : "Background interaction enabled"}
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button onClick={close} style={buttonStyle("#007acc")}>
              Close
            </button>
            <button onClick={unmount} style={buttonStyle("#dc3545")}>
              Unmount
            </button>
          </div>
        </div>
      ),
      options
    );

    addResult(`Opened ${modal ? "modal" : "non-modal"} drawer`);
  };

  const testDismissible = (dismissible: boolean) => {
    const options: DrawerOptions = { dismissible };
    setCurrentOptions(options);

    drawer.open(
      ({ close, unmount }) => (
        <div style={drawerStyle}>
          <h3>Dismissible Test: {dismissible ? "Dismissible" : "Non-Dismissible"}</h3>
          <p>
            Dismissible:{" "}
            {dismissible
              ? "Can be dismissed by dragging/clicking"
              : "Cannot be dismissed by dragging/clicking"}
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button onClick={close} style={buttonStyle("#007acc")}>
              Close
            </button>
            <button onClick={unmount} style={buttonStyle("#dc3545")}>
              Unmount
            </button>
          </div>
        </div>
      ),
      options
    );

    addResult(`Opened ${dismissible ? "dismissible" : "non-dismissible"} drawer`);
  };

  const testHandleOnly = (handleOnly: boolean) => {
    const options: DrawerOptions = { handleOnly };
    setCurrentOptions(options);

    drawer.open(
      ({ close, unmount }) => (
        <div style={drawerStyle}>
          <h3>Handle Only Test: {handleOnly ? "Handle Only" : "Full Drawer"}</h3>
          <p>
            Handle only:{" "}
            {handleOnly ? "Only handle area is draggable" : "Entire drawer is draggable"}
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button onClick={close} style={buttonStyle("#007acc")}>
              Close
            </button>
            <button onClick={unmount} style={buttonStyle("#dc3545")}>
              Unmount
            </button>
          </div>
        </div>
      ),
      options
    );

    addResult(`Opened ${handleOnly ? "handle-only" : "full"} drawer`);
  };

  const testRepositionInputs = (reposition: boolean) => {
    const options: DrawerOptions = { repositionInputs: reposition };
    setCurrentOptions(options);

    drawer.open(
      ({ close, unmount }) => (
        <div style={drawerStyle}>
          <h3>Reposition Inputs Test: {reposition ? "Enabled" : "Disabled"}</h3>
          <p>
            Reposition inputs:{" "}
            {reposition ? "Inputs reposition when keyboard appears" : "Inputs stay in place"}
          </p>
          <input
            type="text"
            placeholder="Test input 1"
            style={{ padding: "8px", margin: "10px 0", width: "200px", display: "block" }}
          />
          <input
            type="text"
            placeholder="Test input 2"
            style={{ padding: "8px", margin: "10px 0", width: "200px", display: "block" }}
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button onClick={close} style={buttonStyle("#007acc")}>
              Close
            </button>
            <button onClick={unmount} style={buttonStyle("#dc3545")}>
              Unmount
            </button>
          </div>
        </div>
      ),
      options
    );

    addResult(`Opened drawer with input repositioning ${reposition ? "enabled" : "disabled"}`);
  };

  // ===== Event Callback Tests =====
  const testEventCallbacks = () => {
    const options: DrawerOptions = {
      onOpenChange: (open) => addResult(`onOpenChange: ${open}`),
      onClose: () => addResult("onClose called"),
      onAnimationEnd: (open) => addResult(`onAnimationEnd: ${open}`),
    };
    setCurrentOptions(options);

    drawer.open(
      ({ close, unmount }) => (
        <div style={drawerStyle}>
          <h3>Event Callbacks Test</h3>
          <p>Check the results below for event callbacks.</p>
          <p>Try opening and closing the drawer to see events.</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button onClick={close} style={buttonStyle("#007acc")}>
              Close
            </button>
            <button onClick={unmount} style={buttonStyle("#dc3545")}>
              Unmount
            </button>
          </div>
        </div>
      ),
      options
    );

    addResult("Opened drawer with event callbacks");
  };

  // ===== Complex Options Test =====
  const testComplexOptions = () => {
    const options: DrawerOptions = {
      direction: "bottom",
      modal: true,
      dismissible: true,
      handleOnly: false,
      repositionInputs: true,
      onOpenChange: (open) => addResult(`Complex onOpenChange: ${open}`),
      onClose: () => addResult("Complex onClose called"),
      onAnimationEnd: (open) => addResult(`Complex onAnimationEnd: ${open}`),
    };
    setCurrentOptions(options);

    drawer.open(
      ({ close, unmount }) => (
        <div style={drawerStyle}>
          <h3>Complex Options Test</h3>
          <p>This drawer uses multiple options combined:</p>
          <ul style={{ textAlign: "left", margin: "10px 0" }}>
            <li>Bottom direction</li>
            <li>Modal enabled</li>
            <li>Dismissible enabled</li>
            <li>Handle only disabled (full drawer draggable)</li>
            <li>Input repositioning enabled</li>
          </ul>
          <input
            type="text"
            placeholder="Test input for repositioning"
            style={{ padding: "8px", margin: "10px 0", width: "200px", display: "block" }}
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button onClick={close} style={buttonStyle("#007acc")}>
              Close
            </button>
            <button onClick={unmount} style={buttonStyle("#dc3545")}>
              Unmount
            </button>
          </div>
        </div>
      ),
      options
    );

    addResult("Opened drawer with complex options");
  };

  const buttonStyle = (color: string) => ({
    padding: "8px 16px",
    background: color,
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  });

  const drawerStyle = {
    padding: "20px",
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  };

  const sectionStyle = {
    marginBottom: "30px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  };

  const optionGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "10px",
    marginTop: "15px",
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "20px" }}>
      <h2 style={{ marginBottom: "30px", color: "#333" }}>Simple Drawer Options Test Suite</h2>

      {/* Current Options Display */}
      <div style={sectionStyle}>
        <h3>Current Options</h3>
        <pre
          style={{
            background: "#f0f0f0",
            padding: "10px",
            borderRadius: "4px",
            fontSize: "12px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(currentOptions, null, 2)}
        </pre>
      </div>

      {/* Test Results */}
      <div style={sectionStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h3>Test Results</h3>
          <button onClick={clearResults} style={buttonStyle("#6c757d")}>
            Clear Results
          </button>
        </div>
        <div
          style={{
            maxHeight: "200px",
            overflow: "auto",
            background: "#f8f9fa",
            padding: "10px",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          {testResults.length === 0 ? (
            <p style={{ color: "#666", fontStyle: "italic" }}>
              No test results yet. Start testing options below.
            </p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} style={{ marginBottom: "5px" }}>
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Direction Tests */}
      <div style={sectionStyle}>
        <h3>Direction Tests</h3>
        <p>Test different drawer directions</p>
        <div style={optionGridStyle}>
          <button onClick={() => testDirection("top")} style={buttonStyle("#28a745")}>
            Top
          </button>
          <button onClick={() => testDirection("bottom")} style={buttonStyle("#28a745")}>
            Bottom
          </button>
          <button onClick={() => testDirection("left")} style={buttonStyle("#28a745")}>
            Left
          </button>
          <button onClick={() => testDirection("right")} style={buttonStyle("#28a745")}>
            Right
          </button>
        </div>
      </div>

      {/* Modal Tests */}
      <div style={sectionStyle}>
        <h3>Modal Tests</h3>
        <p>Test modal vs non-modal behavior</p>
        <div style={optionGridStyle}>
          <button onClick={() => testModal(true)} style={buttonStyle("#17a2b8")}>
            Modal
          </button>
          <button onClick={() => testModal(false)} style={buttonStyle("#17a2b8")}>
            Non-Modal
          </button>
        </div>
      </div>

      {/* Dismissible Tests */}
      <div style={sectionStyle}>
        <h3>Dismissible Tests</h3>
        <p>Test dismissible vs non-dismissible behavior</p>
        <div style={optionGridStyle}>
          <button onClick={() => testDismissible(true)} style={buttonStyle("#ffc107")}>
            Dismissible
          </button>
          <button onClick={() => testDismissible(false)} style={buttonStyle("#ffc107")}>
            Non-Dismissible
          </button>
        </div>
      </div>

      {/* Handle Only Tests */}
      <div style={sectionStyle}>
        <h3>Handle Only Tests</h3>
        <p>Test handle-only vs full drawer draggable behavior</p>
        <div style={optionGridStyle}>
          <button onClick={() => testHandleOnly(true)} style={buttonStyle("#fd7e14")}>
            Handle Only
          </button>
          <button onClick={() => testHandleOnly(false)} style={buttonStyle("#fd7e14")}>
            Full Drawer
          </button>
        </div>
      </div>

      {/* Reposition Inputs Tests */}
      <div style={sectionStyle}>
        <h3>Reposition Inputs Tests</h3>
        <p>Test input repositioning behavior</p>
        <div style={optionGridStyle}>
          <button onClick={() => testRepositionInputs(true)} style={buttonStyle("#6f42c1")}>
            Enable Repositioning
          </button>
          <button onClick={() => testRepositionInputs(false)} style={buttonStyle("#6f42c1")}>
            Disable Repositioning
          </button>
        </div>
      </div>

      {/* Event Callbacks Test */}
      <div style={sectionStyle}>
        <h3>Event Callbacks Test</h3>
        <p>Test all event callbacks (check results above)</p>
        <div style={optionGridStyle}>
          <button onClick={testEventCallbacks} style={buttonStyle("#dc3545")}>
            Test Event Callbacks
          </button>
        </div>
      </div>

      {/* Complex Options Test */}
      <div style={sectionStyle}>
        <h3>Complex Options Test</h3>
        <p>Test multiple options combined</p>
        <div style={optionGridStyle}>
          <button onClick={testComplexOptions} style={buttonStyle("#6c757d")}>
            Test Complex Options
          </button>
        </div>
      </div>
    </div>
  );
}
