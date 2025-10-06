import axios from 'axios';
import { IpDriftClient, IpDriftError } from '../src';
import type { IpLookupResponse, HealthResponse, IpDriftConfig } from '../src/types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('IpDriftClient', () => {
  let client: IpDriftClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    
    // Mock the interceptor functions to simulate the actual behavior
    mockAxiosInstance.interceptors.request.use.mockImplementation((fn: any) => {
      // Simulate request interceptor adding API key
      return fn;
    });
    
    mockAxiosInstance.interceptors.response.use.mockImplementation((successFn: any, errorFn: any) => {
      // Store error handler for later use
      mockAxiosInstance._errorHandler = errorFn;
      return successFn;
    });
    
    const config: IpDriftConfig = {
      apiKey: 'test-api-key',
      baseUrl: 'https://geo.ipdrift.com',
      timeout: 10000,
    };

    client = new IpDriftClient(config);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create client with valid config', () => {
      expect(client).toBeInstanceOf(IpDriftClient);
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://geo.ipdrift.com',
        timeout: 10000,
        headers: {
          'User-Agent': 'ipdrift-client-js/1.0.0',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
    });

    it('should throw error if API key is missing', () => {
      expect(() => {
        new IpDriftClient({ apiKey: '' });
      }).toThrow('API key is required');
    });

    it('should use default base URL if not provided', () => {
      const clientWithDefaults = new IpDriftClient({ apiKey: 'test-key' });
      expect(clientWithDefaults.getConfig().baseUrl).toBe('https://geo.ipdrift.com');
    });
  });

  describe('lookup', () => {
    const mockIpResponse: IpLookupResponse = {
      ip: '8.8.8.8',
      type: 'ipv4',
      continent_code: 'NA',
      continent_name: 'North America',
      country_code: 'US',
      country_name: 'United States',
      region_code: 'CA',
      region_name: 'California',
      city: 'Mountain View',
      zip: '94043',
      latitude: 37.4056,
      longitude: -122.0775,
      location: {
        geoname_id: 5375480,
        capital: 'Washington D.C.',
        languages: [{ code: 'en', name: 'English', native: 'English' }],
        country_flag_emoji: '🇺🇸',
        country_flag_emoji_unicode: 'U+1F1FA U+1F1F8',
        calling_code: '1',
        is_eu: false,
      },
      time_zone: {
        id: 'America/Los_Angeles',
        current_time: '2025-09-20T08:36:38.951139-07:00',
        gmt_offset: -25200,
        code: 'PDT',
        is_daylight_saving: true,
      },
      currency: {
        code: 'USD',
        name: 'US Dollar',
        plural: 'US dollars',
        symbol: '$',
        symbol_native: '$',
      },
      connection: {
        asn: 15169,
        isp: 'GOOGLE',
        sld: 'google',
        tld: 'com',
        carrier: 'GOOGLE',
        home: false,
        organization_type: 'hosting',
      },
      security: {
        is_proxy: false,
        is_crawler: false,
        is_tor: false,
        threat_level: 'low',
        hosting_facility: true,
      },
    };

    it('should lookup IP successfully', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: mockIpResponse,
        status: 200,
        headers: {},
      });

      const result = await client.lookup({ ip: '8.8.8.8' });

      expect(result).toEqual(mockIpResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/lookup', {
        params: { ip: '8.8.8.8' },
      });
    });

    it('should lookup without IP parameter (client IP)', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: mockIpResponse,
        status: 200,
        headers: {},
      });

      const result = await client.lookup();

      expect(result).toEqual(mockIpResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/lookup', {
        params: {},
      });
    });

    it('should handle 400 Bad Request error', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { detail: 'Invalid IP address: not-an-ip' },
          headers: {},
        },
      };

      mockAxiosInstance.get.mockRejectedValue(errorResponse);

      await expect(client.lookup({ ip: 'not-an-ip' })).rejects.toThrow(IpDriftError);
    });

    it('should handle 401 Unauthorized error', async () => {
      const errorResponse = {
        response: {
          status: 401,
          data: { detail: 'Invalid or inactive API key' },
          headers: {},
        },
      };

      mockAxiosInstance.get.mockRejectedValue(errorResponse);

      await expect(client.lookup({ ip: '8.8.8.8' })).rejects.toThrow(IpDriftError);
    });

    it('should handle 429 Rate Limit error with rate limit info', async () => {
      const errorResponse = {
        response: {
          status: 429,
          data: { detail: 'Rate limit exceeded' },
          headers: {
            'x-ratelimit-limit': '120',
            'x-ratelimit-remaining': '0',
            'x-ratelimit-reset': '1634567890',
          },
        },
      };

      mockAxiosInstance.get.mockRejectedValue(errorResponse);

      await expect(client.lookup({ ip: '8.8.8.8' })).rejects.toThrow(IpDriftError);
    });
  });

  describe('health', () => {
    it('should check health successfully', async () => {
      const mockHealthResponse: HealthResponse = { ok: true };
      
      mockAxiosInstance.get.mockResolvedValue({
        data: mockHealthResponse,
        status: 200,
        headers: {},
      });

      const result = await client.health();

      expect(result).toEqual(mockHealthResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/health');
    });

    it('should handle health check failure', async () => {
      const errorResponse = {
        response: {
          status: 503,
          data: { detail: 'Service unavailable' },
          headers: {},
        },
      };

      mockAxiosInstance.get.mockRejectedValue(errorResponse);

      await expect(client.health()).rejects.toThrow(IpDriftError);
    });
  });

  describe('getConfig', () => {
    it('should return configuration without API key', () => {
      const config = client.getConfig();
      
      expect(config).toEqual({
        baseUrl: 'https://geo.ipdrift.com',
        timeout: 10000,
        retries: 3,
      });
      expect(config).not.toHaveProperty('apiKey');
    });
  });
});
