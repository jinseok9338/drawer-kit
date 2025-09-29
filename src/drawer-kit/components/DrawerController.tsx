/**
 * Drawer Controller Component
 * Integrates drawer-kit with vaul drawer components
 */

import React, { useCallback } from "react";
import { Drawer } from "vaul";
import type { DrawerId, DrawerControllerProps, DrawerAsyncControllerProps } from "../types";
import type { DrawerItem } from "../context/reducer";
import { drawerEventEmitter } from "../events";

interface DrawerControllerComponentProps {
  drawerId: DrawerId;
  drawerItem: DrawerItem;
  zIndex?: number;
}

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

  // ===== Debug logging =====
  console.log(`DrawerController ${drawerId}:`, {
    isOpen,
    snapPoints: options.snapPoints,
    direction: options.direction,
    activeSnapPoint: options.snapPoints
      ? options.activeSnapPoint !== undefined
        ? options.activeSnapPoint
        : options.snapPoints[0]
      : options.activeSnapPoint,
    fadeFromIndex: options.snapPoints
      ? options.fadeFromIndex !== undefined
        ? options.fadeFromIndex
        : options.snapPoints.length - 1
      : options.fadeFromIndex,
    drawerRootProps: drawerRootProps,
  });

  // ===== Render =====
  return (
    <Drawer.Root {...(drawerRootProps as any)}>
      {/* Always use Portal for proper positioning and z-index */}
      <Drawer.Portal container={options.container}>
        <Drawer.Overlay
          className="drawer-kit-overlay"
          style={{ zIndex: `${zIndex - 1} !important` }}
        />
        <Drawer.Content
          className="drawer-kit-content"
          data-drawer-id={drawerId}
          style={{ zIndex: `${zIndex} !important` }}
        >
          <Controller {...(controllerProps as any)} />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
