import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import {
  IpLookupResponse,
  HealthResponse,
  IpDriftConfig,
  LookupOptions,
  RateLimitInfo,
  IpDriftError,
} from './types';

/**
 * IPDrift API Client
 * 
 * Official JavaScript/TypeScript client for IPDrift IP geolocation API
 */
export class IpDriftClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly httpClient: AxiosInstance;
  private readonly timeout: number;
  private readonly retries: number;

  constructor(config: IpDriftConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required');
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://geo.ipdrift.com';
    this.timeout = config.timeout || 10000; // 10 seconds
    this.retries = config.retries || 3;

    // Create axios instance with default configuration
    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'User-Agent': config.userAgent || `ipdrift-client-js/1.0.0`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include API key
    this.httpClient.interceptors.request.use((config) => {
      config.params = {
        ...config.params,
        api_key: this.apiKey,
      };
      return config;
    });

    // Add response interceptor to handle errors and rate limiting
    this.httpClient.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        return this.handleError(error);
      }
    );
  }

  /**
   * Look up IP geolocation information
   * 
   * @param options - Lookup options including optional IP address
   * @returns Promise<IpLookupResponse> - Detailed IP information
   * 
   * @example
   * ```typescript
   * const client = new IpDriftClient({ apiKey: 'your-api-key' });
   * 
   * // Lookup specific IP
   * const result = await client.lookup({ ip: '8.8.8.8' });
   * console.log(result.country_name); // "United States"
   * 
   * // Lookup client's IP (no IP parameter)
   * const myIp = await client.lookup();
   * console.log(myIp.ip);
   * ```
   */
  async lookup(options: LookupOptions = {}): Promise<IpLookupResponse> {
    try {
      const params: Record<string, string> = {};
      
      if (options.ip) {
        params.ip = options.ip;
      }

      const response = await this.httpClient.get('/v1/lookup', { params });
      return response.data as IpLookupResponse;
    } catch (error) {
      if (error instanceof IpDriftError) {
        throw error;
      }
      throw new IpDriftError(
        'Failed to lookup IP address',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Check if the service is healthy and operational
   * 
   * @returns Promise<HealthResponse> - Health status
   * 
   * @example
   * ```typescript
   * const health = await client.health();
   * console.log(health.ok); // true
   * ```
   */
  async health(): Promise<HealthResponse> {
    try {
      const response = await this.httpClient.get('/health');
      return response.data as HealthResponse;
    } catch (error) {
      if (error instanceof IpDriftError) {
        throw error;
      }
      throw new IpDriftError(
        'Health check failed',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Get rate limit information from the last response
   * 
   * @param response - Axios response object
   * @returns RateLimitInfo | null - Rate limit information if available
   */
  private extractRateLimitInfo(response?: AxiosResponse): RateLimitInfo | null {
    if (!response?.headers) return null;

    const limit = response.headers['x-ratelimit-limit'];
    const remaining = response.headers['x-ratelimit-remaining'];
    const reset = response.headers['x-ratelimit-reset'];

    if (limit && remaining && reset) {
      return {
        limit: parseInt(limit, 10),
        remaining: parseInt(remaining, 10),
        reset: parseInt(reset, 10),
      };
    }

    return null;
  }

  /**
   * Handle HTTP errors and convert them to IpDriftError
   * 
   * @param error - Axios error object
   * @returns Promise rejection with IpDriftError
   */
  private handleError(error: AxiosError): Promise<never> {
    const response = error.response;
    const status = response?.status || 500;
    const rateLimit = this.extractRateLimitInfo(response);

    let message = 'An error occurred';
    let detail = error.message;

    if (response?.data && typeof response.data === 'object' && 'detail' in response.data) {
      detail = (response.data as any).detail;
    }

    switch (status) {
      case 400:
        message = 'Bad Request';
        break;
      case 401:
        message = 'Unauthorized - Invalid API key';
        break;
      case 403:
        message = 'Forbidden';
        break;
      case 404:
        message = 'Not Found';
        break;
      case 429:
        message = 'Rate Limit Exceeded';
        break;
      case 500:
        message = 'Internal Server Error';
        break;
      case 502:
        message = 'Bad Gateway';
        break;
      case 503:
        message = 'Service Unavailable';
        break;
      case 504:
        message = 'Gateway Timeout';
        break;
      default:
        message = `HTTP Error ${status}`;
    }

    const ipDriftError = new IpDriftError(message, status, detail, rateLimit || undefined);
    return Promise.reject(ipDriftError);
  }

  /**
   * Get the current configuration
   * 
   * @returns Partial configuration object (without API key for security)
   */
  getConfig(): Omit<IpDriftConfig, 'apiKey'> {
    return {
      baseUrl: this.baseUrl,
      timeout: this.timeout,
      retries: this.retries,
    };
  }
}
