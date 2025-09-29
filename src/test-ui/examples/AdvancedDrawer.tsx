/**
 * Advanced Drawer Examples
 * Snap points, nested drawers, non-modal behavior
 */

import React, { useState } from "react";
import { drawer } from "../../drawer-kit";

export default function AdvancedDrawer() {
  const [nestedResults, setNestedResults] = useState<string[]>([]);

  const openNestedDrawers = () => {
    setNestedResults([]);

    // First drawer (z-index should be 1000)
    drawer.open(
      ({ close, unmount }) => (
        <div
          style={{
            padding: "20px",
            background: "white",
            borderRadius: "8px",
            minHeight: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0" }}>First Drawer (Z-Index Test)</h3>
          <p style={{ margin: "0 0 20px 0", color: "#666" }}>
            This is the first drawer. It should appear behind the second drawer when both are open.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                // Second drawer (z-index should be 1001)
                drawer.open(
                  ({ close: closeSecond }) => (
                    <div
                      style={{
                        padding: "20px",
                        background: "white",
                        borderRadius: "8px",
                        minHeight: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <h3 style={{ margin: "0 0 15px 0" }}>Second Drawer (Should be on Top)</h3>
                      <p style={{ margin: "0 0 20px 0", color: "#666" }}>
                        This is the second drawer. It should appear on top of the first drawer.
                        Check the z-index in DevTools!
                      </p>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <button
                          onClick={() => {
                            // Third drawer (z-index should be 1002)
                            drawer.open(
                              ({ close: closeThird }) => (
                                <div
                                  style={{
                                    padding: "20px",
                                    background: "white",
                                    borderRadius: "8px",
                                    minHeight: "100%",
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <h3 style={{ margin: "0 0 15px 0" }}>
                                    Third Drawer (Highest Z-Index)
                                  </h3>
                                  <p style={{ margin: "0 0 20px 0", color: "#666" }}>
                                    This is the third drawer. It should be on top of everything!
                                  </p>
                                  <button
                                    onClick={closeThird}
                                    style={{
                                      padding: "8px 16px",
                                      background: "#dc3545",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Close Third
                                  </button>
                                </div>
                              ),
                              { direction: "top" }
                            );
                          }}
                          style={{
                            padding: "8px 16px",
                            background: "#fd7e14",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Open Third Drawer
                        </button>
                        <button
                          onClick={closeSecond}
                          style={{
                            padding: "8px 16px",
                            background: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Close Second
                        </button>
                      </div>
                    </div>
                  ),
                  { direction: "left" }
                );
              }}
              style={{
                padding: "8px 16px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Open Second Drawer
            </button>
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
              Close First
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
              Unmount First
            </button>
          </div>
        </div>
      ),
      { direction: "right" }
    );
  };

  const openNonModalDrawer = () => {
    drawer.open(
      ({ close }) => (
        <div style={{ padding: "20px", background: "white", borderRadius: "8px" }}>
          <h3 style={{ margin: "0 0 15px 0" }}>Non-Modal Drawer</h3>
          <p style={{ margin: "0 0 20px 0", color: "#666" }}>
            This is a non-modal drawer. You should be able to interact with elements behind it. The
            background should not be dimmed.
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
            Close Non-Modal
          </button>
        </div>
      ),
      {
        modal: false,
        direction: "right",
      }
    );
  };

  const openAsyncNestedDrawers = async () => {
    setNestedResults([]);

    try {
      const firstResult = await drawer.openAsync<string>(({ close }) => (
        <div style={{ padding: "20px", background: "white", borderRadius: "8px" }}>
          <h3 style={{ margin: "0 0 15px 0" }}>First Async Drawer</h3>
          <p style={{ margin: "0 0 20px 0", color: "#666" }}>
            This drawer will open a second async drawer when you click the button.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={async () => {
                try {
                  const secondResult = await drawer.openAsync<string>(({ close: closeSecond }) => (
                    <div style={{ padding: "20px", background: "white", borderRadius: "8px" }}>
                      <h3 style={{ margin: "0 0 15px 0" }}>Second Async Drawer</h3>
                      <p style={{ margin: "0 0 20px 0", color: "#666" }}>
                        Choose a result for the second drawer:
                      </p>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <button
                          onClick={() => closeSecond("second-confirmed")}
                          style={{
                            padding: "8px 16px",
                            background: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Confirm Second
                        </button>
                        <button
                          onClick={() => closeSecond("second-cancelled")}
                          style={{
                            padding: "8px 16px",
                            background: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Cancel Second
                        </button>
                      </div>
                    </div>
                  ));

                  setNestedResults((prev) => [...prev, `Second: ${secondResult}`]);
                  close(`first-after-second-${secondResult}`);
                } catch (error) {
                  close("first-cancelled-due-to-second-error");
                }
              }}
              style={{
                padding: "8px 16px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Open Second Async
            </button>
            <button
              onClick={() => close("first-direct")}
              style={{
                padding: "8px 16px",
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Close First Directly
            </button>
          </div>
        </div>
      ));

      setNestedResults((prev) => [...prev, `First: ${firstResult}`]);
    } catch (error) {
      setNestedResults((prev) => [...prev, `Error: ${error}`]);
    }
  };

  return (
    <div>
      <h2 style={{ margin: "0 0 20px 0", color: "#333" }}>Advanced Drawer Examples</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        {/* Nested Drawers */}
        <section>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>Nested Drawers (Z-Index Test)</h3>
          <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>
            Test nested drawers with proper z-index stacking. Open DevTools to inspect z-index
            values.
          </p>
          <button
            onClick={openNestedDrawers}
            style={{
              padding: "12px 24px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Open Nested Drawers
          </button>
        </section>

        {/* Non-Modal Drawer */}
        <section>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>Non-Modal Drawer</h3>
          <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>
            Drawer that doesn't block interaction with background elements.
          </p>
          <button
            onClick={openNonModalDrawer}
            style={{
              padding: "12px 24px",
              background: "#fd7e14",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Open Non-Modal Drawer
          </button>
        </section>

        {/* Async Nested Drawers */}
        <section>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>Async Nested Drawers</h3>
          <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>
            Test nested async drawers that return results.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
            <button
              onClick={openAsyncNestedDrawers}
              style={{
                padding: "12px 24px",
                background: "#20c997",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Open Async Nested Drawers
            </button>
            {nestedResults.length > 0 && (
              <div
                style={{
                  padding: "10px",
                  background: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  fontSize: "14px",
                  maxWidth: "400px",
                }}
              >
                <strong>Results:</strong>
                <ul style={{ margin: "5px 0 0 0", paddingLeft: "20px" }}>
                  {nestedResults.map((result, index) => (
                    <li key={index}>{result}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
