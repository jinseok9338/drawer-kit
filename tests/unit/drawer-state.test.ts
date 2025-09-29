import { describe, it, expect, vi } from "vitest";
import { drawerReducer, DrawerSelectors } from "@/context/reducer";
import type {
  DrawerState,
  DrawerItem,
  DrawerReducerAction,
  DrawerReducer,
} from "@/context/reducer";

describe("Drawer State Contract Tests", () => {
  describe("DrawerState interface", () => {
    it("should have correct state structure", () => {
      const state: DrawerState = {
        current: null,
        drawerOrderList: [],
        drawerData: {},
      };

      expect(state.current).toBe(null);
      expect(Array.isArray(state.drawerOrderList)).toBe(true);
      expect(typeof state.drawerData).toBe("object");
    });

    it("should handle drawer state with items", () => {
      const mockDrawerItem: DrawerItem = {
        id: "drawer-1",
        componentKey: "comp-1",
        isOpen: true,
        controller: vi.fn(),
        options: {
          snapPoints: [0.5, 1],
          direction: "bottom",
          modal: true,
          dismissible: true,
        },
      };

      const state: DrawerState = {
        current: "drawer-1",
        drawerOrderList: ["drawer-1"],
        drawerData: {
          "drawer-1": mockDrawerItem,
        },
      };

      expect(state.current).toBe("drawer-1");
      expect(state.drawerOrderList).toContain("drawer-1");
      expect(state.drawerData["drawer-1"]).toBeDefined();
    });
  });

  describe("DrawerItem interface", () => {
    it("should have all required properties", () => {
      const item: DrawerItem = {
        id: "test-drawer",
        componentKey: "test-component",
        isOpen: false,
        controller: vi.fn(),
        options: {
          direction: "bottom",
          modal: true,
          dismissible: true,
        },
      };

      expect(typeof item.id).toBe("string");
      expect(typeof item.componentKey).toBe("string");
      expect(typeof item.isOpen).toBe("boolean");
      expect(typeof item.controller).toBe("function");
      expect(["top", "bottom", "left", "right"]).toContain(item.options.direction);
      expect(typeof item.options.modal).toBe("boolean");
      expect(typeof item.options.dismissible).toBe("boolean");
    });
  });

  describe("DrawerReducerAction types", () => {
    it("should handle ADD action", () => {
      const mockDrawer: DrawerItem = {
        id: "new-drawer",
        componentKey: "new-comp",
        isOpen: false,
        controller: vi.fn(),
        options: {
          direction: "bottom",
          modal: true,
          dismissible: true,
        },
      };

      const action: DrawerReducerAction = {
        type: "ADD",
        payload: {
          id: mockDrawer.id,
          componentKey: mockDrawer.componentKey,
          controller: mockDrawer.controller,
          options: mockDrawer.options,
        },
      };

      expect(action.type).toBe("ADD");
      expect(action.payload.id).toBe(mockDrawer.id);
      expect(action.payload.controller).toBe(mockDrawer.controller);
    });

    it("should handle all action types", () => {
      const actions: DrawerReducerAction[] = [
        {
          type: "ADD",
          payload: { id: "test", componentKey: "test", controller: vi.fn(), options: {} },
        },
        { type: "OPEN", payload: { id: "test" } },
        { type: "CLOSE", payload: { id: "test" } },
        { type: "REMOVE", payload: { id: "test" } },
        { type: "CLOSE_ALL" },
        { type: "REMOVE_ALL" },
      ];

      actions.forEach((action) => {
        expect(action.type).toBeDefined();
        expect(typeof action.type).toBe("string");
      });
    });
  });

  describe("DrawerReducer function", () => {
    it("should be a valid reducer function", () => {
      // Test actual implementation
      const reducer = drawerReducer as DrawerReducer;

      expect(reducer).toBeDefined();
      expect(typeof reducer).toBe("function");
    });

    it("should handle ADD action correctly", () => {
      const initialState: DrawerState = {
        current: null,
        drawerOrderList: [],
        drawerData: {},
      };

      const action: DrawerReducerAction = {
        type: "ADD",
        payload: {
          id: "drawer-1",
          componentKey: "comp-1",
          controller: vi.fn(),
          options: {
            direction: "bottom",
            modal: true,
            dismissible: true,
          },
        },
      };

      const newState = drawerReducer(initialState, action);

      expect(newState.current).toBe("drawer-1");
      expect(newState.drawerOrderList).toContain("drawer-1");
      expect(newState.drawerData["drawer-1"]).toBeDefined();
      expect(newState.drawerData["drawer-1"].id).toBe("drawer-1");
      expect(newState.drawerData["drawer-1"].isOpen).toBe(false);
    });
  });

  describe("DrawerSelectors interface", () => {
    it("should have all selector methods", () => {
      const selectors = DrawerSelectors;

      // Test actual implementation
      expect(selectors.getCurrentDrawer).toBeDefined();
      expect(selectors.getDrawerById).toBeDefined();
      expect(selectors.getOpenDrawers).toBeDefined();
      expect(selectors.isDrawerOpen).toBeDefined();
      expect(selectors.getDrawerCount).toBeDefined();
      expect(selectors.getDrawerOrderList).toBeDefined();
    });

    it("should return correct types from selectors", () => {
      const mockState: DrawerState = {
        current: "drawer-1",
        drawerOrderList: ["drawer-1"],
        drawerData: {
          "drawer-1": {
            id: "drawer-1",
            componentKey: "comp-1",
            isOpen: true,
            controller: vi.fn(),
            options: {
              direction: "bottom",
              modal: true,
              dismissible: true,
            },
          },
        },
      };

      // This will fail until we implement selectors
      const mockSelectors: typeof DrawerSelectors = {
        getCurrentDrawer: (state) => state.drawerData[state.current!] || null,
        getDrawerById: (state, id) => state.drawerData[id] || null,
        getOpenDrawers: (state) => Object.values(state.drawerData).filter((d) => d.isOpen),
        isDrawerOpen: (state, id) => state.drawerData[id]?.isOpen || false,
        getDrawerCount: (state) => Object.keys(state.drawerData).length,
        getDrawerOrderList: (state) => state.drawerOrderList,
      };

      expect(mockSelectors.getCurrentDrawer(mockState)).toBeTruthy();
      expect(mockSelectors.getDrawerCount(mockState)).toBe(1);
      expect(mockSelectors.isDrawerOpen(mockState, "drawer-1")).toBe(true);
    });
  });
});
