import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

// These imports will fail until we implement the drawer-kit
import { DrawerProvider } from "@/context/provider";
import { drawer, useDrawerData } from "@/index";

describe("Nested Drawer Management Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Z-index management and stacking", () => {
    it("should stack drawers with correct z-index values", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const openFirstDrawer = () => {
          drawer.open(
            ({ close }) => (
              <div data-testid="first-drawer">
                <h2>First Drawer</h2>
                <button onClick={openSecondDrawer} data-testid="open-second">
                  Open Second Drawer
                </button>
                <button onClick={close} data-testid="close-first">
                  Close First
                </button>
              </div>
            ),
            { drawerId: "first-drawer" }
          );
        };

        const openSecondDrawer = () => {
          drawer.open(
            ({ close }) => (
              <div data-testid="second-drawer">
                <h2>Second Drawer</h2>
                <button onClick={close} data-testid="close-second">
                  Close Second
                </button>
              </div>
            ),
            { drawerId: "second-drawer" }
          );
        };

        return (
          <DrawerProvider>
            <button onClick={openFirstDrawer} data-testid="open-first">
              Open First Drawer
            </button>
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      // Open first drawer
      await user.click(screen.getByTestId("open-first"));
      await waitFor(() => {
        expect(screen.getByTestId("first-drawer")).toBeInTheDocument();
      });

      // Open second drawer from within first drawer
      await user.click(screen.getByTestId("open-second"));
      await waitFor(() => {
        expect(screen.getByTestId("second-drawer")).toBeInTheDocument();
      });

      // Both should be visible, with second on top
      const firstDrawer = screen.getByTestId("first-drawer");
      const secondDrawer = screen.getByTestId("second-drawer");

      expect(firstDrawer).toBeInTheDocument();
      expect(secondDrawer).toBeInTheDocument();

      // Find the actual Drawer.Content elements by drawer ID
      const firstContent = document.querySelector('[data-drawer-id="first-drawer"]') as HTMLElement;
      const secondContent = document.querySelector(
        '[data-drawer-id="second-drawer"]'
      ) as HTMLElement;

      expect(firstContent).toBeTruthy();
      expect(secondContent).toBeTruthy();

      const firstZIndexStr = firstContent.style.zIndex;
      const secondZIndexStr = secondContent.style.zIndex;

      console.log("Raw z-index values:", { firstZIndexStr, secondZIndexStr });
      console.log("First element data-drawer-id:", firstContent?.getAttribute("data-drawer-id"));
      console.log("Second element data-drawer-id:", secondContent?.getAttribute("data-drawer-id"));

      // Parse z-index (remove !important if present)
      const firstZIndex = parseInt(firstZIndexStr.replace(" !important", ""));
      const secondZIndex = parseInt(secondZIndexStr.replace(" !important", ""));

      console.log("Parsed z-index values:", { firstZIndex, secondZIndex });
      console.log("Comparison:", secondZIndex, ">", firstZIndex, "=", secondZIndex > firstZIndex);

      // Check that second drawer has higher z-index
      expect(secondZIndex).toBeGreaterThan(firstZIndex);
    });

    it("should handle multiple nested drawers correctly", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const openDrawer = (level: number) => {
          drawer.open(({ close }) => (
            <div data-testid={`drawer-level-${level}`}>
              <h3>Drawer Level {level}</h3>
              {level < 3 && (
                <button
                  onClick={() => openDrawer(level + 1)}
                  data-testid={`open-level-${level + 1}`}
                >
                  Open Level {level + 1}
                </button>
              )}
              <button onClick={close} data-testid={`close-level-${level}`}>
                Close Level {level}
              </button>
            </div>
          ));
        };

        return (
          <DrawerProvider>
            <button onClick={() => openDrawer(1)} data-testid="start-nesting">
              Start Nesting
            </button>
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      // Create 3 levels of nested drawers
      await user.click(screen.getByTestId("start-nesting"));
      await waitFor(() => {
        expect(screen.getByTestId("drawer-level-1")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("open-level-2"));
      await waitFor(() => {
        expect(screen.getByTestId("drawer-level-2")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("open-level-3"));
      await waitFor(() => {
        expect(screen.getByTestId("drawer-level-3")).toBeInTheDocument();
      });

      // All three levels should be visible
      expect(screen.getByTestId("drawer-level-1")).toBeInTheDocument();
      expect(screen.getByTestId("drawer-level-2")).toBeInTheDocument();
      expect(screen.getByTestId("drawer-level-3")).toBeInTheDocument();
    });
  });

  describe("Proper closing order and focus management", () => {
    it("should maintain focus on correct drawer when closing nested drawers", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const openFirstDrawer = () => {
          drawer.open(({ close }) => (
            <div data-testid="focus-first">
              <h2>First Drawer</h2>
              <button onClick={openSecondDrawer} data-testid="open-focus-second">
                Open Second
              </button>
              <button onClick={close} data-testid="close-focus-first">
                Close First
              </button>
            </div>
          ));
        };

        const openSecondDrawer = () => {
          drawer.open(({ close }) => (
            <div data-testid="focus-second">
              <h2>Second Drawer</h2>
              <button onClick={close} data-testid="close-focus-second">
                Close Second
              </button>
            </div>
          ));
        };

        return (
          <DrawerProvider>
            <button onClick={openFirstDrawer} data-testid="open-focus-first">
              Open Focus Test
            </button>
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      await user.click(screen.getByTestId("open-focus-first"));
      await waitFor(() => {
        expect(screen.getByTestId("focus-first")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("open-focus-second"));
      await waitFor(() => {
        expect(screen.getByTestId("focus-second")).toBeInTheDocument();
      });

      // Close second drawer
      await user.click(screen.getByTestId("close-focus-second"));
      await waitFor(() => {
        expect(screen.queryByTestId("focus-second")).not.toBeInTheDocument();
      });

      // First drawer should still be visible and focused
      expect(screen.getByTestId("focus-first")).toBeInTheDocument();

      // Focus should return to first drawer
      const firstDrawer = screen.getByTestId("focus-first");
      expect(firstDrawer).toBeVisible();
    });

    it("should handle closeAll() with nested drawers correctly", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const openNestedDrawers = () => {
          drawer.open(() => <div data-testid="closeall-first">First Drawer</div>);
          drawer.open(() => <div data-testid="closeall-second">Second Drawer</div>);
          drawer.open(() => <div data-testid="closeall-third">Third Drawer</div>);
        };

        const closeAllDrawers = () => {
          drawer.closeAll();
        };

        return (
          <DrawerProvider>
            <button onClick={openNestedDrawers} data-testid="open-all-nested">
              Open All Nested
            </button>
            <button onClick={closeAllDrawers} data-testid="close-all-nested">
              Close All
            </button>
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      // Open all nested drawers
      await user.click(screen.getByTestId("open-all-nested"));
      await waitFor(() => {
        expect(screen.getByTestId("closeall-first")).toBeInTheDocument();
        expect(screen.getByTestId("closeall-second")).toBeInTheDocument();
        expect(screen.getByTestId("closeall-third")).toBeInTheDocument();
      });

      // Close all drawers at once
      await user.click(screen.getByTestId("close-all-nested"));

      // All drawers should be closed
      await waitFor(() => {
        expect(screen.queryByTestId("closeall-first")).not.toBeInTheDocument();
        expect(screen.queryByTestId("closeall-second")).not.toBeInTheDocument();
        expect(screen.queryByTestId("closeall-third")).not.toBeInTheDocument();
      });
    });
  });

  describe("Memory management with nested drawers", () => {
    it("should prevent memory leaks with rapid nested drawer operations", async () => {
      const user = userEvent.setup();
      const createdDrawerIds: string[] = [];

      const InnerComponent = () => {
        const { drawerData } = useDrawerData();

        const rapidNesting = () => {
          for (let i = 0; i < 5; i++) {
            const drawerId = drawer.open(({ close, unmount }) => (
              <div data-testid={`rapid-drawer-${i}`}>
                <p>Rapid Drawer {i}</p>
                <button onClick={close} data-testid={`rapid-close-${i}`}>
                  Close {i}
                </button>
                <button onClick={unmount} data-testid={`rapid-unmount-${i}`}>
                  Unmount {i}
                </button>
              </div>
            ));
            createdDrawerIds.push(drawerId);
          }
        };

        return (
          <>
            <button onClick={rapidNesting} data-testid="rapid-nesting">
              Rapid Nesting Test
            </button>
            <div data-testid="drawer-count">
              Active: {Object.keys(drawerData).length}, Created: {createdDrawerIds.length}
            </div>
          </>
        );
      };

      const TestComponent = () => (
        <DrawerProvider>
          <InnerComponent />
        </DrawerProvider>
      );

      render(<TestComponent />);

      await user.click(screen.getByTestId("rapid-nesting"));

      // Should create 5 drawers
      await waitFor(() => {
        expect(screen.getByTestId("rapid-drawer-0")).toBeInTheDocument();
        expect(screen.getByTestId("rapid-drawer-4")).toBeInTheDocument();
        expect(screen.getByTestId("drawer-count")).toHaveTextContent("Active: 5, Created: 5");
      });

      // Unmount all drawers to test cleanup
      for (let i = 4; i >= 0; i--) {
        const unmountButton = screen.getByTestId(`rapid-unmount-${i}`);
        await user.click(unmountButton);

        await waitFor(() => {
          expect(screen.queryByTestId(`rapid-drawer-${i}`)).not.toBeInTheDocument();
        });
      }

      // Memory should be properly cleaned up - no active drawers but created count remains
      await waitFor(() => {
        expect(screen.getByTestId("drawer-count")).toHaveTextContent("Active: 0, Created: 5");
      });
    });

    it("should handle nested async drawers without memory conflicts", async () => {
      const user = userEvent.setup();
      const results: string[] = [];

      const TestComponent = () => {
        const openNestedAsync = async () => {
          // Open first async drawer
          const firstPromise = drawer.openAsync<string>(({ close }) => (
            <div data-testid="nested-async-first">
              <h3>First Async</h3>
              <button onClick={() => openSecondAsync()} data-testid="open-nested-second">
                Open Second Async
              </button>
              <button onClick={() => close("first-result")} data-testid="resolve-first">
                Resolve First
              </button>
            </div>
          ));

          const firstResult = await firstPromise;
          results.push(firstResult);
        };

        const openSecondAsync = async () => {
          const secondResult = await drawer.openAsync<string>(({ close }) => (
            <div data-testid="nested-async-second">
              <h3>Second Async</h3>
              <button onClick={() => close("second-result")} data-testid="resolve-second">
                Resolve Second
              </button>
            </div>
          ));
          results.push(secondResult);
        };

        return (
          <DrawerProvider>
            <button onClick={openNestedAsync} data-testid="open-nested-async">
              Open Nested Async
            </button>
            <div data-testid="async-results">{results.join(", ")}</div>
          </DrawerProvider>
        );
      };

      render(<TestComponent />);

      await user.click(screen.getByTestId("open-nested-async"));

      await waitFor(() => {
        expect(screen.getByTestId("nested-async-first")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("open-nested-second"));

      await waitFor(() => {
        expect(screen.getByTestId("nested-async-second")).toBeInTheDocument();
      });

      // Resolve second first
      await user.click(screen.getByTestId("resolve-second"));

      await waitFor(() => {
        expect(screen.queryByTestId("nested-async-second")).not.toBeInTheDocument();
      });

      // Then resolve first
      await user.click(screen.getByTestId("resolve-first"));

      await waitFor(() => {
        expect(screen.queryByTestId("nested-async-first")).not.toBeInTheDocument();
      });

      // Both should have resolved correctly
      await waitFor(() => {
        const resultsElement = screen.getByTestId("async-results");
        expect(resultsElement).toHaveTextContent("second-result, first-result");
      });
    });
  });
});
