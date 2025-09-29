/**
 * Basic Drawer Examples
 * Simple drawer open/close, async drawers, different directions
 */

import React, { useState } from "react";
import { drawer } from "../../drawer-kit";

export default function BasicDrawer() {
  const [asyncResult, setAsyncResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openSimpleDrawer = () => {
    drawer.open(({ close, unmount }) => (
      <div
        style={{
          padding: "20px",
          background: "white",
          borderRadius: "8px",
          minHeight: "200px",
          width: "100%",
        }}
      >
        <h3 style={{ margin: "0 0 15px 0" }}>Simple Drawer</h3>
        <p style={{ margin: "0 0 20px 0", color: "#666" }}>
          This is a basic drawer example with close and unmount options.
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={close}
            style={{
              padding: "8px 16px",
              background: "#007acc",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
          <button
            onClick={unmount}
            style={{
              padding: "8px 16px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Unmount
          </button>
        </div>
      </div>
    ));
  };

  const openAsyncDrawer = async () => {
    setIsLoading(true);
    setAsyncResult(null);

    try {
      const result = await drawer.openAsync<string>(({ close, unmount }) => (
        <div
          style={{
            padding: "20px",
            background: "white",
            borderRadius: "8px",
            minHeight: "200px",
            width: "100%",
            color: "#333",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0" }}>Async Drawer</h3>
          <p style={{ margin: "0 0 20px 0", color: "#666" }}>
            This drawer returns a result when closed. Choose an option:
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => close("confirmed")}
              style={{
                padding: "8px 16px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Confirm
            </button>
            <button
              onClick={() => close("cancelled")}
              style={{
                padding: "8px 16px",
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={unmount}
              style={{
                padding: "8px 16px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Unmount (No Result)
            </button>
          </div>
        </div>
      ));
      setAsyncResult(result);
    } catch (error) {
      setAsyncResult({ error: error instanceof Error ? error.message : "Unknown error" });
    } finally {
      setIsLoading(false);
    }
  };

  const openDirectionDrawer = (direction: "top" | "bottom" | "left" | "right") => {
    drawer.open(
      ({ close }) => (
        <div
          style={{
            padding: "20px",
            background: "white",
            borderRadius: "8px",
            minHeight: "200px",
            width: "100%",
            color: "#333",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0" }}>
            {direction.charAt(0).toUpperCase() + direction.slice(1)} Drawer
          </h3>
          <p style={{ margin: "0 0 20px 0", color: "#666" }}>
            This drawer opens from the {direction}.
          </p>
          <button
            onClick={close}
            style={{
              padding: "8px 16px",
              background: "#007acc",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      ),
      { direction }
    );
  };

  return (
    <div>
      <h2 style={{ margin: "0 0 20px 0", color: "#333" }}>Basic Drawer Examples</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        {/* Simple Drawer */}
        <section>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>Simple Drawer</h3>
          <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>
            Basic drawer with close and unmount functionality.
          </p>
          <button
            onClick={openSimpleDrawer}
            style={{
              padding: "12px 24px",
              background: "#007acc",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Open Simple Drawer
          </button>
        </section>

        {/* Async Drawer */}
        <section>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>Async Drawer</h3>
          <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>
            Drawer that returns a result when closed.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
            <button
              onClick={openAsyncDrawer}
              disabled={isLoading}
              style={{
                padding: "12px 24px",
                background: isLoading ? "#ccc" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {isLoading ? "Loading..." : "Open Async Drawer"}
            </button>
            {asyncResult && (
              <div
                style={{
                  padding: "8px 12px",
                  background: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                Result: <strong>{JSON.stringify(asyncResult)}</strong>
              </div>
            )}
          </div>
        </section>

        {/* Direction Drawers */}
        <section>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>Direction Examples</h3>
          <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>
            Drawers that open from different directions.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {(["top", "bottom", "left", "right"] as const).map((direction) => (
              <button
                key={direction}
                onClick={() => openDirectionDrawer(direction)}
                style={{
                  padding: "10px 16px",
                  background: "#6f42c1",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                {direction.charAt(0).toUpperCase() + direction.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Handle Examples */}
        <section>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>Handle Examples</h3>
          <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>
            Drawers with drag handles for better user interaction.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                drawer.open(
                  ({ close }) => (
                    <div style={{ padding: "20px", background: "white", borderRadius: "8px" }}>
                      <h3 style={{ margin: "0 0 15px 0" }}>Drawer with Handle</h3>
                      <p style={{ margin: "0 0 20px 0", color: "#666" }}>
                        This drawer has a drag handle at the top. Try dragging it!
                      </p>
                      <button
                        onClick={close}
                        style={{
                          padding: "8px 16px",
                          background: "#007acc",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Close
                      </button>
                    </div>
                  ),
                  {
                    direction: "bottom",
                    handleOnly: false, // Allow dragging from anywhere
                  }
                );
              }}
              style={{
                padding: "10px 20px",
                background: "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Open Drawer with Handle
            </button>
            <button
              onClick={() => {
                drawer.open(
                  ({ close }) => (
                    <div style={{ padding: "20px", background: "white", borderRadius: "8px" }}>
                      <h3 style={{ margin: "0 0 15px 0" }}>Handle-Only Drawer</h3>
                      <p style={{ margin: "0 0 20px 0", color: "#666" }}>
                        This drawer can only be dragged by the handle, not the content area.
                      </p>
                      <button
                        onClick={close}
                        style={{
                          padding: "8px 16px",
                          background: "#007acc",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Close
                      </button>
                    </div>
                  ),
                  {
                    direction: "bottom",
                    handleOnly: true, // Only allow dragging from handle
                  }
                );
              }}
              style={{
                padding: "10px 20px",
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Open Handle-Only Drawer
            </button>
          </div>
        </section>

        {/* Debug Controls */}
        <section>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>Debug Controls</h3>
          <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>
            Debugging utilities for development and testing.
          </p>
          <button
            onClick={() => drawer.unmountAll()}
            style={{
              padding: "10px 20px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Unmount All Drawers
          </button>
        </section>
      </div>
    </div>
  );
}
