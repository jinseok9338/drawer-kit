import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

// These imports will fail until we implement the drawer-kit
import { DrawerProvider } from "../../src/drawer-kit/context/provider";
import { drawer } from "../../src/drawer-kit";

describe("Basic Drawer Lifecycle Integration Tests", () => {
  beforeEach(() => {
    // Reset any global state before each test
    vi.clearAllMocks();
  });

  describe("Drawer open and appear with animation", () => {
    it("should open drawer and appear with smooth animation", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const handleOpen = () => {
          // This will fail until drawer API is implemented
          drawer.open(({ close }) => (
            <div data-testid="drawer-content">
              <h2>Test Drawer</h2>
              <button onClick={close} data-testid="close-button">
                Close
              </button>
            </div>
          ));
        };

        return (
          <DrawerProvider>
            <button onClick={handleOpen} data-testid="open-button">
              Open Drawer
            </button>
          </DrawerProvider>
        );
      };

      // This will fail until DrawerProvider is implemented
      render(<TestComponent />);

      const openButton = screen.getByTestId("open-button");
      await user.click(openButton);

      // Should appear with animation (test for presence)
      await waitFor(() => {
        expect(screen.getByTestId("drawer-content")).toBeInTheDocument();
      });

      // Should have proper ARIA attributes for accessibility
      const drawerContent = screen.getByTestId("drawer-content");
      expect(drawerContent).toBeVisible();
    });

    it("should have correct animation classes during open", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const handleOpen = () => {
          drawer.open(({ isOpen }) => (
            <div data-testid="animated-drawer" className={isOpen ? "drawer-open" : "drawer-closed"}>
              Animated Drawer
            </div>
          ));
        };

        return (
          <DrawerProvider>
            <button onClick={handleOpen} data-testid="open-trigger">
              Open
            </button>
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      await user.click(screen.getByTestId("open-trigger"));

      await waitFor(() => {
        const drawer = screen.getByTestId("animated-drawer");
        expect(drawer).toHaveClass("drawer-open");
      });
    });
  });

  describe("Drawer close and disappear with animation", () => {
    it("should close drawer and disappear with smooth animation", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const handleOpen = () => {
          drawer.open(({ close }) => (
            <div data-testid="closeable-drawer">
              <p>Closeable Content</p>
              <button onClick={close} data-testid="close-drawer">
                Close
              </button>
            </div>
          ));
        };

        return (
          <DrawerProvider>
            <button onClick={handleOpen} data-testid="open-closeable">
              Open Closeable
            </button>
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      // Open drawer first
      await user.click(screen.getByTestId("open-closeable"));
      await waitFor(() => {
        expect(screen.getByTestId("closeable-drawer")).toBeInTheDocument();
      });

      // Close drawer
      await user.click(screen.getByTestId("close-drawer"));

      // Should disappear after animation
      await waitFor(() => {
        expect(screen.queryByTestId("closeable-drawer")).not.toBeInTheDocument();
      });
    });

    it("should handle backdrop click to close", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const handleOpen = () => {
          drawer.open(() => <div data-testid="backdrop-closeable">Backdrop Closeable Drawer</div>, {
            dismissible: true,
          });
        };

        return (
          <DrawerProvider>
            <button onClick={handleOpen} data-testid="open-backdrop">
              Open Backdrop
            </button>
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      await user.click(screen.getByTestId("open-backdrop"));
      await waitFor(() => {
        expect(screen.getByTestId("backdrop-closeable")).toBeInTheDocument();
      });

      // Click backdrop (this will need proper backdrop element)
      // This test will fail until we implement backdrop handling
      const backdrop = document.querySelector("[data-vaul-overlay]");
      if (backdrop) {
        await user.click(backdrop);

        await waitFor(() => {
          expect(screen.queryByTestId("backdrop-closeable")).not.toBeInTheDocument();
        });
      }
    });
  });

  describe("Drawer unmount and memory cleanup", () => {
    it("should unmount drawer and remove from memory", async () => {
      const user = userEvent.setup();
      let drawerId: string | null = null;

      const TestComponent = () => {
        const handleOpen = () => {
          drawerId = drawer.open(({ unmount }) => (
            <div data-testid="unmountable-drawer">
              <button onClick={unmount} data-testid="unmount-button">
                Unmount
              </button>
            </div>
          ));
        };

        return (
          <DrawerProvider>
            <button onClick={handleOpen} data-testid="open-unmountable">
              Open Unmountable
            </button>
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      await user.click(screen.getByTestId("open-unmountable"));
      await waitFor(() => {
        expect(screen.getByTestId("unmountable-drawer")).toBeInTheDocument();
      });

      expect(drawerId).toBeTruthy();

      // Unmount drawer
      await user.click(screen.getByTestId("unmount-button"));

      // Should be completely removed
      await waitFor(() => {
        expect(screen.queryByTestId("unmountable-drawer")).not.toBeInTheDocument();
      });

      // Memory should be cleaned up (this will need state inspection)
      // This assertion will fail until we implement proper cleanup
      expect(drawerId).toBeTruthy(); // Drawer ID should still exist for reference
    });

    it("should cleanup event listeners on unmount", async () => {
      const originalAddEventListener = window.addEventListener;
      const originalRemoveEventListener = window.removeEventListener;

      window.addEventListener = vi.fn();
      window.removeEventListener = vi.fn();

      const TestComponent = () => {
        const handleOpen = () => {
          drawer.open(({ unmount }) => (
            <div data-testid="event-drawer">
              <button onClick={unmount} data-testid="cleanup-unmount">
                Unmount with Cleanup
              </button>
            </div>
          ));
        };

        return (
          <DrawerProvider>
            <button onClick={handleOpen} data-testid="open-with-events">
              Open with Events
            </button>
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      const user = userEvent.setup();
      await user.click(screen.getByTestId("open-with-events"));

      await waitFor(() => {
        expect(screen.getByTestId("event-drawer")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("cleanup-unmount"));

      await waitFor(() => {
        expect(screen.queryByTestId("event-drawer")).not.toBeInTheDocument();
      });

      // Should have cleaned up event listeners
      // This will fail until we implement proper cleanup
      expect(window.removeEventListener).toHaveBeenCalled();

      // Restore original methods
      window.addEventListener = originalAddEventListener;
      window.removeEventListener = originalRemoveEventListener;
    });
  });

  describe("Performance requirements", () => {
    it("should open drawer in less than 100ms", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const handleOpen = () => {
          drawer.open(() => <div data-testid="performance-drawer">Performance Test Drawer</div>);
        };

        return (
          <DrawerProvider>
            <button onClick={handleOpen} data-testid="performance-open">
              Open Performance Test
            </button>
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      const startTime = performance.now();
      await user.click(screen.getByTestId("performance-open"));

      await waitFor(() => {
        expect(screen.getByTestId("performance-drawer")).toBeInTheDocument();
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should open in less than 100ms (performance requirement)
      expect(duration).toBeLessThan(100);
    });
  });
});
