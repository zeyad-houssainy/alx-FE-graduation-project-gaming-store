# Gaming Store - Comprehensive Testing Guide

## Overview

This project includes a comprehensive testing suite using Jest and React Testing Library, covering all aspects of the application from unit tests to integration tests.

## Testing Stack

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing

## Test Structure

```
src/
├── __tests__/
│   └── integration/
│       └── userWorkflows.test.jsx     # End-to-end user workflows
├── components/
│   └── __tests__/
│       ├── GameCard.test.jsx          # Component unit tests
│       ├── SearchBar.test.jsx
│       ├── Button.test.jsx
│       └── Header/
│           └── Header.test.jsx
├── context/
│   └── __tests__/
│       ├── AuthContext.test.jsx       # Context provider tests
│       ├── CartContext.test.jsx
│       └── ThemeContext.test.jsx
├── hooks/
│   └── __tests__/
│       ├── useFetchGames.test.js      # Custom hook tests
│       └── useCountdown.test.js
├── pages/
│   └── __tests__/
│       ├── Games.test.jsx             # Page component tests
│       └── HomePage/
│           └── HomePage.test.jsx
└── services/
    └── __tests__/
        └── gamesApi.test.js           # API service tests
```

## Test Categories

### 1. Unit Tests

**Context Tests** (`src/context/__tests__/`)
- `AuthContext.test.jsx`: Authentication state management, login/logout, user data persistence
- `CartContext.test.jsx`: Shopping cart operations, item management, localStorage integration
- `ThemeContext.test.jsx`: Theme switching, system preference detection, persistence

**Component Tests** (`src/components/__tests__/`)
- `GameCard.test.jsx`: Game display, cart interactions, responsive behavior
- `SearchBar.test.jsx`: Search functionality, form submission, validation
- `Button.test.jsx`: Button variants, states, accessibility
- `Header.test.jsx`: Navigation, mobile menu, cart integration

**Hook Tests** (`src/hooks/__tests__/`)
- `useFetchGames.test.js`: API data fetching, error handling, parameter changes
- `useCountdown.test.js`: Timer functionality, date calculations, cleanup

**Service Tests** (`src/services/__tests__/`)
- `gamesApi.test.js`: API calls, local data fallback, error handling

### 2. Integration Tests

**Page Tests** (`src/pages/__tests__/`)
- `Games.test.jsx`: Full games page functionality, search, filter, pagination
- `HomePage.test.jsx`: Landing page, navigation, search integration

### 3. End-to-End Workflow Tests

**User Workflows** (`src/__tests__/integration/`)
- Complete shopping workflows
- Authentication flows
- Theme switching
- Search and filtering
- Cart management
- Error handling scenarios
- Responsive behavior

## Test Coverage

### Coverage Thresholds

The project maintains high code coverage standards:

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

### Coverage Reports

Generate coverage reports using:

```bash
npm run test:coverage
```

This creates detailed HTML reports in the `coverage/` directory.

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### CI Mode
```bash
npm run test:ci
```

### Specific Test Files
```bash
npm test -- --testPathPattern=AuthContext
npm test -- --testPathPattern=GameCard
npm test -- --testPathPattern=integration
```

## Test Features

### 1. Mocking Strategy

**API Mocking**: All external API calls are mocked to ensure tests are reliable and fast
**LocalStorage Mocking**: Browser APIs are mocked for consistent test environments
**Component Mocking**: Complex child components are mocked to focus on specific functionality

### 2. User Interaction Testing

Tests simulate real user interactions:
- Clicking buttons
- Typing in forms
- Navigating between pages
- Mobile menu interactions
- Keyboard navigation

### 3. Error Handling

Comprehensive error scenario testing:
- Network failures
- API errors
- Invalid data
- Browser API failures
- Edge cases

### 4. Accessibility Testing

Tests include accessibility checks:
- ARIA labels and roles
- Keyboard navigation
- Screen reader compatibility
- Focus management

### 5. Responsive Testing

Tests cover responsive behavior:
- Mobile menu functionality
- Responsive layouts
- Touch interactions
- Viewport changes

## Test Data

### Mock Data Structure

Tests use consistent mock data that mirrors production data:

```javascript
const mockGame = {
  id: 1,
  name: 'Test Game',
  price: 29.99,
  background_image: '/test.jpg',
  rating: 4.5,
  genre: 'Action',
  platforms: ['PC', 'PlayStation 5'],
  description: 'Test game description'
};
```

### Test Utilities

Common test utilities are provided for:
- Rendering components with providers
- Mocking user interactions
- Setting up test data
- Asserting component states

## Best Practices

### 1. Test Organization

- **Arrange, Act, Assert**: Clear test structure
- **Descriptive test names**: Tests explain what they verify
- **Grouped test cases**: Related tests are organized in describe blocks

### 2. Test Independence

- Each test is independent and can run in isolation
- Tests clean up after themselves
- No shared state between tests

### 3. Realistic Testing

- Tests simulate real user behavior
- Mock external dependencies appropriately
- Test error conditions and edge cases

### 4. Performance

- Tests run quickly (< 5 seconds for full suite)
- Efficient mocking reduces test complexity
- Parallel test execution where possible

## Debugging Tests

### Common Issues

1. **Async Operations**: Use `waitFor` for async state changes
2. **Component Updates**: Wrap state changes in `act()`
3. **Mock Cleanup**: Clear mocks between tests
4. **DOM Queries**: Use appropriate queries for better error messages

### Debug Commands

```bash
# Run specific test with debug output
npm test -- --testNamePattern="should login user" --verbose

# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Check coverage for specific files
npm run test:coverage -- --collectCoverageOnlyFrom=src/context/AuthContext.jsx
```

## Continuous Integration

Tests are configured to run in CI environments:

- **Fast execution**: Optimized for CI pipelines
- **No watch mode**: Uses `--watchAll=false`
- **Coverage reports**: Generates coverage data
- **Exit codes**: Proper exit codes for CI systems

## Adding New Tests

### Component Tests

1. Create test file: `ComponentName.test.jsx`
2. Import component and testing utilities
3. Mock external dependencies
4. Write test cases covering:
   - Rendering
   - User interactions
   - Props handling
   - Error states
   - Accessibility

### Integration Tests

1. Create test in appropriate directory
2. Set up full component tree
3. Mock external services
4. Test complete user workflows
5. Verify state persistence

### Example Test Template

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentName from '../ComponentName';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup mocks and test data
  });

  afterEach(() => {
    // Cleanup
  });

  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<ComponentName />);
    
    await user.click(screen.getByRole('button'));
    
    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
```

## Maintenance

### Regular Tasks

1. **Update snapshots**: When UI changes are intentional
2. **Review coverage**: Ensure coverage remains high
3. **Update mocks**: Keep mocks in sync with actual APIs
4. **Refactor tests**: Improve test clarity and performance

### Test Health Metrics

- **Coverage**: Maintain >70% coverage
- **Performance**: Full suite should run in <30 seconds
- **Reliability**: Tests should pass consistently
- **Maintainability**: Tests should be easy to understand and modify

This comprehensive testing setup ensures the Gaming Store application is reliable, maintainable, and provides an excellent user experience.
