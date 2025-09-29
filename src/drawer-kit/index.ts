/**
 * Drawer-Kit Main API
 * Declarative drawer management inspired by toss/overlay-kit
 */

import type {
  DrawerId,
  DrawerAPI,
  DrawerControllerComponent,
  DrawerAsyncControllerComponent,
  OpenDrawerOptions,
} from "./types";
import { drawerEventEmitter } from "./events";

// ===== Utility Functions =====
function generateDrawerId(): DrawerId {
  return `drawer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateComponentKey(): string {
  return `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ===== Main Drawer API =====
const drawerAPI: DrawerAPI = {
  open: (controller: DrawerControllerComponent, options: OpenDrawerOptions = {}): DrawerId => {
    const drawerId = options.drawerId || generateDrawerId();
    const componentKey = generateComponentKey();

    drawerEventEmitter.emit("open", {
      controller,
      drawerId,
      componentKey,
      options,
    });

    return drawerId;
  },

  openAsync: <T = any>(
    controller: DrawerAsyncControllerComponent<T>,
    options: OpenDrawerOptions = {}
  ): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const drawerId = options.drawerId || generateDrawerId();
      const componentKey = generateComponentKey();

      drawerEventEmitter.emit("openAsync", {
        controller: controller as DrawerAsyncControllerComponent<any>,
        drawerId,
        componentKey,
        options,
        resolve: resolve as (value: any) => void,
        reject,
      });
    });
  },

  close: (drawerId: DrawerId): void => {
    drawerEventEmitter.emit("close", { drawerId });
  },

  unmount: (drawerId: DrawerId): void => {
    drawerEventEmitter.emit("unmount", { drawerId });
  },

  closeAll: (): void => {
    drawerEventEmitter.emit("closeAll");
  },

  unmountAll: (): void => {
    drawerEventEmitter.emit("unmountAll");
  },
};

// ===== Exports =====
export const drawer = drawerAPI;

// Re-export types and components
export type * from "./types";
export { DrawerProvider } from "./context/provider";
export {
  useDrawerData,
  useCurrentDrawer,
  useDrawerDispatch,
  useDrawerSelectors,
} from "./context/hooks";
export { DrawerController } from "./components/DrawerController";
export { drawerEventEmitter } from "./events";
export type { DrawerEvent, DrawerEventEmitter } from "./events";
export { drawerReducer, DrawerSelectors } from "./context/reducer";
export type {
  DrawerState,
  DrawerReducerAction,
  DrawerItem,
  DrawerReducer,
} from "./context/reducer";

// Default export
export default drawer;
