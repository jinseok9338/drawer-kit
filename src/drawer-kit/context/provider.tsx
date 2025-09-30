/**
 * Drawer Context Provider
 * Based on overlay-kit provider with vaul integration
 */

import { useReducer, useEffect } from "react";
import type { DrawerProviderProps } from "../types";
import { drawerReducer, type DrawerState } from "./reducer";
import { drawerEventEmitter } from "../events";
import { DrawerController } from "../components/DrawerController";
import { DrawerContext, DrawerDispatchContext } from "./context";

// ===== Initial State =====
const initialDrawerState: DrawerState = {
  current: null,
  drawerOrderList: [],
  drawerData: {},
};

// ===== Provider Component =====
export function DrawerProvider({ children }: DrawerProviderProps) {
  const [state, dispatch] = useReducer(drawerReducer, initialDrawerState);

  // ===== Event Listeners =====
  useEffect(() => {
    const handleOpen = (args: Parameters<typeof drawerEventEmitter.emit<"open">>[1]) => {
      const { controller, drawerId, componentKey, options } = args;

      // Add drawer to state
      dispatch({
        type: "ADD",
        payload: {
          id: drawerId,
          componentKey,
          controller,
          options,
        },
      });

      // Open drawer immediately
      dispatch({
        type: "OPEN",
        payload: { id: drawerId },
      });
    };

    const handleOpenAsync = (args: Parameters<typeof drawerEventEmitter.emit<"openAsync">>[1]) => {
      const { controller, drawerId, componentKey, options, resolve, reject } = args;

      // Add async drawer to state
      dispatch({
        type: "ADD",
        payload: {
          id: drawerId,
          componentKey,
          controller,
          options,
          resolve,
          reject,
        },
      });

      // Open drawer immediately
      dispatch({
        type: "OPEN",
        payload: { id: drawerId },
      });
    };

    const handleClose = (args: Parameters<typeof drawerEventEmitter.emit<"close">>[1]) => {
      const { drawerId, result } = args;

      dispatch({
        type: "CLOSE",
        payload: { id: drawerId, result },
      });
    };

    const handleUnmount = (args: Parameters<typeof drawerEventEmitter.emit<"unmount">>[1]) => {
      const { drawerId } = args;

      dispatch({
        type: "REMOVE",
        payload: { id: drawerId },
      });
    };

    const handleCloseAll = () => {
      dispatch({ type: "CLOSE_ALL" });
    };

    const handleUnmountAll = () => {
      dispatch({ type: "REMOVE_ALL" });
    };

    // Register event listeners
    drawerEventEmitter.on("open", handleOpen);
    drawerEventEmitter.on("openAsync", handleOpenAsync);
    drawerEventEmitter.on("close", handleClose);
    drawerEventEmitter.on("unmount", handleUnmount);
    drawerEventEmitter.on("closeAll", handleCloseAll);
    drawerEventEmitter.on("unmountAll", handleUnmountAll);

    // Cleanup
    return () => {
      drawerEventEmitter.off("open", handleOpen);
      drawerEventEmitter.off("openAsync", handleOpenAsync);
      drawerEventEmitter.off("close", handleClose);
      drawerEventEmitter.off("unmount", handleUnmount);
      drawerEventEmitter.off("closeAll", handleCloseAll);
      drawerEventEmitter.off("unmountAll", handleUnmountAll);
    };
  }, []);

  return (
    <DrawerContext.Provider value={state}>
      <DrawerDispatchContext.Provider value={dispatch}>
        {children}
        {/* Render all drawers (open and closed) */}
        {state.drawerOrderList.map((drawerId, index) => {
          const drawerItem = state.drawerData[drawerId];
          if (!drawerItem) return null;

          const zIndex = 1000 + index;

          return (
            <DrawerController
              key={drawerItem.componentKey}
              drawerId={drawerId}
              drawerItem={drawerItem}
              zIndex={zIndex}
            />
          );
        })}
      </DrawerDispatchContext.Provider>
    </DrawerContext.Provider>
  );
}

// Hooks are exported from hooks.ts to avoid react-refresh issues
