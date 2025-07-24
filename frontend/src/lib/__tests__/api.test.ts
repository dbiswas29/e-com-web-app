import axios from 'axios';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
  post: jest.fn(),
}));

// Mock cookies-next
jest.mock('cookies-next', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true,
});

describe('ApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = '';
  });

  it('should create axios instance with correct configuration', () => {
    // Import the module to trigger constructor
    require('../api');
    
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should export apiClient instance', () => {
    const { apiClient } = require('../api');
    expect(apiClient).toBeDefined();
  });
});
