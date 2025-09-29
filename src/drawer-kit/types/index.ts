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
  modal?: boolean;
  dismissible?: boolean;
  container?: HTMLElement;
  handleOnly?: boolean;
  repositionInputs?: boolean;

  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
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
