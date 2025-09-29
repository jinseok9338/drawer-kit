/**
 * Drawer-Kit State Management Contract
 * Redux-style state management for drawer lifecycle
 */

import {
  DrawerControllerComponent,
  DrawerId,
  DrawerDirection,
} from "./drawer-api";

// State Types
export interface DrawerItem {
  id: DrawerId;
  componentKey: string;
  isOpen: boolean;
  isMounted: boolean;
  controller: DrawerControllerComponent;
  snapPoints?: number[];
  direction: DrawerDirection;
  modal: boolean;
  dismissible: boolean;
  zIndex: number;
}

export interface DrawerState {
  current: DrawerId | null;
  drawerOrderList: DrawerId[];
  drawerData: Record<DrawerId, DrawerItem>;
}

// Action Types
export type DrawerReducerAction =
  | { type: "ADD"; drawer: DrawerItem }
  | { type: "OPEN"; drawerId: string }
  | { type: "CLOSE"; drawerId: string }
  | { type: "REMOVE"; drawerId: string }
  | { type: "SNAP_TO"; drawerId: string; snapIndex: number }
  | { type: "CLOSE_ALL" }
  | { type: "REMOVE_ALL" };

// Reducer Function Type
export type DrawerReducer = (
  state: DrawerState,
  action: DrawerReducerAction
) => DrawerState;

// State Selectors
export interface DrawerSelectors {
  getCurrentDrawer: (state: DrawerState) => DrawerItem | null;
  getDrawerById: (state: DrawerState, drawerId: DrawerId) => DrawerItem | null;
  getOpenDrawers: (state: DrawerState) => DrawerItem[];
  isDrawerOpen: (state: DrawerState, drawerId: DrawerId) => boolean;
  getDrawerCount: (state: DrawerState) => number;
  getTopDrawer: (state: DrawerState) => DrawerItem | null;
}

// Initial State
export const initialDrawerState: DrawerState = {
  current: null,
  drawerOrderList: [],
  drawerData: {},
};
