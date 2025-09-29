# Quickstart Guide: Drawer-Kit

**Date**: September 28, 2025  
**Feature**: Drawer-Kit Library  
**Phase**: 1 - Quick Start Integration

## Installation

```bash
npm install drawer-kit
# or
pnpm add drawer-kit
# or
yarn add drawer-kit
```

## Basic Setup

### 1. Wrap your app with DrawerProvider

```tsx
import React from "react";
import { DrawerProvider } from "drawer-kit";

function App() {
  return (
    <DrawerProvider>
      <YourAppContent />
    </DrawerProvider>
  );
}
```

### 2. Basic Drawer Usage

```tsx
import React from "react";
import { drawer } from "drawer-kit";

function MyComponent() {
  const handleOpenDrawer = () => {
    drawer.open(({ isOpen, close }) => (
      <div className="drawer-content">
        <h2>Simple Drawer</h2>
        <p>This is a basic drawer example</p>
        <button onClick={close}>Close</button>
      </div>
    ));
  };

  return <button onClick={handleOpenDrawer}>Open Drawer</button>;
}
```

### 3. Async Drawer with Result

```tsx
import React from "react";
import { drawer } from "drawer-kit";

function ConfirmationExample() {
  const handleConfirmAction = async () => {
    const result = await drawer.openAsync<boolean>(({ isOpen, close }) => (
      <div className="confirmation-drawer">
        <h3>Confirm Action</h3>
        <p>Are you sure you want to proceed?</p>
        <div className="buttons">
          <button onClick={() => close(true)}>Yes</button>
          <button onClick={() => close(false)}>No</button>
        </div>
      </div>
    ));

    console.log("User chose:", result); // true or false
  };

  return <button onClick={handleConfirmAction}>Show Confirmation</button>;
}
```

## Advanced Features

### 4. Drawer with Snap Points

```tsx
import React from "react";
import { drawer } from "drawer-kit";

function SnapPointsExample() {
  const openSnapDrawer = () => {
    drawer.open(
      ({ isOpen, close }) => (
        <div className="snap-drawer">
          <div className="handle" />
          <h2>Snap Points Drawer</h2>
          <p>Drag to different snap positions</p>
          <button onClick={close}>Close</button>
        </div>
      ),
      {
        snapPoints: [0.2, 0.5, 0.8], // 20%, 50%, 80% of screen height
        direction: "bottom",
      }
    );
  };

  return <button onClick={openSnapDrawer}>Open Snap Drawer</button>;
}
```

### 5. Different Directions

```tsx
import React from "react";
import { drawer } from "drawer-kit";

function DirectionExamples() {
  const openFromTop = () => {
    drawer.open(({ close }) => <div>Top Drawer Content</div>, {
      direction: "top",
    });
  };

  const openFromLeft = () => {
    drawer.open(({ close }) => <div>Left Drawer Content</div>, {
      direction: "left",
    });
  };

  const openFromRight = () => {
    drawer.open(({ close }) => <div>Right Drawer Content</div>, {
      direction: "right",
    });
  };

  return (
    <div>
      <button onClick={openFromTop}>Top</button>
      <button onClick={openFromLeft}>Left</button>
      <button onClick={openFromRight}>Right</button>
    </div>
  );
}
```

### 6. Nested Drawers

```tsx
import React from "react";
import { drawer } from "drawer-kit";

function NestedDrawerExample() {
  const openFirstDrawer = () => {
    drawer.open(({ close }) => (
      <div className="first-drawer">
        <h2>First Drawer</h2>
        <button onClick={openSecondDrawer}>Open Second Drawer</button>
        <button onClick={close}>Close</button>
      </div>
    ));
  };

  const openSecondDrawer = () => {
    drawer.open(({ close }) => (
      <div className="second-drawer">
        <h3>Second Drawer (on top)</h3>
        <button onClick={close}>Close This</button>
      </div>
    ));
  };

  return <button onClick={openFirstDrawer}>Open Nested Drawers</button>;
}
```

### 7. Non-Modal Drawer

```tsx
import React from "react";
import { drawer } from "drawer-kit";

function NonModalExample() {
  const openNonModalDrawer = () => {
    drawer.open(
      ({ close }) => (
        <div className="non-modal-drawer">
          <h2>Non-Modal Drawer</h2>
          <p>Background is still interactive</p>
          <button onClick={close}>Close</button>
        </div>
      ),
      {
        modal: false, // Background remains interactive
        dismissible: false, // Cannot be dismissed by clicking outside
      }
    );
  };

  return <button onClick={openNonModalDrawer}>Open Non-Modal Drawer</button>;
}
```

## Testing Scenarios

### Integration Test Scenarios

These scenarios should be validated during testing:

1. **Basic Drawer Lifecycle**

   - Open drawer → Drawer appears with animation
   - Close drawer → Drawer disappears with animation
   - Unmount drawer → Component removed from memory

2. **Async Drawer Flow**

   - Open async drawer → Promise created
   - Close with result → Promise resolves with correct value
   - Multiple async drawers → Each resolves independently

3. **Nested Drawer Management**

   - Open first drawer → Appears at z-index 1000
   - Open second drawer → Appears at z-index 1001 (on top)
   - Close second drawer → First drawer becomes active again
   - Close first drawer → All drawers closed

4. **Edge Cases**

   - Rapid open/close → No memory leaks
   - Multiple same-content drawers → Each has unique ID
   - closeAll() with nested drawers → All close in proper order

5. **Vaul Integration**
   - Snap points work correctly
   - Different directions render properly
   - Modal/non-modal behavior functions as expected
   - Gesture dismissal works when enabled

## Performance Validation

Expected performance benchmarks:

- Drawer open/close: < 100ms response time
- Animation: 60fps during transitions
- Memory: No leaks after drawer unmount
- Nested drawers: Smooth stacking without lag

## Migration from Vaul

If migrating from direct vaul usage:

```tsx
// Before (direct vaul)
<Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
  <Drawer.Portal>
    <Drawer.Overlay />
    <Drawer.Content>
      <YourContent />
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>;

// After (drawer-kit)
drawer.open(({ isOpen, close }) => <YourContent onClose={close} />, {
  // All vaul options still available
  snapPoints: [0.5, 1],
  direction: "bottom",
  modal: true,
});
```


