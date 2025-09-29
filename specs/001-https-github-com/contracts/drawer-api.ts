/**
 * Drawer-Kit API Contract
 * TypeScript interface definitions for the drawer library
 */

// Core Types
export type DrawerId = string;
export type DrawerDirection = "top" | "bottom" | "left" | "right";

// Configuration Options
export interface DrawerOptions {
  drawerId?: string;

  direction?: DrawerDirection;
  modal?: boolean;
  dismissible?: boolean;
}

// Controller Props
export interface DrawerControllerProps {
  drawerId: string;
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
}

export interface DrawerAsyncControllerProps<T> {
  drawerId: string;
  isOpen: boolean;
  close: (result: T) => void;
  unmount: () => void;
}

// Component Types
export type DrawerControllerComponent = React.FC<DrawerControllerProps>;
export type DrawerAsyncControllerComponent<T> = React.FC<DrawerAsyncControllerProps<T>>;

// Main API Interface
export interface DrawerAPI {
  /**
   * Open a drawer with the provided controller component
   */
  open: (controller: DrawerControllerComponent, options?: DrawerOptions) => DrawerId;

  /**
   * Open a drawer and return a Promise that resolves when closed with a result
   */
  openAsync: <T>(
    controller: DrawerAsyncControllerComponent<T>,
    options?: DrawerOptions
  ) => Promise<T>;

  /**
   * Close a specific drawer by ID
   */
  close: (drawerId: DrawerId) => void;

  /**
   * Close all open drawers
   */
  closeAll: () => void;

  /**
   * Unmount a specific drawer by ID
   */
  unmount: (drawerId: DrawerId) => void;

  /**
   * Unmount all drawers
   */
  unmountAll: () => void;
}

// Provider Props
export interface DrawerProviderProps {
  children: React.ReactNode;
}

// Hook Return Types
export interface UseDrawerDataReturn {
  current: DrawerId | null;
  drawerOrderList: DrawerId[];
  drawerData: Record<DrawerId, unknown>;
}

export interface UseCurrentDrawerReturn {
  current: DrawerId | null;
}
