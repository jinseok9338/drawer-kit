import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

// These imports will fail until we implement the drawer-kit
import { DrawerProvider } from "@/context/provider";
import { drawer } from "@/index";

describe("Async Drawer Flow Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Promise creation and resolution", () => {
    it("should create Promise when openAsync is called", async () => {
      const user = userEvent.setup();
      let drawerPromise: Promise<boolean> | null = null;

      const TestComponent = () => {
        const handleOpenAsync = async () => {
          // This will fail until drawer.openAsync is implemented
          drawerPromise = drawer.openAsync<boolean>(({ close }) => (
            <div data-testid="async-drawer">
              <h2>Async Drawer</h2>
              <button onClick={() => close(true)} data-testid="confirm-button">
                Confirm
              </button>
              <button onClick={() => close(false)} data-testid="cancel-button">
                Cancel
              </button>
            </div>
          ));
        };

        return (
          <DrawerProvider>
            <button onClick={handleOpenAsync} data-testid="open-async">
              Open Async Drawer
            </button>
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      await user.click(screen.getByTestId("open-async"));

      // Should create a Promise
      expect(drawerPromise).toBeInstanceOf(Promise);

      // Drawer should be visible
      await waitFor(() => {
        expect(screen.getByTestId("async-drawer")).toBeInTheDocument();
      });
    });

    it("should resolve Promise with correct value on confirm", async () => {
      const user = userEvent.setup();
      let result: boolean | null = null;

      const TestComponent = () => {
        const handleOpenAsync = async () => {
          result = await drawer.openAsync<boolean>(({ close }) => (
            <div data-testid="confirm-drawer">
              <p>Confirm this action?</p>
              <button onClick={() => close(true)} data-testid="yes-button">
                Yes
              </button>
              <button onClick={() => close(false)} data-testid="no-button">
                No
              </button>
            </div>
          ));
        };

        return (
          <DrawerProvider>
            <button onClick={handleOpenAsync} data-testid="open-confirm">
              Open Confirmation
            </button>
            {result !== null && <div data-testid="result">Result: {result.toString()}</div>}
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      await user.click(screen.getByTestId("open-confirm"));

      await waitFor(() => {
        expect(screen.getByTestId("confirm-drawer")).toBeInTheDocument();
      });

      // Click "Yes" to confirm
      await user.click(screen.getByTestId("yes-button"));

      // Promise should resolve with true
      await waitFor(() => {
        expect(screen.getByTestId("result")).toHaveTextContent("Result: true");
      });

      expect(result).toBe(true);
    });

    it("should resolve Promise with false on cancel", async () => {
      const user = userEvent.setup();
      let result: boolean | null = null;

      const TestComponent = () => {
        const handleOpenAsync = async () => {
          result = await drawer.openAsync<boolean>(({ close }) => (
            <div data-testid="cancel-drawer">
              <p>Are you sure?</p>
              <button onClick={() => close(true)} data-testid="sure-button">
                Sure
              </button>
              <button onClick={() => close(false)} data-testid="not-sure-button">
                Not Sure
              </button>
            </div>
          ));
        };

        return (
          <DrawerProvider>
            <button onClick={handleOpenAsync} data-testid="open-sure">
              Open Sure Check
            </button>
            {result !== null && <div data-testid="sure-result">Sure: {result.toString()}</div>}
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      await user.click(screen.getByTestId("open-sure"));

      await waitFor(() => {
        expect(screen.getByTestId("cancel-drawer")).toBeInTheDocument();
      });

      // Click "Not Sure" to cancel
      await user.click(screen.getByTestId("not-sure-button"));

      // Promise should resolve with false
      await waitFor(() => {
        expect(screen.getByTestId("sure-result")).toHaveTextContent("Sure: false");
      });

      expect(result).toBe(false);
    });
  });

  describe("Multiple async drawers independence", () => {
    it("should handle multiple async drawers independently", async () => {
      const user = userEvent.setup();
      const results: { first: string | null; second: string | null } = {
        first: null,
        second: null,
      };

      const TestComponent = () => {
        const handleFirstAsync = async () => {
          results.first = await drawer.openAsync<string>(({ close }) => (
            <div data-testid="first-async">
              <h3>First Async Drawer</h3>
              <button onClick={() => close("first-result")} data-testid="first-close">
                Close First
              </button>
            </div>
          ));
        };

        const handleSecondAsync = async () => {
          results.second = await drawer.openAsync<string>(({ close }) => (
            <div data-testid="second-async">
              <h3>Second Async Drawer</h3>
              <button onClick={() => close("second-result")} data-testid="second-close">
                Close Second
              </button>
            </div>
          ));
        };

        return (
          <DrawerProvider>
            <button onClick={handleFirstAsync} data-testid="open-first-async">
              Open First Async
            </button>
            <button onClick={handleSecondAsync} data-testid="open-second-async">
              Open Second Async
            </button>
            <div data-testid="results">
              First: {results.first || "null"}, Second: {results.second || "null"}
            </div>
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      // Open both async drawers
      await user.click(screen.getByTestId("open-first-async"));
      await user.click(screen.getByTestId("open-second-async"));

      // Both should be visible (nested)
      await waitFor(() => {
        expect(screen.getByTestId("first-async")).toBeInTheDocument();
        expect(screen.getByTestId("second-async")).toBeInTheDocument();
      });

      // Close second drawer first
      await user.click(screen.getByTestId("second-close"));

      await waitFor(() => {
        expect(screen.queryByTestId("second-async")).not.toBeInTheDocument();
      });

      // First drawer should still be open
      expect(screen.getByTestId("first-async")).toBeInTheDocument();

      // Close first drawer
      await user.click(screen.getByTestId("first-close"));

      await waitFor(() => {
        expect(screen.queryByTestId("first-async")).not.toBeInTheDocument();
      });

      // Both should have resolved with correct values
      await waitFor(() => {
        const resultsElement = screen.getByTestId("results");
        expect(resultsElement).toHaveTextContent("First: first-result, Second: second-result");
      });
    });

    it("should handle async drawer with complex data types", async () => {
      const user = userEvent.setup();
      let complexResult: { name: string; age: number; confirmed: boolean } | null = null;

      const TestComponent = () => {
        const handleComplexAsync = async () => {
          complexResult = await drawer.openAsync<{
            name: string;
            age: number;
            confirmed: boolean;
          }>(({ close }) => (
            <div data-testid="complex-drawer">
              <h3>Complex Data Drawer</h3>
              <button
                onClick={() =>
                  close({
                    name: "John Doe",
                    age: 30,
                    confirmed: true,
                  })
                }
                data-testid="submit-complex"
              >
                Submit Complex Data
              </button>
            </div>
          ));
        };

        return (
          <DrawerProvider>
            <button onClick={handleComplexAsync} data-testid="open-complex">
              Open Complex Async
            </button>
            {complexResult && (
              <div data-testid="complex-result">
                Name: {complexResult.name}, Age: {complexResult.age}, Confirmed:{" "}
                {complexResult.confirmed.toString()}
              </div>
            )}
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      await user.click(screen.getByTestId("open-complex"));

      await waitFor(() => {
        expect(screen.getByTestId("complex-drawer")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("submit-complex"));

      await waitFor(() => {
        const resultElement = screen.getByTestId("complex-result");
        expect(resultElement).toHaveTextContent("Name: John Doe, Age: 30, Confirmed: true");
      });

      expect(complexResult).toEqual({
        name: "John Doe",
        age: 30,
        confirmed: true,
      });
    });
  });

  describe("Error handling and edge cases", () => {
    it("should handle Promise rejection on drawer unmount", async () => {
      const user = userEvent.setup();
      let promiseRejected = false;

      const TestComponent = () => {
        const handleRejectionAsync = async () => {
          try {
            await drawer.openAsync<string>(({ unmount }) => (
              <div data-testid="rejection-drawer">
                <button onClick={unmount} data-testid="unmount-without-result">
                  Unmount Without Result
                </button>
              </div>
            ));
          } catch {
            promiseRejected = true;
          }
        };

        return (
          <DrawerProvider>
            <button onClick={handleRejectionAsync} data-testid="open-rejection">
              Open Rejection Test
            </button>
            {promiseRejected && <div data-testid="promise-rejected">Promise Rejected</div>}
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      await user.click(screen.getByTestId("open-rejection"));

      await waitFor(() => {
        expect(screen.getByTestId("rejection-drawer")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("unmount-without-result"));

      // Promise should be rejected when drawer is unmounted without result
      await waitFor(() => {
        expect(screen.getByTestId("promise-rejected")).toBeInTheDocument();
      });

      expect(promiseRejected).toBe(true);
    });

    it("should handle rapid async drawer operations", async () => {
      const user = userEvent.setup();
      const results: string[] = [];

      const TestComponent = () => {
        const handleRapidAsync = async (value: string) => {
          const result = await drawer.openAsync<string>(({ close }) => (
            <div data-testid={`rapid-drawer-${value}`}>
              <button onClick={() => close(value)} data-testid={`close-${value}`}>
                Close {value}
              </button>
            </div>
          ));
          results.push(result);
        };

        return (
          <DrawerProvider>
            <button onClick={() => handleRapidAsync("A")} data-testid="rapid-a">
              Rapid A
            </button>
            <button onClick={() => handleRapidAsync("B")} data-testid="rapid-b">
              Rapid B
            </button>
            <button onClick={() => handleRapidAsync("C")} data-testid="rapid-c">
              Rapid C
            </button>
            <div data-testid="rapid-results">{results.join(", ")}</div>
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      // Rapidly click all buttons
      await user.click(screen.getByTestId("rapid-a"));
      await user.click(screen.getByTestId("rapid-b"));
      await user.click(screen.getByTestId("rapid-c"));

      // All drawers should be present (nested)
      await waitFor(() => {
        expect(screen.getByTestId("rapid-drawer-A")).toBeInTheDocument();
        expect(screen.getByTestId("rapid-drawer-B")).toBeInTheDocument();
        expect(screen.getByTestId("rapid-drawer-C")).toBeInTheDocument();
      });

      // Close them in order
      await user.click(screen.getByTestId("close-C"));
      await user.click(screen.getByTestId("close-B"));
      await user.click(screen.getByTestId("close-A"));

      await waitFor(() => {
        const resultsElement = screen.getByTestId("rapid-results");
        expect(resultsElement).toHaveTextContent("C, B, A");
      });
    });
  });
});
