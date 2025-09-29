# Tasks: Drawer-Kit Library

**Input**: Design documents from `/specs/001-https-github-com/`
**Prerequisites**: plan.md (✅), research.md (✅), data-model.md (✅), contracts/ (✅), quickstart.md (✅)

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → ✅ COMPLETE: TypeScript + React 19.1.1, vaul integration, test UI required
2. Load optional design documents:
   → ✅ data-model.md: DrawerItem, DrawerState, DrawerOptions entities
   → ✅ contracts/: 3 contract files (api, events, state)
   → ✅ research.md: Event-driven architecture, vaul wrapper pattern
3. Generate tasks by category:
   → ✅ Setup: TypeScript library + test UI
   → ✅ Tests: Contract tests + integration scenarios
   → ✅ Core: Context, reducer, event system, vaul integration
   → ✅ Integration: Provider setup, hook exports
   → ✅ Polish: Documentation, performance validation
4. Apply task rules:
   → ✅ Different files marked [P] for parallel execution
   → ✅ Tests before implementation (TDD approach)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness: All contracts tested, all entities implemented
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Library project**: `src/drawer-kit/`, `src/test-ui/`, `tests/` at repository root
- TypeScript configuration and build setup at root level

## Phase 3.1: Setup

- [x] **T001** Create project structure per implementation plan
  - Create `src/drawer-kit/` with subdirectories: `context/`, `hooks/`, `types/`, `utils/`
  - Create `src/test-ui/` with subdirectories: `components/`, `examples/`
  - Create `tests/` with subdirectories: `unit/`, `integration/`, `e2e/`
  - Create `docs/` directory

- [x] **T002** Initialize TypeScript library project with React 19 dependencies
  - Configure `tsconfig.json` for library build
  - Install dependencies: React 19.1.1, vaul 1.1.2, TypeScript 5.4+
  - Set up build tooling (tsup or similar)

- [x] **T003** [P] Configure testing framework with Vitest and React Testing Library
  - Install Vitest, @testing-library/react, jsdom
  - Create `vitest.config.ts` with React testing setup
  - Configure test scripts in package.json

- [x] **T004** [P] Configure linting and formatting tools
  - Set up ESLint with TypeScript and React rules
  - Configure Prettier for code formatting
  - Add pre-commit hooks

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] **T005** [P] Contract test for drawer-api.ts interfaces in `tests/unit/drawer-api.test.ts`
  - Test DrawerAPI interface compliance
  - Test DrawerOptions type validation
  - Test DrawerControllerProps interface

- [x] **T006** [P] Contract test for drawer-events.ts system in `tests/unit/drawer-events.test.ts`
  - Test DrawerEvent interface
  - Test event emitter contract
  - Test external event system integration

- [x] **T007** [P] Contract test for drawer-state.ts management in `tests/unit/drawer-state.test.ts`
  - Test DrawerState interface
  - Test DrawerReducerAction types
  - Test state selectors contract

- [x] **T008** [P] Integration test for basic drawer lifecycle in `tests/integration/drawer-lifecycle.test.ts`
  - Test drawer open → appears with animation
  - Test drawer close → disappears with animation
  - Test drawer unmount → component removed from memory

- [x] **T009** [P] Integration test for async drawer flow in `tests/integration/async-drawer.test.ts`
  - Test async drawer → Promise created
  - Test close with result → Promise resolves correctly
  - Test multiple async drawers → Each resolves independently

- [x] **T010** [P] Integration test for nested drawer management in `tests/integration/nested-drawers.test.ts`
  - Test first drawer → appears at z-index 1000
  - Test second drawer → appears at z-index 1001 (on top)
  - Test close second → first becomes active again
  - Test closeAll() → all close in proper order

- [x] **T011** [P] Integration test for vaul integration features in `tests/integration/vaul-integration.test.ts`
  - Test snap points functionality
  - Test different directions (top, bottom, left, right)
  - Test modal/non-modal behavior
  - Test gesture dismissal when enabled

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [ ] **T012** [P] TypeScript definitions in `src/drawer-kit/types/index.ts`
  - Implement DrawerId, DrawerDirection types
  - Implement DrawerOptions, DrawerControllerProps interfaces
  - Export all public types

- [ ] **T013** [P] Event system utilities in `src/drawer-kit/utils/events.ts`
  - Port createUseExternalEvents from overlay-kit
  - Implement drawer-specific event emitter
  - Add random ID generation utility

- [ ] **T014** [P] Drawer state reducer in `src/drawer-kit/context/reducer.ts`
  - Implement drawerReducer function
  - Add determineCurrentDrawerId logic for nested drawers
  - Handle ADD, OPEN, CLOSE, REMOVE, SNAP_TO, CLOSE_ALL, REMOVE_ALL actions

- [ ] **T015** Drawer context and provider in `src/drawer-kit/context/provider.tsx`
  - Create DrawerProvider component using useReducer
  - Implement drawer event handlers (open, close, unmount, etc.)
  - Integrate with external event system
  - Handle z-index calculation and drawer ordering

- [ ] **T016** Vaul integration wrapper in `src/drawer-kit/context/drawer-controller.tsx`
  - Create ContentDrawerController component
  - Wrap vaul Drawer components (Root, Portal, Overlay, Content)
  - Map drawer-kit props to vaul props
  - Handle drawer lifecycle with vaul callbacks

- [ ] **T017** Main drawer API in `src/drawer-kit/index.ts`
  - Implement createDrawer function
  - Export drawer object with open, openAsync, close, closeAll, unmount, unmountAll
  - Implement Promise-based openAsync functionality
  - Export DrawerProvider and utility hooks

