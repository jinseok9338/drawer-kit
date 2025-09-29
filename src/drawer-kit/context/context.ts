/**
 * Drawer Context Definitions
 * Separated to avoid react-refresh issues
 */

import { createContext } from "react";
import type { DrawerState, DrawerReducerAction } from "./reducer";

// ===== Context Creation =====
export const DrawerContext = createContext<DrawerState | null>(null);
export const DrawerDispatchContext = createContext<React.Dispatch<DrawerReducerAction> | null>(
  null
);
