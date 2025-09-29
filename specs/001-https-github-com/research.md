# Research: Drawer-Kit Implementation

**Date**: September 28, 2025  
**Feature**: Drawer-Kit Library  
**Phase**: 0 - Research & Analysis

## Research Findings

### 1. Overlay-Kit Architecture Analysis

**Decision**: Adopt overlay-kit's event-driven architecture with React Context provider pattern  
**Rationale**:

- Proven system handling multiple overlays with proper state management
- Event emitter pattern allows decoupled communication between drawer instances
- Reducer-based state management provides predictable state transitions
- `overlayOrderList` and `current` tracking enables proper nested drawer support

**Alternatives Considered**:

- Direct vaul integration without overlay-kit patterns: Rejected due to lack of declarative API
- Custom state management: Rejected due to complexity and overlay-kit's proven approach
- Hooks-only approach: Rejected due to inability to handle nested drawers properly

### 2. Vaul Integration Strategy

**Decision**: Wrap vaul components within overlay-kit's ContentController pattern  
**Rationale**:

- Vaul provides robust drawer UI with animations, accessibility, and gesture handling
- ContentController pattern allows seamless integration with overlay-kit lifecycle
- Preserves all vaul API options (snapPoints, direction, modal, dismissible)
- Maintains vaul's animation performance and gesture recognition

**Alternatives Considered**:

- Custom drawer implementation: Rejected due to complexity of animations and gestures
- Direct vaul usage: Rejected due to lack of declarative API and state management
- Framer Motion alternative: Rejected due to vaul's superior drawer-specific features

### 3. State Management Architecture

**Decision**: Extend overlay-kit's reducer with drawer-specific actions and state  
**Rationale**:

- Reuse proven `ADD`, `OPEN`, `CLOSE`, `REMOVE` actions
- Add drawer-specific state: snapPoints, direction, modal, dismissible
- Maintain z-index management for proper stacking
- Support `SNAP_TO` action for vaul's snap point functionality

**Key State Extensions**:

```typescript
type DrawerItem = OverlayItem & {
  snapPoints?: number[];
  direction: "top" | "bottom" | "left" | "right";
  modal: boolean;
  dismissible: boolean;
  zIndex: number;
};
```

### 4. API Design Compatibility

**Decision**: Mirror overlay-kit's API exactly with drawer-specific options  
**Rationale**:

- Zero learning curve for overlay-kit users
- Consistent patterns across both libraries
- Type-safe integration with TypeScript definitions
- Promise-based async handling for user interactions

**API Surface**:

```typescript
export const drawer = {
  open: (controller: DrawerControllerComponent, options?: DrawerOptions) => string,
  openAsync: <T>(controller: DrawerAsyncControllerComponent<T>, options?: DrawerOptions) => Promise<T>,
  close: (drawerId: string) => void,
  closeAll: () => void,
  unmount: (drawerId: string) => void,
  unmountAll: () => void
}
```

### 5. Testing Strategy

**Decision**: Multi-layered testing with automated tests + manual test UI  
**Rationale**:

- Unit tests for individual functions and components
- Integration tests for drawer lifecycle and state management
- E2E tests for user interaction flows
- Manual test UI for visual verification and edge case testing

**Testing Stack**:

- **Unit**: Vitest + @testing-library/react for component testing
- **Integration**: Test drawer opening, closing, nesting scenarios
- **E2E**: Playwright for full user interaction testing
- **Manual UI**: Interactive test application with all drawer variants

### 6. Performance Considerations

**Decision**: Leverage vaul's optimized animations with careful z-index management  
**Rationale**:

- Vaul uses optimized spring animations for smooth 60fps performance
- Z-index calculation based on drawer order prevents visual conflicts
- React Context optimization to prevent unnecessary re-renders
- Proper cleanup prevents memory leaks in nested drawer scenarios

**Performance Optimizations**:

- Memoized drawer controllers to prevent re-renders
- Efficient z-index calculation: `1000 + drawerIndex`
- Portal-based rendering for optimal DOM structure
- Cleanup handlers for proper resource management

### 7. TypeScript Integration

**Decision**: Full TypeScript support with generic type inference  
**Rationale**:

- Type-safe drawer options and controller props
- Generic type support for `openAsync` return values
- Proper integration with React and vaul types
- Export all necessary types for library consumers

**Type Definitions**:

```typescript
export interface DrawerOptions {
  drawerId?: string;
  snapPoints?: number[];
  direction?: "top" | "bottom" | "left" | "right";
  modal?: boolean;
  dismissible?: boolean;
}

export type DrawerControllerComponent = FC<DrawerControllerProps>;
export type DrawerAsyncControllerComponent<T> = FC<
  DrawerAsyncControllerProps<T>
>;
```

## Implementation Readiness

**Status**: ✅ All research complete - Ready for Phase 1 Design

**Key Decisions Made**:

1. ✅ Architecture: Event-driven overlay-kit pattern with vaul integration
2. ✅ State Management: Extended reducer with drawer-specific state
3. ✅ API Design: Mirror overlay-kit API with drawer options
4. ✅ Testing: Multi-layered approach with manual test UI
5. ✅ Performance: Leverage vaul optimizations with z-index management
6. ✅ Types: Full TypeScript support with generic inference

**No Outstanding Unknowns**: All technical context items resolved
