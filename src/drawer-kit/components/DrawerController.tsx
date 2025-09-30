/**
 * Drawer Controller Component
 * Integrates drawer-kit with vaul drawer components
 */

import React, { useCallback } from "react";
import { Drawer } from "vaul";
import type {
  DrawerId,
  DrawerControllerProps,
  DrawerAsyncControllerProps,
  DrawerDirection,
  DrawerOptions,
} from "../types";
import type { DrawerItem } from "../context/reducer";
import { drawerEventEmitter } from "../events";
import "./index.css";

interface DrawerControllerComponentProps {
  drawerId: DrawerId;
  drawerItem: DrawerItem;
  zIndex?: number;
}

const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: 0,
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      border: 0,
    }}
  >
    {children}
  </span>
);

export function DrawerController({
  drawerId,
  drawerItem,
  zIndex = 1000,
}: DrawerControllerComponentProps) {
  const { controller: Controller, isOpen, options } = drawerItem;

  // ===== Event Handlers =====
  const handleClose = useCallback(
    (result?: unknown) => {
      drawerEventEmitter.emit("close", { drawerId, result });
    },
    [drawerId]
  );

  const handleUnmount = useCallback(() => {
    drawerEventEmitter.emit("unmount", { drawerId });
  }, [drawerId]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        // For async drawers, overlay click should be treated as cancellation
        // For sync drawers, just close normally
        if (drawerItem.resolve) {
          handleClose("cancelled"); // Explicit cancellation value
        } else {
          handleClose();
        }
      }

      // Call user-provided onOpenChange if exists
      if (options.onOpenChange) {
        options.onOpenChange(open);
      }
    },
    [handleClose, options, drawerItem.resolve]
  );

  // ===== Controller Props =====
  const controllerProps = {
    isOpen,
    close: drawerItem.resolve ? (result?: unknown) => handleClose(result) : () => handleClose(),
    unmount: handleUnmount,
    zIndex,
  } as (DrawerControllerProps | DrawerAsyncControllerProps) & { zIndex?: number };

  // ===== Build Props Conditionally =====
  const drawerRootProps = {
    open: isOpen,
    onOpenChange: options.dismissible === false ? undefined : handleOpenChange,
    direction: options.direction || "bottom",
    modal: options.modal !== false,
    dismissible: options.dismissible !== false,
    ...(options.repositionInputs !== undefined && { repositionInputs: options.repositionInputs }),
    ...(options.container !== undefined && { container: options.container }),
    ...(options.onClose !== undefined && { onClose: options.onClose }),
    ...(options.onAnimationEnd !== undefined && { onAnimationEnd: options.onAnimationEnd }),
  } as DrawerOptions & {
    open: boolean;
  };

  const insetStyle = (options: DrawerDirection | undefined) => {
    switch (options) {
      case "top":
        return { top: 0, left: 0, right: 0 };
      case "bottom":
        return { bottom: 0, left: 0, right: 0 };
      case "left":
        return { left: 0, top: 0, bottom: 0 };
      case "right":
        return { right: 0, top: 0, bottom: 0 };
    }
    return { left: 0, right: 0, bottom: 0 };
  };

  return (
    <Drawer.Root {...drawerRootProps}>
      <Drawer.Portal container={options.container}>
        <Drawer.Overlay
          style={{
            zIndex: zIndex - 1,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            pointerEvents: options.dismissible === false ? "none" : "auto",
          }}
        />
        <VisuallyHidden>
          <Drawer.Title>Drawer</Drawer.Title>
          <Drawer.Description>A drawer component for displaying content</Drawer.Description>
        </VisuallyHidden>
        <Drawer.Content
          data-drawer-id={drawerId}
          style={{
            zIndex: zIndex,
            position: "fixed",
            ...insetStyle(options.direction),
            opacity: 1,
            outline: "none",
          }}
        >
          <Controller {...(controllerProps as any)} />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
