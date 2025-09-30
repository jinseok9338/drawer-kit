# 🎯 Drawer-Kit

> **Declarative drawer management for React** inspired by [toss/overlay-kit](https://github.com/toss/overlay-kit)

A powerful and flexible React library for managing drawer components with a simple, declarative API. Built on top of [vaul](https://vaul.dev/) and inspired by the elegant design of toss/overlay-kit.

[![npm version](https://badge.fury.io/js/drawer-kit.svg)](https://badge.fury.io/js/drawer-kit)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎨 **Declarative API** - Simple and intuitive drawer management
- 🚀 **TypeScript First** - Full TypeScript support with excellent DX
- 📱 **Mobile Optimized** - Built on vaul for smooth mobile interactions
- 🎭 **Multiple Directions** - Support for top, bottom, left, and right drawers
- 🔄 **Async Support** - Promise-based drawer interactions
- 🎪 **Event System** - Rich event callbacks for drawer lifecycle

## 📦 Installation

```bash
npm install drawer-kit
# or
yarn add drawer-kit
# or
pnpm add drawer-kit
```

## 🚀 Quick Start

### 1. Setup Provider

Wrap your app with the `DrawerProvider`:

```tsx
import { DrawerProvider } from "drawer-kit";

function App() {
  return (
    <DrawerProvider>
      <YourApp />
    </DrawerProvider>
  );
}
```

### 2. Basic Usage

```tsx
import { drawer } from "drawer-kit";

function MyComponent() {
  const openDrawer = () => {
    drawer.open(({ close, unmount }) => (
      <div style={{ padding: "20px" }}>
        <h2>Hello from Drawer!</h2>
        <p>This is a simple drawer example.</p>
        <button onClick={close}>Close</button>
        <button onClick={unmount}>Unmount</button>
      </div>
    ));
  };

  return <button onClick={openDrawer}>Open Drawer</button>;
}
```

### 3. Async Drawer

```tsx
import { drawer } from "drawer-kit";

function MyComponent() {
  const openAsyncDrawer = async () => {
    try {
      const result = await drawer.openAsync(({ close, unmount }) => (
        <div style={{ padding: "20px" }}>
          <h2>Confirm Action</h2>
          <p>Are you sure you want to proceed?</p>
          <button onClick={() => close("confirmed")}>Yes</button>
          <button onClick={() => close("cancelled")}>No</button>
        </div>
      ));

      console.log("User choice:", result); // 'confirmed' or 'cancelled'
    } catch (error) {
      console.log("Drawer was cancelled");
    }
  };

  return <button onClick={openAsyncDrawer}>Open Async Drawer</button>;
}
```

## 📚 API Reference

### Core API

#### `drawer.open(controller, options?)`

Opens a drawer with the given controller component.

```tsx
const drawerId = drawer.open(MyDrawerComponent, {
  direction: "bottom",
  modal: true,
  dismissible: true,
});
```

#### `drawer.openAsync(controller, options?)`

Opens a drawer and returns a Promise that resolves with the result.

```tsx
const result = await drawer.openAsync(MyAsyncDrawerComponent, {
  direction: "right",
  modal: false,
});
```

#### `drawer.close(drawerId)`

Closes a specific drawer by ID.

```tsx
drawer.close("drawer-123");
```

#### `drawer.unmount(drawerId)`

Unmounts a specific drawer by ID.

```tsx
drawer.unmount("drawer-123");
```

#### `drawer.closeAll()`

Closes all open drawers.

```tsx
drawer.closeAll();
```

#### `drawer.unmountAll()`

Unmounts all open drawers.

```tsx
drawer.unmountAll();
```

### DrawerOptions

| Option             | Type                                     | Default         | Description                                                         |
| ------------------ | ---------------------------------------- | --------------- | ------------------------------------------------------------------- |
| `direction`        | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'`      | Direction from which the drawer opens                               |
| `modal`            | `boolean`                                | `true`          | Whether the drawer is modal (blocks background interaction)         |
| `dismissible`      | `boolean`                                | `true`          | Whether the drawer can be dismissed by dragging or clicking outside |
| `container`        | `HTMLElement`                            | `document.body` | Container element for the drawer portal                             |
| `repositionInputs` | `boolean`                                | `false`         | Whether to reposition inputs when keyboard appears                  |
| `onOpenChange`     | `(open: boolean) => void`                | -               | Callback when drawer open state changes                             |
| `onClose`          | `() => void`                             | -               | Callback when drawer is closed                                      |
| `onAnimationEnd`   | `(open: boolean) => void`                | -               | Callback when drawer animation ends                                 |

### Controller Props

The controller component receives these props:

```tsx
interface DrawerControllerProps {
  isOpen: boolean; // Current open state
  close: () => void; // Function to close the drawer
  unmount: () => void; // Function to unmount the drawer
}

// For async drawers
interface DrawerAsyncControllerProps<T> {
  isOpen: boolean;
  close: (result: T) => void; // Function to close with result
  unmount: () => void;
}
```

## 🎨 Examples

### Direction Examples

```tsx
// Bottom drawer (default)
drawer.open(MyComponent, { direction: "bottom" });

// Top drawer
drawer.open(MyComponent, { direction: "top" });

// Left drawer
drawer.open(MyComponent, { direction: "left" });

// Right drawer
drawer.open(MyComponent, { direction: "right" });
```

### Modal vs Non-Modal

```tsx
// Modal drawer (blocks background interaction)
drawer.open(MyComponent, { modal: true });

// Non-modal drawer (allows background interaction)
drawer.open(MyComponent, { modal: false });
```

### Event Callbacks

```tsx
drawer.open(MyComponent, {
  onOpenChange: (open) => {
    console.log("Drawer is now:", open ? "open" : "closed");
  },
  onClose: () => {
    console.log("Drawer was closed");
  },
  onAnimationEnd: (open) => {
    console.log("Animation finished, drawer is:", open ? "open" : "closed");
  },
});
```

### Non-Dismissible Drawer

```tsx
drawer.open(MyComponent, {
  dismissible: false, // Cannot be closed by clicking outside or dragging
  direction: "bottom",
});
```

### Input Repositioning

```tsx
drawer.open(MyComponent, {
  repositionInputs: true, // Repositions inputs when keyboard appears
  direction: "bottom",
});
```

## 🧪 Testing

The library includes comprehensive test utilities:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { drawer } from "drawer-kit";

test("opens and closes drawer", () => {
  const TestComponent = () => (
    <button
      onClick={() =>
        drawer.open(({ close }) => (
          <div>
            <h1>Test Drawer</h1>
            <button onClick={close}>Close</button>
          </div>
        ))
      }
    >
      Open Drawer
    </button>
  );

  render(<TestComponent />);

  fireEvent.click(screen.getByText("Open Drawer"));
  expect(screen.getByText("Test Drawer")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Close"));
  expect(screen.queryByText("Test Drawer")).not.toBeInTheDocument();
});
```

## 🎯 Advanced Usage

### Custom Container

```tsx
const customContainer = document.getElementById("drawer-container");

drawer.open(MyComponent, {
  container: customContainer,
});
```

### Multiple Drawers

```tsx
// Open multiple drawers
const drawer1 = drawer.open(Component1, { direction: "bottom" });
const drawer2 = drawer.open(Component2, { direction: "right" });

// Close specific drawer
drawer.close(drawer1);

// Close all drawers
drawer.closeAll();
```

### Complex Async Flow

```tsx
const handleComplexFlow = async () => {
  try {
    // First drawer - get user confirmation
    const confirmed = await drawer.openAsync(({ close }) => (
      <div>
        <h2>Delete Item</h2>
        <p>Are you sure you want to delete this item?</p>
        <button onClick={() => close(true)}>Yes, Delete</button>
        <button onClick={() => close(false)}>Cancel</button>
      </div>
    ));

    if (!confirmed) return;

    // Second drawer - show progress
    const progressDrawer = drawer.open(({ close }) => (
      <div>
        <h2>Deleting...</h2>
        <div>Please wait while we delete the item.</div>
        <button onClick={close}>Close</button>
      </div>
    ));

    // Simulate async operation
    await deleteItem();
    drawer.close(progressDrawer);

    // Third drawer - show success
    await drawer.openAsync(({ close }) => (
      <div>
        <h2>Success!</h2>
        <p>Item has been deleted successfully.</p>
        <button onClick={() => close()}>OK</button>
      </div>
    ));
  } catch (error) {
    console.error("Operation cancelled:", error);
  }
};
```

## 🎨 Styling

Drawer-kit provides sensible defaults but allows full customization:

```css
/* Custom drawer styles */
[data-vaul-drawer] {
  background-color: white;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
}

[data-vaul-overlay] {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Direction-specific styles */
[data-vaul-drawer][data-vaul-drawer-direction="left"] {
  border-radius: 0 12px 12px 0;
}

[data-vaul-drawer][data-vaul-drawer-direction="right"] {
  border-radius: 12px 0 0 12px;
}
```

## 🔧 Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/drawer-kit.git
cd drawer-kit

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build library
pnpm build
```

### Project Structure

```
src/
├── drawer-kit/           # Main library code
│   ├── components/       # React components
│   ├── context/         # React context and hooks
│   ├── events/          # Event system
│   ├── types/           # TypeScript definitions
│   └── utils/           # Utility functions
├── test-ui/             # Development test UI
└── tests/               # Test files
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [toss/overlay-kit](https://github.com/toss/overlay-kit) - For the elegant API design inspiration
- [vaul](https://vaul.dev/) - For the smooth drawer animations and mobile interactions
- [React](https://reactjs.org/) - For the amazing framework
- [TypeScript](https://www.typescriptlang.org/) - For the type safety

## 📞 Support

- 📧 Email: support@drawer-kit.dev
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/drawer-kit/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/drawer-kit/discussions)

---

<div align="center">
  <p>Made with ❤️ by the Drawer-Kit team</p>
  <p>
    <a href="https://github.com/your-username/drawer-kit">⭐ Star us on GitHub</a>
    •
    <a href="https://twitter.com/drawer_kit">🐦 Follow us on Twitter</a>
    •
    <a href="https://discord.gg/drawer-kit">💬 Join our Discord</a>
  </p>
</div>
```
