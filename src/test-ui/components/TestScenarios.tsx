/**
 * Test Scenarios Component
 * Edge cases, performance testing, memory leak detection
 */

import React, { useState, useEffect } from "react";
import { drawer, useDrawerData } from "../../drawer-kit";

export default function TestScenarios() {
  const [isRapidTesting, setIsRapidTesting] = useState(false);
  const [rapidCount, setRapidCount] = useState(0);
  const [performanceResults, setPerformanceResults] = useState<number[]>([]);
  const [memoryInfo, setMemoryInfo] = useState<any>(null);

  const { drawerData, drawerOrderList } = useDrawerData();

  // Memory monitoring
  useEffect(() => {
    const updateMemoryInfo = () => {
      if ("memory" in performance) {
        setMemoryInfo({
          used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024),
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  const rapidOpenClose = async () => {
    setIsRapidTesting(true);
    setRapidCount(0);

    for (let i = 0; i < 50; i++) {
      const drawerId = drawer.open(({ close }) => (
        <div style={{ padding: "20px", background: "white", borderRadius: "8px" }}>
          <h3>Rapid Test Drawer #{i + 1}</h3>
          <button
            onClick={close}
            style={{
              padding: "8px 16px",
              background: "#007acc",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Close
          </button>
        </div>
      ));

      // Auto close after short delay
      setTimeout(() => {
        drawer.close(drawerId);
        setRapidCount(i + 1);
      }, 100);

      // Wait a bit before opening next
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    setIsRapidTesting(false);
  };

  const performanceTest = async () => {
    const results: number[] = [];

    for (let i = 0; i < 10; i++) {
      const startTime = performance.now();

      const drawerId = drawer.open(({ close }) => (
        <div style={{ padding: "20px", background: "white", borderRadius: "8px" }}>
          <h3>Performance Test #{i + 1}</h3>
          <p>Measuring open/close performance...</p>
        </div>
      ));

      // Wait for render
      await new Promise((resolve) => setTimeout(resolve, 50));

      drawer.close(drawerId);

      const endTime = performance.now();
      const duration = endTime - startTime;
      results.push(duration);

      // Wait between tests
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setPerformanceResults(results);
  };

  const stressTest = () => {
    // Open 10 drawers simultaneously
    for (let i = 0; i < 10; i++) {
      drawer.open(
        ({ close, unmount }) => (
          <div style={{ padding: "20px", background: "white", borderRadius: "8px" }}>
            <h3>Stress Test Drawer #{i + 1}</h3>
            <p>This is drawer {i + 1} of 10 opened simultaneously.</p>
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
        ),
        { direction: i % 2 === 0 ? "bottom" : "top" }
      );
    }
  };

  const memoryLeakTest = () => {
    // Create and immediately unmount many drawers
    for (let i = 0; i < 100; i++) {
      const drawerId = drawer.open(() => (
        <div style={{ padding: "20px" }}>
          <h3>Memory Test #{i}</h3>
          <div style={{ height: "200px", background: `hsl(${i * 3.6}, 70%, 50%)` }}>
            Large content block {i}
          </div>
        </div>
      ));

      // Unmount immediately
      setTimeout(() => drawer.unmount(drawerId), 10);
    }
  };

  const closeAllDrawers = () => {
    drawer.closeAll();
  };

  const unmountAllDrawers = () => {
    drawer.unmountAll();
  };

  const openDismissibleDrawer = () => {
    drawer.open(
      ({ close }) => (
        <div style={{ padding: "20px", background: "white", borderRadius: "8px" }}>
          <h3>Dismissible Drawer</h3>
          <p>This drawer can be closed by clicking outside or dragging.</p>
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
      { dismissible: true }
    );
  };

  const openNonDismissibleDrawer = () => {
    drawer.open(
      ({ close }) => (
        <div style={{ padding: "20px", background: "white", borderRadius: "8px" }}>
          <h3>Non-Dismissible Drawer</h3>
          <p style={{ color: "#dc3545", fontWeight: "bold" }}>
            ⚠️ This drawer CANNOT be closed by clicking outside or dragging!
          </p>
          <p>You must use the close button below.</p>
          <button
            onClick={close}
            style={{
              padding: "8px 16px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Close (Only Way)
          </button>
        </div>
      ),
      { dismissible: false }
    );
  };

  const averagePerformance =
    performanceResults.length > 0
      ? Math.round(
          (performanceResults.reduce((a, b) => a + b, 0) / performanceResults.length) * 100
        ) / 100
      : 0;

  return (
    <div>
      <h2 style={{ margin: "0 0 20px 0", color: "#333" }}>Test Scenarios</h2>

      {/* Status Panel */}
      <div
        style={{
          background: "#f8f9fa",
          border: "1px solid #dee2e6",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "30px",
          color: "#333", // Explicitly set text color
        }}
      >
        <h3 style={{ margin: "0 0 15px 0", color: "#555" }}>Current Status</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            color: "#333",
          }}
        >
          <div style={{ color: "#333" }}>
            <strong style={{ color: "#333" }}>Active Drawers:</strong>{" "}
            <span style={{ color: "#333" }}>{Object.keys(drawerData).length}</span>
          </div>
          <div style={{ color: "#333" }}>
            <strong style={{ color: "#333" }}>Drawer Order:</strong>{" "}
            <span style={{ color: "#333" }}>{drawerOrderList.length}</span>
          </div>
          {memoryInfo && (
            <div style={{ color: "#333" }}>
              <strong style={{ color: "#333" }}>Memory:</strong>{" "}
              <span style={{ color: "#333" }}>
                {memoryInfo.used}MB / {memoryInfo.total}MB
              </span>
            </div>
          )}
          {performanceResults.length > 0 && (
            <div style={{ color: "#333" }}>
              <strong style={{ color: "#333" }}>Avg Performance:</strong>{" "}
              <span style={{ color: "#333" }}>{averagePerformance}ms</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        {/* Rapid Open/Close Test */}
        <section>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>Rapid Open/Close Test</h3>
          <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>
            Opens and closes 50 drawers rapidly to test performance and memory management.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
            <button
              onClick={rapidOpenClose}
              disabled={isRapidTesting}
              style={{
                padding: "12px 24px",
                background: isRapidTesting ? "#ccc" : "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isRapidTesting ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {isRapidTesting ? `Testing... (${rapidCount}/50)` : "Start Rapid Test"}
            </button>
            {rapidCount > 0 && (
              <div style={{ fontSize: "14px", color: "#333" }}>Completed: {rapidCount}/50</div>
            )}
          </div>
        </section>

        {/* Performance Test */}
        <section>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>Performance Test</h3>
          <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>
            Measures open/close performance over 10 iterations.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
            <button
              onClick={performanceTest}
              style={{
                padding: "12px 24px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Run Performance Test
            </button>
            {performanceResults.length > 0 && (
              <div
                style={{
                  padding: "10px",
                  background: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#333", // Explicitly set text color
                }}
              >
                <strong style={{ color: "#333" }}>Results:</strong>{" "}
                <span style={{ color: "#333" }}>{averagePerformance}ms avg</span>
                <details style={{ marginTop: "5px" }}>
                  <summary style={{ cursor: "pointer", color: "#333" }}>View All Times</summary>
                  <div style={{ marginTop: "5px", fontSize: "12px", color: "#333" }}>
                    {performanceResults.map((time, i) => (
                      <div key={i} style={{ color: "#333" }}>
                        Test {i + 1}: {Math.round(time * 100) / 100}ms
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        </section>

        {/* Stress Test */}
        <section>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>Stress Test</h3>
          <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>
            Opens 10 drawers simultaneously to test handling of multiple concurrent drawers.
          </p>
          <button
            onClick={stressTest}
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
            Run Stress Test
          </button>
        </section>

        {/* Memory Leak Test */}
        <section>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>Memory Leak Test</h3>
          <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>
            Creates and immediately unmounts 100 drawers to test memory cleanup.
          </p>
          <button
            onClick={memoryLeakTest}
            style={{
              padding: "12px 24px",
              background: "#6f42c1",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Run Memory Leak Test
          </button>
        </section>

        {/* Dismissible Test */}
        <section>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>Dismissible Behavior Test</h3>
          <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>
            Test the dismissible behavior - try clicking outside or dragging to close drawers.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={openDismissibleDrawer}
              style={{
                padding: "12px 24px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Open Dismissible Drawer
            </button>
            <button
              onClick={openNonDismissibleDrawer}
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
              Open Non-Dismissible Drawer
            </button>
          </div>
          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              background: "#fff3cd",
              border: "1px solid #ffeaa7",
              borderRadius: "4px",
            }}
          >
            <p style={{ margin: "0", fontSize: "14px", color: "#856404" }}>
              <strong>Test Instructions:</strong> Try clicking outside the drawers or dragging them.
              The dismissible drawer should close, but the non-dismissible drawer should stay open.
            </p>
          </div>
        </section>

        {/* Cleanup Controls */}
        <section>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>Cleanup Controls</h3>
          <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>
            Utilities to close or unmount all active drawers.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={closeAllDrawers}
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
              Close All Drawers
            </button>
            <button
              onClick={unmountAllDrawers}
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
          </div>
        </section>

        {/* Debug Information */}
        <section>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>Debug Information</h3>
          <div
            style={{
              background: "#f8f9fa",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              padding: "15px",
              fontSize: "14px",
              fontFamily: "monospace",
              color: "#333", // Explicitly set text color
            }}
          >
            <div style={{ color: "#333" }}>
              <strong style={{ color: "#333" }}>Drawer Data Keys:</strong>{" "}
              <span style={{ color: "#333" }}>{JSON.stringify(Object.keys(drawerData))}</span>
            </div>
            <div style={{ marginTop: "5px", color: "#333" }}>
              <strong style={{ color: "#333" }}>Drawer Order List:</strong>{" "}
              <span style={{ color: "#333" }}>{JSON.stringify(drawerOrderList)}</span>
            </div>
            {memoryInfo && (
              <div style={{ marginTop: "5px", color: "#333" }}>
                <strong style={{ color: "#333" }}>Memory Info:</strong>{" "}
                <span style={{ color: "#333" }}>{JSON.stringify(memoryInfo)}</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
