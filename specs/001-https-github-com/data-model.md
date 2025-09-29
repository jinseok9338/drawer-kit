# Data Model: Drawer-Kit Library

**Date**: September 28, 2025  
**Feature**: Drawer-Kit Library  
**Phase**: 1 - Design & Contracts

## Core Entities

### DrawerItem

**Purpose**: Represents a single drawer instance in the system  
**Extends**: OverlayItem from overlay-kit

```typescript
interface DrawerItem {
  // Inherited from OverlayItem
  id: DrawerId; // Unique drawer identifier
  componentKey: string; // React key for component rendering
  isOpen: boolean; // Current open/closed state
  isMounted: boolean; // Mount state for lifecycle management
  controller: DrawerControllerComponent; // Drawer UI controller function

  // Drawer-specific properties
  snapPoints?: number[]; // Vaul snap positions (0-1 range)
  direction: DrawerDirection; // Drawer slide direction
  modal: boolean; // Modal vs non-modal behavior
  dismissible: boolean; // Can be dismissed by user interaction
  zIndex: number; // Stacking order for nested drawers
}
```

**Validation Rules**:

- `id` must be unique within drawer system
- `snapPoints` values must be between 0 and 1
- `zIndex` calculated as `1000 + drawerIndex`
- `direction` must be valid DrawerDirection enum value

**State Transitions**:

```
UNMOUNTED → ADD → MOUNTED(isOpen: false, isMounted: false)
MOUNTED → OPEN → ACTIVE(isOpen: true, isMounted: true)
ACTIVE → CLOSE → MOUNTED(isOpen: false, isMounted: true)
MOUNTED → REMOVE → UNMOUNTED
```

### DrawerState

**Purpose**: Global state container for all drawer instances

```typescript
interface DrawerState {
  current: DrawerId | null; // Currently active (topmost) drawer
  drawerOrderList: DrawerId[]; // Order of drawer creation/stacking
  drawerData: Record<DrawerId, DrawerItem>; // Map of all drawer instances
}
```

**Business Rules**:

- `current` always points to the last opened drawer
- `drawerOrderList` maintains creation order for z-index calculation
- `drawerData` is the single source of truth for drawer state

### DrawerOptions

**Purpose**: Configuration options for drawer creation

```typescript
interface DrawerOptions {
  drawerId?: string; // Optional custom drawer ID
  snapPoints?: number[]; // Snap positions for drawer height
  direction?: DrawerDirection; // Slide direction (default: 'bottom')
  modal?: boolean; // Modal behavior (default: true)
  dismissible?: boolean; // User dismissible (default: true)
}
```

**Default Values**:

- `drawerId`: Auto-generated UUID if not provided
- `direction`: 'bottom'
- `modal`: true
- `dismissible`: true

### DrawerControllerProps

**Purpose**: Props passed to drawer controller components

```typescript
interface DrawerControllerProps {
  drawerId: string; // Drawer instance identifier
  isOpen: boolean; // Current open state
  close: () => void; // Function to close drawer
  unmount: () => void; // Function to unmount drawer
}

interface DrawerAsyncControllerProps<T> {
  drawerId: string; // Drawer instance identifier
  isOpen: boolean; // Current open state
  close: (result: T) => void; // Function to close with result
  unmount: () => void; // Function to unmount drawer
}
```

## Type Definitions

### Enums and Union Types

```typescript
type DrawerId = string;

type DrawerDirection = "top" | "bottom" | "left" | "right";

type DrawerControllerComponent = FC<DrawerControllerProps>;

type DrawerAsyncControllerComponent<T> = FC<DrawerAsyncControllerProps<T>>;
```

### Action Types

```typescript
type DrawerReducerAction =
  | { type: "ADD"; drawer: DrawerItem }
  | { type: "OPEN"; drawerId: string }
  | { type: "CLOSE"; drawerId: string }
  | { type: "REMOVE"; drawerId: string }
  | { type: "SNAP_TO"; drawerId: string; snapIndex: number }
  | { type: "CLOSE_ALL" }
  | { type: "REMOVE_ALL" };
```

## Entity Relationships

```
DrawerState (1) ──┬── (N) DrawerItem
                  │
                  └── current: DrawerId (0..1)

DrawerItem (1) ──── (1) DrawerControllerComponent

DrawerOptions (1) ──── (0..1) DrawerItem (during creation)
```

## Validation Rules

### DrawerItem Validation

- `id` must be non-empty string
- `snapPoints` array values must be in range [0, 1]
- `direction` must be valid enum value
- `zIndex` must be positive integer
- `controller` must be valid React component

### DrawerState Validation

- `current` must exist in `drawerData` if not null
- `drawerOrderList` must contain only valid drawer IDs
- All drawer IDs in `drawerOrderList` must exist in `drawerData`

### DrawerOptions Validation

- `snapPoints` must be sorted in ascending order
- `snapPoints` must contain unique values
- Custom `drawerId` must not conflict with existing drawers

## Performance Considerations

### Memory Management

- Automatic cleanup of unmounted drawers from `drawerData`
- Event listener cleanup on drawer unmount
- React component memoization for drawer controllers

### Rendering Optimization

- Z-index calculation cached during render
- Portal-based rendering to avoid layout thrashing
- Conditional rendering based on `isOpen` and `isMounted` states

### State Update Optimization

- Immutable state updates for React optimization
- Batch state updates where possible
- Minimal re-renders through proper dependency arrays
