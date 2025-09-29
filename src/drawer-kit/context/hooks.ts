/**
 * Drawer Context Hooks
 * Custom hooks for accessing drawer state and dispatch
 */

import { useContext } from "react";
import type { DrawerId, UseDrawerDataReturn, UseCurrentDrawerReturn } from "../types";
import { DrawerSelectors } from "./reducer";
import { DrawerContext, DrawerDispatchContext } from "./context";

// ===== Custom Hooks =====
export function useDrawerData(): UseDrawerDataReturn {
  const state = useContext(DrawerContext);

  if (!state) {
    throw new Error("useDrawerData must be used within a DrawerProvider");
  }

  return {
    current: state.current,
    drawerOrderList: state.drawerOrderList,
    drawerData: state.drawerData,
  };
}

export function useCurrentDrawer(): UseCurrentDrawerReturn {
  const state = useContext(DrawerContext);

  if (!state) {
    throw new Error("useCurrentDrawer must be used within a DrawerProvider");
  }

  return {
    current: state.current,
  };
}

export function useDrawerDispatch() {
  const dispatch = useContext(DrawerDispatchContext);

  if (!dispatch) {
    throw new Error("useDrawerDispatch must be used within a DrawerProvider");
  }

  return dispatch;
}

// ===== Selector Hooks =====
export function useDrawerSelectors() {
  const state = useContext(DrawerContext);

  if (!state) {
    throw new Error("useDrawerSelectors must be used within a DrawerProvider");
  }

  return {
    getCurrentDrawer: () => DrawerSelectors.getCurrentDrawer(state),
    getDrawerById: (id: DrawerId) => DrawerSelectors.getDrawerById(state, id),
    getOpenDrawers: () => DrawerSelectors.getOpenDrawers(state),
    isDrawerOpen: (id: DrawerId) => DrawerSelectors.isDrawerOpen(state, id),
    getDrawerCount: () => DrawerSelectors.getDrawerCount(state),
    getDrawerOrderList: () => DrawerSelectors.getDrawerOrderList(state),
  };
}
