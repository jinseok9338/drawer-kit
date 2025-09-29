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
        const [asyncResult, setAsyncResult] = React.useState<boolean | null>(null);

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
          setAsyncResult(result);
        };

        return (
          <DrawerProvider>
            <button onClick={handleOpenAsync} data-testid="open-confirm">
              Open Confirmation
            </button>
            {asyncResult !== null && (
              <div data-testid="result">Result: {asyncResult.toString()}</div>
            )}
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

      // Wait for drawer to close and result to appear
      await waitFor(
        () => {
          expect(screen.getByTestId("result")).toHaveTextContent("Result: true");
        },
        {
          timeout: 3000, // Increase timeout to allow for animation and promise resolution
        }
      );

      expect(result).toBe(true);
    });

    it("should resolve Promise with false on cancel", async () => {
      const user = userEvent.setup();
      let result: boolean | null = null;

      const TestComponent = () => {
        const [asyncResult, setAsyncResult] = React.useState<boolean | null>(null);

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
          setAsyncResult(result);
        };

        return (
          <DrawerProvider>
            <button onClick={handleOpenAsync} data-testid="open-sure">
              Open Sure Check
            </button>
            {asyncResult !== null && (
              <div data-testid="sure-result">Sure: {asyncResult.toString()}</div>
            )}
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
      await waitFor(
        () => {
          expect(screen.getByTestId("sure-result")).toHaveTextContent("Sure: false");
        },
        { timeout: 3000 }
      );

      expect(result).toBe(false);
    });
  });

  describe("Error handling and edge cases", () => {
    it("should handle Promise rejection on drawer unmount", async () => {
      const user = userEvent.setup();
      let promiseRejected = false;

      const TestComponent = () => {
        const [isPromiseRejected, setIsPromiseRejected] = React.useState(false);

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
            setIsPromiseRejected(true);
          }
        };

        return (
          <DrawerProvider>
            <button onClick={handleRejectionAsync} data-testid="open-rejection">
              Open Rejection Test
            </button>
            {isPromiseRejected && <div data-testid="promise-rejected">Promise Rejected</div>}
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
  });
});
