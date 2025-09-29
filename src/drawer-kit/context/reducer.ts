/**
 * Drawer State Management
 * Based on overlay-kit reducer with drawer-specific adaptations
 */

import type {
  DrawerId,
  DrawerControllerComponent,
  DrawerAsyncControllerComponent,
  DrawerOptions,
} from "../types";

// ===== State Types =====
export interface DrawerItem {
  id: DrawerId;
  componentKey: string;
  controller: DrawerControllerComponent | DrawerAsyncControllerComponent;
  isOpen: boolean;
  options: DrawerOptions;
  resolve?: (value: unknown) => void;
  reject?: (reason?: unknown) => void;
}

export interface DrawerState {
  current: DrawerId | null;
  drawerOrderList: DrawerId[];
  drawerData: Record<DrawerId, DrawerItem>;
}

// ===== Action Types =====
export type DrawerReducerAction =
  | {
      type: "ADD";
      payload: {
        id: DrawerId;
        componentKey: string;
        controller: DrawerControllerComponent | DrawerAsyncControllerComponent;
        options: DrawerOptions;
        resolve?: (value: unknown) => void;
        reject?: (reason?: unknown) => void;
      };
    }
  | {
      type: "OPEN";
      payload: { id: DrawerId };
    }
  | {
      type: "CLOSE";
      payload: { id: DrawerId; result?: unknown };
    }
  | {
      type: "REMOVE";
      payload: { id: DrawerId };
    }
  | {
      type: "CLOSE_ALL";
    }
  | {
      type: "REMOVE_ALL";
    };

// ===== Reducer Function =====
export function drawerReducer(state: DrawerState, action: DrawerReducerAction): DrawerState {
  switch (action.type) {
    case "ADD": {
      const { id, componentKey, controller, options, resolve, reject } = action.payload;

      const newDrawerItem: DrawerItem = {
        id,
        componentKey,
        controller,
        isOpen: false,
        options,
        resolve,
        reject,
      };

      const newDrawerOrderList = [...state.drawerOrderList, id];
      const newCurrent = determineCurrentDrawerId(
        newDrawerOrderList,
        { ...state.drawerData, [id]: newDrawerItem },
        id
      );

      return {
        ...state,
        current: newCurrent,
        drawerOrderList: newDrawerOrderList,
        drawerData: {
          ...state.drawerData,
          [id]: newDrawerItem,
        },
      };
    }

    case "OPEN": {
      const { id } = action.payload;
      const drawerItem = state.drawerData[id];

      if (!drawerItem) return state;

      const updatedDrawerItem: DrawerItem = {
        ...drawerItem,
        isOpen: true,
      };

      const newCurrent = determineCurrentDrawerId(
        state.drawerOrderList,
        { ...state.drawerData, [id]: updatedDrawerItem },
        id
      );

      return {
        ...state,
        current: newCurrent,
        drawerData: {
          ...state.drawerData,
          [id]: updatedDrawerItem,
        },
      };
    }

    case "CLOSE": {
      const { id, result } = action.payload;
      const drawerItem = state.drawerData[id];

      // ignore if the drawer don't exist or already closed
      if (!drawerItem || !drawerItem.isOpen) {
        return state;
      }

      // Resolve async drawer if applicable
      if (drawerItem.resolve && result !== undefined) {
        drawerItem.resolve(result);
      }

      const updatedDrawerItem: DrawerItem = {
        ...drawerItem,
        isOpen: false,
      };

      const newCurrent = determineCurrentDrawerId(state.drawerOrderList, state.drawerData, id);

      return {
        ...state,
        current: newCurrent,
        drawerData: {
          ...state.drawerData,
          [id]: updatedDrawerItem,
        },
      };
    }

    case "REMOVE": {
      const { id } = action.payload;
      const drawerItem = state.drawerData[id];

      if (!drawerItem) return state;

      // Reject async drawer if unmounted without result
      if (drawerItem.reject) {
        drawerItem.reject(new Error("Drawer unmounted without result"));
      }

      const newDrawerOrderList = state.drawerOrderList.filter((drawerId) => drawerId !== id);
      const newCurrent = determineCurrentDrawerId(
        newDrawerOrderList,
        state.drawerData,
        newDrawerOrderList[newDrawerOrderList.length - 1] || null
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _, ...remainingDrawerData } = state.drawerData;

      return {
        ...state,
        current: newCurrent,
        drawerOrderList: newDrawerOrderList,
        drawerData: remainingDrawerData,
      };
    }

    case "CLOSE_ALL": {
      const updatedDrawerData: Record<DrawerId, DrawerItem> = {};

      // Close all drawers and resolve/reject as needed
      Object.entries(state.drawerData).forEach(([id, drawer]) => {
        if (drawer.resolve) {
          drawer.resolve(false); // Default close value for async drawers
        }
        updatedDrawerData[id] = { ...drawer, isOpen: false };
      });

      return {
        ...state,
        current: null,
        drawerOrderList: [],
        drawerData: updatedDrawerData,
      };
    }

    case "REMOVE_ALL": {
      // Reject all async drawers
      Object.values(state.drawerData).forEach((drawer) => {
        if (drawer.reject) {
          drawer.reject(new Error("All drawers unmounted"));
        }
      });

      return {
        current: null,
        drawerOrderList: [],
        drawerData: {},
      };
    }

    default:
      return state;
  }
}

// ===== Helper Functions =====
export const determineCurrentDrawerId = (
  drawerOrderList: DrawerId[],
  drawerData: Record<DrawerId, DrawerItem>,
  targetDrawerId: DrawerId | null
): DrawerId | null => {
  if (!targetDrawerId || !drawerData[targetDrawerId]) {
    return null;
  }

  // Return the last (topmost) drawer in the order list
  return drawerOrderList[drawerOrderList.length - 1] || null;
};

// ===== Selectors =====
export const DrawerSelectors = {
  getCurrentDrawer: (state: DrawerState) =>
    state.current ? state.drawerData[state.current] || null : null,

  getDrawerById: (state: DrawerState, id: DrawerId) => state.drawerData[id] || null,

  getOpenDrawers: (state: DrawerState) => Object.values(state.drawerData).filter((d) => d.isOpen),

  isDrawerOpen: (state: DrawerState, id: DrawerId) => state.drawerData[id]?.isOpen || false,

  getDrawerCount: (state: DrawerState) => Object.keys(state.drawerData).length,

  getDrawerOrderList: (state: DrawerState) => state.drawerOrderList,
};

// ===== Reducer Type Export =====
export type DrawerReducer = typeof drawerReducer;
