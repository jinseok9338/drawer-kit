# 🤝 Contributing Guide

Thank you for your interest in contributing to the Drawer-Kit project! This document provides guidelines for contributing to the project.

## 📋 Table of Contents

- [Development Environment Setup](#development-environment-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Style](#coding-style)
- [Testing](#testing)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Issue Reporting](#issue-reporting)
- [Types of Contributions](#types-of-contributions)

## 🛠 Development Environment Setup

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **pnpm**: 8.0.0 or higher (recommended) or npm 9.0.0 or higher
- **Git**: 2.30.0 or higher

### Initial Setup

1. **Fork and Clone Repository**

   ```bash
   # After forking the repository on GitHub
   git clone https://github.com/jinseok9338/drawer-kit.git
   cd drawer-kit
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start Development Server**

   ```bash
   # Main library development
   pnpm dev

   # Test UI development
   pnpm dev:test-ui
   ```

4. **Run Tests**

   ```bash
   # Run all tests
   pnpm test

   # Run with test UI
   pnpm test:ui

   # Run with coverage
   pnpm test:coverage
   ```

5. **Linting and Formatting**

   ```bash
   # Run linting
   pnpm lint

   # Code formatting (Prettier)
   pnpm format
   ```

## 📁 Project Structure

```
drawer-kit/
├── src/
│   ├── drawer-kit/           # Main library code
│   │   ├── components/       # React components
│   │   │   ├── DrawerController.tsx
│   │   │   └── index.css
│   │   ├── context/          # React Context and Hooks
│   │   │   ├── context.ts
│   │   │   ├── hooks.ts
│   │   │   ├── provider.tsx
│   │   │   └── reducer.ts
│   │   ├── events/           # Event system
│   │   │   └── index.ts
│   │   ├── hooks/            # Custom hooks
│   │   ├── types/            # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── utils/            # Utility functions
│   │   └── index.ts          # Main entry point
│   ├── test-ui/              # Development and test UI
│   │   ├── components/
│   │   └── examples/
│   └── tests/                # Test files
│       ├── unit/             # Unit tests
│       ├── integration/      # Integration tests
│       └── e2e/              # E2E tests
├── tests/                    # Test setup and utilities
├── public/                   # Static files
└── docs/                     # Documentation (to be added)
```

## 🔄 Development Workflow

### 1. Branch Strategy

- **main**: Stable production branch
- **develop**: Development branch (to be added)
- **feature/**: New feature development
- **fix/**: Bug fixes
- **docs/**: Documentation improvements
- **test/**: Test improvements
- **refactor/**: Refactoring

### 2. Branch Creation and Work

```bash
# Update to latest main branch
git checkout main
git pull origin main

# Create new feature branch
git checkout -b feature/your-feature-name

# Or bug fix branch
git checkout -b fix/issue-number-description
```

### 3. Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) style:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting, missing semicolons, etc.
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Build process, tool changes, etc.

**Examples:**

```bash
git commit -m "feat: add support for custom drawer animations"
git commit -m "fix: resolve drawer positioning issue on mobile"
git commit -m "docs: update API documentation for drawer options"
git commit -m "test: add unit tests for drawer context"
```

## 🎨 Coding Style

### TypeScript

- **Strict type checking**: Follow `strict: true` configuration
- **Explicit types**: Avoid using `any` type
- **Interface first**: Use `interface` for type definitions
- **Leverage generics**: Define reusable types

```typescript
// ✅ Good example
interface DrawerOptions {
  direction: "top" | "bottom" | "left" | "right";
  modal: boolean;
  onClose?: () => void;
}

// ❌ Bad example
const options: any = { direction: "bottom" };
```

### React

- **Functional components**: Use functional components over class components
- **Hooks usage**: Handle state management and side effects with hooks
- **Props type definition**: Define explicit types for all props

```typescript
// ✅ Good example
interface DrawerControllerProps {
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
}

const DrawerController: React.FC<DrawerControllerProps> = ({ isOpen, close, unmount }) => {
  // Component logic
};
```

### ESLint Rules

The project uses the following ESLint configuration:

- **@eslint/js/recommended**: Basic JavaScript rules
- **@typescript-eslint/recommended**: TypeScript rules
- **eslint-plugin-react-hooks**: React Hooks rules
- **eslint-plugin-react-refresh**: React Refresh rules

### Code Formatting

- **Prettier**: Automatic code formatting
- **Semicolons**: Required
- **Quotes**: Use single quotes
- **Indentation**: 2 spaces

## 🧪 Testing

### Test Structure

- **Unit tests** (`tests/unit/`): Individual function/component tests
- **Integration tests** (`tests/integration/`): Multi-component interaction tests
- **E2E tests** (`tests/e2e/`): Complete user flow tests

### Test Writing Guidelines

1. **Test file naming**: `*.test.ts` or `*.test.tsx`
2. **Test coverage**: Maintain minimum 80%
3. **Test descriptions**: Clear and specific test descriptions
4. **AAA pattern**: Arrange, Act, Assert structure

```typescript
// ✅ Good test example
describe('DrawerController', () => {
  it('should call onClose when close button is clicked', () => {
    // Arrange
    const mockOnClose = vi.fn();
    const { getByRole } = render(
      <DrawerController isOpen={true} close={mockOnClose} unmount={vi.fn()} />
    );

    // Act
    fireEvent.click(getByRole('button', { name: 'Close' }));

    // Assert
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific file tests
pnpm test drawer-api.test.ts

# Run with coverage
pnpm test:coverage

# Run with test UI
pnpm test:ui
```

## 📝 Pull Request Guidelines

### Pre-PR Checklist

- [ ] Code is synchronized with latest `main` branch
- [ ] All tests pass
- [ ] No linting errors
- [ ] Commit messages follow convention
- [ ] Tests added for changes
- [ ] Documentation updated if necessary

### PR Template

```markdown
## 📋 Changes

- [ ] New feature added
- [ ] Bug fix
- [ ] Documentation update
- [ ] Test added/modified
- [ ] Refactoring

## 🔍 Detailed Description

Please provide a detailed description of the changes.

## 🧪 Testing

- [ ] Existing tests pass
- [ ] New tests added
- [ ] Manual testing completed

## 📸 Screenshots (for UI changes)

Please attach before/after screenshots.

## 🔗 Related Issues

Closes #issue-number
```

### PR Review Process

1. **Automated checks**: CI/CD pipeline execution
2. **Code review**: Minimum 1 reviewer approval required
3. **Test passing**: All tests must pass
4. **Approval and merge**: Merge after reviewer approval

## 🐛 Issue Reporting

### Bug Report

If you find a bug, please include the following information:

```markdown
## 🐛 Bug Description

Simple and clear bug description

## 🔄 Reproduction Steps

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## 🎯 Expected Behavior

Describe what should happen

## 🚫 Actual Behavior

Describe what actually happened

## 📱 Environment Information

- OS: [e.g. iOS, Android, Windows, macOS]
- Browser: [e.g. Chrome, Safari, Firefox]
- Version: [e.g. 22]
- Drawer-Kit Version: [e.g. 1.0.0]

## 📸 Screenshots

Please attach screenshots if possible

## 📋 Additional Context

Add any other useful information
```

### Feature Request

When suggesting new features:

```markdown
## 🚀 Feature Request

Simple and clear feature description

## 💡 Motivation

Explain why this feature is needed

## 📋 Detailed Description

Detailed description of the feature

## 🎯 Use Cases

Explain how this feature would be used

## 🔄 Alternatives

Describe any alternative solutions you've considered
```

## 🎯 Types of Contributions

### Code Contributions

- **Bug fixes**: Fix bugs reported in issues
- **Feature additions**: Implement new features
- **Performance improvements**: Code optimization and performance enhancement
- **Refactoring**: Code quality improvements

### Documentation Contributions

- **README updates**: Improve project descriptions
- **API documentation**: Code comments and JSDoc writing
- **Example additions**: Usage examples and tutorials
- **Translation**: Multi-language support

### Test Contributions

- **Unit tests**: Individual function/component tests
- **Integration tests**: Component interaction tests
- **E2E tests**: Complete user flow tests
- **Test utilities**: Test helper functions

### Design Contributions

- **UI/UX improvements**: User interface improvements
- **Animations**: Smooth transition effects
- **Accessibility**: Web accessibility standards compliance
- **Responsive design**: Support for various screen sizes

## 📞 Support and Contact

- **Email**: jinseok9338@gmail.com
- **GitHub Issues**: [Issues page](https://github.com/jinseok9338/drawer-kit/issues)
- **GitHub Discussions**: [Discussions page](https://github.com/jinseok9338/drawer-kit/discussions)

## 📄 License

This project is licensed under the MIT License. Code you contribute will be distributed under the same license.

---

**Thank you!** We really appreciate your contribution to the Drawer-Kit project. Your contributions help make this a better library! 🎉
