// Test setup file
import axios from 'axios';

// Mock axios for testing
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Make axios available globally for tests
(global as any).mockedAxios = mockedAxios;

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Dummy test to satisfy Jest requirement
describe('Setup', () => {
  it('should be configured correctly', () => {
    expect(true).toBe(true);
  });
});
