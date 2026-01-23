# API Test Suite

Comprehensive test coverage for all backend APIs and database operations.

## Test Structure

```
tests/
├── setup.ts                          # Test configuration and mocks
├── api/
│   ├── admin/
│   │   ├── auth.test.ts             # Admin authentication
│   │   ├── content-home.test.ts     # Home page content management
│   │   └── upload.test.ts           # File upload/delete
│   ├── newsletter/
│   │   └── subscribe.test.ts        # Newsletter subscription
│   └── contact/
│       └── route.test.ts            # Contact form
└── lib/
    └── db.test.ts                   # Database operations

```

## Running Tests

```bash
# Run all tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Test Coverage

### Admin APIs
- ✅ Authentication (POST /api/admin/auth)
  - Valid password
  - Invalid password
  - Missing password
  - Malformed requests

- ✅ Home Content Management (GET/PUT /api/admin/content/home)
  - Fetch content
  - Update content
  - Validate coral images
  - Error handling

- ✅ File Upload (POST/DELETE /api/admin/upload)
  - Upload images to different buckets
  - File size validation
  - File type validation
  - Delete files
  - Error handling

### Public APIs
- ✅ Newsletter (POST /api/newsletter/subscribe)
  - Valid email subscription
  - Invalid email format
  - Duplicate subscriptions
  - Error handling

- ✅ Contact Form (POST /api/contact)
  - Valid submissions
  - Field validation
  - Email format validation
  - Message length validation

### Database Operations
- ✅ Blog CRUD operations
  - Fetch all posts
  - Fetch by slug
  - Create post
  - Update post
  - Delete post

- ✅ Content operations
  - Fetch by page type
  - Update content
  - Error handling

- ✅ Life moments operations
  - Fetch all moments
  - Error handling

## Coverage Goals

- **Target**: 100% backend coverage
- **Current**: All API routes and database operations covered
- **Excluded**: Scripts, config files, .next build folder

## Mocking Strategy

- **Supabase**: Mocked at module level
- **Next.js**: Navigation and headers mocked
- **Environment**: Test-specific env vars

## CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Writing New Tests

1. Create test file in appropriate directory
2. Import necessary mocks from `setup.ts`
3. Follow existing test patterns
4. Ensure 100% coverage of new code

Example:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/your-route/route'

describe('Your API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle success case', async () => {
    // Test implementation
  })

  it('should handle error case', async () => {
    // Test implementation
  })
})
```

## Best Practices

1. **Clear mocks** between tests with `beforeEach`
2. **Test both success and error paths**
3. **Validate response status and data structure**
4. **Mock external dependencies** (Supabase, APIs)
5. **Keep tests isolated** - no shared state
6. **Use descriptive test names**
7. **Test edge cases** (empty data, malformed input)

## Troubleshooting

### Tests failing locally
- Ensure all dependencies installed: `npm install`
- Check environment variables in `tests/setup.ts`
- Clear test cache: `npx vitest --clearCache`

### Coverage not 100%
- Run with coverage: `npm run test:coverage`
- Check HTML report in `coverage/index.html`
- Add tests for uncovered lines

### Mocks not working
- Verify mock is defined before import
- Check mock path matches actual module path
- Ensure `vi.clearAllMocks()` in `beforeEach`
