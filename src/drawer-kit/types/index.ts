/**
 * Drawer-Kit Type Definitions
 * Based on overlay-kit architecture with vaul drawer integration
 */

import React from "react";

// ===== Core Types =====
export type DrawerId = string;
export type DrawerDirection = "top" | "bottom" | "left" | "right";

// ===== Drawer Options =====
export interface DrawerOptions {
  // Vaul-specific options
  direction?: DrawerDirection;
  snapPoints?: (string | number)[];
  modal?: boolean;
  dismissible?: boolean;
  shouldScaleBackground?: boolean;
  setBackgroundColorOnScale?: boolean;
  closeThreshold?: number;
  scrollLockTimeout?: number;
  fixed?: boolean;
  container?: HTMLElement;
  defaultOpen?: boolean;
  disablePreventScroll?: boolean;
  autoFocus?: boolean;

  // Handle and interaction options
  handleOnly?: boolean;
  repositionInputs?: boolean;

  // Snap points specific options
  snapToSequentialPoint?: boolean;
  fadeFromIndex?: number;
  activeSnapPoint?: number | string | null;
  setActiveSnapPoint?: (snapPoint: number | string | null) => void;

  // Animation and styling
  noBodyStyles?: boolean;
  preventScrollRestoration?: boolean;

  // Event callbacks
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onDrag?: (event: React.PointerEvent, percentageDragged: number) => void;
  onRelease?: (event: React.PointerEvent, open: boolean) => void;
  onAnimationEnd?: (open: boolean) => void;
}

// ===== Controller Component Props =====
export interface DrawerControllerProps {
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
}

export interface DrawerAsyncControllerProps<T = any> {
  isOpen: boolean;
  close: (result: T) => void;
  unmount: () => void;
}

// ===== Controller Component Types =====
export type DrawerControllerComponent = React.ComponentType<DrawerControllerProps>;
export type DrawerAsyncControllerComponent<T = any> = React.ComponentType<
  DrawerAsyncControllerProps<T>
>;

// ===== Open Options =====
export interface OpenDrawerOptions extends DrawerOptions {
  drawerId?: DrawerId;
}

// ===== Drawer API =====
export interface DrawerAPI {
  open: (controller: DrawerControllerComponent, options?: OpenDrawerOptions) => DrawerId;

  openAsync: <T = any>(
    controller: DrawerAsyncControllerComponent<T>,
    options?: OpenDrawerOptions
  ) => Promise<T>;

  close: (drawerId: DrawerId) => void;
  unmount: (drawerId: DrawerId) => void;
  closeAll: () => void;
  unmountAll: () => void;

  // Snap point control
  snapTo?: (drawerId: DrawerId, snapPointIndex: number) => void;
}

// ===== Provider Props =====
export interface DrawerProviderProps {
  children: React.ReactNode;
}

// ===== Hook Return Types =====
export interface UseDrawerDataReturn {
  current: DrawerId | null;
  drawerOrderList: DrawerId[];
  drawerData: Record<DrawerId, any>;
}

export interface UseCurrentDrawerReturn {
  current: DrawerId | null;
}
