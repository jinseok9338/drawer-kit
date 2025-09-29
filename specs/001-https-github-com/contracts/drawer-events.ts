/**
 * Drawer-Kit Event System Contract
 * Event types and handlers for drawer lifecycle management
 */

import { DrawerControllerComponent } from "./drawer-api";

// Event Types
export interface DrawerEvent {
  open: (args: {
    controller: DrawerControllerComponent;
    drawerId: string;
    componentKey: string;

    direction: "top" | "bottom" | "left" | "right";
    modal: boolean;
    dismissible: boolean;
  }) => void;
  close: (drawerId: string) => void;
  unmount: (drawerId: string) => void;
  closeAll: () => void;
  unmountAll: () => void;
}

// Event Emitter Interface
export interface DrawerEventEmitter {
  on<K extends keyof DrawerEvent>(event: K, handler: DrawerEvent[K]): void;
  off<K extends keyof DrawerEvent>(event: K, handler?: DrawerEvent[K]): void;
  emit<K extends keyof DrawerEvent>(event: K, ...args: Parameters<DrawerEvent[K]>): void;
}

// Event Handler Types
export type DrawerEventHandler<T = unknown> = (payload: T) => void;
export type DrawerEventHandlers = Record<string, DrawerEventHandler[]>;

// External Event System
export interface ExternalEventSystem<T extends Record<string, unknown>> {
  useExternalEvents: (events: T) => void;
  createEvent: <K extends keyof T>(event: K) => (...args: Parameters<T[K]>) => void;
}
