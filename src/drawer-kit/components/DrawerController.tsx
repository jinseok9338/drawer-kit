/**
 * Drawer Controller Component
 * Integrates drawer-kit with vaul drawer components
 */

import React, { useCallback } from "react";
import { Drawer } from "vaul";
import type { DrawerId, DrawerControllerProps, DrawerAsyncControllerProps } from "../types";
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
    onOpenChange: handleOpenChange,
    direction: options.direction || "bottom",
    modal: options.modal !== false,
    dismissible: options.dismissible !== false,
    ...(options.shouldScaleBackground !== undefined && {
      shouldScaleBackground: options.shouldScaleBackground,
    }),
    ...(options.setBackgroundColorOnScale !== undefined && {
      setBackgroundColorOnScale: options.setBackgroundColorOnScale,
    }),
    ...(options.closeThreshold !== undefined && { closeThreshold: options.closeThreshold }),
    ...(options.scrollLockTimeout !== undefined && {
      scrollLockTimeout: options.scrollLockTimeout,
    }),
    ...(options.fixed !== undefined && { fixed: options.fixed }),
    ...(options.defaultOpen !== undefined && { defaultOpen: options.defaultOpen }),
    ...(options.disablePreventScroll !== undefined && {
      disablePreventScroll: options.disablePreventScroll,
    }),
    ...(options.autoFocus !== undefined && { autoFocus: options.autoFocus }),
    ...(options.snapPoints !== undefined && {
      snapPoints: options.snapPoints,
      // Set first snapPoint as default activeSnapPoint if not provided
      activeSnapPoint:
        options.activeSnapPoint !== undefined ? options.activeSnapPoint : options.snapPoints[0],
      // Set fadeFromIndex to last snapPoint if not provided
      fadeFromIndex:
        options.fadeFromIndex !== undefined ? options.fadeFromIndex : options.snapPoints.length - 1,
    }),
    ...(options.fadeFromIndex !== undefined &&
      options.snapPoints === undefined && { fadeFromIndex: options.fadeFromIndex }),
    ...(options.activeSnapPoint !== undefined &&
      options.snapPoints === undefined && { activeSnapPoint: options.activeSnapPoint }),
    ...(options.setActiveSnapPoint !== undefined && {
      setActiveSnapPoint: options.setActiveSnapPoint,
    }),
    ...(options.snapToSequentialPoint !== undefined && {
      snapToSequentialPoint: options.snapToSequentialPoint,
    }),
    ...(options.onClose !== undefined && { onClose: options.onClose }),
    ...(options.onDrag !== undefined && { onDrag: options.onDrag }),
    ...(options.onRelease !== undefined && { onRelease: options.onRelease }),
    ...(options.onAnimationEnd !== undefined && { onAnimationEnd: options.onAnimationEnd }),
    ...(options.preventScrollRestoration !== undefined && {
      preventScrollRestoration: options.preventScrollRestoration,
    }),
    ...(options.noBodyStyles !== undefined && { noBodyStyles: options.noBodyStyles }),
    ...(options.repositionInputs !== undefined && { repositionInputs: options.repositionInputs }),
    ...(options.container !== undefined && { container: options.container }),
  } as const;

  // ===== Render =====
  return (
    <Drawer.Root {...(drawerRootProps as any)}>
      <Drawer.Portal container={options.container}>
        <Drawer.Overlay
          style={{
            zIndex: zIndex - 1,
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "black",
            opacity: 0.4,
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
            bottom: 0,
            left: 0,
            right: 0,
            opacity: 1,
            outline: "none",
            backgroundColor: "gray",
          }}
        >
          <Controller {...(controllerProps as any)} />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
