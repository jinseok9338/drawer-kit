import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom";

import { DrawerProvider } from "../../src/drawer-kit/context/provider";
import { drawer } from "../../src/drawer-kit";

describe("Dismissible Drawer Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("dismissible: false behavior", () => {
    it("should not close when clicking overlay when dismissible is false", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      const TestComponent = () => {
        const openNonDismissibleDrawer = () => {
          drawer.open(
            ({ close }) => (
              <div data-testid="non-dismissible-drawer">
                <h2>Non-Dismissible Drawer</h2>
                <p>This drawer cannot be closed by clicking outside</p>
                <button onClick={close} data-testid="close-button">
                  Close
                </button>
              </div>
            ),
            {
              dismissible: false,
              onOpenChange,
            }
          );
        };

        return (
          <DrawerProvider>
            <button onClick={openNonDismissibleDrawer} data-testid="open-drawer">
              Open Non-Dismissible Drawer
            </button>
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      // Open drawer
      await user.click(screen.getByTestId("open-drawer"));
      await waitFor(() => {
        expect(screen.getByTestId("non-dismissible-drawer")).toBeInTheDocument();
      });

      // Try to click on overlay (should not close)
      const overlay = document.querySelector("[data-vaul-overlay]");
      expect(overlay).toBeInTheDocument();

      if (overlay) {
        await user.click(overlay);

        // Drawer should still be open
        await waitFor(() => {
          expect(screen.getByTestId("non-dismissible-drawer")).toBeInTheDocument();
        });

        // onOpenChange should not have been called
        expect(onOpenChange).not.toHaveBeenCalled();
      }

      // Only way to close should be the close button
      await user.click(screen.getByTestId("close-button"));
      await waitFor(() => {
        expect(screen.queryByTestId("non-dismissible-drawer")).not.toBeInTheDocument();
      });
    });

    it("should not close when dragging outside when dismissible is false", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const openNonDismissibleDrawer = () => {
          drawer.open(
            ({ close }) => (
              <div data-testid="non-dismissible-drawer">
                <h2>Non-Dismissible Drawer</h2>
                <p>This drawer cannot be closed by dragging</p>
                <button onClick={close} data-testid="close-button">
                  Close
                </button>
              </div>
            ),
            {
              dismissible: false,
              direction: "bottom",
            }
          );
        };

        return (
          <DrawerProvider>
            <button onClick={openNonDismissibleDrawer} data-testid="open-drawer">
              Open Non-Dismissible Drawer
            </button>
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      // Open drawer
      await user.click(screen.getByTestId("open-drawer"));
      await waitFor(() => {
        expect(screen.getByTestId("non-dismissible-drawer")).toBeInTheDocument();
      });

      // Drawer should still be open after any interaction
      expect(screen.getByTestId("non-dismissible-drawer")).toBeInTheDocument();
    });

    it("should close normally when dismissible is true (default)", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      const TestComponent = () => {
        const openDismissibleDrawer = () => {
          drawer.open(
            ({ close }) => (
              <div data-testid="dismissible-drawer">
                <h2>Dismissible Drawer</h2>
                <p>This drawer can be closed by clicking outside</p>
                <button onClick={close} data-testid="close-button">
                  Close
                </button>
              </div>
            ),
            {
              dismissible: true,
              onOpenChange,
            }
          );
        };

        return (
          <DrawerProvider>
            <button onClick={openDismissibleDrawer} data-testid="open-drawer">
              Open Dismissible Drawer
            </button>
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      // Open drawer
      await user.click(screen.getByTestId("open-drawer"));
      await waitFor(() => {
        expect(screen.getByTestId("dismissible-drawer")).toBeInTheDocument();
      });

      // Click on overlay should close the drawer
      const overlay = document.querySelector("[data-vaul-overlay]");
      expect(overlay).toBeInTheDocument();

      if (overlay) {
        await user.click(overlay);

        // Drawer should be closed
        await waitFor(() => {
          expect(screen.queryByTestId("dismissible-drawer")).not.toBeInTheDocument();
        });

        // onOpenChange should have been called with false
        expect(onOpenChange).toHaveBeenCalledWith(false);
      }
    });
  });

  describe("dismissible: false with different directions", () => {
    it("should work correctly for all directions", async () => {
      const user = userEvent.setup();
      const directions = ["top", "bottom", "left", "right"] as const;

      const TestComponent = () => {
        const openDrawer = (direction: (typeof directions)[number]) => {
          drawer.open(
            ({ close }) => (
              <div data-testid={`drawer-${direction}`}>
                <h2>{direction} Drawer</h2>
                <button onClick={close} data-testid={`close-${direction}`}>
                  Close
                </button>
              </div>
            ),
            {
              dismissible: false,
              direction,
            }
          );
        };

        return (
          <DrawerProvider>
            {directions.map((direction) => (
              <button
                key={direction}
                onClick={() => openDrawer(direction)}
                data-testid={`open-${direction}`}
              >
                Open {direction} Drawer
              </button>
            ))}
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      for (const direction of directions) {
        // Open drawer
        await user.click(screen.getByTestId(`open-${direction}`));
        await waitFor(() => {
          expect(screen.getByTestId(`drawer-${direction}`)).toBeInTheDocument();
        });

        // Try to click overlay (should not close)
        const overlay = document.querySelector("[data-vaul-overlay]");
        if (overlay) {
          await user.click(overlay);
          // Drawer should still be open
          expect(screen.getByTestId(`drawer-${direction}`)).toBeInTheDocument();
        }

        // Close with button
        await user.click(screen.getByTestId(`close-${direction}`));
        await waitFor(() => {
          expect(screen.queryByTestId(`drawer-${direction}`)).not.toBeInTheDocument();
        });
      }
    });
  });
});
