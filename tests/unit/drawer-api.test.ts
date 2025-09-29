import { describe, it, expect, vi } from "vitest";
import { drawer } from "@/index";
import type {
  DrawerAPI,
  DrawerOptions,
  OpenDrawerOptions,
  DrawerControllerProps,
  DrawerAsyncControllerProps,
  DrawerControllerComponent,
  DrawerAsyncControllerComponent,
} from "@/types";

describe("Drawer API Contract Tests", () => {
  describe("DrawerAPI interface", () => {
    it("should have all required methods", () => {
      // Test the actual drawer implementation
      const drawerAPI = drawer as DrawerAPI;

      expect(drawerAPI.open).toBeDefined();
      expect(drawerAPI.openAsync).toBeDefined();
      expect(drawerAPI.close).toBeDefined();
      expect(drawerAPI.closeAll).toBeDefined();
      expect(drawerAPI.unmount).toBeDefined();
      expect(drawerAPI.unmountAll).toBeDefined();

      expect(typeof drawerAPI.open).toBe("function");
      expect(typeof drawerAPI.openAsync).toBe("function");
      expect(typeof drawerAPI.close).toBe("function");
      expect(typeof drawerAPI.closeAll).toBe("function");
      expect(typeof drawerAPI.unmount).toBe("function");
      expect(typeof drawerAPI.unmountAll).toBe("function");
    });

    it("should return drawer ID from open method", () => {
      const mockController: DrawerControllerComponent = vi.fn();

      // Test actual implementation
      const drawerId = drawer.open(mockController);
      expect(typeof drawerId).toBe("string");
      expect(drawerId.length).toBeGreaterThan(0);
    });

    it("should return Promise from openAsync method", async () => {
      const mockController: DrawerAsyncControllerComponent<boolean> = vi.fn();

      // Test actual implementation
      const promise = drawer.openAsync(mockController);
      expect(promise).toBeInstanceOf(Promise);
    });
  });

  describe("DrawerControllerProps interface", () => {
    it("should have required props", () => {
      const props: DrawerControllerProps = {
        isOpen: true,
        close: vi.fn(),
        unmount: vi.fn(),
      };

      expect(props.isOpen).toBe(true);
      expect(typeof props.close).toBe("function");
      expect(typeof props.unmount).toBe("function");
    });
  });

  describe("DrawerAsyncControllerProps interface", () => {
    it("should have required props with typed close function", () => {
      const props: DrawerAsyncControllerProps<string> = {
        isOpen: true,
        close: vi.fn(),
        unmount: vi.fn(),
      };

      expect(props.isOpen).toBe(true);
      expect(typeof props.close).toBe("function");
      expect(typeof props.unmount).toBe("function");
    });
  });
});
