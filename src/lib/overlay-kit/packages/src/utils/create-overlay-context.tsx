import { createOverlayProvider } from '../context/provider';

export const { overlay, OverlayProvider, useCurrentOverlay, useOverlayData } = createOverlayProvider();

 
export function experimental_createOverlayContext() {
  return createOverlayProvider();
}
