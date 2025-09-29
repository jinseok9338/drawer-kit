/**
 * Drawer Event System
 * Based on overlay-kit event architecture with drawer-specific events
 */

import type {
  DrawerId,
  DrawerControllerComponent,
  DrawerAsyncControllerComponent,
  OpenDrawerOptions,
} from "../types";

// ===== Event Types =====
export interface DrawerEvent {
  open: (args: {
    controller: DrawerControllerComponent;
    drawerId: DrawerId;
    componentKey: string;
    options: OpenDrawerOptions;
  }) => void;

  openAsync: <T = any>(args: {
    controller: DrawerAsyncControllerComponent<T>;
    drawerId: DrawerId;
    componentKey: string;
    options: OpenDrawerOptions;
    resolve: (value: T) => void;
    reject: (reason?: any) => void;
  }) => void;

  close: (args: { drawerId: DrawerId; result?: any }) => void;

  unmount: (args: { drawerId: DrawerId }) => void;

  closeAll: () => void;
  unmountAll: () => void;
}

// ===== Event Handler Types =====
export type DrawerEventHandler<T = any> = (payload: T) => void;
export type DrawerEventHandlers = Record<string, DrawerEventHandler[]>;

// ===== Event Emitter =====
export interface DrawerEventEmitter {
  on<K extends keyof DrawerEvent>(
    event: K,
    handler: DrawerEventHandler<Parameters<DrawerEvent[K]>[0]>
  ): void;

  off<K extends keyof DrawerEvent>(
    event: K,
    handler: DrawerEventHandler<Parameters<DrawerEvent[K]>[0]>
  ): void;

  emit<K extends keyof DrawerEvent>(event: K, ...args: Parameters<DrawerEvent[K]>): void;
}

// ===== External Event System =====
export interface ExternalEventSystem<T extends Record<string, any>> {
  useExternalEvents: (events: T) => void;
  createEvent: <K extends keyof T>(event: K) => (...args: Parameters<T[K]>) => void;
}

// ===== Simple Event Emitter Implementation =====
class SimpleEventEmitter implements DrawerEventEmitter {
  private handlers: DrawerEventHandlers = {};

  on<K extends keyof DrawerEvent>(
    event: K,
    handler: DrawerEventHandler<Parameters<DrawerEvent[K]>[0]>
  ): void {
    const eventName = String(event);
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
  }

  off<K extends keyof DrawerEvent>(
    event: K,
    handler: DrawerEventHandler<Parameters<DrawerEvent[K]>[0]>
  ): void {
    const eventName = String(event);
    if (!this.handlers[eventName]) return;

    this.handlers[eventName] = this.handlers[eventName].filter((h) => h !== handler);
  }

  emit<K extends keyof DrawerEvent>(event: K, ...args: Parameters<DrawerEvent[K]>): void {
    const eventName = String(event);
    if (!this.handlers[eventName]) return;

    this.handlers[eventName].forEach((handler) => {
      handler(args[0]);
    });
  }
}

// ===== Global Event Emitter =====
export const drawerEventEmitter = new SimpleEventEmitter();