- [ ] **T018** Custom hooks in `src/drawer-kit/hooks/index.ts`
  - Implement useCurrentDrawer hook
  - Implement useDrawerData hook
  - Add drawer state selector hooks

## Phase 3.4: Integration

- [ ] **T019** Provider integration and context setup
  - Connect DrawerProvider to React context system
  - Ensure proper cleanup on unmount
  - Handle SSR compatibility

- [ ] **T020** Performance optimization
  - Add React.memo for drawer controllers
  - Optimize re-render patterns
  - Implement efficient z-index calculation

- [ ] **T021** Error handling and validation
  - Add input validation for drawer options
  - Handle edge cases (rapid open/close, invalid snap points)
  - Add proper error messages

## Phase 3.5: Manual Test UI

- [ ] **T022** [P] Test UI application setup in `src/test-ui/App.tsx`
  - Create React app with DrawerProvider
  - Set up routing for different test scenarios
  - Add basic styling and navigation

- [ ] **T023** [P] Basic drawer examples in `src/test-ui/examples/BasicDrawer.tsx`
  - Simple drawer open/close example
  - Async drawer with result example
  - Different directions examples

- [ ] **T024** [P] Advanced drawer examples in `src/test-ui/examples/AdvancedDrawer.tsx`
  - Snap points drawer example
  - Nested drawers example
  - Non-modal drawer example

- [ ] **T025** [P] Test scenario components in `src/test-ui/components/TestScenarios.tsx`
  - Edge case testing (rapid open/close)
  - Performance testing interface
  - Memory leak detection helpers

## Phase 3.6: Polish

- [ ] **T026** [P] Unit tests for utilities in `tests/unit/utils.test.ts`
  - Test event system utilities
  - Test ID generation
  - Test validation helpers

- [ ] **T027** [P] Performance validation tests in `tests/e2e/performance.test.ts`
  - Validate <100ms drawer open/close response
  - Test 60fps animation performance
  - Memory leak detection after drawer unmount

- [ ] **T028** [P] English documentation in `docs/README.md`
  - API reference documentation
  - Usage examples and patterns
  - Migration guide from vaul

- [ ] **T029** [P] Korean documentation in `docs/README-ko.md`
  - Translate API documentation to Korean
  - Korean usage examples
  - Korean migration guide

- [ ] **T030** Build configuration and npm package setup
  - Configure build pipeline for library distribution
  - Set up package.json for npm publishing
  - Generate TypeScript declaration files

- [ ] **T031** Manual testing validation
  - Run through all quickstart.md scenarios
  - Validate all test UI examples work correctly
  - Performance benchmark validation

## Dependencies

**Critical Path**:

- Setup (T001-T004) before everything
- Tests (T005-T011) before implementation (T012-T018)
- Core types (T012) before context (T015) and API (T017)
- Reducer (T014) before provider (T015)
- Provider (T015) before drawer controller (T016)
- All core implementation before integration (T019-T021)
- Core complete before test UI (T022-T025)
- Everything before polish (T026-T031)

**Parallel Opportunities**:

- T003, T004 can run together (different configs)
- T005-T011 can all run in parallel (different test files)
- T012, T013, T014 can run in parallel (different core files)
- T018 can run parallel with T019-T021 (different concerns)
- T022-T025 can run in parallel (different test UI files)
- T026-T029 can run in parallel (different documentation)

## Parallel Example

```bash
# Launch contract tests together (T005-T007):
Task: "Contract test for drawer-api.ts interfaces in tests/unit/drawer-api.test.ts"
Task: "Contract test for drawer-events.ts system in tests/unit/drawer-events.test.ts"
Task: "Contract test for drawer-state.ts management in tests/unit/drawer-state.test.ts"

# Launch integration tests together (T008-T011):
Task: "Integration test for basic drawer lifecycle in tests/integration/drawer-lifecycle.test.ts"
Task: "Integration test for async drawer flow in tests/integration/async-drawer.test.ts"
Task: "Integration test for nested drawer management in tests/integration/nested-drawers.test.ts"
Task: "Integration test for vaul integration features in tests/integration/vaul-integration.test.ts"

# Launch core implementation together (T012-T014):
Task: "TypeScript definitions in src/drawer-kit/types/index.ts"
Task: "Event system utilities in src/drawer-kit/utils/events.ts"
Task: "Drawer state reducer in src/drawer-kit/context/reducer.ts"
```

## Notes

- [P] tasks = different files, no dependencies
- Verify all tests fail before implementing (TDD approach)
- Commit after each task completion
- Test UI is critical for manual verification as requested
- Focus on React 19 compatibility throughout

## Task Generation Rules Applied

1. **From Contracts**: 3 contract files → 3 contract test tasks [P] (T005-T007)
2. **From Data Model**: 3 entities → 3 core implementation tasks [P] (T012-T014)
3. **From User Stories**: 4 quickstart scenarios → 4 integration test tasks [P] (T008-T011)
4. **From Requirements**: Test UI requirement → dedicated test UI tasks (T022-T025)
5. **Ordering**: Setup → Tests → Models → Services → Integration → Polish

## Validation Checklist

- [x] All contracts have corresponding tests (T005-T007)
- [x] All entities have model tasks (T012-T014, T015-T017)
- [x] All tests come before implementation (T005-T011 before T012-T018)
- [x] Parallel tasks truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Test UI included as requested by user
- [x] Comprehensive testing coverage planned
